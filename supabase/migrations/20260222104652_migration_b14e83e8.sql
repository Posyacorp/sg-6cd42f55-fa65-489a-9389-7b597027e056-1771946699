-- Create wallet balances table
CREATE TABLE IF NOT EXISTS wallet_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  coins decimal(20, 2) DEFAULT 0 CHECK (coins >= 0),
  beans decimal(20, 2) DEFAULT 0 CHECK (beans >= 0),
  reward_tokens decimal(20, 8) DEFAULT 0 CHECK (reward_tokens >= 0),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS wallet_balances_user_id_idx ON wallet_balances(user_id);

-- Enable RLS
ALTER TABLE wallet_balances ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own wallet"
  ON wallet_balances FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet"
  ON wallet_balances FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all wallets"
  ON wallet_balances FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Auto-create wallet on user registration
CREATE OR REPLACE FUNCTION create_wallet_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wallet_balances (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_created_create_wallet
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_wallet_for_new_user();