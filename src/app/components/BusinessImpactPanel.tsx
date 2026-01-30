import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, Sparkles, Target } from 'lucide-react';

// Import real monday.com product icons
import imgWM from '@/assets/5d4f550f18adfa644c6653f867bc960bdc8a53dc.png';
import imgCRM from '@/assets/6cf10de3ca3f528bc9d9457024ed87915acf1b6f.png';
import imgService from '@/assets/9fae7b5cd33e1ccaf1f329bad81508b9daae5210.png';
import imgDev from '@/assets/f416d94ad48b77a56df38e1f5ca7412f0e86202f.png';
import imgCampaigns from '@/assets/41abe475f056daef6e610ed3282d554ea3b88606.png';
import imgAgents from '@/assets/50fa24641e7dcf6f4b9a73238d293ef7bb60b528.png';
import imgSidekick from '@/assets/118e32d3321e688093c59d5dd9a67bb37acb1f52.png';
import imgVibe from '@/assets/48bf64e6f0f3db302604b8108740e09a09780084.png';

type SupportedFeature = 'WM' | 'CRM' | 'Campaigns' | 'Service' | 'Dev' | 'Sidekick' | 'Agents';

interface Value {
  icon: any;
  title: string;
  description: string;
  supportedBy: SupportedFeature[];
  replacesTools?: string[];
}

interface BusinessImpactPanelProps {
  isOpen: boolean;
  onClose: () => void;
  values: Value[];
  selectedItems: {
    products: string[];
    agents: string[];
    sidekick: string[];
    vibe: string[];
  };
}

// Feature icons mapping to real monday.com product images
const featureIcons: Record<SupportedFeature, { src: string; label: string }> = {
  'WM': { 
    src: imgWM,
    label: 'Work Management'
  },
  'CRM': { 
    src: imgCRM,
    label: 'CRM'
  },
  'Campaigns': { 
    src: imgCampaigns,
    label: 'Campaigns'
  },
  'Service': { 
    src: imgService,
    label: 'Service'
  },
  'Dev': { 
    src: imgDev,
    label: 'Dev'
  },
  'Sidekick': { 
    src: imgSidekick,
    label: 'Sidekick'
  },
  'Agents': { 
    src: imgAgents,
    label: 'Agents'
  },
};

// Map product names to supported features
const productToFeatureMap: Record<string, SupportedFeature> = {
  'Work Management': 'WM',
  'CRM': 'CRM',
  'Campaigns': 'Campaigns',
  'Service': 'Service',
  'Dev': 'Dev',
};

