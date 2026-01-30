import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Zap, Sparkles, Users, Phone, Check, Mail, Share2, PhoneCall } from 'lucide-react';

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
  { id: 1, title: 'Sidekick Chat', description: 'Ask your AI assistant for help', duration: 5000 },
  { id: 2, title: 'Campaign Creation', description: 'Vibe App builds your campaign', duration: 5000 },
  { id: 3, title: 'Agent Working', description: 'AI Agent confirms attendees', duration: 6000 },
  { id: 4, title: 'Success!', description: 'Watch results appear in real-time', duration: 5000 },
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

  // Agent call conversation state (step 3)
  const [agentMessageIndex, setAgentMessageIndex] = useState(0);
  const [showCustomerResponse, setShowCustomerResponse] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

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

  // Step-specific animations
  useEffect(() => {
    // Reset step-specific states when step changes
    if (currentStep === 0) {
      setTypingIndex(0);
      setShowResponse(false);
    } else if (currentStep === 1) {
      setCampaignProgress(0);
    } else if (currentStep === 2) {
      setCallCount(0);
      setAgentMessageIndex(0);
      setShowCustomerResponse(false);
      setCallDuration(0);
    } else if (currentStep === 3) {
      setConfirmedRows([]);
    }
  }, [currentStep]);

  // Step 1: Typing animation
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

  // Step 2: Campaign progress
  useEffect(() => {
    if (currentStep !== 1 || !isPlaying) return;
    
    if (campaignProgress < 100) {
      const timer = setTimeout(() => setCampaignProgress(prev => Math.min(prev + 2, 100)), 80);
      return () => clearTimeout(timer);
    }
  }, [currentStep, campaignProgress, isPlaying]);

  // Step 3: Call counter and conversation
  useEffect(() => {
    if (currentStep !== 2 || !isPlaying) return;
    
    if (callCount < 50) {
      const timer = setTimeout(() => setCallCount(prev => Math.min(prev + 1, 50)), 80);
      return () => clearTimeout(timer);
    }
  }, [currentStep, callCount, isPlaying]);

  // Step 3: Agent message typing
  const agentCallMessage = "Hi Sarah! I'm calling about the marketing event next week. Will you be joining us?";
  useEffect(() => {
    if (currentStep !== 2 || !isPlaying) return;
    
    if (agentMessageIndex < agentCallMessage.length) {
      const timer = setTimeout(() => setAgentMessageIndex(prev => prev + 1), 40);
      return () => clearTimeout(timer);
    } else if (!showCustomerResponse) {
      const timer = setTimeout(() => setShowCustomerResponse(true), 800);
      return () => clearTimeout(timer);
    }
  }, [currentStep, agentMessageIndex, showCustomerResponse, isPlaying]);

  // Step 3: Call duration timer
  useEffect(() => {
    if (currentStep !== 2 || !isPlaying) return;
    
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentStep, isPlaying]);

  // Step 4: Row confirmations
  useEffect(() => {
    if (currentStep !== 3 || !isPlaying) return;
    
    const rows = [0, 1, 2, 3, 4];
    rows.forEach((row, index) => {
      setTimeout(() => {
        setConfirmedRows(prev => [...prev, row]);
      }, 600 * (index + 1));
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
    <div className="w-full">
      {/* Header with narrative */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h3 
          className="text-2xl md:text-3xl text-white mb-2"
          style={{ fontWeight: 'var(--font-weight-bold)' }}
        >
          See your marketing team in action
        </h3>
        <p className="text-white/60 text-lg">
          Watch how AI handles your campaign from start to finish
        </p>
      </motion.div>

      {/* Playback Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-4 mb-6"
      >
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
      </motion.div>

      {/* Current Step Title */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <span className="text-indigo-400 text-sm font-medium">
          Step {currentStep + 1}: {storySteps[currentStep]?.title}
        </span>
      </motion.div>

      {/* Main Animation Stage - 100% WIDTH - NO SCALE ANIMATION */}
      <div
        className="relative rounded-2xl overflow-hidden grid grid-cols-2 gap-6 p-6 w-full"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.95), rgba(20, 20, 30, 0.98))',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          minHeight: '520px'
        }}
      >
        {/* Board Background - Left Column (50%) */}
        <div className="rounded-xl overflow-hidden relative"
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

          {/* Agent Avatar on Board - Shows during steps 2, 3, 4 */}
          <AnimatePresence>
            {currentStep >= 1 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute bottom-4 left-4"
              >
                <motion.div
                  animate={currentStep === 2 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: currentStep === 2 ? Infinity : 0, duration: 1.5 }}
                  className="relative"
                >
                  {/* Glowing circle with Agent Image */}
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
                    style={{
                      background: featuredAgent?.image ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      boxShadow: currentStep === 2 
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
                    animate={currentStep === 2 ? { rotate: [0, -15, 15, -15, 0] } : {}}
                    transition={{ repeat: currentStep === 2 ? Infinity : 0, duration: 0.6 }}
                    className={`absolute -right-1 -bottom-1 w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === 2 ? 'bg-green-500' : currentStep >= 3 ? 'bg-green-500' : 'bg-indigo-500'
                    }`}
                    style={{
                      boxShadow: currentStep === 2 ? '0 0 15px rgba(34, 197, 94, 0.6)' : 'none'
                    }}
                  >
                    {currentStep === 2 ? (
                      <Phone className="w-4 h-4 text-white" />
                    ) : currentStep >= 3 ? (
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
        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            {/* Step 1: Sidekick Chat */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="h-full flex flex-col min-h-[460px]"
              >
                <div 
                  className="flex-1 rounded-xl p-4 flex flex-col"
                  style={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(249, 115, 22, 0.15))',
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                  }}
                >
                  {/* Sidekick Header */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-semibold">Sidekick</span>
                      <div className="text-amber-400 text-xs">Your AI Assistant</div>
                    </div>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="flex-1 space-y-4 overflow-y-auto">
                    {/* User message with typing effect */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end"
                    >
                      <div className="bg-indigo-600 rounded-2xl rounded-br-md px-4 py-2 max-w-[85%]">
                        <p className="text-white text-sm">
                          {userMessage.slice(0, typingIndex)}
                          {typingIndex < userMessage.length && (
                            <span className="animate-pulse">|</span>
                          )}
                        </p>
                      </div>
                    </motion.div>
                    
                    {/* Sidekick response */}
                    <AnimatePresence>
                      {showResponse && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3 max-w-[90%]">
                            <p className="text-white text-sm">
                              I'll help you set that up! Let me create:
                            </p>
                            <ul className="text-white/70 text-sm mt-2 space-y-1.5">
                              <motion.li 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-2"
                              >
                                <Mail className="w-3 h-3 text-amber-400" /> Email invitations
                              </motion.li>
                              <motion.li 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-2"
                              >
                                <Share2 className="w-3 h-3 text-amber-400" /> Social media posts
                              </motion.li>
                              <motion.li 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                                className="flex items-center gap-2"
                              >
                                <Users className="w-3 h-3 text-amber-400" /> RSVP tracking
                              </motion.li>
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Campaign Creation */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="h-full flex flex-col min-h-[460px]"
              >
                <div 
                  className="flex-1 rounded-xl p-4 flex flex-col"
                  style={{
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(168, 85, 247, 0.15))',
                    border: '1px solid rgba(236, 72, 153, 0.3)'
                  }}
                >
                  {/* Vibe Header */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-semibold">Vibe App Builder</span>
                      <div className="text-pink-400 text-xs">Creating your campaign</div>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Building campaign...</span>
                        <span className="text-pink-400">{campaignProgress}%</span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                          style={{ width: `${campaignProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Campaign Components */}
                    <div className="space-y-3 mt-6">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: campaignProgress > 30 ? 1 : 0.3, scale: 1 }}
                        className="p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4 text-pink-400" />
                          <span className="text-white text-sm font-medium">Email Campaign</span>
                          {campaignProgress > 30 && <Check className="w-4 h-4 text-green-400 ml-auto" />}
                        </div>
                        <div className="h-16 rounded bg-white/5 flex items-center justify-center">
                          <span className="text-white/40 text-xs">Email template preview</span>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: campaignProgress > 60 ? 1 : 0.3, scale: 1 }}
                        className="p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Share2 className="w-4 h-4 text-purple-400" />
                          <span className="text-white text-sm font-medium">Social Posts</span>
                          {campaignProgress > 60 && <Check className="w-4 h-4 text-green-400 ml-auto" />}
                        </div>
                        <div className="h-16 rounded bg-white/5 flex items-center justify-center">
                          <span className="text-white/40 text-xs">Social media preview</span>
                        </div>
                      </motion.div>
                    </div>

                    {campaignProgress >= 100 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-4"
                      >
                        <span className="text-green-400 font-medium">Campaign ready!</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Agent Calling - WITH VISUAL CALL DISPLAY */}
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

            {/* Step 4: Success */}
            {currentStep === 3 && (
              <motion.div
                key="step4"
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-4"
      >
        <p className="text-white/40 text-sm">
          {storySteps[currentStep]?.description}
        </p>
      </motion.div>
    </div>
  );
}
