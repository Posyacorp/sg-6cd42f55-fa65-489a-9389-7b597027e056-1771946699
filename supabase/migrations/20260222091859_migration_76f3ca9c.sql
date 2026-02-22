-- Create email notifications table
CREATE TABLE IF NOT EXISTS email_notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sent_by uuid NOT NULL REFERENCES profiles(id),
  recipient_ids uuid[] NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS email_notifications_sent_by_idx ON email_notifications(sent_by);
CREATE INDEX IF NOT EXISTS email_notifications_created_at_idx ON email_notifications(created_at DESC);

-- RLS policies
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all email notifications"
  ON email_notifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert email notifications"
  ON email_notifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );