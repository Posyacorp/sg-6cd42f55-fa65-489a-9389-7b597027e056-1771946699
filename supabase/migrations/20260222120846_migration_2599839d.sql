-- Create streams table
CREATE TABLE IF NOT EXISTS streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  title text,
  status text DEFAULT 'live' CHECK (status IN ('live', 'ended')),
  viewer_count integer DEFAULT 0,
  thumbnail_url text,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- Enable RLS for streams
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active streams" ON streams FOR SELECT USING (status = 'live');
CREATE POLICY "Users can create streams" ON streams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Streamers can update own streams" ON streams FOR UPDATE USING (auth.uid() = user_id);

-- Create PK battles table
CREATE TABLE IF NOT EXISTS pk_battles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id uuid REFERENCES profiles(id) NOT NULL,
  invitee_id uuid REFERENCES profiles(id) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'ended', 'rejected')),
  start_time timestamptz,
  end_time timestamptz,
  inviter_score integer DEFAULT 0,
  invitee_score integer DEFAULT 0,
  winner_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for PK battles
ALTER TABLE pk_battles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view battles" ON pk_battles FOR SELECT USING (true);
CREATE POLICY "Users can create battles" ON pk_battles FOR INSERT WITH CHECK (auth.uid() = inviter_id);
CREATE POLICY "Participants can update battles" ON pk_battles FOR UPDATE USING (auth.uid() IN (inviter_id, invitee_id));