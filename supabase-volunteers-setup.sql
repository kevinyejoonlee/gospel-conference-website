-- Create volunteers table in Supabase
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)

CREATE TABLE IF NOT EXISTS volunteers (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  preferred_name TEXT,
  date_of_birth DATE NOT NULL,
  address TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  church_attendance TEXT NOT NULL,
  leadership_capacity TEXT NOT NULL,
  testimony TEXT NOT NULL,
  gospel TEXT NOT NULL,
  group_leading TEXT NOT NULL,
  agreement TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_volunteers_created_at ON volunteers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_name ON volunteers(last_name, first_name);

-- Enable Row Level Security (RLS)
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert volunteer applications
CREATE POLICY "Allow public volunteer submissions" ON volunteers
  FOR INSERT
  WITH CHECK (true);

-- Create a policy that allows reading volunteers (you may want to restrict this)
-- For now, we'll allow reading via the API route which uses service role key
CREATE POLICY "Allow reading volunteers" ON volunteers
  FOR SELECT
  USING (true);

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_volunteers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_volunteers_updated_at
  BEFORE UPDATE ON volunteers
  FOR EACH ROW
  EXECUTE FUNCTION update_volunteers_updated_at();

