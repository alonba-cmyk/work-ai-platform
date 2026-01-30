import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import sidekickLogo from '@/assets/c3e06e6c0d8e1f48d4291d5d6620c109eb135451.png';

interface SidekickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: {
    name: string;
    description: string;
    value: string;
    image?: string;
  } | null;
}

export function SidekickActionModal({ isOpen, onClose, action }: SidekickActionModalProps) {
  if (!action) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div key="sidekick-modal-wrapper">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl rounded-2xl border overflow-hidden relative pointer-events-auto"
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(168, 85, 247, 0.08))',
                borderColor: 'rgba(168, 85, 247, 0.4)',
                boxShadow: '0 20px 60px rgba(168, 85, 247, 0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated background effect */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.2), transparent 50%)',
                    'radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.2), transparent 50%)',
                    'radial-gradient(circle at 50% 80%, rgba(168, 85, 247, 0.2), transparent 50%)',
                    'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.2), transparent 50%)',
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-[20] w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                style={{
                  background: 'rgba(168, 85, 247, 0.2)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                }}
              >
                <X className="w-5 h-5 text-purple-300" />
              </motion.button>

              {/* Content */}
              <div className="relative z-10 p-8">
                {/* Header with logo */}
                <div className="flex items-start gap-4 mb-6">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{
                      background: 'white',
                    }}
                  >
                    <img src={sidekickLogo} alt="Sidekick" className="w-full h-full object-contain" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="text-xs uppercase tracking-wide px-2 py-1 rounded"
                        style={{ 
                          fontWeight: 'var(--font-weight-semibold)',
                          background: 'rgba(168, 85, 247, 0.2)',
                          color: '#c084fc'
                        }}
                      >
                        Sidekick Action
                      </span>
                    </div>
                    <h2 
                      className="text-2xl text-white mb-2"
                      style={{ fontWeight: 'var(--font-weight-bold)' }}
                    >
                      {action.name}
                    </h2>
                  </div>
                </div>

                {/* Capability Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h3 
                      className="text-sm text-white/70 uppercase tracking-wide"
                      style={{ fontWeight: 'var(--font-weight-semibold)' }}
                    >
                      Capability
                    </h3>
                  </div>
                  <p 
                    className="text-base text-white/90 leading-relaxed"
                    style={{ fontWeight: 'var(--font-weight-regular)' }}
                  >
                    {action.description}
                  </p>
                </div>

                {/* Image Preview - if available */}
                {action.image && (
                  <div className="mb-6 flex justify-center">
                    <div className="rounded-xl overflow-hidden border w-full max-w-md" style={{ borderColor: 'rgba(168, 85, 247, 0.3)' }}>
                      <img 
                        src={action.image} 
                        alt={action.name}
                        className="w-full h-auto object-cover"
                        style={{ maxHeight: '320px' }}
                      />
                    </div>
                  </div>
                )}

                {/* Value Section */}
                <div 
                  className="p-5 rounded-xl border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1))',
                    borderColor: 'rgba(168, 85, 247, 0.3)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#a855f7' }}
                    />
                    <h3 
                      className="text-sm uppercase tracking-wide"
                      style={{ 
                        fontWeight: 'var(--font-weight-semibold)',
                        color: '#c084fc'
                      }}
                    >
                      Value
                    </h3>
                  </div>
                  <p 
                    className="text-base text-white leading-relaxed"
                    style={{ fontWeight: 'var(--font-weight-medium)' }}
                  >
                    {action.value}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}