-- Create agency profiles table
CREATE TABLE IF NOT EXISTS agency_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  agency_name text NOT NULL,
  description text,
  logo_url text,
  commission_rate decimal(5, 2) DEFAULT 10.00 CHECK (commission_rate >= 0 AND commission_rate <= 100),
  total_anchors integer DEFAULT 0,
  total_commission decimal(20, 2) DEFAULT 0,
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create agency commission earnings table
CREATE TABLE IF NOT EXISTS agency_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid REFERENCES agency_profiles(id) ON DELETE CASCADE,
  anchor_id uuid REFERENCES anchor_profiles(id) ON DELETE CASCADE,
  transaction_id uuid REFERENCES transactions(id),
  amount decimal(20, 2) NOT NULL,
  commission_rate decimal(5, 2) NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS agency_commissions_agency_id_idx ON agency_commissions(agency_id);
CREATE INDEX IF NOT EXISTS agency_commissions_anchor_id_idx ON agency_commissions(anchor_id);
CREATE INDEX IF NOT EXISTS agency_commissions_created_at_idx ON agency_commissions(created_at DESC);

-- Enable RLS
ALTER TABLE agency_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_commissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view agency profiles"
  ON agency_profiles FOR SELECT
  USING (true);

CREATE POLICY "Agencies can update their own profile"
  ON agency_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Agencies can view their own commissions"
  ON agency_commissions FOR SELECT
  USING (
    auth.uid() = agency_id OR 
    EXISTS (
      SELECT 1 FROM anchor_profiles 
      WHERE anchor_profiles.id = auth.uid() 
      AND anchor_profiles.agency_id = agency_commissions.agency_id
    )
  );

CREATE POLICY "Admins can view all agency data"
  ON agency_commissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );