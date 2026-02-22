-- Add message_type to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS message_type text DEFAULT 'text';

-- Add check constraint for message_type
ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_message_type_check;

ALTER TABLE messages 
ADD CONSTRAINT messages_message_type_check 
CHECK (message_type IN ('text', 'image', 'gift'));