import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

// Import layer-specific architecture diagrams
import architectureData from '@/assets/2f42ade3d00fb32fb4596f447ae17789265e38a4.png';
import architectureContext from '@/assets/4f3f2afcc377b6e5095b5b04bfebefdc14eafc7e.png';
import architectureCapabilities from '@/assets/40a9c0615faa85734a6b2432c855e1432c81f4f0.png';
import architectureProducts from '@/assets/e9c71d2328696a2ce7a39c6cbf9d20191bec4cbb.png';
import architectureFlexible from '@/assets/592875827bad9730c609b031446bf44bc726069a.png';
import architectureEcosystem from '@/assets/dbbab9efa15f5f57e073baadb4e4cd52889a78eb.png';
import architectureSecurity from '@/assets/94412a88e5a7e74db3472ed59ac0406b9379be3b.png';

export interface PlatformValue {
  icon: React.ReactNode;
  title: string;
  mainValue: string;
  description: string;
  examples?: string;
  products?: string;
  layer?: 'data' | 'context' | 'capabilities' | 'products' | 'ecosystem' | 'security' | 'flexible';
  image?: string;
}

interface PlatformValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: PlatformValue | null;
}

export function PlatformValueModal({ isOpen, onClose, value }: PlatformValueModalProps) {
  const [connectionLine, setConnectionLine] = useState<{top: number, left: number, width: number} | null>(null);

  useEffect(() => {
    if (isOpen && value) {
      // Find the first platform button (monday DB)
      const firstButton = document.querySelector('[title="monday DB"]') as HTMLElement;
      if (firstButton) {
        const buttonRect = firstButton.getBoundingClientRect();
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;
        const buttonRight = buttonRect.right;
        
        // Calculate line position (from button to where modal will be)
        const windowWidth = window.innerWidth;
        const modalLeft = windowWidth - 450; // modal width is 450px
        
        setConnectionLine({
          top: buttonCenterY,
          left: buttonRight,
          width: modalLeft - buttonRight,
        });
      }
    }
  }, [isOpen, value]);

  if (!isOpen || !value) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100]"
        style={{ background: 'rgba(0, 0, 0, 0.2)' }}
        onClick={onClose}
      />

      {/* Connection Line */}
      {connectionLine && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
          className="fixed z-[100] origin-left"
          style={{
            top: `${connectionLine.top}px`,
            left: `${connectionLine.left}px`,
            width: `${connectionLine.width}px`,
            height: '2px',
            background: 'linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.1))',
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
          }}
        />
      )}

      {/* Side Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 z-[100] w-[450px] border-l overflow-y-auto"
        style={{
          background: 'rgba(10, 10, 15, 0.98)',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-9 h-9 rounded-lg flex items-center justify-center"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <X className="w-5 h-5 text-white/70" />
        </motion.button>

        {/* Content */}
        <div className="p-8 pt-20">
          {/* Icon and Title */}
          <div className="flex items-start gap-4 mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.1))',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <div className="scale-125">
                {value.icon}
              </div>
            </motion.div>

            <div className="flex-1">
              <motion.h3
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="text-white mb-2"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'rgba(99, 102, 241, 0.9)',
                }}
              >
                {value.title}
              </motion.h3>
            </div>
          </div>

          {/* Main Value */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white mb-6"
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: '1.3',
            }}
          >
            {value.mainValue}
          </motion.h2>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-4"
          >
            <p
              className="text-white/70 leading-relaxed"
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-normal)',
              }}
            >
              {value.description}
            </p>

            {/* Platform Architecture Diagram - skip for ecosystem and capabilities */}
            {value.layer && value.layer !== 'ecosystem' && value.layer !== 'capabilities' && (() => {
              // Map each layer to its corresponding image
              const layerImages: Record<string, string> = {
                'data': architectureData,
                'context': architectureContext,
                'capabilities': architectureCapabilities,
                'products': architectureProducts,
                'ecosystem': architectureEcosystem,
                'security': architectureSecurity,
                'flexible': architectureFlexible,
              };

              const currentImage = layerImages[value.layer];

              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="my-6 rounded-2xl overflow-hidden"
                >
                  <img 
                    src={currentImage} 
                    alt="Platform Architecture"
                    className="w-full h-auto"
                  />
                </motion.div>
              );
            })()}

            {/* Examples */}
            {value.examples && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-lg p-4"
                style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                }}
              >
                <p
                  className="text-white/60"
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  <span 
                    style={{ 
                      color: 'rgba(99, 102, 241, 1)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    Examples:
                  </span> {value.examples}
                </p>
              </motion.div>
            )}

            {/* Products */}
            {value.products && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-lg p-4"
                style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                }}
              >
                <p
                  className="text-white/60"
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  <span 
                    style={{ 
                      color: 'rgba(99, 102, 241, 1)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    Products:
                  </span> {value.products}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );

  // Render to document.body using portal
  return createPortal(modalContent, document.body);
}

PlatformValueModal.displayName = 'PlatformValueModal';