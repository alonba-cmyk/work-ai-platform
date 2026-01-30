import { motion, AnimatePresence } from 'motion/react';
import { Info } from 'lucide-react';
import { useState } from 'react';

interface InfoTooltipProps {
  title: string;
  description: string;
  value: string;
  accentColor?: string;
}

export function InfoTooltip({ title, description, value, accentColor = '#6161FF' }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center group"
        aria-label={`More info about ${title}`}
      >
        <Info className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80 transition-colors" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-2 w-64 z-50 pointer-events-none"
          >
            <div className="relative bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-2xl">
              {/* Accent bar */}
              <div 
                className="absolute top-0 left-0 w-full h-1 rounded-t-xl"
                style={{ backgroundColor: accentColor, opacity: 0.6 }}
              />
              
              {/* Content */}
              <div className="mt-1 space-y-2">
                <div>
                  <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1">
                    What it does
                  </p>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {description}
                  </p>
                </div>
                <div>
                  <p 
                    className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                    style={{ color: accentColor }}
                  >
                    Value for you
                  </p>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {value}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div 
                className="absolute bottom-0 right-4 translate-y-1/2 w-2 h-2 rotate-45 bg-black/95 border-r border-b border-white/20"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
