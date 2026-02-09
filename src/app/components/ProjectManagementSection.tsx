import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';
import { 
  Database,
  Layers,
  Workflow,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useDepartments, useDepartmentData } from '@/hooks/useSupabase';

// Default agent styling (used for dynamic agents)
const agentStyles = [
  { 
    gradient: 'from-cyan-500 to-blue-500',
    border: 'border-cyan-400/50',
    hoverBorder: 'group-hover:border-cyan-400',
    glow: 'rgba(6, 182, 212, 0.3)',
    hoverGlow: 'rgba(6, 182, 212, 0.6)'
  },
  { 
    gradient: 'from-orange-500 to-amber-500',
    border: 'border-orange-400/50',
    hoverBorder: 'group-hover:border-orange-400',
    glow: 'rgba(249, 115, 22, 0.3)',
    hoverGlow: 'rgba(249, 115, 22, 0.6)'
  },
  { 
    gradient: 'from-pink-500 to-purple-500',
    border: 'border-pink-400/50',
    hoverBorder: 'group-hover:border-pink-400',
    glow: 'rgba(236, 72, 153, 0.3)',
    hoverGlow: 'rgba(236, 72, 153, 0.6)'
  },
  { 
    gradient: 'from-violet-500 to-purple-500',
    border: 'border-violet-400/50',
    hoverBorder: 'group-hover:border-violet-400',
    glow: 'rgba(139, 92, 246, 0.3)',
    hoverGlow: 'rgba(139, 92, 246, 0.6)'
  },
  { 
    gradient: 'from-emerald-500 to-teal-500',
    border: 'border-emerald-400/50',
    hoverBorder: 'group-hover:border-emerald-400',
    glow: 'rgba(16, 185, 129, 0.3)',
    hoverGlow: 'rgba(16, 185, 129, 0.6)'
  },
];

const boardLayers = [
  { label: 'monday DB', icon: Database, color: 'text-blue-400' },
  { label: 'Context', icon: Layers, color: 'text-purple-400' },
  { label: 'Workflow', icon: Workflow, color: 'text-pink-400' },
  { label: 'Vibe', icon: Sparkles, color: 'text-amber-400' },
];

