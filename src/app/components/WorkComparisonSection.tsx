import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  FileSpreadsheet, 
  Mail, 
  Phone, 
  AlertCircle, 
  Loader2,
  Sparkles,
  Calendar,
  Users,
  Zap,
  TrendingUp,
  HeadphonesIcon,
  Search,
  PenTool,
  MoreHorizontal
} from 'lucide-react';
import agentPink from '@/assets/agent-pink.png';
import agentCyan from '@/assets/agent-cyan.png';
import agentOrange from '@/assets/agent-orange.png';

interface WorkComparisonSectionProps {
  agents?: Array<{ name: string; image?: string; value?: string }>;
}

export function WorkComparisonSection({ agents = [] }: WorkComparisonSectionProps) {
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);

  return (
    <section className="h-screen flex relative overflow-hidden">
      {/* Left Side - Light - "You doing the work" */}
      <div
        className="w-1/2 h-full bg-gray-50 flex flex-col items-center justify-center relative cursor-pointer overflow-hidden"
        onMouseEnter={() => setHoveredSide('left')}
        onMouseLeave={() => setHoveredSide(null)}
      >
        {/* Background pattern - subtle grid */}
        <div className="absolute inset-0 opacity-[0.4]">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-8">
          {/* Small label */}
          <motion.p
            className="text-gray-400 text-sm uppercase tracking-widest mb-4"
            animate={{ opacity: hoveredSide === 'left' ? 1 : 0.7 }}
          >
            Today
          </motion.p>

          {/* Main headline */}
          <motion.h2
            className="text-gray-900 text-4xl md:text-5xl lg:text-6xl font-bold mb-8"
            animate={{ 
              scale: hoveredSide === 'left' ? 1.05 : 1,
              opacity: hoveredSide === 'right' ? 0.5 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            You doing the work
          </motion.h2>

          {/* Hover Animation - Team with workload */}
          <AnimatePresence>
            {hoveredSide === 'left' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className="mt-4"
              >
                {/* Team visualization */}
                <div className="max-w-md mx-auto">
                  {/* Team members - larger avatars */}
                  <div className="flex justify-center items-center mb-6">
                    <div className="flex -space-x-4">
                      {[
                        { name: 'Sarah', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face' },
                        { name: 'Mike', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
                        { name: 'Lisa', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face' },
                        { name: 'Tom', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face' },
                      ].map((member, i) => (
                        <motion.div
                          key={member.name}
                          initial={{ opacity: 0, scale: 0.8, x: -20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Team info */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <p className="text-gray-700 font-medium mb-3">Your team of 4</p>
                    
                    {/* Limitations row */}
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        Limited hours
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                        Hard to scale
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        Burnout risk
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-red-100/50 to-transparent pointer-events-none"
          animate={{ opacity: hoveredSide === 'left' ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Divider line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-400 to-transparent z-10" />

      {/* Right Side - Dark with Agent Team Hero */}
      <div
        className="w-1/2 h-full bg-black flex flex-col items-center justify-center relative cursor-pointer overflow-hidden"
        onMouseEnter={() => setHoveredSide('right')}
        onMouseLeave={() => setHoveredSide(null)}
      >
        {/* Starfield background */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Gradient arc like in the inspiration image */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.ellipse
            cx="50"
            cy="85"
            rx="45"
            ry="35"
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="0.3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="30%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="70%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>

        {/* Content */}
        <div className="relative z-10 text-center px-8 flex flex-col items-center">
          {/* Small label */}
          <motion.p
            className="text-gray-400 text-sm uppercase tracking-widest mb-4"
            animate={{ opacity: hoveredSide === 'right' ? 1 : 0.7 }}
          >
            AI work platform
          </motion.p>

          {/* Main headline */}
          <motion.h2
            className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            animate={{ 
              scale: hoveredSide === 'right' ? 1.05 : 1,
              opacity: hoveredSide === 'left' ? 0.5 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            Does the work for you
          </motion.h2>

          {/* Meet Your Unlimited Workforce */}
          <AnimatePresence>
            {hoveredSide === 'right' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8 w-full max-w-2xl"
              >
                {/* Your team + AI agents visualization */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-center items-center gap-3 mb-6"
                >
                  {/* Team members - small avatars */}
                  <div className="flex -space-x-2">
                    {[
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=60&h=60&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&crop=face',
                    ].map((img, i) => (
                      <motion.img
                        key={i}
                        src={img}
                        alt="Team member"
                        className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 + i * 0.05 }}
                      />
                    ))}
                  </div>
                  
                  {/* Plus sign */}
                  <motion.span 
                    className="text-2xl text-purple-400 font-light mx-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    +
                  </motion.span>
                  
                  {/* AI Agents label */}
                  <motion.div
                    className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full px-4 py-1.5 flex items-center gap-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300 text-sm font-medium">AI Agents</span>
                  </motion.div>
                </motion.div>

                {/* Agent Cards Grid */}
                <div className="flex justify-center items-end gap-4 mb-6">
                  {/* Agent 1 - Sales */}
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                    className="relative group"
                  >
                    <div className="bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 w-40 text-center hover:border-purple-500/50 transition-colors">
                      {/* Agent Image */}
                      <div className="relative w-20 h-20 mx-auto mb-3">
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
                      <h4 className="text-white font-semibold text-sm mb-1">Sales Agent</h4>
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
                    <div className="bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 w-44 text-center hover:border-cyan-500/50 transition-colors">
                      {/* Agent Image */}
                      <div className="relative w-24 h-24 mx-auto mb-3">
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
                      <h4 className="text-white font-semibold mb-1">Research Agent</h4>
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
                    <div className="bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 w-40 text-center hover:border-pink-500/50 transition-colors">
                      {/* Agent Image */}
                      <div className="relative w-20 h-20 mx-auto mb-3">
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 blur-md opacity-50"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2.2, repeat: Infinity }}
                        />
                        <img 
                          src={agentPink} 
                          alt="Support Agent" 
                          className="relative w-full h-full object-cover object-top rounded-full border-2 border-pink-400/50"
                        />
                      </div>
                      <h4 className="text-white font-semibold text-sm mb-1">Support Agent</h4>
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
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/30 flex items-center justify-center backdrop-blur-sm">
                      <MoreHorizontal className="w-5 h-5 text-purple-300" />
                    </div>
                    <span className="text-purple-300 text-xs">+∞</span>
                  </motion.div>
                </div>

                {/* Bottom tagline */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-center"
                >
                  <p className="text-lg text-white font-medium mb-2">
                    Meet your{' '}
                    <span 
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: 'linear-gradient(90deg, #a855f7, #ec4899, #f97316)',
                      }}
                    >
                      unlimited
                    </span>
                    {' '}workforce
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      Unlimited capacity
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      24/7 availability
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none"
          animate={{ opacity: hoveredSide === 'right' ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </section>
  );
}
