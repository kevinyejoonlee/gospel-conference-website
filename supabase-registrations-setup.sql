-- Create registrations table in Supabase
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)

CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  preferred_name TEXT,
  date_of_birth DATE NOT NULL,
  address TEXT NOT NULL,
  email TEXT NOT NULL,
  emergency_contact TEXT NOT NULL,
  health_card_number TEXT NOT NULL,
  church TEXT NOT NULL,
  is_christian TEXT NOT NULL,
  grade INTEGER,
  tshirt_size TEXT,
  allergies TEXT,
  photo_consent TEXT,
  special_notes TEXT,
  fee_paid BOOLEAN NOT NULL DEFAULT false,
  payment_method TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_name ON registrations(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_registrations_grade ON registrations(grade);
CREATE INDEX IF NOT EXISTS idx_registrations_fee_paid ON registrations(fee_paid);

-- Enable Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert registrations
CREATE POLICY "Allow public registrations" ON registrations
  FOR INSERT
  WITH CHECK (true);

-- Create a policy that allows reading registrations (you may want to restrict this)
-- For now, we'll allow reading via the API route which uses service role key
CREATE POLICY "Allow reading registrations" ON registrations
  FOR SELECT
  USING (true);

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_registrations_updated_at();

