-- VIESA Reserve Pro - Future Features Extension Schema
-- Run this script in your Supabase SQL Editor to add the tables for the 4 new modules.

-- ==========================================
-- MODULE 1: POS & QR Ordering (F&B)
-- ==========================================
CREATE TABLE IF NOT EXISTS pos_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bed_id UUID REFERENCES beds(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'NEW', -- NEW, PREPARING, READY, DELIVERED
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pos_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES pos_orders(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- MODULE 2: Smart Waitlist
-- ==========================================
CREATE TABLE IF NOT EXISTS smart_waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  guest_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  preferred_zone VARCHAR(100), -- e.g., 'Front Row', 'VIP Cabana'
  status VARCHAR(50) NOT NULL DEFAULT 'WAITING', -- WAITING, NOTIFIED, COMPLETED, EXPIRED
  notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- MODULE 3: Yield Management (Dynamic Pricing)
-- ==========================================
CREATE TABLE IF NOT EXISTS yield_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  rule_name VARCHAR(255) NOT NULL, -- e.g., 'Sunny & Hot (+20%)'
  condition_type VARCHAR(50) NOT NULL, -- WEATHER, OCCUPANCY
  condition_operator VARCHAR(10) NOT NULL, -- >, <, =, IN
  condition_value VARCHAR(100) NOT NULL, -- e.g., '25' (degrees), 'SUNNY'
  action_type VARCHAR(50) NOT NULL, -- MULTIPLIER, FIXED_AMOUNT
  action_value DECIMAL(10, 2) NOT NULL, -- e.g., 1.20 (for 20% increase)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- MODULE 4: VIP Cabana Pre-Order Menu
-- ==========================================
CREATE TABLE IF NOT EXISTS vip_bottles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_emoji VARCHAR(10), -- e.g., '🍾', '🥂'
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- REALTIME SUBSCRIPTIONS
-- ==========================================
ALTER PUBLICATION supabase_realtime ADD TABLE pos_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE smart_waitlist;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) - Permissive for MVP
-- ==========================================
ALTER TABLE pos_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read/write on pos_orders" ON pos_orders FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE pos_order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read/write on pos_order_items" ON pos_order_items FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE smart_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read/write on smart_waitlist" ON smart_waitlist FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE yield_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read/write on yield_rules" ON yield_rules FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE vip_bottles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read/write on vip_bottles" ON vip_bottles FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- MOCK DATA FOR DEMO
-- ==========================================
-- Insert some bottles for the first venue (assuming first venue from schema.sql is 00000000-0000-0000-0000-000000000000)
INSERT INTO vip_bottles (venue_id, name, price, image_emoji) VALUES 
('00000000-0000-0000-0000-000000000000', 'Moët & Chandon Ice', 140.00, '🍾'),
('00000000-0000-0000-0000-000000000000', 'Dom Pérignon Luminous', 350.00, '🥂'),
('00000000-0000-0000-0000-000000000000', 'Grey Goose (1.5L)', 380.00, '🍸'),
('00000000-0000-0000-0000-000000000000', 'Don Julio 1942', 450.00, '🥃');

INSERT INTO yield_rules (venue_id, rule_name, condition_type, condition_operator, condition_value, action_type, action_value) VALUES
('00000000-0000-0000-0000-000000000000', 'Zonnig & Warm (>25C)', 'WEATHER_TEMP', '>', '25', 'MULTIPLIER', 1.20),
('00000000-0000-0000-0000-000000000000', 'Bewolkt/Regen (<20C)', 'WEATHER_TEMP', '<', '20', 'MULTIPLIER', 0.85);
