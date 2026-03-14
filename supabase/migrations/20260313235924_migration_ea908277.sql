-- Migration 13: Commission overrides table
-- File: 20260225110844_migration_e9fb5109.sql

CREATE TABLE IF NOT EXISTS commission_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  admin_commission DECIMAL(5,2),
  anchor_commission DECIMAL(5,2),
  agency_commission DECIMAL(5,2),
  user_commission DECIMAL(5,2),
  referral_commission DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE commission_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage overrides" ON commission_overrides FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users view own rates" ON commission_overrides FOR SELECT USING (auth.uid() = user_id);