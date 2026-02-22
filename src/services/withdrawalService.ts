import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type WithdrawalRequest = Database["public"]["Tables"]["withdrawal_requests"]["Row"];

export const withdrawalService = {
  async createWithdrawal(
    userId: string,
    amount: number,
    currency: "beans" | "reward_tokens",
    withdrawalMethod: string,
    accountDetails: Record<string, any>
  ): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase.from("withdrawal_requests").insert({
        user_id: userId,
        amount,
        currency,
        withdrawal_method: withdrawalMethod,
        account_details: accountDetails,
        status: "pending",
      });

      if (error) throw error;

      // Log activity
      await supabase.from("user_activity_logs").insert({
        user_id: userId,
        activity_type: "withdrawal_request",
        details: {
          amount,
          currency,
          withdrawal_method: withdrawalMethod,
        },
      });

      return { success: true };
    } catch (error) {
      console.error("Error creating withdrawal:", error);
      return { success: false, error };
    }
  },

  async getWithdrawals(userId: string): Promise<{ data: WithdrawalRequest[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("withdrawal_requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      return { data: null, error };
    }
  },

  async getAllWithdrawals(
    status?: "pending" | "approved" | "rejected"
  ): Promise<{ data: WithdrawalRequest[] | null; error: any }> {
    try {
      let query = supabase
        .from("withdrawal_requests")
        .select(`
          *,
          user:profiles!withdrawal_requests_user_id_fkey(full_name, email, role)
        `)
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching all withdrawals:", error);
      return { data: null, error };
    }
  },

  async approveWithdrawal(
    withdrawalId: string,
    adminId: string,
    transactionHash?: string
  ): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from("withdrawal_requests")
        .update({
          status: "approved",
          processed_by: adminId,
          processed_at: new Date().toISOString(),
          transaction_hash: transactionHash,
        })
        .eq("id", withdrawalId);

      if (error) throw error;

      // Log admin action
      await supabase.from("admin_actions").insert({
        admin_id: adminId,
        action_type: "withdrawal_approved",
        target_user_id: withdrawalId,
        details: { transaction_hash: transactionHash },
      });

      return { success: true };
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      return { success: false, error };
    }
  },

  async rejectWithdrawal(
    withdrawalId: string,
    adminId: string,
    rejectionReason: string
  ): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from("withdrawal_requests")
        .update({
          status: "rejected",
          processed_by: adminId,
          processed_at: new Date().toISOString(),
          rejection_reason: rejectionReason,
        })
        .eq("id", withdrawalId);

      if (error) throw error;

      // Log admin action
      await supabase.from("admin_actions").insert({
        admin_id: adminId,
        action_type: "withdrawal_rejected",
        target_user_id: withdrawalId,
        details: { rejection_reason: rejectionReason },
      });

      return { success: true };
    } catch (error) {
      console.error("Error rejecting withdrawal:", error);
      return { success: false, error };
    }
  },
};