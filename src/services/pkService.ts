import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type PkBattle = Database["public"]["Tables"]["pk_battles"]["Row"];

export const pkService = {
  async createChallenge(inviterId: string, inviteeId: string, durationMinutes = 5): Promise<{ data: PkBattle | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("pk_battles")
        .insert({
          inviter_id: inviterId,
          invitee_id: inviteeId,
          status: "pending",
          inviter_score: 0,
          invitee_score: 0,
          end_time: new Date(Date.now() + durationMinutes * 60 * 1000).toISOString(), // Estimated end time
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error creating PK challenge:", error);
      return { data: null, error };
    }
  },

  async acceptChallenge(battleId: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from("pk_battles")
        .update({
          status: "active",
          start_time: new Date().toISOString(),
          // Reset end time based on actual start
          end_time: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        })
        .eq("id", battleId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error accepting PK challenge:", error);
      return { success: false, error };
    }
  },

  async endBattle(battleId: string, winnerId: string | null): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from("pk_battles")
        .update({
          status: "ended",
          winner_id: winnerId,
        })
        .eq("id", battleId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error ending PK battle:", error);
      return { success: false, error };
    }
  },

  async getActiveBattle(userId: string): Promise<{ data: any | null; error: any }> {
    try {
      // Find a battle where the user is either inviter or invitee AND status is active/pending
      const { data, error } = await supabase
        .from("pk_battles")
        .select(`
          *,
          inviter:profiles!pk_battles_inviter_id_fkey(full_name, avatar_url),
          invitee:profiles!pk_battles_invitee_id_fkey(full_name, avatar_url)
        `)
        .or(`inviter_id.eq.${userId},invitee_id.eq.${userId}`)
        .in("status", ["pending", "active"])
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching active battle:", error);
      return { data: null, error };
    }
  },
  
  // Call this when a gift is sent during a PK battle
  async updateScore(battleId: string, userId: string, scoreToAdd: number): Promise<{ success: boolean; error?: any }> {
    try {
      // We need to determine if the user is inviter or invitee to update the correct score column
      // For simplicity, we'll use a custom RPC or two update queries. Let's use two queries for now.
      
      // 1. Check which role the user has
      const { data: battle } = await supabase.from("pk_battles").select("inviter_id, invitee_id, inviter_score, invitee_score").eq("id", battleId).single();
      
      if (!battle) throw new Error("Battle not found");

      let updateData = {};
      if (userId === battle.inviter_id) {
        updateData = { inviter_score: (battle.inviter_score || 0) + scoreToAdd };
      } else if (userId === battle.invitee_id) {
        updateData = { invitee_score: (battle.invitee_score || 0) + scoreToAdd };
      } else {
        return { success: false, error: "User not in battle" };
      }

      const { error } = await supabase
        .from("pk_battles")
        .update(updateData)
        .eq("id", battleId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error updating PK score:", error);
      return { success: false, error };
    }
  }
};