export function ProjectManagementSection() {
  // Fetch departments from Supabase
  const { departments, loading: departmentsLoading } = useDepartments();
  
  // Track selected department
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  
  // Fetch agents for selected department
  const { agents: departmentAgents, loading: agentsLoading } = useDepartmentData(selectedDepartmentId);
  
  // Set default department when departments load
  useEffect(() => {
    if (departments.length > 0 && !selectedDepartmentId) {
      setSelectedDepartmentId(departments[0].id);
    }
  }, [departments, selectedDepartmentId]);
  
  // Map department data to UI format
  const mappedDepartments = useMemo(() => {
    return departments.map(dept => ({
      id: dept.id,
      title: dept.name,
      avatarImage: dept.avatar_image || '',
      avatarBgColor: dept.avatar_bg_color || '#6366f1',
    }));
  }, [departments]);
  
  // Map agents to UI format with styling
  const mappedAgents = useMemo(() => {
    return departmentAgents.map((agent, index) => ({
      name: agent.name,
      image: agent.image || '',
      description: agent.description || '',
      task: agent.value || agent.description || 'AI-powered assistance',
      ...agentStyles[index % agentStyles.length],
    }));
  }, [departmentAgents]);
  
  // Get selected department info
  const selectedDepartment = mappedDepartments.find(d => d.id === selectedDepartmentId);

  const isLoading = departmentsLoading || agentsLoading;

  return (
    <section className="min-h-screen flex relative overflow-hidden">
      {/* Left Side - Light background with value message */}
      <div className="w-1/2 h-screen bg-white flex flex-col items-center justify-center relative px-12">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.3]">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'linear-gradient(to right, #f3e8ff 1px, transparent 1px), linear-gradient(to bottom, #f3e8ff 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-purple-600 font-medium mb-4 text-sm tracking-wide uppercase">
              Project Management
            </p>
            
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
              <span>Projects </span>
              <span className="text-gray-400">without </span>
              <span 
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #a855f7, #ec4899)' }}
              >
                management
              </span>
            </h2>

            <p className="text-gray-600 text-lg mb-10">
              Your AI teammates handle every detail
            </p>

            {/* Stats */}
            <div className="flex gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <p className="text-5xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #a855f7, #ec4899)' }}>
                  10x
                </p>
                <p className="text-gray-500 text-sm mt-1">faster planning</p>
              </motion.div>
              
              <div className="w-px bg-gray-200" />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <p className="text-5xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #a855f7, #ec4899)' }}>
                  Zero
                </p>
                <p className="text-gray-500 text-sm mt-1">missed deadlines</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Dark background with agents */}
      <div 
        className="w-1/2 h-screen flex flex-col items-center justify-center relative px-6 py-8"
        style={{
          background: 'linear-gradient(145deg, #0f0f23 0%, #1a1a3e 50%, #0a0a1a 100%)',
        }}
      >
        {/* Stars background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, idx) => (
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

        {/* Content */}
        <div className="relative z-10 w-full max-w-3xl flex flex-col h-full justify-center">
          {/* Department Selector Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <p className="text-white/40 text-xs font-medium tracking-widest uppercase text-center mb-3">
              Select Department
            </p>
            <div 
              className="flex justify-center gap-3 p-3 rounded-2xl mx-auto"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {mappedDepartments.map((dept, index) => {
                const isSelected = selectedDepartmentId === dept.id;
                
                return (
                  <motion.button
                    key={dept.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDepartmentId(dept.id)}
                    onMouseEnter={() => setHoveredDept(dept.id)}
                    onMouseLeave={() => setHoveredDept(null)}
                    className="relative w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center"
                    style={{
                      backgroundColor: dept.avatarBgColor,
                      border: isSelected 
                        ? '3px solid rgba(97, 97, 255, 0.9)' 
                        : '2px solid rgba(255, 255, 255, 0.15)',
                      boxShadow: isSelected 
                        ? `0 0 25px ${dept.avatarBgColor}, 0 0 50px rgba(97, 97, 255, 0.4)` 
                        : 'none',
                    }}
                  >
                    {dept.avatarImage ? (
                      <img 
                        src={dept.avatarImage} 
                        alt={dept.title}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-lg font-bold">
                        {dept.title.charAt(0).toUpperCase()}
                      </span>
                    )}
                    
                    {/* Tooltip */}
                    <AnimatePresence>
                      {hoveredDept === dept.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none z-50"
                          style={{
                            background: 'rgba(17, 24, 39, 0.95)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.95)',
                          }}
                        >
                          {dept.title}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        layoutId="pmSelectedDept"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                        style={{
                          background: 'rgba(97, 97, 255, 1)',
                          boxShadow: '0 0 10px rgba(97, 97, 255, 0.8)',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    {/* Glow effect on selected */}
                    {isSelected && (
                      <motion.div
                        animate={{ 
                          opacity: [0.4, 0.7, 0.4],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                          boxShadow: `0 0 25px ${dept.avatarBgColor}`,
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Title with selected department */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-white text-center mb-6"
          >
            {selectedDepartment ? (
              <>
                Meet your{' '}
                <span 
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #a855f7, #ec4899)' }}
                >
                  {selectedDepartment.title}
                </span>{' '}
                teammates
              </>
            ) : (
              'Meet your new project teammates'
            )}
          </motion.h3>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <span className="ml-3 text-white/60">Loading agents...</span>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && mappedAgents.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/40 text-lg">No agents found for this department</p>
              <p className="text-white/30 text-sm mt-2">Add agents in the admin dashboard</p>
            </div>
          )}

          {/* Agent Cards Grid with AnimatePresence */}
          {!isLoading && mappedAgents.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedDepartmentId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 space-y-5"
              >
                {/* Top row - up to 3 agents */}
                <div className="flex justify-center gap-5">
                  {mappedAgents.slice(0, 3).map((agent, i) => (
                    <motion.div
                      key={agent.name + i}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 100 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="relative group cursor-pointer"
                    >
                      <div 
                        className={`bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-sm rounded-2xl p-6 border-2 ${agent.border} ${agent.hoverBorder} w-48 text-center transition-all duration-300`}
                        style={{ 
                          boxShadow: `0 0 40px ${agent.glow}`,
                        }}
                      >
                        {/* Agent Image */}
                        <div className="relative w-24 h-24 mx-auto mb-4">
                          <motion.div
                            className={`absolute inset-0 rounded-full bg-gradient-to-r ${agent.gradient} blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
                          />
                          {agent.image ? (
                            <img 
                              src={agent.image} 
                              alt={agent.name} 
                              className={`relative w-full h-full object-cover object-top rounded-full border-2 ${agent.border} group-hover:border-opacity-100 transition-all duration-300`}
                              style={{ mixBlendMode: 'lighten' }}
                            />
                          ) : (
                            <div 
                              className={`relative w-full h-full rounded-full border-2 ${agent.border} flex items-center justify-center bg-gradient-to-br ${agent.gradient} opacity-50`}
                            >
                              <span className="text-white text-2xl font-bold">
                                {agent.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          {/* Ring effect on hover */}
                          <motion.div 
                            className={`absolute inset-0 rounded-full border-2 ${agent.border} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                            animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </div>
                        
                        <h4 className="text-white font-semibold text-base mb-1">{agent.name}</h4>
                        <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs mb-3">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                          Available
                        </div>
                        
                        {/* Task indicator */}
                        <motion.div 
                          className={`bg-gradient-to-r ${agent.gradient} bg-opacity-10 rounded-xl px-3 py-2 text-xs text-gray-200 font-medium`}
                          style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))` }}
                        >
                          {agent.task}
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Bottom row - remaining agents centered */}
                {mappedAgents.length > 3 && (
                  <div className="flex justify-center gap-5">
                    {mappedAgents.slice(3, 5).map((agent, i) => (
                      <motion.div
                        key={agent.name + (i + 3)}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 100 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="relative group cursor-pointer"
                      >
                        <div 
                          className={`bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-sm rounded-2xl p-6 border-2 ${agent.border} ${agent.hoverBorder} w-48 text-center transition-all duration-300`}
                          style={{ 
                            boxShadow: `0 0 40px ${agent.glow}`,
                          }}
                        >
                          {/* Agent Image */}
                          <div className="relative w-24 h-24 mx-auto mb-4">
                            <motion.div
                              className={`absolute inset-0 rounded-full bg-gradient-to-r ${agent.gradient} blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`}
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2.5 + i * 0.3, repeat: Infinity }}
                            />
                            {agent.image ? (
                              <img 
                                src={agent.image} 
                                alt={agent.name} 
                                className={`relative w-full h-full object-cover object-top rounded-full border-2 ${agent.border} group-hover:border-opacity-100 transition-all duration-300`}
                                style={{ mixBlendMode: 'lighten' }}
                              />
                            ) : (
                              <div 
                                className={`relative w-full h-full rounded-full border-2 ${agent.border} flex items-center justify-center bg-gradient-to-br ${agent.gradient} opacity-50`}
                              >
                                <span className="text-white text-2xl font-bold">
                                  {agent.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            {/* Ring effect on hover */}
                            <motion.div 
                              className={`absolute inset-0 rounded-full border-2 ${agent.border} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                              animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </div>
                          
                          <h4 className="text-white font-semibold text-base mb-1">{agent.name}</h4>
                          <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs mb-3">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            Available
                          </div>
                          
                          {/* Task indicator */}
                          <motion.div 
                            className={`bg-gradient-to-r ${agent.gradient} bg-opacity-10 rounded-xl px-3 py-2 text-xs text-gray-200 font-medium`}
                            style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))` }}
                          >
                            {agent.task}
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Peeking Board - Right side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute right-0 top-1/2 -translate-y-1/2"
        >
          <div 
            className="bg-gradient-to-l from-gray-800/90 to-gray-900/80 backdrop-blur-md rounded-l-xl border border-gray-700/50 border-r-0 p-3 pr-1"
            style={{
              boxShadow: '-10px 0 40px rgba(168, 85, 247, 0.15)',
            }}
          >
            <div className="space-y-2">
              {boardLayers.map((layer, i) => {
                const Icon = layer.icon;
                return (
                  <motion.div
                    key={layer.label}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 + i * 0.1 }}
                    className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-2 py-1.5"
                  >
                    <Icon className={`w-3 h-3 ${layer.color}`} />
                    <span className="text-gray-400 text-xs">{layer.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Bottom gradient arc */}
        <svg className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
          <ellipse
            cx="50%"
            cy="100%"
            rx="60%"
            ry="60"
            fill="none"
            stroke="url(#pmArcGrad)"
            strokeWidth="1"
            opacity="0.5"
          />
          <defs>
            <linearGradient id="pmArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="30%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="70%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}
