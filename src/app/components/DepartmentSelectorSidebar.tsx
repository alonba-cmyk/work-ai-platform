import { motion, AnimatePresence } from 'motion/react';
import { Building2, Target, AlertCircle, ChevronRight, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';

export type SelectionMode = 'department' | 'outcome' | 'pain';

interface Department {
  id: string;
  title: string;
  desc: string;
  avatarImage: string;
  avatarBgColor: string;
}

interface DepartmentSelectorSidebarProps {
  departments: Department[];
  selectedDepartment: string | null;
  onDepartmentSelect: (id: string) => void;
  selectionMode?: SelectionMode;
  onSelectionModeChange?: (mode: SelectionMode) => void;
}

export function DepartmentSelectorSidebar({
  departments,
  selectedDepartment,
  onDepartmentSelect,
  selectionMode = 'department',
  onSelectionModeChange
}: DepartmentSelectorSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const tabs: Array<{ id: SelectionMode; label: string; icon: any }> = [
    { id: 'department', label: 'Department', icon: Building2 },
    { id: 'outcome', label: 'Outcome', icon: Target },
    { id: 'pain', label: 'Pain Point', icon: AlertCircle },
  ];

  const getHeaderText = () => {
    switch (selectionMode) {
      case 'outcome':
        return { title: 'Choose Your Goal', subtitle: 'Select your business objective' };
      case 'pain':
        return { title: 'Choose Your Challenge', subtitle: 'Select what you want to solve' };
      default:
        return { title: 'Choose Your Department', subtitle: 'See your tailored solution' };
    }
  };

  const headerText = getHeaderText();
  
  const handleDepartmentSelect = (id: string) => {
    onDepartmentSelect(id);
    // Auto-collapse after selection
    setTimeout(() => setIsCollapsed(true), 600);
  };
  
  // Auto-collapse when department is selected
  useEffect(() => {
    if (selectedDepartment) {
      setTimeout(() => setIsCollapsed(true), 600);
    }
  }, [selectedDepartment]);
  
  const selectedDept = departments.find(d => d.id === selectedDepartment);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ 
        opacity: 1, 
        x: 0,
      }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex-shrink-0 pt-8 relative"
    >
      <AnimatePresence mode="wait">
        {isCollapsed && selectedDept ? (
          // Collapsed View - Show only selected department
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
            style={{ width: '240px' }}
          >
            {/* Expand Button */}
            <motion.button
              onClick={() => setIsCollapsed(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-[var(--radius-card)] border backdrop-blur-xl flex items-center justify-center"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(99, 102, 241, 0.3)',
              }}
            >
              <Menu className="w-4 h-4 text-white/70" />
            </motion.button>
            
            {/* Selected Department Card - Ultra Compact */}
            <motion.button
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCollapsed(false)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[var(--radius-card)] border backdrop-blur-xl text-left"
              style={{
                background: 'rgba(97, 97, 255, 0.12)',
                borderColor: 'rgba(97, 97, 255, 0.4)',
              }}
            >
              {/* Avatar */}
              <div 
                className="relative w-9 h-9 rounded-full shrink-0 border-2"
                style={{ 
                  backgroundColor: selectedDept.avatarBgColor,
                  borderColor: 'rgba(97, 97, 255, 0.6)'
                }}
              >
                <div className="overflow-hidden rounded-full w-full h-full">
                  <img 
                    src={selectedDept.avatarImage} 
                    alt={selectedDept.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Glow effect */}
                <motion.div
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    boxShadow: `0 0 20px ${selectedDept.avatarBgColor}`,
                  }}
                />
              </div>
              
              {/* Department Name Only */}
              <div className="flex-1 min-w-0">
                <h4 
                  className="text-white leading-tight truncate"
                  style={{ 
                    fontWeight: 'var(--font-weight-semibold)',
                    fontSize: '0.8125rem'
                  }}
                >
                  {selectedDept.title}
                </h4>
                <p 
                  className="text-white/50 leading-tight truncate"
                  style={{ 
                    fontWeight: 'var(--font-weight-regular)',
                    fontSize: '0.625rem',
                    marginTop: '1px'
                  }}
                >
                  {selectedDept.desc}
                </p>
              </div>
              
              {/* Expand Indicator */}
              <ChevronRight className="w-3.5 h-3.5 text-white/40 shrink-0" />
            </motion.button>
          </motion.div>
        ) : (
          // Expanded View - Show all departments
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full lg:w-72 xl:w-80"
          >
            <div className="space-y-4">
              {/* Mode Selection Tabs */}
              {onSelectionModeChange && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="flex gap-1.5 p-1.5 rounded-[var(--radius-card)] border backdrop-blur-xl"
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
                          relative flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg
                          transition-all duration-300
                          ${isActive ? 'text-white' : 'text-white/50 hover:text-white/80'}
                        `}
                        style={{
                          fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                          fontSize: '0.6875rem',
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
                        <Icon className="w-3.5 h-3.5 relative z-10" />
                        <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
              
              {/* Header */}
              <motion.div
                key={selectionMode}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-3 mb-4"
              >
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-1 h-8 rounded-full"
                    style={{
                      background: 'linear-gradient(180deg, rgba(97, 97, 255, 1), rgba(97, 97, 255, 0.3))',
                      boxShadow: '0 0 12px rgba(97, 97, 255, 0.5)',
                    }}
                  />
                  <div>
                    <h3 
                      className="text-white uppercase tracking-wider"
                      style={{ 
                        fontWeight: 'var(--font-weight-semibold)', 
                        fontSize: '0.75rem',
                        letterSpacing: '0.1em'
                      }}
                    >
                      {headerText.title}
                    </h3>
                    <p 
                      className="text-xs text-white/40 mt-0.5"
                      style={{ fontWeight: 'var(--font-weight-regular)', fontSize: '0.6875rem' }}
                    >
                      {headerText.subtitle}
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Department List */}
              <motion.div 
                className="space-y-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {departments.map((dept, index) => {
                  const isSelected = selectedDepartment === dept.id;
                  
                  return (
                    <motion.button
                      key={dept.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.4 }}
                      whileHover={{ x: 4, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDepartmentSelect(dept.id)}
                      className={`
                        relative w-full flex items-center gap-2.5 p-2.5 rounded-[var(--radius-card)]
                        border transition-all text-left group
                        ${isSelected 
                          ? 'bg-[rgba(97,97,255,0.12)] border-[rgba(97,97,255,0.4)]' 
                          : 'bg-[rgba(255,255,255,0.02)] border-border/50 hover:border-[rgba(97,97,255,0.3)] hover:bg-[rgba(255,255,255,0.04)]'
                        }
                      `}
                      style={{
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {/* Selection Indicator */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scaleY: 0, opacity: 0 }}
                            animate={{ scaleY: 1, opacity: 1 }}
                            exit={{ scaleY: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="absolute left-0 top-1 bottom-1 w-1 rounded-r-full origin-top"
                            style={{
                              background: 'linear-gradient(180deg, rgba(97, 97, 255, 1), rgba(97, 97, 255, 0.6))',
                              boxShadow: '0 0 12px rgba(97, 97, 255, 0.7)',
                            }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Avatar */}
                      <div 
                        className={`relative rounded-full shrink-0 border border-white/20 transition-transform
                          ${isSelected ? 'w-11 h-11' : 'w-9 h-9'}
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
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 rounded-full"
                            style={{
                              boxShadow: `0 0 20px ${dept.avatarBgColor}80`,
                            }}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 
                          className={`leading-tight transition-colors ${
                            isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'
                          }`}
                          style={{ 
                            fontWeight: isSelected ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                            fontSize: '0.8125rem'
                          }}
                        >
                          {dept.title}
                        </h4>
                        
                        {/* Show description on selection or hover */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-xs text-white/60 mt-1 leading-relaxed"
                              style={{ fontWeight: 'var(--font-weight-regular)' }}
                            >
                              {dept.desc}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Connection Line to Platform */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            exit={{ scaleX: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="hidden xl:block absolute left-full top-1/2 -translate-y-1/2 h-[2px] origin-left pointer-events-none"
                            style={{
                              width: 'calc(1.5rem + 4px)',
                              background: 'linear-gradient(90deg, rgba(97, 97, 255, 0.8), rgba(97, 97, 255, 0.3))',
                              boxShadow: '0 0 8px rgba(97, 97, 255, 0.4)',
                            }}
                          >
                            {/* Flowing particle */}
                            <motion.div
                              animate={{
                                x: ['0%', '100%'],
                                opacity: [0, 1, 0],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
                              style={{
                                background: 'rgba(97, 97, 255, 1)',
                                boxShadow: '0 0 6px rgba(97, 97, 255, 0.8)',
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Glass overlay */}
                      <div className="absolute inset-0 rounded-[var(--radius-card)] bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}