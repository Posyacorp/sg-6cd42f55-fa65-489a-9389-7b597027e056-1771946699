import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { walletService } from "./walletService";
import { rewardService } from "./rewardService";

type Gift = Database["public"]["Tables"]["gifts"]["Row"];
type GiftTransaction = Database["public"]["Tables"]["gift_transactions"]["Row"];

export const giftService = {
  async getAllGifts(): Promise<{ data: Gift[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("gifts")
        .select("*")
        .eq("active", true)
        .order("price", { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching gifts:", error);
      return { data: null, error };
    }
  },

  async sendGift(
    senderId: string,
    receiverId: string,
    giftId: string,
    quantity: number = 1
  ): Promise<{ success: boolean; error?: any }> {
    try {
      // Get gift details
      const { data: gift, error: giftError } = await supabase
        .from("gifts")
        .select("*")
        .eq("id", giftId)
        .single();

      if (giftError || !gift) throw new Error("Gift not found");

      const totalCost = gift.price * quantity;

      // Check sender balance
      const { data: balance } = await walletService.getBalance(senderId);
      if (!balance || balance.coins < totalCost) {
        throw new Error("Insufficient coins balance");
      }

      // Deduct coins from sender
      await walletService.addTransaction(senderId, {
        type: "debit",
        currency: "coins",
        amount: totalCost,
        description: `Sent ${quantity}x ${gift.name} to user`,
        reference_id: receiverId,
      });

      // Credit beans to receiver
      const beansValue = totalCost; // 1:1 conversion
      await walletService.addTransaction(receiverId, {
        type: "credit",
        currency: "beans",
        amount: beansValue,
        description: `Received ${quantity}x ${gift.name}`,
        reference_id: senderId,
      });

      // Record gift transaction
      await supabase.from("gift_transactions").insert({
        sender_id: senderId,
        receiver_id: receiverId,
        gift_id: giftId,
        quantity,
        total_price: totalCost,
      });

      // Get receiver's anchor profile (if anchor)
      const { data: anchorProfile } = await supabase
        .from("anchor_profiles")
        .select("agency_id")
        .eq("user_id", receiverId)
        .single();

      // Distribute rewards
      await rewardService.distributeRewards(
        senderId,
        receiverId,
        anchorProfile?.agency_id || null,
        totalCost,
        "coins"
      );

      return { success: true };
    } catch (error) {
      console.error("Error sending gift:", error);
      return { success: false, error };
    }
  },

  async getGiftHistory(
    userId: string,
    type: "sent" | "received"
  ): Promise<{ data: GiftTransaction[] | null; error: any }> {
    try {
      const column = type === "sent" ? "sender_id" : "receiver_id";

      const { data, error } = await supabase
        .from("gift_transactions")
        .select(`
          *,
          gift:gifts(*),
          sender:profiles!gift_transactions_sender_id_fkey(full_name, email),
          receiver:profiles!gift_transactions_receiver_id_fkey(full_name, email)
        `)
        .eq(column, userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching gift history:", error);
      return { data: null, error };
    }
  },
};