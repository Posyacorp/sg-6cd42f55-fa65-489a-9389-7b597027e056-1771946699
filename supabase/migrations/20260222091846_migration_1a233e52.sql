-- Create user activity logs table
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  action_details jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS user_activity_logs_user_id_idx ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS user_activity_logs_created_at_idx ON user_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS user_activity_logs_action_type_idx ON user_activity_logs(action_type);

-- RLS policies for user activity logs
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all activity logs"
  ON user_activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert activity logs"
  ON user_activity_logs FOR INSERT
  WITH CHECK (true);