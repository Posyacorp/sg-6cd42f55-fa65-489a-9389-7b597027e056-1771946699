-- Create update_wallet_balance RPC function
CREATE OR REPLACE FUNCTION update_wallet_balance(
  p_user_id uuid,
  p_currency text,
  p_amount decimal
)
RETURNS void AS $$
BEGIN
  IF p_currency = 'coins' THEN
    UPDATE wallet_balances SET coins = coins + p_amount WHERE user_id = p_user_id;
  ELSIF p_currency = 'beans' THEN
    UPDATE wallet_balances SET beans = beans + p_amount WHERE user_id = p_user_id;
  ELSIF p_currency = 'reward_tokens' OR p_currency = 'tokens' THEN
    UPDATE wallet_balances SET reward_tokens = reward_tokens + p_amount WHERE user_id = p_user_id;
  ELSE
    RAISE EXCEPTION 'Invalid currency: %', p_currency;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add referral_code to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;

-- Create function to generate referral code on insert
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.referral_code := substring(md5(random()::text) from 0 for 9);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_created_gen_ref_code
  BEFORE INSERT ON profiles
  FOR EACH ROW
  WHEN (NEW.referral_code IS NULL)
  EXECUTE FUNCTION generate_referral_code();