import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Sparkles, Users, Phone, Check, Mail, PhoneCall, Mic, Plus, AtSign, Calendar, MessageCircle, Network } from 'lucide-react';
import { useInActionSidekickTheme } from '@/contexts/SidekickThemeContext';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';
import sidekickIcon from '@/assets/sidekick-icon.png';
import mondayCrmLogo from '@/assets/monday-crm-logo.png';
import mondayCampaignsLogo from '@/assets/monday-campaigns-logo.png';
import vibeLogo from '@/assets/vibe-logo.png';

interface AnimatedStoryViewProps {
  department: string;
  agents?: Array<{ name: string; value?: string; image?: string }>;
  onClose?: () => void;
}

interface StoryStep {
  id: number;
  title: string;
  description: string;
  duration: number;
}

const storySteps: StoryStep[] = [
  // Campaign flow (steps 0-6)
  { id: 1, title: 'Request & Plan', description: 'You ask Sidekick to create an event campaign', duration: 5000 },
  { id: 2, title: 'Design', description: 'Choose your email creative', duration: 3000 },
  { id: 3, title: 'Sending', description: 'Invitations sent via monday campaigns', duration: 4000 },
  { id: 4, title: 'Responses', description: 'Customers confirm attendance', duration: 3000 },
  { id: 5, title: 'Agent', description: 'AI Agent deployed for follow-ups', duration: 3000 },
  { id: 6, title: 'Calling', description: 'Agent calls remaining leads', duration: 4000 },
  { id: 7, title: 'Complete', description: 'All leads confirmed!', duration: 3000 },
  // Vibe app building flow (steps 7-10)
  { id: 8, title: 'App Request', description: 'User asks for a Check-in app', duration: 4000 },
  { id: 9, title: 'Planning', description: 'Sidekick plans the app structure', duration: 3000 },
  { id: 10, title: 'Building', description: 'Creating app in Vibe', duration: 4000 },
  { id: 11, title: 'App Ready', description: 'Your Check-in app is live!', duration: 3000 },
];

const STAGE_HEIGHT = 560;

