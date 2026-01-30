import { motion, AnimatePresence } from 'motion/react';
import { Database, Brain, Shield, Maximize2, Share2, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { PlatformValueModal, PlatformValue } from './PlatformValueModal';

// Import architecture diagrams
import architectureData from '@/assets/2f42ade3d00fb32fb4596f447ae17789265e38a4.png';
import architectureContext from '@/assets/4f3f2afcc377b6e5095b5b04bfebefdc14eafc7e.png';
import architectureCapabilities from '@/assets/40a9c0615faa85734a6b2432c855e1432c81f4f0.png';
import architectureProducts from '@/assets/e9c71d2328696a2ce7a39c6cbf9d20191bec4cbb.png';
import architectureFlexible from '@/assets/592875827bad9730c609b031446bf44bc726069a.png';
import architectureEcosystem from '@/assets/dbbab9efa15f5f57e073baadb4e4cd52889a78eb.png';
import architectureSecurity from '@/assets/94412a88e5a7e74db3472ed59ac0406b9379be3b.png';

const platformValues: PlatformValue[] = [
  {
    icon: <Database className="w-5 h-5 text-white/30" />,
    title: 'monday DB',
    mainValue: 'Your secured system of records for scale',
    description: 'A unified, governed data layer where your work data lives — structured, connected, and permissioned for AI.',
    layer: 'data',
    image: architectureData,
  },
  {
    icon: <Brain className="w-5 h-5 text-white/30" />,
    title: 'Context-aware AI',
    mainValue: 'AI that understands your business context',
    description: 'A shared data layer gives AI full context across people, data, and workflows. Enabling smarter decisions and effective execution.',
    examples: 'boards, items, updates, automations, users & roles',
    layer: 'context',
    image: architectureContext,
  },
  {
    icon: <Shield className="w-5 h-5 text-white/30" />,
    title: 'Enterprise-grade secure',
    mainValue: 'Enterprise Grade security you can trust',
    description: 'Enterprise-grade AI infrastructure with built-in security, governance, permissions, and compliance.',
    layer: 'security',
    image: architectureSecurity,
  },
  {
    icon: <Maximize2 className="w-5 h-5 text-white/30" />,
    title: 'Flexible to extreme',
    mainValue: 'Infinitely adaptable for any goal & team',
    description: 'Modular building blocks let you tailor AI to any workflow, team, and use case, right in the flow of work.',
    layer: 'flexible',
    image: architectureFlexible,
  },
  {
    icon: <Share2 className="w-5 h-5 text-white/30" />,
    title: 'Open ecosystem',
    mainValue: 'An open ecosystem to extend what\'s possible',
    description: 'Connect, extend, and adapt through powerful APIs, integrations, and the monday Apps Framework (MCP).',
    layer: 'ecosystem',
    image: architectureEcosystem,
  },
  {
    icon: <Sparkles className="w-5 h-5 text-white/30" />,
    title: 'AI-powered products',
    mainValue: 'AI built into the products teams run every day — to accelerate business outcomes',
    description: 'AI is infused across our core product suite, so every workflow is smarter, faster, and more automated — without adding new tools or complexity.',
    products: 'Work Management, CRM, Service, Dev',
    layer: 'products',
    image: architectureProducts,
  },
  {
    icon: <Zap className="w-5 h-5 text-white/30" />,
    title: 'AI Work capabilities',
    mainValue: 'Dedicated AI capabilities that do the work for you — in the context of your work',
    description: 'Dedicated AI capabilities that do the work for you — in the context of your work.',
    products: 'Sidekick, Agents, Vibe, Workflows',
    layer: 'capabilities',
    image: architectureCapabilities,
  },
];

export function PlatformValuesBar() {
  const [selectedValue, setSelectedValue] = useState<PlatformValue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleValueClick = (value: PlatformValue) => {
    // If modal is already open with different content, close it first
    if (isModalOpen && selectedValue?.title !== value.title) {
      setIsModalOpen(false);
      setTimeout(() => {
        setSelectedValue(value);
        setIsModalOpen(true);
      }, 400); // Wait for exit animation to complete
    } else {
      setSelectedValue(value);
      setIsModalOpen(true);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedValue(null), 300);
  };

  return (
    <>
      <div className="flex flex-col gap-2 items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-2 w-11"
        >
          <p
            className="text-white/40 text-xs text-center"
            style={{ fontWeight: 'var(--font-weight-medium)' }}
          >
            Platform
          </p>
        </motion.div>

        {/* Icons */}
        <div className="flex flex-col gap-2.5">
        {platformValues.map((value, index) => (
          <motion.button
            key={value.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.08 }}
            whileHover={{ scale: 1.08, x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleValueClick(value)}
            className="relative w-11 h-11 rounded-lg flex items-center justify-center group"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
            title={value.title}
          >
            {/* Glow effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
              style={{
                background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.08), transparent)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Icon */}
            <div className="relative z-10">
              {value.icon}
            </div>

            {/* Tooltip on hover - left side */}
            <div
              className="absolute right-full mr-3 px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                background: 'rgba(10, 10, 15, 0.95)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              }}
            >
              <span
                className="text-white text-xs"
                style={{ fontWeight: 'var(--font-weight-medium)' }}
              >
                {value.title}
              </span>
              
              {/* Arrow pointing right */}
              <div
                className="absolute -right-[7px] top-1/2 -translate-y-1/2 w-0 h-0"
                style={{
                  borderLeft: '7px solid rgba(10, 10, 15, 0.95)',
                  borderTop: '5px solid transparent',
                  borderBottom: '5px solid transparent',
                }}
              />
            </div>
          </motion.button>
        ))}
        </div>
      </div>

      {/* Modal */}
      <PlatformValueModal
        isOpen={isModalOpen}
        onClose={handleClose}
        value={selectedValue}
      />
    </>
  );
}