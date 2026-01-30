import { AddItemModal } from './AddItemModal';
import { SidekickActionModal } from './SidekickActionModal';
import { AgentModal } from './AgentModal';
import { VibeAppModal } from './VibeAppModal';
import { PlatformValuesBar } from './PlatformValuesBar';

import { motion, AnimatePresence } from 'motion/react';
import { Box, Cpu, Zap, Plus, ChevronLeft, ChevronRight, TrendingUp, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState, isValidElement, cloneElement } from 'react';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';
import agentsLogo from '@/assets/99be461a455ae49743d963276e2023ed6cd1445d.png';
import vibeLogo from '@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png';

// Department-specific platform titles
const platformTitles: Record<string, { main: string; subtitle: string }> = {
  marketing: {
    main: 'Your AI work platform for marketing',
    subtitle: 'End-to-end solution that delivers faster and drives demand'
  },
  sales: {
    main: 'Your AI work platform for sales',
    subtitle: 'Accelerates deals and increases win rates'
  },
  operations: {
    main: 'Your AI work platform for operations',
    subtitle: 'Optimizes processes and boosts efficiency'
  },
  support: {
    main: 'Your AI work platform for customer service',
    subtitle: 'Resolves faster and delights customers'
  },
  product: {
    main: 'Your AI work platform for product development',
    subtitle: 'Accelerates innovation and speeds time-to-market'
  },
  legal: {
    main: 'Your AI work platform for legal',
    subtitle: 'Streamlines contracts and ensures compliance'
  },
  finance: {
    main: 'Your AI work platform for finance',
    subtitle: 'Automates workflows and delivers real-time insights'
  },
  hr: {
    main: 'Your AI work platform for HR',
    subtitle: 'Attracts talent and empowers your people'
  }
};

// Department-specific section labels
const departmentLabels: Record<string, {
  products: { title: string; subtitle: string };
  agents: { title: string; subtitle: string };
  vibe: { title: string; subtitle: string };
  sidekick: { title: string; subtitle: string };
}> = {
  marketing: {
    products: {
      title: 'Marketing Products',
      subtitle: 'AI-powered products for your marketing department to solve any core challenge'
    },
    agents: {
      title: 'Your unlimited marketing agents doing the work for you',
      subtitle: 'Unlimited resources of marketing expert agents doing the work for you'
    },
    vibe: {
      title: 'Marketing Vibe Apps',
      subtitle: 'Turn your marketing needs into a complete solution — consolidate your stack with just a prompt'
    },
    sidekick: {
      title: 'Your marketing AI assistant',
      subtitle: 'Intelligent AI assistant that understands your work, thinks and executes with you'
    }
  },
  sales: {
    products: {
      title: 'Sales Products',
      subtitle: 'AI-powered products for your sales department to solve any core challenge'
    },
    agents: {
      title: 'Sales Agents',
      subtitle: 'Unlimited resources of sales expert agents doing the work for you'
    },
    vibe: {
      title: 'Sales Vibe Apps',
      subtitle: 'Turn your sales needs into a complete solution — consolidate your stack with just a prompt'
    },
    sidekick: {
      title: 'Your sales AI assistant',
      subtitle: 'Intelligent AI assistant that understands your work, thinks and executes with you'
    }
  },
  operations: {
    products: {
      title: 'Operations Products',
      subtitle: 'AI-powered products for your operations department to solve any core challenge'
    },
    agents: {
      title: 'Operations Agents',
      subtitle: 'Unlimited resources of operations expert agents doing the work for you'
    },
    vibe: {
      title: 'Operations Vibe Apps',
      subtitle: 'Turn your operations needs into a complete solution — consolidate your stack with just a prompt'
    },
    sidekick: {
      title: 'Your operations AI assistant',
      subtitle: 'Intelligent AI assistant that understands your work, thinks and executes with you'
    }
  },
  support: {
    products: {
      title: 'Customer Service Products',
      subtitle: 'AI-powered products for your support department to solve any core challenge'
    },
    agents: {
      title: 'Customer Service Agents',
      subtitle: 'Unlimited resources of customer service expert agents doing the work for you'
    },
    vibe: {
      title: 'Customer Service Vibe Apps',
      subtitle: 'Turn your support needs into a complete solution — consolidate your stack with just a prompt'
    },
    sidekick: {
      title: 'Your customer service AI assistant',
      subtitle: 'Intelligent AI assistant that understands your work, thinks and executes with you'
    }
  },
  product: {
    products: {
      title: 'Product Development Products',
      subtitle: 'AI-powered products for your product department to solve any core challenge'
    },
    agents: {
      title: 'Product Development Agents',
      subtitle: 'Unlimited resources of product development expert agents doing the work for you'
    },
    vibe: {
      title: 'Product Development Vibe Apps',
      subtitle: 'Turn your product development needs into a complete solution — consolidate your stack with just a prompt'
    },
    sidekick: {
      title: 'Your product development AI assistant',
      subtitle: 'Intelligent AI assistant that understands your work, thinks and executes with you'
    }
  },
  legal: {
    products: {
      title: 'Legal Products',
      subtitle: 'AI-powered products for your legal department to solve any core challenge'
    },
    agents: {
      title: 'Legal Agents',
      subtitle: 'Unlimited resources of legal expert agents doing the work for you'
    },
    vibe: {
      title: 'Legal Vibe Apps',
      subtitle: 'Turn your legal needs into a complete solution — consolidate your stack with just a prompt'
    },
    sidekick: {
      title: 'Your legal AI assistant',
      subtitle: 'Intelligent AI assistant that understands your work, thinks and executes with you'
    }
  },
  finance: {
    products: {
      title: 'Finance Products',
      subtitle: 'AI-powered products for your finance department to solve any core challenge'
    },
    agents: {
      title: 'Finance Agents',
      subtitle: 'Unlimited resources of finance expert agents doing the work for you'
    },
    vibe: {
      title: 'Finance Vibe Apps',
      subtitle: 'Turn your finance needs into a complete solution — consolidate your stack with just a prompt'
    },
    sidekick: {
      title: 'Your finance AI assistant',
      subtitle: 'Intelligent AI assistant that understands your work, thinks and executes with you'
    }
  },
  hr: {
    products: {
      title: 'HR Products',
      subtitle: 'AI-powered products for your HR department to solve any core challenge'
    },
    agents: {
      title: 'HR Agents',
      subtitle: 'Unlimited resources of HR expert agents doing the work for you'
    },
    vibe: {
      title: 'HR Vibe Apps',
      subtitle: 'Turn your HR needs into a complete solution — consolidate your stack with just a prompt'
    },
    sidekick: {
      title: 'Your HR AI assistant',
      subtitle: 'Intelligent AI assistant that understands your work, thinks and executes with you'
    }
  }
};

