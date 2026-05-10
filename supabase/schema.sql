-- VIESA Reserve - Admin Master Schema for Cala Bassa Prototype

-- 1. Locations (The main 5 zones on the map)
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL, -- e.g. "Zone 1", "Zone 2"
  pos_x DECIMAL(5,2) NOT NULL DEFAULT 0,
  pos_y DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Areas (The sub-zones within a location)
CREATE TABLE areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- e.g. "Camas Chiringo", "Hamacas Mumm"
  type VARCHAR(50) NOT NULL, -- 'BEDS', 'HAMMOCKS', 'RESTAURANT'
  pos_x DECIMAL(5,2) NOT NULL DEFAULT 0, -- Position relative to the main map or zone map
  pos_y DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Beds / Tables
CREATE TABLE beds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  area_id UUID REFERENCES areas(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL, -- e.g. "Bed 1", "Table 12"
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  min_spend DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
  pos_x DECIMAL(5,2) NOT NULL DEFAULT 0, -- Position within the area's grid/map
  pos_y DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE locations;
ALTER PUBLICATION supabase_realtime ADD TABLE areas;
ALTER PUBLICATION supabase_realtime ADD TABLE beds;

-- Initial Seed Data based on Cala Bassa map
INSERT INTO locations (id, name, pos_x, pos_y) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Zone 1', 15, 50),
  ('22222222-2222-2222-2222-222222222222', 'Zone 2', 30, 25),
  ('33333333-3333-3333-3333-333333333333', 'Zone 3', 65, 25),
  ('44444444-4444-4444-4444-444444444444', 'Zone 4', 85, 45),
  ('55555555-5555-5555-5555-555555555555', 'Zone 5', 90, 75);

-- Zone 1 Areas
INSERT INTO areas (location_id, name, type, pos_x, pos_y) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Restaurante Chiringo', 'RESTAURANT', 5, 40),
  ('11111111-1111-1111-1111-111111111111', 'Camas Chiringo', 'BEDS', 18, 38),
  ('11111111-1111-1111-1111-111111111111', 'Hamacas Chiringo', 'HAMMOCKS', 15, 60);

-- Zone 2 Areas
INSERT INTO areas (location_id, name, type, pos_x, pos_y) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Hamacas Mumm', 'HAMMOCKS', 35, 20),
  ('22222222-2222-2222-2222-222222222222', 'Camas Mumm', 'BEDS', 38, 35);

-- Zone 3 Areas
INSERT INTO areas (location_id, name, type, pos_x, pos_y) VALUES
  ('33333333-3333-3333-3333-333333333333', 'Restaurante Central', 'RESTAURANT', 60, 20),
  ('33333333-3333-3333-3333-333333333333', 'Hamacas Central', 'HAMMOCKS', 60, 45);

-- Zone 4 Areas
INSERT INTO areas (location_id, name, type, pos_x, pos_y) VALUES
  ('44444444-4444-4444-4444-444444444444', 'Camas Taittinger', 'BEDS', 80, 48);

-- Zone 5 Areas
INSERT INTO areas (location_id, name, type, pos_x, pos_y) VALUES
  ('55555555-5555-5555-5555-555555555555', 'Hamacas Portobello', 'HAMMOCKS', 85, 60),
  ('55555555-5555-5555-5555-555555555555', 'Restaurante Portobello', 'RESTAURANT', 80, 80);
