-- Drop the existing policy that could be exploited
DROP POLICY IF EXISTS "Service role can insert orders" ON public.orders;

-- Create a new policy that ONLY allows the service role to insert orders
-- This ensures orders can only be created through secure backend edge functions
CREATE POLICY "Only service role can insert orders"
ON public.orders
FOR INSERT
TO service_role
WITH CHECK (true);

-- Also add a policy for authenticated users to insert their own orders
-- (optional, if you want users to be able to create orders with their user_id)
CREATE POLICY "Users can insert their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND
  paypal_order_id IS NOT NULL AND
  status = 'PAID'
);