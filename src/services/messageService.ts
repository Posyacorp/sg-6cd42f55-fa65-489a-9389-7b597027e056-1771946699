import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface ConversationWithUser extends Conversation {
  other_user?: {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
  last_message?: Message;
  unread_count?: number;
}

export const messageService = {
  async getConversations(userId: string): Promise<{ data: ConversationWithUser[] | null; error: any }> {
    try {
      // First get conversations
      const { data: convData, error: convError } = await supabase
        .from("conversations")
        .select("*")
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .order("last_message_at", { ascending: false });

      if (convError) throw convError;
      if (!convData) return { data: [], error: null };

      // Get all unique user IDs
      const userIds = new Set<string>();
      convData.forEach(conv => {
        userIds.add(conv.user1_id);
        userIds.add(conv.user2_id);
      });

      // Fetch user profiles
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url")
        .in("id", Array.from(userIds));

      if (profileError) throw profileError;

      // Create a map for quick lookup
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Transform conversations
      const conversations: ConversationWithUser[] = convData.map(conv => {
        const otherUserId = conv.user1_id === userId ? conv.user2_id : conv.user1_id;
        const otherUser = profileMap.get(otherUserId);
        
        return {
          ...conv,
          other_user: otherUser ? {
            id: otherUser.id,
            full_name: otherUser.full_name,
            email: otherUser.email,
            avatar_url: otherUser.avatar_url,
          } : undefined,
        };
      });

      return { data: conversations, error: null };
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return { data: null, error };
    }
  },

  async getMessages(conversationId: string, limit = 50): Promise<{ data: Message[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching messages:", error);
      return { data: null, error };
    }
  },

  async sendMessage(
    conversationId: string,
    senderId: string,
    messageText: string,
    type: "text" | "image" | "gift" = "text"
  ): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: senderId,
        message_text: messageText,
        message_type: type,
      });

      if (error) throw error;

      // Update conversation last_message_at
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

      return { success: true };
    } catch (error) {
      console.error("Error sending message:", error);
      return { success: false, error };
    }
  },

  async createConversation(user1Id: string, user2Id: string): Promise<{ data: Conversation | null; error: any }> {
    try {
      // Check if conversation already exists
      const { data: existing, error: searchError } = await supabase
        .from("conversations")
        .select("*")
        .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
        .maybeSingle();

      if (existing) {
        return { data: existing, error: null };
      }

      // Create new conversation
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user1_id: user1Id,
          user2_id: user2Id,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error creating conversation:", error);
      return { data: null, error };
    }
  },

  async markAsRead(conversationId: string, userId: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .neq("sender_id", userId)
        .eq("is_read", false);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error marking messages as read:", error);
      return { success: false, error };
    }
  },

  async getUnreadCount(userId: string): Promise<{ data: number | null; error: any }> {
    try {
      const { data: conversations } = await supabase
        .from("conversations")
        .select("id")
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

      if (!conversations) return { data: 0, error: null };

      const conversationIds = conversations.map(c => c.id);
      if (conversationIds.length === 0) return { data: 0, error: null };

      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .in("conversation_id", conversationIds)
        .neq("sender_id", userId)
        .eq("is_read", false);

      if (error) throw error;
      return { data: count || 0, error: null };
    } catch (error) {
      console.error("Error getting unread count:", error);
      return { data: null, error };
    }
  },
};