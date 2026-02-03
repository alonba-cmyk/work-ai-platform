import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Theme types
export interface SidekickPanelTheme {
  // Panel background
  panelBackground: string;
  panelBackdropBlur: string;
  panelBorderColor: string;
  panelShadow: string;
  
  // Header
  headerBorderColor: string;
  headerPrimaryText: string;
  headerSecondaryText: string;
  headerLogo: string; // URL or empty for default
  headerPrimaryLabel: string; // e.g. "monday"
  headerSecondaryLabel: string; // e.g. "sidekick"
  
  // Cards
  cardBackground: string;
  cardBorder: string;
  cardBackdropBlur: string;
  
  // Text colors
  primaryText: string;
  secondaryText: string;
  mutedText: string;
  
  // Accent colors
  greenAccent: string;
  amberAccent: string;
  indigoAccent: string;
  purpleAccent: string;
  
  // Progress bars
  progressBarBg: string;
  
  // User message bubble
  userMessageBg: string;
  userMessageText: string;
  
  // Intro section (2nd fold)
  introMessage: string;
  introBackground: string;
  introBubbleGradientFrom: string;
  introBubbleGradientTo: string;
  introBubbleShadow: string;
  
  // Panel outer background (area behind the panel frame)
  panelOuterBackground: string;
}

export interface SidekickThemePreset {
  id: string;
  name: string;
  description: string;
  theme: SidekickPanelTheme;
}

