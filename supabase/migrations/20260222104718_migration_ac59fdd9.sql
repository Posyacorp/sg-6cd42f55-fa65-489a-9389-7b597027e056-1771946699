-- Create referral system tables
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  level integer NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 10),
  total_earned decimal(20, 8) DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);

-- Create referral earnings table
CREATE TABLE IF NOT EXISTS referral_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE,
  level integer NOT NULL CHECK (level >= 1 AND level <= 10),
  amount decimal(20, 8) NOT NULL,
  percentage decimal(5, 2) NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS referrals_referrer_id_idx ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS referrals_referred_id_idx ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS referral_earnings_referrer_id_idx ON referral_earnings(referrer_id);
CREATE INDEX IF NOT EXISTS referral_earnings_created_at_idx ON referral_earnings(created_at DESC);

-- Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_earnings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own referrals"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can view their own referral earnings"
  ON referral_earnings FOR SELECT
  USING (auth.uid() = referrer_id);

CREATE POLICY "Admins can view all referrals"
  ON referrals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );