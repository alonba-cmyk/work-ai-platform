import { motion } from 'motion/react';

interface DepartmentCardProps {
  id: string;
  title: string;
  description: string;
  avatarColor: string;
  isSelected: boolean;
  onClick: () => void;
  delay?: number;
}

export function DepartmentCard({ 
  id, 
  title, 
  description, 
  avatarColor, 
  isSelected, 
  onClick,
  delay = 0 
}: DepartmentCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative p-8 rounded-[var(--radius-card)] border 
        backdrop-blur-sm transition-all text-left w-full
        ${isSelected 
          ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/5' 
          : 'border-border bg-gradient-to-br from-white/5 to-transparent hover:border-primary/50'
        }
      `}
    >
      {/* Avatar */}
      <div className="flex items-start gap-4 mb-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: avatarColor }}
        >
          <span className="text-2xl">
            {id === 'operations' && '⚙️'}
            {id === 'marketing' && '📢'}
            {id === 'sales' && '💰'}
            {id === 'support' && '🎧'}
            {id === 'product' && '🚀'}
            {id === 'finance' && '💵'}
            {id === 'legal' && '⚖️'}
            {id === 'hr' && '👥'}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="mb-2">{title}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}

      {/* Glass effect overlay */}
      <div className="absolute inset-0 rounded-[var(--radius-card)] bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Inner shadow for depth */}
      <div className="absolute inset-0 rounded-[var(--radius-card)] pointer-events-none shadow-[inset_0px_1px_3px_rgba(255,255,255,0.1)]" />
    </motion.button>
  );
}