// Preset themes
export const sidekickPresets: SidekickThemePreset[] = [
  {
    id: 'dark-glass',
    name: 'Dark Glass',
    description: 'Modern dark glass with blur effects',
    theme: {
      panelBackground: 'linear-gradient(145deg, rgba(45, 45, 55, 0.92), rgba(35, 35, 45, 0.95), rgba(40, 40, 50, 0.9))',
      panelBackdropBlur: '20px',
      panelBorderColor: 'rgba(255, 255, 255, 0.1)',
      panelShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
      headerBorderColor: 'rgba(255, 255, 255, 0.1)',
      headerPrimaryText: '#ffffff',
      headerSecondaryText: 'rgba(255, 255, 255, 0.6)',
      headerLogo: '',
      headerPrimaryLabel: 'monday',
      headerSecondaryLabel: 'sidekick',
      cardBackground: 'rgba(255, 255, 255, 0.1)',
      cardBorder: 'rgba(255, 255, 255, 0.2)',
      cardBackdropBlur: '4px',
      primaryText: '#ffffff',
      secondaryText: 'rgba(255, 255, 255, 0.8)',
      mutedText: 'rgba(255, 255, 255, 0.6)',
      greenAccent: '#4ade80',
      amberAccent: '#fbbf24',
      indigoAccent: '#a5b4fc',
      purpleAccent: '#c4b5fd',
      progressBarBg: 'rgba(255, 255, 255, 0.2)',
      userMessageBg: '#4f46e5',
      userMessageText: '#ffffff',
      introMessage: "Hey! I'm Sidekick, your AI assistant ✨",
      introBackground: '#ffffff',
      introBubbleGradientFrom: '#6366f1',
      introBubbleGradientTo: '#a855f7',
      introBubbleShadow: 'rgba(99, 102, 241, 0.3)',
      panelOuterBackground: '#1a1a2e',
    }
  },
  {
    id: 'light-clean',
    name: 'Light Clean',
    description: 'Clean white background with subtle shadows',
    theme: {
      panelBackground: '#ffffff',
      panelBackdropBlur: '0px',
      panelBorderColor: 'rgba(0, 0, 0, 0.1)',
      panelShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      headerBorderColor: '#e5e7eb',
      headerPrimaryText: '#111827',
      headerSecondaryText: '#6b7280',
      headerLogo: '',
      headerPrimaryLabel: 'monday',
      headerSecondaryLabel: 'sidekick',
      cardBackground: '#f3f4f6',
      cardBorder: '#e5e7eb',
      cardBackdropBlur: '0px',
      primaryText: '#111827',
      secondaryText: '#374151',
      mutedText: '#6b7280',
      greenAccent: '#16a34a',
      amberAccent: '#d97706',
      indigoAccent: '#4f46e5',
      purpleAccent: '#7c3aed',
      progressBarBg: '#e5e7eb',
      userMessageBg: '#4f46e5',
      userMessageText: '#ffffff',
      introMessage: "Hey! I'm Sidekick, your AI assistant ✨",
      introBackground: '#f9fafb',
      introBubbleGradientFrom: '#4f46e5',
      introBubbleGradientTo: '#7c3aed',
      introBubbleShadow: 'rgba(79, 70, 229, 0.2)',
      panelOuterBackground: '#f3f4f6',
    }
  },
  {
    id: 'neon-purple',
    name: 'Neon Purple',
    description: 'Vibrant purple theme with glow effects',
    theme: {
      panelBackground: 'linear-gradient(145deg, rgba(88, 28, 135, 0.95), rgba(76, 29, 149, 0.92), rgba(91, 33, 182, 0.9))',
      panelBackdropBlur: '20px',
      panelBorderColor: 'rgba(168, 85, 247, 0.3)',
      panelShadow: '0 0 40px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      headerBorderColor: 'rgba(168, 85, 247, 0.3)',
      headerPrimaryText: '#ffffff',
      headerSecondaryText: 'rgba(233, 213, 255, 0.8)',
      headerLogo: '',
      headerPrimaryLabel: 'monday',
      headerSecondaryLabel: 'sidekick',
      cardBackground: 'rgba(168, 85, 247, 0.2)',
      cardBorder: 'rgba(168, 85, 247, 0.3)',
      cardBackdropBlur: '4px',
      primaryText: '#ffffff',
      secondaryText: 'rgba(233, 213, 255, 0.9)',
      mutedText: 'rgba(233, 213, 255, 0.7)',
      greenAccent: '#a3e635',
      amberAccent: '#facc15',
      indigoAccent: '#c4b5fd',
      purpleAccent: '#e9d5ff',
      progressBarBg: 'rgba(168, 85, 247, 0.3)',
      userMessageBg: '#a855f7',
      userMessageText: '#ffffff',
      introMessage: "Hey! I'm Sidekick, your AI assistant ✨",
      introBackground: 'linear-gradient(145deg, rgba(88, 28, 135, 0.95), rgba(76, 29, 149, 0.92))',
      introBubbleGradientFrom: '#a855f7',
      introBubbleGradientTo: '#ec4899',
      introBubbleShadow: 'rgba(168, 85, 247, 0.4)',
      panelOuterBackground: '#1a0a2e',
    }
  },
  {
    id: 'warm-sunset',
    name: 'Warm Sunset',
    description: 'Warm gradient from pink to orange',
    theme: {
      panelBackground: 'linear-gradient(145deg, rgba(219, 39, 119, 0.9), rgba(234, 88, 12, 0.85), rgba(251, 146, 60, 0.9))',
      panelBackdropBlur: '20px',
      panelBorderColor: 'rgba(255, 255, 255, 0.2)',
      panelShadow: '0 0 40px rgba(234, 88, 12, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      headerBorderColor: 'rgba(255, 255, 255, 0.2)',
      headerPrimaryText: '#ffffff',
      headerSecondaryText: 'rgba(255, 255, 255, 0.8)',
      headerLogo: '',
      headerPrimaryLabel: 'monday',
      headerSecondaryLabel: 'sidekick',
      cardBackground: 'rgba(255, 255, 255, 0.15)',
      cardBorder: 'rgba(255, 255, 255, 0.25)',
      cardBackdropBlur: '4px',
      primaryText: '#ffffff',
      secondaryText: 'rgba(255, 255, 255, 0.9)',
      mutedText: 'rgba(255, 255, 255, 0.7)',
      greenAccent: '#86efac',
      amberAccent: '#fef08a',
      indigoAccent: '#c7d2fe',
      purpleAccent: '#ddd6fe',
      progressBarBg: 'rgba(255, 255, 255, 0.25)',
      userMessageBg: '#f97316',
      userMessageText: '#ffffff',
      introMessage: "Hey! I'm Sidekick, your AI assistant ✨",
      introBackground: 'linear-gradient(145deg, rgba(251, 146, 60, 0.15), rgba(234, 88, 12, 0.1))',
      introBubbleGradientFrom: '#f97316',
      introBubbleGradientTo: '#ec4899',
      introBubbleShadow: 'rgba(249, 115, 22, 0.3)',
      panelOuterBackground: '#2a1a0e',
    }
  }
];

