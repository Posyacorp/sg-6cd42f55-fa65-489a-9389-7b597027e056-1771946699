import { supabase } from "@/integrations/supabase/client";
import { walletService } from "./walletService";
import { referralService } from "./referralService";

export interface RewardDistribution {
  admin: number;
  anchor: number;
  agency: number;
  user: number;
  referral_pool: number;
}

export const rewardService = {
  async distributeRewards(
    userId: string,
    anchorId: string,
    agencyId: string | null,
    spentAmount: number,
    spentCurrency: "coins" | "beans"
  ): Promise<{ success: boolean; error?: any }> {
    try {
      // Mint 40 tokens per 1 USDT equivalent
      const totalTokens = spentAmount * 40;

      // Distribution percentages
      const distribution: RewardDistribution = {
        admin: totalTokens * 0.1, // 10%
        anchor: totalTokens * 0.5, // 50%
        agency: totalTokens * 0.1, // 10%
        user: totalTokens * 0.2, // 20%
        referral_pool: totalTokens * 0.1, // 10%
      };

      // Get admin user (first admin in system)
      const { data: adminUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "admin")
        .limit(1)
        .single();

      if (!adminUser) {
        throw new Error("No admin user found");
      }

      // Distribute to admin
      await walletService.addTransaction(adminUser.id, {
        type: "credit",
        currency: "reward_tokens",
        amount: distribution.admin,
        description: `Platform fee from transaction`,
        reference_id: userId,
      });

      // Distribute to anchor
      await walletService.addTransaction(anchorId, {
        type: "credit",
        currency: "reward_tokens",
        amount: distribution.anchor,
        description: `Reward from call/service`,
        reference_id: userId,
      });

      // Distribute to agency (if exists)
      if (agencyId) {
        await walletService.addTransaction(agencyId, {
          type: "credit",
          currency: "reward_tokens",
          amount: distribution.agency,
          description: `Commission from anchor earnings`,
          reference_id: anchorId,
        });
      }

      // Distribute to user
      await walletService.addTransaction(userId, {
        type: "credit",
        currency: "reward_tokens",
        amount: distribution.user,
        description: `Cashback reward`,
      });

      // Process referral rewards
      await referralService.processReferralReward(userId, spentAmount);

      // Log the reward distribution
      await supabase.from("user_activity_logs").insert({
        user_id: userId,
        activity_type: "reward_distribution",
        details: {
          spent_amount: spentAmount,
          spent_currency: spentCurrency,
          total_tokens: totalTokens,
          distribution: distribution as unknown as any, // Cast to any to satisfy Json type
        },
      });

      return { success: true };
    } catch (error) {
      console.error("Error distributing rewards:", error);
      return { success: false, error };
    }
  },

  async getRewardHistory(userId: string): Promise<{ data: any[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .eq("currency", "reward_tokens")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching reward history:", error);
      return { data: null, error };
    }
  },
};