import { supabase } from "@/integrations/supabase/client";

// Define strict types matching the database schema
export interface Stream {
  id: string;
  user_id: string; // DB column is user_id
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  stream_url: string | null;
  status: "live" | "ended";
  stream_type: "video" | "audio" | "pk_battle";
  viewer_count: number;
  total_coins_received: number;
  started_at: string | null;
  ended_at: string | null;
  created_at: string | null;
  // Join fields
  anchor?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export const streamService = {
  // ============ STREAM MANAGEMENT ============

  async createStream(userId: string, streamData: {
    title: string;
    description?: string;
    thumbnail_url?: string;
    stream_type?: "video" | "audio" | "pk_battle";
  }) {
    try {
      const { data, error } = await supabase
        .from("streams")
        .insert({
          user_id: userId,
          title: streamData.title,
          description: streamData.description,
          thumbnail_url: streamData.thumbnail_url,
          stream_type: streamData.stream_type || "video",
          status: "live", // Auto-start for now as 'scheduled' isn't in DB constraint
          viewer_count: 0,
          total_coins_received: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error creating stream:", error);
      return { success: false, error };
    }
  },

  async startStream(streamId: string, streamUrl: string) {
    try {
      const { data, error } = await supabase
        .from("streams")
        .update({
          status: "live",
          stream_url: streamUrl,
          started_at: new Date().toISOString(),
        })
        .eq("id", streamId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error starting stream:", error);
      return { success: false, error };
    }
  },

  async endStream(streamId: string) {
    try {
      const { data, error } = await supabase
        .from("streams")
        .update({
          status: "ended",
          ended_at: new Date().toISOString(),
        })
        .eq("id", streamId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error ending stream:", error);
      return { success: false, error };
    }
  },

  async getLiveStreams() {
    try {
      const { data, error } = await supabase
        .from("streams")
        .select(`
          *,
          anchor:profiles!streams_user_id_fkey(
            full_name,
            avatar_url
          )
        `)
        .eq("status", "live")
        .order("viewer_count", { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching live streams:", error);
      return { success: false, data: [], error };
    }
  },

  async getStreamById(streamId: string) {
    try {
      const { data, error } = await supabase
        .from("streams")
        .select(`
          *,
          anchor:profiles!streams_user_id_fkey(
            full_name,
            avatar_url
          )
        `)
        .eq("id", streamId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching stream:", error);
      return { success: false, error };
    }
  },

  // ============ VIEWER MANAGEMENT ============

  async joinStream(streamId: string, userId: string) {
    try {
      // Add viewer record
      const { error: viewerError } = await supabase
        .from("stream_viewers")
        .insert({
          stream_id: streamId,
          user_id: userId,
          joined_at: new Date().toISOString(),
          total_coins_spent: 0,
        });

      if (viewerError && viewerError.code !== "23505") throw viewerError; // Ignore duplicate key

      // Increment viewer count via RPC
      const { error: updateError } = await supabase.rpc("increment_viewer_count", {
        stream_id: streamId,
      });

      if (updateError) throw updateError;

      return { success: true };
    } catch (error) {
      console.error("Error joining stream:", error);
      return { success: false, error };
    }
  },

  async leaveStream(streamId: string, userId: string) {
    try {
      // Update viewer record
      const { error: viewerError } = await supabase
        .from("stream_viewers")
        .update({
          left_at: new Date().toISOString(),
        })
        .eq("stream_id", streamId)
        .eq("user_id", userId);

      if (viewerError) throw viewerError;

      // Decrement viewer count via RPC
      const { error: updateError } = await supabase.rpc("decrement_viewer_count", {
        stream_id: streamId,
      });

      if (updateError) throw updateError;

      return { success: true };
    } catch (error) {
      console.error("Error leaving stream:", error);
      return { success: false, error };
    }
  },

  // ============ REALTIME SUBSCRIPTIONS ============

  subscribeToStream(streamId: string, callbacks: {
    onViewerCountChange?: (count: number) => void;
    onGiftReceived?: (gift: any) => void;
    onStreamEnd?: () => void;
  }) {
    const channel = supabase
      .channel(`stream:${streamId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "streams",
          filter: `id=eq.${streamId}`,
        },
        (payload) => {
          const stream = payload.new as Stream;
          
          if (callbacks.onViewerCountChange) {
            callbacks.onViewerCountChange(stream.viewer_count);
          }

          if (stream.status === "ended" && callbacks.onStreamEnd) {
            callbacks.onStreamEnd();
          }
        }
      )
      .subscribe();

    return channel;
  },

  unsubscribeFromStream(channel: any) {
    supabase.removeChannel(channel);
  },
};