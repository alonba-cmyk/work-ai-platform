import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Monday logo component
function MondayLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 44C8 48.4183 11.5817 52 16 52C20.4183 52 24 48.4183 24 44L24 20C24 15.5817 20.4183 12 16 12C11.5817 12 8 15.5817 8 20L8 44Z" fill="#FF3D57"/>
      <path d="M28 44C28 48.4183 31.5817 52 36 52C40.4183 52 44 48.4183 44 44L44 28C44 23.5817 40.4183 20 36 20C31.5817 20 28 23.5817 28 28L28 44Z" fill="#FFCB00"/>
      <path d="M48 44C48 48.4183 51.5817 52 56 52C60.4183 52 64 48.4183 64 44C64 39.5817 60.4183 36 56 36C51.5817 36 48 39.5817 48 44Z" fill="#00D647"/>
    </svg>
  );
}

// Agent colors based on index
const agentColors = ['#a855f7', '#f97316', '#06b6d4', '#10b981', '#ec4899', '#6366f1'];

interface Agent {
  id: string;
  name: string;
  image?: string;
  value?: string;
}

export function AgentsShowcaseSection() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch agents from database
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('is_active', true)
          .order('order_index')
          .limit(6); // Show up to 6 agents

        if (error) throw error;
        setAgents(data || []);
      } catch (err) {
        console.error('Failed to fetch agents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) {
    return (
      <section 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)',
        }}
      >
        <div className="text-2xl" style={{ color: '#1a1a2e' }}>Loading agents...</div>
      </section>
    );
  }

  if (agents.length === 0) {
    return (
      <section 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)',
        }}
      >
        <div className="text-center">
          <div className="text-2xl mb-4" style={{ color: '#1a1a2e' }}>No agents found</div>
          <p style={{ color: 'rgba(26, 26, 46, 0.7)' }}>Add agents in the admin dashboard</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="relative min-h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)',
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
            top: '-10%',
            right: '-10%',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
            bottom: '-10%',
            left: '-10%',
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* Header with Monday logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-12"
        >
          <MondayLogo />
          <span 
            className="text-2xl"
            style={{ 
              fontWeight: 'var(--font-weight-bold)',
              color: '#1a1a2e',
            }}
          >
            monday{' '}
            <span style={{ fontWeight: 'var(--font-weight-regular)', color: '#6366f1' }}>
              agents
            </span>
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mb-16"
        >
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl leading-tight"
            style={{ 
              fontWeight: 'var(--font-weight-bold)',
              color: '#1a1a2e',
            }}
          >
            Unlimited workforce that{' '}
            <span className="block">amplifies your team's impact</span>
          </h2>
          <p 
            className="mt-6 text-lg md:text-xl"
            style={{ color: 'rgba(26, 26, 46, 0.7)' }}
          >
            AI agents that work alongside your team, handling tasks and driving results 24/7
          </p>
        </motion.div>

        {/* Agents showcase */}
        <div className="flex flex-wrap justify-center items-end gap-6 md:gap-10 lg:gap-14">
          {agents.map((agent, index) => {
            const color = agentColors[index % agentColors.length];
            
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 80, scale: 0.7, rotate: -10 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2 + index * 0.12,
                  type: 'spring',
                  stiffness: 80,
                  damping: 12,
                }}
                className="relative"
                onMouseEnter={() => setHoveredAgent(agent.id)}
                onMouseLeave={() => setHoveredAgent(null)}
              >
                {/* Shadow under agent - pulses */}
                <motion.div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28 h-6 rounded-[50%]"
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    filter: 'blur(10px)',
                  }}
                  animate={{
                    scale: [1, 1.2, 0.9, 1.1, 1],
                    opacity: [0.2, 0.15, 0.25, 0.15, 0.2],
                  }}
                  transition={{
                    duration: 3 + index * 0.3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Agent container with strong animations */}
                <motion.div
                  className="relative cursor-pointer"
                  animate={{
                    y: [0, -20, 0, -15, 0],
                    rotate: [-3, 3, -2, 4, -3],
                    scale: [1, 1.02, 0.98, 1.01, 1],
                  }}
                  transition={{
                    duration: 4 + index * 0.7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    times: [0, 0.25, 0.5, 0.75, 1],
                  }}
                  whileHover={{
                    scale: 1.15,
                    y: -30,
                    rotate: 0,
                    transition: { duration: 0.3, type: 'spring', stiffness: 300 },
                  }}
                >
                  {/* Agent image container */}
                  <motion.div 
                    className="relative w-44 h-56 md:w-52 md:h-64 lg:w-60 lg:h-72 rounded-3xl overflow-hidden"
                    style={{
                      background: agent.image 
                        ? 'transparent' 
                        : `linear-gradient(145deg, ${color}15, ${color}35)`,
                      boxShadow: `0 15px 40px ${color}30`,
                    }}
                    animate={{
                      boxShadow: hoveredAgent === agent.id 
                        ? `0 25px 60px ${color}50, 0 0 30px ${color}30`
                        : `0 15px 40px ${color}30`,
                    }}
                  >
                    {agent.image ? (
                      <motion.img
                        src={agent.image}
                        alt={agent.name}
                        className="w-full h-full object-cover object-top"
                        animate={{
                          scale: hoveredAgent === agent.id ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      // Placeholder when no image
                      <div className="w-full h-full flex flex-col items-center justify-center p-4">
                        <motion.div 
                          className="w-24 h-24 rounded-full mb-4 flex items-center justify-center"
                          style={{ background: `${color}25` }}
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        >
                          <span className="text-5xl">🤖</span>
                        </motion.div>
                        <p 
                          className="text-center text-base font-medium"
                          style={{ color: color }}
                        >
                          {agent.name}
                        </p>
                      </div>
                    )}

                    {/* Shimmer effect on hover */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
                        backgroundSize: '200% 100%',
                      }}
                      animate={{
                        backgroundPosition: hoveredAgent === agent.id 
                          ? ['200% 0', '-200% 0'] 
                          : '200% 0',
                      }}
                      transition={{
                        duration: 0.8,
                        ease: 'easeInOut',
                      }}
                    />
                  </motion.div>

                  {/* Agent name label - always visible */}
                  <motion.div
                    className="mt-4 text-center"
                    animate={{
                      y: hoveredAgent === agent.id ? -5 : 0,
                    }}
                  >
                    <span 
                      className="text-lg font-semibold"
                      style={{ color: '#1a1a2e' }}
                    >
                      {agent.name}
                    </span>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <motion.button
            className="px-8 py-4 rounded-full text-white text-lg"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              fontWeight: 'var(--font-weight-semibold)',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
            }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 8px 30px rgba(99, 102, 241, 0.5)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            Meet your AI workforce
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
