-- Drop existing tables and create new PayPal-based schema
drop table if exists products cascade;
create table products (
  id bigserial primary key,
  sku text unique,
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
alter table products enable row level security;
create policy "public select products" on products for select using (true);
create policy "authenticated insert products" on products for insert with check (auth.role() = 'authenticated');
create policy "authenticated update products" on products for update using (auth.role() = 'authenticated');
create policy "authenticated delete products" on products for delete using (auth.role() = 'authenticated');

drop table if exists orders cascade;
create table orders (
  id bigserial primary key,
  paypal_order_id text unique,
  customer_email text,
  total numeric,
  items jsonb,
  status text,
  redeem_tracking_code text,
  pod_provider text,
  pod_order_id text,
  pod_status text,
  pod_tracking text,
  created_at timestamptz default now()
);
alter table orders enable row level security;
create policy "orders insert webhook" on orders for insert with check (true);
create policy "orders select admin" on orders for select using (auth.role() = 'authenticated');

drop table if exists profiles cascade;
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_admin boolean default false,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "profiles select auth" on profiles for select using (auth.role() = 'authenticated');
create policy "profiles insert" on profiles for insert with check (auth.uid() = id);