const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const printfulKey = Deno.env.get('PRINTFUL_API_KEY');
    
    if (!printfulKey) {
      return new Response(
        JSON.stringify({ 
          error: 'PRINTFUL_API_KEY not configured',
          status: 'FAILED',
          action: 'Check API credentials'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Test API by fetching sync products (uses store products scope)
    const response = await fetch('https://api.printful.com/sync/products?limit=1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${printfulKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log('Printful API response:', JSON.stringify(data));

    if (response.ok) {
      const products = data.result || [];
      return new Response(
        JSON.stringify({
          action: 'Retrieve sync products',
          status: 'SUCCESS',
          http_status: response.status,
          product_count: products.length,
          products: products.slice(0, 3).map((p: any) => ({ id: p.id, name: p.name })),
          response: data
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({
          action: 'Retrieve sync products',
          status: 'FAILED',
          http_status: response.status,
          error: data.error?.message || data.message || 'Unknown error',
          response: data
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Printful test error:', error);
    return new Response(
      JSON.stringify({ 
        action: 'Retrieve sync products',
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
