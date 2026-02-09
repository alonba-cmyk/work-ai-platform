import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Search, HeadphonesIcon, MoreHorizontal } from 'lucide-react';
import agentPink from '@/assets/agent-pink.png';
import agentCyan from '@/assets/agent-cyan.png';
import agentOrange from '@/assets/agent-orange.png';
import crmLogo from '@/assets/monday-crm-logo-new.png';
import campaignsLogo from '@/assets/monday-campaigns-logo-new.png';

interface OutcomeCard {
  title: string;
  description: string;
  stat: string;
  statLabel: string;
}

const outcomeCards: OutcomeCard[] = [
  { title: '24/7 resolution', description: 'AI agents handle support around the clock', stat: '0', statLabel: 'missed tickets' },
  { title: 'Ship ahead of market', description: 'Launch faster with AI-powered development', stat: '3x', statLabel: 'faster delivery' },
  { title: 'Growth without headcount', description: 'Scale your team with unlimited AI agents', stat: '∞', statLabel: 'capacity' },
  { title: 'Reach every lead', description: 'Never miss an opportunity again', stat: '100%', statLabel: 'lead coverage' },
  { title: 'Insights that matter', description: 'AI-powered analytics and reporting', stat: '24/7', statLabel: 'intelligence' },
  { title: 'Launch while you sleep', description: 'Automation that works 24/7', stat: 'Always', statLabel: 'on' },
];