interface VibeCarouselCardProps {
  app: {
    name: string;
    value: string;
    image?: string;
    icon?: any;
    replacesTools?: string[];
  };
  index: number;
  onClick: () => void;
}

function VibeCarouselCard({ app, index, onClick }: VibeCarouselCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.button
      key={index}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="w-full h-full rounded-[var(--radius-card)] border overflow-hidden relative cursor-pointer"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        borderColor: 'rgba(99, 102, 241, 0.2)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      }}
    >
      {app?.image ? (
        <>
          {/* Full height image */}
          <img 
            src={app.image} 
            alt={app.name} 
            className="w-full h-full object-cover"
          />
          
          {/* Semi-transparent overlay on entire image for depth */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.2) 100%)',
            }}
          />
          
          {/* App info bar at bottom - NOW REBUILT */}
          <div 
            className="absolute bottom-0 left-0 right-0 px-4 py-3"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(12px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="flex items-center gap-3">
              {/* App Icon - REBUILT SIMPLE VERSION */}
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.35), rgba(233, 30, 99, 0.25))',
                }}
              >
                {app.icon ? (
                  <app.icon className="w-6 h-6" style={{ color: '#ff6384' }} />
                ) : (
                  <Zap className="w-6 h-6" style={{ color: '#ff6384' }} />
                )}
              </div>
              
              {/* Text content */}
              <div className="flex-1 min-w-0">
                <h4 
                  className="text-base text-white leading-tight mb-1 text-left"
                  style={{ 
                    fontWeight: 'var(--font-weight-bold)',
                  }}
                >
                  {app.name}
                </h4>
                
                <p 
                  className="text-xs leading-tight text-left"
                  style={{ 
                    fontWeight: 'var(--font-weight-medium)',
                    color: '#ffb3c6',
                  }}
                >
                  {app.value}
                </p>
              </div>
            </div>
          </div>
          
          {/* View App Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.9), rgba(233, 30, 99, 0.85))',
              backdropFilter: 'blur(4px)',
            }}
          >
            <span 
              className="text-xl text-white"
              style={{ fontWeight: 'var(--font-weight-bold)' }}
            >
              View app
            </span>
          </motion.div>
        </>
      ) : (
        <div className="w-full h-full p-6 flex flex-col items-center justify-center relative">
          {/* Check if this is "Build your own" */}
          {app?.name === 'Build your own' ? (
            <>
              {/* Special "Build your own" design */}
              {/* Gradient border effect */}
              <div 
                className="absolute inset-0 rounded-[var(--radius-card)]"
                style={{
                  background: 'linear-gradient(135deg, rgba(22, 112, 253, 0.2), rgba(255, 131, 224, 0.2), rgba(55, 233, 200, 0.2), rgba(255, 201, 3, 0.2), rgba(255, 110, 46, 0.2))',
                  padding: '2px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />
              
              {/* Gradient icon with glow */}
              <div className="relative mb-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                  style={{
                    background: 'linear-gradient(135deg, #1670FD, #FF83E0, #37E9C8, #FFC903, #FF6E2E)',
                    boxShadow: '0 8px 24px rgba(255, 131, 224, 0.3)',
                  }}
                >
                  {app?.icon && typeof app.icon === 'function' ? (
                    <app.icon className="w-9 h-9 text-white" />
                  ) : app?.icon && isValidElement(app.icon) ? (
                    cloneElement(app.icon as any, { className: 'w-9 h-9 text-white' })
                  ) : (
                    <Zap className="w-9 h-9 text-white" />
                  )}
                </div>
              </div>
              
              <h4 
                className="text-lg text-center leading-tight mb-2"
                style={{ 
                  fontWeight: 'var(--font-weight-bold)',
                  backgroundImage: 'linear-gradient(135deg, #1670FD, #FF83E0, #37E9C8, #FFC903, #FF6E2E)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {app?.name}
              </h4>
              
              <p 
                className="text-sm text-white/70 text-center"
                style={{ fontWeight: 'var(--font-weight-medium)' }}
              >
                {app?.value}
              </p>
              
              {/* Hover overlay with gradient */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-card)]"
                style={{
                  background: 'linear-gradient(135deg, rgba(22, 112, 253, 0.95), rgba(255, 131, 224, 0.95))',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <span 
                  className="text-xl text-white"
                  style={{ fontWeight: 'var(--font-weight-bold)' }}
                >
                  Create app
                </span>
              </motion.div>
            </>
          ) : (
            <>
              {/* Regular vibe app design */}
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(245, 158, 11, 0.15))',
                }}
              >
                {app?.icon && typeof app.icon === 'function' ? (
                  <app.icon className="w-10 h-10 text-amber-400" />
                ) : app?.icon && isValidElement(app.icon) ? (
                  cloneElement(app.icon as any, { className: 'w-10 h-10 text-amber-400' })
                ) : (
                  <Zap className="w-10 h-10 text-amber-400" />
                )}
              </div>
              
              <h4 
                className="text-lg text-white leading-tight mb-2 text-center"
                style={{ fontWeight: 'var(--font-weight-bold)' }}
              >
                {app?.name}
              </h4>
              
              <p 
                className="text-sm text-white/70 text-center"
                style={{ fontWeight: 'var(--font-weight-medium)' }}
              >
                {app?.value}
              </p>
            </>
          )}
        </div>
      )}
    </motion.button>
  );
}

