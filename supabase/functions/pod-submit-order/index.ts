import "jsr:@supabase/functions-js/edge-runtime.d.ts";
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
    const { orderId } = await req.json();
    
    console.log('Submitting POD order for:', orderId);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch order details
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      throw new Error('Order not found');
    }

    // Determine POD provider based on items (example logic)
    const items = order.items as any[];
    let podProvider = 'printful'; // default
    
    // You can add logic here to choose provider based on product category
    // For now, we'll use Printful as default

    const PRINTFUL_API_KEY = Deno.env.get('PRINTFUL_API_KEY');
    
    if (!PRINTFUL_API_KEY) {
      console.warn('POD API keys not configured, skipping POD submission');
      return new Response(
        JSON.stringify({ message: 'POD not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Submit to Printful (example)
    const printfulResponse = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: {
          email: order.customer_email,
        },
        items: items.map((item: any) => ({
          sync_variant_id: item.sku, // This should map to Printful variant ID
          quantity: item.qty,
        })),
      }),
    });

    const printfulData = await printfulResponse.json();
    
    if (!printfulResponse.ok) {
      throw new Error(`Printful API error: ${JSON.stringify(printfulData)}`);
    }

    console.log('Printful order created:', printfulData.result.id);

    // Update order with POD details
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        pod_provider: podProvider,
        pod_order_id: printfulData.result.id.toString(),
        pod_status: 'submitted',
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Database update error:', updateError);
    }

    return new Response(
      JSON.stringify({ success: true, podOrderId: printfulData.result.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('POD submission error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
