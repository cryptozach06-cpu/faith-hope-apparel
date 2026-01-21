import { z } from 'zod';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schemas
const CartItemSchema = z.object({
  sku: z.string().max(50).optional(),
  name: z.string().max(200),
  price: z.number().positive().max(10000),
  qty: z.number().int().positive().max(100).default(1),
});

const CreateOrderSchema = z.object({
  cart: z.array(CartItemSchema).min(1).max(50),
  return_url: z.string().url().max(500).optional(),
  cancel_url: z.string().url().max(500).optional(),
});

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

    // Check content length to prevent oversized payloads
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 50000) {
      return new Response(
        JSON.stringify({ error: 'Payload too large' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
    const parseResult = CreateOrderSchema.safeParse(body);
    if (!parseResult.success) {
      console.log('Validation failed:', parseResult.error.errors);
      return new Response(
        JSON.stringify({ error: 'Invalid request data', details: parseResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { cart, return_url, cancel_url } = parseResult.data;

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);
    const token = await getAccessToken();
    const apiBase = Deno.env.get('PAYPAL_API') || 'https://api-m.sandbox.paypal.com';
    const publicUrl = Deno.env.get('PUBLIC_URL') || 'https://redeemedwearclothing.com';

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: total,
          breakdown: {
            item_total: { currency_code: 'USD', value: total }
          }
        },
        items: cart.map((item) => ({
          name: item.name.substring(0, 127), // PayPal name limit
          unit_amount: { currency_code: 'USD', value: item.price.toFixed(2) },
          quantity: item.qty.toString()
        }))
      }],
      application_context: {
        return_url: return_url || `${publicUrl}/cart?success=true`,
        cancel_url: cancel_url || `${publicUrl}/cart?canceled=true`
      }
    };

    const response = await fetch(`${apiBase}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await response.json();
    console.log('PayPal order created:', data.id);

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Create PayPal order error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create order' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
