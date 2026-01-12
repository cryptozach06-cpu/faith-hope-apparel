-- Remove customer_email from orders to prevent PII exposure via client queries
ALTER TABLE public.orders
  DROP COLUMN IF EXISTS customer_email;

-- Tighten user-facing order read policy to authenticated users only
DROP POLICY IF EXISTS "Users can view their own orders by user_id" ON public.orders;
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Tighten service role insert policy with basic validation to reduce abuse risk if key is compromised
DROP POLICY IF EXISTS "Service role can insert orders" ON public.orders;
CREATE POLICY "Service role can insert orders"
ON public.orders
FOR INSERT
TO service_role
WITH CHECK (
  paypal_order_id IS NOT NULL
  AND paypal_order_id <> ''
  AND redeem_tracking_code IS NOT NULL
  AND redeem_tracking_code LIKE 'RWC-PAYPAL-%'
  AND status = 'PAID'
  AND total IS NOT NULL
  AND total >= 0
  AND items IS NOT NULL
  AND user_id IS NULL
);
