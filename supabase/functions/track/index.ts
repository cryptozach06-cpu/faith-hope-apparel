import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema - only alphanumeric and hyphens allowed
const OrderIdSchema = z.string().min(1).max(100).regex(/^[a-zA-Z0-9\-]+$/, 'Invalid order ID format');

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

    // Validate order ID format
    const parseResult = OrderIdSchema.safeParse(orderId);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid order ID format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validatedOrderId = parseResult.data;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Sanitize ID for query - remove RWC- prefix if present
    const id = validatedOrderId.replace(/^RWC-/, '');
    
    const { data, error } = await supabase
      .from('orders')
      .select('id, redeem_tracking_code, paypal_order_id, pod_status, status, pod_tracking')
      .or(`redeem_tracking_code.eq.${validatedOrderId},paypal_order_id.eq.${id}`)
      .limit(1);

    if (error || !data || data.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const order = data[0];
    
    // Only return public-safe tracking information
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
      JSON.stringify({ error: 'Unable to retrieve order status' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
