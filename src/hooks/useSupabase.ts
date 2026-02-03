import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { DepartmentRow, ProductRow, AgentRow, VibeAppRow, SidekickActionRow } from '@/types/database';

// Hook for fetching all departments
export function useDepartments() {
  const [departments, setDepartments] = useState<DepartmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('is_active', true)  // Only show active departments on main site
        .order('order_index');
      
      if (error) throw error;
      setDepartments(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const updateDepartment = async (id: string, updates: Partial<DepartmentRow>) => {
    const { error } = await supabase
      .from('departments')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    await fetchDepartments();
  };

  return { departments, loading, error, refetch: fetchDepartments, updateDepartment };
}

// Hook for fetching department data (products, agents, etc.)
export function useDepartmentData(departmentId: string | null) {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [vibeApps, setVibeApps] = useState<VibeAppRow[]>([]);
  const [sidekickActions, setSidekickActions] = useState<SidekickActionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!departmentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Use junction tables to get items linked to this department
      const [productsRes, agentsRes, vibeAppsRes, sidekickRes] = await Promise.all([
        // Get products via department_products junction table
        supabase
          .from('department_products')
          .select('products(*)')
          .eq('department_id', departmentId),
        // Get agents via department_agents junction table  
        supabase
          .from('department_agents')
          .select('agents(*)')
          .eq('department_id', departmentId),
        // Get vibe apps via department_vibe_apps junction table
        supabase
          .from('department_vibe_apps')
          .select('vibe_apps(*)')
          .eq('department_id', departmentId),
        // Get sidekick actions via department_sidekick_actions junction table
        supabase
          .from('department_sidekick_actions')
          .select('sidekick_actions(*)')
          .eq('department_id', departmentId),
      ]);

      if (productsRes.error) throw productsRes.error;
      if (agentsRes.error) throw agentsRes.error;
      if (vibeAppsRes.error) throw vibeAppsRes.error;
      if (sidekickRes.error) throw sidekickRes.error;

      // Extract the actual items from the junction table response and filter by is_active
      const productsData = (productsRes.data || [])
        .map((row: any) => row.products)
        .filter((p: any) => p && p.is_active)
        .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
      
      const agentsData = (agentsRes.data || [])
        .map((row: any) => row.agents)
        .filter((a: any) => a && a.is_active)
        .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
      
      const vibeAppsData = (vibeAppsRes.data || [])
        .map((row: any) => row.vibe_apps)
        .filter((v: any) => v && v.is_active)
        .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
      
      const sidekickData = (sidekickRes.data || [])
        .map((row: any) => row.sidekick_actions)
        .filter((s: any) => s && s.is_active)
        .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));

      setProducts(productsData);
      setAgents(agentsData);
      setVibeApps(vibeAppsData);
      setSidekickActions(sidekickData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [departmentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // CRUD operations for products
  const addProduct = async (product: Omit<ProductRow, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('products').insert(product);
    if (error) throw error;
    await fetchData();
  };

  const updateProduct = async (id: string, updates: Partial<ProductRow>) => {
    const { error } = await supabase.from('products').update(updates).eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  // CRUD operations for agents
  const addAgent = async (agent: Omit<AgentRow, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('agents').insert(agent);
    if (error) throw error;
    await fetchData();
  };

  const updateAgent = async (id: string, updates: Partial<AgentRow>) => {
    const { error } = await supabase.from('agents').update(updates).eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const deleteAgent = async (id: string) => {
    const { error } = await supabase.from('agents').delete().eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  // CRUD operations for vibe apps
  const addVibeApp = async (app: Omit<VibeAppRow, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('vibe_apps').insert(app);
    if (error) throw error;
    await fetchData();
  };

  const updateVibeApp = async (id: string, updates: Partial<VibeAppRow>) => {
    const { error } = await supabase.from('vibe_apps').update(updates).eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const deleteVibeApp = async (id: string) => {
    const { error } = await supabase.from('vibe_apps').delete().eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  // CRUD operations for sidekick actions
  const addSidekickAction = async (action: Omit<SidekickActionRow, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('sidekick_actions').insert(action);
    if (error) throw error;
    await fetchData();
  };

  const updateSidekickAction = async (id: string, updates: Partial<SidekickActionRow>) => {
    const { error } = await supabase.from('sidekick_actions').update(updates).eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const deleteSidekickAction = async (id: string) => {
    const { error } = await supabase.from('sidekick_actions').delete().eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  return {
    products,
    agents,
    vibeApps,
    sidekickActions,
    loading,
    error,
    refetch: fetchData,
    // Product operations
    addProduct,
    updateProduct,
    deleteProduct,
    // Agent operations
    addAgent,
    updateAgent,
    deleteAgent,
    // Vibe App operations
    addVibeApp,
    updateVibeApp,
    deleteVibeApp,
    // Sidekick Action operations
    addSidekickAction,
    updateSidekickAction,
    deleteSidekickAction,
  };
}

// Types for site settings
interface SectionsVisibility {
  hero: boolean;
  hero_alternative: boolean;
  work_comparison: boolean;
  sidekick_capabilities: boolean;
  sidekick: boolean;
  departments: boolean;
  ai_platform: boolean;
}

interface HeroSettings {
  logo_url: string;
  platform_label: string;
  headline_text: string;
  headline_gradient_text: string;
  font_size: 'small' | 'medium' | 'large' | 'xlarge';
  background_type: 'solid' | 'gradient' | 'image';
  background_color: string;
  background_gradient_from: string;
  background_gradient_to: string;
  background_image_url: string;
}

export interface SolutionTabsVisibility {
  overview: boolean;
  inAction: boolean;
  businessValue: boolean;
  test: boolean;
}

// Sidekick theme interface (matches SidekickPanelTheme from context)
export interface SidekickTheme {
  panelBackground: string;
  panelBackdropBlur: string;
  panelBorderColor: string;
  panelShadow: string;
  headerBorderColor: string;
  headerPrimaryText: string;
  headerSecondaryText: string;
  headerLogo: string;
  headerPrimaryLabel: string;
  headerSecondaryLabel: string;
  cardBackground: string;
  cardBorder: string;
  cardBackdropBlur: string;
  primaryText: string;
  secondaryText: string;
  mutedText: string;
  greenAccent: string;
  amberAccent: string;
  indigoAccent: string;
  purpleAccent: string;
  progressBarBg: string;
  userMessageBg: string;
  userMessageText: string;
  introMessage: string;
  introBackground: string;
  introBubbleGradientFrom: string;
  introBubbleGradientTo: string;
  introBubbleShadow: string;
  panelOuterBackground: string;
}

export interface SiteSettings {
  hero_title: string;
  hero_subtitle: string;
  sections_visibility: SectionsVisibility;
  hero_settings: HeroSettings;
  solution_tabs_visibility: SolutionTabsVisibility;
  sidekick_hero_theme: SidekickTheme | null;
  sidekick_inaction_theme: SidekickTheme | null;
}

const defaultSectionsVisibility: SectionsVisibility = {
  hero: true,
  hero_alternative: false,
  work_comparison: false,
  sidekick_capabilities: false,
  sidekick: true,
  departments: true,
  ai_platform: true,
};

const defaultHeroSettings: HeroSettings = {
  logo_url: '',
  platform_label: 'AI Work Platform',
  headline_text: 'Empowering every team ',
  headline_gradient_text: 'to accelerate business impact',
  font_size: 'large',
  background_type: 'gradient',
  background_color: '#000000',
  background_gradient_from: '#000000',
  background_gradient_to: '#1a1a2e',
  background_image_url: '',
};

const defaultSolutionTabsVisibility: SolutionTabsVisibility = {
  overview: true,
  inAction: true,
  businessValue: true,
  test: true,
};

// Hook for fetching site settings
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    hero_title: 'What would you like to achieve?',
    hero_subtitle: 'with AI-powered products, AI work capabilities, and a unified context-aware layer',
    sections_visibility: defaultSectionsVisibility,
    hero_settings: defaultHeroSettings,
    solution_tabs_visibility: defaultSolutionTabsVisibility,
    sidekick_hero_theme: null,
    sidekick_inaction_theme: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (fetchError) {
        // If no row exists or other error, just use defaults
        console.log('Site settings fetch error (using defaults):', fetchError.message);
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      if (data) {
        setSettings({
          hero_title: data.hero_title || 'What would you like to achieve?',
          hero_subtitle: data.hero_subtitle || 'with AI-powered products, AI work capabilities, and a unified context-aware layer',
          sections_visibility: { ...defaultSectionsVisibility, ...data.sections_visibility },
          hero_settings: { ...defaultHeroSettings, ...data.hero_settings },
          solution_tabs_visibility: data.solution_tabs_visibility || defaultSolutionTabsVisibility,
          sidekick_hero_theme: data.sidekick_hero_theme || null,
          sidekick_inaction_theme: data.sidekick_inaction_theme || null,
        });
      }
    } catch (err: any) {
      console.log('No site settings found, using defaults:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, error, refetch: fetchSettings };
}

// Hook for image upload
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, folder: string = 'general'): Promise<string | null> => {
    try {
      setUploading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('Vibe')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('Vibe').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
}