export function HeroOutcomeCards() {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const toggleCard = (title: string) => {
    setSelectedCards(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  return (
    <section className="min-h-screen bg-white flex items-center px-6 py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-0 right-0 w-1/2 h-full"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Headline & CTA */}
          <div className="text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-purple-600 font-medium mb-4"
            >
              AI Work Platform
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Welcome to a world where{' '}
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #a855f7, #ec4899)',
                }}
              >
                monday AI
              </span>
              {' '}does the work
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 text-lg mb-8 max-w-lg"
            >
              Hover to explore each outcome
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`px-7 py-3 rounded-full font-medium text-base transition-all duration-300 ${
                selectedCards.length > 0
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02]'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Do the work for me →
            </motion.button>

            {selectedCards.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-sm text-gray-500"
              >
                {selectedCards.length} outcome{selectedCards.length > 1 ? 's' : ''} selected
              </motion.p>
            )}
          </div>

          {/* Right Side - Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Cards Grid Wrapper - handles mouse leave for entire area */}
            <div onMouseLeave={() => setHoveredCard(null)}>
            <div className="grid grid-cols-2 gap-4">
              {outcomeCards.map((card, i) => {
                const isSelected = selectedCards.includes(card.title);
                const isHovered = hoveredCard === card.title;
                const isOtherHovered = hoveredCard !== null && hoveredCard !== card.title;
                
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: isOtherHovered ? 0.4 : 1, 
                      y: 0,
                      scale: isOtherHovered ? 0.95 : 1,
                    }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.3 }}
                    onClick={() => toggleCard(card.title)}
                    onMouseEnter={() => setHoveredCard(card.title)}
                    className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg'
                        : 'bg-gray-50 border border-gray-200 hover:shadow-xl hover:border-purple-300'
                    }`}
                    style={{ minHeight: '130px' }}
                  >
                    <h3 className={`font-bold text-lg mb-2 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                      {card.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                      {card.description}
                    </p>
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                        <span className="text-purple-600 text-sm font-bold">✓</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Expanded Card Overlay */}
            <AnimatePresence>
              {hoveredCard && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-30 rounded-3xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, #0f0f23 0%, #1a1a3e 50%, #0a0a1a 100%)',
                    boxShadow: '0 30px 80px rgba(168, 85, 247, 0.4), 0 15px 40px rgba(0,0,0,0.4)',
                  }}
                  onClick={() => toggleCard(hoveredCard)}
                >
                  {/* Stars background */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(40)].map((_, idx) => (
                      <motion.div
                        key={idx}
                        className="absolute rounded-full bg-white"
                        style={{
                          width: Math.random() * 2 + 1 + 'px',
                          height: Math.random() * 2 + 1 + 'px',
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          opacity: [0.2, 0.8, 0.2],
                          scale: [1, 1.3, 1],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>

                  {/* Gradient arc at bottom */}
                  <svg className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
                    <ellipse
                      cx="50%"
                      cy="100%"
                      rx="60%"
                      ry="80"
                      fill="none"
                      stroke="url(#arcGrad)"
                      strokeWidth="1"
                      opacity="0.6"
                    />
                    <defs>
                      <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="30%" stopColor="#7c3aed" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="70%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Glow */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-48"
                    style={{
                      background: 'radial-gradient(ellipse at center bottom, rgba(168,85,247,0.4) 0%, transparent 70%)',
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <motion.h3 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-3xl font-bold text-white mb-2"
                        >
                          {hoveredCard}
                        </motion.h3>
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-gray-400"
                        >
                          {outcomeCards.find(c => c.title === hoveredCard)?.description}
                        </motion.p>
                      </div>
                      
                      {/* Products for Reach every lead */}
                      {hoveredCard === 'Reach every lead' && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="flex gap-2"
                        >
                          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                            <img src={crmLogo} alt="CRM" className="h-6 w-auto" />
                          </div>
                          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                            <img src={campaignsLogo} alt="Campaigns" className="h-6 w-auto" />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Center - Agent Cards (same as WorkComparisonSection) */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex justify-center items-end gap-4">
                        {/* Agent 1 - Sales */}
                        <motion.div
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                          className="relative group"
                        >
                          <div className="bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 w-32 text-center hover:border-purple-500/50 transition-colors">
                            {/* Agent Image */}
                            <div className="relative w-16 h-16 mx-auto mb-3">
                              <motion.div
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 blur-md opacity-50"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              <img 
                                src={agentOrange} 
                                alt="Sales Agent" 
                                className="relative w-full h-full object-cover object-top rounded-full border-2 border-orange-400/50"
                                style={{ mixBlendMode: 'lighten' }}
                              />
                            </div>
                            <h4 className="text-white font-semibold text-xs mb-1">Sales Agent</h4>
                            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs mb-2">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                              Available
                            </div>
                            {/* Task indicator */}
                            <motion.div 
                              className="bg-gray-800 rounded-lg px-2 py-1 text-xs text-gray-400 flex items-center gap-1 justify-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.8 }}
                            >
                              <TrendingUp className="w-3 h-3 text-orange-400" />
                              <span>Closing deals</span>
                            </motion.div>
                          </div>
                        </motion.div>

                        {/* Agent 2 - Research (Center, slightly larger) */}
                        <motion.div
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
                          className="relative group"
                        >
                          <div className="bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 w-36 text-center hover:border-cyan-500/50 transition-colors -mt-4">
                            {/* Agent Image */}
                            <div className="relative w-20 h-20 mx-auto mb-3">
                              <motion.div
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 blur-md opacity-50"
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                              />
                              <img 
                                src={agentCyan} 
                                alt="Research Agent" 
                                className="relative w-full h-full object-cover object-top rounded-full border-2 border-cyan-400/50"
                                style={{ mixBlendMode: 'lighten' }}
                              />
                            </div>
                            <h4 className="text-white font-semibold text-sm mb-1">Research Agent</h4>
                            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs mb-2">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                              Available
                            </div>
                            {/* Task indicator */}
                            <motion.div 
                              className="bg-gray-800 rounded-lg px-2 py-1.5 text-xs text-gray-400 flex items-center gap-1 justify-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.9 }}
                            >
                              <Search className="w-3 h-3 text-cyan-400" />
                              <span>Market analysis</span>
                            </motion.div>
                          </div>
                        </motion.div>

                        {/* Agent 3 - Support */}
                        <motion.div
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                          className="relative group"
                        >
                          <div className="bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 w-32 text-center hover:border-pink-500/50 transition-colors">
                            {/* Agent Image */}
                            <div className="relative w-16 h-16 mx-auto mb-3">
                              <motion.div
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 blur-md opacity-50"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2.2, repeat: Infinity }}
                              />
                              <img 
                                src={agentPink} 
                                alt="Support Agent" 
                                className="relative w-full h-full object-cover object-top rounded-full border-2 border-pink-400/50"
                                style={{ mixBlendMode: 'lighten' }}
                              />
                            </div>
                            <h4 className="text-white font-semibold text-xs mb-1">Support Agent</h4>
                            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs mb-2">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                              Available
                            </div>
                            {/* Task indicator */}
                            <motion.div 
                              className="bg-gray-800 rounded-lg px-2 py-1 text-xs text-gray-400 flex items-center gap-1 justify-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1 }}
                            >
                              <HeadphonesIcon className="w-3 h-3 text-pink-400" />
                              <span>Customer care</span>
                            </motion.div>
                          </div>
                        </motion.div>

                        {/* More agents indicator */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 }}
                          className="flex flex-col items-center gap-2"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/30 flex items-center justify-center backdrop-blur-sm">
                            <MoreHorizontal className="w-4 h-4 text-purple-300" />
                          </div>
                          <span className="text-purple-300 text-xs">+∞</span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Bottom - Stat */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-center"
                    >
                      <p className="text-4xl font-bold text-white mb-1">
                        {outcomeCards.find(c => c.title === hoveredCard)?.stat}
                      </p>
                      <p className="text-purple-300">
                        {outcomeCards.find(c => c.title === hoveredCard)?.statLabel}
                      </p>
                    </motion.div>

                    {/* Selection indicator */}
                    {selectedCards.includes(hoveredCard) && (
                      <div className="absolute top-6 right-6 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold">✓</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
