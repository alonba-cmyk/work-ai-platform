export type Department = 'operations' | 'marketing' | 'sales' | 'support' | 'product' | 'legal' | 'finance' | 'hr';

export interface DepartmentRow {
  id: string;
  name: Department;
  title: string;
  description: string;
  avatar_image: string;
  avatar_color: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductRow {
  id: string;
  department_id: string;
  name: string;
  description: string;
  value: string;
  image: string | null;
  images: string[];  // Additional gallery images
  icon?: string | null;
  use_cases: string[];
  replaces_tools: { name: string; color: string }[];
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AgentRow {
  id: string;
  department_id: string;
  name: string;
  description: string;
  value: string;
  image: string | null;
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VibeAppRow {
  id: string;
  department_id: string;
  name: string;
  value: string;
  icon: string;
  replaces_tools: string[];
  image: string | null;
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SidekickActionRow {
  id: string;
  department_id: string;
  name: string;
  description: string;
  value: string;
  image: string | null;
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PlatformValueRow {
  id: string;
  department_id: string;
  icon: string;
  title: string;
  description: string;
  supported_by: string[];
  replaces_tools: string[];
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      departments: {
        Row: DepartmentRow;
        Insert: Omit<DepartmentRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DepartmentRow, 'id' | 'created_at' | 'updated_at'>>;
      };
      products: {
        Row: ProductRow;
        Insert: Omit<ProductRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ProductRow, 'id' | 'created_at' | 'updated_at'>>;
      };
      agents: {
        Row: AgentRow;
        Insert: Omit<AgentRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AgentRow, 'id' | 'created_at' | 'updated_at'>>;
      };
      vibe_apps: {
        Row: VibeAppRow;
        Insert: Omit<VibeAppRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<VibeAppRow, 'id' | 'created_at' | 'updated_at'>>;
      };
      sidekick_actions: {
        Row: SidekickActionRow;
        Insert: Omit<SidekickActionRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SidekickActionRow, 'id' | 'created_at' | 'updated_at'>>;
      };
      platform_values: {
        Row: PlatformValueRow;
        Insert: Omit<PlatformValueRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PlatformValueRow, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
