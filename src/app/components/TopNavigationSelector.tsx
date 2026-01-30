import { motion, AnimatePresence } from 'motion/react';
import { Building2, Target, AlertCircle, Sparkles, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { CustomPromptInput } from './CustomPromptInput';

export type SelectionMode = 'department' | 'outcome' | 'pain' | 'transformation' | 'custom';

interface Department {
  id: string;
  title: string;
  desc: string;
  avatarImage: string;
  avatarBgColor: string;
}

interface TopNavigationSelectorProps {
  departments: Department[];
  selectedDepartment: string | null;
  onDepartmentSelect: (id: string) => void;
  selectionMode?: SelectionMode;
  onSelectionModeChange?: (mode: SelectionMode) => void;
}

export function TopNavigationSelector({
  departments,
  selectedDepartment,
  onDepartmentSelect,
  selectionMode = 'department',
  onSelectionModeChange
}: TopNavigationSelectorProps) {
  
  const tabs: Array<{ id: SelectionMode; label: string; icon: any }> = [
    { id: 'department', label: 'Department', icon: Building2 },
    { id: 'outcome', label: 'Outcome', icon: Target },
    { id: 'pain', label: 'Pain Point', icon: AlertCircle },
    { id: 'transformation', label: 'AI Transformation', icon: Sparkles },
    { id: 'custom', label: 'Custom Solution', icon: Wand2 },
  ];

  const getHeaderText = () => {
    switch (selectionMode) {
      case 'outcome':
        return { 
          title: 'What would you like to achieve?', 
          subtitle: 'Select your business objective to see your AI-powered solution' 
        };
      case 'pain':
        return { 
          title: 'What would you like to solve?', 
          subtitle: 'Select your biggest challenge to see how AI can help' 
        };
      case 'transformation':
        return { 
          title: 'Why transform with AI?', 
          subtitle: 'Select your business driver to see your AI transformation path' 
        };
      case 'custom':
        return { 
          title: 'Build your own solution\nby just prompt it', 
          subtitle: 'Tell us what you want to achieve, and we\'ll create a personalized AI-powered workflow just for you' 
        };
      default:
        return { 
          title: 'What would you like to achieve?', 
          subtitle: 'Choose your department to see your tailored AI solution' 
        };
    }
  };

  const headerText = getHeaderText();

  return (
    <div className="w-full">
      <div className="max-w-[1800px] mx-auto px-8 py-12 space-y-10">
        {/* Mode Selection Tabs */}
        {onSelectionModeChange && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div 
              className="inline-flex gap-2 p-1.5 rounded-[var(--radius-card)] border backdrop-blur-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderColor: 'rgba(99, 102, 241, 0.15)',
              }}
            >
              {tabs.map((tab) => {
                const isActive = selectionMode === tab.id;
                const Icon = tab.icon;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectionModeChange(tab.id)}
                    className={`
                      relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg
                      transition-all duration-300
                      ${isActive ? 'text-white' : 'text-white/50 hover:text-white/80'}
                    `}
                    style={{
                      fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeModeBg"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.6), rgba(59, 130, 246, 0.5))',
                          boxShadow: '0 2px 12px rgba(99, 102, 241, 0.3)',
                        }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
        
        {/* Main Question Header */}
        <motion.div
          key={selectionMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 
            className="text-white whitespace-pre-line"
            style={{ 
              fontWeight: 'var(--font-weight-bold)', 
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: '1.1',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.7))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {headerText.title}
          </h1>
          <p 
            className="text-white/60 max-w-2xl mx-auto"
            style={{ 
              fontWeight: 'var(--font-weight-regular)', 
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            }}
          >
            {headerText.subtitle}
          </p>
        </motion.div>
        
        {/* Conditional Content Based on Selection Mode */}
        {selectionMode === 'custom' ? (
          /* Custom Prompt Input */
          <motion.div
            key="custom-input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <CustomPromptInput onSubmit={onDepartmentSelect} />
          </motion.div>
        ) : (
          /* Department Grid */
          <motion.div 
            key={`grid-${selectionMode}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto"
          >
            {departments.map((dept, index) => {
              const isSelected = selectedDepartment === dept.id;
              
              return (
                <motion.button
                  key={dept.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDepartmentSelect(dept.id)}
                  className={`
                    relative flex flex-col items-center gap-4 p-6 rounded-[var(--radius-card)]
                    border transition-all text-center group
                    ${isSelected 
                      ? 'bg-[rgba(97,97,255,0.15)] border-[rgba(97,97,255,0.5)]' 
                      : 'bg-[rgba(255,255,255,0.03)] border-border/40 hover:border-[rgba(97,97,255,0.4)] hover:bg-[rgba(255,255,255,0.06)]'
                    }
                  `}
                  style={{
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  {/* Selection Indicator */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ scaleX: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="absolute top-0 left-4 right-4 h-1 rounded-b-full origin-center"
                        style={{
                          background: 'linear-gradient(90deg, rgba(97, 97, 255, 1), rgba(59, 130, 246, 1))',
                          boxShadow: '0 0 12px rgba(97, 97, 255, 0.7)',
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Avatar */}
                  <div 
                    className={`relative rounded-full shrink-0 border-2 border-white/20 transition-all
                      ${isSelected ? 'w-20 h-20' : 'w-16 h-16 group-hover:w-18 group-hover:h-18'}
                    `}
                    style={{ backgroundColor: dept.avatarBgColor }}
                  >
                    <div className="overflow-hidden rounded-full w-full h-full">
                      <img 
                        src={dept.avatarImage} 
                        alt={dept.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Glow effect on selection */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: [0.5, 1, 0.5],
                          scale: [1, 1.15, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                        className="absolute inset-0 rounded-full"
                        style={{
                          boxShadow: `0 0 30px ${dept.avatarBgColor}`,
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <h4 
                      className={`leading-tight transition-colors ${ 
                        isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'
                      }`}
                      style={{ 
                        fontWeight: isSelected ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                        fontSize: '1rem'
                      }}
                    >
                      {dept.title}
                    </h4>
                    
                    <p
                      className="text-white/60 leading-relaxed"
                      style={{ 
                        fontWeight: 'var(--font-weight-regular)',
                        fontSize: '0.875rem'
                      }}
                    >
                      {dept.desc}
                    </p>
                  </div>

                  {/* Glass overlay */}
                  <div className="absolute inset-0 rounded-[var(--radius-card)] bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}