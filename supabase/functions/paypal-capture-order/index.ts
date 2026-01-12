import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getAccessToken = async () => {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
  const auth = btoa(`${clientId}:${clientSecret}`);
  const apiBase = Deno.env.get('PAYPAL_API') || 'https://api-m.sandbox.paypal.com';
  
  const response = await fetch(`${apiBase}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  
  const data = await response.json();
  return data.access_token;
};

// Send order confirmation email using Mailgun (customer_email passed in-memory, not stored in DB)
const sendOrderConfirmation = async (toEmail: string, orderRow: any) => {
  const mailgunKey = Deno.env.get('MAILGUN_API_KEY');
  const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN');
  if (!mailgunKey || !mailgunDomain || !toEmail) {
    console.log('Skipping email - missing config or email address');
    return;
  }

  const supportEmail = 'support@redeemedwearclothing.com';
  
  const formData = new FormData();
  formData.append('from', `RedeemedWear <noreply@${mailgunDomain}>`);
  formData.append('to', toEmail);
  formData.append('subject', `Order Confirmation — ${orderRow.redeem_tracking_code}`);
  formData.append('html', `
    <p>Thank you for your order!</p>
    <p>Your RedeemedWear order code is <strong>${orderRow.redeem_tracking_code}</strong>.</p>
    <p>We will notify you when your order ships. For questions, contact ${supportEmail}.</p>
    <h3>Order Details:</h3>
    <pre>${JSON.stringify(orderRow.items, null, 2)}</pre>
  `);

  try {
    const response = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${mailgunKey}`)}`,
      },
      body: formData,
    });
    const result = await response.text();
    console.log('Order confirmation email sent:', result);
  } catch (error) {
    console.error('Mailgun error:', error);
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Invalid method' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { orderID, cart, shipping, payer } = await req.json();
    
    if (!orderID) {
      return new Response(
        JSON.stringify({ error: 'orderID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = await getAccessToken();
    const apiBase = Deno.env.get('PAYPAL_API') || 'https://api-m.sandbox.paypal.com';

    const response = await fetch(`${apiBase}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const captureData = await response.json();
    console.log('PayPal capture response:', captureData);

    // Record in Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get email from payer data (in-memory only, not stored in DB for privacy)
    const customerEmail = payer?.email_address || captureData?.payer?.email_address || null;
    
    let insertedOrder = null;
    try {
      const total = (cart || []).reduce((sum: number, item: any) => sum + (item.price || 0) * (item.qty || 1), 0);
      
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          paypal_order_id: orderID,
          user_id: null, // Will be linked when user logs in
          total: total,
          items: cart || [],
          status: 'PAID',
          redeem_tracking_code: `RWC-PAYPAL-${orderID}`
        }])
        .select()
        .single();

      if (error) throw error;
      insertedOrder = data;
      console.log('Order saved to database:', insertedOrder);
    } catch (error) {
      console.error('Supabase insert error:', error);
    }

    // Send confirmation email using in-memory email (not from DB)
    if (insertedOrder && customerEmail) {
      try {
        await sendOrderConfirmation(customerEmail, insertedOrder);
      } catch (error) {
        console.error('Email send error:', error);
      }
    }

    // Trigger Printful order via pod-route-order endpoint
    try {
      const publicUrl = Deno.env.get('SUPABASE_URL');
      await fetch(`${publicUrl}/functions/v1/pod-route-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderID, shipping: shipping || {}, items: cart || [] })
      });
      console.log('POD route triggered');
    } catch (error) {
      console.error('POD route call error:', error);
    }

    return new Response(
      JSON.stringify({ captured: true, capture: captureData }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Capture PayPal order error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
