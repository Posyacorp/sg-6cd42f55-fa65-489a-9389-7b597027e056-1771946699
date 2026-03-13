import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type NotificationType = "approval" | "withdrawal" | "referral" | "system" | "transaction";
type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export const notificationService = {
  // ============ CREATE NOTIFICATIONS ============

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, any>
  ) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .insert({
          user_id: userId,
          type,
          title,
          message,
          metadata,
          read: false
        } as any)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Create notification error:", error);
      return { success: false, error };
    }
  },

  // ============ GET NOTIFICATIONS ============

  async getUserNotifications(userId: string, limit = 50) {
    try {
      const query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);
        
      const { data, error } = await (query as any);

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Get notifications error:", error);
      return { success: false, error, data: [] };
    }
  },

  async getUnreadCount(userId: string) {
    try {
      const query = supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("read", false);
        
      const { count, error } = await (query as any);

      if (error) throw error;
      return { success: true, count: count || 0 };
    } catch (error) {
      console.error("Get unread count error:", error);
      return { success: false, count: 0 };
    }
  },

  // ============ MARK AS READ ============

  async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true } as any)
        .eq("id", notificationId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Mark as read error:", error);
      return { success: false, error };
    }
  },

  async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true } as any)
        .eq("user_id", userId)
        .eq("read", false);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Mark all as read error:", error);
      return { success: false, error };
    }
  },

  // ============ DELETE NOTIFICATIONS ============

  async deleteNotification(notificationId: string) {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Delete notification error:", error);
      return { success: false, error };
    }
  },

  async deleteAllRead(userId: string) {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", userId)
        .eq("read", true);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Delete all read error:", error);
      return { success: false, error };
    }
  },

  // ============ REAL-TIME SUBSCRIPTION ============

  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    return channel;
  },

  // ============ HELPER: SEND SYSTEM NOTIFICATIONS ============

  async notifyApprovalStatus(
    userId: string,
    approvalType: "anchor" | "agency" | "agency_application",
    status: "approved" | "rejected"
  ) {
    const titles = {
      anchor: status === "approved" ? "🎉 Anchor Application Approved!" : "❌ Anchor Application Rejected",
      agency: status === "approved" ? "🎉 Agency Application Approved!" : "❌ Agency Application Rejected",
      agency_application: status === "approved" ? "🎉 Agency Upgrade Approved!" : "❌ Agency Upgrade Rejected"
    };

    const messages = {
      anchor: status === "approved" 
        ? "Congratulations! You can now start streaming and earning."
        : "Your anchor application has been rejected. Please contact support for more information.",
      agency: status === "approved"
        ? "Congratulations! You can now manage anchors and earn commissions."
        : "Your agency application has been rejected. Please contact support for more information.",
      agency_application: status === "approved"
        ? "Your upgrade to Agency has been approved! Welcome to the Agency dashboard."
        : "Your Agency upgrade application was rejected. Please try again or contact support."
    };

    return this.createNotification(
      userId,
      "approval",
      titles[approvalType],
      messages[approvalType],
      { approval_type: approvalType, status }
    );
  },

  async notifyWithdrawalStatus(
    userId: string,
    amount: number,
    status: "approved" | "rejected" | "processing"
  ) {
    const titles = {
      approved: "✅ Withdrawal Approved",
      rejected: "❌ Withdrawal Rejected",
      processing: "⏳ Withdrawal Processing"
    };

    const messages = {
      approved: `Your withdrawal request of ${amount} has been approved and will be processed shortly.`,
      rejected: `Your withdrawal request of ${amount} has been rejected. Please contact support.`,
      processing: `Your withdrawal request of ${amount} is now being processed.`
    };

    return this.createNotification(
      userId,
      "withdrawal",
      titles[status],
      messages[status],
      { amount, status }
    );
  },

  async notifyReferralEarning(userId: string, referralName: string, amount: number) {
    return this.createNotification(
      userId,
      "referral",
      "💰 Referral Earnings!",
      `${referralName} joined using your referral link. You earned ${amount} reward tokens!`,
      { referral_name: referralName, amount }
    );
  },

  async notifyTransaction(
    userId: string,
    type: "coin_purchase" | "bean_earned" | "token_reward",
    amount: number
  ) {
    const titles = {
      coin_purchase: "💎 Coins Purchased",
      bean_earned: "☕ Beans Earned",
      token_reward: "🎁 Reward Tokens Earned"
    };

    const messages = {
      coin_purchase: `You purchased ${amount} coins successfully.`,
      bean_earned: `You earned ${amount} beans!`,
      token_reward: `You received ${amount} reward tokens!`
    };

    return this.createNotification(
      userId,
      "transaction",
      titles[type],
      messages[type],
      { transaction_type: type, amount }
    );
  },

  async sendSystemAnnouncement(title: string, message: string, targetUserIds?: string[]) {
    try {
      if (targetUserIds && targetUserIds.length > 0) {
        // Send to specific users
        const notifications = targetUserIds.map(userId => ({
          user_id: userId,
          type: "system" as NotificationType,
          title,
          message,
          read: false
        }));

        const { error } = await supabase
          .from("notifications")
          .insert(notifications);

        if (error) throw error;
      } else {
        // Broadcast to all users
        const { data: users, error: usersError } = await supabase
          .from("profiles")
          .select("id");

        if (usersError) throw usersError;

        const notifications = (users || []).map(user => ({
          user_id: user.id,
          type: "system" as NotificationType,
          title,
          message,
          read: false
        }));

        const { error } = await supabase
          .from("notifications")
          .insert(notifications);

        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Send system announcement error:", error);
      return { success: false, error };
    }
  }
};