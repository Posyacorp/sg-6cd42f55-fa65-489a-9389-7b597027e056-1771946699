-- 1. Upgrade streams table
ALTER TABLE streams 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS stream_url TEXT,
ADD COLUMN IF NOT EXISTS stream_type TEXT DEFAULT 'video',
ADD COLUMN IF NOT EXISTS total_coins_received NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Rename user_id to anchor_id to match service code (optional but good for consistency)
-- For now, let's alias it in the service code to avoid breaking existing data/queries if any. 
-- Wait, let's check if we can rename. It's safer to just add anchor_id as an alias or use user_id. 
-- Let's update the SERVICE code to use user_id instead of anchor_id to match the DB.

-- 2. Upgrade pk_battles table
ALTER TABLE pk_battles
ADD COLUMN IF NOT EXISTS stream_id UUID REFERENCES streams(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS total_coins_received NUMERIC(10, 2) DEFAULT 0;

-- 3. Create stream_viewers table
CREATE TABLE IF NOT EXISTS stream_viewers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  total_coins_spent NUMERIC(10, 2) DEFAULT 0,
  UNIQUE(stream_id, user_id)
);

-- Enable RLS for stream_viewers
ALTER TABLE stream_viewers ENABLE ROW LEVEL SECURITY;

-- Policies for stream_viewers
CREATE POLICY "Viewers can see other viewers" ON stream_viewers FOR SELECT USING (true);
CREATE POLICY "Users can join as viewers" ON stream_viewers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their viewer status" ON stream_viewers FOR UPDATE USING (auth.uid() = user_id);

-- 4. Create RPC functions
CREATE OR REPLACE FUNCTION increment_viewer_count(stream_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE streams
  SET viewer_count = viewer_count + 1
  WHERE id = stream_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_viewer_count(stream_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE streams
  SET viewer_count = GREATEST(0, viewer_count - 1)
  WHERE id = stream_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;