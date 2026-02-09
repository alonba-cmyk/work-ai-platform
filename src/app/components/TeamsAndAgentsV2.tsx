import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2, Users, Sparkles, Plus, X, Check } from 'lucide-react';
import { useDepartments, useDepartmentData, useSiteSettings } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase';

export type LayoutVariant = 'mixed_circle' | 'team_with_agents' | 'side_by_side_unified' | 'cards_layout' | 'team_flanked';

// Agent styling based on index
const agentStyles = [
  { 
    gradient: 'from-cyan-500 to-blue-500',
    border: 'border-cyan-400/50',
    glow: 'rgba(6, 182, 212, 0.5)',
    color: '#06b6d4',
  },
  { 
    gradient: 'from-orange-500 to-amber-500',
    border: 'border-orange-400/50',
    glow: 'rgba(249, 115, 22, 0.5)',
    color: '#f97316',
  },
  { 
    gradient: 'from-pink-500 to-purple-500',
    border: 'border-pink-400/50',
    glow: 'rgba(236, 72, 153, 0.5)',
    color: '#ec4899',
  },
  { 
    gradient: 'from-violet-500 to-purple-500',
    border: 'border-violet-400/50',
    glow: 'rgba(139, 92, 246, 0.5)',
    color: '#8b5cf6',
  },
];

// Generic team member colors
const teamMemberColors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

interface MappedAgent {
  id: string;
  name: string;
  image: string;
  gradient: string;
  border: string;
  glow: string;
  color: string;
}

interface MappedDepartment {
  id: string;
  title: string;
  avatarImage: string;
  avatarBgColor: string;
}

interface TeamsAndAgentsV2Props {
  layoutVariant?: LayoutVariant;
}

