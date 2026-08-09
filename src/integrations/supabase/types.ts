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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string
          details: string
          file_type: string | null
          file_url: string | null
          id: string
          label: string
          preview_image_url: string | null
          sort_order: number
          team: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          details?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          label?: string
          preview_image_url?: string | null
          sort_order?: number
          team?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          details?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          label?: string
          preview_image_url?: string | null
          sort_order?: number
          team?: string | null
          title?: string
        }
        Relationships: []
      }
      admin_login_logs: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          details: Json
          entity: string | null
          entity_id: string | null
          id: string
          ip_address: string | null
          request_id: string | null
          session_id: string | null
          status: string
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          details?: Json
          entity?: string | null
          entity_id?: string | null
          id?: string
          ip_address?: string | null
          request_id?: string | null
          session_id?: string | null
          status?: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          details?: Json
          entity?: string | null
          entity_id?: string | null
          id?: string
          ip_address?: string | null
          request_id?: string | null
          session_id?: string | null
          status?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      blockchain_config: {
        Row: {
          chain_id: number
          contract_address: string | null
          contract_verified_at: string | null
          created_at: string
          deployed_at: string | null
          deployment_block: number | null
          deployment_tx: string | null
          id: string
          is_active: boolean
          last_sync_at: string | null
          network: string
          owner_wallet: string | null
          portfolio_id: string
          updated_at: string
        }
        Insert: {
          chain_id?: number
          contract_address?: string | null
          contract_verified_at?: string | null
          created_at?: string
          deployed_at?: string | null
          deployment_block?: number | null
          deployment_tx?: string | null
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          network?: string
          owner_wallet?: string | null
          portfolio_id: string
          updated_at?: string
        }
        Update: {
          chain_id?: number
          contract_address?: string | null
          contract_verified_at?: string | null
          created_at?: string
          deployed_at?: string | null
          deployment_block?: number | null
          deployment_tx?: string | null
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          network?: string
          owner_wallet?: string | null
          portfolio_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      blockchain_records: {
        Row: {
          block_number: number | null
          chain_id: number
          content_hash: string
          contract_address: string | null
          created_at: string
          entity_id: string | null
          entity_table: string | null
          id: string
          metadata: Json
          network: string
          owner_wallet: string | null
          record_type: string
          registered_at: string | null
          status: string
          title: string
          tx_hash: string | null
          updated_at: string
          verification_id: string
          version: number
        }
        Insert: {
          block_number?: number | null
          chain_id?: number
          content_hash: string
          contract_address?: string | null
          created_at?: string
          entity_id?: string | null
          entity_table?: string | null
          id?: string
          metadata?: Json
          network?: string
          owner_wallet?: string | null
          record_type: string
          registered_at?: string | null
          status?: string
          title?: string
          tx_hash?: string | null
          updated_at?: string
          verification_id: string
          version?: number
        }
        Update: {
          block_number?: number | null
          chain_id?: number
          content_hash?: string
          contract_address?: string | null
          created_at?: string
          entity_id?: string | null
          entity_table?: string | null
          id?: string
          metadata?: Json
          network?: string
          owner_wallet?: string | null
          record_type?: string
          registered_at?: string | null
          status?: string
          title?: string
          tx_hash?: string | null
          updated_at?: string
          verification_id?: string
          version?: number
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          description: string
          file_type: string | null
          file_url: string | null
          id: string
          issuer: string
          preview_image_url: string | null
          skills: string[]
          sort_order: number
          title: string
          year: string
        }
        Insert: {
          created_at?: string
          description?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          issuer?: string
          preview_image_url?: string | null
          skills?: string[]
          sort_order?: number
          title: string
          year?: string
        }
        Update: {
          created_at?: string
          description?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          issuer?: string
          preview_image_url?: string | null
          skills?: string[]
          sort_order?: number
          title?: string
          year?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          description: string
          id: string
          sort_order: number
          title: string
          year: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          sort_order?: number
          title: string
          year: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          sort_order?: number
          title?: string
          year?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          description: string
          full_description: string
          id: string
          milestones: string[]
          sort_order: number
          timeline: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          full_description?: string
          id?: string
          milestones?: string[]
          sort_order?: number
          timeline?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          full_description?: string
          id?: string
          milestones?: string[]
          sort_order?: number
          timeline?: string
          title?: string
        }
        Relationships: []
      }
      ideas: {
        Row: {
          category: string
          created_at: string
          description: string
          full_description: string
          id: string
          potential_impact: string
          sort_order: number
          technologies: string[]
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          full_description?: string
          id?: string
          potential_impact?: string
          sort_order?: number
          technologies?: string[]
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          full_description?: string
          id?: string
          potential_impact?: string
          sort_order?: number
          technologies?: string[]
          title?: string
        }
        Relationships: []
      }
      internships: {
        Row: {
          company: string
          created_at: string
          description: string
          duration: string
          file_type: string | null
          file_url: string | null
          full_description: string
          highlights: string[]
          id: string
          preview_image_url: string | null
          role: string
          sort_order: number
          technologies: string[]
        }
        Insert: {
          company: string
          created_at?: string
          description?: string
          duration?: string
          file_type?: string | null
          file_url?: string | null
          full_description?: string
          highlights?: string[]
          id?: string
          preview_image_url?: string | null
          role: string
          sort_order?: number
          technologies?: string[]
        }
        Update: {
          company?: string
          created_at?: string
          description?: string
          duration?: string
          file_type?: string | null
          file_url?: string | null
          full_description?: string
          highlights?: string[]
          id?: string
          preview_image_url?: string | null
          role?: string
          sort_order?: number
          technologies?: string[]
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          ip_address: string
          success: boolean
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          ip_address: string
          success?: boolean
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          ip_address?: string
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          challenges: string
          created_at: string
          demo_link: string | null
          description: string
          full_description: string
          github_link: string | null
          id: string
          image_url: string | null
          outcome: string
          sort_order: number
          tags: string[]
          team: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          challenges?: string
          created_at?: string
          demo_link?: string | null
          description?: string
          full_description?: string
          github_link?: string | null
          id?: string
          image_url?: string | null
          outcome?: string
          sort_order?: number
          tags?: string[]
          team?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          challenges?: string
          created_at?: string
          demo_link?: string | null
          description?: string
          full_description?: string
          github_link?: string | null
          id?: string
          image_url?: string | null
          outcome?: string
          sort_order?: number
          tags?: string[]
          team?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          id: string
          key: string
          section: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          section: string
          updated_at?: string
          value?: string
        }
        Update: {
          id?: string
          key?: string
          section?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      skill_categories: {
        Row: {
          created_at: string
          description: string
          id: string
          proficiency: string
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          proficiency?: string
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          proficiency?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category_id: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          category_id: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          category_id?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
