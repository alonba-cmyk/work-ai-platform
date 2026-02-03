import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { 
  Phone,
  PhoneCall,
  Clock,
  ChevronDown,
  GripVertical,
  Search,
  MessageCircle,
  Check,
  Sparkles,
  Mic,
  Zap,
  GitBranch,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';
import sidekickIcon from '@/assets/sidekick-icon.png';
import agentsLogo from '@/assets/99be461a455ae49743d963276e2023ed6cd1445d.png';
import vibeLogo from '@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png';
import workflowsLogo from '@/assets/workflows-logo.png';

interface BeforeAfterSectionProps {
  onExplore?: () => void;
}

// Lead/Agent images from Unsplash
const agentImage = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face';
const leadImages = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
];

// App icons for scattered tools
const scatteredApps = [
  { icon: '📊', color: '#217346', name: 'Excel' },
  { icon: '📧', color: '#EA4335', name: 'Gmail' },
  { icon: '💬', color: '#4A154B', name: 'Slack' },
  { icon: '📋', color: '#0F9D58', name: 'Sheets' },
  { icon: '📅', color: '#4285F4', name: 'Calendar' },
  { icon: '📝', color: '#FF6B00', name: 'Forms' },
];

// Vibe apps result
const vibeApps = [
  { name: 'Check-in', icon: '✓' },
  { name: 'Schedule', icon: '📅' },
  { name: 'Directory', icon: '👥' },
];

