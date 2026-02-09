import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';
import { Loader2, Users, Sparkles, Plus } from 'lucide-react';
import { useDepartments, useDepartmentData } from '@/hooks/useSupabase';

// Agent styling based on index
const agentStyles = [
  { 
    gradient: 'from-cyan-500 to-blue-500',
    border: 'border-cyan-400/50',
    glow: 'rgba(6, 182, 212, 0.5)',
  },
  { 
    gradient: 'from-orange-500 to-amber-500',
    border: 'border-orange-400/50',
    glow: 'rgba(249, 115, 22, 0.5)',
  },
  { 
    gradient: 'from-pink-500 to-purple-500',
    border: 'border-pink-400/50',
    glow: 'rgba(236, 72, 153, 0.5)',
  },
  { 
    gradient: 'from-violet-500 to-purple-500',
    border: 'border-violet-400/50',
    glow: 'rgba(139, 92, 246, 0.5)',
  },
];

// Generic team member colors
const teamMemberColors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

export function TeamsAndAgentsSection() {
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
  
  // Map agents to UI format with styling (limit to 3 for display)
  const mappedAgents = useMemo(() => {
    return departmentAgents.slice(0, 3).map((agent, index) => ({
      name: agent.name,
      image: agent.image || '',
      ...agentStyles[index % agentStyles.length],
    }));
  }, [departmentAgents]);
  
  // Get selected department info
  const selectedDepartment = mappedDepartments.find(d => d.id === selectedDepartmentId);

  const isLoading = departmentsLoading;

  return (
    <section 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #0f0f23 0%, #1a1a3e 50%, #0a0a1a 100%)',
      }}
    >
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(80)].map((_, idx) => (
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

      {/* Decorative gradient arc */}
      <svg className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-0">
        <ellipse
          cx="50%"
          cy="100%"
          rx="70%"
          ry="60"
          fill="none"
          stroke="url(#taArcGradFull)"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <defs>
          <linearGradient id="taArcGradFull" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="80%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      {/* Top Section - Title and Department Selector */}
      <div className="relative z-10 pt-16 pb-8 px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            <span>Your Team </span>
            <span 
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #a855f7, #ec4899)' }}
            >
              + AI Agents
            </span>
          </h2>
          <p className="text-white/60 text-lg">
            Better together - AI agents that join your team, not replace it
          </p>
        </motion.div>

        {/* Horizontal Department Selector */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <div 
              className="flex gap-3 p-3 rounded-2xl"
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
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDepartmentId(dept.id)}
                    onMouseEnter={() => setHoveredDept(dept.id)}
                    onMouseLeave={() => setHoveredDept(null)}
                    className="relative flex flex-col items-center gap-1"
                  >
                    <div 
                      className="w-14 h-14 rounded-full overflow-hidden transition-all duration-300"
                      style={{
                        backgroundColor: dept.avatarBgColor,
                        border: isSelected 
                          ? '3px solid rgba(255, 255, 255, 0.9)' 
                          : '2px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: isSelected 
                          ? `0 0 30px ${dept.avatarBgColor}, 0 0 60px ${dept.avatarBgColor}50` 
                          : 'none',
                      }}
                    >
                      {dept.avatarImage ? (
                        <img 
                          src={dept.avatarImage} 
                          alt={dept.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white text-xl font-bold">
                            {dept.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <span 
                      className={`text-xs font-medium transition-all duration-300 ${
                        isSelected ? 'text-white' : 'text-white/50'
                      }`}
                    >
                      {dept.title}
                    </span>
                    
                    {/* Tooltip */}
                    <AnimatePresence>
                      {hoveredDept === dept.id && !isSelected && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute -bottom-8 px-2 py-1 rounded-md text-xs text-white bg-gray-800 whitespace-nowrap"
                        >
                          Click to select
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
            <span className="ml-3 text-white/60">Loading...</span>
          </div>
        )}
      </div>

      {/* Main Content - Teams Facing Agents */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-8 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDepartmentId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-8 md:gap-16 lg:gap-24"
          >
            {/* Left Side - Human Team */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-medium text-sm uppercase tracking-wide">
                  Your Team
                </span>
              </div>
              
              {/* Team Avatar Group */}
              <div className="relative">
                {/* Background glow */}
                <motion.div
                  className="absolute inset-0 rounded-full blur-3xl opacity-30"
                  style={{ 
                    background: `radial-gradient(circle, ${selectedDepartment?.avatarBgColor || '#6366f1'} 0%, transparent 70%)`,
                    transform: 'scale(1.5)',
                  }}
                  animate={{ scale: [1.5, 1.7, 1.5], opacity: [0.3, 0.4, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Team members arrangement - pyramid facing right */}
                <div className="relative flex flex-col items-end gap-3">
                  {/* Top row - 1 member */}
                  <div className="flex justify-end">
                    <motion.div
                      className="w-20 h-20 rounded-full overflow-hidden border-3"
                      style={{ 
                        backgroundColor: teamMemberColors[0],
                        borderColor: 'rgba(255,255,255,0.3)',
                        borderWidth: '3px',
                      }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                        👤
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Middle row - Department Lead (larger) */}
                  <div className="flex justify-end -mt-4">
                    <motion.div
                      className="w-28 h-28 rounded-full overflow-hidden border-4 z-10"
                      style={{ 
                        backgroundColor: selectedDepartment?.avatarBgColor || '#6366f1',
                        borderColor: 'rgba(255,255,255,0.5)',
                        boxShadow: `0 0 40px ${selectedDepartment?.avatarBgColor || '#6366f1'}60`,
                      }}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, delay: 0.3 }}
                    >
                      {selectedDepartment?.avatarImage ? (
                        <img 
                          src={selectedDepartment.avatarImage} 
                          alt={selectedDepartment.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                          {selectedDepartment?.title.charAt(0) || 'T'}
                        </div>
                      )}
                    </motion.div>
                  </div>
                  
                  {/* Bottom row - 2 members */}
                  <div className="flex justify-end gap-2 -mt-4">
                    {[1, 2].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-16 h-16 rounded-full overflow-hidden border-2"
                        style={{ 
                          backgroundColor: teamMemberColors[i + 1],
                          borderColor: 'rgba(255,255,255,0.25)',
                        }}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2.8, repeat: Infinity, delay: 0.5 + i * 0.2 }}
                      >
                        <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                          👤
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Team label */}
                <motion.div
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-white font-bold text-xl">
                    {selectedDepartment?.title || 'Team'}
                  </p>
                  <p className="text-white/50 text-sm">Human experts</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Center - Connection Element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center"
            >
              {/* Animated Plus */}
              <motion.div
                className="relative"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Glow rings */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
                    transform: 'scale(3)',
                  }}
                  animate={{ scale: [3, 3.5, 3], opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
                    transform: 'scale(4)',
                  }}
                  animate={{ scale: [4, 4.5, 4], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                
                {/* Plus icon */}
                <div 
                  className="relative w-24 h-24 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3))',
                    border: '2px solid rgba(168, 85, 247, 0.5)',
                    boxShadow: '0 0 40px rgba(168, 85, 247, 0.4)',
                  }}
                >
                  <Plus className="w-12 h-12 text-purple-300" strokeWidth={3} />
                </div>
              </motion.div>
              
              <motion.p
                className="mt-6 text-purple-300 font-semibold text-lg"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Better Together
              </motion.p>
            </motion.div>

            {/* Right Side - AI Agents */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <span className="text-pink-400 font-medium text-sm uppercase tracking-wide">
                  AI Agents
                </span>
              </div>
              
              {/* Loading State */}
              {agentsLoading && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              )}
              
              {/* Empty State */}
              {!agentsLoading && mappedAgents.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-white/40">No agents yet</p>
                </div>
              )}
              
              {/* Agents Group - pyramid facing left */}
              {!agentsLoading && mappedAgents.length > 0 && (
                <div className="relative">
                  {/* Background glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full blur-3xl opacity-30"
                    style={{ 
                      background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
                      transform: 'scale(1.5)',
                    }}
                    animate={{ scale: [1.5, 1.7, 1.5], opacity: [0.3, 0.4, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  />
                  
                  <div className="relative flex flex-col items-start gap-3">
                    {/* Top agent */}
                    {mappedAgents[0] && (
                      <div className="flex justify-start">
                        <motion.div
                          className={`w-20 h-20 rounded-full overflow-hidden border-3 ${mappedAgents[0].border}`}
                          style={{ 
                            borderWidth: '3px',
                            boxShadow: `0 0 30px ${mappedAgents[0].glow}`,
                          }}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                        >
                          {mappedAgents[0].image ? (
                            <img 
                              src={mappedAgents[0].image} 
                              alt={mappedAgents[0].name}
                              className="w-full h-full object-cover object-top"
                              style={{ mixBlendMode: 'lighten' }}
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${mappedAgents[0].gradient}`}>
                              <span className="text-white text-2xl">🤖</span>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    )}
                    
                    {/* Middle - main agent (larger) */}
                    {mappedAgents[1] && (
                      <div className="flex justify-start -mt-4">
                        <motion.div
                          className={`w-28 h-28 rounded-full overflow-hidden border-4 z-10 ${mappedAgents[1].border}`}
                          style={{ 
                            borderWidth: '4px',
                            boxShadow: `0 0 50px ${mappedAgents[1].glow}`,
                          }}
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 3.5, repeat: Infinity, delay: 0.3 }}
                        >
                          {mappedAgents[1].image ? (
                            <img 
                              src={mappedAgents[1].image} 
                              alt={mappedAgents[1].name}
                              className="w-full h-full object-cover object-top"
                              style={{ mixBlendMode: 'lighten' }}
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${mappedAgents[1].gradient}`}>
                              <span className="text-white text-3xl">🤖</span>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    )}
                    
                    {/* Bottom agent */}
                    {mappedAgents[2] && (
                      <div className="flex justify-start -mt-4">
                        <motion.div
                          className={`w-16 h-16 rounded-full overflow-hidden border-2 ${mappedAgents[2].border}`}
                          style={{ 
                            borderWidth: '2px',
                            boxShadow: `0 0 25px ${mappedAgents[2].glow}`,
                          }}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 2.8, repeat: Infinity, delay: 0.6 }}
                        >
                          {mappedAgents[2].image ? (
                            <img 
                              src={mappedAgents[2].image} 
                              alt={mappedAgents[2].name}
                              className="w-full h-full object-cover object-top"
                              style={{ mixBlendMode: 'lighten' }}
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${mappedAgents[2].gradient}`}>
                              <span className="text-white text-xl">🤖</span>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    )}
                  </div>
                  
                  {/* Agents label */}
                  <motion.div
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-white font-bold text-xl">AI Squad</p>
                    <p className="text-white/50 text-sm">Always available</p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
