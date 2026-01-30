import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Sparkles, Users, Phone, Check, Mail, PhoneCall } from 'lucide-react';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';
import mondayCrmLogo from '@/assets/monday-crm-logo.png';

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
  { id: 1, title: 'Request', description: 'You ask Sidekick to create an event campaign', duration: 4000 },
  { id: 2, title: 'Planning', description: 'Sidekick outlines the campaign plan', duration: 4000 },
  { id: 3, title: 'Sending Emails', description: 'Invitations sent via monday campaigns', duration: 5000 },
  { id: 4, title: 'Responses', description: 'Some customers confirm attendance', duration: 4000 },
  { id: 5, title: 'Agent Created', description: 'AI Agent deployed for follow-ups', duration: 4000 },
  { id: 6, title: 'Agent Calling', description: 'Agent calls remaining leads', duration: 6000 },
  { id: 7, title: 'Complete', description: 'All leads confirmed!', duration: 4000 },
];

const STAGE_HEIGHT = 480;

export function AnimatedStoryView({ agents = [] }: AnimatedStoryViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const featuredAgent = agents.find(a => a.image) || agents[0];
  const [isPlaying, setIsPlaying] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  
  // Animation states
  const [typingIndex, setTypingIndex] = useState(0);
  const [emailsSent, setEmailsSent] = useState(0);
  const [emailConfirmedRows, setEmailConfirmedRows] = useState<number[]>([]);
  const [agentCreationProgress, setAgentCreationProgress] = useState(0);
  const [callMessageIndex, setCallMessageIndex] = useState(0);
  const [showCallResponse, setShowCallResponse] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [finalConfirmedRows, setFinalConfirmedRows] = useState<number[]>([]);

  const userMessage = "Create an event campaign for next week";
  const callMessage = "Hi! Will you be joining us for the marketing event?";
  const leads = ['Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Alex Kim', 'Jordan Lee'];

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

  // Step 3: Emails sent
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
    [0, 1, 2].forEach((row, idx) => {
      setTimeout(() => setEmailConfirmedRows(prev => prev.includes(row) ? prev : [...prev, row]), 800 * (idx + 1));
    });
  }, [currentStep, isPlaying]);

  // Step 5: Agent creation
  useEffect(() => {
    if (currentStep !== 4 || !isPlaying) return;
    if (agentCreationProgress < 100) {
      const timer = setTimeout(() => setAgentCreationProgress(prev => Math.min(prev + 4, 100)), 100);
      return () => clearTimeout(timer);
    }
  }, [currentStep, agentCreationProgress, isPlaying]);

  // Step 6: Call message typing
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

  // Step 6: Call duration
  useEffect(() => {
    if (currentStep !== 5 || !isPlaying) return;
    const timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [currentStep, isPlaying]);

  // Step 7: Final confirmations
  useEffect(() => {
    if (currentStep !== 6 || !isPlaying) return;
    [3, 4].forEach((row, idx) => {
      setTimeout(() => setFinalConfirmedRows(prev => prev.includes(row) ? prev : [...prev, row]), 600 * (idx + 1));
    });
  }, [currentStep, isPlaying]);

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
    if (finalConfirmedRows.includes(index) || emailConfirmedRows.includes(index)) {
      return { text: '✓ Attend', bg: 'rgba(34, 197, 94, 0.3)', color: 'rgb(134, 239, 172)' };
    }
    if (emailsSent > index && currentStep >= 2) {
      return { text: 'Invited', bg: 'rgba(99, 102, 241, 0.3)', color: 'rgb(165, 180, 252)' };
    }
    return { text: 'New Lead', bg: 'rgba(107, 114, 128, 0.3)', color: 'rgb(156, 163, 175)' };
  };

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
        {/* LEFT COLUMN - CRM Board (always visible) */}
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
          <div className="p-3 space-y-2">
            {leads.map((name, index) => {
              const status = getLeadStatus(index);
              const isConfirmed = emailConfirmedRows.includes(index) || finalConfirmedRows.includes(index);
              
              return (
                <motion.div
                  key={name}
                  className="h-11 rounded-lg flex items-center px-3 gap-3"
                  style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                  animate={{
                    borderColor: isConfirmed ? 'rgba(34, 197, 94, 0.5)' : 'rgba(255, 255, 255, 0.05)',
                    boxShadow: isConfirmed ? '0 0 15px rgba(34, 197, 94, 0.2)' : 'none'
                  }}
                >
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs font-medium">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-white/70 text-sm flex-1">{name}</span>
                  <motion.div
                    className="h-5 px-2 rounded-full flex items-center justify-center text-[10px] font-medium"
                    animate={{ backgroundColor: status.bg, color: status.color }}
                    transition={{ duration: 0.4 }}
                  >
                    {status.text}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Agent Avatar - appears at step 5+ */}
          <AnimatePresence>
            {currentStep >= 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{ position: 'absolute', bottom: '12px', left: '12px' }}
              >
                <motion.div 
                  animate={currentStep === 5 ? { scale: [1, 1.08, 1] } : {}} 
                  transition={{ repeat: currentStep === 5 ? Infinity : 0, duration: 1.5 }}
                  className="relative"
                >
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
                    style={{
                      background: featuredAgent?.image ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      boxShadow: currentStep === 5 ? '0 0 25px rgba(99, 102, 241, 0.7)' : '0 0 12px rgba(99, 102, 241, 0.4)',
                      border: '2px solid rgba(99, 102, 241, 0.8)'
                    }}
                  >
                    {featuredAgent?.image ? (
                      <img src={featuredAgent.image} alt={featuredAgent.name} className="w-full h-full object-cover" style={{ transform: 'scale(1.2)' }} />
                    ) : (
                      <Users className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className={`absolute -right-1 -bottom-1 w-5 h-5 rounded-full flex items-center justify-center ${currentStep === 5 ? 'bg-green-500' : 'bg-indigo-500'}`}>
                    {currentStep === 5 ? <Phone className="w-2.5 h-2.5 text-white" /> : currentStep >= 6 ? <Check className="w-2.5 h-2.5 text-white" /> : <Sparkles className="w-2.5 h-2.5 text-white" />}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CALL POPUP - Overlays the board during step 6 */}
          <AnimatePresence>
            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                style={{
                  position: 'absolute',
                  top: '50px',
                  left: '10px',
                  right: '10px',
                  bottom: '80px',
                  background: 'rgba(15, 15, 25, 0.98)',
                  border: '1px solid rgba(34, 197, 94, 0.5)',
                  borderRadius: '12px',
                  boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Call Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
                    >
                      <PhoneCall className="w-4 h-4 text-white" />
                    </motion.div>
                    <div>
                      <span className="text-white font-semibold text-sm">Active Call</span>
                      <div className="text-green-400 text-[10px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Alex Kim
                      </div>
                    </div>
                  </div>
                  <span className="text-white/50 text-xs font-mono">{formatDuration(callDuration)}</span>
                </div>

                {/* Call Participants */}
                <div className="flex items-center justify-center gap-3 py-3">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500 mx-auto mb-1" style={{ boxShadow: '0 0 12px rgba(99, 102, 241, 0.5)' }}>
                      {featuredAgent?.image ? (
                        <img src={featuredAgent.image} alt="" className="w-full h-full object-cover" style={{ transform: 'scale(1.3)' }} />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><Users className="w-5 h-5 text-white" /></div>
                      )}
                    </div>
                    <p className="text-white/80 text-[10px]">{featuredAgent?.name || 'Agent'}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, -8, 8, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                    className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
                    style={{ boxShadow: '0 0 15px rgba(34, 197, 94, 0.5)' }}
                  >
                    <Phone className="w-4 h-4 text-white" />
                  </motion.div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-2 border-pink-500 mx-auto mb-1 bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center" style={{ boxShadow: '0 0 12px rgba(236, 72, 153, 0.5)' }}>
                      <span className="text-white font-bold text-sm">AK</span>
                    </div>
                    <p className="text-white/80 text-[10px]">Alex Kim</p>
                  </div>
                </div>

                {/* Call Conversation */}
                <div className="flex-1 space-y-2 overflow-y-auto">
                  <div className="flex gap-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {featuredAgent?.image ? <img src={featuredAgent.image} alt="" className="w-full h-full object-cover" style={{ transform: 'scale(1.3)' }} /> : <Users className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <div className="bg-indigo-600/30 rounded-lg rounded-tl-sm px-2 py-1.5 max-w-[85%]">
                      <p className="text-white text-xs">{callMessage.slice(0, callMessageIndex)}{callMessageIndex < callMessage.length && <span className="animate-pulse">|</span>}</p>
                    </div>
                  </div>
                  {showCallResponse && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2 justify-end"
                    >
                      <div className="bg-pink-500/20 rounded-lg rounded-tr-sm px-2 py-1.5 max-w-[85%]">
                        <p className="text-white text-xs">Yes, I'll be there! 🎉</p>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center flex-shrink-0 text-white text-[8px] font-bold">AK</div>
                    </motion.div>
                  )}
                  {showCallResponse && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex justify-center pt-1"
                    >
                      <div className="bg-green-500/20 border border-green-500/30 rounded-full px-2 py-0.5 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5 text-green-400" />
                        <span className="text-green-400 text-[10px] font-medium">Confirmed!</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN - Sidekick Chat (progressive messages) */}
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
          <div 
            className="h-full rounded-xl p-4 flex flex-col relative"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 245, 0.9))',
            }}
          >
            {/* Gradient border */}
            <div 
              className="absolute inset-0 rounded-xl -z-10"
              style={{ 
                background: 'linear-gradient(135deg, #ec4899, #f59e0b)', 
                margin: '-2px', 
                borderRadius: 'inherit',
                boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)'
              }}
            />
            
            {/* Sidekick Header */}
            <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-200">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img src={sidekickLogo} alt="Sidekick" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-gray-800 font-semibold">Sidekick</span>
                <div className="text-amber-600 text-xs">Your AI Assistant</div>
              </div>
            </div>

            {/* Chat Messages - Progressive */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              {/* Step 1: User message */}
              <div className="flex justify-end">
                <div className="bg-indigo-600 rounded-2xl rounded-br-md px-3 py-2 max-w-[85%]">
                  <p className="text-white text-sm">
                    {userMessage.slice(0, typingIndex)}
                    {currentStep === 0 && typingIndex < userMessage.length && <span className="animate-pulse">|</span>}
                  </p>
                </div>
              </div>

              {/* Step 2+: Sidekick plan */}
              {currentStep >= 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-3 py-2 max-w-[95%] shadow-sm">
                    <p className="text-gray-800 text-sm mb-2">Perfect! Here's my plan:</p>
                    <ul className="text-gray-600 text-xs space-y-1">
                      <li className="flex items-center gap-2"><Mail className="w-3 h-3 text-amber-600" /> Send email invitations</li>
                      <li className="flex items-center gap-2"><Phone className="w-3 h-3 text-amber-600" /> Create AI agent for calls</li>
                      <li className="flex items-center gap-2"><Users className="w-3 h-3 text-amber-600" /> Track RSVPs in CRM</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Sending emails */}
              {currentStep >= 2 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-3 py-2 max-w-[95%] shadow-sm">
                    <p className="text-gray-800 text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-600" />
                      Sending email invitations... <span className="text-indigo-600 font-semibold">{emailsSent}/5</span>
                    </p>
                    {emailsSent >= 5 && (
                      <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" /> All emails sent!
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Responses */}
              {currentStep >= 3 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-3 py-2 max-w-[95%] shadow-sm">
                    <p className="text-gray-800 text-sm">
                      <span className="text-green-600 font-semibold">{emailConfirmedRows.length}</span> confirmed via email!
                    </p>
                    <p className="text-amber-600 text-xs mt-1">
                      {5 - emailConfirmedRows.length} leads still pending...
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Creating agent */}
              {currentStep >= 4 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-3 py-2 max-w-[95%] shadow-sm">
                    <p className="text-gray-800 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Creating AI agent for follow-ups...
                    </p>
                    {agentCreationProgress >= 100 ? (
                      <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" /> {featuredAgent?.name || 'RSVP Agent'} ready!
                      </p>
                    ) : (
                      <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          style={{ width: `${agentCreationProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 6: Agent calling */}
              {currentStep >= 5 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-3 py-2 max-w-[95%] shadow-sm">
                    <p className="text-gray-800 text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-600" />
                      Agent is calling remaining leads...
                    </p>
                    {showCallResponse && (
                      <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Alex Kim confirmed!
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 7: Complete */}
              {currentStep >= 6 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl rounded-bl-md px-3 py-3 max-w-[95%] shadow-sm border border-green-200">
                    <p className="text-green-800 text-sm font-semibold flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      Campaign Complete! 🎉
                    </p>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="text-center p-1.5 rounded bg-white/60">
                        <div className="text-green-600 font-bold text-sm">5</div>
                        <div className="text-gray-500 text-[9px]">Invites</div>
                      </div>
                      <div className="text-center p-1.5 rounded bg-white/60">
                        <div className="text-green-600 font-bold text-sm">5</div>
                        <div className="text-gray-500 text-[9px]">Confirmed</div>
                      </div>
                      <div className="text-center p-1.5 rounded bg-white/60">
                        <div className="text-green-600 font-bold text-sm">100%</div>
                        <div className="text-gray-500 text-[9px]">Success</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
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