export function BeforeAfterSection({ onExplore }: BeforeAfterSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation states
  const [callDuration, setCallDuration] = useState(0);
  const [appMergeStep, setAppMergeStep] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);
  const [responseIndex, setResponseIndex] = useState(0);
  const [workflowStep, setWorkflowStep] = useState(0);

  const question = "What's our Q4 revenue target?";
  const answer = "$2.4M — up 23% from Q3";

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Animations when slider > 50%
  const showAfter = sliderPosition > 50;

  // Call duration animation
  useEffect(() => {
    if (!isVisible || !showAfter) return;
    const interval = setInterval(() => {
      setCallDuration(prev => prev < 127 ? prev + 1 : 127);
    }, 50);
    return () => clearInterval(interval);
  }, [isVisible, showAfter]);

  // App merge animation
  useEffect(() => {
    if (!isVisible || !showAfter) return;
    const interval = setInterval(() => {
      setAppMergeStep(prev => prev < 6 ? prev + 1 : 6);
    }, 400);
    return () => clearInterval(interval);
  }, [isVisible, showAfter]);

  // Sidekick typing animation
  useEffect(() => {
    if (!isVisible || !showAfter) return;
    const interval = setInterval(() => {
      setTypingIndex(prev => prev < question.length ? prev + 1 : question.length);
    }, 60);
    return () => clearInterval(interval);
  }, [isVisible, showAfter]);

  // Sidekick response animation
  useEffect(() => {
    if (!isVisible || !showAfter || typingIndex < question.length) return;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setResponseIndex(prev => prev < answer.length ? prev + 1 : answer.length);
      }, 40);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(timeout);
  }, [isVisible, showAfter, typingIndex]);

  // Workflow animation
  useEffect(() => {
    if (!isVisible || !showAfter) return;
    const interval = setInterval(() => {
      setWorkflowStep(prev => prev < 5 ? prev + 1 : 5);
    }, 500);
    return () => clearInterval(interval);
  }, [isVisible, showAfter]);

  // Reset animations when slider goes back
  useEffect(() => {
    if (!showAfter) {
      setCallDuration(0);
      setAppMergeStep(0);
      setTypingIndex(0);
      setResponseIndex(0);
      setWorkflowStep(0);
    }
  }, [showAfter]);

  // Slider handlers
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setSliderPosition(Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setSliderPosition(Math.min(Math.max(((e.touches[0].clientX - rect.left) / rect.width) * 100, 0), 100));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Board item colors
  const itemColors = ['#0073ea', '#00c875', '#fdab3d', '#e2445c'];

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-16"
      style={{ background: 'linear-gradient(180deg, #000000 0%, #0a0a0f 100%)' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-10 z-10 px-6"
      >
        <h2 
          className="text-4xl md:text-5xl lg:text-6xl text-white mb-4"
          style={{ fontWeight: 'var(--font-weight-bold)' }}
        >
          Welcome to the{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            new world of work
          </span>
        </h2>
        <p className="text-white/50 text-lg">Drag the slider to see the transformation</p>
      </motion.div>

      {/* Monday Board Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className="w-full max-w-6xl mx-auto px-4"
      >
        {/* Board Header */}
        <div 
          className="rounded-t-xl px-6 py-4 flex items-center justify-between"
          style={{ background: 'rgba(30, 30, 46, 0.9)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-indigo-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-white text-lg" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
              AI Work Transformation
            </h3>
          </div>
          <MoreHorizontal className="w-5 h-5 text-white/40" />
        </div>

        {/* Column Headers */}
        <div 
          className="grid grid-cols-[40px_1fr_1fr_1fr] gap-0 px-4 py-3 text-sm text-white/60"
          style={{ background: 'rgba(30, 30, 46, 0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div></div>
          <div className="px-4" style={{ fontWeight: 'var(--font-weight-medium)' }}>Task</div>
          <div className="px-4" style={{ fontWeight: 'var(--font-weight-medium)' }}>Before</div>
          <div className="px-4" style={{ fontWeight: 'var(--font-weight-medium)' }}>After</div>
        </div>

        {/* Board Items */}
        <div className="rounded-b-xl overflow-hidden" style={{ background: 'rgba(22, 22, 35, 0.9)' }}>
          
          {/* ============ ITEM 1: AGENT CALLS ============ */}
          <div 
            className="grid grid-cols-[40px_1fr_1fr_1fr] gap-0 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.05)', minHeight: '120px' }}
          >
            {/* Color bar */}
            <div className="flex items-stretch">
              <div className="w-1.5 rounded-l" style={{ background: itemColors[0] }} />
            </div>
            
            {/* Task name */}
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <img src={agentsLogo} alt="Agent" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <p className="text-white" style={{ fontWeight: 'var(--font-weight-medium)' }}>Lead Calls</p>
                <p className="text-white/40 text-xs">Follow up with prospects</p>
              </div>
            </div>
            
            {/* Before */}
            <div className="flex items-center px-4 py-4" style={{ opacity: 1 - (sliderPosition / 200) }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Calling manually...</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-red-400" />
                    <span className="text-red-400 text-xs">4+ hours daily</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* After */}
            <div className="flex items-center px-4 py-4" style={{ opacity: 0.3 + (sliderPosition / 150) }}>
              <AnimatePresence>
                {showAfter ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3"
                  >
                    {/* Agent calling */}
                    <div className="relative">
                      <img 
                        src={agentImage} 
                        alt="Agent" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                      />
                      <motion.div 
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <PhoneCall className="w-3 h-3 text-white" />
                      </motion.div>
                    </div>
                    
                    {/* Lead being called */}
                    <div className="flex items-center">
                      <ArrowRight className="w-4 h-4 text-green-400 mx-2" />
                      <img 
                        src={leadImages[0]} 
                        alt="Lead" 
                        className="w-10 h-10 rounded-full object-cover border-2 border-indigo-400"
                      />
                    </div>
                    
                    {/* Call status */}
                    <div className="ml-2">
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-2 h-2 rounded-full bg-green-500"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <span className="text-green-400 text-sm">In call</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Mic className="w-3 h-3 text-white/40" />
                        <span className="text-white/60 text-xs">{formatTime(callDuration)}</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-white/30 text-sm">Slide to reveal →</div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ============ ITEM 2: VIBE APPS ============ */}
          <div 
            className="grid grid-cols-[40px_1fr_1fr_1fr] gap-0 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.05)', minHeight: '120px' }}
          >
            <div className="flex items-stretch">
              <div className="w-1.5 rounded-l" style={{ background: itemColors[1] }} />
            </div>
            
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <img src={vibeLogo} alt="Vibe" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <p className="text-white" style={{ fontWeight: 'var(--font-weight-medium)' }}>Tools & Apps</p>
                <p className="text-white/40 text-xs">Consolidate work tools</p>
              </div>
            </div>
            
            {/* Before - Scattered apps */}
            <div className="flex items-center px-4 py-4" style={{ opacity: 1 - (sliderPosition / 200) }}>
              <div className="flex flex-wrap gap-1.5 max-w-[160px]">
                {scatteredApps.map((app, i) => (
                  <motion.div
                    key={i}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ background: app.color }}
                    animate={showAfter ? { 
                      x: i < appMergeStep ? 100 : 0,
                      opacity: i < appMergeStep ? 0 : 1,
                      scale: i < appMergeStep ? 0.5 : 1,
                    } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    {app.icon}
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* After - Vibe apps */}
            <div className="flex items-center px-4 py-4" style={{ opacity: 0.3 + (sliderPosition / 150) }}>
              <AnimatePresence>
                {showAfter ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2"
                  >
                    {vibeApps.map((app, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: appMergeStep > i * 2 ? 1 : 0,
                          opacity: appMergeStep > i * 2 ? 1 : 0,
                        }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="px-3 py-2 rounded-lg"
                        style={{ 
                          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(234, 88, 12, 0.2))',
                          border: '1px solid rgba(249, 115, 22, 0.4)',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span>{app.icon}</span>
                          <span className="text-white text-sm">{app.name}</span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-white/30 text-sm">Slide to reveal →</div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ============ ITEM 3: SIDEKICK ============ */}
          <div 
            className="grid grid-cols-[40px_1fr_1fr_1fr] gap-0 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.05)', minHeight: '120px' }}
          >
            <div className="flex items-stretch">
              <div className="w-1.5 rounded-l" style={{ background: itemColors[2] }} />
            </div>
            
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                <img src={sidekickLogo} alt="Sidekick" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <p className="text-white" style={{ fontWeight: 'var(--font-weight-medium)' }}>Get Answers</p>
                <p className="text-white/40 text-xs">Find information fast</p>
              </div>
            </div>
            
            {/* Before */}
            <div className="flex items-center px-4 py-4" style={{ opacity: 1 - (sliderPosition / 200) }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Searching docs...</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-red-400" />
                    <span className="text-red-400 text-xs">30 min average</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* After - Chat */}
            <div className="flex items-center px-4 py-4" style={{ opacity: 0.3 + (sliderPosition / 150) }}>
              <AnimatePresence>
                {showAfter ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col gap-2 w-full max-w-[220px]"
                  >
                    {/* User message */}
                    {typingIndex > 0 && (
                      <div className="flex justify-end">
                        <div className="bg-indigo-600/40 rounded-xl rounded-br-sm px-3 py-1.5 text-xs text-white">
                          {question.slice(0, typingIndex)}
                          {typingIndex === 0 && <img src={sidekickIcon} alt="" className="inline-block w-4 h-4 animate-pulse align-middle" />}
                        </div>
                      </div>
                    )}
                    {/* Sidekick response */}
                    {responseIndex > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2"
                      >
                        <img src={sidekickLogo} alt="" className="w-5 h-5 rounded-full" />
                        <div className="bg-pink-500/30 rounded-xl rounded-bl-sm px-3 py-1.5 text-xs text-white">
                          {answer.slice(0, responseIndex)}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <div className="text-white/30 text-sm">Slide to reveal →</div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ============ ITEM 4: WORKFLOWS ============ */}
          <div 
            className="grid grid-cols-[40px_1fr_1fr_1fr] gap-0"
            style={{ minHeight: '120px' }}
          >
            <div className="flex items-stretch">
              <div className="w-1.5 rounded-l" style={{ background: itemColors[3] }} />
            </div>
            
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <img src={workflowsLogo} alt="Workflows" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <p className="text-white" style={{ fontWeight: 'var(--font-weight-medium)' }}>Automation</p>
                <p className="text-white/40 text-xs">Automate processes</p>
              </div>
            </div>
            
            {/* Before */}
            <div className="flex items-center px-4 py-4" style={{ opacity: 1 - (sliderPosition / 200) }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Waiting for approval...</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-red-400" />
                    <span className="text-red-400 text-xs">Days of delays</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* After - Workflow */}
            <div className="flex items-center px-4 py-4" style={{ opacity: 0.3 + (sliderPosition / 150) }}>
              <AnimatePresence>
                {showAfter ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1"
                  >
                    {['Trigger', 'AI', 'Action', 'Done'].map((step, i) => (
                      <div key={i} className="flex items-center">
                        <motion.div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px]"
                          style={{ 
                            background: workflowStep > i 
                              ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                              : 'rgba(139, 92, 246, 0.2)',
                            border: workflowStep > i ? 'none' : '1px solid rgba(139, 92, 246, 0.3)',
                          }}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: workflowStep > i ? 1 : 0.8 }}
                        >
                          {workflowStep > i ? (
                            <Check className="w-4 h-4 text-white" />
                          ) : (
                            <span className="text-white/50">
                              {i === 0 ? <Zap className="w-3 h-3" /> : 
                               i === 1 ? <Sparkles className="w-3 h-3" /> :
                               i === 2 ? <GitBranch className="w-3 h-3" /> : 
                               <Check className="w-3 h-3" />}
                            </span>
                          )}
                        </motion.div>
                        {i < 3 && (
                          <motion.div 
                            className="w-3 h-0.5"
                            style={{ background: workflowStep > i ? '#22c55e' : 'rgba(139, 92, 246, 0.3)' }}
                          />
                        )}
                      </div>
                    ))}
                    {workflowStep >= 4 && (
                      <motion.span 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-green-400 text-xs ml-2"
                      >
                        Automated!
                      </motion.span>
                    )}
                  </motion.div>
                ) : (
                  <div className="text-white/30 text-sm">Slide to reveal →</div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-sm text-white/40 mb-3">
            <span>Before</span>
            <span>After</span>
          </div>
          <div 
            className="relative h-4 rounded-full cursor-pointer"
            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
            onMouseDown={(e) => {
              handleMouseDown();
              const rect = e.currentTarget.getBoundingClientRect();
              setSliderPosition(((e.clientX - rect.left) / rect.width) * 100);
            }}
            onTouchStart={(e) => {
              setIsDragging(true);
              const rect = e.currentTarget.getBoundingClientRect();
              setSliderPosition(((e.touches[0].clientX - rect.left) / rect.width) * 100);
            }}
          >
            <motion.div 
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ 
                width: `${sliderPosition}%`,
                background: 'linear-gradient(90deg, #ef4444, #8b5cf6, #22c55e)',
              }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center"
              style={{ 
                left: `${sliderPosition}%`,
                transform: 'translate(-50%, -50%)',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 2px 15px rgba(99, 102, 241, 0.5)',
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <GripVertical className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className="mt-12 flex flex-col items-center gap-4"
      >
        <motion.button
          onClick={onExplore}
          className="px-8 py-4 rounded-full text-white text-lg"
          style={{ 
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            fontWeight: 'var(--font-weight-semibold)',
            boxShadow: '0 4px 30px rgba(99, 102, 241, 0.4)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Explore by department
        </motion.button>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown className="w-6 h-6 text-white/40" />
        </motion.div>
      </motion.div>

      {/* Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px]" />
      </div>
    </section>
  );
}
