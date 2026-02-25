
-- Add colors, sizes, and price_php columns to products table
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS colors text[] DEFAULT ARRAY['Black', 'White'],
  ADD COLUMN IF NOT EXISTS sizes text[] DEFAULT ARRAY['S', 'M', 'L', 'XL'],
  ADD COLUMN IF NOT EXISTS price_php numeric DEFAULT 0;
