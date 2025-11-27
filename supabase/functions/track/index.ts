import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get('order');

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'order param required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const id = orderId.replace(/^RWC-/, '');
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .or(`redeem_tracking_code.eq.${orderId},paypal_order_id.eq.${id}`)
      .limit(1);

    if (error || !data || data.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const order = data[0];
    
    const publicPayload = {
      order: order.redeem_tracking_code || `RWC-PAYPAL-${order.paypal_order_id}`,
      status: order.pod_status || order.status || 'Processing',
      tracking_number: order.pod_tracking ? `RW-TRACK-${order.id}` : null,
      note: 'Shipped from a RedeemedWear fulfillment facility.'
    };

    return new Response(
      JSON.stringify(publicPayload),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Track error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
