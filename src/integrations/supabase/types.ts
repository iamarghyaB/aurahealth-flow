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
      appointments: {
        Row: {
          created_at: string
          date: string
          doctor_id: string
          fee: number | null
          id: string
          notes: string | null
          patient_id: string
          status: string
          time: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          doctor_id: string
          fee?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          status?: string
          time: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          doctor_id?: string
          fee?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string
          time?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          created_at: string
          date: string
          doctor_id: string
          duration: string | null
          follow_up: string | null
          has_prescription: boolean | null
          id: string
          notes: string | null
          patient_id: string
          rating: number | null
          status: string
          time: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          doctor_id: string
          duration?: string | null
          follow_up?: string | null
          has_prescription?: boolean | null
          id?: string
          notes?: string | null
          patient_id: string
          rating?: number | null
          status?: string
          time: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          doctor_id?: string
          duration?: string | null
          follow_up?: string | null
          has_prescription?: boolean | null
          id?: string
          notes?: string | null
          patient_id?: string
          rating?: number | null
          status?: string
          time?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultations_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          available: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          experience_years: number | null
          fee: number | null
          id: string
          location: string | null
          next_slot: string | null
          rating: number | null
          reviews_count: number | null
          specialty: string
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          available?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience_years?: number | null
          fee?: number | null
          id?: string
          location?: string | null
          next_slot?: string | null
          rating?: number | null
          reviews_count?: number | null
          specialty?: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          available?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience_years?: number | null
          fee?: number | null
          id?: string
          location?: string | null
          next_slot?: string | null
          rating?: number | null
          reviews_count?: number | null
          specialty?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_records: {
        Row: {
          category: string
          created_at: string
          details: string[] | null
          doctor_id: string | null
          facility: string | null
          id: string
          patient_id: string
          severity: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          details?: string[] | null
          doctor_id?: string | null
          facility?: string | null
          id?: string
          patient_id: string
          severity?: string | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          details?: string[] | null
          doctor_id?: string | null
          facility?: string | null
          id?: string
          patient_id?: string
          severity?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_records_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_report_results: {
        Row: {
          id: string
          lab_report_id: string
          name: string
          reference_range: string | null
          status: string
          value: string
        }
        Insert: {
          id?: string
          lab_report_id: string
          name: string
          reference_range?: string | null
          status?: string
          value?: string
        }
        Update: {
          id?: string
          lab_report_id?: string
          name?: string
          reference_range?: string | null
          status?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_report_results_lab_report_id_fkey"
            columns: ["lab_report_id"]
            isOneToOne: false
            referencedRelation: "lab_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_reports: {
        Row: {
          category: string
          created_at: string
          doctor_id: string | null
          file_url: string | null
          id: string
          lab_name: string | null
          patient_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          doctor_id?: string | null
          file_url?: string | null
          id?: string
          lab_name?: string | null
          patient_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          doctor_id?: string | null
          file_url?: string | null
          id?: string
          lab_name?: string | null
          patient_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_reports_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      medicines: {
        Row: {
          category: string
          created_at: string
          description: string | null
          dosage: string | null
          form: string | null
          generic_name: string | null
          id: string
          in_stock: boolean | null
          manufacturer: string | null
          name: string
          prescription_required: boolean | null
          price: number
          rating: number | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          dosage?: string | null
          form?: string | null
          generic_name?: string | null
          id?: string
          in_stock?: boolean | null
          manufacturer?: string | null
          name: string
          prescription_required?: boolean | null
          price?: number
          rating?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          dosage?: string | null
          form?: string | null
          generic_name?: string | null
          id?: string
          in_stock?: boolean | null
          manufacturer?: string | null
          name?: string
          prescription_required?: boolean | null
          price?: number
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          medicine_id: string
          order_id: string
          price: number
          quantity: number
        }
        Insert: {
          id?: string
          medicine_id: string
          order_id: string
          price?: number
          quantity?: number
        }
        Update: {
          id?: string
          medicine_id?: string
          order_id?: string
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          patient_id: string
          prescription_id: string | null
          status: string
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          patient_id: string
          prescription_id?: string | null
          status?: string
          total?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          patient_id?: string
          prescription_id?: string | null
          status?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescription_medications: {
        Row: {
          dosage: string
          duration: string
          frequency: string
          id: string
          instructions: string | null
          name: string
          prescription_id: string
        }
        Insert: {
          dosage?: string
          duration?: string
          frequency?: string
          id?: string
          instructions?: string | null
          name: string
          prescription_id: string
        }
        Update: {
          dosage?: string
          duration?: string
          frequency?: string
          id?: string
          instructions?: string | null
          name?: string
          prescription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescription_medications_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          diagnosis: string
          doctor_id: string
          id: string
          next_refill: string | null
          notes: string | null
          patient_id: string
          refills_left: number | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          diagnosis?: string
          doctor_id: string
          id?: string
          next_refill?: string | null
          notes?: string | null
          patient_id: string
          refills_left?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          diagnosis?: string
          doctor_id?: string
          id?: string
          next_refill?: string | null
          notes?: string | null
          patient_id?: string
          refills_left?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
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
          role?: Database["public"]["Enums"]["app_role"]
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
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "patient" | "doctor" | "admin"
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
      app_role: ["patient", "doctor", "admin"],
    },
  },
} as const
