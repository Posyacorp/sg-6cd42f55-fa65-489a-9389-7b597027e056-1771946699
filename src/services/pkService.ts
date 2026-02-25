import { supabase } from "@/integrations/supabase/client";

export interface PKBattle {
  id: string;
  anchor1_id: string;
  anchor2_id: string;
  stream_id: string;
  status: "pending" | "active" | "completed" | "cancelled";
  anchor1_score: number;
  anchor2_score: number;
  winner_id?: string;
  started_at?: string;
  ended_at?: string;
  duration_minutes: number;
  total_coins_received: number;
  created_at: string;
}

export const pkService = {
  // ============ PK BATTLE MANAGEMENT ============

  async createPKBattle(data: {
    anchor1_id: string;
    anchor2_id: string;
    stream_id: string;
    duration_minutes?: number;
  }) {
    try {
      const { data: battle, error } = await supabase
        .from("pk_battles")
        .insert({
          anchor1_id: data.anchor1_id,
          anchor2_id: data.anchor2_id,
          stream_id: data.stream_id,
          status: "pending",
          anchor1_score: 0,
          anchor2_score: 0,
          duration_minutes: data.duration_minutes || 30,
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
          started_at: new Date().toISOString(),
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
      const winnerId = battle.anchor1_score > battle.anchor2_score
        ? battle.anchor1_id
        : battle.anchor2_id;

      const { data, error } = await supabase
        .from("pk_battles")
        .update({
          status: "completed",
          ended_at: new Date().toISOString(),
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

  async updatePKScore(battleId: string, anchorId: string, coinsReceived: number) {
    try {
      // Get current battle
      const { data: battle, error: fetchError } = await supabase
        .from("pk_battles")
        .select("*")
        .eq("id", battleId)
        .single();

      if (fetchError) throw fetchError;

      // Update appropriate anchor score
      const updateData = anchorId === battle.anchor1_id
        ? { anchor1_score: battle.anchor1_score + coinsReceived }
        : { anchor2_score: battle.anchor2_score + coinsReceived };

      const { data, error } = await supabase
        .from("pk_battles")
        .update({
          ...updateData,
          total_coins_received: battle.total_coins_received + coinsReceived,
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
          anchor1:profiles!anchor1_id(full_name, avatar_url),
          anchor2:profiles!anchor2_id(full_name, avatar_url)
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