import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

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

// Input validation schemas
const ShippingSchema = z.object({
  name: z.string().max(200).optional(),
  address1: z.string().max(300).optional(),
  address2: z.string().max(300).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  postal_code: z.string().max(20).optional(),
}).optional();

const CartItemSchema = z.object({
  sku: z.string().max(50).optional(),
  name: z.string().max(200).optional(),
  price: z.number().optional(),
  qty: z.number().int().positive().max(100).default(1),
}).passthrough();

const RouteOrderSchema = z.object({
  order_id: z.string().min(1).max(100),
  shipping: ShippingSchema,
  items: z.array(CartItemSchema).max(50).optional(),
});

// Verify this is a service role call (internal only)
const verifyServiceRole = (req: Request): boolean => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.replace('Bearer ', '');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  // Only allow service role key for this endpoint
  return token === serviceRoleKey;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify this is an internal service role call
    if (!verifyServiceRole(req)) {
      console.log('Unauthorized attempt to access pod-route-order');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Service role required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input with zod
    const parseResult = RouteOrderSchema.safeParse(body);
    if (!parseResult.success) {
      console.log('Validation failed:', parseResult.error.errors);
      return new Response(
        JSON.stringify({ error: 'Invalid request data', details: parseResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { order_id, shipping = {} } = parseResult.data;

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

    // Build Printful payload with sanitized data
    const pfItems = (order.items || []).map((item: any) => {
      const sku = typeof item.sku === 'string' ? item.sku.substring(0, 50) : '';
      const mapping = SKU_MAPPING[sku];
      const variantId = mapping?.PRINTFUL?.variant_id;
      return { variant_id: variantId, quantity: Math.min(item.qty || 1, 100) };
    });

    // Sanitize shipping data
    const sanitizedShipping = {
      name: typeof shipping.name === 'string' ? shipping.name.substring(0, 200) : order.customer_email || 'Customer',
      address1: typeof shipping.address1 === 'string' ? shipping.address1.substring(0, 300) : '',
      city: typeof shipping.city === 'string' ? shipping.city.substring(0, 100) : '',
      state_code: typeof shipping.state === 'string' ? shipping.state.substring(0, 100) : '',
      country_code: typeof shipping.country === 'string' ? shipping.country.substring(0, 100) : 'US',
      zip: typeof shipping.postal_code === 'string' ? shipping.postal_code.substring(0, 20) : ''
    };

    const payload = {
      recipient: sanitizedShipping,
      items: pfItems,
      external_id: order_id
    };

    console.log('Sending order to Printful:', { external_id: order_id, itemCount: pfItems.length });

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

      console.log('Printful response status:', podStatus);

      await supabase
        .from('orders')
        .update({
          pod_provider: 'PRINTFUL',
          pod_order_id: podOrderId,
          pod_status: podStatus
        })
        .eq('paypal_order_id', order_id);

      return new Response(
        JSON.stringify({ ok: true, podOrderId, status: podStatus }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      console.error('Printful order error:', error);
      
      await supabase
        .from('orders')
        .update({ pod_status: 'ERROR_PRINTFUL' })
        .eq('paypal_order_id', order_id);

      return new Response(
        JSON.stringify({ error: 'Failed to submit to fulfillment provider' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('POD route error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
