import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type WalletBalance = Database["public"]["Tables"]["wallet_balances"]["Row"];
type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

export interface WalletData {
  coins: number;
  beans: number;
  reward_tokens: number;
}

export interface TransactionData {
  type: "credit" | "debit";
  currency: "coins" | "beans" | "reward_tokens";
  amount: number;
  description: string;
  reference_id?: string;
}

export const walletService = {
  async getBalance(userId: string): Promise<{ data: WalletData | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("wallet_balances")
        .select("coins, beans, reward_tokens")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      return { data: null, error };
    }
  },

  async getTransactions(
    userId: string,
    limit = 50
  ): Promise<{ data: Transaction[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return { data: null, error };
    }
  },

  async addTransaction(
    userId: string,
    transactionData: TransactionData
  ): Promise<{ success: boolean; error?: any }> {
    try {
      // Insert transaction
      const { error: txError } = await supabase.from("transactions").insert({
        user_id: userId,
        type: transactionData.type,
        currency: transactionData.currency,
        amount: transactionData.amount,
        description: transactionData.description,
        reference_id: transactionData.reference_id,
      });

      if (txError) throw txError;

      // Update wallet balance
      const increment = transactionData.type === "credit" ? transactionData.amount : -transactionData.amount;
      const { error: balanceError } = await supabase.rpc("update_wallet_balance", {
        p_user_id: userId,
        p_currency: transactionData.currency,
        p_amount: increment,
      });

      if (balanceError) throw balanceError;

      return { success: true };
    } catch (error) {
      console.error("Error adding transaction:", error);
      return { success: false, error };
    }
  },

  async transferCoins(
    fromUserId: string,
    toUserId: string,
    amount: number,
    description: string
  ): Promise<{ success: boolean; error?: any }> {
    try {
      // Debit from sender
      await this.addTransaction(fromUserId, {
        type: "debit",
        currency: "coins",
        amount,
        description: `Transfer to user: ${description}`,
      });

      // Credit to receiver
      await this.addTransaction(toUserId, {
        type: "credit",
        currency: "coins",
        amount,
        description: `Transfer from user: ${description}`,
      });

      return { success: true };
    } catch (error) {
      console.error("Error transferring coins:", error);
      return { success: false, error };
    }
  },
};