// Default themes for each Sidekick (used when no theme is provided from Supabase)
export const defaultHeroTheme = sidekickPresets[0].theme; // Dark Glass
export const defaultInActionTheme = sidekickPresets[0].theme; // Dark Glass

interface SidekickThemeContextType {
  heroTheme: SidekickPanelTheme;
  inActionTheme: SidekickPanelTheme;
  heroPresetId: string;
  inActionPresetId: string;
  setHeroTheme: (theme: SidekickPanelTheme) => void;
  setInActionTheme: (theme: SidekickPanelTheme) => void;
  setHeroPreset: (presetId: string) => void;
  setInActionPreset: (presetId: string) => void;
  updateHeroThemeProperty: <K extends keyof SidekickPanelTheme>(key: K, value: SidekickPanelTheme[K]) => void;
  updateInActionThemeProperty: <K extends keyof SidekickPanelTheme>(key: K, value: SidekickPanelTheme[K]) => void;
  resetHeroToDefault: () => void;
  resetInActionToDefault: () => void;
}

const SidekickThemeContext = createContext<SidekickThemeContextType | undefined>(undefined);

// Helper to determine preset ID from theme
function getPresetIdFromTheme(theme: SidekickPanelTheme): string {
  const matchingPreset = sidekickPresets.find(preset => 
    preset.theme.cardBackground === theme.cardBackground && 
    preset.theme.panelBackground === theme.panelBackground
  );
  return matchingPreset?.id || 'custom';
}

interface SidekickThemeProviderProps {
  children: ReactNode;
  // Optional themes from Supabase site settings
  initialHeroTheme?: SidekickPanelTheme | null;
  initialInActionTheme?: SidekickPanelTheme | null;
}

// Helper to load theme from localStorage
const getLocalStorageTheme = (key: string): SidekickPanelTheme | null => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as SidekickPanelTheme;
    }
  } catch (e) {
    console.warn('Could not load theme from localStorage:', e);
  }
  return null;
};

