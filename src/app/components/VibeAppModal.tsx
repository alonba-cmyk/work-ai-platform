import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';
import { getToolLogo } from '@/app/utils/toolLogos';

interface VibeAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: {
    name: string;
    value: string;
    image?: string;
    icon?: any;
    replacesTools: string[];
    url?: string;
  } | null;
}

export function VibeAppModal({ isOpen, onClose, app }: VibeAppModalProps) {
  if (!app) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div key="vibe-modal-wrapper">
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
              className="w-full max-w-3xl bg-card rounded-2xl border border-border overflow-hidden pointer-events-auto"
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

              {/* Image Section */}
              {app.image && (
                <div className="relative w-full h-80 bg-gradient-to-br from-amber-500/10 to-amber-500/5">
                  <img 
                    src={app.image} 
                    alt={app.name} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient overlay at bottom */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-32"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    }}
                  />
                </div>
              )}

              {/* Content Section */}
              <div className="p-8">
                {/* App Icon and Name */}
                <div className="flex items-center gap-4 mb-4">
                  {app.icon && (
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.3), rgba(233, 30, 99, 0.2))',
                      }}
                    >
                      <app.icon className="w-10 h-10" style={{ color: '#ff6384' }} />
                    </div>
                  )}
                  
                  <h2 
                    className="text-3xl text-white flex-1"
                    style={{ fontWeight: 'var(--font-weight-bold)' }}
                  >
                    {app.name}
                  </h2>
                </div>

                {/* What it does (Value) */}
                <div className="mb-6">
                  <h3 
                    className="text-sm uppercase tracking-wide mb-2"
                    style={{ 
                      fontWeight: 'var(--font-weight-semibold)',
                      color: '#ff6384',
                    }}
                  >
                    What it does
                  </h3>
                  <p 
                    className="text-lg text-white/80 leading-relaxed"
                    style={{ fontWeight: 'var(--font-weight-medium)' }}
                  >
                    {app.value}
                  </p>
                </div>

                {/* Replaces Tools */}
                {app.replacesTools && app.replacesTools.length > 0 && (
                  <div className="mb-8">
                    <h3 
                      className="text-sm uppercase tracking-wide mb-3"
                      style={{ 
                        fontWeight: 'var(--font-weight-semibold)',
                        color: '#ff6384',
                      }}
                    >
                      Replaces these tools
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {app.replacesTools.map((tool, idx) => {
                        const logoUrl = getToolLogo(tool);
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-full"
                            style={{
                              background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.15), rgba(233, 30, 99, 0.1))',
                              border: '1px solid rgba(255, 99, 132, 0.3)',
                            }}
                          >
                            {logoUrl && (
                              <img 
                                src={logoUrl} 
                                alt={tool}
                                className="w-5 h-5 rounded object-contain bg-white/10 p-0.5"
                                onError={(e) => {
                                  // Hide image if it fails to load
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <span 
                              className="text-sm"
                              style={{
                                color: '#ffb3c6',
                                fontWeight: 'var(--font-weight-medium)',
                              }}
                            >
                              {tool}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* CTA Button - Link to Vibe */}
                <motion.a
                  href={app.url || 'https://monday.com/vibe'}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all no-underline"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.2), rgba(233, 30, 99, 0.15))',
                    border: '1.5px solid rgba(255, 99, 132, 0.5)',
                    boxShadow: '0 4px 12px rgba(233, 30, 99, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 165, 0, 0.35), rgba(233, 30, 99, 0.25))';
                    e.currentTarget.style.borderColor = 'rgba(255, 99, 132, 0.7)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(233, 30, 99, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 165, 0, 0.2), rgba(233, 30, 99, 0.15))';
                    e.currentTarget.style.borderColor = 'rgba(255, 99, 132, 0.5)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(233, 30, 99, 0.2)';
                  }}
                >
                  <span 
                    className="text-base"
                    style={{ 
                      fontWeight: 'var(--font-weight-bold)',
                      color: '#ff6384',
                    }}
                  >
                    Open in Vibe
                  </span>
                  <ExternalLink className="w-4 h-4" style={{ color: '#ff6384' }} />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}