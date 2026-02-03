import { motion } from 'motion/react';
import { Building2, Target, AlertCircle, Sparkles, Wand2, Star, Zap, Heart, Globe, Users, Briefcase, Code, Shield } from 'lucide-react';

export type SelectionMode = 'department' | 'outcome' | 'pain' | 'transformation' | 'custom';

// Map icon names to components
const iconMap: Record<string, any> = {
  Building: Building2,
  Building2: Building2,
  Target: Target,
  AlertCircle: AlertCircle,
  Sparkles: Sparkles,
  Wand: Wand2,
  Wand2: Wand2,
  Star: Star,
  Zap: Zap,
  Heart: Heart,
  Globe: Globe,
  Users: Users,
  Briefcase: Briefcase,
  Code: Code,
  Shield: Shield,
};

// Map label names to SelectionMode
const labelToMode: Record<string, SelectionMode> = {
  'Department': 'department',
  'Outcome': 'outcome',
  'Pain Point': 'pain',
  'AI Transformation': 'transformation',
  'Custom Solution': 'custom',
  'Build your own': 'custom',
};

export interface TabConfig {
  id: string;
  label: string;
  icon: string;
  enabled?: boolean;
}

interface SelectionTabsProps {
  activeTab: SelectionMode;
  onTabChange: (tab: SelectionMode) => void;
  configuredTabs?: TabConfig[];
}

const defaultTabs: TabConfig[] = [
  { id: '1', label: 'Department', icon: 'Building', enabled: true },
  { id: '2', label: 'Outcome', icon: 'Target', enabled: true },
  { id: '3', label: 'Pain Point', icon: 'AlertCircle', enabled: true },
  { id: '4', label: 'AI Transformation', icon: 'Sparkles', enabled: true },
  { id: '5', label: 'Custom Solution', icon: 'Wand', enabled: true },
];

export function SelectionTabs({ activeTab, onTabChange, configuredTabs }: SelectionTabsProps) {
  // Use configured tabs if provided, otherwise use defaults
  const tabsToUse = configuredTabs && configuredTabs.length > 0 ? configuredTabs : defaultTabs;
  
  // Filter to only enabled tabs and map to the expected format
  const tabs = tabsToUse
    .filter(tab => tab.enabled !== false)
    .map(tab => ({
      id: labelToMode[tab.label] || 'department',
      label: tab.label,
      icon: iconMap[tab.icon] || Building2,
    }));

  return (
    <div className="flex justify-center mb-12">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="inline-flex items-center gap-2 p-2 rounded-2xl border backdrop-blur-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(59, 130, 246, 0.05))',
          borderColor: 'rgba(99, 102, 241, 0.2)',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)',
        }}
      >
        {/* Animated glow effect */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 0% 50%, rgba(99, 102, 241, 0.15), transparent 50%)',
              'radial-gradient(circle at 100% 50%, rgba(59, 130, 246, 0.15), transparent 50%)',
              'radial-gradient(circle at 0% 50%, rgba(99, 102, 241, 0.15), transparent 50%)',
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileHover={{ scale: isActive ? 1 : 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-6 py-4 rounded-xl text-sm transition-all duration-300 flex items-center gap-2 min-w-[180px] justify-center"
              style={{
                fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
              }}
            >
              {isActive && (
                <>
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.95), rgba(59, 130, 246, 0.9))',
                      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                      backgroundSize: '200% 100%',
                    }}
                    animate={{
                      backgroundPosition: ['-200% 0', '200% 0'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </>
              )}
              <Icon 
                className="w-4 h-4 relative z-10" 
                style={{ 
                  color: isActive ? 'white' : 'rgba(148, 163, 184, 0.8)',
                }} 
              />
              <span 
                className="relative z-10"
                style={{
                  color: isActive ? 'white' : 'rgba(148, 163, 184, 0.9)',
                }}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}