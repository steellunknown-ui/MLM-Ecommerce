-- USERS TABLE
create table public.users (
  id uuid references auth.users primary key,
  full_name text not null,
  email text unique not null,
  phone text unique not null,
  referral_code text unique not null,
  referred_by uuid references public.users(id),
  sponsor_id uuid references public.users(id),
  level int default 1,
  rank text default 'Distributor',
  is_active boolean default false,
  is_admin boolean default false,
  joining_date timestamptz default now(),
  kyc_status text default 'pending',
  pan_number text,
  bank_account text,
  bank_ifsc text,
  bank_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- MLM NETWORK TREE
create table public.mlm_network (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) not null,
  parent_id uuid references public.users(id),
  sponsor_id uuid references public.users(id),
  level_in_network int not null default 1,
  position_path text,
  total_downline int default 0,
  direct_referrals int default 0,
  created_at timestamptz default now()
);

-- PRODUCTS
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price decimal(10,2) not null,
  bv decimal(10,2) not null,
  category text not null,
  image_url text,
  stock int default 100,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ORDERS
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid references public.users(id),
  status text default 'pending',
  total_amount decimal(10,2),
  total_bv decimal(10,2),
  payment_id text,
  payment_status text default 'pending',
  shipping_address jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ORDER ITEMS
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id),
  product_id uuid references public.products(id),
  quantity int not null,
  price decimal(10,2) not null,
  bv decimal(10,2) not null
);

-- COMMISSIONS
create table public.commissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  from_user_id uuid references public.users(id),
  type text not null, -- 'joining' or 'repurchase'
  level_earned int not null,
  amount decimal(10,2) not null,
  order_id uuid references public.orders(id),
  status text default 'pending', -- pending/approved/paid
  created_at timestamptz default now()
);

-- WALLET
create table public.wallet (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) unique,
  balance decimal(10,2) default 0,
  total_earned decimal(10,2) default 0,
  total_withdrawn decimal(10,2) default 0,
  updated_at timestamptz default now()
);

-- WALLET TRANSACTIONS
create table public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  type text not null, -- 'credit'/'debit'/'withdrawal'
  amount decimal(10,2) not null,
  description text,
  reference_id text,
  created_at timestamptz default now()
);

-- WITHDRAWALS
create table public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  amount decimal(10,2) not null,
  status text default 'pending',
  bank_details jsonb,
  admin_note text,
  created_at timestamptz default now(),
  processed_at timestamptz
);

-- RLS POLICIES

-- Enable RLS
alter table public.users enable row level security;
alter table public.mlm_network enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.commissions enable row level security;
alter table public.wallet enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.withdrawals enable row level security;

-- USERS: Users can read/update their own data
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

create policy "Admins can view all users" on public.users
  for select using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

create policy "Admins can update all users" on public.users
  for update using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

create policy "Anyone can insert user (via triggers usually)" on public.users
  for insert with check (true);

-- MLM_NETWORK: Users can view their own network info
create policy "Users can view own network" on public.mlm_network
  for select using (auth.uid() = user_id or auth.uid() = parent_id or auth.uid() = sponsor_id);

create policy "Admins can view all networks" on public.mlm_network
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

create policy "Anyone can insert mlm_network" on public.mlm_network
  for insert with check (true);

-- PRODUCTS: All authenticated users can read active products, Admins manage
create policy "Anyone can read active products" on public.products
  for select using (is_active = true);

create policy "Admins can manage products" on public.products
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

