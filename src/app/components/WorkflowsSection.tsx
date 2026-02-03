import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Zap, Mail, GitBranch, Headphones, User, Plus, Check, Mic } from 'lucide-react';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';
import sidekickIcon from '@/assets/sidekick-icon.png';
import workflowsLogo from '@/assets/workflows-logo.png';

interface WorkflowsSectionProps {
  department?: string;
  agents?: Array<{ name: string; value?: string; image?: string }>;
  onSectionVisible?: () => void;
}

export function WorkflowsSection({ department = 'Marketing', agents = [], onSectionVisible }: WorkflowsSectionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const userMessage = "I want to make the marketing process more efficient";
  const sidekickResponse = "I'll create an automated workflow to streamline your marketing. Here's what I'm setting up:";

  const featuredAgent = agents.find(a => a.image) || agents[0];

  // Workflow nodes configuration
  const workflowNodes = [
    { id: 'trigger', name: 'Trigger', description: 'When a new lead is added', icon: Zap, color: '#22c55e' },
    { id: 'sidekick', name: 'Sidekick', description: 'AI analyzes lead data', icon: null, logo: sidekickLogo, color: '#ec4899' },
    { id: 'gmail', name: 'Send Email', description: 'Personalized outreach email', icon: Mail, color: '#ea4335' },
    { id: 'condition', name: 'Check Response', description: 'If email opened/clicked', icon: GitBranch, color: '#6366f1' },
    { id: 'agent', name: 'AI Agent', description: 'Follow up with call', icon: Headphones, color: '#f59e0b' },
    { id: 'assign', name: 'Assign', description: 'Route to team member', icon: User, color: '#8b5cf6' },
  ];

  // IntersectionObserver for section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!sectionVisible) {
            setSectionVisible(true);
            // Start animation after a short delay
            setTimeout(() => setIsAnimating(true), 500);
          }
          // Only notify parent (causing dimming of previous section) when significantly visible
          if (entry.intersectionRatio >= 0.5) {
            onSectionVisible?.();
          }
        }
      },
      { threshold: [0.2, 0.5] } // Trigger at 20% for animations, 50% for dimming
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [sectionVisible, onSectionVisible]);

  // Typing animation
  useEffect(() => {
    if (!isAnimating) return;
    if (typingIndex < userMessage.length) {
      const timer = setTimeout(() => setTypingIndex(prev => prev + 1), 40);
      return () => clearTimeout(timer);
    } else if (!showResponse) {
      setTimeout(() => setShowResponse(true), 500);
    }
  }, [isAnimating, typingIndex, showResponse]);

  // Workflow node animation sequence
  useEffect(() => {
    if (!showResponse) return;
    if (currentStep < workflowNodes.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (!animationComplete) {
      setAnimationComplete(true);
    }
  }, [showResponse, currentStep, animationComplete]);

  const handleNodeClick = (nodeId: string) => {
    if (!animationComplete) return;
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  return (
    <div ref={sectionRef} className="mt-16 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: sectionVisible ? 1 : 0, y: sectionVisible ? 0 : 40 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Section Title */}
        <div className="text-center mb-8">
          <p className="text-white/60 text-sm mb-2">Automate your {department} processes</p>
          <h3 className="text-2xl md:text-3xl text-white" style={{ fontWeight: 'var(--font-weight-bold)' }}>
            Build powerful workflows with AI
          </h3>
        </div>

        {/* Main Content */}
        <div 
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.95), rgba(20, 20, 30, 0.98))',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex gap-6" style={{ minHeight: '500px' }}>
            {/* Left Side - Workflows Visualization */}
            <div className="w-[55%] relative">
              {/* Workflows Header */}
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
                <img src={workflowsLogo} alt="Workflows" className="w-10 h-10 rounded-xl" />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-bold">monday</span>
                    <span className="text-white/60">workflows</span>
                  </div>
                  <p className="text-white/40 text-xs">Marketing Automation</p>
                </div>
              </div>

              {/* Workflow Diagram */}
              <div className="relative flex flex-col items-center py-4">
                {/* Trigger Node */}
                <AnimatePresence>
                  {currentStep >= 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative z-10"
                    >
                      <div 
                        className={`w-14 h-14 rounded-xl rotate-45 flex items-center justify-center cursor-pointer transition-all ${
                          selectedNode === 'trigger' ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-transparent' : ''
                        }`}
                        style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)' }}
                        onClick={() => handleNodeClick('trigger')}
                      >
                        <Zap className="w-6 h-6 text-white -rotate-45" />
                      </div>
                      {selectedNode === 'trigger' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1.5 rounded-lg text-xs text-white whitespace-nowrap"
                        >
                          When a new lead is added
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Connection Line 1 */}
                <AnimatePresence>
                  {currentStep >= 2 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 40 }}
                      className="w-0.5 bg-gradient-to-b from-green-500 to-blue-500"
                    />
                  )}
                </AnimatePresence>

                {/* Sidekick Node */}
                <AnimatePresence>
                  {currentStep >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative z-10"
                    >
                      <div 
                        className={`px-6 py-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
                          selectedNode === 'sidekick' ? 'ring-2 ring-pink-400' : ''
                        }`}
                        style={{ 
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                        onClick={() => handleNodeClick('sidekick')}
                      >
                        <img src={sidekickLogo} alt="Sidekick" className="w-8 h-8" />
                        <span className="text-white font-medium">Sidekick analyzes</span>
                      </div>
                      {selectedNode === 'sidekick' && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="absolute top-1/2 -translate-y-1/2 left-full ml-3 bg-black/80 px-3 py-1.5 rounded-lg text-xs text-white whitespace-nowrap"
                        >
                          AI analyzes lead data and context
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Connection Line 2 */}
                <AnimatePresence>
                  {currentStep >= 3 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 40 }}
                      className="w-0.5 bg-gradient-to-b from-blue-500 to-red-500"
                    />
                  )}
                </AnimatePresence>

                {/* Gmail Node */}
                <AnimatePresence>
                  {currentStep >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative z-10"
                    >
                      <div 
                        className={`px-6 py-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
                          selectedNode === 'gmail' ? 'ring-2 ring-red-400' : ''
                        }`}
                        style={{ 
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                        onClick={() => handleNodeClick('gmail')}
                      >
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1">
                          <svg viewBox="0 0 24 24" className="w-full h-full">
                            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <span className="text-white font-medium">Send Email</span>
                          {currentStep >= 3 && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 1.5 }}
                              className="h-1 mt-1 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-green-500"
                            />
                          )}
                        </div>
                      </div>
                      {selectedNode === 'gmail' && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="absolute top-1/2 -translate-y-1/2 left-full ml-3 bg-black/80 px-3 py-1.5 rounded-lg text-xs text-white whitespace-nowrap"
                        >
                          Personalized outreach email
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Connection Line to Condition */}
                <AnimatePresence>
                  {currentStep >= 4 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 40 }}
                      className="w-0.5 bg-gradient-to-b from-red-500 to-indigo-500"
                    />
                  )}
                </AnimatePresence>

                {/* Condition Node */}
                <AnimatePresence>
                  {currentStep >= 4 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative z-10"
                    >
                      <div 
                        className={`w-12 h-12 rounded-lg rotate-45 flex items-center justify-center cursor-pointer transition-all ${
                          selectedNode === 'condition' ? 'ring-2 ring-indigo-400' : ''
                        }`}
                        style={{ 
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}
                        onClick={() => handleNodeClick('condition')}
                      >
                        <GitBranch className="w-5 h-5 text-indigo-400 -rotate-45" />
                      </div>
                      {selectedNode === 'condition' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1.5 rounded-lg text-xs text-white whitespace-nowrap"
                        >
                          Check if email opened/clicked
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Branch Lines */}
                <AnimatePresence>
                  {currentStep >= 5 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative w-full h-20"
                    >
                      {/* Left branch line */}
                      <motion.div
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        className="absolute left-1/2 top-0 w-24 h-full"
                        style={{ marginLeft: '-96px' }}
                      >
                        <svg className="w-full h-full" viewBox="0 0 96 80">
                          <motion.path
                            d="M 96 0 L 96 20 Q 96 40 76 40 L 20 40 Q 0 40 0 60 L 0 80"
                            fill="none"
                            stroke="url(#blueGradient)"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8 }}
                          />
                          <defs>
                            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#6366f1" />
                              <stop offset="100%" stopColor="#f59e0b" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </motion.div>
                      {/* Right branch line */}
                      <motion.div
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        className="absolute left-1/2 top-0 w-24 h-full"
                      >
                        <svg className="w-full h-full" viewBox="0 0 96 80">
                          <motion.path
                            d="M 0 0 L 0 20 Q 0 40 20 40 L 76 40 Q 96 40 96 60 L 96 80"
                            fill="none"
                            stroke="url(#purpleGradient)"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8 }}
                          />
                          <defs>
                            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#6366f1" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Branch Nodes */}
                <AnimatePresence>
                  {currentStep >= 6 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-center gap-24 w-full"
                    >
                      {/* Agent Branch */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                      >
                        <div 
                          className={`px-4 py-3 rounded-2xl flex items-center gap-2 cursor-pointer transition-all ${
                            selectedNode === 'agent' ? 'ring-2 ring-amber-400' : ''
                          }`}
                          style={{ 
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                            border: '1px solid rgba(255,255,255,0.2)'
                          }}
                          onClick={() => handleNodeClick('agent')}
                        >
                          {featuredAgent?.image ? (
                            <img src={featuredAgent.image} alt="Agent" className="w-8 h-8 rounded-lg object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                              <Headphones className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <span className="text-white text-sm font-medium">AI Agent</span>
                        </div>
                        {selectedNode === 'agent' && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1.5 rounded-lg text-xs text-white whitespace-nowrap"
                          >
                            Follow up with phone call
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Assign Branch */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative"
                      >
                        <div 
                          className={`px-4 py-3 rounded-2xl flex items-center gap-2 cursor-pointer transition-all ${
                            selectedNode === 'assign' ? 'ring-2 ring-purple-400' : ''
                          }`}
                          style={{ 
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                            border: '1px solid rgba(255,255,255,0.2)'
                          }}
                          onClick={() => handleNodeClick('assign')}
                        >
                          <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white text-sm font-medium">Assign</span>
                        </div>
                        {selectedNode === 'assign' && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1.5 rounded-lg text-xs text-white whitespace-nowrap"
                          >
                            Route to team member
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Add Step Button */}
                <AnimatePresence>
                  {animationComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-8"
                    >
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white/60 hover:text-white">
                        <Plus className="w-4 h-4" />
                        <span className="text-sm">Add step</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Side - Sidekick Panel (Consistent Design) */}
            <div className="w-[45%]">
              <div 
                className="h-full rounded-2xl"
                style={{ 
                  background: 'linear-gradient(135deg, #ec4899, #a855f7, #f59e0b)',
                  padding: '3px',
                  boxShadow: '0 0 50px rgba(236, 72, 153, 0.3)',
                }}
              >
                <div 
                  className="h-full rounded-[14px] p-5 flex flex-col"
                  style={{ 
                    background: 'linear-gradient(145deg, rgba(45, 45, 55, 0.92), rgba(35, 35, 45, 0.95), rgba(40, 40, 50, 0.9))',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {/* Sidekick Header */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                    <div className="w-10 h-10 flex-shrink-0">
                      <img src={sidekickLogo} alt="Sidekick" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-white font-bold text-lg">monday</span>
                      <span className="text-white/60 font-medium text-lg">sidekick</span>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 flex flex-col gap-4">
                    {/* User Message */}
                    <AnimatePresence>
                      {isAnimating && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-end"
                        >
                          <div className="bg-indigo-600 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%]">
                            <p className="text-white text-sm">
                              {userMessage.slice(0, typingIndex)}
                              {typingIndex === 0 && (
                                <img src={sidekickIcon} alt="" className="inline-block w-4 h-4 animate-pulse align-middle" />
                              )}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Sidekick Response */}
                    <AnimatePresence>
                      {showResponse && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-3"
                        >
                          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                            <p className="text-white/90 text-sm mb-3">{sidekickResponse}</p>
                            
                            {/* Workflow Steps List */}
                            <div className="space-y-2">
                              {workflowNodes.slice(0, currentStep).map((node, index) => (
                                <motion.div
                                  key={node.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <div 
                                    className="w-5 h-5 rounded flex items-center justify-center"
                                    style={{ background: node.color }}
                                  >
                                    {node.icon ? (
                                      <node.icon className="w-3 h-3 text-white" />
                                    ) : (
                                      <img src={node.logo} alt="" className="w-3 h-3" />
                                    )}
                                  </div>
                                  <span className="text-white/70">{node.name}</span>
                                  <Check className="w-3.5 h-3.5 text-green-400 ml-auto" />
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Completion Message */}
                          <AnimatePresence>
                            {animationComplete && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-500/20 rounded-xl p-3 border border-green-500/30"
                              >
                                <p className="text-green-400 text-sm flex items-center gap-2">
                                  <Check className="w-4 h-4" />
                                  Workflow created! Click on any step to see details.
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Input Area */}
                  <div 
                    className="mt-4 rounded-xl p-3 flex items-center gap-3"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <input 
                      type="text"
                      placeholder="Tell sidekick what you want to do..."
                      className="flex-1 bg-transparent text-white/80 text-sm placeholder:text-white/40 outline-none"
                      disabled
                    />
                    <Mic className="w-4 h-4 text-white/40" />
                    <Plus className="w-4 h-4 text-white/40" />
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
