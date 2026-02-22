import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Referral = Database["public"]["Tables"]["referrals"]["Row"];
type ReferralEarning = Database["public"]["Tables"]["referral_earnings"]["Row"];

export const referralService = {
  async getReferralCode(userId: string): Promise<{ data: string | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return { data: data?.referral_code || null, error: null };
    } catch (error) {
      console.error("Error fetching referral code:", error);
      return { data: null, error };
    }
  },

  async getReferrals(userId: string): Promise<{ data: Referral[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("referrals")
        .select(`
          *,
          referred_user:profiles!referrals_referred_id_fkey(
            id,
            full_name,
            email,
            created_at
          )
        `)
        .eq("referrer_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching referrals:", error);
      return { data: null, error };
    }
  },

  async getReferralEarnings(userId: string): Promise<{ data: ReferralEarning[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("referral_earnings")
        .select("*")
        .eq("referrer_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching referral earnings:", error);
      return { data: null, error };
    }
  },

  async getTotalReferralEarnings(userId: string): Promise<{ data: number; error: any }> {
    try {
      const { data, error } = await supabase
        .from("referral_earnings")
        .select("amount")
        .eq("referrer_id", userId);

      if (error) throw error;

      const total = data?.reduce((sum, earning) => sum + earning.amount, 0) || 0;
      return { data: total, error: null };
    } catch (error) {
      console.error("Error calculating total referral earnings:", error);
      return { data: 0, error };
    }
  },

  async processReferralReward(
    spenderUserId: string,
    spentAmount: number
  ): Promise<{ success: boolean; error?: any }> {
    try {
      // Calculate reward tokens (40 tokens per 1 USDT equivalent)
      const rewardTokens = spentAmount * 40;

      // Distribution percentages
      const distributions = {
        user: rewardTokens * 0.2, // 20%
        referral_pool: rewardTokens * 0.1, // 10%
      };

      // Credit user
      const { error: userError } = await supabase.from("transactions").insert({
        user_id: spenderUserId,
        transaction_type: "token_reward",
        currency: "reward_tokens",
        amount: distributions.user,
        balance_before: 0,
        balance_after: 0,
        metadata: { description: "Reward tokens from spending" },
      });

      if (userError) throw userError;

      // Get user's referrer chain (up to 10 levels)
      const { data: referrer, error: referrerError } = await supabase
        .from("referrals")
        .select("referrer_id, level")
        .eq("referred_id", spenderUserId)
        .order("level", { ascending: true })
        .limit(10);

      if (referrerError) throw referrerError;

      // Distribute to referrers (5% split across 10 levels)
      if (referrer && referrer.length > 0) {
        const perLevelReward = distributions.referral_pool / referrer.length;

        for (const ref of referrer) {
          // Check if transaction insertion works, need a placeholder for transaction_id if required by DB constraint
          // referral_earnings requires transaction_id, which we don't have yet.
          // For now, we'll insert transaction first
          
          const { data: tx, error: txError } = await supabase.from("transactions").insert({
            user_id: ref.referrer_id,
            transaction_type: "referral_bonus",
            currency: "reward_tokens",
            amount: perLevelReward,
            balance_before: 0,
            balance_after: 0,
            metadata: { description: `Referral reward from level ${ref.level}` },
          }).select().single();
          
          if (!txError && tx) {
             await supabase.from("referral_earnings").insert({
              referrer_id: ref.referrer_id,
              referred_id: spenderUserId,
              transaction_id: tx.id,
              amount: perLevelReward,
              percentage: 5, // Simplified
              level: ref.level,
            });
          }
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error processing referral reward:", error);
      return { success: false, error };
    }
  },
};