import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Sparkles, Users, Phone, Check, Mail, PhoneCall } from 'lucide-react';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';
import mondayCrmLogo from '@/assets/monday-crm-logo.png';
import mondayCampaignsLogo from '@/assets/monday-campaigns-logo.png';

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
  { id: 1, title: 'Campaign Ideas', description: 'Sidekick suggests creative campaigns', duration: 5000 },
  { id: 2, title: 'Campaign Selected', description: 'You choose the perfect campaign', duration: 4000 },
  { id: 3, title: 'Email Campaign', description: 'Sending invites via monday campaigns', duration: 5000 },
  { id: 4, title: 'Customer Responses', description: 'Customers confirm their attendance', duration: 4000 },
  { id: 5, title: 'Agent Creation', description: 'Sidekick deploys an AI agent', duration: 4000 },
  { id: 6, title: 'Agent Calling', description: 'Agent follows up with remaining leads', duration: 6000 },
  { id: 7, title: 'Success!', description: 'Campaign complete - all confirmed!', duration: 5000 },
];

// Fixed dimensions - never changes
const STAGE_HEIGHT = 480;
const COLUMN_GAP = 24;

export function AnimatedStoryView({ agents = [] }: AnimatedStoryViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const featuredAgent = agents.find(a => a.image) || agents[0];
  const [isPlaying, setIsPlaying] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  
  // Animation states
  const [confirmedRows, setConfirmedRows] = useState<number[]>([]);
  const [callCount, setCallCount] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [agentMessageIndex, setAgentMessageIndex] = useState(0);
  const [showCustomerResponse, setShowCustomerResponse] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [emailsSent, setEmailsSent] = useState(0);
  const [emailConfirmedRows, setEmailConfirmedRows] = useState<number[]>([]);
  const [agentCreationProgress, setAgentCreationProgress] = useState(0);

  const userMessage = "I need to create an event campaign for next week";
  const agentCallMessage = "Hi! I'm calling about the marketing event next week. Will you be joining us?";

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
    }, storySteps[currentStep]?.duration || 5000);
    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, isComplete]);

  // Reset states on step change
  useEffect(() => {
    if (currentStep === 0) { setTypingIndex(0); setShowResponse(false); }
    else if (currentStep === 2) { setEmailsSent(0); }
    else if (currentStep === 3) { setEmailConfirmedRows([]); }
    else if (currentStep === 4) { setAgentCreationProgress(0); }
    else if (currentStep === 5) { setCallCount(0); setAgentMessageIndex(0); setShowCustomerResponse(false); setCallDuration(0); }
    else if (currentStep === 6) { setConfirmedRows([]); }
  }, [currentStep]);

  // Step 1: Typing
  useEffect(() => {
    if (currentStep !== 0 || !isPlaying) return;
    if (typingIndex < userMessage.length) {
      const timer = setTimeout(() => setTypingIndex(prev => prev + 1), 50);
      return () => clearTimeout(timer);
    } else if (!showResponse) {
      const timer = setTimeout(() => setShowResponse(true), 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, typingIndex, showResponse, isPlaying]);

  // Step 3: Emails
  useEffect(() => {
    if (currentStep !== 2 || !isPlaying) return;
    if (emailsSent < 5) {
      const timer = setTimeout(() => setEmailsSent(prev => prev + 1), 800);
      return () => clearTimeout(timer);
    }
  }, [currentStep, emailsSent, isPlaying]);

  // Step 4: Email confirmations
  useEffect(() => {
    if (currentStep !== 3 || !isPlaying) return;
    [0, 1, 2].forEach((row, index) => {
      setTimeout(() => setEmailConfirmedRows(prev => [...prev, row]), 800 * (index + 1));
    });
  }, [currentStep, isPlaying]);

  // Step 5: Agent creation
  useEffect(() => {
    if (currentStep !== 4 || !isPlaying) return;
    if (agentCreationProgress < 100) {
      const timer = setTimeout(() => setAgentCreationProgress(prev => Math.min(prev + 3, 100)), 80);
      return () => clearTimeout(timer);
    }
  }, [currentStep, agentCreationProgress, isPlaying]);

  // Step 6: Calls
  useEffect(() => {
    if (currentStep !== 5 || !isPlaying) return;
    if (callCount < 2) {
      const timer = setTimeout(() => setCallCount(prev => Math.min(prev + 1, 2)), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, callCount, isPlaying]);

  useEffect(() => {
    if (currentStep !== 5 || !isPlaying) return;
    if (agentMessageIndex < agentCallMessage.length) {
      const timer = setTimeout(() => setAgentMessageIndex(prev => prev + 1), 40);
      return () => clearTimeout(timer);
    } else if (!showCustomerResponse) {
      const timer = setTimeout(() => setShowCustomerResponse(true), 800);
      return () => clearTimeout(timer);
    }
  }, [currentStep, agentMessageIndex, showCustomerResponse, isPlaying]);

  useEffect(() => {
    if (currentStep !== 5 || !isPlaying) return;
    const timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [currentStep, isPlaying]);

  // Step 7: Final confirmations
  useEffect(() => {
    if (currentStep !== 6 || !isPlaying) return;
    [0, 1, 2, 3, 4].forEach((row, index) => {
      setTimeout(() => setConfirmedRows(prev => [...prev, row]), 400 * (index + 1));
    });
  }, [currentStep, isPlaying]);

  const handlePlayPause = useCallback(() => {
    if (isComplete) {
      setCurrentStep(0);
      setIsComplete(false);
      setIsPlaying(true);
      setConfirmedRows([]);
      setCallCount(0);
      setTypingIndex(0);
      setShowResponse(false);
      setAgentMessageIndex(0);
      setShowCustomerResponse(false);
      setCallDuration(0);
      setEmailsSent(0);
      setEmailConfirmedRows([]);
      setAgentCreationProgress(0);
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatus = (index: number) => {
    if (confirmedRows.includes(index)) return { text: '✓ Attend', bg: 'rgba(34, 197, 94, 0.3)', color: 'rgb(134, 239, 172)' };
    if (emailConfirmedRows.includes(index)) return { text: index === 2 ? 'Maybe' : '✓ Attend', bg: index === 2 ? 'rgba(253, 171, 61, 0.3)' : 'rgba(34, 197, 94, 0.3)', color: index === 2 ? 'rgb(253, 224, 71)' : 'rgb(134, 239, 172)' };
    if (emailsSent > index) return { text: 'Invited', bg: 'rgba(99, 102, 241, 0.3)', color: 'rgb(165, 180, 252)' };
    return { text: 'New Lead', bg: 'rgba(107, 114, 128, 0.3)', color: 'rgb(156, 163, 175)' };
  };

  const leads = ['Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Alex Kim', 'Jordan Lee'];

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl text-white mb-2" style={{ fontWeight: 'var(--font-weight-bold)' }}>
          See your marketing team in action
        </h3>
        <p className="text-white/60 text-lg">Watch how AI handles your campaign from start to finish</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          {storySteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                index === currentStep ? 'bg-indigo-600 text-white' : index < currentStep ? 'bg-green-600 text-white' : 'bg-white/10 text-white/50 hover:bg-white/20'
              }`}
              title={step.title}
            >
              {index < currentStep ? <Check className="w-4 h-4" /> : <span className="text-sm font-medium">{step.id}</span>}
            </button>
          ))}
        </div>
        <div className="w-px h-6 bg-white/20" />
        <button onClick={handlePlayPause} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
          {isComplete ? <RotateCcw className="w-5 h-5 text-white" /> : isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
        </button>
        {!isComplete && (
          <button onClick={handleSkip} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center" disabled={currentStep >= storySteps.length - 1}>
            <SkipForward className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Step Title */}
      <div className="text-center mb-4">
        <span className="text-indigo-400 text-sm font-medium">Step {currentStep + 1}: {storySteps[currentStep]?.title}</span>
      </div>

      {/* FIXED SIZE STAGE - Uses absolute positioning to prevent any size changes */}
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
        {/* LEFT COLUMN - Absolutely positioned */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            width: 'calc(50% - 36px)',
            height: `${STAGE_HEIGHT - 48}px`,
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {/* Board Header */}
          <div className="flex items-center gap-2 p-3 border-b border-white/10">
            <img src={mondayCrmLogo} alt="monday CRM" className="w-8 h-8 rounded flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-white/60 text-[10px] leading-none">monday</span>
              <span className="text-white font-semibold text-sm leading-none">CRM Leads</span>
            </div>
          </div>
          
          {/* Board Rows */}
          <div className="p-4 space-y-2">
            {leads.map((name, index) => {
              const status = getStatus(index);
              const isConfirmed = confirmedRows.includes(index) || (emailConfirmedRows.includes(index) && index !== 2);
              
              return (
                <motion.div
                  key={name}
                  className="h-12 rounded-lg flex items-center px-4 gap-4"
                  style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                  animate={{
                    borderColor: isConfirmed ? 'rgba(34, 197, 94, 0.5)' : 'rgba(255, 255, 255, 0.05)',
                    boxShadow: isConfirmed ? '0 0 20px rgba(34, 197, 94, 0.2)' : 'none'
                  }}
                >
                  <div className="w-4 h-4 rounded border border-white/20" />
                  <span className="text-white/70 text-sm flex-1">{name}</span>
                  <motion.div
                    className="h-6 w-24 rounded-full flex items-center justify-center text-xs font-medium"
                    animate={{ backgroundColor: status.bg, color: status.color }}
                    transition={{ duration: 0.5 }}
                  >
                    {status.text}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Agent Avatar - Steps 5+ */}
          <AnimatePresence>
            {currentStep >= 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'absolute', bottom: '16px', left: '16px' }}
              >
                <motion.div animate={currentStep === 5 ? { scale: [1, 1.05, 1] } : {}} transition={{ repeat: currentStep === 5 ? Infinity : 0, duration: 1.5 }}>
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
                    style={{
                      background: featuredAgent?.image ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      boxShadow: currentStep === 5 ? '0 0 30px rgba(99, 102, 241, 0.6)' : '0 0 15px rgba(99, 102, 241, 0.4)',
                      border: '3px solid rgba(99, 102, 241, 0.8)'
                    }}
                  >
                    {featuredAgent?.image ? (
                      <img src={featuredAgent.image} alt={featuredAgent.name} className="w-full h-full object-cover" style={{ transform: 'scale(1.2)' }} />
                    ) : (
                      <Users className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <motion.div
                    animate={currentStep === 5 ? { rotate: [0, -15, 15, -15, 0] } : {}}
                    transition={{ repeat: currentStep === 5 ? Infinity : 0, duration: 0.6 }}
                    className={`absolute -right-1 -bottom-1 w-6 h-6 rounded-full flex items-center justify-center ${currentStep === 5 ? 'bg-green-500' : currentStep >= 6 ? 'bg-green-500' : 'bg-indigo-500'}`}
                  >
                    {currentStep === 5 ? <Phone className="w-3 h-3 text-white" /> : currentStep >= 6 ? <Check className="w-3 h-3 text-white" /> : <Sparkles className="w-3 h-3 text-white" />}
                  </motion.div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-white/60 text-xs">{featuredAgent?.name || 'RSVP Agent'}</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN - Absolutely positioned */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            width: 'calc(50% - 36px)',
            height: `${STAGE_HEIGHT - 48}px`,
            overflow: 'hidden',
          }}
        >
          {/* Step 1: Campaign Ideas */}
          <div style={{ position: 'absolute', inset: 0, opacity: currentStep === 0 ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: currentStep === 0 ? 'auto' : 'none' }}>
            <div className="h-full rounded-xl p-4 flex flex-col relative" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 245, 0.9))' }}>
              <div className="absolute inset-0 rounded-xl -z-10" style={{ background: 'linear-gradient(135deg, #ec4899, #f59e0b)', margin: '-2px', borderRadius: 'inherit', boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)' }} />
              <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-200">
                <div className="w-10 h-10 rounded-lg overflow-hidden"><img src={sidekickLogo} alt="Sidekick" className="w-full h-full object-contain" /></div>
                <div><span className="text-gray-800 font-semibold">Sidekick</span><div className="text-amber-600 text-xs">Your AI Assistant</div></div>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto">
                <div className="flex justify-end">
                  <div className="bg-indigo-600 rounded-2xl rounded-br-md px-3 py-2 max-w-[85%]">
                    <p className="text-white text-sm">{userMessage.slice(0, typingIndex)}{typingIndex < userMessage.length && <span className="animate-pulse">|</span>}</p>
                  </div>
                </div>
                {showResponse && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-md px-3 py-2 max-w-[95%] shadow-sm">
                      <p className="text-gray-800 text-sm mb-2">Great! Here's what I'll do:</p>
                      <ul className="text-gray-600 text-sm space-y-1.5 mb-3">
                        <li className="flex items-center gap-2"><Mail className="w-3 h-3 text-amber-600" /> Email invitations via monday campaigns</li>
                        <li className="flex items-center gap-2"><Phone className="w-3 h-3 text-amber-600" /> AI Agent for phone confirmations</li>
                        <li className="flex items-center gap-2"><Users className="w-3 h-3 text-amber-600" /> RSVP tracking on your CRM</li>
                      </ul>
                      <p className="text-gray-800 text-sm mb-2">Choose an email creative:</p>
                      <div className="space-y-2">
                        {[{ name: 'VIP Launch Party', subject: "You're Invited: Exclusive VIP Event", color: 'from-purple-500 to-indigo-600' }, { name: 'Community Meetup', subject: "Let's Connect: Community Event", color: 'from-green-500 to-teal-600' }].map((campaign) => (
                          <div key={campaign.name} className="p-2 rounded-lg bg-white border border-gray-200 hover:border-indigo-400 cursor-pointer">
                            <div className="flex items-start gap-2">
                              <div className={`w-10 h-10 rounded bg-gradient-to-br ${campaign.color} flex items-center justify-center flex-shrink-0`}><Mail className="w-4 h-4 text-white" /></div>
                              <div className="flex-1 min-w-0"><p className="text-gray-800 text-xs font-semibold truncate">{campaign.name}</p><p className="text-indigo-600 text-[10px] truncate">{campaign.subject}</p></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Campaign Selected */}
          <div style={{ position: 'absolute', inset: 0, opacity: currentStep === 1 ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: currentStep === 1 ? 'auto' : 'none' }}>
            <div className="h-full rounded-xl p-4 flex flex-col relative" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 245, 0.9))' }}>
              <div className="absolute inset-0 rounded-xl -z-10" style={{ background: 'linear-gradient(135deg, #ec4899, #f59e0b)', margin: '-2px', borderRadius: 'inherit', boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)' }} />
              <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-200">
                <div className="w-10 h-10 rounded-lg overflow-hidden"><img src={sidekickLogo} alt="Sidekick" className="w-full h-full object-contain" /></div>
                <div><span className="text-gray-800 font-semibold">Sidekick</span><div className="text-amber-600 text-xs">Campaign Selected</div></div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-white/20 flex items-center justify-center"><Sparkles className="w-7 h-7 text-white" /></div>
                    <div><p className="font-bold text-lg">VIP Launch Party</p><p className="text-white/80 text-sm">Exclusive invite with premium feel</p></div>
                    <Check className="w-6 h-6 text-green-300 ml-auto" />
                  </div>
                </div>
                <div className="bg-gray-100 rounded-xl p-3">
                  <p className="text-gray-700 text-sm">Great choice! I'll now send email invitations to all your contacts via <span className="font-semibold text-indigo-600">monday campaigns</span>.</p>
                </div>
                <div className="flex items-center justify-center gap-2 py-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full" />
                  <span className="text-gray-600 text-sm">Preparing campaign...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Email Campaign */}
          <div style={{ position: 'absolute', inset: 0, opacity: currentStep === 2 ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: currentStep === 2 ? 'auto' : 'none' }}>
            <div className="h-full rounded-xl p-4 flex flex-col" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <img src={mondayCampaignsLogo} alt="monday campaigns" className="w-10 h-10 rounded flex-shrink-0" />
                <div className="flex flex-col"><span className="text-white/60 text-[10px] leading-none">monday</span><span className="text-white font-semibold text-sm leading-tight">campaigns</span></div>
                <div className="ml-auto flex items-center gap-2">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-green-400 text-xs">Sending...</span>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-white/70">Sending to contacts...</span><span className="text-indigo-400">{emailsSent} / 5</span></div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${(emailsSent / 5) * 100}%` }} /></div>
                </div>
                <div className="space-y-2">
                  {leads.map((name, idx) => (
                    <div key={name} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10" style={{ opacity: emailsSent > idx ? 1 : 0.3 }}>
                      <Mail className={`w-4 h-4 ${emailsSent > idx ? 'text-green-400' : 'text-white/30'}`} />
                      <span className="text-white/80 text-sm flex-1">{name}</span>
                      {emailsSent > idx && <div className="flex items-center gap-1"><Check className="w-4 h-4 text-green-400" /><span className="text-green-400 text-xs">Sent</span></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Customer Responses */}
          <div style={{ position: 'absolute', inset: 0, opacity: currentStep === 3 ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: currentStep === 3 ? 'auto' : 'none' }}>
            <div className="h-full rounded-xl p-4 flex flex-col" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.15))', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"><Check className="w-5 h-5 text-white" /></motion.div>
                <div><span className="text-white font-semibold">Customer Responses</span><div className="text-green-400 text-xs">{emailConfirmedRows.length} of 5 confirmed via email</div></div>
              </div>
              <div className="flex-1 space-y-2">
                {leads.map((name, idx) => (
                  <div key={name} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: emailConfirmedRows.includes(idx) ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)', border: emailConfirmedRows.includes(idx) ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${emailConfirmedRows.includes(idx) ? 'bg-green-500 text-white' : 'bg-white/10 text-white/50'}`}>{name.split(' ').map(n => n[0]).join('')}</div>
                    <span className="text-white/80 text-sm flex-1">{name}</span>
                    {emailConfirmedRows.includes(idx) ? <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20"><Check className="w-3 h-3 text-green-400" /><span className="text-green-400 text-xs font-medium">Confirmed</span></div> : <span className="text-yellow-400/60 text-xs">Pending...</span>}
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-white/70 text-sm"><span className="text-green-400 font-semibold">{emailConfirmedRows.length}</span> confirmed, <span className="text-yellow-400 font-semibold">{5 - emailConfirmedRows.length}</span> need follow-up</p>
              </div>
            </div>
          </div>

          {/* Step 5: Agent Creation */}
          <div style={{ position: 'absolute', inset: 0, opacity: currentStep === 4 ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: currentStep === 4 ? 'auto' : 'none' }}>
            <div className="h-full rounded-xl p-4 flex flex-col relative" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 245, 0.9))' }}>
              <div className="absolute inset-0 rounded-xl -z-10" style={{ background: 'linear-gradient(135deg, #ec4899, #f59e0b)', margin: '-2px', borderRadius: 'inherit', boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)' }} />
              <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-200">
                <div className="w-10 h-10 rounded-lg overflow-hidden"><img src={sidekickLogo} alt="Sidekick" className="w-full h-full object-contain" /></div>
                <div><span className="text-gray-800 font-semibold">Sidekick</span><div className="text-amber-600 text-xs">Creating AI Agent</div></div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="bg-gray-100 rounded-xl p-3 w-full"><p className="text-gray-700 text-sm text-center">2 contacts haven't responded yet. I'll create an AI agent to follow up.</p></div>
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-indigo-500" style={{ boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)' }}>
                    {featuredAgent?.image ? <img src={featuredAgent.image} alt={featuredAgent.name} className="w-full h-full object-cover" style={{ transform: 'scale(1.3)' }} /> : <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><Users className="w-10 h-10 text-white" /></div>}
                  </div>
                  {agentCreationProgress >= 100 && <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center border-2 border-white"><Check className="w-4 h-4 text-white" /></div>}
                </div>
                <div className="text-center"><p className="text-gray-800 font-semibold">{featuredAgent?.name || 'RSVP Agent'}</p><p className="text-gray-500 text-sm">{agentCreationProgress < 100 ? 'Creating...' : 'Ready to make calls'}</p></div>
                <div className="w-full space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${agentCreationProgress}%` }} /></div>
                  <p className="text-gray-500 text-xs text-center">{agentCreationProgress < 100 ? 'Configuring agent...' : 'Agent ready!'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 6: Agent Calling */}
          <div style={{ position: 'absolute', inset: 0, opacity: currentStep === 5 ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: currentStep === 5 ? 'auto' : 'none' }}>
            <div className="h-full rounded-xl p-4 flex flex-col" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center"><PhoneCall className="w-5 h-5 text-white" /></motion.div>
                  <div><span className="text-white font-semibold">Active Call</span><div className="text-green-400 text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />Sarah Johnson</div></div>
                </div>
                <div className="text-white/60 text-sm font-mono">{formatDuration(callDuration)}</div>
              </div>
              <div className="flex items-center justify-center gap-4 py-4 mb-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-indigo-500 mx-auto mb-1" style={{ boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)' }}>
                    {featuredAgent?.image ? <img src={featuredAgent.image} alt={featuredAgent.name} className="w-full h-full object-cover" style={{ transform: 'scale(1.3)' }} /> : <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><Users className="w-6 h-6 text-white" /></div>}
                  </div>
                  <p className="text-white text-xs font-medium">{featuredAgent?.name || 'RSVP Agent'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div className="w-8 h-0.5 rounded-full" style={{ background: 'linear-gradient(to right, #6366f1, #22c55e)' }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                  <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.6)' }}><Phone className="w-5 h-5 text-white" /></motion.div>
                  <motion.div className="w-8 h-0.5 rounded-full" style={{ background: 'linear-gradient(to right, #22c55e, #ec4899)' }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }} />
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-pink-500 mx-auto mb-1 bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center" style={{ boxShadow: '0 0 15px rgba(236, 72, 153, 0.5)' }}><span className="text-white text-lg font-bold">SJ</span></div>
                  <p className="text-white text-xs font-medium">Sarah Johnson</p>
                </div>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {featuredAgent?.image ? <img src={featuredAgent.image} alt="" className="w-full h-full object-cover" style={{ transform: 'scale(1.3)' }} /> : <Users className="w-3 h-3 text-white" />}
                  </div>
                  <div className="bg-indigo-600/30 rounded-xl rounded-tl-md px-3 py-2 max-w-[80%]"><p className="text-white text-sm">{agentCallMessage.slice(0, agentMessageIndex)}{agentMessageIndex < agentCallMessage.length && <span className="animate-pulse">|</span>}</p></div>
                </div>
                {showCustomerResponse && (
                  <div className="flex gap-2 justify-end">
                    <div className="bg-pink-500/20 rounded-xl rounded-tr-md px-3 py-2 max-w-[80%]"><p className="text-white text-sm">Yes, absolutely! Count me in! 🎉</p></div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">SJ</div>
                  </div>
                )}
                {showCustomerResponse && (
                  <div className="flex justify-center">
                    <div className="bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 flex items-center gap-2"><Check className="w-3 h-3 text-green-400" /><span className="text-green-400 text-xs font-medium">RSVP Confirmed!</span></div>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-4">
                <div className="text-center p-2 rounded-lg bg-white/5"><div className="text-xl font-bold text-indigo-400">{callCount}</div><div className="text-white/60 text-xs">Confirmed</div></div>
                <div className="text-center p-2 rounded-lg bg-white/5"><div className="text-xl font-bold text-white/40">50</div><div className="text-white/60 text-xs">Total Invites</div></div>
              </div>
            </div>
          </div>

          {/* Step 7: Success */}
          <div style={{ position: 'absolute', inset: 0, opacity: currentStep === 6 ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: currentStep === 6 ? 'auto' : 'none' }}>
            <div className="h-full rounded-xl p-6 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.15))', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: currentStep === 6 ? 1 : 0 }} transition={{ type: 'spring', damping: 10 }} className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4"><Check className="w-8 h-8 text-white" /></motion.div>
              <h4 className="text-white font-bold text-xl mb-2">Campaign Complete!</h4>
              <p className="text-white/60 text-center text-sm mb-4">Your AI team handled everything</p>
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                <div className="text-center p-2 rounded-lg bg-white/5"><div className="text-lg font-bold text-green-400">50</div><div className="text-white/60 text-xs">Invites</div></div>
                <div className="text-center p-2 rounded-lg bg-white/5"><div className="text-lg font-bold text-green-400">45</div><div className="text-white/60 text-xs">Confirmed</div></div>
                <div className="text-center p-2 rounded-lg bg-white/5"><div className="text-lg font-bold text-green-400">90%</div><div className="text-white/60 text-xs">Success</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center mt-4">
        <p className="text-white/40 text-sm">{storySteps[currentStep]?.description}</p>
      </div>
    </div>
  );
}
