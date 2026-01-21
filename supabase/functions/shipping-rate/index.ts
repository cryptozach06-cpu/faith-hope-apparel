import { z } from 'zod';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const ShippingRateSchema = z.object({
  country: z.string().min(2).max(3).default('US'),
  weightKg: z.number().positive().max(100).default(1),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check content length to prevent oversized payloads
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1000) {
      return new Response(
        JSON.stringify({ error: 'Payload too large' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let body = {};
    try {
      body = await req.json();
    } catch {
      // Allow empty body, use defaults
    }

    // Validate input with zod
    const parseResult = ShippingRateSchema.safeParse(body);
    if (!parseResult.success) {
      console.log('Validation failed:', parseResult.error.errors);
      return new Response(
        JSON.stringify({ error: 'Invalid request data', details: parseResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { country, weightKg } = parseResult.data;
    
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
