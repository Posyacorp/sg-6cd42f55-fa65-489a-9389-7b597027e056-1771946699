import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
type AdminAction = Database["public"]["Tables"]["admin_actions"]["Insert"];

export interface UserWithStats extends Profile {
  total_referrals?: number;
  total_earnings?: number;
}

export const adminService = {
  /**
   * Get all users with optional filtering
   */
  async getAllUsers(filters?: {
    role?: string;
    status?: string;
    search?: string;
  }): Promise<{ data: UserWithStats[] | null; error: any }> {
    try {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.role && filters.role !== "all") {
        query = query.eq("role", filters.role);
      }

      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters?.search) {
        query = query.or(
          `email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching users:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      return { data: null, error };
    }
  },

  /**
   * Get user by ID with full details
   */
  async getUserById(userId: string): Promise<{ data: Profile | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error in getUserById:", error);
      return { data: null, error };
    }
  },

  /**
   * Update user role
   */
  async updateUserRole(
    userId: string,
    newRole: string,
    adminId: string
  ): Promise<{ success: boolean; error: any }> {
    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating user role:", updateError);
        return { success: false, error: updateError };
      }

      // Log admin action
      await this.logAdminAction({
        admin_id: adminId,
        action_type: "role_change",
        target_user_id: userId,
        details: { new_role: newRole },
      });

      return { success: true, error: null };
    } catch (error) {
      console.error("Error in updateUserRole:", error);
      return { success: false, error };
    }
  },

  /**
   * Ban user
   */
  async banUser(
    userId: string,
    reason: string,
    adminId: string
  ): Promise<{ success: boolean; error: any }> {
    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          status: "banned",
          banned_at: new Date().toISOString(),
          banned_by: adminId,
          ban_reason: reason,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Error banning user:", updateError);
        return { success: false, error: updateError };
      }

      // Log admin action
      await this.logAdminAction({
        admin_id: adminId,
        action_type: "ban",
        target_user_id: userId,
        details: { reason },
      });

      return { success: true, error: null };
    } catch (error) {
      console.error("Error in banUser:", error);
      return { success: false, error };
    }
  },

  /**
   * Unban user
   */
  async unbanUser(
    userId: string,
    adminId: string
  ): Promise<{ success: boolean; error: any }> {
    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          status: "active",
          banned_at: null,
          banned_by: null,
          ban_reason: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Error unbanning user:", updateError);
        return { success: false, error: updateError };
      }

      // Log admin action
      await this.logAdminAction({
        admin_id: adminId,
        action_type: "unban",
        target_user_id: userId,
        details: {},
      });

      return { success: true, error: null };
    } catch (error) {
      console.error("Error in unbanUser:", error);
      return { success: false, error };
    }
  },

  /**
   * Suspend user temporarily
   */
  async suspendUser(
    userId: string,
    reason: string,
    adminId: string
  ): Promise<{ success: boolean; error: any }> {
    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          status: "suspended",
          ban_reason: reason,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Error suspending user:", updateError);
        return { success: false, error: updateError };
      }

      // Log admin action
      await this.logAdminAction({
        admin_id: adminId,
        action_type: "suspend",
        target_user_id: userId,
        details: { reason },
      });

      return { success: true, error: null };
    } catch (error) {
      console.error("Error in suspendUser:", error);
      return { success: false, error };
    }
  },

  /**
   * Delete user (soft delete - keep for audit trail)
   */
  async deleteUser(
    userId: string,
    adminId: string
  ): Promise<{ success: boolean; error: any }> {
    try {
      // Log admin action first
      await this.logAdminAction({
        admin_id: adminId,
        action_type: "delete",
        target_user_id: userId,
        details: {},
      });

      // In production, you might want to soft delete instead of hard delete
      // For now, we'll mark as deleted in status
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          status: "deleted",
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Error deleting user:", updateError);
        return { success: false, error: updateError };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Error in deleteUser:", error);
      return { success: false, error };
    }
  },

  /**
   * Log admin action for audit trail
   */
  async logAdminAction(action: AdminAction): Promise<void> {
    try {
      const { error } = await supabase.from("admin_actions").insert(action);

      if (error) {
        console.error("Error logging admin action:", error);
      }
    } catch (error) {
      console.error("Error in logAdminAction:", error);
    }
  },

  /**
   * Get admin action logs
   */
  async getAdminLogs(filters?: {
    adminId?: string;
    actionType?: string;
    limit?: number;
  }): Promise<{ data: any[] | null; error: any }> {
    try {
      let query = supabase
        .from("admin_actions")
        .select("*, admin:profiles!admin_actions_admin_id_fkey(full_name, email)")
        .order("created_at", { ascending: false });

      if (filters?.adminId) {
        query = query.eq("admin_id", filters.adminId);
      }

      if (filters?.actionType) {
        query = query.eq("action_type", filters.actionType);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching admin logs:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error in getAdminLogs:", error);
      return { data: null, error };
    }
  },

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{
    data: {
      totalUsers: number;
      activeUsers: number;
      bannedUsers: number;
      suspendedUsers: number;
      totalAnchors: number;
      totalAgencies: number;
    } | null;
    error: any;
  }> {
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("role, status");

      if (error) {
        console.error("Error fetching dashboard stats:", error);
        return { data: null, error };
      }

      const stats = {
        totalUsers: profiles?.length || 0,
        activeUsers: profiles?.filter((p) => p.status === "active").length || 0,
        bannedUsers: profiles?.filter((p) => p.status === "banned").length || 0,
        suspendedUsers: profiles?.filter((p) => p.status === "suspended").length || 0,
        totalAnchors: profiles?.filter((p) => p.role === "anchor").length || 0,
        totalAgencies: profiles?.filter((p) => p.role === "agency").length || 0,
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error("Error in getDashboardStats:", error);
      return { data: null, error };
    }
  },
};