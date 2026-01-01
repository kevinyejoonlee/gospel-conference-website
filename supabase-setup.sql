-- Create donations table in Supabase
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)

CREATE TABLE IF NOT EXISTS donations (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);

-- Create an index on email for potential lookups
CREATE INDEX IF NOT EXISTS idx_donations_email ON donations(email);

-- Enable Row Level Security (RLS) - optional but recommended
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert donations (for public donations)
CREATE POLICY "Allow public donations" ON donations
  FOR INSERT
  WITH CHECK (true);

-- Create a policy that allows reading donations (you may want to restrict this)
-- For now, we'll allow reading via the API route which uses service role key
-- So we can make this more restrictive or remove public read access
CREATE POLICY "Allow reading donations" ON donations
  FOR SELECT
  USING (true);

-- Optional: Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

