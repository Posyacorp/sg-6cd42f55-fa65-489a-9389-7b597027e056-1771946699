-- Fix withdrawal_requests table
ALTER TABLE withdrawal_requests 
ADD COLUMN IF NOT EXISTS currency text CHECK (currency IN ('beans', 'reward_tokens'));

-- Fix user_activity_logs column names to match code
DO $$
BEGIN
  -- Rename action_type to activity_type if it exists
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'user_activity_logs' AND column_name = 'action_type') THEN
    ALTER TABLE user_activity_logs RENAME COLUMN action_type TO activity_type;
  END IF;

  -- Rename action_details to details if it exists
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'user_activity_logs' AND column_name = 'action_details') THEN
    ALTER TABLE user_activity_logs RENAME COLUMN action_details TO details;
  END IF;
END $$;