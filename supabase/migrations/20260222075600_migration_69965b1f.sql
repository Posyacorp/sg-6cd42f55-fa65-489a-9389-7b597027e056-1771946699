-- Create admin action logs table for audit trail
CREATE TABLE IF NOT EXISTS admin_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('ban_user', 'unban_user', 'change_role', 'suspend_user', 'delete_user')),
  target_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  details jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin_actions
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Only admins can view action logs
CREATE POLICY "Admins can view all action logs"
  ON admin_actions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Only admins can insert action logs
CREATE POLICY "Admins can insert action logs"
  ON admin_actions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS admin_actions_admin_id_idx ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS admin_actions_target_user_id_idx ON admin_actions(target_user_id);
CREATE INDEX IF NOT EXISTS admin_actions_created_at_idx ON admin_actions(created_at DESC);