// ===========================
// Shared: Department Selector Bar
// ===========================
function DepartmentSelector({
  departments,
  selectedId,
  onSelect,
  isLoading,
}: {
  departments: MappedDepartment[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
}) {
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        <span className="ml-3 text-white/60">Loading...</span>
      </div>
    );
  }

  return (
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
        {departments.map((dept, index) => {
          const isSelected = selectedId === dept.id;
          return (
            <motion.button
              key={dept.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(dept.id)}
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
  );
}

// ===========================
// Shared: Avatar bubble for a person or agent
// ===========================
function AvatarBubble({
  image,
  fallback,
  size = 'md',
  bgColor,
  borderColor,
  glow,
  isAgent = false,
  delay = 0,
  name,
}: {
  image?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
  bgColor?: string;
  borderColor?: string;
  glow?: string;
  isAgent?: boolean;
  delay?: number;
  name?: string;
}) {
  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };
  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <motion.div
      className="relative"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity, delay }}
    >
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden relative`}
        style={{
          backgroundColor: bgColor || (isAgent ? '#1a1a3e' : teamMemberColors[0]),
          border: `${size === 'lg' ? '4px' : size === 'md' ? '3px' : '2px'} solid ${
            borderColor || 'rgba(255,255,255,0.3)'
          }`,
          boxShadow: glow ? `0 0 30px ${glow}` : 'none',
        }}
      >
        {image ? (
          <img
            src={image}
            alt={name || 'avatar'}
            className="w-full h-full object-cover object-top"
            style={isAgent ? { mixBlendMode: 'lighten' } : undefined}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className={`text-white ${textSizes[size]} font-bold`}>{fallback}</span>
          </div>
        )}
      </div>
      {/* AI badge */}
      {isAgent && (
        <div
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center z-10"
          style={{
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            border: '2px solid #0f0f23',
          }}
        >
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      )}
    </motion.div>
  );
}

// ===========================
// Layout 1: Mixed Circle Group
// ===========================
function MixedCircleLayout({
  department,
  agents,
  agentsLoading,
}: {
  department: MappedDepartment | undefined;
  agents: MappedAgent[];
  agentsLoading: boolean;
}) {
  // Interleave team members and agents
  const members = useMemo(() => {
    const items: Array<{ type: 'human' | 'agent'; data: any; index: number }> = [];
    // Department lead
    items.push({ type: 'human', data: { image: department?.avatarImage, bgColor: department?.avatarBgColor, name: department?.title }, index: 0 });
    // First agent
    if (agents[0]) items.push({ type: 'agent', data: agents[0], index: 1 });
    // Team member 1
    items.push({ type: 'human', data: { bgColor: teamMemberColors[1], name: 'Team' }, index: 2 });
    // Second agent
    if (agents[1]) items.push({ type: 'agent', data: agents[1], index: 3 });
    // Team member 2
    items.push({ type: 'human', data: { bgColor: teamMemberColors[2], name: 'Team' }, index: 4 });
    // Third agent
    if (agents[2]) items.push({ type: 'agent', data: agents[2], index: 5 });
    return items;
  }, [department, agents]);

  return (
    <div className="flex flex-col items-center">
      {/* Background glow */}
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #a855f7 0%, #6366f1 40%, transparent 70%)',
            transform: 'scale(2)',
          }}
          animate={{ scale: [2, 2.3, 2], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {agentsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : (
          <div className="relative">
            {/* Circular arrangement */}
            <div className="relative w-[380px] h-[380px] flex items-center justify-center">
              {/* Center label */}
              <motion.div
                className="absolute z-10 flex flex-col items-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3))',
                    border: '2px solid rgba(168, 85, 247, 0.4)',
                    boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)',
                  }}
                >
                  <Plus className="w-8 h-8 text-purple-300" strokeWidth={3} />
                </div>
              </motion.div>

              {/* Members in circle */}
              {members.map((member, i) => {
                const totalMembers = members.length;
                const angle = (i / totalMembers) * 2 * Math.PI - Math.PI / 2;
                const radius = 140;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.div
                    key={`${member.type}-${member.index}`}
                    className="absolute flex flex-col items-center gap-1"
                    style={{
                      left: `calc(50% + ${x}px - ${member.index === 0 ? '36px' : '28px'})`,
                      top: `calc(50% + ${y}px - ${member.index === 0 ? '36px' : '28px'})`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    {/* Connector line to center */}
                    <svg
                      className="absolute pointer-events-none"
                      style={{
                        width: `${Math.abs(x) + 40}px`,
                        height: `${Math.abs(y) + 40}px`,
                        left: x > 0 ? '-20px' : 'auto',
                        right: x <= 0 ? '-20px' : 'auto',
                        top: y > 0 ? '-20px' : 'auto',
                        bottom: y <= 0 ? '-20px' : 'auto',
                        zIndex: 0,
                        opacity: 0.15,
                      }}
                    />
                    <AvatarBubble
                      image={member.type === 'agent' ? member.data.image : member.data.image}
                      fallback={member.type === 'agent' ? '' : ''}
                      size={member.index === 0 ? 'lg' : 'md'}
                      bgColor={member.type === 'agent' ? undefined : member.data.bgColor}
                      borderColor={member.type === 'agent' ? member.data.color + '80' : undefined}
                      glow={member.type === 'agent' ? member.data.glow : undefined}
                      isAgent={member.type === 'agent'}
                      delay={i * 0.3}
                      name={member.type === 'agent' ? member.data.name : member.data.name}
                    />
                    <span className="text-xs text-white/60 mt-1 whitespace-nowrap">
                      {member.type === 'agent' ? member.data.name : (member.index === 0 ? (department?.title || 'Lead') : 'Team')}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-white font-bold text-xl">{department?.title || 'Team'}</p>
        <p className="text-purple-300/70 text-sm">Your extended team</p>
      </motion.div>
    </div>
  );
}

// ===========================
// Layout 2: Team Above + Agents Below
// ===========================
function TeamWithAgentsLayout({
  department,
  agents,
  agentsLoading,
}: {
  department: MappedDepartment | undefined;
  agents: MappedAgent[];
  agentsLoading: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Team Row */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400 font-medium text-sm uppercase tracking-wide">
            Your Team
          </span>
        </div>
        <div className="flex items-end gap-4">
          {/* Team member */}
          <AvatarBubble
            fallback=""
            size="sm"
            bgColor={teamMemberColors[0]}
            delay={0}
          />
          {/* Department lead */}
          <AvatarBubble
            image={department?.avatarImage}
            fallback={department?.title?.charAt(0) || 'T'}
            size="lg"
            bgColor={department?.avatarBgColor}
            borderColor="rgba(255,255,255,0.5)"
            glow={`${department?.avatarBgColor || '#6366f1'}60`}
            delay={0.2}
            name={department?.title}
          />
          {/* Team member */}
          <AvatarBubble
            fallback=""
            size="sm"
            bgColor={teamMemberColors[2]}
            delay={0.4}
          />
        </div>
      </motion.div>

      {/* Connection lines */}
      <motion.div
        className="relative flex items-center justify-center w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500/50" />
          <motion.div
            className="px-4 py-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
              border: '1px solid rgba(168, 85, 247, 0.4)',
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-purple-300 text-sm font-medium">Complemented by</span>
          </motion.div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
        </div>
      </motion.div>

      {/* Agents Row */}
      {agentsLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        </div>
      ) : agents.length === 0 ? (
        <p className="text-white/40 text-sm">No agents assigned yet</p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="flex items-start gap-6">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.name}
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
              >
                {/* Vertical dashed connector */}
                <motion.div
                  className="w-px h-6"
                  style={{
                    background: `repeating-linear-gradient(to bottom, ${agent.color}60, ${agent.color}60 4px, transparent 4px, transparent 8px)`,
                  }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
                <AvatarBubble
                  image={agent.image}
                  fallback=""
                  size={i === 0 ? 'lg' : 'md'}
                  borderColor={agent.color + '80'}
                  glow={agent.glow}
                  isAgent
                  delay={i * 0.3}
                  name={agent.name}
                />
                <span className="text-xs text-white/70 font-medium">{agent.name}</span>
                <span className="text-xs text-pink-400/60">AI Agent</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        className="text-center mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-white font-bold text-xl">{department?.title || 'Team'}</p>
        <p className="text-purple-300/70 text-sm">Humans + AI working together</p>
      </motion.div>
    </div>
  );
}

// ===========================
// Layout 3: Side by Side Unified
// ===========================
function SideBySideUnifiedLayout({
  department,
  agents,
  agentsLoading,
}: {
  department: MappedDepartment | undefined;
  agents: MappedAgent[];
  agentsLoading: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-8">
      {/* Left Side - Human Team */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col items-center"
      >
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400 font-medium text-xs uppercase tracking-wide">Your Team</span>
        </div>
        <div className="relative flex flex-col items-end gap-2">
          <AvatarBubble
            fallback=""
            size="sm"
            bgColor={teamMemberColors[0]}
            delay={0}
          />
          <div className="-mt-3">
            <AvatarBubble
              image={department?.avatarImage}
              fallback={department?.title?.charAt(0) || 'T'}
              size="lg"
              bgColor={department?.avatarBgColor}
              borderColor="rgba(255,255,255,0.5)"
              glow={`${department?.avatarBgColor || '#6366f1'}60`}
              delay={0.2}
              name={department?.title}
            />
          </div>
          <div className="flex gap-2 -mt-3">
            <AvatarBubble fallback="" size="sm" bgColor={teamMemberColors[1]} delay={0.4} />
            <AvatarBubble fallback="" size="sm" bgColor={teamMemberColors[2]} delay={0.5} />
          </div>
        </div>
        <p className="mt-3 text-white font-bold text-lg">{department?.title || 'Team'}</p>
        <p className="text-white/50 text-xs">Human experts</p>
      </motion.div>

      {/* Center - Flowing gradient connection (no hard "+") */}
      <motion.div
        className="flex flex-col items-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* Flowing gradient bridge */}
        <div className="relative w-32 h-48 flex flex-col items-center justify-center">
          {/* Horizontal gradient line */}
          <motion.div
            className="absolute w-full h-px"
            style={{
              background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.6), rgba(168, 85, 247, 0.8), rgba(236, 72, 153, 0.6))',
            }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Flowing particles */}
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#6366f1', '#a855f7', '#ec4899'][i],
                boxShadow: `0 0 10px ${['#6366f1', '#a855f7', '#ec4899'][i]}`,
              }}
              animate={{
                x: [-60, 60],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.8,
                ease: 'linear',
              }}
            />
          ))}
          {/* Center text */}
          <motion.div
            className="relative z-10 px-3 py-1.5 rounded-full mt-8"
            style={{
              background: 'rgba(15, 15, 35, 0.8)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
            }}
          >
            <motion.span
              className="text-purple-300 text-xs font-semibold"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Better Together
            </motion.span>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - AI Agents */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col items-center"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span className="text-pink-400 font-medium text-xs uppercase tracking-wide">AI Agents</span>
        </div>

        {agentsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/40 text-sm">No agents yet</p>
          </div>
        ) : (
          <div className="relative flex flex-col items-start gap-2">
            {agents[0] && (
              <AvatarBubble
                image={agents[0].image}
                fallback=""
                size="sm"
                borderColor={agents[0].color + '80'}
                glow={agents[0].glow}
                isAgent
                delay={0}
                name={agents[0].name}
              />
            )}
            {agents[1] && (
              <div className="-mt-3">
                <AvatarBubble
                  image={agents[1].image}
                  fallback=""
                  size="lg"
                  borderColor={agents[1].color + '80'}
                  glow={agents[1].glow}
                  isAgent
                  delay={0.2}
                  name={agents[1].name}
                />
              </div>
            )}
            {agents[2] && (
              <div className="-mt-3">
                <AvatarBubble
                  image={agents[2].image}
                  fallback=""
                  size="sm"
                  borderColor={agents[2].color + '80'}
                  glow={agents[2].glow}
                  isAgent
                  delay={0.4}
                  name={agents[2].name}
                />
              </div>
            )}
          </div>
        )}
        <p className="mt-3 text-white font-bold text-lg">AI Squad</p>
        <p className="text-white/50 text-xs">Always available</p>
      </motion.div>
    </div>
  );
}

// ===========================
// Layout 4: Cards Layout
// ===========================
function CardsLayout({
  department,
  agents,
  agentsLoading,
}: {
  department: MappedDepartment | undefined;
  agents: MappedAgent[];
  agentsLoading: boolean;
}) {
  if (agentsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/40">No agents assigned to this department yet</p>
      </div>
    );
  }

  // Pair each agent with a team member
  const cards = agents.map((agent, i) => ({
    agent,
    teamMember: {
      bgColor: i === 0 ? department?.avatarBgColor : teamMemberColors[i % teamMemberColors.length],
      image: i === 0 ? department?.avatarImage : undefined,
      name: i === 0 ? (department?.title || 'Lead') : `Team Member ${i}`,
    },
  }));

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.agent.name}
            className="relative flex flex-col items-center gap-4 p-6 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              minWidth: '200px',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
            whileHover={{
              border: '1px solid rgba(168, 85, 247, 0.3)',
              boxShadow: '0 0 30px rgba(168, 85, 247, 0.1)',
            }}
          >
            {/* Two avatars side by side */}
            <div className="flex items-center gap-3">
              {/* Human */}
              <div className="flex flex-col items-center gap-1">
                <AvatarBubble
                  image={card.teamMember.image}
                  fallback={card.teamMember.name.charAt(0)}
                  size="md"
                  bgColor={card.teamMember.bgColor}
                  borderColor="rgba(255,255,255,0.3)"
                  delay={i * 0.2}
                  name={card.teamMember.name}
                />
                <span className="text-xs text-blue-400/80">Human</span>
              </div>

              {/* Plus connector */}
              <motion.div
                className="flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3))',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                  }}
                >
                  <Plus className="w-4 h-4 text-purple-300" strokeWidth={3} />
                </div>
              </motion.div>

              {/* Agent */}
              <div className="flex flex-col items-center gap-1">
                <AvatarBubble
                  image={card.agent.image}
                  fallback=""
                  size="md"
                  borderColor={card.agent.color + '80'}
                  glow={card.agent.glow}
                  isAgent
                  delay={i * 0.2 + 0.1}
                  name={card.agent.name}
                />
                <span className="text-xs text-pink-400/80">AI Agent</span>
              </div>
            </div>

            {/* Card label */}
            <div className="text-center">
              <p className="text-white font-semibold text-sm">{card.teamMember.name}</p>
              <p className="text-purple-300/70 text-xs">
                + {card.agent.name}
              </p>
            </div>

            {/* Subtle bottom gradient */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${card.agent.color}40, transparent)`,
              }}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-white font-bold text-xl">{department?.title || 'Team'}</p>
        <p className="text-purple-300/70 text-sm">Every team member, powered by AI</p>
      </motion.div>
    </div>
  );
}

