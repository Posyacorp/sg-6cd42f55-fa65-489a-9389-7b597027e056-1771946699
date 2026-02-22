import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type Conversation = Database["public"]["Tables"]["conversations"]["Row"];

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
      // Fetch conversations where user is user1
      const { data: conv1, error: err1 } = await supabase
        .from("conversations")
        .select("*")
        .eq("user1_id", userId);

      if (err1) throw err1;

      // Fetch conversations where user is user2
      const { data: conv2, error: err2 } = await supabase
        .from("conversations")
        .select("*")
        .eq("user2_id", userId);

      if (err2) throw err2;

      // Combine and deduplicate
      const allConversations = [...(conv1 || []), ...(conv2 || [])];
      const uniqueConvs = Array.from(
        new Map(allConversations.map(c => [c.id, c])).values()
      ).sort((a, b) => {
        const aTime = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
        const bTime = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
        return bTime - aTime;
      });

      if (uniqueConvs.length === 0) return { data: [], error: null };

      // Get all unique user IDs
      const userIds = new Set<string>();
      uniqueConvs.forEach(conv => {
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
      const conversations: ConversationWithUser[] = uniqueConvs.map(conv => {
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
      const { data, error } = await (supabase
        .from("messages") as any)
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
      // Check if conversation already exists (User 1 -> User 2)
      const { data: existing1, error: err1 } = await supabase
        .from("conversations")
        .select("*")
        .eq("user1_id", user1Id)
        .eq("user2_id", user2Id)
        .maybeSingle();

      if (err1) throw err1;
      if (existing1) return { data: existing1, error: null };

      // Check reverse direction (User 2 -> User 1)
      const { data: existing2, error: err2 } = await supabase
        .from("conversations")
        .select("*")
        .eq("user1_id", user2Id)
        .eq("user2_id", user1Id)
        .maybeSingle();

      if (err2) throw err2;
      if (existing2) return { data: existing2, error: null };

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
      // Simplified approach: Get all unread messages where user is NOT the sender
      // Then filter by conversations where user is a participant
      
      // Step 1: Get user's conversation IDs
      const { data: conv1 } = await supabase
        .from("conversations")
        .select("id")
        .eq("user1_id", userId);

      const { data: conv2 } = await supabase
        .from("conversations")
        .select("id")
        .eq("user2_id", userId);

      const allConvs = [...(conv1 || []), ...(conv2 || [])];
      const convIds = Array.from(new Set(allConvs.map(c => c.id)));

      if (convIds.length === 0) return { data: 0, error: null };

      // Step 2: For each conversation, count unread messages
      let totalUnread = 0;
      
      for (const convId of convIds) {
        const { data: msgs } = await supabase
          .from("messages")
          .select("id", { count: "exact", head: true })
          .eq("conversation_id", convId)
          .neq("sender_id", userId)
          .eq("is_read", false);
        
        // Since we used head: true, data will be null but count is in response
        // For simplicity, let's just fetch the actual messages
        const { data: actualMsgs } = await supabase
          .from("messages")
          .select("id")
          .eq("conversation_id", convId)
          .neq("sender_id", userId)
          .eq("is_read", false);
        
        totalUnread += actualMsgs?.length || 0;
      }

      return { data: totalUnread, error: null };
    } catch (error) {
      console.error("Error getting unread count:", error);
      return { data: null, error };
    }
  },
};