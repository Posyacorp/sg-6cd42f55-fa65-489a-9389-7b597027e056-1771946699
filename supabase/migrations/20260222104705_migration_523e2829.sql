-- Create transaction ledger table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN (
    'coin_purchase', 'coin_spend', 'bean_earn', 'bean_withdraw',
    'token_reward', 'token_withdraw', 'gift_send', 'gift_receive',
    'referral_bonus', 'call_payment', 'agency_commission'
  )),
  amount decimal(20, 8) NOT NULL,
  currency text NOT NULL CHECK (currency IN ('coins', 'beans', 'tokens', 'usdt')),
  balance_before decimal(20, 8) NOT NULL,
  balance_after decimal(20, 8) NOT NULL,
  related_user_id uuid REFERENCES profiles(id),
  metadata jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON transactions(user_id);
CREATE INDEX IF NOT EXISTS transactions_type_idx ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS transactions_created_at_idx ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS transactions_status_idx ON transactions(status);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = related_user_id);

CREATE POLICY "System can insert transactions"
  ON transactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all transactions"
  ON transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );