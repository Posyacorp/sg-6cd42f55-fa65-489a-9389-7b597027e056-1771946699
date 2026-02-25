import { supabase } from "@/integrations/supabase/client";

export interface PKBattle {
  id: string;
  inviter_id: string;
  invitee_id: string;
  stream_id: string;
  status: "pending" | "active" | "ended" | "rejected";
  inviter_score: number;
  invitee_score: number;
  winner_id?: string;
  start_time?: string;
  end_time?: string;
  duration_minutes: number;
  total_coins_received: number;
  created_at: string;
  // Join fields
  inviter?: { full_name: string; avatar_url: string };
  invitee?: { full_name: string; avatar_url: string };
}

export const pkService = {
  // ============ PK BATTLE MANAGEMENT ============

  async createPKBattle(data: {
    inviter_id: string;
    invitee_id: string;
    stream_id: string;
    duration_minutes?: number;
  }) {
    try {
      const { data: battle, error } = await supabase
        .from("pk_battles")
        .insert({
          inviter_id: data.inviter_id,
          invitee_id: data.invitee_id,
          stream_id: data.stream_id,
          status: "pending",
          inviter_score: 0,
          invitee_score: 0,
          duration_minutes: data.duration_minutes || 5,
          total_coins_received: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: battle };
    } catch (error) {
      console.error("Error creating PK battle:", error);
      return { success: false, error };
    }
  },

  async startPKBattle(battleId: string) {
    try {
      const { data, error } = await supabase
        .from("pk_battles")
        .update({
          status: "active",
          start_time: new Date().toISOString(),
        })
        .eq("id", battleId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error starting PK battle:", error);
      return { success: false, error };
    }
  },

  async endPKBattle(battleId: string) {
    try {
      // Get current battle data
      const { data: battle, error: fetchError } = await supabase
        .from("pk_battles")
        .select("*")
        .eq("id", battleId)
        .single();

      if (fetchError) throw fetchError;

      // Determine winner
      const winnerId = battle.inviter_score > battle.invitee_score
        ? battle.inviter_id
        : (battle.invitee_score > battle.inviter_score ? battle.invitee_id : null);

      const { data, error } = await supabase
        .from("pk_battles")
        .update({
          status: "ended",
          end_time: new Date().toISOString(),
          winner_id: winnerId,
        })
        .eq("id", battleId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error ending PK battle:", error);
      return { success: false, error };
    }
  },

  async updatePKScore(battleId: string, userId: string, coinsReceived: number) {
    try {
      // Get current battle
      const { data: battle, error: fetchError } = await supabase
        .from("pk_battles")
        .select("*")
        .eq("id", battleId)
        .single();

      if (fetchError) throw fetchError;

      // Update appropriate score
      const updateData = userId === battle.inviter_id
        ? { inviter_score: (battle.inviter_score || 0) + coinsReceived }
        : { invitee_score: (battle.invitee_score || 0) + coinsReceived };

      const { data, error } = await supabase
        .from("pk_battles")
        .update({
          ...updateData,
          total_coins_received: (battle.total_coins_received || 0) + coinsReceived,
        })
        .eq("id", battleId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error updating PK score:", error);
      return { success: false, error };
    }
  },

  async getPKBattle(battleId: string) {
    try {
      const { data, error } = await supabase
        .from("pk_battles")
        .select(`
          *,
          inviter:profiles!pk_battles_inviter_id_fkey(full_name, avatar_url),
          invitee:profiles!pk_battles_invitee_id_fkey(full_name, avatar_url)
        `)
        .eq("id", battleId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching PK battle:", error);
      return { success: false, error };
    }
  },

  // ============ REALTIME SUBSCRIPTIONS ============

  subscribeToPKBattle(battleId: string, callbacks: {
    onScoreUpdate?: (battle: PKBattle) => void;
    onBattleEnd?: (winner: string) => void;
  }) {
    const channel = supabase
      .channel(`pk_battle:${battleId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "pk_battles",
          filter: `id=eq.${battleId}`,
        },
        (payload) => {
          const battle = payload.new as PKBattle;
          
          if (callbacks.onScoreUpdate) {
            callbacks.onScoreUpdate(battle);
          }

          if (battle.status === "completed" && callbacks.onBattleEnd && battle.winner_id) {
            callbacks.onBattleEnd(battle.winner_id);
          }
        }
      )
      .subscribe();

    return channel;
  },

  unsubscribeFromPKBattle(channel: any) {
    supabase.removeChannel(channel);
  },
};