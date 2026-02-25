-- Add stream_id to gift_transactions
ALTER TABLE gift_transactions 
ADD COLUMN IF NOT EXISTS stream_id UUID REFERENCES streams(id);

-- Create index for faster stream gift lookups
CREATE INDEX IF NOT EXISTS gift_transactions_stream_id_idx ON gift_transactions(stream_id);