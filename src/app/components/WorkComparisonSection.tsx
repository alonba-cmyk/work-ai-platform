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
  Zap,
  Bot,
  CheckCircle2
} from 'lucide-react';
import agentsLogo from '@/assets/99be461a455ae49743d963276e2023ed6cd1445d.png';

// Fallback agents if none provided
const fallbackAgents = [
  { name: 'Sales Agent', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face', value: 'Qualifying leads' },
  { name: 'Research Agent', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face', value: 'Market analysis' },
  { name: 'Support Agent', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', value: 'Customer follow-up' },
];

interface WorkComparisonSectionProps {
  agents?: Array<{ name: string; image?: string; value?: string }>;
}

export function WorkComparisonSection({ agents = [] }: WorkComparisonSectionProps) {
  // Use provided agents or fallback, take first 3
  const displayAgents = (agents.length > 0 ? agents : fallbackAgents).slice(0, 3);
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);


  return (
    <section className="h-screen flex relative overflow-hidden">
      {/* Left Side - Black - "You doing the work" */}
      <div
        className="w-1/2 h-full bg-black flex flex-col items-center justify-center relative cursor-pointer overflow-hidden"
        onMouseEnter={() => setHoveredSide('left')}
        onMouseLeave={() => setHoveredSide(null)}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
              backgroundSize: '30px 30px'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-8">
          {/* Small label */}
          <motion.p
            className="text-gray-500 text-sm uppercase tracking-widest mb-4"
            animate={{ opacity: hoveredSide === 'left' ? 1 : 0.7 }}
          >
            Today
          </motion.p>

          {/* Main headline */}
          <motion.h2
            className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-8"
            animate={{ 
              scale: hoveredSide === 'left' ? 1.05 : 1,
              opacity: hoveredSide === 'right' ? 0.5 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            You doing the work
          </motion.h2>

          {/* Hover Animation - Manual Work Demo */}
          <AnimatePresence>
            {hoveredSide === 'left' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className="mt-8"
              >
                {/* Manual work visualization */}
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 max-w-md mx-auto">
                  {/* Multiple browser tabs */}
                  <div className="flex gap-2 mb-4">
                    {['Emails', 'Spreadsheet', 'CRM', 'Calendar'].map((tab, i) => (
                      <motion.div
                        key={tab}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-gray-800 px-3 py-1.5 rounded-t-lg text-xs text-gray-400 border-b-2 border-red-500/50"
                      >
                        {tab}
                      </motion.div>
                    ))}
                  </div>

                  {/* Task list with stress indicators */}
                  <div className="space-y-3">
                    {[
                      { icon: Mail, text: 'Reply to 47 emails', time: '2h', urgent: true },
                      { icon: FileSpreadsheet, text: 'Update spreadsheet', time: '1h', urgent: false },
                      { icon: Phone, text: 'Call 12 leads', time: '3h', urgent: true },
                      { icon: Calendar, text: 'Schedule meetings', time: '45m', urgent: false },
                    ].map((task, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-4 py-2"
                      >
                        <task.icon className={`w-4 h-4 ${task.urgent ? 'text-red-400' : 'text-gray-500'}`} />
                        <span className="text-gray-300 text-sm flex-1">{task.text}</span>
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <Clock className="w-3 h-3" />
                          {task.time}
                        </div>
                        {task.urgent && (
                          <AlertCircle className="w-4 h-4 text-red-400 animate-pulse" />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Stress indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-4 flex items-center justify-center gap-2 text-red-400 text-sm"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Estimated: 6+ hours of manual work</span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none"
          animate={{ opacity: hoveredSide === 'left' ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Divider line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-500 to-transparent z-10" />

      {/* Right Side - White - "Does the work for you" */}
      <div
        className="w-1/2 h-full bg-white flex flex-col items-center justify-center relative cursor-pointer overflow-hidden"
        onMouseEnter={() => setHoveredSide('right')}
        onMouseLeave={() => setHoveredSide(null)}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)',
              backgroundSize: '30px 30px'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-8">
          {/* Small label */}
          <motion.p
            className="text-gray-400 text-sm uppercase tracking-widest mb-4"
            animate={{ opacity: hoveredSide === 'right' ? 1 : 0.7 }}
          >
            AI work platform
          </motion.p>

          {/* Main headline */}
          <motion.h2
            className="text-gray-900 text-4xl md:text-5xl lg:text-6xl font-bold mb-8"
            animate={{ 
              scale: hoveredSide === 'right' ? 1.05 : 1,
              opacity: hoveredSide === 'left' ? 0.5 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            Does the work for you
          </motion.h2>

          {/* Hover Animation - Impressive Agent Team */}
          <AnimatePresence>
            {hoveredSide === 'right' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="mt-6"
              >
                {/* Central orchestration card */}
                <div className="relative max-w-2xl mx-auto">
                  {/* Background glow */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                    }}
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  {/* Main container */}
                  <div 
                    className="relative rounded-3xl p-6 backdrop-blur-sm border"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.9) 100%)',
                      borderColor: 'rgba(99, 102, 241, 0.2)',
                      boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15), 0 8px 20px rgba(0,0,0,0.08)',
                    }}
                  >
                    {/* Header with agents logo */}
                    <motion.div 
                      className="flex items-center justify-center gap-3 mb-5"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <motion.img
                        src={agentsLogo}
                        alt="Agents"
                        className="w-8 h-8 object-contain"
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <span className="text-gray-800 font-bold text-lg">AI Agents Working</span>
                      <motion.div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100"
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-emerald-700">Live</span>
                      </motion.div>
                    </motion.div>

                    {/* Agent cards grid */}
                    <div className="grid grid-cols-3 gap-4">
                      {displayAgents.map((agent, i) => (
                        <motion.div
                          key={agent.name}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            y: [0, -4, 0],
                          }}
                          transition={{ 
                            opacity: { delay: 0.2 + i * 0.1, duration: 0.4 },
                            scale: { delay: 0.2 + i * 0.1, duration: 0.4 },
                            y: { duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }
                          }}
                          className="relative group"
                        >
                          {/* Card */}
                          <div 
                            className="rounded-2xl p-3 border transition-all duration-300"
                            style={{
                              background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                              borderColor: 'rgba(99, 102, 241, 0.15)',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                            }}
                          >
                            {/* Agent image */}
                            <div className="relative mb-3">
                              <div className="w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                {agent.image ? (
                                  <img 
                                    src={agent.image} 
                                    alt={agent.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <img 
                                    src={agentsLogo} 
                                    alt={agent.name}
                                    className="w-12 h-12 object-contain"
                                  />
                                )}
                              </div>
                              {/* AI badge */}
                              <motion.div
                                className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
                                animate={{ 
                                  scale: [1, 1.1, 1],
                                  boxShadow: [
                                    '0 4px 12px rgba(99, 102, 241, 0.3)',
                                    '0 6px 20px rgba(99, 102, 241, 0.5)',
                                    '0 4px 12px rgba(99, 102, 241, 0.3)',
                                  ]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                              >
                                <Bot className="w-4 h-4 text-white" />
                              </motion.div>
                            </div>

                            {/* Agent info */}
                            <p className="font-semibold text-gray-800 text-sm mb-0.5">{agent.name}</p>
                            {agent.value && (
                              <div className="flex items-center gap-1.5">
                                <motion.div
                                  animate={{ opacity: [1, 0.5, 1] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                >
                                  <Zap className="w-3 h-3 text-amber-500" />
                                </motion.div>
                                <span className="text-xs text-gray-500 truncate">{agent.value}</span>
                              </div>
                            )}
                          </div>

                          {/* Connecting line to center */}
                          <motion.div
                            className="absolute -bottom-4 left-1/2 w-px h-4 bg-gradient-to-b from-indigo-300 to-transparent"
                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* Bottom status bar */}
                    <motion.div
                      className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>12 tasks completed</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        >
                          <Sparkles className="w-4 h-4 text-indigo-500" />
                        </motion.div>
                        <span>3 agents active</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-emerald-100/50 to-transparent pointer-events-none"
          animate={{ opacity: hoveredSide === 'right' ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </section>
  );
}
