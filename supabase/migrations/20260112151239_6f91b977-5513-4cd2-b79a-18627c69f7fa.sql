-- Fix products policies to use authenticated for write operations
DROP POLICY IF EXISTS "authenticated delete products" ON public.products;
DROP POLICY IF EXISTS "authenticated insert products" ON public.products;
DROP POLICY IF EXISTS "authenticated update products" ON public.products;

-- Only admins can modify products
CREATE POLICY "Admins can insert products" 
ON public.products 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete products" 
ON public.products 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure products can still be read publicly (this is intentional for shop)
DROP POLICY IF EXISTS "public select products" ON public.products;
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
TO public
USING (true);