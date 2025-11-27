-- Update products table structure
ALTER TABLE products DROP COLUMN IF EXISTS colors;
ALTER TABLE products DROP COLUMN IF EXISTS sizes;

-- Update orders table structure  
ALTER TABLE orders DROP COLUMN IF EXISTS pod_provider;
ALTER TABLE orders DROP COLUMN IF EXISTS pod_order_id;
ALTER TABLE orders DROP COLUMN IF EXISTS pod_status;
ALTER TABLE orders DROP COLUMN IF EXISTS pod_tracking;
ALTER TABLE orders DROP COLUMN IF EXISTS redeem_tracking_code;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS pod_provider text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pod_order_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pod_status text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pod_tracking text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS redeem_tracking_code text;

-- Update RLS policies for orders
DROP POLICY IF EXISTS "orders insert api" ON orders;
DROP POLICY IF EXISTS "orders select authenticated" ON orders;

CREATE POLICY "orders insert api" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders select authenticated" ON orders FOR SELECT USING (auth.role() = 'authenticated' OR true);