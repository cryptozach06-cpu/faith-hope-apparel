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

const sendOrderConfirmation = async (toEmail: string, orderRow: any) => {
  const sendgridKey = Deno.env.get('SENDGRID_API_KEY');
  if (!sendgridKey) return;

  const supportEmail = Deno.env.get('SUPPORT_EMAIL') || 'support@redeemedwearclothing.com';
  
  const msg = {
    personalizations: [{
      to: [{ email: toEmail || supportEmail }],
      subject: `RedeemedWear Order Confirmation — ${orderRow.redeem_tracking_code}`,
    }],
    from: { email: supportEmail },
    content: [{
      type: 'text/html',
      value: `<p>Thank you for your order. Your RedeemedWear order code is <strong>${orderRow.redeem_tracking_code}</strong>.</p>
              <p>We will notify you when your order ships. For questions, reply to ${supportEmail}.</p>
              <pre>${JSON.stringify(orderRow.items, null, 2)}</pre>`
    }]
  };

  try {
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(msg),
    });
    console.log('Order confirmation email sent');
  } catch (error) {
    console.error('SendGrid error:', error);
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

    let insertedOrder = null;
    try {
      const total = (cart || []).reduce((sum: number, item: any) => sum + (item.price || 0) * (item.qty || 1), 0);
      
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          paypal_order_id: orderID,
          customer_email: payer?.email_address || captureData?.payer?.email_address || null,
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

    // Send confirmation email
    if (insertedOrder) {
      try {
        await sendOrderConfirmation(insertedOrder.customer_email, insertedOrder);
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
