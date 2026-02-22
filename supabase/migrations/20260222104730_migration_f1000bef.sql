-- Create gifts table
CREATE TABLE IF NOT EXISTS gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  coin_price decimal(20, 2) NOT NULL CHECK (coin_price > 0),
  bean_value decimal(20, 2) NOT NULL CHECK (bean_value > 0),
  category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create gift transactions table
CREATE TABLE IF NOT EXISTS gift_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id uuid REFERENCES gifts(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  total_coins decimal(20, 2) NOT NULL,
  total_beans decimal(20, 2) NOT NULL,
  message text,
  transaction_id uuid REFERENCES transactions(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS gifts_is_active_idx ON gifts(is_active);
CREATE INDEX IF NOT EXISTS gift_transactions_sender_id_idx ON gift_transactions(sender_id);
CREATE INDEX IF NOT EXISTS gift_transactions_receiver_id_idx ON gift_transactions(receiver_id);
CREATE INDEX IF NOT EXISTS gift_transactions_created_at_idx ON gift_transactions(created_at DESC);

-- Enable RLS
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active gifts"
  ON gifts FOR SELECT
  USING (is_active = true OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ));

CREATE POLICY "Admins can manage gifts"
  ON gifts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view their gift transactions"
  ON gift_transactions FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "System can insert gift transactions"
  ON gift_transactions FOR INSERT
  WITH CHECK (true);