// Team member role titles
const teamRoles = ['Designer', 'Analyst', 'Manager', 'Strategist'];

// ===========================
// Popup: Add Agents to Squad
// ===========================
function AddAgentsPopup({
  isOpen,
  onClose,
  allAgents,
  featuredIds,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  allAgents: MappedAgent[];
  featuredIds: string[];
  onSave: (ids: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>(featuredIds);
  const [saving, setSaving] = useState(false);

  // Sync when popup opens
  useEffect(() => {
    if (isOpen) setSelected(featuredIds);
  }, [isOpen, featuredIds]);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(selected);
    setSaving(false);
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div key="add-agents-popup">
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
              className="w-full max-w-lg rounded-2xl border overflow-hidden pointer-events-auto"
              style={{
                background: 'linear-gradient(145deg, #1a1a3e, #0f0f23)',
                borderColor: 'rgba(168, 85, 247, 0.3)',
                boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5), 0 0 60px rgba(168, 85, 247, 0.15)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div>
                  <h3 className="text-white font-bold text-lg">Add AI Agents</h3>
                  <p className="text-white/50 text-sm mt-0.5">Select agents to join your squad</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Agent list */}
              <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
                {allAgents.length === 0 ? (
                  <p className="text-white/40 text-center py-8">No agents available for this department</p>
                ) : (
                  allAgents.map((agent) => {
                    const isSelected = selected.includes(agent.id);
                    return (
                      <motion.button
                        key={agent.id}
                        onClick={() => toggle(agent.id)}
                        className="w-full flex items-center gap-4 p-3 rounded-xl transition-all"
                        style={{
                          background: isSelected
                            ? 'rgba(168, 85, 247, 0.15)'
                            : 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${isSelected ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255, 255, 255, 0.06)'}`,
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        {/* Agent avatar */}
                        <div
                          className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative"
                          style={{
                            backgroundColor: '#1a1a3e',
                            border: `2px solid ${agent.color}80`,
                            boxShadow: isSelected ? `0 0 20px ${agent.glow}` : 'none',
                          }}
                        >
                          {agent.image ? (
                            <img
                              src={agent.image}
                              alt={agent.name}
                              className="w-full h-full object-cover object-top"
                              style={{ mixBlendMode: 'lighten' }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-purple-300" />
                            </div>
                          )}
                          {/* AI badge */}
                          <div
                            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                            style={{
                              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                              border: '1.5px solid #0f0f23',
                            }}
                          >
                            <Sparkles className="w-2 h-2 text-white" />
                          </div>
                        </div>

                        {/* Name */}
                        <div className="flex-1 text-left">
                          <span className="text-white font-medium text-sm">{agent.name}</span>
                        </div>

                        {/* Checkbox */}
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                          style={{
                            background: isSelected
                              ? 'linear-gradient(135deg, #a855f7, #ec4899)'
                              : 'rgba(255, 255, 255, 0.1)',
                            border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                        </div>
                      </motion.button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-white/50 text-sm">
                  {selected.length} agent{selected.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-2 rounded-lg font-semibold text-white text-sm transition-all disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                    }}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ===========================
// Layout 5: Team Flanked (Unified Row)
// ===========================
function TeamFlankedLayout({
  department,
  agents,
  agentsLoading,
  allAgents = [],
  featuredAgentIds,
  onOpenPopup,
  otherDepartments = [],
}: {
  department: MappedDepartment | undefined;
  agents: MappedAgent[];
  agentsLoading: boolean;
  allAgents?: MappedAgent[];
  featuredAgentIds: string[];
  onOpenPopup: () => void;
  otherDepartments?: MappedDepartment[];
}) {
  // Filter to only show agents with actual images
  const agentsWithImages = useMemo(() => {
    return allAgents.filter(a => a.image && a.image.length > 0);
  }, [allAgents]);

  // Determine which agents to display: featured ones if set, otherwise first 2
  const displayedAgents = useMemo(() => {
    if (featuredAgentIds.length > 0) {
      return featuredAgentIds
        .map(id => agentsWithImages.find(a => a.id === id))
        .filter(Boolean) as MappedAgent[];
    }
    return agentsWithImages.slice(0, 2);
  }, [featuredAgentIds, agentsWithImages]);

  const notFeaturedCount = agentsWithImages.length - displayedAgents.length;

  // Use avatar images from other departments for the 4 team members
  const teamMemberData = useMemo(() => {
    return teamRoles.map((role, i) => {
      const otherDept = otherDepartments[i];
      return {
        role,
        image: otherDept?.avatarImage || '',
        fallback: otherDept?.title?.charAt(0) || role.charAt(0),
        bgColor: teamMemberColors[i],
      };
    });
  }, [otherDepartments]);

  return (
    <div className="flex flex-col items-center">
      {/* Background glow */}
      <motion.div
        className="absolute rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{
          width: '900px',
          height: '400px',
          background: 'radial-gradient(ellipse, #a855f7 0%, #6366f1 30%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.22, 0.15] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {agentsLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      ) : (
        <>
          {/* Unified row: Team0, Agent0, Team1, LEAD, Team2, Agent1, Team3, extra agents, [+] */}
          <motion.div
            className="relative flex items-end justify-center"
            layout
          >
            {/* 1. Team member 0 (Designer) - first item, no negative margin */}
            <motion.div
              className="flex flex-col items-center z-[1]"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              layout
            >
              <AvatarBubble
                image={teamMemberData[0].image}
                fallback={teamMemberData[0].fallback}
                size="md"
                bgColor={teamMemberData[0].bgColor}
                borderColor={teamMemberData[0].bgColor + '90'}
                delay={0.1}
              />
              <span className="text-xs text-white/50 mt-1.5 whitespace-nowrap">{teamMemberData[0].role}</span>
            </motion.div>

            {/* 2. Agent 0 (if exists) */}
            {displayedAgents[0] && (
              <motion.div
                key={`agent-${displayedAgents[0].id}`}
                className="flex flex-col items-center z-[2]"
                style={{ marginLeft: '-10px' }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, type: 'spring', stiffness: 200 }}
                layout
              >
                <AvatarBubble
                  image={displayedAgents[0].image}
                  fallback=""
                  size="md"
                  borderColor={displayedAgents[0].color + '80'}
                  glow={displayedAgents[0].glow}
                  isAgent
                  delay={0.15}
                  name={displayedAgents[0].name}
                />
                <span className="text-xs text-white/60 mt-1.5 whitespace-nowrap">{displayedAgents[0].name}</span>
              </motion.div>
            )}

            {/* 3. Team member 1 (Analyst) */}
            <motion.div
              className="flex flex-col items-center z-[2]"
              style={{ marginLeft: '-10px' }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              layout
            >
              <AvatarBubble
                image={teamMemberData[1].image}
                fallback={teamMemberData[1].fallback}
                size="md"
                bgColor={teamMemberData[1].bgColor}
                borderColor={teamMemberData[1].bgColor + '90'}
                delay={0.2}
              />
              <span className="text-xs text-white/50 mt-1.5 whitespace-nowrap">{teamMemberData[1].role}</span>
            </motion.div>

            {/* 4. CENTER: Department Lead */}
            <motion.div
              className="flex flex-col items-center z-[4]"
              style={{ marginLeft: '-10px' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 }}
              layout
            >
              <AvatarBubble
                image={department?.avatarImage}
                fallback={department?.title?.charAt(0) || 'T'}
                size="lg"
                bgColor={department?.avatarBgColor}
                borderColor="rgba(255,255,255,0.5)"
                glow={`${department?.avatarBgColor || '#6366f1'}60`}
                delay={0}
                name={department?.title}
              />
              <span className="text-xs text-white/80 mt-1.5 font-semibold whitespace-nowrap">
                {department?.title || 'Lead'}
              </span>
            </motion.div>

            {/* 5. Team member 2 (Manager) */}
            <motion.div
              className="flex flex-col items-center z-[2]"
              style={{ marginLeft: '-10px' }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              layout
            >
              <AvatarBubble
                image={teamMemberData[2].image}
                fallback={teamMemberData[2].fallback}
                size="md"
                bgColor={teamMemberData[2].bgColor}
                borderColor={teamMemberData[2].bgColor + '90'}
                delay={0.3}
              />
              <span className="text-xs text-white/50 mt-1.5 whitespace-nowrap">{teamMemberData[2].role}</span>
            </motion.div>

            {/* 6. Agent 1 (if exists) */}
            {displayedAgents[1] && (
              <motion.div
                key={`agent-${displayedAgents[1].id}`}
                className="flex flex-col items-center z-[2]"
                style={{ marginLeft: '-10px' }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}
                layout
              >
                <AvatarBubble
                  image={displayedAgents[1].image}
                  fallback=""
                  size="md"
                  borderColor={displayedAgents[1].color + '80'}
                  glow={displayedAgents[1].glow}
                  isAgent
                  delay={0.25}
                  name={displayedAgents[1].name}
                />
                <span className="text-xs text-white/60 mt-1.5 whitespace-nowrap">{displayedAgents[1].name}</span>
              </motion.div>
            )}

            {/* 7. Team member 3 (Strategist) */}
            <motion.div
              className="flex flex-col items-center z-[1]"
              style={{ marginLeft: '-10px' }}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              layout
            >
              <AvatarBubble
                image={teamMemberData[3].image}
                fallback={teamMemberData[3].fallback}
                size="md"
                bgColor={teamMemberData[3].bgColor}
                borderColor={teamMemberData[3].bgColor + '90'}
                delay={0.4}
              />
              <span className="text-xs text-white/50 mt-1.5 whitespace-nowrap">{teamMemberData[3].role}</span>
            </motion.div>

            {/* 8. Extra agents (index 2+) */}
            {displayedAgents.slice(2).map((agent, i) => (
              <motion.div
                key={`agent-extra-${agent.id}`}
                className="flex flex-col items-center z-[1]"
                style={{ marginLeft: '-10px' }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 200 }}
                layout
              >
                <AvatarBubble
                  image={agent.image}
                  fallback=""
                  size="md"
                  borderColor={agent.color + '80'}
                  glow={agent.glow}
                  isAgent
                  delay={0.3 + i * 0.15}
                  name={agent.name}
                />
                <span className="text-xs text-white/60 mt-1.5 whitespace-nowrap">{agent.name}</span>
              </motion.div>
            ))}

            {/* 9. "+" Add more agents button - opens popup */}
            <motion.button
              className="flex flex-col items-center cursor-pointer z-[1]"
              style={{ marginLeft: '-10px' }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              onClick={onOpenPopup}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-20 h-20 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
                  border: '2px dashed rgba(168, 85, 247, 0.5)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 15px rgba(168, 85, 247, 0.2)',
                    '0 0 30px rgba(168, 85, 247, 0.4)',
                    '0 0 15px rgba(168, 85, 247, 0.2)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Plus className="w-8 h-8 text-purple-300" strokeWidth={2.5} />
                {notFeaturedCount > 0 && (
                  <div
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                      color: 'white',
                      fontSize: '10px',
                    }}
                  >
                    {notFeaturedCount}
                  </div>
                )}
              </motion.div>
              <span className="text-xs text-purple-300/80 font-medium mt-1.5">Add agents</span>
            </motion.button>
          </motion.div>

          {/* Bottom label */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-white font-bold text-xl">{department?.title || 'Team'}</p>
            <motion.p
              className="text-purple-300/70 text-sm mt-1"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {displayedAgents.length > 0
                ? `Your squad - ${displayedAgents.length} AI agent${displayedAgents.length !== 1 ? 's' : ''}`
                : 'People first, AI-powered'}
            </motion.p>
          </motion.div>
        </>
      )}
    </div>
  );
}

// ===========================
// Main Component
// ===========================
export function TeamsAndAgentsV2({ layoutVariant = 'mixed_circle' }: TeamsAndAgentsV2Props) {
  const { departments, loading: departmentsLoading } = useDepartments();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const { agents: departmentAgents, loading: agentsLoading } = useDepartmentData(selectedDepartmentId);
  const { settings: siteSettings, refetch: refetchSettings } = useSiteSettings();

  // Popup state
  const [popupOpen, setPopupOpen] = useState(false);

  // Featured agent IDs for the current department
  const featuredAgentIds = useMemo(() => {
    if (!selectedDepartmentId) return [];
    return siteSettings.team_flanked_featured_agents[selectedDepartmentId] || [];
  }, [selectedDepartmentId, siteSettings.team_flanked_featured_agents]);

  // Save featured agents to Supabase
  const saveFeaturedAgents = useCallback(async (agentIds: string[]) => {
    if (!selectedDepartmentId) return;

    try {
      // First read current sections_visibility
      const { data } = await supabase
        .from('site_settings')
        .select('sections_visibility')
        .single();

      const currentVisibility = data?.sections_visibility || {};
      const currentFeatured = currentVisibility._team_flanked_featured_agents || {};

      const updatedFeatured = {
        ...currentFeatured,
        [selectedDepartmentId]: agentIds,
      };

      const updatedVisibility = {
        ...currentVisibility,
        _team_flanked_featured_agents: updatedFeatured,
      };

      await supabase
        .from('site_settings')
        .upsert({
          id: 'main',
          sections_visibility: updatedVisibility,
          updated_at: new Date().toISOString(),
        });

      // Refresh settings so UI updates
      await refetchSettings();
    } catch (err) {
      console.error('Failed to save featured agents:', err);
    }
  }, [selectedDepartmentId, refetchSettings]);

  useEffect(() => {
    if (departments.length > 0 && !selectedDepartmentId) {
      setSelectedDepartmentId(departments[0].id);
    }
  }, [departments, selectedDepartmentId]);

  const mappedDepartments = useMemo(() => {
    return departments.map(dept => ({
      id: dept.id,
      title: dept.name,
      avatarImage: dept.avatar_image || '',
      avatarBgColor: dept.avatar_bg_color || '#6366f1',
    }));
  }, [departments]);

  const mappedAgents = useMemo(() => {
    return departmentAgents.slice(0, 3).map((agent, index) => ({
      id: agent.id,
      name: agent.name,
      image: agent.image || '',
      ...agentStyles[index % agentStyles.length],
    }));
  }, [departmentAgents]);

  // All agents (no slice) - used by team_flanked layout
  const allMappedAgents = useMemo(() => {
    return departmentAgents.map((agent, index) => ({
      id: agent.id,
      name: agent.name,
      image: agent.image || '',
      ...agentStyles[index % agentStyles.length],
    }));
  }, [departmentAgents]);

  const selectedDepartment = mappedDepartments.find(d => d.id === selectedDepartmentId);

  const renderLayout = () => {
    const props = {
      department: selectedDepartment,
      agents: mappedAgents,
      agentsLoading,
    };

    switch (layoutVariant) {
      case 'mixed_circle':
        return <MixedCircleLayout {...props} />;
      case 'team_with_agents':
        return <TeamWithAgentsLayout {...props} />;
      case 'side_by_side_unified':
        return <SideBySideUnifiedLayout {...props} />;
      case 'cards_layout':
        return <CardsLayout {...props} />;
      case 'team_flanked': {
        const otherDepts = mappedDepartments.filter(d => d.id !== selectedDepartmentId);
        return (
          <>
            <TeamFlankedLayout
              {...props}
              allAgents={allMappedAgents}
              featuredAgentIds={featuredAgentIds}
              onOpenPopup={() => setPopupOpen(true)}
              otherDepartments={otherDepts}
            />
            <AddAgentsPopup
              isOpen={popupOpen}
              onClose={() => setPopupOpen(false)}
              allAgents={allMappedAgents}
              featuredIds={featuredAgentIds}
              onSave={saveFeaturedAgents}
            />
          </>
        );
      }
      default:
        return <MixedCircleLayout {...props} />;
    }
  };

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
          stroke="url(#taV2ArcGrad)"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <defs>
          <linearGradient id="taV2ArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
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

        <DepartmentSelector
          departments={mappedDepartments}
          selectedId={selectedDepartmentId}
          onSelect={setSelectedDepartmentId}
          isLoading={departmentsLoading}
        />
      </div>

      {/* Main Content - Dynamic Layout */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-8 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedDepartmentId}-${layoutVariant}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderLayout()}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
