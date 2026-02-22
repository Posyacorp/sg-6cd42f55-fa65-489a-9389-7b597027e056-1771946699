 
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string | null
          details: Json | null
          id: string
          target_user_id: string
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_user_id: string
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_actions_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_commissions: {
        Row: {
          agency_id: string | null
          amount: number
          anchor_id: string | null
          commission_rate: number
          created_at: string | null
          id: string
          transaction_id: string | null
        }
        Insert: {
          agency_id?: string | null
          amount: number
          anchor_id?: string | null
          commission_rate: number
          created_at?: string | null
          id?: string
          transaction_id?: string | null
        }
        Update: {
          agency_id?: string | null
          amount?: number
          anchor_id?: string | null
          commission_rate?: number
          created_at?: string | null
          id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agency_commissions_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agency_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agency_commissions_anchor_id_fkey"
            columns: ["anchor_id"]
            isOneToOne: false
            referencedRelation: "anchor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agency_commissions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_profiles: {
        Row: {
          agency_name: string
          commission_rate: number | null
          created_at: string | null
          description: string | null
          id: string
          is_verified: boolean | null
          logo_url: string | null
          total_anchors: number | null
          total_commission: number | null
          updated_at: string | null
        }
        Insert: {
          agency_name: string
          commission_rate?: number | null
          created_at?: string | null
          description?: string | null
          id: string
          is_verified?: boolean | null
          logo_url?: string | null
          total_anchors?: number | null
          total_commission?: number | null
          updated_at?: string | null
        }
        Update: {
          agency_name?: string
          commission_rate?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          total_anchors?: number | null
          total_commission?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agency_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      anchor_profiles: {
        Row: {
          agency_id: string | null
          avatar_url: string | null
          bio: string | null
          call_price_per_minute: number | null
          cover_image_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          is_online: boolean | null
          is_verified: boolean | null
          last_online_at: string | null
          level: number | null
          rating: number | null
          total_calls: number | null
          total_earnings: number | null
          total_minutes: number | null
          total_ratings: number | null
          updated_at: string | null
          video_call_enabled: boolean | null
          voice_call_enabled: boolean | null
        }
        Insert: {
          agency_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          call_price_per_minute?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          is_online?: boolean | null
          is_verified?: boolean | null
          last_online_at?: string | null
          level?: number | null
          rating?: number | null
          total_calls?: number | null
          total_earnings?: number | null
          total_minutes?: number | null
          total_ratings?: number | null
          updated_at?: string | null
          video_call_enabled?: boolean | null
          voice_call_enabled?: boolean | null
        }
        Update: {
          agency_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          call_price_per_minute?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_online?: boolean | null
          is_verified?: boolean | null
          last_online_at?: string | null
          level?: number | null
          rating?: number | null
          total_calls?: number | null
          total_earnings?: number | null
          total_minutes?: number | null
          total_ratings?: number | null
          updated_at?: string | null
          video_call_enabled?: boolean | null
          voice_call_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "anchor_profiles_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anchor_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      call_sessions: {
        Row: {
          anchor_id: string | null
          call_type: string | null
          cost_coins: number | null
          created_at: string | null
          duration_minutes: number | null
          earnings_beans: number | null
          end_time: string | null
          id: string
          rating: number | null
          review: string | null
          start_time: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          anchor_id?: string | null
          call_type?: string | null
          cost_coins?: number | null
          created_at?: string | null
          duration_minutes?: number | null
          earnings_beans?: number | null
          end_time?: string | null
          id?: string
          rating?: number | null
          review?: string | null
          start_time?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          anchor_id?: string | null
          call_type?: string | null
          cost_coins?: number | null
          created_at?: string | null
          duration_minutes?: number | null
          earnings_beans?: number | null
          end_time?: string | null
          id?: string
          rating?: number | null
          review?: string | null
          start_time?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_sessions_anchor_id_fkey"
            columns: ["anchor_id"]
            isOneToOne: false
            referencedRelation: "anchor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_at: string | null
          user1_id: string | null
          user2_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          recipient_ids: string[]
          sent_at: string | null
          sent_by: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          recipient_ids: string[]
          sent_at?: string | null
          sent_by: string
          status?: string
          subject: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          recipient_ids?: string[]
          sent_at?: string | null
          sent_by?: string
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_notifications_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_transactions: {
        Row: {
          created_at: string | null
          gift_id: string | null
          id: string
          message: string | null
          quantity: number | null
          receiver_id: string | null
          sender_id: string | null
          total_beans: number
          total_coins: number
          transaction_id: string | null
        }
        Insert: {
          created_at?: string | null
          gift_id?: string | null
          id?: string
          message?: string | null
          quantity?: number | null
          receiver_id?: string | null
          sender_id?: string | null
          total_beans: number
          total_coins: number
          transaction_id?: string | null
        }
        Update: {
          created_at?: string | null
          gift_id?: string | null
          id?: string
          message?: string | null
          quantity?: number | null
          receiver_id?: string | null
          sender_id?: string | null
          total_beans?: number
          total_coins?: number
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gift_transactions_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "gifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_transactions_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_transactions_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_transactions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      gifts: {
        Row: {
          bean_value: number
          category: string | null
          coin_price: number
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          bean_value: number
          category?: string | null
          coin_price: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          bean_value?: number
          category?: string | null
          coin_price?: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message_text: string
          read_at: string | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_text: string
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_text?: string
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          ban_reason: string | null
          banned_at: string | null
          banned_by: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          last_login_at: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          ban_reason?: string | null
          banned_at?: string | null
          banned_by?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          last_login_at?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          ban_reason?: string | null
          banned_at?: string | null
          banned_by?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          last_login_at?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_banned_by_fkey"
            columns: ["banned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_earnings: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          level: number
          percentage: number
          referred_id: string | null
          referrer_id: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          level: number
          percentage: number
          referred_id?: string | null
          referrer_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          level?: number
          percentage?: number
          referred_id?: string | null
          referrer_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_earnings_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_earnings_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_earnings_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          level: number
          referred_id: string | null
          referrer_id: string | null
          status: string | null
          total_earned: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level?: number
          referred_id?: string | null
          referrer_id?: string | null
          status?: string | null
          total_earned?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number
          referred_id?: string | null
          referrer_id?: string | null
          status?: string | null
          total_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string | null
          currency: string
          id: string
          metadata: Json | null
          related_user_id: string | null
          status: string | null
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string | null
          currency: string
          id?: string
          metadata?: Json | null
          related_user_id?: string | null
          status?: string | null
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string | null
          currency?: string
          id?: string
          metadata?: Json | null
          related_user_id?: string | null
          status?: string | null
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_related_user_id_fkey"
            columns: ["related_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          action_details: Json | null
          action_type: string
          created_at: string | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_balances: {
        Row: {
          beans: number | null
          coins: number | null
          created_at: string | null
          id: string
          reward_tokens: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          beans?: number | null
          coins?: number | null
          created_at?: string | null
          id?: string
          reward_tokens?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          beans?: number | null
          coins?: number | null
          created_at?: string | null
          id?: string
          reward_tokens?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_balances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          admin_id: string | null
          admin_notes: string | null
          amount: number
          created_at: string | null
          id: string
          payment_method: string | null
          processed_at: string | null
          status: string | null
          updated_at: string | null
          usdt_equivalent: number | null
          user_id: string | null
          wallet_address: string | null
          withdrawal_type: string
        }
        Insert: {
          admin_id?: string | null
          admin_notes?: string | null
          amount: number
          created_at?: string | null
          id?: string
          payment_method?: string | null
          processed_at?: string | null
          status?: string | null
          updated_at?: string | null
          usdt_equivalent?: number | null
          user_id?: string | null
          wallet_address?: string | null
          withdrawal_type: string
        }
        Update: {
          admin_id?: string | null
          admin_notes?: string | null
          amount?: number
          created_at?: string | null
          id?: string
          payment_method?: string | null
          processed_at?: string | null
          status?: string | null
          updated_at?: string | null
          usdt_equivalent?: number | null
          user_id?: string | null
          wallet_address?: string | null
          withdrawal_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "withdrawal_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
