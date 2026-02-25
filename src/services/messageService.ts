import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];

export const messageService = {
  // ============ DIRECT MESSAGES ============

  async sendMessage(data: {
    sender_id: string;
    receiver_id: string;
    content: string;
    message_type?: "text" | "image" | "video" | "audio" | "gift";
    media_url?: string;
  }): Promise<{ success: boolean; data?: Message; error?: any }> {
    try {
      const { data: message, error } = await supabase
        .from("messages")
        .insert({
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          content: data.content,
          message_type: data.message_type || "text",
          media_url: data.media_url,
          read_at: null,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: message };
    } catch (error) {
      console.error("Error sending message:", error);
      return { success: false, error };
    }
  },

  async getConversation(
    userId: string,
    otherUserId: string,
    limit: number = 50
  ): Promise<{ success: boolean; data?: Message[]; error?: any }> {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching conversation:", error);
      return { success: false, data: [], error };
    }
  },

  async getConversationList(
    userId: string
  ): Promise<{ success: boolean; data?: any[]; error?: any }> {
    try {
      // Get latest message with each user
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url),
          receiver:profiles!messages_receiver_id_fkey(id, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Group by conversation partner
      const conversations = new Map();
      data?.forEach((message: any) => {
        const partnerId = message.sender_id === userId 
          ? message.receiver_id 
          : message.sender_id;
        
        if (!conversations.has(partnerId)) {
          conversations.set(partnerId, {
            partner: message.sender_id === userId ? message.receiver : message.sender,
            lastMessage: message,
            unreadCount: message.receiver_id === userId && !message.read_at ? 1 : 0,
          });
        } else if (message.receiver_id === userId && !message.read_at) {
          const conv = conversations.get(partnerId);
          conv.unreadCount++;
        }
      });

      return { success: true, data: Array.from(conversations.values()) };
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return { success: false, data: [], error };
    }
  },

  async markAsRead(messageIds: string[]): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .in("id", messageIds);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error marking messages as read:", error);
      return { success: false, error };
    }
  },

  async deleteMessage(messageId: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error deleting message:", error);
      return { success: false, error };
    }
  },

  // ============ REALTIME SUBSCRIPTIONS ============

  subscribeToConversation(
    userId: string,
    otherUserId: string,
    onNewMessage: (message: Message) => void
  ) {
    const channel = supabase
      .channel(`conversation:${userId}:${otherUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${otherUserId},receiver_id=eq.${userId}`,
        },
        (payload) => {
          onNewMessage(payload.new as Message);
        }
      )
      .subscribe();

    return channel;
  },

  subscribeToAllMessages(
    userId: string,
    onNewMessage: (message: Message) => void
  ) {
    const channel = supabase
      .channel(`user_messages:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          onNewMessage(payload.new as Message);
        }
      )
      .subscribe();

    return channel;
  },

  unsubscribe(channel: any) {
    supabase.removeChannel(channel);
  },
};