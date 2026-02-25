-- 1. Update messages table constraint to allow more message types
ALTER TABLE messages DROP CONSTRAINT messages_message_type_check;
ALTER TABLE messages ADD CONSTRAINT messages_message_type_check 
  CHECK (message_type IN ('text', 'image', 'video', 'audio', 'gift'));