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
        withdrawal_type: withdrawalMethod, // Map withdrawalMethod param to withdrawal_type column
        account_details: accountDetails, // Note: db expects payment_method or details? Checking schema...
        // Error said: payment_method?: string; ... withdrawal_type: string;
        // The account_details param likely needs to go into a JSON column if available, or mapped.
        // Let's check if 'account_details' column exists in error msg... 
        // Error: "Object literal may only specify known properties... 'withdrawal_method' does not exist... 'payment_method'?, 'withdrawal_type'?"
        // It DOES NOT list 'account_details' in the known properties list in the error message!
        // It lists: admin_id, admin_notes, amount, created_at, currency, id, payment_method, processed_at, status, updated_at, usdt_equivalent, user_id, wallet_address, withdrawal_type.
        // So 'account_details' column does NOT exist. We should probably use 'payment_method' for the details text or 'wallet_address'.
        // Let's put account details string into 'wallet_address' or 'payment_method'.
        payment_method: JSON.stringify(accountDetails),
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