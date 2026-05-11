-- VIESA Reserve: Pro Beach Club & Hotel Features
-- Run this in your Supabase SQL Editor to add these new features.

-- 1. WEATHER & VENUE ALERTS
ALTER TABLE venues ADD COLUMN IF NOT EXISTS weather_status VARCHAR(50) DEFAULT 'SUNNY';
ALTER TABLE venues ADD COLUMN IF NOT EXISTS weather_alert_message TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS is_closed_due_to_weather BOOLEAN DEFAULT false;

-- 2. DYNAMIC PRICING & YIELD MANAGEMENT
-- Allows multiplying all prices by e.g. 1.2x on busy days
ALTER TABLE venues ADD COLUMN IF NOT EXISTS dynamic_pricing_multiplier DECIMAL(3,2) DEFAULT 1.00;

-- 3. STAFF & WAITER ASSIGNMENT
-- Assign a waiter to a specific area or even a specific bed
ALTER TABLE areas ADD COLUMN IF NOT EXISTS assigned_waiter VARCHAR(100);
ALTER TABLE beds ADD COLUMN IF NOT EXISTS assigned_waiter VARCHAR(100);
ALTER TABLE beds ADD COLUMN IF NOT EXISTS features TEXT[]; -- e.g. ['UMBRELLA', 'SAFE_BOX', 'TOWELS']

-- 4. RESERVATIONS & NO-SHOW POLICY (VIP & STANDARD)
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bed_id UUID REFERENCES beds(id) ON DELETE CASCADE,
  guest_name VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(50),
  guest_email VARCHAR(255),
  reservation_date DATE NOT NULL,
  arrival_time TIME,
  party_size INTEGER DEFAULT 1,
  pre_orders TEXT[], -- e.g., ['Moët & Chandon', 'Fruit Platter']
  status VARCHAR(50) DEFAULT 'CONFIRMED', -- 'CONFIRMED', 'CHECKED_IN', 'NO_SHOW', 'COMPLETED'
  vip_status BOOLEAN DEFAULT false,
  auto_release_at TIMESTAMP, -- Time when the bed is automatically given away if not checked in
  total_spent DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE reservations;

-- Enable RLS for reservations
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read/write on reservations" ON reservations;
CREATE POLICY "Allow public read/write on reservations" ON reservations FOR ALL USING (true) WITH CHECK (true);

