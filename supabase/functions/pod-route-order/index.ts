import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// SKU to Printful mapping
const SKU_MAPPING: Record<string, any> = {
  "RWCT001": { "PRINTFUL": { "variant_id": 12345 } },
  "RWCH001": { "PRINTFUL": { "variant_id": 22345 } },
  "RWCC001": { "PRINTFUL": { "variant_id": 32345 } }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order_id, shipping = {}, items = [] } = await req.json();
    
    if (!order_id) {
      return new Response(
        JSON.stringify({ error: 'order_id required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Load order from Supabase
    const { data: orderRows, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .or(`paypal_order_id.eq.${order_id},redeem_tracking_code.eq.RWC-PAYPAL-${order_id}`)
      .limit(1);

    if (fetchError || !orderRows || orderRows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const order = orderRows[0];

    // Check if order contains only test items - skip Printful for test orders
    const orderItems = order.items || [];
    const hasOnlyTestItems = orderItems.every((item: any) => 
      item.sku?.startsWith('TEST') || item.name?.toLowerCase().includes('test')
    );

    if (hasOnlyTestItems) {
      console.log('Test order detected - skipping Printful fulfillment');
      
      await supabase
        .from('orders')
        .update({
          pod_provider: 'TEST_SKIP',
          pod_order_id: 'TEST-NO-FULFILLMENT',
          pod_status: 'TEST_COMPLETE'
        })
        .eq('paypal_order_id', order_id);

      return new Response(
        JSON.stringify({ ok: true, message: 'Test order - Printful skipped', test: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build Printful payload
    const pfItems = (order.items || []).map((item: any) => {
      const mapping = SKU_MAPPING[item.sku];
      const variantId = mapping?.PRINTFUL?.variant_id;
      return { variant_id: variantId, quantity: item.qty };
    });

    const payload = {
      recipient: {
        name: shipping.name || order.customer_email || 'Customer',
        address1: shipping.address1 || '',
        city: shipping.city || '',
        state_code: shipping.state || '',
        country_code: shipping.country || 'US',
        zip: shipping.postal_code || ''
      },
      items: pfItems,
      external_id: order_id
    };

    console.log('Sending order to Printful:', payload);

    try {
      const printfulKey = Deno.env.get('PRINTFUL_API_KEY');
      
      const response = await fetch('https://api.printful.com/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${printfulKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const podOrderId = data?.result?.id || null;
      const podStatus = data?.result?.status || 'SUBMITTED';

      console.log('Printful response:', data);

      await supabase
        .from('orders')
        .update({
          pod_provider: 'PRINTFUL',
          pod_order_id: podOrderId,
          pod_status: podStatus
        })
        .eq('paypal_order_id', order_id);

      return new Response(
        JSON.stringify({ ok: true, podOrderId, response: data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      console.error('Printful order error:', error);
      
      await supabase
        .from('orders')
        .update({ pod_status: 'ERROR_PRINTFUL' })
        .eq('paypal_order_id', order_id);

      return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('POD route error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
