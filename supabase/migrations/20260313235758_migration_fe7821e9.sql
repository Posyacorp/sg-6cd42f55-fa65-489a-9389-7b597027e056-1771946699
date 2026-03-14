-- Migration 3: Gifts catalog
-- File: 20260222075546_migration_3e3e7f7c.sql

CREATE TABLE IF NOT EXISTS gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price_coins INTEGER NOT NULL,
  image_url TEXT,
  animation_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view gifts" ON gifts FOR SELECT USING (true);
CREATE POLICY "Admins manage gifts" ON gifts FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));