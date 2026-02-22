-- Add status management fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'banned', 'suspended')),
ADD COLUMN IF NOT EXISTS banned_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS banned_by uuid REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS ban_reason text,
ADD COLUMN IF NOT EXISTS last_login_at timestamp with time zone;