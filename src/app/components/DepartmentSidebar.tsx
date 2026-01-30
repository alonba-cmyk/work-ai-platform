import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

type SelectionMode = 'department' | 'outcome' | 'pain';

interface DepartmentInfo {
  id: string;
  title: string;
  desc: string;
  avatarImage: string;
  avatarBgColor: string;
}

interface DepartmentSidebarProps {
  departments: DepartmentInfo[];
  selectedDepartment?: string;
  onSelectDepartment: (departmentId: string) => void;
  selectionMode?: SelectionMode;
}

export function DepartmentSidebar({ 
  departments, 
  selectedDepartment,
  onSelectDepartment,
  selectionMode = 'department'
}: DepartmentSidebarProps) {
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);

  // Get the title based on selection mode
  const getSidebarTitle = () => {
    switch (selectionMode) {
      case 'outcome':
        return 'Outcomes';
      case 'pain':
        return 'Pains';
      default:
        return 'Departments';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="absolute left-32 top-8 z-50 hidden xl:block"
    >
      <div 
        className="rounded-xl border backdrop-blur-xl p-2"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderColor: 'rgba(99, 102, 241, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Title */}
        <p 
          className="text-white/40 mb-3 px-1 text-center"
          style={{
            fontWeight: 'var(--font-weight-medium)',
            fontSize: '0.6875rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}
        >
          {getSidebarTitle()}
        </p>
        
        {/* Department Avatars */}
        <div className="flex flex-col gap-2 items-center">
          {departments.map((dept, index) => {
            const isSelected = selectedDepartment === dept.id;
            
            return (
              <motion.button
                key={dept.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (index * 0.05), duration: 0.3 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectDepartment(dept.id)}
                onMouseEnter={() => setHoveredDept(dept.id)}
                onMouseLeave={() => setHoveredDept(null)}
                className="group relative w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center"
                style={{ 
                  backgroundColor: dept.avatarBgColor,
                  border: isSelected 
                    ? '3px solid rgba(97, 97, 255, 0.8)' 
                    : '2px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isSelected 
                    ? `0 0 20px ${dept.avatarBgColor}, 0 0 40px rgba(97, 97, 255, 0.5)` 
                    : 'none',
                  overflow: 'visible',
                }}
              >
                <img 
                  src={dept.avatarImage} 
                  alt={dept.title}
                  className="w-full h-full rounded-full"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />
                
                {/* Tooltip on hover */}
                <AnimatePresence>
                  {hoveredDept === dept.id && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-16 px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none"
                      style={{
                        background: 'rgba(17, 24, 39, 0.95)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                        fontFamily: 'var(--font-family-primary)',
                        fontWeight: 'var(--font-weight-semibold)',
                        fontSize: '0.875rem',
                        color: 'rgba(255, 255, 255, 0.95)',
                        zIndex: 1000,
                      }}
                    >
                      {dept.title}
                      {/* Tooltip arrow */}
                      <div
                        className="absolute right-full top-1/2 -translate-y-1/2"
                        style={{
                          width: 0,
                          height: 0,
                          borderTop: '6px solid transparent',
                          borderBottom: '6px solid transparent',
                          borderRight: '6px solid rgba(17, 24, 39, 0.95)',
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Click ripple effect */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      key={`ripple-${dept.id}-${isSelected}`}
                      initial={{ scale: 0.8, opacity: 0.6 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, ${dept.avatarBgColor} 0%, transparent 70%)`,
                      }}
                    />
                  )}
                </AnimatePresence>
                
                {/* Glow effect on selected */}
                {isSelected && (
                  <motion.div
                    animate={{ 
                      opacity: [0.4, 0.8, 0.4],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      boxShadow: `0 0 30px ${dept.avatarBgColor}`,
                    }}
                  />
                )}
                
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="selectedDepartment"
                    className="absolute -right-1 -top-1 w-3 h-3 rounded-full"
                    style={{
                      background: 'rgba(97, 97, 255, 1)',
                      boxShadow: '0 0 10px rgba(97, 97, 255, 0.8)',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}