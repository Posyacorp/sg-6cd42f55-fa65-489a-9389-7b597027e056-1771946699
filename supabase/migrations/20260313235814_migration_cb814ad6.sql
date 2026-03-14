-- Migration 4: Gift transactions
-- File: 20260222075600_migration_69965b1f.sql

CREATE TABLE IF NOT EXISTS gift_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  gift_id UUID NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_coins INTEGER NOT NULL,
  beans_earned DECIMAL(15,2) NOT NULL,
  stream_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE gift_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own transactions" ON gift_transactions FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users create transactions" ON gift_transactions FOR INSERT WITH CHECK (auth.uid() = sender_id);