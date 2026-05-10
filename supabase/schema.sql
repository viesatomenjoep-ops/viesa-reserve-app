-- VIESA Reserve - Master SQL Schema
-- Copy and paste this entirely into your Supabase SQL Editor

-- 1. Create beds table (Includes X/Y coordinates for custom mapping)
CREATE TABLE beds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  zone VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  min_spend DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'RESERVED', 'BOOKED'
  pos_x DECIMAL(5,2) NOT NULL DEFAULT 0, -- X coordinate percentage (0-100)
  pos_y DECIMAL(5,2) NOT NULL DEFAULT 0, -- Y coordinate percentage (0-100)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bed_id UUID REFERENCES beds(id),
  user_name VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Turn on Real-time for beds so the map updates instantly
ALTER PUBLICATION supabase_realtime ADD TABLE beds;

-- 4. Insert Logical Layout Data
-- We structure the beach club into logical zones.
-- pos_x and pos_y are percentages (0-100) for responsive rendering.

-- Zone 1: Front Row (Closest to the water, bottom of the map)
INSERT INTO beds (name, zone, price, min_spend, status, pos_x, pos_y) VALUES
  ('101', 'Zone 1: Front Row', 500, 1000, 'AVAILABLE', 20, 85),
  ('102', 'Zone 1: Front Row', 500, 1000, 'AVAILABLE', 40, 85),
  ('103', 'Zone 1: Front Row', 500, 1000, 'RESERVED',  60, 85),
  ('104', 'Zone 1: Front Row', 500, 1000, 'AVAILABLE', 80, 85);

-- Zone 2: Second Row
INSERT INTO beds (name, zone, price, min_spend, status, pos_x, pos_y) VALUES
  ('201', 'Zone 2: Second Row', 400, 800, 'AVAILABLE', 25, 70),
  ('202', 'Zone 2: Second Row', 400, 800, 'BOOKED',    45, 70),
  ('203', 'Zone 2: Second Row', 400, 800, 'AVAILABLE', 65, 70);

-- Zone 3: VIP Deck (Central, prime view)
INSERT INTO beds (name, zone, price, min_spend, status, pos_x, pos_y) VALUES
  ('V1', 'Zone 3: VIP Deck', 1500, 3000, 'AVAILABLE', 35, 50),
  ('V2', 'Zone 3: VIP Deck', 1500, 3000, 'AVAILABLE', 65, 50);

-- Zone 4: Cabanas (Sides, private)
INSERT INTO beds (name, zone, price, min_spend, status, pos_x, pos_y) VALUES
  ('C1', 'Zone 4: Cabanas', 2000, 5000, 'AVAILABLE', 10, 40),
  ('C2', 'Zone 4: Cabanas', 2000, 5000, 'AVAILABLE', 90, 40);

-- Zone 5: Poolside
INSERT INTO beds (name, zone, price, min_spend, status, pos_x, pos_y) VALUES
  ('P1', 'Zone 5: Poolside', 600, 1200, 'AVAILABLE', 30, 30),
  ('P2', 'Zone 5: Poolside', 600, 1200, 'AVAILABLE', 50, 30),
  ('P3', 'Zone 5: Poolside', 600, 1200, 'RESERVED',  70, 30);

-- Restaurant Tables (Top section)
INSERT INTO beds (name, zone, price, min_spend, status, pos_x, pos_y) VALUES
  ('T1', 'Restaurant', 0, 500, 'AVAILABLE', 30, 10),
  ('T2', 'Restaurant', 0, 500, 'AVAILABLE', 50, 10),
  ('T3', 'Restaurant', 0, 500, 'AVAILABLE', 70, 10);
