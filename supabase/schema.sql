-- Supabase Schema for VIESA Reserve

-- Create beds table
CREATE TABLE beds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  zone VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  min_spend DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'RESERVED' (in cart), 'BOOKED'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bed_id UUID REFERENCES beds(id),
  user_name VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED', 'CANCELLED'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on real-time for beds
ALTER PUBLICATION supabase_realtime ADD TABLE beds;

-- Insert some mock data for the initial interactive map
INSERT INTO beds (name, zone, price, min_spend, status) VALUES
  ('F1', 'Front Row', 500.00, 1000.00, 'AVAILABLE'),
  ('F2', 'Front Row', 500.00, 1000.00, 'BOOKED'),
  ('F3', 'Front Row', 500.00, 1000.00, 'AVAILABLE'),
  ('C1', 'VIP Cabanas', 1500.00, 3000.00, 'AVAILABLE'),
  ('C2', 'VIP Cabanas', 1500.00, 3000.00, 'AVAILABLE'),
  ('T1', 'Restaurant', 200.00, 500.00, 'AVAILABLE'),
  ('T2', 'Restaurant', 200.00, 500.00, 'RESERVED');
