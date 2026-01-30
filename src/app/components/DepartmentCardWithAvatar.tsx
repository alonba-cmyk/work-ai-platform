import { motion } from 'motion/react';

interface DepartmentCardWithAvatarProps {
  id: string;
  title: string;
  desc: string;
  avatarImage: string;
  avatarBgColor: string;
  isSelected?: boolean;
  onClick: () => void;
  delay?: number;
}

export function DepartmentCardWithAvatar({
  id,
  title,
  desc,
  avatarImage,
  avatarBgColor,
  isSelected = false,
  onClick,
  delay = 0
}: DepartmentCardWithAvatarProps) {
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
        relative flex flex-col
        p-6 rounded-[var(--radius-card)] border border-border
        bg-[rgba(255,255,255,0.05)] backdrop-blur-sm
        transition-all text-left
        ${isSelected ? 'ring-2 ring-primary' : 'hover:border-primary/50'}
      `}
    >
      {/* Avatar and Title in same row */}
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="relative rounded-full shrink-0 w-[47px] h-[47px] border border-white/20"
          style={{ backgroundColor: avatarBgColor }}
        >
          <div className="overflow-hidden rounded-full w-full h-full">
            <img 
              src={avatarImage} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h3 className="leading-tight">{title}</h3>
      </div>

      {/* Description below */}
      <p className="text-sm text-muted-foreground">
        {desc}
      </p>

      {/* Glass effect overlay */}
      <div className="absolute inset-0 rounded-[var(--radius-card)] bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    </motion.button>
  );
}
