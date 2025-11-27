-- Products table
CREATE TABLE IF NOT EXISTS products (
  id bigserial primary key,
  sku text unique not null,
  name text not null,
  category text not null,
  price_usd numeric not null,
  sizes text[],
  colors text[],
  images text[],
  stock int default 0,
  description text,
  created_at timestamptz default now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public select products" ON products FOR SELECT USING (true);
CREATE POLICY "authenticated insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "authenticated update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id bigserial primary key,
  stripe_session_id text unique,
  customer_email text,
  total numeric,
  items jsonb,
  created_at timestamptz default now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "select orders (admin)" ON orders FOR SELECT USING (auth.role() = 'authenticated');

-- Profiles table for admin metadata
CREATE TABLE IF NOT EXISTS profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (new.id, new.email, false);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();