import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export const profileService = {
  // Get user profile
  async getProfile(userId: string): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Profile fetch error:", error);
      throw new Error(error.message);
    }

    return data;
  },

  // Update profile information
  async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Profile update error:", error);
      throw new Error(error.message);
    }

    return data;
  },

  // Upload profile picture
  async uploadProfilePicture(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(uploadError.message);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    await this.updateProfile(userId, { avatar_url: publicUrl });

    return publicUrl;
  },

  // Delete profile picture
  async deleteProfilePicture(userId: string, avatarUrl: string): Promise<void> {
    // Extract file path from URL
    const urlParts = avatarUrl.split("/");
    const filePath = `avatars/${urlParts[urlParts.length - 1]}`;

    // Delete from storage
    const { error } = await supabase.storage
      .from("profile-pictures")
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      throw new Error(error.message);
    }

    // Update profile to remove avatar URL
    await this.updateProfile(userId, { avatar_url: null });
  },

  // Get account statistics
  async getAccountStats(userId: string) {
    // Get user creation date
    const { data: profile } = await supabase
      .from("profiles")
      .select("created_at")
      .eq("id", userId)
      .single();

    // Get total sessions (from wallet transactions as proxy)
    const { count: sessionCount } = await supabase
      .from("transactions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    return {
      memberSince: profile?.created_at,
      totalSessions: sessionCount || 0,
      accountStatus: "Active",
    };
  },
};