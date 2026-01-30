import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Play, Sparkles, Zap, Users, X, ChevronRight } from 'lucide-react';

// Demo data structure
interface DemoItem {
  id: string;
  type: 'product' | 'agent' | 'vibe' | 'sidekick';
  name: string;
  description: string;
  demoDescription: string;
  image?: string;
  demoGif?: string;
  position: { x: string; y: string };
}

interface InActionViewProps {
  department: string;
  products: Array<{ name: string; value?: string; image?: string }>;
  agents: Array<{ name: string; value?: string; image?: string }>;
  vibeApps: Array<{ name: string; value?: string; image?: string }>;
  sidekickActions: Array<{ name: string; value?: string; image?: string }>;
}

// Department-specific narratives
const departmentNarratives: Record<string, { title: string; subtitle: string }> = {
  marketing: {
    title: "See your marketing team in action",
    subtitle: "Watch how AI agents, apps, and assistants work together on your campaigns"
  },
  sales: {
    title: "See your sales team in action", 
    subtitle: "Watch how AI accelerates deals from lead to close"
  },
  operations: {
    title: "See your operations team in action",
    subtitle: "Watch how AI streamlines processes and boosts efficiency"
  },
  support: {
    title: "See your support team in action",
    subtitle: "Watch how AI resolves issues faster and delights customers"
  },
  product: {
    title: "See your product team in action",
    subtitle: "Watch how AI accelerates development and innovation"
  },
  default: {
    title: "See your team in action",
    subtitle: "Watch how AI transforms the way you work"
  }
};

