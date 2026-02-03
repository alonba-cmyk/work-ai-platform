import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneCall, Check, Mic, Users, Clock, CheckCircle2, Sparkles, Cpu, Zap } from 'lucide-react';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';
import sidekickIcon from '@/assets/sidekick-icon.png';
import agentsLogo from '@/assets/99be461a455ae49743d963276e2023ed6cd1445d.png';

interface AgentsSectionProps {
  department?: string;
  agents?: Array<{ name: string; value?: string; image?: string }>;
  activeSection?: 'inaction' | 'agents' | 'workflows';
  onSectionVisible?: () => void;
}

// Agent image
const agentImage = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face';

// Lead data with images
const leadsData = [
  { name: 'Sarah Johnson', company: 'TechCorp', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  { name: 'Mike Chen', company: 'StartupX', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { name: 'Emily Davis', company: 'GlobalInc', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  { name: 'Alex Kim', company: 'MediaHub', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  { name: 'Jordan Lee', company: 'FinanceOne', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
];

export function AgentsSection({ department = 'Marketing', activeSection = 'agents', onSectionVisible }: AgentsSectionProps) {
  const [sectionVisible, setSectionVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [agentBuildStep, setAgentBuildStep] = useState(0);
  const [agentReady, setAgentReady] = useState(false);
  const [currentCallIndex, setCurrentCallIndex] = useState(-1);
  const [leadStatuses, setLeadStatuses] = useState<string[]>(leadsData.map(() => 'pending'));
  const [callDuration, setCallDuration] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const userMessage = "Help me confirm attendance for our annual event";
  const sidekickResponse = "I'll create an AI Agent to handle this. Here's what I'm setting up:";
  
  const agentBuildSteps = [
    { text: 'Initializing AI Agent...', icon: Cpu },
    { text: 'Loading conversation skills...', icon: Zap },
    { text: 'Setting up voice module...', icon: Phone },
    { text: 'Agent ready!', icon: Check },
  ];

  const creationSteps = [
    { text: 'Creating Event Coordinator Agent', icon: Users },
    { text: 'Assigning 50 leads to contact', icon: Phone },
    { text: 'Starting confirmation calls', icon: PhoneCall },
  ];

  // IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!sectionVisible) {
            setSectionVisible(true);
            setTimeout(() => setIsAnimating(true), 500);
          }
          // Only notify parent (causing dimming of previous section) when significantly visible
          // This prevents dimming while user is still viewing Vibe section above
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

  // Agent building animation on left side
  useEffect(() => {
    if (!showResponse) return;
    if (agentBuildStep < agentBuildSteps.length) {
      const timer = setTimeout(() => setAgentBuildStep(prev => prev + 1), 700);
      return () => clearTimeout(timer);
    } else if (!agentReady) {
      setTimeout(() => {
        setAgentReady(true);
        // Start calling after agent is ready
        setTimeout(() => setCurrentCallIndex(0), 800);
      }, 500);
    }
  }, [showResponse, agentBuildStep, agentReady]);

  // Lead calling simulation
  useEffect(() => {
    if (currentCallIndex < 0 || currentCallIndex >= leadsData.length) return;
    
    setLeadStatuses(prev => {
      const newStatuses = [...prev];
      newStatuses[currentCallIndex] = 'calling';
      return newStatuses;
    });

    setCallDuration(0);
    const durationInterval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 100);

    const callTimer = setTimeout(() => {
      clearInterval(durationInterval);
      setLeadStatuses(prev => {
        const newStatuses = [...prev];
        newStatuses[currentCallIndex] = 'confirmed';
        return newStatuses;
      });
      
      setTimeout(() => {
        if (currentCallIndex < leadsData.length - 1) {
          setCurrentCallIndex(prev => prev + 1);
        }
      }, 500);
    }, 2500 + Math.random() * 1000);

    return () => {
      clearTimeout(callTimer);
      clearInterval(durationInterval);
    };
  }, [currentCallIndex]);

  const confirmedCount = leadStatuses.filter(s => s === 'confirmed').length;

  // Determine if this section should be dimmed (when workflows is active)
  const isDimmed = activeSection === 'workflows';

  return (
    <div ref={sectionRef} className="mt-16 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ 
          opacity: sectionVisible ? (isDimmed ? 0.35 : 1) : 0, 
          y: sectionVisible ? 0 : 40,
          filter: isDimmed ? 'blur(2px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Section Title */}
        <div className="text-center mb-8">
          <p className="text-white/60 text-sm mb-2">Automate your {department} outreach</p>
          <h3 className="text-2xl md:text-3xl text-white" style={{ fontWeight: 'var(--font-weight-bold)' }}>
            Let AI Agents do the work for you
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
          <div className="flex gap-6" style={{ minHeight: '520px' }}>
            {/* Left Side - Agent Building & Calls */}
            <div className="w-[55%] relative">
              {/* Agent Header */}
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
                <img src={agentsLogo} alt="Agents" className="w-10 h-10 rounded-xl" />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-bold">monday</span>
                    <span className="text-white/60">agents</span>
                  </div>
                  <p className="text-white/40 text-xs">Event Coordinator</p>
                </div>
                {agentReady && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full"
                    style={{ background: 'rgba(34, 197, 94, 0.2)', border: '1px solid rgba(34, 197, 94, 0.3)' }}
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-400 text-sm">Active</span>
                  </motion.div>
                )}
              </div>

              {/* Agent Building Animation */}
              <AnimatePresence>
                {showResponse && !agentReady && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                    style={{ top: '80px' }}
                  >
                    <div className="text-center">
                      {/* Agent Avatar Building */}
                      <motion.div
                        className="relative w-32 h-32 mx-auto mb-6"
                        animate={{ 
                          boxShadow: agentBuildStep >= 4 
                            ? '0 0 60px rgba(34, 197, 94, 0.5)' 
                            : '0 0 30px rgba(139, 92, 246, 0.3)'
                        }}
                        style={{ borderRadius: '50%' }}
                      >
                        {/* Scanning circle effect */}
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ border: '3px solid rgba(139, 92, 246, 0.5)' }}
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        
                        {/* Agent image with loading effect */}
                        <motion.div
                          className="w-full h-full rounded-full overflow-hidden"
                          style={{ 
                            border: agentBuildStep >= 4 ? '4px solid #22c55e' : '4px solid #8b5cf6',
                          }}
                          animate={{ 
                            opacity: agentBuildStep >= 2 ? 1 : 0.5,
                            filter: agentBuildStep >= 3 ? 'none' : 'grayscale(100%)',
                          }}
                        >
                          <img 
                            src={agentImage} 
                            alt="Agent" 
                            className="w-full h-full object-cover"
                          />
                        </motion.div>

                        {/* Sparkles when ready */}
                        {agentBuildStep >= 4 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2"
                          >
                            <Sparkles className="w-8 h-8 text-yellow-400" />
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Build Steps */}
                      <div className="space-y-2">
                        {agentBuildSteps.slice(0, agentBuildStep).map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-2"
                          >
                            <step.icon className={`w-4 h-4 ${index === agentBuildStep - 1 ? 'text-green-400' : 'text-white/60'}`} />
                            <span className={`text-sm ${index === agentBuildStep - 1 ? 'text-green-400' : 'text-white/60'}`}>
                              {step.text}
                            </span>
                            {index < agentBuildStep - 1 && <Check className="w-4 h-4 text-green-400" />}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Agent Calling Interface */}
              <AnimatePresence>
                {agentReady && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-3"
                  >
                    {/* Stats Bar */}
                    <div className="flex items-center gap-4 mb-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-400" />
                        <span className="text-white/60 text-sm">Leads: {leadsData.length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">Confirmed: {confirmedCount}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <Clock className="w-4 h-4 text-white/40" />
                        <span className="text-white/40 text-sm">In progress...</span>
                      </div>
                    </div>

                    {/* Lead List with Agent in Call */}
                    {leadsData.map((lead, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl transition-all"
                        style={{ 
                          background: leadStatuses[index] === 'calling' 
                            ? 'rgba(34, 197, 94, 0.1)' 
                            : 'rgba(255,255,255,0.02)',
                          border: leadStatuses[index] === 'calling'
                            ? '1px solid rgba(34, 197, 94, 0.3)'
                            : '1px solid rgba(255,255,255,0.05)',
                        }}
                      >
                        {/* Agent Avatar (shows when calling this lead) */}
                        <AnimatePresence>
                          {leadStatuses[index] === 'calling' && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="relative flex-shrink-0"
                            >
                              <img 
                                src={agentImage} 
                                alt="Agent"
                                className="w-10 h-10 rounded-full object-cover"
                                style={{ border: '2px solid #22c55e' }}
                              />
                              <motion.div
                                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                              >
                                <Mic className="w-2.5 h-2.5 text-white" />
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Lead Avatar */}
                        <div className="relative flex-shrink-0">
                          <img 
                            src={lead.image} 
                            alt={lead.name}
                            className="w-10 h-10 rounded-full object-cover"
                            style={{
                              border: leadStatuses[index] === 'calling' 
                                ? '2px solid #22c55e' 
                                : leadStatuses[index] === 'confirmed'
                                  ? '2px solid #22c55e'
                                  : '2px solid transparent',
                            }}
                          />
                          {leadStatuses[index] === 'calling' && (
                            <motion.div
                              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                            >
                              <PhoneCall className="w-2.5 h-2.5 text-white" />
                            </motion.div>
                          )}
                          {leadStatuses[index] === 'confirmed' && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Lead Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                            {lead.name}
                          </p>
                          <p className="text-white/40 text-xs truncate">{lead.company}</p>
                        </div>

                        {/* Call Status */}
                        <div className="text-right flex-shrink-0">
                          {leadStatuses[index] === 'pending' && (
                            <span className="text-white/30 text-xs">Pending</span>
                          )}
                          {leadStatuses[index] === 'calling' && (
                            <div className="flex items-center gap-2">
                              <motion.div
                                className="flex gap-0.5"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <div className="w-1 h-3 bg-green-400 rounded-full" />
                                <div className="w-1 h-4 bg-green-400 rounded-full" />
                                <div className="w-1 h-2 bg-green-400 rounded-full" />
                              </motion.div>
                              <span className="text-green-400 text-xs font-mono">
                                {Math.floor(callDuration / 10)}:{(callDuration % 10).toString().padStart(2, '0')}
                              </span>
                            </div>
                          )}
                          {leadStatuses[index] === 'confirmed' && (
                            <span className="text-green-400 text-xs flex items-center gap-1">
                              <Check className="w-3 h-3" /> Confirmed
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Placeholder before animation starts */}
              {!showResponse && (
                <div className="flex items-center justify-center h-64 text-white/20">
                  <div className="text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Agent will appear here...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Sidekick Panel (Consistent Design) */}
            <div 
              className="w-[45%] rounded-2xl"
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
                <div className="flex-1 overflow-y-auto space-y-4">
                  {/* User Message */}
                  <AnimatePresence>
                    {typingIndex > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-end"
                      >
                        <div 
                          className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2"
                          style={{ background: 'rgba(99, 102, 241, 0.3)' }}
                        >
                          <p className="text-white text-sm">
                            {userMessage.slice(0, typingIndex)}
                            {typingIndex === 0 && <img src={sidekickIcon} alt="" className="inline-block w-4 h-4 animate-pulse align-middle" />}
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
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex gap-2">
                          <img src={sidekickLogo} alt="" className="w-6 h-6 rounded-full flex-shrink-0" />
                          <div 
                            className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2"
                            style={{ background: 'rgba(236, 72, 153, 0.15)' }}
                          >
                            <p className="text-white/90 text-sm">{sidekickResponse}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Creation Steps */}
                  <AnimatePresence>
                    {agentBuildStep >= agentBuildSteps.length && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2 ml-8"
                      >
                        {creationSteps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="flex items-center gap-3 p-2 rounded-lg"
                            style={{ background: 'rgba(34, 197, 94, 0.1)' }}
                          >
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                              <Check className="w-4 h-4 text-green-400" />
                            </div>
                            <span className="text-white/80 text-sm">{step.text}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Agent Active Message */}
                  <AnimatePresence>
                    {agentReady && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex gap-2">
                          <img src={sidekickLogo} alt="" className="w-6 h-6 rounded-full flex-shrink-0" />
                          <div 
                            className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2"
                            style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.2)' }}
                          >
                            <p className="text-green-400 text-sm flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              Agent is now calling your leads!
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Input Area */}
                <div 
                  className="mt-4 p-3 rounded-xl flex items-center gap-2"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span className="text-white/30 text-sm flex-1">Ask Sidekick anything...</span>
                  <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
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
