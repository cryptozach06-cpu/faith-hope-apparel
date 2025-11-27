const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { cart, return_url, cancel_url } = await req.json();
    
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Cart required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const total = cart.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.qty || 1), 0).toFixed(2);
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
        items: cart.map((item: any) => ({
          name: item.name,
          unit_amount: { currency_code: 'USD', value: (item.price || 0).toFixed(2) },
          quantity: (item.qty || 1).toString()
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
    console.log('PayPal order created:', data);

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Create PayPal order error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
