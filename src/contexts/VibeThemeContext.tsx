import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Vibe Theme types
export interface VibeCardTheme {
  // Card styling
  cardBackground: string;
  cardBorder: string;
  cardShadow: string;
  
  // Hover effect gradient
  hoverGradientFrom: string;
  hoverGradientTo: string;
  
  // Info bar at bottom
  infoBarBackground: string;
  infoBarBorder: string;
  
  // Icon styling
  iconGradientFrom: string;
  iconGradientTo: string;
  iconColor: string;
  
  // Text colors
  titleColor: string;
  subtitleColor: string;
  
  // "Build your own" special gradient
  buildYourOwnGradient: string;
}

export interface VibeThemePreset {
  id: string;
  name: string;
  description: string;
  theme: VibeCardTheme;
}

// Preset themes for Vibe
export const vibePresets: VibeThemePreset[] = [
  {
    id: 'sunset-gradient',
    name: 'Sunset Gradient',
    description: 'Warm orange to pink gradient',
    theme: {
      cardBackground: 'rgba(255, 255, 255, 0.02)',
      cardBorder: 'rgba(99, 102, 241, 0.2)',
      cardShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      hoverGradientFrom: 'rgba(255, 165, 0, 0.92)',
      hoverGradientTo: 'rgba(233, 30, 99, 0.88)',
      infoBarBackground: 'rgba(0, 0, 0, 0.8)',
      infoBarBorder: 'rgba(255, 255, 255, 0.1)',
      iconGradientFrom: 'rgba(255, 165, 0, 0.35)',
      iconGradientTo: 'rgba(233, 30, 99, 0.25)',
      iconColor: '#ff6384',
      titleColor: '#ffffff',
      subtitleColor: '#ffb3c6',
      buildYourOwnGradient: 'linear-gradient(135deg, #1670FD, #FF83E0, #37E9C8, #FFC903, #FF6E2E)',
    }
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Cool blue gradient',
    theme: {
      cardBackground: 'rgba(255, 255, 255, 0.02)',
      cardBorder: 'rgba(59, 130, 246, 0.3)',
      cardShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      hoverGradientFrom: 'rgba(59, 130, 246, 0.92)',
      hoverGradientTo: 'rgba(139, 92, 246, 0.88)',
      infoBarBackground: 'rgba(0, 0, 20, 0.85)',
      infoBarBorder: 'rgba(59, 130, 246, 0.2)',
      iconGradientFrom: 'rgba(59, 130, 246, 0.35)',
      iconGradientTo: 'rgba(139, 92, 246, 0.25)',
      iconColor: '#60a5fa',
      titleColor: '#ffffff',
      subtitleColor: '#93c5fd',
      buildYourOwnGradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
    }
  },
  {
    id: 'emerald-fresh',
    name: 'Emerald Fresh',
    description: 'Fresh green gradient',
    theme: {
      cardBackground: 'rgba(255, 255, 255, 0.02)',
      cardBorder: 'rgba(16, 185, 129, 0.3)',
      cardShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      hoverGradientFrom: 'rgba(16, 185, 129, 0.92)',
      hoverGradientTo: 'rgba(34, 197, 94, 0.88)',
      infoBarBackground: 'rgba(0, 20, 10, 0.85)',
      infoBarBorder: 'rgba(16, 185, 129, 0.2)',
      iconGradientFrom: 'rgba(16, 185, 129, 0.35)',
      iconGradientTo: 'rgba(34, 197, 94, 0.25)',
      iconColor: '#34d399',
      titleColor: '#ffffff',
      subtitleColor: '#6ee7b7',
      buildYourOwnGradient: 'linear-gradient(135deg, #10b981, #22c55e, #06b6d4)',
    }
  },
];

// Default theme
const defaultTheme: VibeCardTheme = vibePresets[0].theme;

// Context type
interface VibeThemeContextType {
  theme: VibeCardTheme;
  presetId: string;
  setTheme: (theme: VibeCardTheme) => void;
  setPresetId: (id: string) => void;
  applyPreset: (presetId: string) => void;
  resetToDefault: () => void;
}

const VibeThemeContext = createContext<VibeThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'vibe-theme';
const PRESET_KEY = 'vibe-theme-preset';

export function VibeThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<VibeCardTheme>(defaultTheme);
  const [presetId, setPresetId] = useState<string>('sunset-gradient');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      const savedPreset = localStorage.getItem(PRESET_KEY);
      
      if (savedTheme) {
        setTheme(JSON.parse(savedTheme));
      }
      if (savedPreset) {
        setPresetId(savedPreset);
      }
    } catch (error) {
      console.error('Error loading Vibe theme from localStorage:', error);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever theme changes (after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
      localStorage.setItem(PRESET_KEY, presetId);
    } catch (error) {
      console.error('Error saving Vibe theme to localStorage:', error);
    }
  }, [theme, presetId, isInitialized]);

  const applyPreset = (id: string) => {
    const preset = vibePresets.find(p => p.id === id);
    if (preset) {
      setTheme(preset.theme);
      setPresetId(id);
    }
  };

  const resetToDefault = () => {
    setTheme(defaultTheme);
    setPresetId('sunset-gradient');
  };

  return (
    <VibeThemeContext.Provider value={{
      theme,
      presetId,
      setTheme,
      setPresetId,
      applyPreset,
      resetToDefault,
    }}>
      {children}
    </VibeThemeContext.Provider>
  );
}

export function useVibeTheme() {
  const context = useContext(VibeThemeContext);
  if (!context) {
    throw new Error('useVibeTheme must be used within a VibeThemeProvider');
  }
  return context;
}

// Export default theme for use without context
export { defaultTheme as vibeDefaultTheme };
