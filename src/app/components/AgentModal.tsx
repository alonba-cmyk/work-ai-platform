import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: {
    name: string;
    description: string;
    value: string;
    image?: string;
  } | null;
}

export function AgentModal({ isOpen, onClose, agent }: AgentModalProps) {
  if (!agent) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div key="agent-modal-wrapper">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl bg-card rounded-2xl border border-border overflow-hidden pointer-events-auto"
              style={{
                boxShadow: '0 24px 48px rgba(0, 0, 0, 0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Flex container for side-by-side layout */}
              <div className="flex">
                {/* Image Section */}
                {agent.image && (
                  <div className="relative w-1/2 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 flex items-center justify-center p-8">
                    <img 
                      src={agent.image} 
                      alt={agent.name} 
                      className="max-w-full h-auto object-contain"
                    />
                  </div>
                )}

                {/* Content Section */}
                <div className={`${agent.image ? 'w-1/2' : 'w-full'} p-8 flex flex-col justify-center`}>
                  {/* Agent Name */}
                  <h2 
                    className="text-3xl mb-4 text-white"
                    style={{ fontWeight: 'var(--font-weight-bold)' }}
                  >
                    {agent.name}
                  </h2>

                  {/* What it does */}
                  <div className="mb-6">
                    <h3 
                      className="text-sm uppercase tracking-wide text-cyan-400 mb-2"
                      style={{ fontWeight: 'var(--font-weight-semibold)' }}
                    >
                      What it does
                    </h3>
                    <p 
                      className="text-lg text-white/80 leading-relaxed"
                      style={{ fontWeight: 'var(--font-weight-medium)' }}
                    >
                      {agent.description}
                    </p>
                  </div>

                  {/* Value Proposition */}
                  <div className="mb-8">
                    <h3 
                      className="text-sm uppercase tracking-wide text-cyan-400 mb-2"
                      style={{ fontWeight: 'var(--font-weight-semibold)' }}
                    >
                      The value
                    </h3>
                    <p 
                      className="text-lg text-white/80 leading-relaxed"
                      style={{ fontWeight: 'var(--font-weight-medium)' }}
                    >
                      {agent.value}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: 'rgba(6, 182, 212, 0.1)',
                      border: '1.5px solid rgba(6, 182, 212, 0.4)',
                      boxShadow: '0 2px 8px rgba(6, 182, 212, 0.15)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(6, 182, 212, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.6)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(6, 182, 212, 0.15)';
                    }}
                    onClick={() => {
                      // Add your CTA action here
                      console.log('Try agent clicked:', agent.name);
                    }}
                  >
                    <span 
                      className="text-base text-cyan-400"
                      style={{ fontWeight: 'var(--font-weight-semibold)' }}
                    >
                      Try this agent
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}