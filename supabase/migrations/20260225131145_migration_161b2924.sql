-- Create user_settings table for notification and privacy preferences
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  marketing_emails BOOLEAN DEFAULT false,
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'friends', 'private')),
  show_online_status BOOLEAN DEFAULT true,
  allow_messages_from TEXT DEFAULT 'everyone' CHECK (allow_messages_from IN ('everyone', 'friends', 'nobody')),
  two_factor_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create social_links table for social media profiles
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  facebook TEXT,
  instagram TEXT,
  twitter TEXT,
  youtube TEXT,
  tiktok TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create anchor_details table for anchor-specific information
CREATE TABLE IF NOT EXISTS anchor_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stage_name TEXT,
  specialty TEXT,
  streaming_schedule TEXT,
  bank_account_name TEXT,
  bank_account_number TEXT,
  bank_name TEXT,
  agency_id UUID REFERENCES profiles(id),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create agency_details table for agency-specific information
CREATE TABLE IF NOT EXISTS agency_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  business_registration TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  contact_person TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  anchor_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE anchor_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_details ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_settings
CREATE POLICY "Users can view their own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own settings" ON user_settings FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for social_links
CREATE POLICY "Users can view their own social links" ON social_links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own social links" ON social_links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own social links" ON social_links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own social links" ON social_links FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for anchor_details
CREATE POLICY "Anchors can view their own details" ON anchor_details FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anchors can insert their own details" ON anchor_details FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anchors can update their own details" ON anchor_details FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all anchor details" ON anchor_details FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for agency_details
CREATE POLICY "Agencies can view their own details" ON agency_details FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Agencies can insert their own details" ON agency_details FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Agencies can update their own details" ON agency_details FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all agency details" ON agency_details FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);