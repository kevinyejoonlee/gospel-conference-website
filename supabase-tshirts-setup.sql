-- Create tshirts table in Supabase
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)
-- This table tracks t-shirt sizes from registrations to help with ordering

CREATE TABLE IF NOT EXISTS tshirts (
  id BIGSERIAL PRIMARY KEY,
  size TEXT NOT NULL,
  registration_id BIGINT, -- Optional: link back to registration if needed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_tshirts_size ON tshirts(size);
CREATE INDEX IF NOT EXISTS idx_tshirts_created_at ON tshirts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tshirts_registration_id ON tshirts(registration_id);

-- Enable Row Level Security (RLS)
ALTER TABLE tshirts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert t-shirt data
CREATE POLICY "Allow public tshirt submissions" ON tshirts
  FOR INSERT
  WITH CHECK (true);

-- Create a policy that allows reading t-shirt data
CREATE POLICY "Allow reading tshirts" ON tshirts
  FOR SELECT
  USING (true);

-- Optional: Create a view to easily see counts by size
CREATE OR REPLACE VIEW tshirt_counts AS
SELECT 
  size,
  COUNT(*) as count
FROM tshirts
GROUP BY size
ORDER BY 
  CASE size
    WHEN 'XS' THEN 1
    WHEN 'S' THEN 2
    WHEN 'M' THEN 3
    WHEN 'L' THEN 4
    WHEN 'XL' THEN 5
    WHEN 'XXL' THEN 6
    WHEN 'XXXL' THEN 7
    ELSE 8
  END;