export function SidekickThemeProvider({ 
  children, 
  initialHeroTheme,
  initialInActionTheme,
}: SidekickThemeProviderProps) {
  // Priority: localStorage > props (Supabase) > defaults
  // localStorage is checked synchronously to avoid flash
  const [heroTheme, setHeroThemeState] = useState<SidekickPanelTheme>(() => {
    const localTheme = getLocalStorageTheme('sidekick_hero_theme');
    return localTheme || initialHeroTheme || defaultHeroTheme;
  });
  const [inActionTheme, setInActionThemeState] = useState<SidekickPanelTheme>(() => {
    const localTheme = getLocalStorageTheme('sidekick_inaction_theme');
    return localTheme || initialInActionTheme || defaultInActionTheme;
  });
  const [heroPresetId, setHeroPresetIdState] = useState<string>(() => {
    const localTheme = getLocalStorageTheme('sidekick_hero_theme');
    return getPresetIdFromTheme(localTheme || initialHeroTheme || defaultHeroTheme);
  });
  const [inActionPresetId, setInActionPresetIdState] = useState<string>(() => {
    const localTheme = getLocalStorageTheme('sidekick_inaction_theme');
    return getPresetIdFromTheme(localTheme || initialInActionTheme || defaultInActionTheme);
  });

  // Sync state when props change (after Supabase data loads)
  // But only if localStorage doesn't have data (localStorage takes priority)
  useEffect(() => {
    if (initialHeroTheme && !getLocalStorageTheme('sidekick_hero_theme')) {
      setHeroThemeState(initialHeroTheme);
      setHeroPresetIdState(getPresetIdFromTheme(initialHeroTheme));
    }
  }, [initialHeroTheme]);

  useEffect(() => {
    if (initialInActionTheme && !getLocalStorageTheme('sidekick_inaction_theme')) {
      setInActionThemeState(initialInActionTheme);
      setInActionPresetIdState(getPresetIdFromTheme(initialInActionTheme));
    }
  }, [initialInActionTheme]);

  const setHeroTheme = (theme: SidekickPanelTheme) => {
    setHeroThemeState(theme);
    setHeroPresetIdState('custom');
  };

  const setInActionTheme = (theme: SidekickPanelTheme) => {
    setInActionThemeState(theme);
    setInActionPresetIdState('custom');
  };

  const setHeroPreset = (presetId: string) => {
    const preset = sidekickPresets.find(p => p.id === presetId);
    if (preset) {
      setHeroThemeState(preset.theme);
      setHeroPresetIdState(presetId);
    }
  };

  const setInActionPreset = (presetId: string) => {
    const preset = sidekickPresets.find(p => p.id === presetId);
    if (preset) {
      setInActionThemeState(preset.theme);
      setInActionPresetIdState(presetId);
    }
  };

  const updateHeroThemeProperty = <K extends keyof SidekickPanelTheme>(key: K, value: SidekickPanelTheme[K]) => {
    setHeroThemeState(prev => ({ ...prev, [key]: value }));
    setHeroPresetIdState('custom');
  };

  const updateInActionThemeProperty = <K extends keyof SidekickPanelTheme>(key: K, value: SidekickPanelTheme[K]) => {
    setInActionThemeState(prev => ({ ...prev, [key]: value }));
    setInActionPresetIdState('custom');
  };

  const resetHeroToDefault = () => {
    setHeroThemeState(defaultHeroTheme);
    setHeroPresetIdState('dark-glass');
  };

  const resetInActionToDefault = () => {
    setInActionThemeState(defaultInActionTheme);
    setInActionPresetIdState('dark-glass');
  };

  return (
    <SidekickThemeContext.Provider
      value={{
        heroTheme,
        inActionTheme,
        heroPresetId,
        inActionPresetId,
        setHeroTheme,
        setInActionTheme,
        setHeroPreset,
        setInActionPreset,
        updateHeroThemeProperty,
        updateInActionThemeProperty,
        resetHeroToDefault,
        resetInActionToDefault,
      }}
    >
      {children}
    </SidekickThemeContext.Provider>
  );
}

export function useSidekickTheme() {
  const context = useContext(SidekickThemeContext);
  if (context === undefined) {
    throw new Error('useSidekickTheme must be used within a SidekickThemeProvider');
  }
  return context;
}

// Hook for Hero Sidekick (BeforeAfterBoardSection)
export function useHeroSidekickTheme() {
  const { heroTheme, heroPresetId, setHeroTheme, setHeroPreset, updateHeroThemeProperty, resetHeroToDefault } = useSidekickTheme();
  return {
    theme: heroTheme,
    presetId: heroPresetId,
    isLoading: false, // localStorage loads synchronously, no loading state needed
    setTheme: setHeroTheme,
    setPreset: setHeroPreset,
    updateProperty: updateHeroThemeProperty,
    resetToDefault: resetHeroToDefault,
  };
}

// Hook for In Action Sidekick (AnimatedStoryView)
export function useInActionSidekickTheme() {
  const { inActionTheme, inActionPresetId, setInActionTheme, setInActionPreset, updateInActionThemeProperty, resetInActionToDefault } = useSidekickTheme();
  return {
    theme: inActionTheme,
    presetId: inActionPresetId,
    isLoading: false, // localStorage loads synchronously, no loading state needed
    setTheme: setInActionTheme,
    setPreset: setInActionPreset,
    updateProperty: updateInActionThemeProperty,
    resetToDefault: resetInActionToDefault,
  };
}
