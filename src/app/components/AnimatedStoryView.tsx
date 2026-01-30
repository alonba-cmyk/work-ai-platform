import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Sparkles, Users, Phone, Check, Mail, Share2, PhoneCall } from 'lucide-react';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';

interface AnimatedStoryViewProps {
  department: string;
  agents?: Array<{ name: string; value?: string; image?: string }>;
  onClose?: () => void;
}

// Story step configuration
interface StoryStep {
  id: number;
  title: string;
  description: string;
  duration: number; // in milliseconds
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

export function AnimatedStoryView({ department, agents = [] }: AnimatedStoryViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Get the featured agent (first one with an image, or first one)
  const featuredAgent = agents.find(a => a.image) || agents[0];
  const [isPlaying, setIsPlaying] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  
  // Board row states (for step 4 animation)
  const [confirmedRows, setConfirmedRows] = useState<number[]>([]);
  
  // Counter for agent calls (step 3)
  const [callCount, setCallCount] = useState(0);
  
  // Typing animation state (step 1)
  const [typingIndex, setTypingIndex] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  
  // Campaign progress (step 2)
  const [campaignProgress, setCampaignProgress] = useState(0);

  // Agent call conversation state (step 6)
  const [agentMessageIndex, setAgentMessageIndex] = useState(0);
  const [showCustomerResponse, setShowCustomerResponse] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // New states for 7-step flow
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [emailsSent, setEmailsSent] = useState(0);
  const [emailConfirmedRows, setEmailConfirmedRows] = useState<number[]>([]);
  const [agentCreationProgress, setAgentCreationProgress] = useState(0);
  const [showCampaignCards, setShowCampaignCards] = useState(false);

  // Auto-advance through steps
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

  // Step-specific animations - Reset states when step changes
  useEffect(() => {
    if (currentStep === 0) {
      setTypingIndex(0);
      setShowResponse(false);
    } else if (currentStep === 2) {
      setEmailsSent(0);
    } else if (currentStep === 3) {
      setEmailConfirmedRows([]);
    } else if (currentStep === 4) {
      setAgentCreationProgress(0);
    } else if (currentStep === 5) {
      setCallCount(0);
      setAgentMessageIndex(0);
      setShowCustomerResponse(false);
      setCallDuration(0);
    } else if (currentStep === 6) {
      setConfirmedRows([]);
    }
  }, [currentStep]);

  // Step 1: Typing animation (Campaign Ideas)
  useEffect(() => {
    if (currentStep !== 0 || !isPlaying) return;
    
    const userMessage = "I need to create an event campaign for next week";
    if (typingIndex < userMessage.length) {
      const timer = setTimeout(() => setTypingIndex(prev => prev + 1), 50);
      return () => clearTimeout(timer);
    } else if (!showResponse) {
      const timer = setTimeout(() => setShowResponse(true), 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, typingIndex, showResponse, isPlaying]);

  // Step 3: Email sending progress
  useEffect(() => {
    if (currentStep !== 2 || !isPlaying) return;
    
    if (emailsSent < 5) {
      const timer = setTimeout(() => setEmailsSent(prev => prev + 1), 800);
      return () => clearTimeout(timer);
    }
  }, [currentStep, emailsSent, isPlaying]);

  // Step 4: Customer email confirmations (3 of 5 confirm)
  useEffect(() => {
    if (currentStep !== 3 || !isPlaying) return;
    
    const confirmingRows = [0, 1, 2]; // 3 confirm via email, 2 need follow-up
    confirmingRows.forEach((row, index) => {
      setTimeout(() => {
        setEmailConfirmedRows(prev => [...prev, row]);
      }, 800 * (index + 1));
    });
  }, [currentStep, isPlaying]);

  // Step 5: Agent creation progress
  useEffect(() => {
    if (currentStep !== 4 || !isPlaying) return;
    
    if (agentCreationProgress < 100) {
      const timer = setTimeout(() => setAgentCreationProgress(prev => Math.min(prev + 3, 100)), 80);
      return () => clearTimeout(timer);
    }
  }, [currentStep, agentCreationProgress, isPlaying]);

  // Step 6: Call counter and conversation
  const agentCallMessage = "Hi! I'm calling about the marketing event next week. Will you be joining us?";
  useEffect(() => {
    if (currentStep !== 5 || !isPlaying) return;
    
    if (callCount < 2) {
      const timer = setTimeout(() => setCallCount(prev => Math.min(prev + 1, 2)), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, callCount, isPlaying]);

  // Step 6: Agent message typing
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

  // Step 6: Call duration timer
  useEffect(() => {
    if (currentStep !== 5 || !isPlaying) return;
    
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentStep, isPlaying]);

  // Step 7: Final row confirmations (all 5 confirmed)
  useEffect(() => {
    if (currentStep !== 6 || !isPlaying) return;
    
    const rows = [0, 1, 2, 3, 4];
    rows.forEach((row, index) => {
      setTimeout(() => {
        setConfirmedRows(prev => [...prev, row]);
      }, 400 * (index + 1));
    });
  }, [currentStep, isPlaying]);

  const handlePlayPause = useCallback(() => {
    if (isComplete) {
      // Restart
      setCurrentStep(0);
      setIsComplete(false);
      setIsPlaying(true);
      setConfirmedRows([]);
      setCallCount(0);
      setTypingIndex(0);
      setShowResponse(false);
      setCampaignProgress(0);
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
    if (currentStep < storySteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const handleStepClick = useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex);
    setIsComplete(false);
    setIsPlaying(true);
  }, []);

  const userMessage = "I need to create an event campaign for next week";

  // Format call duration as mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full" style={{ minWidth: '100%', maxWidth: '100%' }}>
      {/* Header with narrative */}
      <div className="text-center mb-6">
        <h3 
          className="text-2xl md:text-3xl text-white mb-2"
          style={{ fontWeight: 'var(--font-weight-bold)' }}
        >
          See your marketing team in action
        </h3>
        <p className="text-white/60 text-lg">
          Watch how AI handles your campaign from start to finish
        </p>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {/* Step indicators */}
        <div className="flex items-center gap-2">
          {storySteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                index === currentStep 
                  ? 'bg-indigo-600 text-white scale-110' 
                  : index < currentStep 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white/10 text-white/50 hover:bg-white/20'
              }`}
              title={step.title}
            >
              {index < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-white/20" />

        {/* Play/Pause */}
        <button
          onClick={handlePlayPause}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          {isComplete ? (
            <RotateCcw className="w-5 h-5 text-white" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </button>

        {/* Skip */}
        {!isComplete && (
          <button
            onClick={handleSkip}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            disabled={currentStep >= storySteps.length - 1}
          >
            <SkipForward className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Current Step Title */}
      <div className="text-center mb-4">
        <span className="text-indigo-400 text-sm font-medium">
          Step {currentStep + 1}: {storySteps[currentStep]?.title}
        </span>
      </div>

      {/* Main Animation Stage - 100% WIDTH - FIXED */}
      <div
        className="relative rounded-2xl overflow-hidden grid grid-cols-2 gap-6 p-6 w-full"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.95), rgba(20, 20, 30, 0.98))',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          minHeight: '520px',
          minWidth: '100%',
          maxWidth: '100%'
        }}
      >
        {/* Board Background - Left Column (50%) */}
        <div className="rounded-xl overflow-hidden relative min-w-0"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Board Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-white/80 font-semibold">Event Campaign Board</span>
          </div>
          
          {/* Board Rows */}
          <div className="p-4 space-y-2">
            {['Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Alex Kim', 'Jordan Lee'].map((name, index) => (
              <motion.div
                key={name}
                className="h-12 rounded-lg flex items-center px-4 gap-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
                animate={{
                  borderColor: confirmedRows.includes(index) 
                    ? 'rgba(34, 197, 94, 0.5)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  boxShadow: confirmedRows.includes(index) 
                    ? '0 0 20px rgba(34, 197, 94, 0.2)' 
                    : 'none'
                }}
              >
                <div className="w-4 h-4 rounded border border-white/20" />
                <span className="text-white/70 text-sm flex-1">{name}</span>
                <motion.div
                  className="h-6 w-24 rounded-full flex items-center justify-center text-xs font-medium"
                  animate={{
                    backgroundColor: confirmedRows.includes(index) 
                      ? 'rgba(34, 197, 94, 0.3)' 
                      : 'rgba(253, 171, 61, 0.3)',
                    color: confirmedRows.includes(index) 
                      ? 'rgb(134, 239, 172)' 
                      : 'rgb(253, 224, 71)'
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {confirmedRows.includes(index) ? '✓ Confirmed' : 'Pending'}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Agent Avatar on Board - Shows during steps 5, 6, 7 */}
          <AnimatePresence>
            {currentStep >= 4 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute bottom-4 left-4"
              >
                <motion.div
                  animate={currentStep === 5 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: currentStep === 5 ? Infinity : 0, duration: 1.5 }}
                  className="relative"
                >
                  {/* Glowing circle with Agent Image */}
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
                    style={{
                      background: featuredAgent?.image ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      boxShadow: currentStep === 5 
                        ? '0 0 40px rgba(99, 102, 241, 0.6), 0 0 80px rgba(139, 92, 246, 0.3)' 
                        : '0 0 20px rgba(99, 102, 241, 0.4)',
                      border: '3px solid rgba(99, 102, 241, 0.8)'
                    }}
                  >
                    {featuredAgent?.image ? (
                      <img 
                        src={featuredAgent.image} 
                        alt={featuredAgent.name}
                        className="w-full h-full object-cover"
                        style={{ transform: 'scale(1.2)' }}
                      />
                    ) : (
                      <Users className="w-10 h-10 text-white" />
                    )}
                  </div>
                  
                  {/* Status indicator */}
                  <motion.div
                    animate={currentStep === 5 ? { rotate: [0, -15, 15, -15, 0] } : {}}
                    transition={{ repeat: currentStep === 5 ? Infinity : 0, duration: 0.6 }}
                    className={`absolute -right-1 -bottom-1 w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === 5 ? 'bg-green-500' : currentStep >= 6 ? 'bg-green-500' : 'bg-indigo-500'
                    }`}
                    style={{
                      boxShadow: currentStep === 5 ? '0 0 15px rgba(34, 197, 94, 0.6)' : 'none'
                    }}
                  >
                    {currentStep === 5 ? (
                      <Phone className="w-4 h-4 text-white" />
                    ) : currentStep >= 6 ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                  </motion.div>

                  {/* Agent label */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-white/60 text-xs font-medium">{featuredAgent?.name || 'RSVP Agent'}</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column - Dynamic Content (50%) */}
        <div className="flex flex-col min-w-0">
          <AnimatePresence mode="wait">
            {/* Step 1: Campaign Ideas - Sidekick suggests campaigns */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="h-full flex flex-col min-h-[460px]"
              >
                <div 
                  className="flex-1 rounded-xl p-4 flex flex-col relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 245, 0.9))',
                    border: '2px solid transparent',
                    backgroundClip: 'padding-box',
                    position: 'relative'
                  }}
                >
                  {/* Gradient border overlay */}
                  <div 
                    className="absolute inset-0 rounded-xl -z-10"
                    style={{
                      background: 'linear-gradient(135deg, #ec4899, #f59e0b)',
                      margin: '-2px',
                      borderRadius: 'inherit',
                      filter: 'blur(0px)',
                      boxShadow: '0 0 30px rgba(236, 72, 153, 0.3), 0 0 60px rgba(245, 158, 11, 0.2)'
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
                  
                  {/* Chat Messages */}
                  <div className="flex-1 space-y-3 overflow-y-auto">
                    {/* User message with typing effect */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end"
                    >
                      <div className="bg-indigo-600 rounded-2xl rounded-br-md px-3 py-2 max-w-[85%]">
                        <p className="text-white text-sm">
                          {userMessage.slice(0, typingIndex)}
                          {typingIndex < userMessage.length && (
                            <span className="animate-pulse">|</span>
                          )}
                        </p>
                      </div>
                    </motion.div>
                    
                    {/* Sidekick response with campaign ideas */}
                    <AnimatePresence>
                      {showResponse && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="bg-gray-100 rounded-2xl rounded-bl-md px-3 py-2 max-w-[95%] shadow-sm">
                            <p className="text-gray-800 text-sm mb-2">
                              Here are some campaign ideas for your event:
                            </p>
                            
                            {/* Campaign Cards */}
                            <div className="space-y-2">
                              {[
                                { name: 'VIP Launch Party', desc: 'Exclusive invite with premium feel', color: 'from-purple-500 to-indigo-600' },
                                { name: 'Community Meetup', desc: 'Casual networking event style', color: 'from-green-500 to-teal-600' },
                                { name: 'Product Showcase', desc: 'Professional demo presentation', color: 'from-orange-500 to-pink-600' }
                              ].map((campaign, idx) => (
                                <motion.div
                                  key={campaign.name}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 + idx * 0.2 }}
                                  className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-200 hover:border-indigo-300 cursor-pointer transition-all"
                                >
                                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${campaign.color} flex items-center justify-center flex-shrink-0`}>
                                    <Sparkles className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-gray-800 text-sm font-medium truncate">{campaign.name}</p>
                                    <p className="text-gray-500 text-xs truncate">{campaign.desc}</p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Campaign Selected */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="h-full flex flex-col min-h-[460px]"
              >
                <div 
                  className="flex-1 rounded-xl p-4 flex flex-col relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 245, 0.9))',
                    border: '2px solid transparent',
                    backgroundClip: 'padding-box'
                  }}
                >
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
                      <div className="text-amber-600 text-xs">Campaign Selected</div>
                    </div>
                  </div>

                  {/* Selected Campaign */}
                  <div className="flex-1 space-y-3">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg bg-white/20 flex items-center justify-center">
                          <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-lg">VIP Launch Party</p>
                          <p className="text-white/80 text-sm">Exclusive invite with premium feel</p>
                        </div>
                        <Check className="w-6 h-6 text-green-300 ml-auto" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gray-100 rounded-xl p-3"
                    >
                      <p className="text-gray-700 text-sm">
                        Great choice! I'll now send email invitations to all your contacts via <span className="font-semibold text-indigo-600">monday campaigns</span>.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center justify-center gap-2 py-3"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full"
                      />
                      <span className="text-gray-600 text-sm">Preparing campaign...</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Email Campaign via monday campaigns */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="h-full flex flex-col min-h-[460px]"
              >
                <div 
                  className="flex-1 rounded-xl p-4 flex flex-col"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                  }}
                >
                  {/* monday campaigns Header */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-semibold">monday campaigns</span>
                      <div className="text-indigo-400 text-xs">Sending invitations</div>
                    </div>
                  </div>

                  {/* Email Progress */}
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Sending to contacts...</span>
                        <span className="text-indigo-400">{emailsSent} / 5</span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          style={{ width: `${(emailsSent / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Email Items */}
                    <div className="space-y-2">
                      {['Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Alex Kim', 'Jordan Lee'].map((name, idx) => (
                        <motion.div
                          key={name}
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: emailsSent > idx ? 1 : 0.3 }}
                          className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10"
                        >
                          <Mail className={`w-4 h-4 ${emailsSent > idx ? 'text-green-400' : 'text-white/30'}`} />
                          <span className="text-white/80 text-sm flex-1">{name}</span>
                          {emailsSent > idx && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex items-center gap-1"
                            >
                              <Check className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 text-xs">Sent</span>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Customer Responses */}
            {currentStep === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="h-full flex flex-col min-h-[460px]"
              >
                <div 
                  className="flex-1 rounded-xl p-4 flex flex-col"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.15))',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}
                >
                  {/* Responses Header */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
                    >
                      <Check className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <span className="text-white font-semibold">Customer Responses</span>
                      <div className="text-green-400 text-xs">{emailConfirmedRows.length} of 5 confirmed via email</div>
                    </div>
                  </div>

                  {/* Response List */}
                  <div className="flex-1 space-y-2">
                    {['Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Alex Kim', 'Jordan Lee'].map((name, idx) => (
                      <motion.div
                        key={name}
                        className="flex items-center gap-3 p-3 rounded-lg"
                        style={{
                          background: emailConfirmedRows.includes(idx) ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          border: emailConfirmedRows.includes(idx) ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          emailConfirmedRows.includes(idx) ? 'bg-green-500 text-white' : 'bg-white/10 text-white/50'
                        }`}>
                          {name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-white/80 text-sm flex-1">{name}</span>
                        {emailConfirmedRows.includes(idx) ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20"
                          >
                            <Check className="w-3 h-3 text-green-400" />
                            <span className="text-green-400 text-xs font-medium">Confirmed</span>
                          </motion.div>
                        ) : (
                          <span className="text-yellow-400/60 text-xs">Pending...</span>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Summary */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10 text-center"
                  >
                    <p className="text-white/70 text-sm">
                      <span className="text-green-400 font-semibold">{emailConfirmedRows.length}</span> confirmed, 
                      <span className="text-yellow-400 font-semibold"> {5 - emailConfirmedRows.length}</span> need follow-up
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Agent Creation */}
            {currentStep === 4 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="h-full flex flex-col min-h-[460px]"
              >
                <div 
                  className="flex-1 rounded-xl p-4 flex flex-col relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 245, 0.9))',
                    border: '2px solid transparent',
                    backgroundClip: 'padding-box'
                  }}
                >
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
                      <div className="text-amber-600 text-xs">Creating AI Agent</div>
                    </div>
                  </div>

                  {/* Agent Creation Content */}
                  <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-100 rounded-xl p-3 w-full"
                    >
                      <p className="text-gray-700 text-sm text-center">
                        2 contacts haven't responded yet. I'll create an AI agent to follow up with phone calls.
                      </p>
                    </motion.div>

                    {/* Agent Avatar Appearing */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                      className="relative"
                    >
                      <div 
                        className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500"
                        style={{ boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)' }}
                      >
                        {featuredAgent?.image ? (
                          <img 
                            src={featuredAgent.image} 
                            alt={featuredAgent.name}
                            className="w-full h-full object-cover"
                            style={{ transform: 'scale(1.3)' }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Users className="w-10 h-10 text-white" />
                          </div>
                        )}
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1 }}
                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center border-2 border-white"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="text-center"
                    >
                      <p className="text-gray-800 font-semibold">{featuredAgent?.name || 'RSVP Agent'}</p>
                      <p className="text-gray-500 text-sm">Ready to make calls</p>
                    </motion.div>

                    {/* Progress */}
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: '100%' }}
                      transition={{ delay: 0.3 }}
                      className="w-full space-y-2"
                    >
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${agentCreationProgress}%` }}
                        />
                      </div>
                      <p className="text-gray-500 text-xs text-center">
                        {agentCreationProgress < 100 ? 'Configuring agent...' : 'Agent ready!'}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Agent Calling - WITH VISUAL CALL DISPLAY */}
            {currentStep === 5 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="h-full flex flex-col min-h-[460px]"
              >
                <div 
                  className="flex-1 rounded-xl p-4 flex flex-col"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                  }}
                >
                  {/* Call Window Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center"
                      >
                        <PhoneCall className="w-5 h-5 text-white" />
                      </motion.div>
                      <div>
                        <span className="text-white font-semibold">Active Call</span>
                        <div className="text-green-400 text-xs flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          Sarah Johnson
                        </div>
                      </div>
                    </div>
                    <div className="text-white/60 text-sm font-mono">
                      {formatDuration(callDuration)}
                    </div>
                  </div>

                  {/* Visual Call Display - Agent and Customer Face to Face */}
                  <div className="flex items-center justify-center gap-4 py-6 mb-4">
                    {/* Agent Side */}
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="text-center"
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-20 h-20 rounded-full overflow-hidden border-4 border-indigo-500 mx-auto mb-2"
                        style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' }}
                      >
                        {featuredAgent?.image ? (
                          <img 
                            src={featuredAgent.image} 
                            alt={featuredAgent.name}
                            className="w-full h-full object-cover"
                            style={{ transform: 'scale(1.3)' }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                        )}
                      </motion.div>
                      <p className="text-white text-sm font-medium">{featuredAgent?.name || 'RSVP Agent'}</p>
                      <p className="text-indigo-400 text-xs">AI Agent</p>
                    </motion.div>

                    {/* Connecting Line with Phone */}
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="w-12 h-1 rounded-full"
                        style={{ background: 'linear-gradient(to right, #6366f1, #22c55e)' }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                      <motion.div
                        animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center"
                        style={{ boxShadow: '0 0 25px rgba(34, 197, 94, 0.6)' }}
                      >
                        <Phone className="w-6 h-6 text-white" />
                      </motion.div>
                      <motion.div 
                        className="w-12 h-1 rounded-full"
                        style={{ background: 'linear-gradient(to right, #22c55e, #ec4899)' }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                      />
                    </div>

                    {/* Customer Side */}
                    <motion.div 
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="text-center"
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                        className="w-20 h-20 rounded-full overflow-hidden border-4 border-pink-500 mx-auto mb-2 bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center"
                        style={{ boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)' }}
                      >
                        <span className="text-white text-2xl font-bold">SJ</span>
                      </motion.div>
                      <p className="text-white text-sm font-medium">Sarah Johnson</p>
                      <p className="text-pink-400 text-xs">Customer</p>
                    </motion.div>
                  </div>

                  {/* Call Conversation */}
                  <div className="flex-1 space-y-3 overflow-y-auto">
                    {/* Agent Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {featuredAgent?.image ? (
                          <img 
                            src={featuredAgent.image} 
                            alt={featuredAgent.name}
                            className="w-full h-full object-cover"
                            style={{ transform: 'scale(1.3)' }}
                          />
                        ) : (
                          <Users className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="bg-indigo-600/30 rounded-2xl rounded-tl-md px-4 py-2 max-w-[80%]">
                        <p className="text-white text-sm">
                          {agentCallMessage.slice(0, agentMessageIndex)}
                          {agentMessageIndex < agentCallMessage.length && (
                            <span className="animate-pulse">|</span>
                          )}
                        </p>
                      </div>
                    </motion.div>

                    {/* Customer Response */}
                    <AnimatePresence>
                      {showCustomerResponse && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-3 justify-end"
                        >
                          <div className="bg-pink-500/20 rounded-2xl rounded-tr-md px-4 py-2 max-w-[80%]">
                            <p className="text-white text-sm">
                              Yes, absolutely! I've been looking forward to it. Count me in! 🎉
                            </p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                            SJ
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Confirmation */}
                    <AnimatePresence>
                      {showCustomerResponse && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                          className="flex justify-center"
                        >
                          <div className="bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm font-medium">RSVP Confirmed!</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Call Stats */}
                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-white/5">
                      <motion.div
                        key={callCount}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-bold text-indigo-400"
                      >
                        {callCount}
                      </motion.div>
                      <div className="text-white/60 text-xs">Confirmed</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-white/5">
                      <div className="text-2xl font-bold text-white/40">50</div>
                      <div className="text-white/60 text-xs">Total Invites</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 7: Success */}
            {currentStep === 6 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="h-full flex flex-col min-h-[460px]"
              >
                <div 
                  className="flex-1 rounded-xl p-6 flex flex-col items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.15))',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}
                >
                  {/* Success Animation */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-6"
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>

                  <h4 className="text-white font-bold text-2xl mb-2">Campaign Complete!</h4>
                  <p className="text-white/60 text-center mb-6">
                    Your AI team handled everything
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-center p-3 rounded-lg bg-white/5"
                    >
                      <div className="text-2xl font-bold text-green-400">50</div>
                      <div className="text-white/60 text-xs">Invites Sent</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-center p-3 rounded-lg bg-white/5"
                    >
                      <div className="text-2xl font-bold text-green-400">45</div>
                      <div className="text-white/60 text-xs">Confirmed</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-center p-3 rounded-lg bg-white/5"
                    >
                      <div className="text-2xl font-bold text-green-400">90%</div>
                      <div className="text-white/60 text-xs">Success Rate</div>
                    </motion.div>
                  </div>

                  {/* Celebration particles */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        background: ['#22c55e', '#6366f1', '#ec4899', '#f59e0b'][i % 4],
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                        y: [0, -50],
                      }}
                      transition={{
                        delay: 0.8 + i * 0.1,
                        duration: 1.5,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom narrative */}
      <div className="text-center mt-4">
        <p className="text-white/40 text-sm">
          {storySteps[currentStep]?.description}
        </p>
      </div>
    </div>
  );
}
