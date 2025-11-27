const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { country = 'US', weightKg = 1 } = await req.json();
    
    console.log('Calculating shipping rate:', { country, weightKg });

    // Simple mocked logic
    const base = 5.0;
    const perKg = 2.5;
    const rate = base + perKg * weightKg + (country === 'PH' ? 3 : 0);

    return new Response(
      JSON.stringify({ country, weightKg, rate }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Shipping rate error:', error);
    return new Response(
      JSON.stringify({ error: 'Shipping rate calculation error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