-- INSERT INITIAL PRODUCTS
INSERT INTO public.products (name, slug, price, bv, category, image_url) VALUES
('Merlin Tooth Brush', 'merlin-tooth-brush', 30, 24, 'Personal Care', '/products/placeholder.jpg'),
('Neem Soap 75gm', 'neem-soap-75gm', 40, 32, 'Personal Care', '/products/placeholder.jpg'),
('Amla Hair Oil 200ML', 'amla-hair-oil-200ml', 100, 80, 'Hair Care', '/products/placeholder.jpg'),
('Jasmine Hair Oil 200ML', 'jasmine-hair-oil-200ml', 100, 80, 'Hair Care', '/products/placeholder.jpg'),
('Herbal Hair Oil 100ML', 'herbal-hair-oil-100ml', 150, 120, 'Hair Care', '/products/placeholder.jpg'),
('Ghas Tail 100ML', 'ghas-tail-100ml', 180, 144, 'Hair Care', '/products/placeholder.jpg'),
('Black Monk 300gm', 'black-monk-300gm', 220, 176, 'Body Care', '/products/placeholder.jpg'),
('Pimple Cure Face Wash 60ML', 'pimple-cure-face-wash-60ml', 80, 64, 'Skin Care', '/products/placeholder.jpg'),
('Charcoal Face Wash 60ML', 'charcoal-face-wash-60ml', 100, 80, 'Skin Care', '/products/placeholder.jpg'),
('Herbal Shampoo 200ML', 'herbal-shampoo-200ml', 110, 88, 'Hair Care', '/products/placeholder.jpg'),
('Body Lotion 300ML', 'body-lotion-300ml', 180, 144, 'Body Care', '/products/placeholder.jpg'),
('Signature Black 200ML', 'signature-black-200ml', 225, 180, 'Body Care', '/products/placeholder.jpg'),
('Karck Sol 25GM', 'karck-sol-25gm', 80, 64, 'Skin Care', '/products/placeholder.jpg'),
('Summer Cool 150GM', 'summer-cool-150gm', 110, 88, 'Body Care', '/products/placeholder.jpg'),
('Lauki Oil 200ML', 'lauki-oil-200ml', 150, 120, 'Hair Care', '/products/placeholder.jpg'),
('Wonder 9 XL 10PCS', 'wonder-9-xl-10pcs', 70, 56, 'Feminine Care', '/products/placeholder.jpg'),
('Wonder 9 XL 20PCS', 'wonder-9-xl-20pcs', 120, 96, 'Feminine Care', '/products/placeholder.jpg'),
('Aloe Vera Gel 120ML', 'aloe-vera-gel-120ml', 140, 112, 'Skin Care', '/products/placeholder.jpg');

-- ORDERS: Users see own orders, Admins manage
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Users can insert own orders" on public.orders
  for insert with check (auth.uid() = user_id);

create policy "Users can update own orders" on public.orders
  for update using (auth.uid() = user_id);

create policy "Admins can manage orders" on public.orders
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

-- ORDER ITEMS: Users see own order items
create policy "Users can view own order items" on public.order_items
  for select using (
    exists (select 1 from public.orders where id = order_items.order_id and user_id = auth.uid())
  );

create policy "Users can insert own order items" on public.order_items
  for insert with check (
    exists (select 1 from public.orders where id = order_items.order_id and user_id = auth.uid())
  );

create policy "Admins can manage order items" on public.order_items
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

-- COMMISSIONS: Users see own commissions
create policy "Users can view own commissions" on public.commissions
  for select using (auth.uid() = user_id);

create policy "Admins can manage commissions" on public.commissions
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

create policy "Anyone can insert commissions" on public.commissions
  for insert with check (true);

create policy "Anyone can update commissions" on public.commissions
  for update using (true);

-- WALLET: Users see own wallet
create policy "Users can view own wallet" on public.wallet
  for select using (auth.uid() = user_id);

create policy "Admins can manage wallets" on public.wallet
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

create policy "Anyone can update wallets" on public.wallet
  for update using (true);
  
create policy "Anyone can insert wallets" on public.wallet
  for insert with check (true);

-- WALLET TRANSACTIONS: Users see own transactions
create policy "Users can view own wallet transactions" on public.wallet_transactions
  for select using (auth.uid() = user_id);

create policy "Admins can manage wallet transactions" on public.wallet_transactions
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );
  
create policy "Anyone can insert wallet transactions" on public.wallet_transactions
  for insert with check (true);

-- WITHDRAWALS: Users see own withdrawals
create policy "Users can view own withdrawals" on public.withdrawals
  for select using (auth.uid() = user_id);

create policy "Users can insert own withdrawals" on public.withdrawals
  for insert with check (auth.uid() = user_id);

create policy "Admins can manage withdrawals" on public.withdrawals
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );
