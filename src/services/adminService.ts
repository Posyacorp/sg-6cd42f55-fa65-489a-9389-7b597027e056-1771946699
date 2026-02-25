import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type AdminAction = Database["public"]["Tables"]["admin_actions"]["Row"];
type UserActivityLog = Database["public"]["Tables"]["user_activity_logs"]["Row"];
type EmailNotification = Database["public"]["Tables"]["email_notifications"]["Row"];

export interface UserWithStats extends Profile {
  total_activity_count?: number;
  last_activity?: string;
}

export interface BulkActionResult {
  success: number;
  failed: number;
  errors: string[];
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  bannedUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  totalAnchors: number;
  totalAgencies: number;
  usersByRole: {
    user: number;
    anchor: number;
    agency: number;
    admin: number;
  };
}

export interface AdvancedFilters {
  search?: string;
  role?: string;
  status?: string;
  joinDateFrom?: string;
  joinDateTo?: string;
  lastLoginFrom?: string;
  lastLoginTo?: string;
}

export const adminService = {
  // ============ USER MANAGEMENT ============
  
  async getAllUsers(filters?: AdvancedFilters) {
    try {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply filters
      if (filters?.search) {
        query = query.or(`email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`);
      }

      if (filters?.role && filters.role !== "all") {
        query = query.eq("role", filters.role);
      }

      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters?.joinDateFrom) {
        query = query.gte("created_at", filters.joinDateFrom);
      }

      if (filters?.joinDateTo) {
        query = query.lte("created_at", filters.joinDateTo);
      }

      if (filters?.lastLoginFrom) {
        query = query.gte("last_login_at", filters.lastLoginFrom);
      }

      if (filters?.lastLoginTo) {
        query = query.lte("last_login_at", filters.lastLoginTo);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      return { data: null, error };
    }
  },

  async getUserById(userId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error in getUserById:", error);
      return { data: null, error };
    }
  },

  async updateUserRole(userId: string, newRole: string, adminId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      await this.logAdminAction({
        admin_id: adminId,
        action_type: "role_change",
        target_user_id: userId,
        details: { new_role: newRole },
      });

      return { data, error: null };
    } catch (error) {
      console.error("Error in updateUserRole:", error);
      return { data: null, error };
    }
  },

  async banUser(userId: string, reason: string, adminId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          status: "banned",
          banned_at: new Date().toISOString(),
          banned_by: adminId,
          ban_reason: reason,
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      await this.logAdminAction({
        admin_id: adminId,
        action_type: "ban",
        target_user_id: userId,
        details: { reason },
      });

      return { data, error: null };
    } catch (error) {
      console.error("Error in banUser:", error);
      return { data: null, error };
    }
  },

  async unbanUser(userId: string, adminId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          status: "active",
          banned_at: null,
          banned_by: null,
          ban_reason: null,
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      await this.logAdminAction({
        admin_id: adminId,
        action_type: "unban",
        target_user_id: userId,
        details: {},
      });

      return { data, error: null };
    } catch (error) {
      console.error("Error in unbanUser:", error);
      return { data: null, error };
    }
  },

  async suspendUser(userId: string, reason: string, adminId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          status: "suspended",
          ban_reason: reason,
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      await this.logAdminAction({
        admin_id: adminId,
        action_type: "suspend",
        target_user_id: userId,
        details: { reason },
      });

      return { data, error: null };
    } catch (error) {
      console.error("Error in suspendUser:", error);
      return { data: null, error };
    }
  },

  async deleteUser(userId: string, adminId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ status: "deleted" })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      await this.logAdminAction({
        admin_id: adminId,
        action_type: "delete",
        target_user_id: userId,
        details: {},
      });

      return { data, error: null };
    } catch (error) {
      console.error("Error in deleteUser:", error);
      return { data: null, error };
    }
  },

  // ============ BULK ACTIONS ============

  async bulkUpdateRole(userIds: string[], newRole: string, adminId: string): Promise<BulkActionResult> {
    const result: BulkActionResult = { success: 0, failed: 0, errors: [] };

    for (const userId of userIds) {
      const { error } = await this.updateUserRole(userId, newRole, adminId);
      if (error) {
        result.failed++;
        result.errors.push(`Failed to update ${userId}: ${error.message}`);
      } else {
        result.success++;
      }
    }

    return result;
  },

  async bulkBanUsers(userIds: string[], reason: string, adminId: string): Promise<BulkActionResult> {
    const result: BulkActionResult = { success: 0, failed: 0, errors: [] };

    for (const userId of userIds) {
      const { error } = await this.banUser(userId, reason, adminId);
      if (error) {
        result.failed++;
        result.errors.push(`Failed to ban ${userId}: ${error.message}`);
      } else {
        result.success++;
      }
    }

    return result;
  },

  async bulkSuspendUsers(userIds: string[], reason: string, adminId: string): Promise<BulkActionResult> {
    const result: BulkActionResult = { success: 0, failed: 0, errors: [] };

    for (const userId of userIds) {
      const { error } = await this.suspendUser(userId, reason, adminId);
      if (error) {
        result.failed++;
        result.errors.push(`Failed to suspend ${userId}: ${error.message}`);
      } else {
        result.success++;
      }
    }

    return result;
  },

  async bulkDeleteUsers(userIds: string[], adminId: string): Promise<BulkActionResult> {
    const result: BulkActionResult = { success: 0, failed: 0, errors: [] };

    for (const userId of userIds) {
      const { error } = await this.deleteUser(userId, adminId);
      if (error) {
        result.failed++;
        result.errors.push(`Failed to delete ${userId}: ${error.message}`);
      } else {
        result.success++;
      }
    }

    return result;
  },

  // ============ USER ACTIVITY ============

  async logUserActivity(
    userId: string,
    activityType: string,
    details: any = {}
  ): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase.from("user_activity_logs").insert({
        user_id: userId,
        activity_type: activityType,
        details,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error logging user activity:", error);
      return { success: false, error };
    }
  },

  async getUserActivityLogs(userId: string, limit = 50) {
    try {
      const { data, error } = await supabase
        .from("user_activity_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error getting user activity logs:", error);
      return { data: null, error };
    }
  },

  // ============ ADMIN ACTIONS ============

  async logAdminAction(action: {
    admin_id: string;
    action_type: string;
    target_user_id: string;
    details: any;
  }) {
    try {
      const { error } = await supabase.from("admin_actions").insert(action);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error("Error logging admin action:", error);
      return { success: false, error };
    }
  },

  async getAdminLogs(limit = 100) {
    try {
      const { data, error } = await supabase
        .from("admin_actions")
        .select(`
          *,
          admin:profiles!admin_actions_admin_id_fkey(full_name, email),
          target:profiles!admin_actions_target_user_id_fkey(full_name, email)
        `)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error getting admin logs:", error);
      return { data: null, error };
    }
  },

  // ============ STATISTICS ============

  async getDashboardStats(): Promise<{ data: UserStatistics | null; error: any }> {
    try {
      const { data: allUsers, error: usersError } = await supabase
        .from("profiles")
        .select("role, status, created_at");

      if (usersError) throw usersError;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      const stats: UserStatistics = {
        totalUsers: allUsers?.length || 0,
        activeUsers: allUsers?.filter((u) => u.status === "active").length || 0,
        suspendedUsers: allUsers?.filter((u) => u.status === "suspended").length || 0,
        bannedUsers: allUsers?.filter((u) => u.status === "banned").length || 0,
        newUsersToday: allUsers?.filter((u) => new Date(u.created_at) >= today).length || 0,
        newUsersThisWeek: allUsers?.filter((u) => new Date(u.created_at) >= weekAgo).length || 0,
        newUsersThisMonth: allUsers?.filter((u) => new Date(u.created_at) >= monthAgo).length || 0,
        totalAnchors: allUsers?.filter((u) => u.role === "anchor").length || 0,
        totalAgencies: allUsers?.filter((u) => u.role === "agency").length || 0,
        usersByRole: {
          user: allUsers?.filter((u) => u.role === "user").length || 0,
          anchor: allUsers?.filter((u) => u.role === "anchor").length || 0,
          agency: allUsers?.filter((u) => u.role === "agency").length || 0,
          admin: allUsers?.filter((u) => u.role === "admin").length || 0,
        },
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error("Error in getDashboardStats:", error);
      return { data: null, error };
    }
  },

  async getUserGrowthData(days = 30) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group by date
      const growthData: { [key: string]: number } = {};
      data?.forEach((user) => {
        const date = new Date(user.created_at).toISOString().split("T")[0];
        growthData[date] = (growthData[date] || 0) + 1;
      });

      return { data: growthData, error: null };
    } catch (error) {
      console.error("Error getting user growth data:", error);
      return { data: null, error };
    }
  },

  // ============ EMAIL NOTIFICATIONS ============

  async sendEmailToUsers(
    recipientIds: string[],
    subject: string,
    message: string,
    adminId: string
  ) {
    try {
      const { data, error } = await supabase
        .from("email_notifications")
        .insert({
          sent_by: adminId,
          recipient_ids: recipientIds,
          subject,
          message,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      // Note: Actual email sending would be handled by an Edge Function or external service
      // For now, we just log the notification in the database

      return { data, error: null };
    } catch (error) {
      console.error("Error sending email:", error);
      return { data: null, error };
    }
  },

  async getEmailNotifications(limit = 50) {
    try {
      const { data, error } = await supabase
        .from("email_notifications")
        .select(`
          *,
          sender:profiles!email_notifications_sent_by_fkey(full_name, email)
        `)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error getting email notifications:", error);
      return { data: null, error };
    }
  },

  // ============ EXPORT ============

  async exportUsersToCSV(filters?: AdvancedFilters) {
    try {
      const { data: users, error } = await this.getAllUsers(filters);
      if (error || !users) throw error;

      // CSV headers
      const headers = [
        "ID",
        "Email",
        "Full Name",
        "Role",
        "Status",
        "Created At",
        "Last Login",
        "Ban Reason",
      ];

      // CSV rows
      const rows = users.map((user) => [
        user.id,
        user.email || "",
        user.full_name || "",
        user.role,
        user.status || "active",
        new Date(user.created_at).toLocaleString(),
        user.last_login_at ? new Date(user.last_login_at).toLocaleString() : "Never",
        user.ban_reason || "",
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `users_export_${new Date().toISOString()}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true, error: null };
    } catch (error) {
      console.error("Error exporting users:", error);
      return { success: false, error };
    }
  },

  async getUserAuthDetails(userId: string) {
    try {
      const { data, error } = await supabase.auth.admin.getUserById(userId);
      if (error) throw error;
      return { data: data.user, error: null };
    } catch (error) {
      console.error("Error fetching user auth details:", error);
      return { data: null, error };
    }
  },

  async updateUserStatus(
    userId: string,
    status: "active" | "suspended",
    adminId: string,
    reason?: string
  ) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (error) throw error;

      // Log the action
      await this.logAdminAction(adminId, "update_user_status", {
        user_id: userId,
        new_status: status,
        reason: reason || "No reason provided",
      });

      return { error: null };
    } catch (error) {
      console.error("Error updating user status:", error);
      return { error };
    }
  },

  // ============ PROXY USER CREATION ============

  async createProxyUsers(count: number, adminId: string) {
    try {
      const femaleNames = [
        "Priya", "Ananya", "Diya", "Isha", "Kavya", "Meera", "Nisha", "Pooja", 
        "Riya", "Sanya", "Tanya", "Vanya", "Zara", "Aisha", "Shruti", "Neha",
        "Sakshi", "Simran", "Kriti", "Aditi", "Rhea", "Kiara", "Mira", "Sia"
      ];

      const lastNames = [
        "Sharma", "Verma", "Singh", "Kumar", "Patel", "Reddy", "Nair", "Iyer",
        "Joshi", "Kapoor", "Malhotra", "Chopra", "Gupta", "Agarwal", "Mehta"
      ];

      const createdUsers = [];
      const errors = [];

      for (let i = 0; i < count; i++) {
        try {
          // Generate random name
          const firstName = femaleNames[Math.floor(Math.random() * femaleNames.length)];
          const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          const fullName = `${firstName} ${lastName}`;
          
          // Generate email
          const randomNum = Math.floor(Math.random() * 10000);
          const email = `${firstName.toLowerCase()}${randomNum}@pukaarly.app`;
          
          // Generate random age (21-35)
          const age = Math.floor(Math.random() * 15) + 21;
          
          // Create auth user
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password: `Proxy${randomNum}!@#`,
            email_confirm: true,
            user_metadata: {
              full_name: fullName,
              role: "anchor",
            },
          });

          if (authError) {
            errors.push(`Failed to create auth for ${email}: ${authError.message}`);
            continue;
          }

          // Create profile
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: authData.user.id,
              email,
              full_name: fullName,
              role: "anchor",
              status: "active",
              bio: `Hi! I'm ${firstName}, ${age} years old. Love connecting with new people! 💕`,
              is_proxy: true,
            })
            .select()
            .single();

          if (profileError) {
            errors.push(`Failed to create profile for ${email}: ${profileError.message}`);
            continue;
          }

          // Create wallet
          const { error: walletError } = await supabase
            .from("wallets")
            .insert({
              user_id: authData.user.id,
              coins_balance: 0,
              diamonds_balance: 0,
              beans_balance: 0,
            });

          if (walletError) {
            errors.push(`Failed to create wallet for ${email}: ${walletError.message}`);
          }

          createdUsers.push({
            id: authData.user.id,
            email,
            full_name: fullName,
            password: `Proxy${randomNum}!@#`,
          });
        } catch (error: any) {
          errors.push(`Unexpected error: ${error.message}`);
        }
      }

      // Log admin action
      await this.logAdminAction({
        admin_id: adminId,
        action_type: "create_proxy_users",
        target_user_id: adminId,
        details: {
          count_requested: count,
          count_created: createdUsers.length,
          count_failed: errors.length,
        },
      });

      return {
        success: createdUsers.length > 0,
        created: createdUsers,
        errors,
        summary: {
          total: count,
          created: createdUsers.length,
          failed: errors.length,
        },
      };
    } catch (error) {
      console.error("Error creating proxy users:", error);
      return {
        success: false,
        created: [],
        errors: [error instanceof Error ? error.message : "Unknown error"],
        summary: { total: count, created: 0, failed: count },
      };
    }
  },

  async getProxyUsers() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_proxy", true)
        .eq("role", "anchor")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error getting proxy users:", error);
      return { data: null, error };
    }
  },

  async deleteProxyUser(userId: string, adminId: string) {
    try {
      // Delete from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      // Profile will be deleted via CASCADE

      await this.logAdminAction({
        admin_id: adminId,
        action_type: "delete_proxy_user",
        target_user_id: userId,
        details: {},
      });

      return { success: true, error: null };
    } catch (error) {
      console.error("Error deleting proxy user:", error);
      return { success: false, error };
    }
  },
};