export function BusinessImpactPanel({ isOpen, onClose, values, selectedItems }: BusinessImpactPanelProps) {
  // Calculate which values are actively supported by selected items
  const getActiveFeatures = (): SupportedFeature[] => {
    const features: SupportedFeature[] = [];
    
    // Add features from products
    selectedItems.products.forEach(productName => {
      const feature = productToFeatureMap[productName];
      if (feature && !features.includes(feature)) {
        features.push(feature);
      }
    });
    
    // Add Agents if any agents are selected
    if (selectedItems.agents.length > 0 && !features.includes('Agents')) {
      features.push('Agents');
    }
    
    // Add Sidekick if any sidekick actions are selected
    if (selectedItems.sidekick.length > 0 && !features.includes('Sidekick')) {
      features.push('Sidekick');
    }
    
    return features;
  };

  const activeFeatures = getActiveFeatures();

  // Filter and sort values - prioritize those supported by selected items
  const sortedValues = [...values].sort((a, b) => {
    const aSupported = a.supportedBy.some(feature => activeFeatures.includes(feature));
    const bSupported = b.supportedBy.some(feature => activeFeatures.includes(feature));
    
    if (aSupported && !bSupported) return -1;
    if (!aSupported && bSupported) return 1;
    
    // If both supported or both not, sort by number of matching features
    const aMatchCount = a.supportedBy.filter(f => activeFeatures.includes(f)).length;
    const bMatchCount = b.supportedBy.filter(f => activeFeatures.includes(f)).length;
    return bMatchCount - aMatchCount;
  });

  const isValueActive = (value: Value) => {
    return value.supportedBy.some(feature => activeFeatures.includes(feature));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-background border-l border-border shadow-2xl z-50 overflow-hidden"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
            }}
          >
            {/* Header */}
            <div 
              className="relative px-8 py-6 border-b border-border overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(59, 130, 246, 0.05))',
              }}
            >
              {/* Animated background element */}
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  background: [
                    'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.3), transparent 70%)',
                    'radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.3), transparent 70%)',
                    'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.3), transparent 70%)',
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
              
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(59, 130, 246, 0.8))',
                        boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                      }}
                    >
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                      Business Impact
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    See what you'll achieve with your selected solution
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-border/50 transition-colors"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Active Features Indicator */}
              {activeFeatures.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 mt-4 flex items-center gap-2 flex-wrap"
                >
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Powered by:
                  </span>
                  <div className="flex gap-1.5">
                    {activeFeatures.map((feature) => {
                      const { src, label } = featureIcons[feature];
                      
                      return (
                        <motion.div 
                          key={feature}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-lg shrink-0 ring-2 ring-primary/50 overflow-hidden" 
                          title={label}
                        >
                          <img 
                            src={src} 
                            alt={label} 
                            className="w-full h-full object-cover" 
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Content */}
            <div className="overflow-y-auto h-[calc(100vh-180px)] px-8 py-6">
              <div className="space-y-4">
                {sortedValues.map((value, idx) => {
                  const isActive = isValueActive(value);
                  const Icon = value.icon;
                  const matchCount = value.supportedBy.filter(f => activeFeatures.includes(f)).length;
                  
                  return (
                    <motion.div
                      key={value.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="relative rounded-2xl border overflow-hidden group transition-all"
                      style={{
                        borderColor: isActive ? 'rgba(99, 102, 241, 0.5)' : 'var(--border)',
                        background: isActive 
                          ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(59, 130, 246, 0.05))'
                          : 'rgba(255, 255, 255, 0.02)',
                        boxShadow: isActive ? '0 8px 32px rgba(99, 102, 241, 0.15)' : 'none',
                      }}
                    >
                      {/* Active indicator stripe */}
                      {isActive && (
                        <motion.div
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          className="absolute left-0 top-0 bottom-0 w-1 origin-top"
                          style={{
                            background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.9), rgba(59, 130, 246, 0.9))',
                          }}
                        />
                      )}

                      <div className="p-6 pl-8">
                        {/* Icon and Title */}
                        <div className="flex items-start gap-4 mb-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                            style={{
                              background: isActive
                                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(59, 130, 246, 0.2))'
                                : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(59, 130, 246, 0.1))',
                              boxShadow: isActive ? '0 4px 16px rgba(99, 102, 241, 0.2)' : 'none',
                            }}
                          >
                            <Icon 
                              className="w-6 h-6" 
                              style={{ 
                                color: isActive ? 'rgb(99, 102, 241)' : 'rgba(148, 163, 184, 0.7)' 
                              }} 
                            />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 
                                className="text-lg"
                                style={{ 
                                  fontWeight: 'var(--font-weight-semibold)',
                                  color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
                                }}
                              >
                                {value.title}
                              </h4>
                              {isActive && matchCount > 0 && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                                  style={{
                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(59, 130, 246, 0.15))',
                                    color: 'rgb(99, 102, 241)',
                                    fontWeight: 'var(--font-weight-medium)',
                                  }}
                                >
                                  <Sparkles className="w-3 h-3" />
                                  Active
                                </motion.div>
                              )}
                            </div>
                            <p 
                              className="text-sm leading-relaxed"
                              style={{
                                color: isActive ? 'var(--muted-foreground)' : 'rgba(148, 163, 184, 0.6)',
                              }}
                            >
                              {value.description}
                            </p>
                          </div>
                        </div>

                        {/* Supported By Icons */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            Powered by:
                          </span>
                          <div className="flex gap-1.5">
                            {value.supportedBy.map((feature) => {
                              const { src, label } = featureIcons[feature];
                              const isFeatureActive = activeFeatures.includes(feature);
                              
                              return (
                                <div 
                                  key={feature}
                                  className="w-5 h-5 rounded-[4px] shrink-0 transition-all overflow-hidden" 
                                  title={label}
                                  style={{
                                    opacity: isFeatureActive ? 1 : 0.3,
                                    filter: isFeatureActive ? 'none' : 'grayscale(100%)',
                                  }}
                                >
                                  <img 
                                    src={src} 
                                    alt={label} 
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Replaces Tools */}
                        {value.replacesTools && value.replacesTools.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-border/50">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">
                              Replaces:
                            </span>
                            <div className="flex gap-1.5 flex-wrap">
                              {value.replacesTools.map((tool) => (
                                <span 
                                  key={tool} 
                                  className="px-2 py-1 text-[10px] rounded-md border"
                                  style={{
                                    backgroundColor: 'rgba(148, 163, 184, 0.1)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--muted-foreground-color)',
                                  }}
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}