interface IsometricCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
  size?: 'small' | 'medium';
  type: 'product' | 'agent' | 'sidekick' | 'vibe';
  image?: string;
  value?: string;
  onClick?: () => void;
  isRemovable?: boolean;
  onRemove?: () => void;
}

export function IsometricCard({ 
  title, 
  subtitle, 
  icon, 
  color, 
  delay,
  size = 'small',
  type,
  image,
  value,
  onClick,
  isRemovable = false,
  onRemove
}: IsometricCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const sizeMap = {
    small: { width: '160px', padding: 'p-4' },
    medium: { width: '180px', padding: 'p-5' }
  };
  
  const dimensions = sizeMap[size];
  
  // Type specific styling - updated to match sidebar design
  const typeStyles = {
    product: {
      bgGradient: 'rgba(255, 255, 255, 0.02)',
      borderColor: 'rgba(99, 102, 241, 0.2)',
      labelColor: '#6366f1',
      labelBg: 'rgba(99, 102, 241, 0.15)',
    },
    agent: {
      bgGradient: 'rgba(255, 255, 255, 0.02)',
      borderColor: 'rgba(99, 102, 241, 0.2)',
      labelColor: '#6366f1',
      labelBg: 'rgba(99, 102, 241, 0.15)',
    },
    sidekick: {
      bgGradient: 'rgba(255, 255, 255, 0.02)',
      borderColor: 'rgba(99, 102, 241, 0.2)',
      labelColor: '#6366f1',
      labelBg: 'rgba(99, 102, 241, 0.15)',
    },
    vibe: {
      bgGradient: 'rgba(255, 255, 255, 0.02)',
      borderColor: 'rgba(99, 102, 241, 0.2)',
      labelColor: '#6366f1',
      labelBg: 'rgba(99, 102, 241, 0.15)',
    }
  };
  
  const styling = typeStyles[type];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -3 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
      className="cursor-pointer w-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div 
        className="relative h-full rounded-[var(--radius-card)] border backdrop-blur-xl overflow-hidden"
        style={{
          background: styling.bgGradient,
          borderColor: styling.borderColor,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          minHeight: '140px'
        }}
      >
        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0"
          style={{
            backgroundImage: `linear-gradient(45deg, transparent 30%, ${color}10 50%, transparent 70%)`,
            backgroundSize: '200% 100%',
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
            backgroundPosition: isHovered ? ['-200% 0', '200% 0'] : '-200% 0',
          }}
          transition={{
            opacity: { duration: 0.3 },
            backgroundPosition: { duration: 1.5, repeat: Infinity, ease: 'linear' }
          }}
        />
        
        {/* Content - Full height image for agents with images, or icon layout for others */}
        {image && (type === 'agent' || type === 'vibe') ? (
          <>
            {/* Full height image */}
            <div className="relative h-full flex flex-col">
              <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover"
                style={{ 
                  objectPosition: 'center',
                }}
              />
              
              {/* Title overlay at bottom */}
              <div 
                className="absolute bottom-0 left-0 right-0 p-3"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                }}
              >
                <h4 
                  className="text-white leading-tight"
                  style={{ 
                    fontWeight: 'var(--font-weight-bold)',
                    fontSize: '14px',
                    lineHeight: '1.1',
                  }}
                >
                  {(() => {
                    const words = title.split(' ');
                    if (words.length >= 2) {
                      return (
                        <>
                          <div>{words[0]}</div>
                          <div>{words.slice(1).join(' ')}</div>
                        </>
                      );
                    }
                    return title;
                  })()}
                </h4>
              </div>
            </div>
          </>
        ) : (
          <div className={`relative h-full flex flex-col z-10 ${dimensions.padding}`}>
            {/* Icon - Same size for all, but Sidekick without background */}
            {type === 'sidekick' ? (
              <motion.div 
                className="w-10 h-10 flex items-center justify-center mb-3"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                {icon}
              </motion.div>
            ) : (
              <motion.div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{
                  background: `linear-gradient(135deg, ${color}25, ${color}15)`,
                  boxShadow: `0 2px 8px ${color}30`,
                }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {icon}
              </motion.div>
            )}
            
            {/* Title */}
            <h4 
              className="text-sm text-white leading-tight"
              style={{ fontWeight: 'var(--font-weight-bold)' }}
            >
              {title}
            </h4>
          </div>
        )}
        
        {/* Hover Overlay - Shows Value or Click to Configure */}
        {(value || onClick) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center p-3 cursor-pointer z-20"
            style={{
              background: `linear-gradient(135deg, ${color}f0, ${color}e8)`,
              backdropFilter: 'blur(12px)',
              pointerEvents: isHovered ? 'auto' : 'none',
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick();
            }}
          >
            <div className="text-center w-full">
              {value ? (
                <>
                  <p 
                    className="text-[10px] text-white mb-1.5 uppercase tracking-wider"
                    style={{ fontWeight: 'var(--font-weight-bold)' }}
                  >
                    Value
                  </p>
                  <p 
                    className="text-[11px] text-white leading-snug"
                    style={{ fontWeight: 'var(--font-weight-semibold)' }}
                  >
                    {value}
                  </p>
                </>
              ) : onClick ? (
                <p 
                  className="text-sm text-white uppercase tracking-wide"
                  style={{ fontWeight: 'var(--font-weight-semibold)' }}
                >
                  View Details
                </p>
              ) : null}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

interface RackProps {
  title: string;
  color: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
  icon: React.ReactNode;
}

function Rack({ title, color, position, children, icon }: RackProps) {
  const positionStyles = {
    top: { 
      container: 'flex-row top-0 left-1/2 -translate-x-1/2 -translate-y-[280px]',
      rack: 'flex-row',
      layout: 'flex-row'
    },
    right: { 
      container: 'flex-col right-0 top-1/2 -translate-y-1/2 translate-x-[390px]',
      rack: 'flex-col',
      layout: 'flex-col'
    },
    bottom: { 
      container: 'flex-row bottom-0 left-1/2 -translate-x-1/2 translate-y-[270px]',
      rack: 'flex-row',
      layout: 'flex-row'
    },
    left: { 
      container: 'flex-col left-0 top-1/2 -translate-y-1/2 -translate-x-[390px]',
      rack: 'flex-col',
      layout: 'flex-col'
    }
  };
  
  const styles = positionStyles[position];
  
  return (
    <div className={`absolute flex ${styles.container}`}>
      {/* Rack Container with Header Inside */}
      <div 
        className={`flex ${styles.layout} gap-3 p-3 rounded-xl border backdrop-blur-xl`}
        style={{
          background: `linear-gradient(135deg, ${color}08, ${color}03)`,
          borderColor: `${color}20`,
          boxShadow: `0 8px 32px ${color}15, inset 0 1px 0 rgba(255, 255, 255, 0.03)`,
        }}
      >
        {/* Rack Header - Now Inside */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-2 mb-2"
        >
          <div 
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${color}30, ${color}15)`,
              boxShadow: `0 2px 12px ${color}40`,
            }}
          >
            {icon}
          </div>
          <div>
            <h3 
              className="text-sm text-white leading-none whitespace-nowrap"
              style={{ fontWeight: 'var(--font-weight-bold)' }}
            >
              {title}
            </h3>
            <p 
              className="text-[9px] uppercase tracking-wider mt-0.5 whitespace-nowrap"
              style={{ 
                fontWeight: 'var(--font-weight-semibold)',
                color: color 
              }}
            >
              Connected
            </p>
          </div>
        </motion.div>
        
        {/* Cards Container */}
        <div className={`flex ${styles.rack} gap-2`}>
          {children}
          
          {/* Add Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 rounded-xl border-2 border-dashed flex items-center justify-center"
            style={{
              width: '120px',
              minHeight: '100px',
              borderColor: `${color}30`,
              background: `${color}05`,
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: `${color}20` }}
              >
                <Plus className="w-4 h-4" style={{ color: color }} />
              </div>
              <span 
                className="text-[10px]"
                style={{ 
                  fontWeight: 'var(--font-weight-semibold)',
                  color: color 
                }}
              >
                Add more
              </span>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

interface IsometricPlatformVisualizationProps {
  department?: string;
  products: Array<{ name: string; icon: React.ReactNode; description?: string; value?: string; image?: string; useCases?: string[]; replacesTools?: string[] }>;
  agents: Array<{ name: string; image?: string; value?: string }>;
  sidekickActions: Array<{ name: string; description: string; value: string }>;
  vibeApps: Array<{ name: string; icon?: React.ReactNode; image?: string; value?: string; replacesTools?: string[] }>;
  onAddProduct?: (productName: string) => void;
  onAddAgent?: (agentName: string) => void;
  onAddSidekickAction?: (actionName: string) => void;
  onAddVibeApp?: (appName: string) => void;
  onRemoveProduct?: (productName: string) => void;
  onRemoveAgent?: (agentName: string) => void;
  onRemoveSidekickAction?: (actionName: string) => void;
  onRemoveVibeApp?: (appName: string) => void;
  availableProducts?: Array<{ name: string; description?: string; image?: string }>;
  availableAgents?: Array<{ name: string; description?: string; image?: string }>;
  availableSidekickActions?: Array<{ name: string; description?: string; image?: string }>;
  availableVibeApps?: Array<{ name: string; icon?: React.ReactNode; value?: string; image?: string; replacesTools?: string[] }>;
  originalProductNames?: string[];
  originalAgentNames?: string[];
  originalSidekickActionNames?: string[];
  originalVibeAppNames?: string[];
  onViewImpact?: () => void;
  // Header info
  selectedDepartmentInfo?: {
    title: string;
    desc: string;
    avatarImage: string;
    avatarBgColor: string;
  };
  onChangeSelection?: () => void;
}

export function IsometricPlatformVisualization({
  department,
  products,
  agents,
  sidekickActions,
  vibeApps,
  onAddProduct,
  onAddAgent,
  onAddSidekickAction,
  onAddVibeApp,
  onRemoveProduct,
  onRemoveAgent,
  onRemoveSidekickAction,
  onRemoveVibeApp,
  availableProducts = [],
  availableAgents = [],
  availableSidekickActions = [],
  availableVibeApps = [],
  originalProductNames = [],
  originalAgentNames = [],
  originalSidekickActionNames = [],
  originalVibeAppNames = [],
  onViewImpact,
  selectedDepartmentInfo,
  onChangeSelection
}: IsometricPlatformVisualizationProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'product' | 'agent' | 'sidekick' | 'vibe' | null;
  }>({
    isOpen: false,
    type: null
  });
  
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const [currentVibeIndex, setCurrentVibeIndex] = useState(0);
  const [selectedVibeApp, setSelectedVibeApp] = useState<typeof vibeApps[0] | null>(null);
  const [isVibeModalOpen, setIsVibeModalOpen] = useState(false);
  const [selectedSidekickAction, setSelectedSidekickAction] = useState<typeof sidekickActions[0] | null>(null);
  const [isSidekickModalOpen, setIsSidekickModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [isProductsCollapsed, setIsProductsCollapsed] = useState(false);
  
  // Get dynamic labels for current department
  const labels = departmentLabels[department] || departmentLabels.marketing;
  
  const openModal = (type: 'product' | 'agent' | 'sidekick' | 'vibe') => {
    setModalState({ isOpen: true, type });
  };
  
  const closeModal = () => {
    setModalState({ isOpen: false, type: null });
  };
  
  const handleAdd = (itemName: string) => {
    if (modalState.type === 'product' && onAddProduct) {
      onAddProduct(itemName);
    } else if (modalState.type === 'agent' && onAddAgent) {
      onAddAgent(itemName);
    } else if (modalState.type === 'sidekick' && onAddSidekickAction) {
      onAddSidekickAction(itemName);
    } else if (modalState.type === 'vibe' && onAddVibeApp) {
      onAddVibeApp(itemName);
    }
  };
  
  const handleRemove = (itemName: string) => {
    if (modalState.type === 'product' && onRemoveProduct) {
      onRemoveProduct(itemName);
    } else if (modalState.type === 'agent' && onRemoveAgent) {
      onRemoveAgent(itemName);
    } else if (modalState.type === 'sidekick' && onRemoveSidekickAction) {
      onRemoveSidekickAction(itemName);
    } else if (modalState.type === 'vibe' && onRemoveVibeApp) {
      onRemoveVibeApp(itemName);
    }
  };
  
  const getAvailableItems = () => {
    if (modalState.type === 'product') return availableProducts;
    if (modalState.type === 'agent') return availableAgents;
    if (modalState.type === 'sidekick') return availableSidekickActions;
    if (modalState.type === 'vibe') return availableVibeApps;
    return [];
  };
  
  const getSelectedItems = () => {
    if (modalState.type === 'product') return products.map(p => p.name);
    if (modalState.type === 'agent') return agents.map(a => a.name);
    if (modalState.type === 'sidekick') return sidekickActions.map(s => s.name);
    if (modalState.type === 'vibe') return vibeApps.map(v => v.name);
    return [];
  };
  
  const getOriginalItems = () => {
    if (modalState.type === 'product') return originalProductNames;
    if (modalState.type === 'agent') return originalAgentNames;
    if (modalState.type === 'sidekick') return originalSidekickActionNames;
    if (modalState.type === 'vibe') return originalVibeAppNames;
    return [];
  };
  
  return (
    <div className="relative w-full min-h-[900px] flex items-start justify-center pt-8 pb-20 z-10" style={{ 
      background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.04), transparent 60%)',
    }}>
      {/* Grid Background - very subtle */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="isometric-grid" width="60" height="34.64" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
              <path 
                d="M 0 0 L 60 0 M 0 17.32 L 60 17.32 M 0 34.64 L 60 34.64" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5"
                className="text-blue-400"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#isometric-grid)" />
        </svg>
      </div>
      
      {/* Main Platform Container with all content inside */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
        className="relative"
      >
        {/* Connection Line from Sidebar - Left side */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
          className="hidden xl:block absolute left-0 top-1/2 -translate-y-1/2 h-[3px] origin-right pointer-events-none"
          style={{
            width: 'calc(1.5rem)',
            right: '100%',
            background: 'linear-gradient(90deg, rgba(97, 97, 255, 0.3), rgba(97, 97, 255, 0.8))',
            boxShadow: '0 0 12px rgba(97, 97, 255, 0.5)',
          }}
        >
          {/* Pulsing glow at connection point */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{
              background: 'rgba(97, 97, 255, 1)',
              boxShadow: '0 0 12px rgba(97, 97, 255, 0.8)',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.6, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
        
        <div 
          className="w-full max-w-[1100px] rounded-[var(--radius-card)] border backdrop-blur-xl relative p-4 md:p-6 xl:p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderColor: 'rgba(255, 255, 255, 0.25)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Animated glow effect - subtle */}
          <motion.div
            className="absolute inset-0 opacity-30 rounded-[var(--radius-card)]"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1), transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.1), transparent 50%)',
                'radial-gradient(circle at 50% 80%, rgba(99, 102, 241, 0.1), transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1), transparent 50%)',
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
          
          {/* Border glow animation */}
          <motion.div
            className="absolute inset-0 rounded-[var(--radius-card)] pointer-events-none"
            animate={{
              boxShadow: [
                '0 0 15px rgba(255, 255, 255, 0.15), inset 0 0 15px rgba(255, 255, 255, 0.08)',
                '0 0 25px rgba(255, 255, 255, 0.2), inset 0 0 25px rgba(255, 255, 255, 0.12)',
                '0 0 15px rgba(255, 255, 255, 0.15), inset 0 0 15px rgba(255, 255, 255, 0.08)',
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          
          <div className="relative z-10">
            {/* Department Header - Centered & Elegant */}
            {selectedDepartmentInfo && (
              <div className="text-center mb-12">
                {/* Avatar - Centered */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex justify-center mb-6"
                >
                  <div 
                    className="relative w-24 h-24 rounded-full"
                    style={{ 
                      backgroundColor: selectedDepartmentInfo.avatarBgColor,
                      border: '3px solid rgba(97, 97, 255, 0.5)'
                    }}
                  >
                    <div className="overflow-hidden rounded-full w-full h-full">
                      <img 
                        src={selectedDepartmentInfo.avatarImage} 
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <motion.div
                      animate={{ 
                        opacity: [0.4, 0.7, 0.4],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="absolute inset-0 rounded-full"
                      style={{
                        boxShadow: `0 0 40px ${selectedDepartmentInfo.avatarBgColor}`,
                      }}
                    />
                  </div>
                </motion.div>
                
                {/* Department Title - Centered & Large */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-center mb-3"
                >
                  <h2 
                    className="text-white mb-3"
                    style={{ 
                      fontSize: 'clamp(1.875rem, 4vw, 2.5rem)',
                      lineHeight: '1.2',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    <span style={{ fontWeight: 'var(--font-weight-regular)' }}>
                      Your AI Work Platform
                    </span>
                    <br />
                    <span 
                      className="bg-gradient-to-r from-[#6161ff] via-[#c7ede0] to-[#eaecd8] bg-clip-text text-transparent"
                      style={{ fontWeight: 'var(--font-weight-bold)' }}
                    >
                      for {selectedDepartmentInfo.title}
                    </span>
                  </h2>
                  
                  {/* Subtitle - Value Proposition */}
                  {department && platformTitles[department] && (
                    <p 
                      className="text-white/60 max-w-2xl mx-auto"
                      style={{ 
                        fontWeight: 'var(--font-weight-regular)',
                        fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
                        lineHeight: '1.6'
                      }}
                    >
                      {platformTitles[department].subtitle}
                    </p>
                  )}
                </motion.div>
                
                {/* Business Impact Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="mt-6 mb-8 flex justify-center"
                >
                  <button
                    onClick={onViewImpact}
                    className="group flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300"
                    style={{
                      background: 'rgba(99, 102, 241, 0.08)',
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                      fontWeight: 'var(--font-weight-medium)',
                      fontSize: '0.9375rem'
                    }}
                  >
                    <TrendingUp className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                    <span className="text-white/70 group-hover:text-white transition-colors">
                      View Business Impact
                    </span>
                  </button>
                </motion.div>
                

              </div>
            )}
            
            {/* Platform Grid - All components inside */}
            <div 
              className="grid xl:grid-cols-[auto_1fr] gap-4 md:gap-6 transition-all duration-300"
              style={{
                gridTemplateColumns: isProductsCollapsed 
                  ? '80px 1fr' 
                  : undefined,
              }}
            >
              
              {/* LEFT COLUMN - PRODUCTS TAB SELECTOR Section */}
              <motion.div 
                layout
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="rounded-[var(--radius-card)] border backdrop-blur-xl overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderColor: 'rgba(99, 102, 241, 0.2)',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)',
                  minWidth: isProductsCollapsed ? '80px' : '320px',
                  maxWidth: isProductsCollapsed ? '80px' : '420px',
                }}
              >
                {isProductsCollapsed ? (
                  /* Collapsed View - Vertical Icons */
                  <div className="flex flex-col items-center gap-2 p-2 h-full">
                    {/* Expand Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsProductsCollapsed(false)}
                      className="w-12 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'rgba(99, 102, 241, 0.2)',
                        border: '1px solid rgba(99, 102, 241, 0.4)',
                      }}
                      title="Expand products"
                    >
                      <ChevronsRight className="w-4 h-4 text-blue-400" />
                    </motion.button>
                    
                    <div className="w-8 h-px my-1" style={{ background: 'rgba(99, 102, 241, 0.2)' }} />
                    
                    {/* Product Icons */}
                    {products.map((product, idx) => (
                      <motion.button
                        key={product.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05, x: 2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setIsProductsCollapsed(false);
                          setTimeout(() => setSelectedProductIndex(idx), 300);
                        }}
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: selectedProductIndex === idx 
                            ? 'rgba(97, 97, 255, 0.3)' 
                            : 'rgba(99, 102, 241, 0.15)',
                          border: selectedProductIndex === idx
                            ? '1px solid rgba(97, 97, 255, 0.5)'
                            : '1px solid rgba(99, 102, 241, 0.3)',
                        }}
                        title={product.name}
                      >
                        <div className="w-6 h-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain">
                          {product.icon}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  /* Expanded View - Full Content */
                  <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    <Box className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 
                      className="text-sm text-white leading-none"
                      style={{ fontWeight: 'var(--font-weight-semibold)' }}
                    >
                      {labels.products.title}
                    </h4>
                    <p 
                      className="text-xs mt-1 leading-tight text-white/40"
                      style={{ 
                        fontWeight: 'var(--font-weight-regular)',
                      }}
                    >
                      {labels.products.subtitle}
                    </p>
                  </div>
                  
                  {/* Collapse Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsProductsCollapsed(true)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                    }}
                    title="Collapse products"
                  >
                    <ChevronsLeft className="w-4 h-4 text-blue-400" />
                  </motion.button>
                </div>
                
                {/* Product Tabs - Each with expandable content */}
                <div className="space-y-2">
                  {products.map((product, idx) => (
                    <motion.div
                      key={product.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="rounded-[var(--radius-card)] border overflow-hidden"
                      style={{
                        background: selectedProductIndex === idx 
                          ? 'rgba(97, 97, 255, 0.12)'
                          : 'rgba(255, 255, 255, 0.02)',
                        borderColor: selectedProductIndex === idx
                          ? 'rgba(97, 97, 255, 0.4)'
                          : 'rgba(99, 102, 241, 0.15)',
                      }}
                    >
                      {/* Tab Header */}
                      <motion.button
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedProductIndex(selectedProductIndex === idx ? null : idx)}
                        className="w-full flex items-center gap-2.5 p-2.5"
                      >
                        <div 
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background: 'rgba(99, 102, 241, 0.15)',
                            border: '1px solid rgba(99, 102, 241, 0.25)',
                          }}
                        >
                          {product.icon}
                        </div>
                        <span 
                          className="text-sm text-white/90 text-left flex-1"
                          style={{ fontWeight: 'var(--font-weight-medium)' }}
                        >
                          {product.name}
                        </span>
                        <motion.div
                          animate={{ rotate: selectedProductIndex === idx ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </motion.button>
                      
                      {/* Expandable Content */}
                      <motion.div
                        initial={false}
                        animate={{
                          height: selectedProductIndex === idx ? 'auto' : 0,
                          opacity: selectedProductIndex === idx ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="px-3 pb-3">
                          <div 
                            className="p-4 rounded-xl border"
                            style={{
                              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08))',
                              borderColor: 'rgba(59, 130, 246, 0.3)',
                            }}
                          >
                            {/* Product Image */}
                            {product.image && (
                              <div className="mb-4 rounded-lg overflow-hidden">
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-full h-auto object-cover"
                                />
                              </div>
                            )}
                            
                            <p 
                              className="text-xs text-white/70 mb-2 uppercase tracking-wide"
                              style={{ fontWeight: 'var(--font-weight-semibold)' }}
                            >
                              Description
                            </p>
                            <p 
                              className="text-sm text-white/90 mb-3 leading-relaxed"
                              style={{ fontWeight: 'var(--font-weight-regular)' }}
                            >
                              {product.description}
                            </p>
                            
                            <p 
                              className="text-xs text-white/70 mb-2 uppercase tracking-wide"
                              style={{ fontWeight: 'var(--font-weight-semibold)' }}
                            >
                              Value
                            </p>
                            <p 
                              className="text-sm leading-relaxed"
                              style={{ 
                                fontWeight: 'var(--font-weight-medium)',
                                color: '#60a5fa'
                              }}
                            >
                              {product.value}
                            </p>
                            
                            {/* Use Cases */}
                            {product.useCases && product.useCases.length > 0 && (
                              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                                <p 
                                  className="text-xs text-white/70 mb-2 uppercase tracking-wide"
                                  style={{ fontWeight: 'var(--font-weight-semibold)' }}
                                >
                                  Use Cases
                                </p>
                                <ul className="space-y-1.5">
                                  {product.useCases.map((useCase, idx) => (
                                    <li 
                                      key={idx}
                                      className="text-xs text-white/80 flex items-start gap-2"
                                      style={{ fontWeight: 'var(--font-weight-regular)' }}
                                    >
                                      <span className="text-blue-400 mt-0.5">•</span>
                                      <span>{useCase}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {/* Replaces Tools */}
                            {product.replacesTools && product.replacesTools.length > 0 && (
                              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                                <p 
                                  className="text-xs text-white/70 mb-2 uppercase tracking-wide"
                                  style={{ fontWeight: 'var(--font-weight-semibold)' }}
                                >
                                  Replaces Tools
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {product.replacesTools.map((tool, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs"
                                      style={{ 
                                        fontWeight: 'var(--font-weight-medium)',
                                        background: 'rgba(59, 130, 246, 0.15)',
                                        color: '#93c5fd',
                                        border: '1px solid rgba(59, 130, 246, 0.3)'
                                      }}
                                    >
                                      <div 
                                        className="w-4 h-4 rounded flex items-center justify-center text-[8px]"
                                        style={{ 
                                          background: typeof tool === 'string' ? '#3b82f6' : tool.color || '#3b82f6',
                                          color: 'white',
                                          fontWeight: 'var(--font-weight-bold)'
                                        }}
                                      >
                                        {typeof tool === 'string' ? tool.charAt(0) : tool.name.charAt(0)}
                                      </div>
                                      <span>{typeof tool === 'string' ? tool : tool.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                  
                  {/* Add Product Button */}
                  {onAddProduct && (
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + products.length * 0.1 }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openModal('product')}
                      className="w-full flex items-center justify-center gap-2 p-2.5 rounded-[var(--radius-card)] border"
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderColor: 'rgba(99, 102, 241, 0.2)',
                        borderStyle: 'dashed',
                      }}
                    >
                      <Plus className="w-4 h-4 text-white/40" />
                      <span 
                        className="text-sm text-white/60"
                        style={{ fontWeight: 'var(--font-weight-medium)' }}
                      >
                        Add Product
                      </span>
                    </motion.button>
                  )}
                </div>
                  </div>
                )}
              </motion.div>
              
              {/* RIGHT COLUMN - Stack of Agents, Vibe, Sidekick */}
              <div className="flex flex-col gap-6">
                
                {/* AGENTS Section */}
                <div 
                  className="rounded-[var(--radius-card)] border backdrop-blur-xl p-5"
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderColor: 'rgba(99, 102, 241, 0.2)',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)',
                  }}
                >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <img src={agentsLogo} alt="Agents" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p 
                        className="text-xs mb-1 uppercase tracking-wide"
                        style={{ 
                          fontWeight: 'var(--font-weight-medium)',
                          backgroundImage: 'linear-gradient(135deg, #BF6AED, #51E0FD, #31D596)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        Marketing agents
                      </p>
                      <h4 
                        className="text-base text-white leading-tight"
                        style={{ fontWeight: 'var(--font-weight-semibold)' }}
                      >
                        Your unlimited marketing agents<br />
                        doing the work for you
                      </h4>
                    </div>
                  </div>
                  
                  {/* Add Button - Top Right - Show when there are 3 items */}
                  {(agents.length >= 3 && availableAgents.length > 0) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openModal('agent')}
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                      }}
                    >
                      <Plus className="w-4 h-4 text-blue-400" />
                    </motion.button>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {agents.map((agent, idx) => (
                    <IsometricCard
                      key={agent.name}
                      title={agent.name}
                      icon={<img src={agentsLogo} alt="" className="w-5 h-5 object-contain" />}
                      color="#06b6d4"
                      delay={0.5 + idx * 0.1}
                      size="small"
                      type="agent"
                      image={agent.image}
                      value={agent.value}
                      onClick={() => {
                        setSelectedAgent(agent);
                        setIsAgentModalOpen(true);
                      }}
                    />
                  ))}
                  {agents.length < 3 && availableAgents.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full min-h-[140px] rounded-[var(--radius-card)] border border-dashed flex items-center justify-center"
                      style={{
                        borderColor: 'rgba(99, 102, 241, 0.3)',
                        background: 'rgba(255, 255, 255, 0.02)',
                      }}
                      onClick={() => openModal('agent')}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(99, 102, 241, 0.15)' }}
                        >
                          <Plus className="w-4 h-4 text-blue-400" />
                        </div>
                        <span 
                          className="text-xs text-white/60"
                          style={{ fontWeight: 'var(--font-weight-medium)' }}
                        >
                          Add more
                        </span>
                      </div>
                    </motion.button>
                  )}
                </div>
                </div>
                
                {/* VIBE APPS Section */}
                <div 
                  className="rounded-[var(--radius-card)] border backdrop-blur-xl p-5"
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderColor: 'rgba(99, 102, 241, 0.2)',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)',
                  }}
                >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <img src={vibeLogo} alt="Vibe" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p 
                        className="text-xs mb-1 uppercase tracking-wide"
                        style={{ 
                          fontWeight: 'var(--font-weight-medium)',
                          backgroundImage: 'linear-gradient(135deg, #FED031, #FF87EF, #FF7038)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        Marketing Vibe
                      </p>
                      <h4 
                        className="text-base text-white leading-tight"
                        style={{ fontWeight: 'var(--font-weight-semibold)' }}
                      >
                        Tailored marketing apps<br />
                        with just a prompt
                      </h4>
                    </div>
                  </div>
                  
                  {/* Add Button - Top Right */}
                  {availableVibeApps.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openModal('vibe')}
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                    </motion.button>
                  )}
                </div>
                
                {/* Carousel Container */}
                <div className="relative">
                  {/* Navigation Buttons */}
                  {vibeApps.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentVibeIndex((prev) => (prev === 0 ? vibeApps.length - 1 : prev - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{
                          background: 'rgba(99, 102, 241, 0.2)',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                        }}
                      >
                        <ChevronLeft className="w-4 h-4 text-white/80" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentVibeIndex((prev) => (prev === vibeApps.length - 1 ? 0 : prev + 1))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{
                          background: 'rgba(99, 102, 241, 0.2)',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                        }}
                      >
                        <ChevronRight className="w-4 h-4 text-white/80" />
                      </motion.button>
                    </>
                  )}
                  
                  {/* Large Vibe Card - Increased height for better image visibility */}
                  <div className="w-full" style={{ minHeight: '240px', height: 'auto' }}>
                    <AnimatePresence mode="wait">
                      <VibeCarouselCard
                        app={vibeApps[currentVibeIndex]}
                        index={currentVibeIndex}
                        onClick={() => {
                          setSelectedVibeApp(vibeApps[currentVibeIndex]);
                          setIsVibeModalOpen(true);
                        }}
                      />
                    </AnimatePresence>
                  </div>
                  
                  {/* Dots Indicator */}
                  {vibeApps.length > 1 && (
                    <div className="flex justify-center gap-2 mt-3">
                      {vibeApps.map((_, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setCurrentVibeIndex(idx)}
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: idx === currentVibeIndex ? '#f59e0b' : 'rgba(245, 158, 11, 0.3)',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                </div>
                
                {/* SIDEKICK Section */}
                <div 
                className="rounded-[var(--radius-card)] border backdrop-blur-xl p-5"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderColor: 'rgba(99, 102, 241, 0.2)',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <img src={sidekickLogo} alt="Sidekick" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p 
                        className="text-xs mb-1 uppercase tracking-wide"
                        style={{ 
                          fontWeight: 'var(--font-weight-medium)',
                          backgroundImage: 'linear-gradient(135deg, #1670FD, #FF83E0, #37E9C8, #FFC903, #FF6E2E)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        Marketing Sidekick
                      </p>
                      <h4 
                        className="text-base text-white leading-tight"
                        style={{ fontWeight: 'var(--font-weight-semibold)' }}
                      >
                        Your AI assistant<br />
                        that understands your work and take actions for you
                      </h4>
                    </div>
                  </div>
                  
                  {/* Add Button - Top Right - Show when there are 3 items */}
                  {(sidekickActions.length >= 3 && availableSidekickActions.length > 0) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openModal('sidekick')}
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                      }}
                    >
                      <Plus className="w-4 h-4 text-blue-400" />
                    </motion.button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {sidekickActions.map((action, idx) => (
                    <IsometricCard
                      key={action.name}
                      title={action.name}
                      icon={<img src={sidekickLogo} alt="" className="w-full h-full object-contain" />}
                      color="#a855f7"
                      delay={0.7 + idx * 0.1}
                      size="small"
                      type="sidekick"
                      value={action.value}
                      onClick={() => {
                        setSelectedSidekickAction(action);
                        setIsSidekickModalOpen(true);
                      }}
                    />
                  ))}
                  {sidekickActions.length < 3 && availableSidekickActions.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full h-[140px] rounded-[var(--radius-card)] border border-dashed flex items-center justify-center"
                      style={{
                        borderColor: 'rgba(99, 102, 241, 0.3)',
                        background: 'rgba(255, 255, 255, 0.02)',
                      }}
                      onClick={() => openModal('sidekick')}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(99, 102, 241, 0.15)' }}
                        >
                          <Plus className="w-4 h-4 text-blue-400" />
                        </div>
                        <span 
                          className="text-xs text-white/60"
                          style={{ fontWeight: 'var(--font-weight-medium)' }}
                        >
                          Add more
                        </span>
                      </div>
                    </motion.button>
                  )}
                </div>
                </div>
              
              </div>
              
            </div>
            
            {/* Status bar at bottom */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400/80 animate-pulse" />
                <span className="text-xs text-white/60" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                  Active Solution
                </span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <span className="text-xs text-white/40" style={{ fontWeight: 'var(--font-weight-regular)' }}>
                {products.length + agents.length + sidekickActions.length + vibeApps.length} components configured
              </span>
            </div>
          </div>
          
          {/* Corner accents - subtle */}
          <div className="absolute top-6 left-6 w-12 h-12 border-l border-t border-white/10 rounded-tl-lg" />
          <div className="absolute top-6 right-6 w-12 h-12 border-r border-t border-white/10 rounded-tr-lg" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-l border-b border-white/10 rounded-bl-lg" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-r border-b border-white/10 rounded-br-lg" />
        </div>

        {/* Connection Line to Values Bar - Right side */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }}
          className="hidden xl:block absolute right-0 h-[2px] origin-left pointer-events-none"
          style={{
            top: 'calc(1.5rem + 0.5rem + 1.375rem)',
            width: 'calc(1.5rem)',
            left: '100%',
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.1))',
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
          }}
        >
          {/* Pulsing glow at connection point */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.6)',
            }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Platform Values Bar - Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute right-0 top-0 translate-x-[calc(100%+1.5rem)] hidden xl:block"
        >
          <PlatformValuesBar />
        </motion.div>
      </motion.div>
      
      {/* Add Item Modal */}
      <AddItemModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type || 'product'}
        onAdd={handleAdd}
        onRemove={handleRemove}
        availableItems={getAvailableItems()}
        selectedItems={getSelectedItems()}
        originalItems={getOriginalItems()}
      />
      
      {/* Sidekick Action Modal */}
      <SidekickActionModal
        isOpen={isSidekickModalOpen}
        onClose={() => setIsSidekickModalOpen(false)}
        action={selectedSidekickAction}
      />
      
      {/* Agent Modal */}
      <AgentModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        agent={selectedAgent}
      />
      
      {/* Vibe App Modal */}
      <VibeAppModal
        isOpen={isVibeModalOpen}
        onClose={() => setIsVibeModalOpen(false)}
        app={selectedVibeApp}
      />
    </div>
  );
}