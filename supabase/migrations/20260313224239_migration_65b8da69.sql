-- PHASE 1: Database Schema Updates

-- 1. Add approval_status and referred_by to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'approved',
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id);

-- Add constraint for approval_status
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_approval_status_check'
  ) THEN
    ALTER TABLE profiles 
    ADD CONSTRAINT profiles_approval_status_check 
    CHECK (approval_status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Add index for approval queries
CREATE INDEX IF NOT EXISTS profiles_approval_status_idx ON profiles(approval_status);
CREATE INDEX IF NOT EXISTS profiles_referred_by_idx ON profiles(referred_by);

-- 2. Create agency_applications table (Anchor → Agency upgrade requests)
CREATE TABLE IF NOT EXISTS agency_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anchor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  application_status TEXT NOT NULL DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected')),
  company_name TEXT NOT NULL,
  business_registration TEXT,
  contact_person TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  proposed_commission_rate NUMERIC(5,2) DEFAULT 10.00 CHECK (proposed_commission_rate >= 0 AND proposed_commission_rate <= 100),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for agency_applications
CREATE INDEX IF NOT EXISTS agency_applications_anchor_id_idx ON agency_applications(anchor_id);
CREATE INDEX IF NOT EXISTS agency_applications_status_idx ON agency_applications(application_status);
CREATE INDEX IF NOT EXISTS agency_applications_created_at_idx ON agency_applications(created_at DESC);

-- 3. Create commission_overrides table (Admin custom commission per user)
CREATE TABLE IF NOT EXISTS commission_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  admin_commission_rate NUMERIC(5,2) CHECK (admin_commission_rate >= 0 AND admin_commission_rate <= 100),
  anchor_commission_rate NUMERIC(5,2) CHECK (anchor_commission_rate >= 0 AND anchor_commission_rate <= 100),
  agency_commission_rate NUMERIC(5,2) CHECK (agency_commission_rate >= 0 AND agency_commission_rate <= 100),
  user_cashback_rate NUMERIC(5,2) CHECK (user_cashback_rate >= 0 AND user_cashback_rate <= 100),
  referral_pool_rate NUMERIC(5,2) CHECK (referral_pool_rate >= 0 AND referral_pool_rate <= 100),
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for commission_overrides
CREATE INDEX IF NOT EXISTS commission_overrides_user_id_idx ON commission_overrides(user_id);

-- 4. Add RLS policies for agency_applications
ALTER TABLE agency_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anchors can create agency applications"
  ON agency_applications FOR INSERT
  WITH CHECK (auth.uid() = anchor_id);

CREATE POLICY "Anchors can view their own applications"
  ON agency_applications FOR SELECT
  USING (auth.uid() = anchor_id);

CREATE POLICY "Admins can view all applications"
  ON agency_applications FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can update applications"
  ON agency_applications FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- 5. Add RLS policies for commission_overrides
ALTER TABLE commission_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage commission overrides"
  ON commission_overrides FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can view their own commission rates"
  ON commission_overrides FOR SELECT
  USING (auth.uid() = user_id);