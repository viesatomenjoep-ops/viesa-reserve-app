-- ==========================================
-- VIESA RESERVE - MASTER SQL SCHEMA
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ZONES TABLE
-- Allows the client to create different areas (Zone 1, Restaurant, etc.)
CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MAP ITEMS (BEDS & TABLES)
-- Represents the actual physical items on the floorplan.
-- X, Y, Width, and Height are stored as percentages (0-100) to ensure the map is responsive on any screen (mobile/desktop).
CREATE TABLE beds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
  name VARCHAR(50) NOT NULL, -- e.g., 'F1', 'T12'
  item_type VARCHAR(50) NOT NULL DEFAULT 'sunbed', -- 'sunbed', 'cabana', 'restaurant_table', 'lounge'
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  min_spend DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'RESERVED', 'BOOKED'
  
  -- Positioning on the map
  x_position DECIMAL(5,2) NOT NULL DEFAULT 0.00, -- 0 to 100%
  y_position DECIMAL(5,2) NOT NULL DEFAULT 0.00, -- 0 to 100%
  width DECIMAL(5,2) NOT NULL DEFAULT 8.00,      -- percentage of map width
  height DECIMAL(5,2) NOT NULL DEFAULT 8.00,     -- percentage of map height
  rotation INTEGER NOT NULL DEFAULT 0,           -- 0 to 360 degrees
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BOOKINGS TABLE
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bed_id UUID REFERENCES beds(id) ON DELETE SET NULL,
  user_name VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  booking_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED', 'CANCELLED'
  total_paid DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on real-time for beds so the map updates instantly for everyone
ALTER PUBLICATION supabase_realtime ADD TABLE beds;

-- ==========================================
-- SEED DATA (INITIAL LOGICAL LAYOUT)
-- ==========================================

-- Insert Default Zones
INSERT INTO zones (id, name, display_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Zone 1: Front Row', 1),
  ('22222222-2222-2222-2222-222222222222', 'Zone 2: Second Row', 2),
  ('33333333-3333-3333-3333-333333333333', 'Zone 3: Poolside', 3),
  ('44444444-4444-4444-4444-444444444444', 'Zone 4: VIP Cabanas', 4),
  ('55555555-5555-5555-5555-555555555555', 'Restaurant', 5);

-- Insert Beds for Zone 1: Front Row (Closest to water, bottom of map)
INSERT INTO beds (zone_id, name, item_type, price, min_spend, status, x_position, y_position, width, height) VALUES
  ('11111111-1111-1111-1111-111111111111', '1A', 'sunbed', 500, 1000, 'AVAILABLE', 20, 85, 8, 12),
  ('11111111-1111-1111-1111-111111111111', '1B', 'sunbed', 500, 1000, 'AVAILABLE', 40, 85, 8, 12),
  ('11111111-1111-1111-1111-111111111111', '1C', 'sunbed', 500, 1000, 'AVAILABLE', 60, 85, 8, 12),
  ('11111111-1111-1111-1111-111111111111', '1D', 'sunbed', 500, 1000, 'BOOKED', 80, 85, 8, 12);

-- Insert Beds for Zone 2: Second Row
INSERT INTO beds (zone_id, name, item_type, price, min_spend, status, x_position, y_position, width, height) VALUES
  ('22222222-2222-2222-2222-222222222222', '2A', 'sunbed', 300, 600, 'AVAILABLE', 30, 65, 8, 12),
  ('22222222-2222-2222-2222-222222222222', '2B', 'sunbed', 300, 600, 'RESERVED', 50, 65, 8, 12),
  ('22222222-2222-2222-2222-222222222222', '2C', 'sunbed', 300, 600, 'AVAILABLE', 70, 65, 8, 12);

-- Insert Beds for Zone 4: VIP Cabanas (Large, top corners)
INSERT INTO beds (zone_id, name, item_type, price, min_spend, status, x_position, y_position, width, height) VALUES
  ('44444444-4444-4444-4444-444444444444', 'VIP-1', 'cabana', 1500, 3000, 'AVAILABLE', 15, 30, 15, 15),
  ('44444444-4444-4444-4444-444444444444', 'VIP-2', 'cabana', 1500, 3000, 'AVAILABLE', 85, 30, 15, 15);

-- Insert Restaurant Tables (Top center)
INSERT INTO beds (zone_id, name, item_type, price, min_spend, status, x_position, y_position, width, height) VALUES
  ('55555555-5555-5555-5555-555555555555', 'T1', 'restaurant_table', 100, 250, 'AVAILABLE', 40, 15, 8, 8),
  ('55555555-5555-5555-5555-555555555555', 'T2', 'restaurant_table', 100, 250, 'AVAILABLE', 50, 15, 8, 8),
  ('55555555-5555-5555-5555-555555555555', 'T3', 'restaurant_table', 100, 250, 'AVAILABLE', 60, 15, 8, 8);
