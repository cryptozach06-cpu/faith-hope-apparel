import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Printful v1 uses HMAC SHA1 for signature verification
async function computeHmacSha1(secret: string, rawBody: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const sendShippingEmail = async (toEmail: string, trackingCode: string, trackingNumber: string) => {
  const sendgridKey = Deno.env.get('SENDGRID_API_KEY');
  if (!sendgridKey) return;

  const supportEmail = Deno.env.get('SUPPORT_EMAIL') || 'support@redeemedwearclothing.com';
  
  const msg = {
    personalizations: [{
      to: [{ email: toEmail || supportEmail }],
      subject: `RedeemedWear Order Shipped — ${trackingCode || 'Order'}`,
    }],
    from: { email: supportEmail },
    content: [{
      type: 'text/html',
      value: `<p>Your RedeemedWear order <strong>${trackingCode}</strong> has shipped.</p>
              <p>Tracking number: <strong>${trackingNumber}</strong></p>
              <p>Thank you for buying from RedeemedWear.</p>`
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
    console.log('Shipping notification email sent');
  } catch (error) {
    console.error('SendGrid shipping email error:', error);
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.text();
    // Printful v1 uses X-Printful-Signature header
    const providedSig = req.headers.get('X-Printful-Signature') || req.headers.get('x-printful-signature') || '';
    
    // Verify webhook signature using HMAC SHA1
    const webhookSecret = Deno.env.get('PRINTFUL_WEBHOOK_SECRET');
    if (webhookSecret) {
      try {
        const computed = await computeHmacSha1(webhookSecret, rawBody);
        
        if (!providedSig || computed !== providedSig) {
          console.error('Invalid Printful webhook signature', { providedSig, computed });
          return new Response(
            JSON.stringify({ error: 'Invalid signature' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        console.log('Printful webhook signature verified successfully');
      } catch (error) {
        console.error('Signature verify error:', error);
        return new Response(
          JSON.stringify({ error: 'Signature verification failed' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      console.warn('PRINTFUL_WEBHOOK_SECRET not set — webhook signature NOT verified');
    }

    const event = JSON.parse(rawBody);
    console.log('Printful webhook event:', event);

    if (event && event.type && event.data) {
      const data = event.data;
      const pfOrderId = data.id || data.order?.id || null;
      const tracking = data.dispatch?.tracking_number || data.shipments?.[0]?.tracking_number || null;
      const status = data.status || data.order?.status || null;

      if (pfOrderId) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase
          .from('orders')
          .update({
            pod_status: status || 'updated',
            pod_tracking: tracking
          })
          .eq('pod_order_id', String(pfOrderId));

        // Send shipping notification email if tracking present
        if (tracking) {
          const { data: orderRows } = await supabase
            .from('orders')
            .select('*')
            .eq('pod_order_id', String(pfOrderId))
            .limit(1);

          const order = orderRows?.[0];
          if (order) {
            await sendShippingEmail(
              order.customer_email,
              order.redeem_tracking_code,
              tracking
            );
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook Printful error:', error);
    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
