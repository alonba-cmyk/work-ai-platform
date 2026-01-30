import { motion } from 'motion/react';
import { Building2, Target, AlertCircle, Sparkles, Wand2 } from 'lucide-react';

export type SelectionMode = 'department' | 'outcome' | 'pain' | 'transformation' | 'custom';

interface SelectionTabsProps {
  activeTab: SelectionMode;
  onTabChange: (tab: SelectionMode) => void;
}

export function SelectionTabs({ activeTab, onTabChange }: SelectionTabsProps) {
  const tabs: Array<{ id: SelectionMode; label: string; icon: any }> = [
    { id: 'department', label: 'Department', icon: Building2 },
    { id: 'outcome', label: 'Outcome', icon: Target },
    { id: 'pain', label: 'Pain Point', icon: AlertCircle },
    { id: 'transformation', label: 'AI Transformation', icon: Sparkles },
    { id: 'custom', label: 'Build your own', icon: Wand2 },
  ];

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