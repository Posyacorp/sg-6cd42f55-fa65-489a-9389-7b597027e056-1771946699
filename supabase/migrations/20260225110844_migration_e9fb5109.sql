-- Add is_proxy column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_proxy BOOLEAN DEFAULT false;

-- Create index for faster querying
CREATE INDEX IF NOT EXISTS profiles_is_proxy_idx ON profiles(is_proxy);