// Leads with company names and profile photos
const leadsData = [
  { name: 'Sarah Johnson', company: 'TechCorp', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  { name: 'Mike Chen', company: 'StartupX', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { name: 'Emily Davis', company: 'GlobalInc', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  { name: 'Alex Kim', company: 'MediaHub', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  { name: 'Jordan Lee', company: 'FinanceOne', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' }
];

export function AnimatedStoryView({ department, agents = [] }: AnimatedStoryViewProps) {
  // Get theme and loading state from context
  const { theme: sidekickTheme, isLoading: themeLoading } = useInActionSidekickTheme();
  
  const [currentStep, setCurrentStep] = useState(0);
  const featuredAgent = agents.find(a => a.image) || agents[0];
  const [isPlaying, setIsPlaying] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  
  // Animation states - Campaign
  const [typingIndex, setTypingIndex] = useState(0);
  const [emailsSent, setEmailsSent] = useState(0);
  const [emailConfirmedRows, setEmailConfirmedRows] = useState<number[]>([]);
  const [agentCreationProgress, setAgentCreationProgress] = useState(0);
  const [callMessageIndex, setCallMessageIndex] = useState(0);
  const [showCallResponse, setShowCallResponse] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [finalConfirmedRows, setFinalConfirmedRows] = useState<number[]>([]);

  // Animation states - Vibe App Building
  const [vibeTypingIndex, setVibeTypingIndex] = useState(0);
  const [vibeBuildProgress, setVibeBuildProgress] = useState(0);
  
  // Interactive app state
  const [checkedInGuests, setCheckedInGuests] = useState<number[]>([]);
  const [selectedApp, setSelectedApp] = useState<'checkin' | 'schedule' | 'speakers' | 'networking'>('checkin');
  const [expandedSessions, setExpandedSessions] = useState<number[]>([]);
  const [expandedSpeakers, setExpandedSpeakers] = useState<number[]>([]);
  const [exchangedContacts, setExchangedContacts] = useState<number[]>([]);
  
  // Scroll-triggered apps section visibility
  const [appsVisible, setAppsVisible] = useState(false);
  const appsSectionRef = useRef<HTMLDivElement>(null);
  
  // Vibe section animation states
  const [vibeStoryStep, setVibeStoryStep] = useState(0);
  const [vibeUserTyping, setVibeUserTyping] = useState(0);
  const vibeUserMessage = "Which apps can help me manage my marketing efforts?";

  const userMessage = "Create an event campaign for next week";
  const vibeMessage = "I need a check-in app for my event";
  const callMessage = "Hi! Will you be joining us for the marketing event?";

  // IntersectionObserver for apps section fade-in on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAppsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (appsSectionRef.current) {
      observer.observe(appsSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Vibe section typing animation
  useEffect(() => {
    if (!appsVisible) return;
    if (vibeUserTyping < vibeUserMessage.length) {
      const timer = setTimeout(() => setVibeUserTyping(prev => prev + 1), 35);
      return () => clearTimeout(timer);
    } else if (vibeStoryStep === 0) {
      // Typing done, show response after delay
      setTimeout(() => setVibeStoryStep(1), 400);
    }
  }, [appsVisible, vibeUserTyping, vibeStoryStep]);

  // Vibe section story progression
  useEffect(() => {
    if (vibeStoryStep === 1) {
      // Show apps one by one
      const timer = setTimeout(() => setVibeStoryStep(2), 600);
      return () => clearTimeout(timer);
    }
  }, [vibeStoryStep]);

  // Auto-advance
  useEffect(() => {
    if (!isPlaying || isComplete) return;
    const timer = setTimeout(() => {
      if (currentStep < storySteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsComplete(true);
        setIsPlaying(false);
      }
    }, storySteps[currentStep]?.duration || 4000);
    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, isComplete]);

  // Step 1: Typing
  useEffect(() => {
    if (currentStep < 0 || !isPlaying) return;
    if (typingIndex < userMessage.length) {
      const timer = setTimeout(() => setTypingIndex(prev => prev + 1), 60);
      return () => clearTimeout(timer);
    }
  }, [currentStep, typingIndex, isPlaying]);

  // Step 3 (index 2): Emails sent
  useEffect(() => {
    if (currentStep !== 2 || !isPlaying) return;
    if (emailsSent < 5) {
      const timer = setTimeout(() => setEmailsSent(prev => prev + 1), 700);
      return () => clearTimeout(timer);
    }
  }, [currentStep, emailsSent, isPlaying]);

  // Step 4 (index 3): Email confirmations with names
  useEffect(() => {
    if (currentStep !== 3 || !isPlaying) return;
    [0, 1, 2].forEach((row, idx) => {
      setTimeout(() => setEmailConfirmedRows(prev => prev.includes(row) ? prev : [...prev, row]), 800 * (idx + 1));
    });
  }, [currentStep, isPlaying]);

  // Step 5 (index 4): Agent creation
  useEffect(() => {
    if (currentStep !== 4 || !isPlaying) return;
    if (agentCreationProgress < 100) {
      const timer = setTimeout(() => setAgentCreationProgress(prev => Math.min(prev + 5, 100)), 80);
      return () => clearTimeout(timer);
    }
  }, [currentStep, agentCreationProgress, isPlaying]);

  // Step 6 (index 5): Call message typing
  useEffect(() => {
    if (currentStep !== 5 || !isPlaying) return;
    if (callMessageIndex < callMessage.length) {
      const timer = setTimeout(() => setCallMessageIndex(prev => prev + 1), 50);
      return () => clearTimeout(timer);
    } else if (!showCallResponse) {
      const timer = setTimeout(() => setShowCallResponse(true), 800);
      return () => clearTimeout(timer);
    }
  }, [currentStep, callMessageIndex, showCallResponse, isPlaying]);

  // Step 6 (index 5): Call duration
  useEffect(() => {
    if (currentStep !== 5 || !isPlaying) return;
    const timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [currentStep, isPlaying]);

  // Step 7 (index 6): Final confirmations
  useEffect(() => {
    if (currentStep !== 6 || !isPlaying) return;
    [3, 4].forEach((row, idx) => {
      setTimeout(() => setFinalConfirmedRows(prev => prev.includes(row) ? prev : [...prev, row]), 600 * (idx + 1));
    });
  }, [currentStep, isPlaying]);

  // Step 8 (index 7): Vibe app request - typing
  useEffect(() => {
    if (currentStep !== 7 || !isPlaying) return;
    if (vibeTypingIndex < vibeMessage.length) {
      const timer = setTimeout(() => setVibeTypingIndex(prev => prev + 1), 60);
      return () => clearTimeout(timer);
    }
  }, [currentStep, vibeTypingIndex, isPlaying]);

  // Step 10 (index 9): Vibe app building progress
  useEffect(() => {
    if (currentStep !== 9 || !isPlaying) return;
    if (vibeBuildProgress < 100) {
      const timer = setTimeout(() => setVibeBuildProgress(prev => Math.min(prev + 5, 100)), 150);
      return () => clearTimeout(timer);
    }
  }, [currentStep, vibeBuildProgress, isPlaying]);

  const handlePlayPause = useCallback(() => {
    if (isComplete) {
      setCurrentStep(0);
      setIsComplete(false);
      setIsPlaying(true);
      setTypingIndex(0);
      setEmailsSent(0);
      setEmailConfirmedRows([]);
      setAgentCreationProgress(0);
      setCallMessageIndex(0);
      setShowCallResponse(false);
      setCallDuration(0);
      setFinalConfirmedRows([]);
      setVibeTypingIndex(0);
      setVibeBuildProgress(0);
      setCheckedInGuests([]);
      setSelectedApp('checkin');
    } else {
      setIsPlaying(prev => !prev);
    }
  }, [isComplete]);

  const handleSkip = useCallback(() => {
    if (currentStep < storySteps.length - 1) setCurrentStep(prev => prev + 1);
  }, [currentStep]);

  const handleStepClick = useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex);
    setIsComplete(false);
    setIsPlaying(true);
  }, []);

  const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  // Get lead status based on current step
  const getLeadStatus = (index: number) => {
    // Check if guest is checked in via interactive app
    if (checkedInGuests.includes(index)) {
      return { text: '✓ Checked In', bg: 'rgba(252, 82, 125, 0.3)', color: 'rgb(252, 165, 200)' };
    }
    if (finalConfirmedRows.includes(index) || emailConfirmedRows.includes(index)) {
      return { text: '✓ Attend', bg: 'rgba(34, 197, 94, 0.3)', color: 'rgb(134, 239, 172)' };
    }
    if (emailsSent > index && currentStep >= 2) {
      return { text: 'Invited', bg: 'rgba(99, 102, 241, 0.3)', color: 'rgb(165, 180, 252)' };
    }
    return { text: 'New Lead', bg: 'rgba(107, 114, 128, 0.3)', color: 'rgb(156, 163, 175)' };
  };

  // Define phases mapping with product icons
  const phases = [
    { name: 'Plan', steps: [0, 1], logo: sidekickLogo },
    { name: 'Launch', steps: [2, 3], logo: mondayCampaignsLogo },
    { name: 'Engage', steps: [4, 5, 6], logo: null, usePhoneIcon: true },
    { name: 'Build', steps: [7, 8, 9, 10], logo: vibeLogo },
  ];

  const getCurrentPhase = () => {
    for (let i = 0; i < phases.length; i++) {
      if (phases[i].steps.includes(currentStep)) return i;
    }
    return 0;
  };

  const currentPhase = getCurrentPhase();

  return (
    <div style={{ width: '100%' }}>
      {/* Title */}
      <p className="text-center text-white/60 text-sm mb-4">
        Watch how AI does the marketing work for you
      </p>

      {/* Phase Controls */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="flex items-center gap-1">
          {phases.map((phase, index) => {
            const isActive = index === currentPhase;
            const isCompleted = index < currentPhase || (isComplete && index <= currentPhase);
            const firstStep = phase.steps[0];
            
            return (
              <div key={phase.name} className="flex items-center">
                <button
                  onClick={() => handleStepClick(firstStep)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white' 
                      : isCompleted 
                        ? 'bg-green-600/80 text-white' 
                        : 'bg-white/10 text-white/50 hover:bg-white/20'
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-4 h-4" />
                  ) : phase.logo ? (
                    <img src={phase.logo} alt={phase.name} className="w-5 h-5 rounded object-contain" />
                  ) : phase.usePhoneIcon ? (
                    <PhoneCall className="w-4 h-4" />
                  ) : null}
                  <span className="text-sm font-medium">{phase.name}</span>
                </button>
                {index < phases.length - 1 && (
                  <div className={`w-6 h-0.5 mx-1 ${index < currentPhase ? 'bg-green-500' : 'bg-white/20'}`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="w-px h-6 bg-white/20 mx-2" />
        <button onClick={handlePlayPause} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
          {isComplete ? <RotateCcw className="w-4 h-4 text-white" /> : isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
        </button>
        {!isComplete && (
          <button onClick={handleSkip} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center" disabled={currentStep >= storySteps.length - 1}>
            <SkipForward className="w-3.5 h-3.5 text-white" />
          </button>
        )}
      </div>

      {/* FIXED SIZE STAGE */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: `${STAGE_HEIGHT}px`,
          background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.95), rgba(20, 20, 30, 0.98))',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {/* LEFT COLUMN - CRM Board (55% width) */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: '55%',
            height: `${STAGE_HEIGHT - 40}px`,
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {/* Board Header */}
          <div className="flex items-center gap-2 p-3 border-b border-white/10">
            <img src={mondayCrmLogo} alt="monday CRM" className="w-8 h-8 rounded flex-shrink-0" />
            <div className="flex flex-col flex-1">
              <span className="text-white/60 text-[10px] leading-none">monday</span>
              <span className="text-white font-semibold text-sm leading-none">CRM Leads</span>
            </div>
            {/* New App appears in header on step 10 */}
            <AnimatePresence>
              {currentStep === 10 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(252, 82, 125, 0.2), rgba(255, 132, 228, 0.2))',
                    border: '1px solid rgba(252, 82, 125, 0.4)',
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #FC527D 0%, #FF84E4 100%)' }}
                  >
                    <Users className="w-4 h-4 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-white font-semibold text-xs">Check-in</p>
                    <p className="text-green-400 text-[9px] flex items-center gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-green-400"></span>
                      Live
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Board Rows */}
          <div className="p-3 space-y-2.5">
            {leadsData.map((lead, index) => {
              const status = getLeadStatus(index);
              const isConfirmed = emailConfirmedRows.includes(index) || finalConfirmedRows.includes(index);
              const isInvited = emailsSent > index && currentStep >= 2 && !isConfirmed;
              const hasEmail = emailsSent > index && currentStep >= 2;
              
              return (
                <motion.div
                  key={lead.name}
                  className="h-14 rounded-xl flex items-center px-4 gap-3"
                  style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                  animate={{
                    borderColor: isConfirmed ? 'rgba(34, 197, 94, 0.6)' : isInvited ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                    boxShadow: isConfirmed ? '0 0 20px rgba(34, 197, 94, 0.3)' : isInvited ? '0 0 15px rgba(99, 102, 241, 0.2)' : 'none',
                    scale: isConfirmed ? [1, 1.02, 1] : 1
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Profile photo - larger */}
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/20">
                    <img src={lead.image} alt={lead.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-medium block truncate text-base">{lead.name}</span>
                    <span className="text-white/50 text-xs">{lead.company}</span>
                  </div>
                  {/* Gmail-style email icon */}
                  <AnimatePresence>
                    {hasEmail && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-7 h-7 rounded flex items-center justify-center bg-white border border-gray-200 flex-shrink-0"
                      >
                        <Mail className="w-4 h-4 text-red-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.div
                    className="h-6 px-3 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                    animate={{ 
                      backgroundColor: status.bg, 
                      color: status.color,
                      scale: isConfirmed ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    {status.text}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Agent Panel - Virtual Coworker at bottom of board */}
          <AnimatePresence>
            {currentStep >= 4 && currentStep !== 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                style={{ 
                  position: 'absolute', 
                  left: '12px',
                  right: '12px', 
                  bottom: '12px',
                  zIndex: 10
                }}
              >
                <motion.div 
                  animate={currentStep === 4 && agentCreationProgress < 100 ? { scale: [1, 1.01, 1] } : {}} 
                  transition={{ repeat: currentStep === 4 ? Infinity : 0, duration: 1.5 }}
                  className="p-3 rounded-xl flex items-center gap-3"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.95), rgba(139, 92, 246, 0.95))',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.5)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                    style={{ 
                      border: '2px solid rgba(255, 255, 255, 0.5)',
                      boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
                    }}
                  >
                    {featuredAgent?.image ? (
                      <img src={featuredAgent.image} alt={featuredAgent.name} className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold">{featuredAgent?.name || 'Lead Agent'}</p>
                    <p className="text-white/70 text-xs">
                      {currentStep === 4 && agentCreationProgress < 100 ? 'Setting up...' : 'Ready to call'}
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    currentStep >= 6 ? 'bg-green-500 text-white' : 'bg-white/20 text-white'
                  }`}>
                    {currentStep >= 6 ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3" /> Done
                      </span>
                    ) : agentCreationProgress < 100 ? `${agentCreationProgress}%` : 'Ready'}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CALL POPUP - Dramatic full overlay on board during step 6 (index 5) */}
          <AnimatePresence>
            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  background: 'linear-gradient(135deg, rgba(10, 10, 20, 0.98), rgba(20, 30, 40, 0.98))',
                  borderRadius: '12px',
                  boxShadow: '0 0 50px rgba(34, 197, 94, 0.4), inset 0 0 100px rgba(34, 197, 94, 0.1)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '2px solid rgba(34, 197, 94, 0.5)',
                }}
              >
                {/* Call Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center"
                      style={{ boxShadow: '0 0 25px rgba(34, 197, 94, 0.6)' }}
                    >
                      <PhoneCall className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <span className="text-white font-bold text-lg">Active Call</span>
                      <div className="text-green-400 text-sm flex items-center gap-2">
                        <motion.span 
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-2 h-2 rounded-full bg-green-400"
                        />
                        Connected to Alex Kim
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-white/70 text-xs">Duration</span>
                    <p className="text-white text-xl font-mono font-bold">{formatDuration(callDuration)}</p>
                  </div>
                </div>

                {/* Call Participants - Centered */}
                <div className="flex items-center justify-center gap-10 py-8 flex-1">
                  <div className="text-center">
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-20 h-20 rounded-full overflow-hidden border-3 border-indigo-500 mx-auto mb-2" 
                      style={{ boxShadow: '0 0 25px rgba(99, 102, 241, 0.6)' }}
                    >
                      {featuredAgent?.image ? (
                        <img src={featuredAgent.image} alt="" className="w-full h-full object-cover object-top" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><Users className="w-8 h-8 text-white" /></div>
                      )}
                    </motion.div>
                    <p className="text-white font-semibold">{featuredAgent?.name || 'Lead Agent'}</p>
                    <p className="text-indigo-400 text-xs">AI Agent</p>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center"
                    style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.7)' }}
                  >
                    <Phone className="w-7 h-7 text-white" />
                  </motion.div>
                  
                  <div className="text-center">
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                      className="w-20 h-20 rounded-full border-3 border-pink-500 mx-auto mb-2 bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center" 
                      style={{ boxShadow: '0 0 25px rgba(236, 72, 153, 0.6)' }}
                    >
                      <span className="text-white font-bold text-2xl">AK</span>
                    </motion.div>
                    <p className="text-white font-semibold">Alex Kim</p>
                    <p className="text-pink-400 text-xs">Lead</p>
                  </div>
                </div>

                {/* Call Conversation - Larger */}
                <div className="space-y-3 mt-auto">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {featuredAgent?.image ? <img src={featuredAgent.image} alt="" className="w-full h-full object-cover object-top" /> : <Users className="w-4 h-4 text-white" />}
                    </div>
                    <div className="bg-indigo-600/40 rounded-xl rounded-tl-sm px-4 py-2.5 max-w-[80%]">
                      <p className="text-white text-sm">{callMessage.slice(0, callMessageIndex)}{callMessageIndex === 0 && <img src={sidekickIcon} alt="" className="inline-block w-4 h-4 animate-pulse align-middle" />}</p>
                    </div>
                  </div>
                  {showCallResponse && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="flex gap-3 justify-end"
                    >
                      <div className="bg-pink-500/30 rounded-xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                        <p className="text-white text-sm">Yes, I'll be there! 🎉</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">AK</div>
                    </motion.div>
                  )}
                  {showCallResponse && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex justify-center pt-2"
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="bg-green-500/30 border-2 border-green-500/50 rounded-full px-5 py-2 flex items-center gap-2"
                        style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' }}
                      >
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 text-base font-semibold">Confirmed!</span>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vibe Editor Preview - for steps 7-9 only */}
          <AnimatePresence>
            {currentStep >= 7 && currentStep <= 9 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  background: 'linear-gradient(135deg, rgba(20, 15, 30, 0.98), rgba(30, 20, 40, 0.98))',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Vibe Editor Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-white/10 mb-4">
                  <img src={vibeLogo} alt="Vibe" className="w-10 h-10 rounded-xl" />
                  <div>
                    <p className="text-white font-bold text-sm">Vibe</p>
                    <p className="text-white/50 text-xs">App Builder</p>
                  </div>
                </div>

                {/* App Preview */}
                <div className="flex-1 rounded-xl border p-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', borderColor: sidekickTheme.cardBorder }}>
                  <div className="rounded-lg p-3 mb-3" style={{ background: sidekickTheme.cardBackground }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-semibold text-sm">Event Check-in</span>
                    </div>
                  </div>

                  {/* Building animation for step 9 */}
                  {currentStep === 9 && (
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {['QR Scanner', 'Guest List', 'Counter'].map((component, idx) => (
                        <motion.div
                          key={component}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: vibeBuildProgress > idx * 30 ? 1 : 0.3,
                            x: vibeBuildProgress > idx * 30 ? 0 : -20
                          }}
                          className="rounded-lg p-2 flex items-center gap-2"
                          style={{ background: sidekickTheme.cardBackground }}
                        >
                          <div className="w-6 h-6 rounded bg-purple-500/30 flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-purple-300" />
                          </div>
                          <span className="text-white/70 text-xs">{component}</span>
                          {vibeBuildProgress > idx * 30 + 25 && (
                            <Check className="w-3 h-3 text-green-400 ml-auto" />
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Final app preview for step 10 */}
                  {currentStep === 10 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-2"
                    >
                      {leadsData.map((lead, idx) => (
                        <motion.div
                          key={lead.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="rounded-lg p-2 flex items-center gap-2"
                          style={{ background: sidekickTheme.cardBackground }}
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden border" style={{ borderColor: sidekickTheme.cardBorder }}>
                            <img src={lead.image} alt={lead.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-white text-xs flex-1">{lead.name}</span>
                          <div className="px-2 py-1 rounded-full text-white/50 text-[10px]" style={{ background: sidekickTheme.cardBackground }}>
                            Waiting
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN - Sidekick (38% width, single message per step) */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '38%',
            height: `${STAGE_HEIGHT - 40}px`,
            overflow: 'hidden',
          }}
        >
          {/* Gradient border wrapper */}
          <div 
            className="h-full rounded-2xl overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, #ec4899, #a855f7, #f59e0b)',
              padding: '3px',
              boxShadow: '0 0 50px rgba(236, 72, 153, 0.3)'
            }}
          >
            {/* Inner content with themed glass */}
            <div 
              className="h-full rounded-[14px] p-5 flex flex-col"
              style={{ 
                background: sidekickTheme.panelBackground,
                backdropFilter: `blur(${sidekickTheme.panelBackdropBlur})`,
                WebkitBackdropFilter: `blur(${sidekickTheme.panelBackdropBlur})`,
                boxShadow: sidekickTheme.panelShadow,
              }}
            >
              {/* Sidekick Header - monday sidekick branding */}
              <div 
                className="flex items-center gap-3 mb-4 pb-3"
                style={{ borderBottom: `1px solid ${sidekickTheme.headerBorderColor}` }}
              >
                <div className="w-10 h-10 flex-shrink-0">
                  {sidekickTheme.headerLogo ? (
                    <img src={sidekickTheme.headerLogo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <img src={sidekickLogo} alt="Sidekick" className="w-full h-full object-contain" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span style={{ color: sidekickTheme.headerPrimaryText }} className="font-bold text-lg">{sidekickTheme.headerPrimaryLabel || 'monday'}</span>
                  <span style={{ color: sidekickTheme.headerSecondaryText }} className="font-medium text-lg">{sidekickTheme.headerSecondaryLabel || 'sidekick'}</span>
                </div>
              </div>

              {/* Single Message Per Step - No Scrolling */}
              <div className="flex-1 flex flex-col justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  {/* Step 0: Request & Plan (combined) */}
                  {currentStep === 0 && (
                    <motion.div 
                      key="step0"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-3"
                    >
                      {/* User message at top */}
                      <div className="flex justify-end">
                        <div 
                          className="rounded-2xl rounded-br-md px-3 py-2 max-w-[85%] shadow-lg"
                          style={{ background: sidekickTheme.userMessageBg }}
                        >
                          <p style={{ color: sidekickTheme.userMessageText }} className="text-sm">
                            {userMessage.slice(0, typingIndex)}
                            {typingIndex < userMessage.length && <img src={sidekickIcon} alt="" className="inline-block w-4 h-4 animate-pulse align-middle" />}
                          </p>
                        </div>
                      </div>
                      {/* Plan appears after typing */}
                      {typingIndex >= userMessage.length && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="backdrop-blur-sm rounded-2xl px-3 py-3"
                          style={{ 
                            background: sidekickTheme.cardBackground,
                            border: `1px solid ${sidekickTheme.cardBorder}`,
                            backdropFilter: `blur(${sidekickTheme.cardBackdropBlur})`,
                          }}
                        >
                          <p style={{ color: sidekickTheme.primaryText }} className="text-sm font-medium mb-2">Perfect! Here's my plan:</p>
                          <ul className="text-xs space-y-1.5">
                            <li className="flex items-center gap-2 p-1.5 rounded-lg" style={{ background: sidekickTheme.cardBackground }}>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `${sidekickTheme.amberAccent}30` }}>
                                <Mail className="w-3 h-3" style={{ color: sidekickTheme.amberAccent }} />
                              </div>
                              <span style={{ color: sidekickTheme.secondaryText }}>Send email invitations</span>
                            </li>
                            <li className="flex items-center gap-2 p-1.5 rounded-lg" style={{ background: sidekickTheme.cardBackground }}>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `${sidekickTheme.purpleAccent}30` }}>
                                <Phone className="w-3 h-3" style={{ color: sidekickTheme.purpleAccent }} />
                              </div>
                              <span style={{ color: sidekickTheme.secondaryText }}>Create AI agent for calls</span>
                            </li>
                            <li className="flex items-center gap-2 p-1.5 rounded-lg" style={{ background: sidekickTheme.cardBackground }}>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `${sidekickTheme.indigoAccent}30` }}>
                                <Users className="w-3 h-3" style={{ color: sidekickTheme.indigoAccent }} />
                              </div>
                              <span style={{ color: sidekickTheme.secondaryText }}>Track RSVPs in CRM</span>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 1: Email Design Selection */}
                  {currentStep === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div 
                      className="backdrop-blur-sm rounded-2xl px-4 py-4"
                      style={{ 
                        background: sidekickTheme.cardBackground,
                        border: `1px solid ${sidekickTheme.cardBorder}`,
                        backdropFilter: `blur(${sidekickTheme.cardBackdropBlur})`,
                      }}
                    >
                        <p style={{ color: sidekickTheme.primaryText }} className="text-base font-medium mb-3">Choose your email design:</p>
                        <div className="space-y-2">
                          {/* Minimalist */}
                          <div className="p-2.5 rounded-xl border-2 border-white/20 cursor-pointer hover:border-white/40 transition-all flex items-center gap-3 bg-white/5">
                            <div className="w-14 h-10 rounded-lg bg-white/20 border border-white/30 flex flex-col items-center justify-center flex-shrink-0">
                              <div className="w-7 h-0.5 bg-white/50 rounded mb-1"></div>
                              <div className="w-4 h-0.5 bg-white/30 rounded"></div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">Minimalist</p>
                              <p className="text-xs text-white/50">Clean and simple</p>
                            </div>
                          </div>
                          {/* Colorful - Selected */}
                          <motion.div 
                            className="p-2.5 rounded-xl border-2 border-indigo-400 bg-indigo-500/20 cursor-pointer flex items-center gap-3"
                            animate={{ boxShadow: ['0 0 0px rgba(99, 102, 241, 0)', '0 0 15px rgba(99, 102, 241, 0.4)', '0 0 0px rgba(99, 102, 241, 0)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <div className="w-14 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-white">Colorful</p>
                              <p className="text-xs text-indigo-300">Eye-catching design</p>
                            </div>
                            <Check className="w-5 h-5 text-indigo-300" />
                          </motion.div>
                          {/* Formal */}
                          <div className="p-2.5 rounded-xl border-2 border-white/20 cursor-pointer hover:border-white/40 transition-all flex items-center gap-3 bg-white/5">
                            <div className="w-14 h-10 rounded-lg bg-slate-800 flex flex-col items-center justify-center flex-shrink-0">
                              <div className="w-5 h-0.5 bg-amber-400 rounded mb-1"></div>
                              <div className="w-7 h-0.5 bg-white/70 rounded"></div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">Formal</p>
                              <p className="text-xs text-white/50">Professional look</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Sending via monday campaigns */}
                  {currentStep === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="bg-indigo-500/20 backdrop-blur-sm rounded-2xl p-4 border border-indigo-400/30">
                        <div className="flex items-center gap-3 mb-4">
                          <img src={mondayCampaignsLogo} alt="monday campaigns" className="w-10 h-10 rounded-lg" />
                          <div className="flex-1">
                            <p className="text-base font-bold text-white">monday campaigns</p>
                            <p className="text-sm text-indigo-300">
                              {emailsSent >= 5 ? 'All VIP invites sent!' : 'Sending VIP invites...'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          {emailsSent < 5 && (
                            <motion.div 
                              animate={{ scale: [1, 1.4, 1] }} 
                              transition={{ repeat: Infinity, duration: 0.8 }}
                              className="w-3 h-3 rounded-full bg-green-400" 
                            />
                          )}
                          {emailsSent >= 5 && <Check className="w-5 h-5 text-green-400" />}
                          <span className={`text-lg font-bold ${emailsSent >= 5 ? 'text-green-400' : 'text-indigo-300'}`}>
                            {emailsSent}/5 sent
                          </span>
                        </div>
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-indigo-400 to-purple-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${(emailsSent / 5) * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        {emailsSent >= 5 && (
                          <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-green-400 text-sm mt-3 flex items-center gap-2 font-medium"
                          >
                            <Check className="w-4 h-4" /> Campaign delivered!
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Responses with names and avatars */}
                  {currentStep === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div 
                        className="backdrop-blur-sm rounded-2xl px-4 py-4"
                        style={{ 
                          background: sidekickTheme.cardBackground,
                          border: `1px solid ${sidekickTheme.cardBorder}`,
                          backdropFilter: `blur(${sidekickTheme.cardBackdropBlur})`,
                        }}
                      >
                        <p style={{ color: sidekickTheme.primaryText }} className="text-sm font-medium mb-3">Responses coming in:</p>
                        <div className="space-y-2">
                          {leadsData.slice(0, 3).map((lead, idx) => (
                            <motion.div
                              key={lead.name}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ 
                                opacity: emailConfirmedRows.includes(idx) ? 1 : 0.3,
                                x: emailConfirmedRows.includes(idx) ? 0 : 20
                              }}
                              className="flex items-center gap-2 p-2 rounded-lg bg-green-500/20 border border-green-400/30"
                            >
                              <div className="w-7 h-7 rounded-full overflow-hidden border border-white/30">
                                <img src={lead.image} alt={lead.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-sm text-white flex-1">{lead.name}</span>
                              {emailConfirmedRows.includes(idx) && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="flex items-center gap-1 text-green-400"
                                >
                                  <Check className="w-4 h-4" />
                                  <span className="text-xs font-medium">Confirmed</span>
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                        <div className="mt-3 bg-amber-500/20 rounded-lg p-2 border border-amber-400/30">
                          <p className="text-amber-300 text-xs text-center">
                            {5 - emailConfirmedRows.length} leads need follow-up
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Creating agent */}
                  {currentStep === 4 && (
                    <motion.div 
                      key="step4"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="bg-purple-500/20 backdrop-blur-sm rounded-2xl px-4 py-4 border border-purple-400/30">
                        <div className="flex items-center gap-4 mb-4">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
                          >
                            <Sparkles className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <p className="text-base font-bold text-white">Creating AI Agent</p>
                            <p className="text-purple-300 text-sm">for follow-up calls</p>
                          </div>
                        </div>
                        {agentCreationProgress >= 100 ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-500/20 rounded-xl p-3 border border-green-400/30"
                          >
                            <p className="text-green-400 font-semibold text-center flex items-center justify-center gap-2">
                              <Check className="w-5 h-5" /> {featuredAgent?.name || 'Lead Agent'} ready!
                            </p>
                          </motion.div>
                        ) : (
                          <>
                            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden mb-2">
                              <motion.div 
                                className="h-full bg-gradient-to-r from-indigo-400 to-purple-400"
                                style={{ width: `${agentCreationProgress}%` }}
                              />
                            </div>
                            <p className="text-white/60 text-sm text-center">{agentCreationProgress}%</p>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Agent calling */}
                  {currentStep === 5 && (
                    <motion.div 
                      key="step5"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl px-4 py-4 border border-green-400/30">
                        <div className="flex items-center gap-4 mb-3">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center"
                            style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}
                          >
                            <PhoneCall className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <p className="text-base font-bold text-white">Agent Calling</p>
                            <p className="text-green-400 text-sm flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                              Live call in progress
                            </p>
                          </div>
                        </div>
                        {showCallResponse && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-xl p-2.5 border border-green-400/30"
                            style={{ background: sidekickTheme.cardBackground }}
                          >
                            <p className="text-green-400 font-semibold text-center flex items-center justify-center gap-2 text-sm">
                              <Check className="w-4 h-4" /> Alex Kim confirmed!
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 6: Campaign Complete */}
                  {currentStep === 6 && (
                    <motion.div 
                      key="step6"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl px-4 py-4 border border-green-400/30">
                        <div className="text-center mb-3">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                            className="w-12 h-12 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-2"
                          >
                            <Check className="w-7 h-7 text-white" />
                          </motion.div>
                          <p className="text-lg font-bold text-white">Campaign Complete</p>
                          <p className="text-white/60 text-sm">All leads confirmed!</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-2 rounded-xl border" style={{ background: sidekickTheme.cardBackground, borderColor: sidekickTheme.cardBorder }}>
                            <div className="text-lg font-bold text-green-400">5</div>
                            <div className="text-white/50 text-[9px] uppercase">Invites</div>
                          </div>
                          <div className="text-center p-2 rounded-xl border" style={{ background: sidekickTheme.cardBackground, borderColor: sidekickTheme.cardBorder }}>
                            <div className="text-lg font-bold text-green-400">5</div>
                            <div className="text-white/50 text-[9px] uppercase">Confirmed</div>
                          </div>
                          <div className="text-center p-2 rounded-xl border" style={{ background: sidekickTheme.cardBackground, borderColor: sidekickTheme.cardBorder }}>
                            <div className="text-lg font-bold text-green-400">100%</div>
                            <div className="text-white/50 text-[9px] uppercase">Success</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 7: Vibe App Request - User typing in Hebrew */}
                  {currentStep === 7 && (
                    <motion.div 
                      key="step7"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-3"
                    >
                      {/* User message */}
                      <div className="flex justify-end">
                        <div 
                          className="rounded-2xl rounded-br-md px-3 py-2 max-w-[85%] shadow-lg"
                          style={{ background: sidekickTheme.userMessageBg }}
                        >
                          <p style={{ color: sidekickTheme.userMessageText }} className="text-sm">
                            {vibeMessage.slice(0, vibeTypingIndex)}
                            {vibeTypingIndex === 0 && <img src={sidekickIcon} alt="" className="inline-block w-4 h-4 animate-pulse align-middle" />}
                          </p>
                        </div>
                      </div>
                      {/* Sidekick response after typing */}
                      {vibeTypingIndex >= vibeMessage.length && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="backdrop-blur-sm rounded-2xl px-3 py-3"
                          style={{ 
                            background: sidekickTheme.cardBackground,
                            border: `1px solid ${sidekickTheme.cardBorder}`,
                            backdropFilter: `blur(${sidekickTheme.cardBackdropBlur})`,
                          }}
                        >
                          <p style={{ color: sidekickTheme.primaryText }} className="text-sm font-medium">No problem! I'll create a Check-in app for your event.</p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 8: Planning the app */}
                  {currentStep === 8 && (
                    <motion.div 
                      key="step8"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div 
                        className="backdrop-blur-sm rounded-2xl px-4 py-4"
                        style={{ 
                          background: sidekickTheme.cardBackground,
                          border: `1px solid ${sidekickTheme.cardBorder}`,
                          backdropFilter: `blur(${sidekickTheme.cardBackdropBlur})`,
                        }}
                      >
                        <p style={{ color: sidekickTheme.primaryText }} className="text-sm font-medium mb-3">Planning your app:</p>
                        <ul className="text-white/80 text-xs space-y-2">
                          <motion.li 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2 p-2 rounded-lg"
                            style={{ background: sidekickTheme.cardBackground }}
                          >
                            <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center">
                              <Users className="w-3 h-3 text-purple-300" />
                            </div>
                            <span>Guest list from CRM</span>
                            <Check className="w-3 h-3 text-green-400 ml-auto" />
                          </motion.li>
                          <motion.li 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center gap-2 p-2 rounded-lg"
                            style={{ background: sidekickTheme.cardBackground }}
                          >
                            <div className="w-6 h-6 rounded-full bg-pink-500/30 flex items-center justify-center">
                              <Sparkles className="w-3 h-3 text-pink-300" />
                            </div>
                            <span>QR code scanner</span>
                            <Check className="w-3 h-3 text-green-400 ml-auto" />
                          </motion.li>
                          <motion.li 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex items-center gap-2 p-2 rounded-lg"
                            style={{ background: sidekickTheme.cardBackground }}
                          >
                            <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center">
                              <Check className="w-3 h-3 text-indigo-300" />
                            </div>
                            <span>Real-time counter</span>
                            <Check className="w-3 h-3 text-green-400 ml-auto" />
                          </motion.li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 9: Building with Vibe */}
                  {currentStep === 9 && (
                    <motion.div 
                      key="step9"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl px-4 py-4 border border-purple-400/30">
                        <div className="flex items-center gap-3 mb-4">
                          {/* Vibe Logo */}
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-12 h-12 rounded-xl overflow-hidden"
                          >
                            <img src={vibeLogo} alt="Vibe" className="w-full h-full object-cover" />
                          </motion.div>
                          <div>
                            <p className="text-white font-bold text-base">Building in Vibe</p>
                            <p className="text-purple-300 text-xs">Creating your app...</p>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-2">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                            style={{ width: `${vibeBuildProgress}%` }}
                          />
                        </div>
                        <p className="text-white/60 text-sm text-center">{vibeBuildProgress}%</p>
                        {vibeBuildProgress >= 100 && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-green-400 text-sm mt-2 text-center flex items-center justify-center gap-1"
                          >
                            <Check className="w-4 h-4" /> Build complete!
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 10: App Ready */}
                  {currentStep === 10 && (
                    <motion.div 
                      key="step10"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl px-4 py-4 border border-green-400/30">
                        <div className="text-center mb-3">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                            className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-2"
                            style={{ background: 'linear-gradient(135deg, #FC527D 0%, #FF84E4 100%)' }}
                          >
                            <Users className="w-7 h-7 text-white" />
                          </motion.div>
                          <p className="text-lg font-bold text-white">Check-in App Ready!</p>
                          <p className="text-white/60 text-sm">Your app is live</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-center p-2 rounded-xl border" style={{ background: sidekickTheme.cardBackground, borderColor: sidekickTheme.cardBorder }}>
                            <div className="text-lg font-bold text-purple-300">5</div>
                            <div className="text-white/50 text-[9px] uppercase">Expected</div>
                          </div>
                          <div className="text-center p-2 rounded-xl border" style={{ background: sidekickTheme.cardBackground, borderColor: sidekickTheme.cardBorder }}>
                            <div className="text-lg font-bold text-green-400">0</div>
                            <div className="text-white/50 text-[9px] uppercase">Checked In</div>
                          </div>
                        </div>
                        <p className="text-center text-green-400 text-xs mt-3">Try the app below!</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input Area - Dark glass style */}
              <div 
                className="mt-4 rounded-xl p-3 flex items-center gap-2"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <span className="text-white/40 text-sm flex-1">Tell sidekick what you want to do...</span>
                <div className="flex items-center gap-2">
                  <AtSign className="w-4 h-4 text-white/40" />
                  <Plus className="w-4 h-4 text-white/40" />
                  <Mic className="w-4 h-4 text-white/40" />
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

      {/* Bottom text */}
      <div className="text-center mt-4">
        <p className="text-white/40 text-sm">{storySteps[currentStep]?.description}</p>
      </div>

      {/* Apps Section - Sidekick left, Vibe right - Always visible, fade-in on scroll */}
      <div ref={appsSectionRef} className="mt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: appsVisible ? 1 : 0, y: appsVisible ? 0 : 30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Section Title */}
          <div className="text-center mb-8">
            <p className="text-white/60 text-sm mb-2">Build any app for your {department} team</p>
            <h3 className="text-2xl md:text-3xl text-white" style={{ fontWeight: 'var(--font-weight-bold)' }}>
              Create apps with Vibe in seconds
            </h3>
          </div>

          <div className="flex gap-6 items-stretch">
              {/* Left Side - Sidekick */}
              <div className="w-[35%] flex">
                <div 
                  className="flex-1 rounded-2xl"
                  style={{ 
                    background: 'linear-gradient(135deg, #ec4899, #a855f7, #f59e0b)',
                    padding: '3px',
                  }}
                >
                  <div 
                    className="h-full rounded-[13px] p-5 flex flex-col"
                    style={{ 
                      background: 'linear-gradient(145deg, rgba(45, 45, 55, 0.95), rgba(35, 35, 45, 0.98))',
                    }}
                  >
                    {/* Sidekick Header */}
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                      {sidekickTheme.headerLogo ? (
                        <img src={sidekickTheme.headerLogo} alt="Logo" className="w-10 h-10 object-contain" />
                      ) : (
                        <img src={sidekickLogo} alt="Sidekick" className="w-10 h-10 object-contain" />
                      )}
                      <div className="flex items-center gap-1">
                        <span className="text-white font-bold text-lg">{sidekickTheme.headerPrimaryLabel || 'monday'}</span>
                        <span className="text-white/60 font-medium text-lg">{sidekickTheme.headerSecondaryLabel || 'sidekick'}</span>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 flex flex-col gap-4">
                      {/* User Question - Animated typing */}
                      <AnimatePresence>
                        {appsVisible && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-end mt-2"
                          >
                            <div 
                              className="rounded-2xl rounded-br-md px-3 py-2 max-w-[90%]"
                              style={{ background: sidekickTheme.userMessageBg }}
                            >
                              <p style={{ color: sidekickTheme.userMessageText }} className="text-sm">
                                {vibeUserMessage.slice(0, vibeUserTyping)}
                                {vibeUserTyping === 0 && (
                                  <img src={sidekickIcon} alt="" className="inline-block w-4 h-4 animate-pulse align-middle" />
                                )}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Sidekick Response - Animated */}
                      <AnimatePresence>
                        {vibeStoryStep >= 1 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-xl p-4 border"
                            style={{ background: sidekickTheme.cardBackground, borderColor: sidekickTheme.cardBorder }}
                          >
                            <p className="text-white font-medium mb-3">Here are the apps I created for you:</p>
                            <div className="space-y-2">
                              {[
                                { name: 'Event Check-in', icon: Users, color: '#FC527D' },
                                { name: 'Event Schedule', icon: Calendar, color: '#8B5CF6' },
                                { name: 'Speaker Directory', icon: MessageCircle, color: '#F59E0B' },
                                { name: 'Networking', icon: Network, color: '#10B981' },
                              ].map((app, index) => (
                                <motion.div 
                                  key={app.name} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.15 }}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <div 
                                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                                    style={{ background: app.color }}
                                  >
                                    <app.icon className="w-3.5 h-3.5 text-white" />
                                  </div>
                                  <span className="text-white/80">{app.name}</span>
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.15 + 0.3 }}
                                  >
                                    <Check className="w-3.5 h-3.5 text-green-400 ml-auto" />
                                  </motion.div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <AnimatePresence>
                        {vibeStoryStep >= 2 && (
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-white/50 text-xs text-center mt-auto"
                          >
                            Click an app to try it out →
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Vibe Apps */}
              <motion.div 
                initial={{ opacity: 0.3 }}
                animate={{ opacity: vibeStoryStep >= 1 ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
                className="w-[65%] rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.95), rgba(20, 20, 30, 0.98))',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Vibe Header with App Tabs */}
                <div className="flex items-center gap-4 p-4 border-b border-white/10">
                  <img src={vibeLogo} alt="Vibe" className="w-10 h-10 rounded-xl" />
                  <div className="flex-1">
                    <p className="text-white font-bold">Vibe</p>
                    <p className="text-white/50 text-xs">Your event apps</p>
                  </div>
                  {/* App Tabs */}
                  <div className="flex gap-2">
                    {[
                      { id: 'checkin' as const, icon: Users, color: '#FC527D', name: 'Check-in' },
                      { id: 'schedule' as const, icon: Calendar, color: '#8B5CF6', name: 'Schedule' },
                      { id: 'speakers' as const, icon: MessageCircle, color: '#F59E0B', name: 'Speakers' },
                      { id: 'networking' as const, icon: Network, color: '#10B981', name: 'Network' },
                    ].map((app, index) => (
                      <motion.button
                        key={app.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: vibeStoryStep >= 1 ? 1 : 0, scale: vibeStoryStep >= 1 ? 1 : 0.8 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        onClick={() => setSelectedApp(app.id)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          selectedApp === app.id ? 'ring-2 ring-white/50 scale-110' : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{ background: app.color }}
                        title={app.name}
                      >
                        <app.icon className="w-5 h-5 text-white" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* App Content */}
                <div className="p-4 flex-1">
                  <AnimatePresence mode="wait">
                    {/* Event Check-in */}
                    {selectedApp === 'checkin' && (
                      <motion.div
                        key="checkin"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white font-bold text-lg">Event Check-in</h3>
                          <div className="text-sm text-white/50">{checkedInGuests.length}/5 checked in</div>
                        </div>
                        {leadsData.map((lead, index) => {
                          const isCheckedIn = checkedInGuests.includes(index);
                          return (
                            <motion.div
                              key={lead.name}
                              className="flex items-center gap-3 p-3 rounded-xl"
                              style={{
                                background: isCheckedIn ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                border: isCheckedIn ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                                <img src={lead.image} alt={lead.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-medium">{lead.name}</p>
                                <p className="text-white/50 text-xs">{lead.company}</p>
                              </div>
                              {isCheckedIn ? (
                                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                                  <Check className="w-3.5 h-3.5" /> Checked In
                                </div>
                              ) : (
                                <button
                                  onClick={() => setCheckedInGuests(prev => [...prev, index])}
                                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-white"
                                  style={{ background: 'linear-gradient(135deg, #FC527D 0%, #FF84E4 100%)' }}
                                >
                                  Check In
                                </button>
                              )}
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}

                    {/* Event Schedule */}
                    {selectedApp === 'schedule' && (
                      <motion.div
                        key="schedule"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-3"
                      >
                        <h3 className="text-white font-bold text-lg mb-4">Event Schedule</h3>
                        {[
                          { time: '09:00', title: 'Registration & Coffee', duration: '30 min', description: 'Welcome drinks and networking', location: 'Main Lobby', speaker: '' },
                          { time: '09:30', title: 'Opening Keynote', duration: '1 hour', description: 'The Future of AI in Business', location: 'Main Hall', speaker: 'Sarah Johnson' },
                          { time: '10:30', title: 'AI Workshop', duration: '2 hours', description: 'Hands-on workshop on building AI agents', location: 'Room A', speaker: 'Mike Chen' },
                          { time: '12:30', title: 'Networking Lunch', duration: '1 hour', description: 'Catered lunch with industry professionals', location: 'Terrace', speaker: '' },
                        ].map((session, index) => {
                          const isExpanded = expandedSessions.includes(index);
                          return (
                            <motion.div 
                              key={session.time}
                              className="rounded-xl cursor-pointer overflow-hidden"
                              style={{ 
                                background: isExpanded ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)', 
                                border: isExpanded ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)' 
                              }}
                              onClick={() => setExpandedSessions(prev => 
                                isExpanded ? prev.filter(i => i !== index) : [...prev, index]
                              )}
                              layout
                            >
                              <div className="flex items-center gap-4 p-3">
                                <div className="text-purple-400 font-bold text-lg w-16">{session.time}</div>
                                <div className="flex-1">
                                  <p className="text-white font-medium">{session.title}</p>
                                  <p className="text-white/50 text-xs">{session.duration}</p>
                                </div>
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  className="text-white/50"
                                >
                                  ▼
                                </motion.div>
                              </div>
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-3 pb-3 border-t border-white/10"
                                  >
                                    <div className="pt-3 space-y-2">
                                      <p className="text-white/70 text-sm">{session.description}</p>
                                      <div className="flex gap-4 text-xs">
                                        <span className="text-purple-300">📍 {session.location}</span>
                                        {session.speaker && <span className="text-purple-300">🎤 {session.speaker}</span>}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}

                    {/* Speakers */}
                    {selectedApp === 'speakers' && (
                      <motion.div
                        key="speakers"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-3"
                      >
                        <h3 className="text-white font-bold text-lg mb-4">Speaker Directory</h3>
                        {[
                          { ...leadsData[0], role: 'CEO, TechCorp', topic: 'The Future of AI', bio: 'Industry leader with 15+ years experience in tech innovation.' },
                          { ...leadsData[1], role: 'CTO, StartupX', topic: 'Building AI Agents', bio: 'Pioneer in AI agent development and automation systems.' },
                          { ...leadsData[2], role: 'VP Innovation, GlobalInc', topic: 'AI in Enterprise', bio: 'Expert in enterprise AI transformation and strategy.' },
                        ].map((speaker, index) => {
                          const isExpanded = expandedSpeakers.includes(index);
                          return (
                            <motion.div 
                              key={speaker.name}
                              className="rounded-xl overflow-hidden"
                              style={{ 
                                background: isExpanded ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)', 
                                border: isExpanded ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)' 
                              }}
                              layout
                            >
                              <div className="flex items-center gap-3 p-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/50">
                                  <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-white font-medium">{speaker.name}</p>
                                  <p className="text-amber-400 text-xs">Keynote Speaker</p>
                                </div>
                                <button
                                  onClick={() => setExpandedSpeakers(prev => 
                                    isExpanded ? prev.filter(i => i !== index) : [...prev, index]
                                  )}
                                  className="px-3 py-1 rounded-full text-xs font-semibold"
                                  style={{ 
                                    background: isExpanded ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.2)',
                                    color: '#F59E0B'
                                  }}
                                >
                                  {isExpanded ? 'Hide Bio' : 'View Bio'}
                                </button>
                              </div>
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-3 pb-3 border-t border-white/10"
                                  >
                                    <div className="pt-3 space-y-2">
                                      <p className="text-white/70 text-sm">{speaker.bio}</p>
                                      <div className="flex gap-4 text-xs">
                                        <span className="text-amber-300">💼 {speaker.role}</span>
                                        <span className="text-amber-300">🎯 {speaker.topic}</span>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}

                    {/* Networking */}
                    {selectedApp === 'networking' && (
                      <motion.div
                        key="networking"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white font-bold text-lg">Networking</h3>
                          <div className="text-sm text-white/50">{exchangedContacts.length}/5 contacts</div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {leadsData.map((person, index) => {
                            const isExchanged = exchangedContacts.includes(index);
                            return (
                              <motion.div 
                                key={person.name}
                                className="p-3 rounded-xl text-center"
                                style={{ 
                                  background: isExchanged ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)', 
                                  border: isExchanged ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)' 
                                }}
                                layout
                              >
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-green-400/50 mx-auto mb-2">
                                  <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                                </div>
                                <p className="text-white text-sm font-medium truncate">{person.name.split(' ')[0]}</p>
                                <p className="text-green-400 text-xs mb-2">Online</p>
                                {isExchanged ? (
                                  <div className="flex items-center justify-center gap-1 text-green-400 text-xs font-semibold">
                                    <Check className="w-3 h-3" /> Exchanged
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setExchangedContacts(prev => [...prev, index])}
                                    className="px-2 py-1 rounded-full text-xs font-semibold w-full"
                                    style={{ 
                                      background: 'rgba(16, 185, 129, 0.2)',
                                      color: '#10B981'
                                    }}
                                  >
                                    Exchange
                                  </button>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

          {/* Success message when all checked in */}
          {checkedInGuests.length === 5 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center p-4 rounded-xl bg-green-500/20 border border-green-500/30"
            >
              <p className="text-green-400 font-semibold text-lg flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                All guests checked in!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