export function InActionView({ 
  department, 
  products, 
  agents, 
  vibeApps, 
  sidekickActions 
}: InActionViewProps) {
  const [selectedDemo, setSelectedDemo] = useState<DemoItem | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const narrative = departmentNarratives[department] || departmentNarratives.default;
  
  // Get first items from each category for the demo scene
  const featuredProduct = products[0];
  const featuredAgents = agents.slice(0, 2);
  const featuredVibeApp = vibeApps[0];
  
  return (
    <div className="w-full">
      {/* Narrative Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h3 
          className="text-2xl md:text-3xl text-white mb-2"
          style={{ fontWeight: 'var(--font-weight-bold)' }}
        >
          {narrative.title}
        </h3>
        <p className="text-white/60 text-lg">
          {narrative.subtitle}
        </p>
      </motion.div>
      
      {/* Interactive Workspace Scene */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.9), rgba(20, 20, 30, 0.95))',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          minHeight: '500px'
        }}
      >
        {/* Board Background - Simulated monday board */}
        <div className="absolute inset-0 p-6">
          {/* Board Header */}
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ background: '#00CA72' }}
            />
            <span className="text-white/80 text-lg" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
              {featuredProduct?.name || 'Campaigns'} Board
            </span>
          </div>
          
          {/* Simulated Board Rows */}
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((row) => (
              <div 
                key={row}
                className="h-12 rounded-lg flex items-center px-4 gap-4"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <div className="w-4 h-4 rounded border border-white/20" />
                <div 
                  className="h-2 rounded-full bg-white/10"
                  style={{ width: `${100 + row * 30}px` }}
                />
                <div className="flex-1" />
                <div 
                  className="h-6 w-20 rounded-full"
                  style={{ 
                    background: row % 2 === 0 ? 'rgba(0, 202, 114, 0.3)' : 'rgba(253, 171, 61, 0.3)'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Interactive Elements Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          
          {/* Featured Agents - Working on the board */}
          {featuredAgents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.2 }}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                top: index === 0 ? '25%' : '45%',
                left: index === 0 ? '15%' : '35%',
              }}
              onMouseEnter={() => setHoveredItem(agent.name)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => setSelectedDemo({
                id: agent.name,
                type: 'agent',
                name: agent.name,
                description: agent.value || '',
                demoDescription: `See how ${agent.name} automates tasks on your board`,
                image: agent.image,
              } as DemoItem)}
            >
              <div 
                className={`relative p-1 rounded-full transition-all duration-300 ${
                  hoveredItem === agent.name ? 'scale-110' : ''
                }`}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: hoveredItem === agent.name 
                    ? '0 0 30px rgba(99, 102, 241, 0.6)' 
                    : '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}
              >
                {agent.image ? (
                  <img 
                    src={agent.image} 
                    alt={agent.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                )}
                
                {/* Working indicator */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-gray-900 flex items-center justify-center"
                >
                  <Play className="w-2.5 h-2.5 text-white" />
                </motion.div>
              </div>
              
              {/* Agent name tooltip */}
              <AnimatePresence>
                {hoveredItem === agent.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg whitespace-nowrap"
                    style={{
                      background: 'rgba(0, 0, 0, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <span className="text-white text-sm font-medium">{agent.name}</span>
                    <div className="text-white/60 text-xs flex items-center gap-1 mt-0.5">
                      <Play className="w-3 h-3" /> Click to see in action
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          
          {/* Vibe App Panel */}
          {featuredVibeApp && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute top-6 right-6 pointer-events-auto cursor-pointer"
              onMouseEnter={() => setHoveredItem('vibe')}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => setSelectedDemo({
                id: 'vibe',
                type: 'vibe',
                name: featuredVibeApp.name,
                description: featuredVibeApp.value || '',
                demoDescription: `Custom app built with Vibe: ${featuredVibeApp.name}`,
                image: featuredVibeApp.image,
              } as DemoItem)}
            >
              <div 
                className={`w-64 rounded-xl p-4 transition-all duration-300 ${
                  hoveredItem === 'vibe' ? 'scale-105' : ''
                }`}
                style={{
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2))',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  boxShadow: hoveredItem === 'vibe' 
                    ? '0 0 30px rgba(236, 72, 153, 0.4)' 
                    : '0 4px 20px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  <span className="text-pink-300 text-sm" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                    Vibe App
                  </span>
                </div>
                <h4 className="text-white font-medium mb-1">{featuredVibeApp.name}</h4>
                <p className="text-white/60 text-sm">{featuredVibeApp.value}</p>
                
                {/* Click hint */}
                <div className="mt-3 flex items-center gap-1 text-pink-400 text-xs">
                  <Play className="w-3 h-3" /> Click to see demo
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Sidekick Chat Bubble */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-6 right-6 pointer-events-auto cursor-pointer"
            onMouseEnter={() => setHoveredItem('sidekick')}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => setSelectedDemo({
              id: 'sidekick',
              type: 'sidekick',
              name: 'Sidekick',
              description: 'Your AI assistant',
              demoDescription: 'See how Sidekick helps you work smarter',
            } as DemoItem)}
          >
            <div 
              className={`rounded-2xl p-4 transition-all duration-300 ${
                hoveredItem === 'sidekick' ? 'scale-105' : ''
              }`}
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(249, 115, 22, 0.2))',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                boxShadow: hoveredItem === 'sidekick' 
                  ? '0 0 30px rgba(245, 158, 11, 0.4)' 
                  : '0 4px 20px rgba(0, 0, 0, 0.2)',
                maxWidth: '280px'
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-amber-300 text-sm" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                  Sidekick
                </span>
              </div>
              <p className="text-white/80 text-sm">
                "I can help you analyze this campaign data. Want me to create a summary?"
              </p>
              
              {/* Click hint */}
              <div className="mt-3 flex items-center gap-1 text-amber-400 text-xs">
                <Play className="w-3 h-3" /> Click to see demo
              </div>
            </div>
          </motion.div>
          
          {/* Product indicator */}
          {featuredProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-6 left-6 pointer-events-auto cursor-pointer"
              onMouseEnter={() => setHoveredItem('product')}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => setSelectedDemo({
                id: 'product',
                type: 'product',
                name: featuredProduct.name,
                description: featuredProduct.value || '',
                demoDescription: `${featuredProduct.name} - Your AI-powered workspace`,
                image: featuredProduct.image,
              } as DemoItem)}
            >
              <div 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  hoveredItem === 'product' ? 'scale-105' : ''
                }`}
                style={{
                  background: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  boxShadow: hoveredItem === 'product' 
                    ? '0 0 30px rgba(99, 102, 241, 0.4)' 
                    : 'none'
                }}
              >
                {featuredProduct.image ? (
                  <img src={featuredProduct.image} alt="" className="w-8 h-8 object-contain" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-indigo-300" />
                  </div>
                )}
                <div>
                  <div className="text-white text-sm font-medium">{featuredProduct.name}</div>
                  <div className="text-white/60 text-xs">Click to explore</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Animated connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.5)" />
              <stop offset="100%" stopColor="rgba(236, 72, 153, 0.5)" />
            </linearGradient>
          </defs>
          {/* Animated dashed lines connecting elements */}
          <motion.path
            d="M 120 150 Q 200 200 280 180"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeDasharray="8 4"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ delay: 1.2, duration: 1 }}
          />
        </svg>
      </motion.div>
      
      {/* Demo Modal */}
      <AnimatePresence>
        {selectedDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setSelectedDemo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1a1a2e, #16161d)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedDemo(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              {/* Demo content */}
              <div className="p-8">
                {/* Type badge */}
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                  style={{
                    background: selectedDemo.type === 'agent' ? 'rgba(99, 102, 241, 0.2)' :
                               selectedDemo.type === 'vibe' ? 'rgba(236, 72, 153, 0.2)' :
                               selectedDemo.type === 'sidekick' ? 'rgba(245, 158, 11, 0.2)' :
                               'rgba(99, 102, 241, 0.2)',
                    border: `1px solid ${
                      selectedDemo.type === 'agent' ? 'rgba(99, 102, 241, 0.3)' :
                      selectedDemo.type === 'vibe' ? 'rgba(236, 72, 153, 0.3)' :
                      selectedDemo.type === 'sidekick' ? 'rgba(245, 158, 11, 0.3)' :
                      'rgba(99, 102, 241, 0.3)'
                    }`
                  }}
                >
                  {selectedDemo.type === 'agent' && <Users className="w-4 h-4 text-indigo-400" />}
                  {selectedDemo.type === 'vibe' && <Sparkles className="w-4 h-4 text-pink-400" />}
                  {selectedDemo.type === 'sidekick' && <Zap className="w-4 h-4 text-amber-400" />}
                  {selectedDemo.type === 'product' && <ChevronRight className="w-4 h-4 text-indigo-400" />}
                  <span className="text-white/80 text-sm capitalize">{selectedDemo.type}</span>
                </div>
                
                <h3 className="text-2xl text-white mb-2" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                  {selectedDemo.name}
                </h3>
                <p className="text-white/60 mb-6">{selectedDemo.demoDescription}</p>
                
                {/* Demo area - placeholder for GIF/animation */}
                <div 
                  className="aspect-video rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {selectedDemo.image ? (
                    <img 
                      src={selectedDemo.image} 
                      alt={selectedDemo.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <Play className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <p className="text-white/40">Demo animation coming soon</p>
                    </div>
                  )}
                </div>
                
                {/* Description */}
                <div 
                  className="p-4 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <p className="text-white/70">
                    {selectedDemo.type === 'agent' && 
                      `${selectedDemo.name} works autonomously on your boards, handling tasks like data entry, notifications, and analysis - so you can focus on what matters.`
                    }
                    {selectedDemo.type === 'vibe' && 
                      `Built with Vibe AI app builder, ${selectedDemo.name} is a custom solution tailored to your specific workflow needs.`
                    }
                    {selectedDemo.type === 'sidekick' && 
                      `Sidekick is your AI assistant that understands your work context and helps you think, write, and execute faster.`
                    }
                    {selectedDemo.type === 'product' && 
                      `${selectedDemo.name} is your AI-powered workspace where all the magic happens - agents work, apps run, and Sidekick assists.`
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
