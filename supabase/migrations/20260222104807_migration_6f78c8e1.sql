-- Create anchor profiles table
CREATE TABLE IF NOT EXISTS anchor_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  display_name text,
  bio text,
  avatar_url text,
  cover_image_url text,
  call_price_per_minute decimal(10, 2) DEFAULT 10.00 CHECK (call_price_per_minute >= 0),
  video_call_enabled boolean DEFAULT true,
  voice_call_enabled boolean DEFAULT true,
  level integer DEFAULT 1 CHECK (level >= 1),
  total_earnings decimal(20, 2) DEFAULT 0,
  total_calls integer DEFAULT 0,
  total_minutes integer DEFAULT 0,
  rating decimal(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_ratings integer DEFAULT 0,
  agency_id uuid REFERENCES profiles(id),
  is_verified boolean DEFAULT false,
  is_online boolean DEFAULT false,
  last_online_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create call sessions table
CREATE TABLE IF NOT EXISTS call_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anchor_id uuid REFERENCES anchor_profiles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  call_type text CHECK (call_type IN ('video', 'voice')),
  start_time timestamp with time zone DEFAULT now(),
  end_time timestamp with time zone,
  duration_minutes integer,
  cost_coins decimal(20, 2),
  earnings_beans decimal(20, 2),
  status text DEFAULT 'active' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS anchor_profiles_level_idx ON anchor_profiles(level);
CREATE INDEX IF NOT EXISTS anchor_profiles_is_online_idx ON anchor_profiles(is_online);
CREATE INDEX IF NOT EXISTS anchor_profiles_rating_idx ON anchor_profiles(rating DESC);
CREATE INDEX IF NOT EXISTS call_sessions_anchor_id_idx ON call_sessions(anchor_id);
CREATE INDEX IF NOT EXISTS call_sessions_user_id_idx ON call_sessions(user_id);
CREATE INDEX IF NOT EXISTS call_sessions_status_idx ON call_sessions(status);

-- Enable RLS
ALTER TABLE anchor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view anchor profiles"
  ON anchor_profiles FOR SELECT
  USING (true);

CREATE POLICY "Anchors can update their own profile"
  ON anchor_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own call sessions"
  ON call_sessions FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = anchor_id);

CREATE POLICY "System can create call sessions"
  ON call_sessions FOR INSERT
  WITH CHECK (true);