-- Ensure role column exists (idempotent)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Drop constraint if exists to avoid errors on recreation
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add check constraint for valid roles
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'anchor', 'agency', 'admin'));

-- Create index on role for faster queries
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- Update RLS policies to allow role-based access
DROP POLICY IF EXISTS "Users can view profiles by role" ON profiles;
CREATE POLICY "Users can view profiles by role" ON profiles
  FOR SELECT USING (true);