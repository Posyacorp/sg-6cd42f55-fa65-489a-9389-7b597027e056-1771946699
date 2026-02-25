import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type UserSettings = Database["public"]["Tables"]["user_settings"]["Row"];
type UserSettingsInsert = Database["public"]["Tables"]["user_settings"]["Insert"];
type UserSettingsUpdate = Database["public"]["Tables"]["user_settings"]["Update"];

export const settingsService = {
  /**
   * Get user settings
   */
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user settings:", error);
      
      // If settings don't exist, create default settings
      if (error.code === "PGRST116") {
        return await this.createDefaultSettings(userId);
      }
      
      throw error;
    }

    return data;
  },

  /**
   * Create default settings for new user
   */
  async createDefaultSettings(userId: string): Promise<UserSettings> {
    const defaultSettings: UserSettingsInsert = {
      user_id: userId,
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      marketing_emails: false,
      profile_visibility: "public",
      show_online_status: true,
      allow_messages_from: "everyone",
      two_factor_enabled: false,
    };

    const { data, error } = await supabase
      .from("user_settings")
      .insert(defaultSettings)
      .select()
      .single();

    if (error) {
      console.error("Error creating default settings:", error);
      throw error;
    }

    return data;
  },

  /**
   * Update user settings
   */
  async updateSettings(
    userId: string,
    updates: UserSettingsUpdate
  ): Promise<UserSettings> {
    const { data, error } = await supabase
      .from("user_settings")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating settings:", error);
      throw error;
    }

    return data;
  },

  /**
   * Get social media links
   */
  async getSocialLinks(userId: string) {
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching social links:", error);
      throw error;
    }

    return data;
  },

  /**
   * Update social media links
   */
  async updateSocialLinks(userId: string, links: {
    facebook?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    youtube?: string | null;
    tiktok?: string | null;
    website?: string | null;
  }) {
    const { data: existing } = await supabase
      .from("social_links")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("social_links")
        .update(links)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("social_links")
        .insert({ user_id: userId, ...links })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },
};