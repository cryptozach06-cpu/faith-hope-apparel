-- Add user_id column to orders for proper RLS
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- Drop the existing email-based policy that exposes data
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Create new secure policy using user_id
CREATE POLICY "Users can view their own orders by user_id" 
ON public.orders 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  has_role(auth.uid(), 'admin'::app_role)
);