import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Check,
  FileText,
  Zap,
  LayoutGrid,
  Bot,
  Sparkles,
  Clock,
  Target,
  Users,
  BarChart3,
  Settings,
  Package,
  TrendingUp,
  Send,
  Phone,
  Globe
} from 'lucide-react';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';
import sidekickIcon from '@/assets/sidekick-icon.png';
import userAvatarIntro from '@/assets/c7005ced01914c6b1f5e7c0f86f6d5e4e22d3e9f.png';
import vibeLogo from '@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png';
import workManagementLogo from '@/assets/monday-work-management-logo.png';

type OptionType = 'project' | 'campaign' | 'operations';

interface SidekickOption {
  id: OptionType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const sidekickOptions: SidekickOption[] = [
  { id: 'project', label: 'Start a new project', icon: FileText, color: '#6366f1' },
  { id: 'campaign', label: 'Launch a campaign', icon: Mail, color: '#ec4899' },
  { id: 'operations', label: 'Help me manage my operations', icon: Zap, color: '#f59e0b' },
];

// Campaign story tasks (matching Full Story)
const campaignTasks = [
  { text: 'Build landing page & event registration', icon: Globe },
  { text: 'Build email campaign', icon: Mail },
  { text: 'Send emails to leads', icon: Send },
  { text: 'Confirm guest attendance', icon: Phone },
];

// Contacts for CRM display
const contactsData = [
  { name: 'Sarah Johnson', company: 'TechCorp' },
  { name: 'Mike Chen', company: 'StartupX' },
  { name: 'Emily Davis', company: 'GlobalInc' },
  { name: 'Alex Kim', company: 'MediaHub' },
  { name: 'Jordan Lee', company: 'FinanceOne' }
];

// Email templates
const emailTemplates = [
  { id: 1, name: 'Vibrant Event', gradient: 'from-purple-600 via-pink-500 to-orange-400' },
  { id: 2, name: 'Elegant Minimal', gradient: 'from-slate-700 to-slate-900' },
  { id: 3, name: 'Fresh & Modern', gradient: 'from-teal-500 via-cyan-500 to-blue-500' },
];

// Story content for project and operations (campaign uses full flow)
const storyContent: Record<'project' | 'operations', {
  boardName: string;
  boardColor: string;
  items: { text: string; icon: React.ComponentType<{ className?: string }> }[];
  agentName: string;
  agentDescription: string;
  appName: string;
  appDescription: string;
  sidekickMessages: string[];
}> = {
  project: {
    boardName: 'Project Management',
    boardColor: '#6366f1',
    items: [
      { text: 'Define project scope', icon: Target },
      { text: 'Create timeline', icon: Clock },
      { text: 'Assign team members', icon: Users },
      { text: 'Set milestones', icon: TrendingUp },
    ],
    agentName: 'Project Coordinator',
    agentDescription: 'AI that tracks deadlines and assigns tasks',
    appName: 'Project Dashboard',
    appDescription: 'Real-time project status overview',
    sidekickMessages: [
      "I'll create a Project Management board for you!",
      "Setting up your Project Coordinator AI...",
      "Building your Project Dashboard app with Vibe!"
    ],
  },
  operations: {
    boardName: 'Operations Hub',
    boardColor: '#f59e0b',
    items: [
      { text: 'Inventory management', icon: Package },
      { text: 'Vendor coordination', icon: Users },
      { text: 'Process optimization', icon: Settings },
      { text: 'Resource allocation', icon: BarChart3 },
    ],
    agentName: 'Operations AI',
    agentDescription: 'AI that streamlines your workflows',
    appName: 'Operations Dashboard',
    appDescription: 'Monitor all operations in one place',
    sidekickMessages: [
      "I'll create an Operations Hub board for you!",
      "Setting up your Operations AI agent...",
      "Building your Operations Dashboard with Vibe!"
    ],
  },
};

// Campaign-specific stages (matching Full Story flow)
type CampaignStage = 
  | 'plan-display'
  | 'landing-page'
  | 'email-campaign'
  | 'sending-emails'
  | 'agents-creation'
  | 'agent-calling'
  | 'vibe-building'
  | 'complete';

// Simple stages for project/operations
type SimpleStage = 'board-creation' | 'agent-creation' | 'app-building' | 'complete';

type Stage = 
  | 'intro' 
  | 'user-response'  // User responds in centered view
  | 'intro-options'  // Show options in centered intro view
  | 'transition' 
  | 'split' 
  | 'selected'
  | CampaignStage
  | SimpleStage;

export function SidekickCapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState<Stage>('intro');
  const [introTypingIndex, setIntroTypingIndex] = useState(0);
  const [userTypingIndex, setUserTypingIndex] = useState(0);
  const [sidekickResponseTypingIndex, setSidekickResponseTypingIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Timer for auto-select
  const [countdown, setCountdown] = useState(4);
  const [showCountdown, setShowCountdown] = useState(false);
  
  // Campaign-specific state
  const [landingProgress, setLandingProgress] = useState(0);
  const [emailsSent, setEmailsSent] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [agentProgress, setAgentProgress] = useState(0);
  const [callingContact, setCallingContact] = useState(0);
  const [confirmedContacts, setConfirmedContacts] = useState<number[]>([]);
  const [vibeProgress, setVibeProgress] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  
  // Simple story state (for project/operations)
  const [storyMessageIndex, setStoryMessageIndex] = useState(0);
  const [storyTypingIndex, setStoryTypingIndex] = useState(0);
  const [boardProgress, setBoardProgress] = useState(0);
  const [appProgress, setAppProgress] = useState(0);
  const [completedItems, setCompletedItems] = useState<number[]>([]);
  
  // Typing for campaign messages
  const [campaignMsgIndex, setCampaignMsgIndex] = useState(0);

  const introMessage = "Hey! I'm Sidekick, your AI assistant ✨";
  const userMessageLine1 = "Sounds great!";
  const userMessageLine2 = "Show me what you can do";
  const userMessage = userMessageLine1 + " " + userMessageLine2;
  const sidekickResponseMessage = "Great! Here are some ways I can help:";
  
  // Campaign messages
  const campaignMessages = {
    plan: "I have a plan for your upcoming campaign! Here's what we'll do:",
    landing: "Let me build a landing page for your event...",
    email: "Now let's create an email campaign!",
    sending: "Sending invitations to your leads...",
    agents: "I'll create AI agents to confirm attendance!",
    calling: "Agents are calling to confirm...",
    vibe: "Building an Event Check-in app with Vibe!",
    complete: "Your campaign is ready! Everything is set up."
  };

  const isCentered = stage === 'intro' || stage === 'user-response' || stage === 'intro-options';
  const isSplit = !isCentered;
  
  // Check if running campaign flow
  const isCampaignFlow = selectedOption === 'campaign';
  const currentSimpleStory = selectedOption && selectedOption !== 'campaign' ? storyContent[selectedOption] : null;

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  // Intro typing
  useEffect(() => {
    if (stage !== 'intro' || !hasStarted) return;
    if (introTypingIndex < introMessage.length) {
      const timer = setTimeout(() => setIntroTypingIndex(prev => prev + 1), 40);
      return () => clearTimeout(timer);
    } else {
      // Go to user response
      setTimeout(() => setStage('user-response'), 800);
    }
  }, [stage, introTypingIndex, hasStarted]);

  // User response typing
  useEffect(() => {
    if (stage !== 'user-response') return;
    if (userTypingIndex < userMessage.length) {
      const timer = setTimeout(() => setUserTypingIndex(prev => prev + 1), 40);
      return () => clearTimeout(timer);
    } else {
      // After user response, show options
      setTimeout(() => {
        setStage('intro-options');
        setShowCountdown(true);
      }, 800);
    }
  }, [stage, userTypingIndex]);

  // Auto-select in intro-options
  useEffect(() => {
    if (stage !== 'intro-options' || !showCountdown || selectedOption) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleOptionSelect('campaign');
    }
  }, [stage, showCountdown, countdown, selectedOption]);

  // Transition to split - goes directly to first story stage
  useEffect(() => {
    if (stage !== 'transition') return;
    const timer = setTimeout(() => setStage('split'), 800);
    return () => clearTimeout(timer);
  }, [stage]);

  // Split -> start the story
  useEffect(() => {
    if (stage !== 'split' || !selectedOption) return;
    const timer = setTimeout(() => {
      if (selectedOption === 'campaign') {
        setStage('plan-display');
      } else {
        setStage('board-creation');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [stage, selectedOption]);

  // Handle option selection - go to transition (split view)
  const handleOptionSelect = (optionId: OptionType) => {
    setSelectedOption(optionId);
    setStage('transition');  // Go to transition -> split
    setShowCountdown(false);
    
    // Reset all progress
    setLandingProgress(0);
    setEmailsSent(0);
    setSelectedTemplate(null);
    setAgentProgress(0);
    setCallingContact(0);
    setConfirmedContacts([]);
    setVibeProgress(0);
    setCompletedTasks([]);
    setStoryMessageIndex(0);
    setStoryTypingIndex(0);
    setBoardProgress(0);
    setAppProgress(0);
    setCompletedItems([]);
    setCampaignMsgIndex(0);
  };

  // Note: 'selected' stage is no longer used - transitions go: intro-options -> transition -> split -> story stages
  useEffect(() => {
    if (stage !== 'selected' || !selectedOption) return;
    const timer = setTimeout(() => {
      if (selectedOption === 'campaign') {
        setStage('plan-display');
      } else {
        setStage('board-creation');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [stage, selectedOption]);

  // ===== CAMPAIGN FLOW EFFECTS =====
  
  // Plan display -> Landing page
  useEffect(() => {
    if (stage !== 'plan-display') return;
    const timer = setTimeout(() => {
      setStage('landing-page');
    }, 3000);
    return () => clearTimeout(timer);
  }, [stage]);

  // Landing page progress
  useEffect(() => {
    if (stage !== 'landing-page') return;
    if (landingProgress < 100) {
      const timer = setTimeout(() => setLandingProgress(prev => Math.min(prev + 4, 100)), 80);
      return () => clearTimeout(timer);
    } else {
      setCompletedTasks(prev => [...prev, 0]);
      const timer = setTimeout(() => setStage('email-campaign'), 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, landingProgress]);

  // Email campaign -> auto-select template
  useEffect(() => {
    if (stage !== 'email-campaign') return;
    const timer = setTimeout(() => {
      setSelectedTemplate(1);
      setTimeout(() => {
        setCompletedTasks(prev => [...prev, 1]);
        setStage('sending-emails');
      }, 1000);
    }, 2000);
    return () => clearTimeout(timer);
  }, [stage]);

  // Sending emails
  useEffect(() => {
    if (stage !== 'sending-emails') return;
    if (emailsSent < 5) {
      const timer = setTimeout(() => setEmailsSent(prev => prev + 1), 600);
      return () => clearTimeout(timer);
    } else {
      setCompletedTasks(prev => [...prev, 2]);
      const timer = setTimeout(() => setStage('agents-creation'), 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, emailsSent]);

  // Agents creation
  useEffect(() => {
    if (stage !== 'agents-creation') return;
    if (agentProgress < 100) {
      const timer = setTimeout(() => setAgentProgress(prev => Math.min(prev + 5, 100)), 50);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setStage('agent-calling'), 800);
      return () => clearTimeout(timer);
    }
  }, [stage, agentProgress]);

  // Agent calling
  useEffect(() => {
    if (stage !== 'agent-calling') return;
    if (confirmedContacts.length < 3) {
      const timer = setTimeout(() => {
        setCallingContact(confirmedContacts.length);
        setTimeout(() => {
          setConfirmedContacts(prev => [...prev, prev.length]);
        }, 800);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setCompletedTasks(prev => [...prev, 3]);
      const timer = setTimeout(() => setStage('vibe-building'), 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, confirmedContacts]);

  // Vibe building
  useEffect(() => {
    if (stage !== 'vibe-building') return;
    if (vibeProgress < 100) {
      const timer = setTimeout(() => setVibeProgress(prev => Math.min(prev + 4, 100)), 80);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setStage('complete'), 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, vibeProgress]);

  // ===== SIMPLE STORY FLOW EFFECTS (project/operations) =====
  
  // Story message typing
  useEffect(() => {
    if (!currentSimpleStory) return;
    const currentMessage = currentSimpleStory.sidekickMessages[storyMessageIndex];
    if (!currentMessage) return;
    
    if (stage === 'board-creation' && storyMessageIndex !== 0) return;
    if (stage === 'agent-creation' && storyMessageIndex !== 1) return;
    if (stage === 'app-building' && storyMessageIndex !== 2) return;
    
    if (storyTypingIndex < currentMessage.length) {
      const timer = setTimeout(() => setStoryTypingIndex(prev => prev + 1), 25);
      return () => clearTimeout(timer);
    }
  }, [stage, storyTypingIndex, currentSimpleStory, storyMessageIndex]);

  // Board creation
  useEffect(() => {
    if (stage !== 'board-creation' || !currentSimpleStory) return;
    const currentMessage = currentSimpleStory.sidekickMessages[0];
    if (storyTypingIndex < currentMessage.length) return;
    
    if (boardProgress < 100) {
      const timer = setTimeout(() => setBoardProgress(prev => Math.min(prev + 4, 100)), 50);
      return () => clearTimeout(timer);
    } else if (completedItems.length < 4) {
      const timer = setTimeout(() => {
        setCompletedItems(prev => [...prev, prev.length]);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setStage('agent-creation');
        setStoryMessageIndex(1);
        setStoryTypingIndex(0);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [stage, currentSimpleStory, boardProgress, completedItems, storyTypingIndex]);

  // Agent creation (simple)
  useEffect(() => {
    if (stage !== 'agent-creation' || !currentSimpleStory) return;
    const currentMessage = currentSimpleStory.sidekickMessages[1];
    if (storyTypingIndex < currentMessage.length) return;
    
    if (agentProgress < 100) {
      const timer = setTimeout(() => setAgentProgress(prev => Math.min(prev + 5, 100)), 40);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setStage('app-building');
        setStoryMessageIndex(2);
        setStoryTypingIndex(0);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [stage, currentSimpleStory, agentProgress, storyTypingIndex]);

  // App building (simple)
  useEffect(() => {
    if (stage !== 'app-building' || !currentSimpleStory) return;
    const currentMessage = currentSimpleStory.sidekickMessages[2];
    if (storyTypingIndex < currentMessage.length) return;
    
    if (appProgress < 100) {
      const timer = setTimeout(() => setAppProgress(prev => Math.min(prev + 4, 100)), 50);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setStage('complete'), 800);
      return () => clearTimeout(timer);
    }
  }, [stage, currentSimpleStory, appProgress, storyTypingIndex]);

  // Reset after complete
  useEffect(() => {
    if (stage !== 'complete') return;
    const timer = setTimeout(() => {
      setStage('intro');
      setIntroTypingIndex(0);
      setUserTypingIndex(0);
      setSidekickResponseTypingIndex(0);
      setSelectedOption(null);
      setCountdown(4);
      setShowCountdown(false);
      setLandingProgress(0);
      setEmailsSent(0);
      setSelectedTemplate(null);
      setAgentProgress(0);
      setCallingContact(0);
      setConfirmedContacts([]);
      setVibeProgress(0);
      setCompletedTasks([]);
      setStoryMessageIndex(0);
      setStoryTypingIndex(0);
      setBoardProgress(0);
      setAppProgress(0);
      setCompletedItems([]);
      setCampaignMsgIndex(0);
    }, 3500);
    return () => clearTimeout(timer);
  }, [stage]);

  // ===== RENDER FUNCTIONS =====

  // Render Campaign Board (left side)
  const renderCampaignBoard = () => {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full overflow-hidden">
        {/* Board Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <img src={workManagementLogo} alt="Work Management" className="h-8 object-contain" />
          <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live
          </div>
        </div>
        
        {/* Tasks List */}
        <div className="p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700 mb-3">Campaign Tasks</p>
          {campaignTasks.map((task, i) => {
            const Icon = task.icon;
            const isComplete = completedTasks.includes(i);
            const isCurrent = completedTasks.length === i;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isComplete ? 'bg-green-50 border border-green-200' : 
                  isCurrent ? 'bg-indigo-50 border border-indigo-200' : 
                  'bg-gray-50 border border-gray-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isComplete ? 'bg-green-500' : isCurrent ? 'bg-indigo-500' : 'bg-gray-200'
                }`}>
                  {isComplete ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-gray-400'}`} />
                  )}
                </div>
                <span className={`text-sm ${
                  isComplete ? 'text-green-700 line-through' : 
                  isCurrent ? 'text-indigo-700 font-medium' : 
                  'text-gray-500'
                }`}>
                  {task.text}
                </span>
              </motion.div>
            );
          })}
        </div>
        
        {/* Progress Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Progress</span>
            <span>{completedTasks.length}/4 tasks</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(completedTasks.length / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Render Campaign Stage Content (landing page, emails, etc.)
  const renderCampaignStageContent = () => {
    switch (stage) {
      case 'landing-page':
        return (
          <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Building Landing Page</h4>
                <div className="h-1.5 bg-gray-100 rounded-full w-32 mt-1 overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${landingProgress}%` }}
                  />
                </div>
              </div>
            </div>
            {/* Landing page preview skeleton */}
            <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-xl p-4 h-32 relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-white/10"
                initial={{ x: '-100%' }}
                animate={{ x: landingProgress >= 100 ? '100%' : '-100%' }}
                transition={{ duration: 1 }}
              />
              <div className="text-center text-white">
                <Sparkles className="w-8 h-8 mx-auto mb-2" />
                <p className="font-bold">You're Invited!</p>
                <p className="text-sm opacity-80">Annual Event 2026</p>
              </div>
            </div>
            {landingProgress >= 100 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 text-green-600"
              >
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Landing page ready!</span>
              </motion.div>
            )}
          </div>
        );
        
      case 'email-campaign':
        return (
          <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Choose Email Template</h4>
                <p className="text-xs text-gray-500">Select your design</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {emailTemplates.map((template, i) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: selectedTemplate === template.id ? 1.05 : 1 
                  }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative rounded-lg overflow-hidden cursor-pointer ${
                    selectedTemplate === template.id ? 'ring-2 ring-pink-500' : ''
                  }`}
                >
                  <div className={`bg-gradient-to-br ${template.gradient} p-3 h-20 flex items-center justify-center`}>
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="p-2 bg-gray-50 text-center">
                    <p className="text-xs font-medium text-gray-700">{template.name}</p>
                  </div>
                  {selectedTemplate === template.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );
        
      case 'sending-emails':
        return (
          <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Sending Invitations</h4>
                <p className="text-xs text-gray-500">{emailsSent}/5 emails sent</p>
              </div>
            </div>
            <div className="space-y-2">
              {contactsData.map((contact, i) => {
                const isSent = emailsSent > i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      backgroundColor: isSent ? '#f0fdf4' : '#f9fafb'
                    }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                      {contact.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.company}</p>
                    </div>
                    {isSent && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check className="w-4 h-4 text-green-500" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
        
      case 'agents-creation':
        return (
          <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 w-full">
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center"
                animate={{ rotate: agentProgress < 100 ? [0, 10, -10, 0] : 0 }}
                transition={{ repeat: agentProgress < 100 ? Infinity : 0, duration: 1 }}
              >
                <Bot className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Creating AI Agents</h4>
                <p className="text-xs text-gray-500">RSVP Confirmation Agent</p>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${agentProgress}%` }}
              />
            </div>
            {agentProgress >= 100 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 text-green-600"
              >
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Agent ready!</span>
              </motion.div>
            )}
          </div>
        );
        
      case 'agent-calling':
        return (
          <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Confirming Attendance</h4>
                <p className="text-xs text-gray-500">{confirmedContacts.length}/3 confirmed</p>
              </div>
            </div>
            <div className="space-y-2">
              {contactsData.slice(0, 3).map((contact, i) => {
                const isConfirmed = confirmedContacts.includes(i);
                const isCalling = callingContact === i && !isConfirmed;
                return (
                  <motion.div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      isConfirmed ? 'bg-green-50' : isCalling ? 'bg-yellow-50' : 'bg-gray-50'
                    }`}
                    animate={{ scale: isCalling ? [1, 1.02, 1] : 1 }}
                    transition={{ repeat: isCalling ? Infinity : 0, duration: 0.5 }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      isConfirmed ? 'bg-green-500 text-white' : isCalling ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isConfirmed ? <Check className="w-4 h-4" /> : contact.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{contact.name}</p>
                      <p className="text-xs text-gray-500">
                        {isConfirmed ? 'Confirmed!' : isCalling ? 'Calling...' : 'Pending'}
                      </p>
                    </div>
                    {isCalling && (
                      <Phone className="w-4 h-4 text-yellow-600 animate-pulse" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
        
      case 'vibe-building':
        return (
          <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 w-full">
            <div className="flex items-center gap-3 mb-4">
              <img src={vibeLogo} alt="Vibe" className="w-10 h-10 rounded-xl" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Building with Vibe</h4>
                <p className="text-xs text-gray-500">Event Check-in App</p>
              </div>
            </div>
            
            {/* App preview */}
            <div className="bg-gray-900 rounded-xl p-3 space-y-2">
              <motion.div 
                className="h-3 bg-purple-500/30 rounded"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: vibeProgress > 20 ? 1 : 0 }}
                style={{ transformOrigin: 'left' }}
              />
              <div className="flex gap-2">
                {[1, 2, 3].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="flex-1 h-14 bg-gray-700 rounded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: vibeProgress > 40 + i * 15 ? 1 : 0 }}
                  />
                ))}
              </div>
              <motion.div 
                className="h-8 bg-purple-500 rounded-lg flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: vibeProgress > 90 ? 1 : 0 }}
              >
                <span className="text-white text-xs font-medium">Check In</span>
              </motion.div>
            </div>
            
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Building...</span>
                <span>{vibeProgress}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${vibeProgress}%` }}
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Render Simple Board (project/operations)
  const renderSimpleBoard = () => {
    if (!currentSimpleStory) return null;
    return (
      <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 w-full">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${currentSimpleStory.boardColor}, ${currentSimpleStory.boardColor}dd)` }}
          >
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{currentSimpleStory.boardName}</h4>
            <div className="h-1.5 bg-gray-100 rounded-full w-32 mt-1 overflow-hidden">
              <motion.div 
                className="h-full rounded-full"
                style={{ background: currentSimpleStory.boardColor }}
                initial={{ width: 0 }}
                animate={{ width: `${boardProgress}%` }}
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {currentSimpleStory.items.map((item, i) => {
            const Icon = item.icon;
            const isComplete = completedItems.includes(i);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: boardProgress > i * 20 ? 1 : 0.3, 
                  x: boardProgress > i * 20 ? 0 : -10 
                }}
                className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                  isComplete ? 'bg-green-50' : 'bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" style={{ color: isComplete ? '#10b981' : currentSimpleStory.boardColor }} />
                <span className={`text-sm ${isComplete ? 'text-green-700' : 'text-gray-600'}`}>{item.text}</span>
                {isComplete && <Check className="w-4 h-4 text-green-500 ml-auto" />}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Simple Agent (project/operations)
  const renderSimpleAgent = () => {
    if (!currentSimpleStory) return null;
    return (
      <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 w-full">
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${currentSimpleStory.boardColor}, #a855f7)` }}
            animate={{ rotate: agentProgress < 100 ? [0, 10, -10, 0] : 0 }}
            transition={{ repeat: agentProgress < 100 ? Infinity : 0, duration: 1 }}
          >
            <Bot className="w-6 h-6 text-white" />
          </motion.div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">{currentSimpleStory.agentName}</h4>
            <p className="text-xs text-gray-500">{currentSimpleStory.agentDescription}</p>
          </div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${agentProgress}%` }}
          />
        </div>
        {agentProgress >= 100 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 text-green-600"
          >
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Agent ready!</span>
          </motion.div>
        )}
      </div>
    );
  };

  // Render Simple App (project/operations)
  const renderSimpleApp = () => {
    if (!currentSimpleStory) return null;
    return (
      <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 w-full">
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500"
            animate={{ scale: appProgress < 100 ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: appProgress < 100 ? Infinity : 0, duration: 0.8 }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">{currentSimpleStory.appName}</h4>
            <p className="text-xs text-gray-500">{currentSimpleStory.appDescription}</p>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-3 space-y-2">
          <motion.div 
            className="h-3 bg-purple-500/30 rounded"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: appProgress > 20 ? 1 : 0 }}
            style={{ transformOrigin: 'left' }}
          />
          <div className="flex gap-2">
            {[1, 2, 3].map((_, i) => (
              <motion.div 
                key={i}
                className="flex-1 h-16 bg-gray-700 rounded"
                initial={{ opacity: 0 }}
                animate={{ opacity: appProgress > 40 + i * 15 ? 1 : 0 }}
              />
            ))}
          </div>
          <motion.div 
            className="h-8 bg-purple-500 rounded-lg flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: appProgress > 90 ? 1 : 0 }}
          >
            <span className="text-white text-xs font-medium">Launch App</span>
          </motion.div>
        </div>
        
        {appProgress >= 100 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 text-green-600"
          >
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">App ready!</span>
          </motion.div>
        )}
      </div>
    );
  };

  // Render Complete
  const renderComplete = () => {
    const storyName = isCampaignFlow ? 'Marketing Campaign' : currentSimpleStory?.boardName || '';
    return (
      <motion.div 
        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-xl border border-green-200 w-full text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <motion.div 
          className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
        >
          <Check className="w-8 h-8 text-white" />
        </motion.div>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">All Set!</h4>
        <p className="text-sm text-gray-600">
          Your {storyName} is ready to go!
        </p>
      </motion.div>
    );
  };

  // Get current Sidekick message
  const getCurrentSidekickMessage = () => {
    if (isCampaignFlow) {
      switch (stage) {
        case 'plan-display': return campaignMessages.plan;
        case 'landing-page': return campaignMessages.landing;
        case 'email-campaign': return campaignMessages.email;
        case 'sending-emails': return campaignMessages.sending;
        case 'agents-creation': return campaignMessages.agents;
        case 'agent-calling': return campaignMessages.calling;
        case 'vibe-building': return campaignMessages.vibe;
        case 'complete': return campaignMessages.complete;
        default: return '';
      }
    } else if (currentSimpleStory) {
      return currentSimpleStory.sidekickMessages[storyMessageIndex]?.slice(0, storyTypingIndex) || '';
    }
    return '';
  };

  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden select-none"
      style={{ height: '100vh', width: '100vw', background: '#ffffff' }}
    >
      {/* CENTERED INTRO LAYOUT */}
      <AnimatePresence>
        {isCentered && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-8"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Sidekick Logo */}
            <motion.div 
              className="mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: hasStarted ? 1 : 0.8, opacity: hasStarted ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div 
                className="w-20 h-20"
                style={{ 
                  boxShadow: '0 4px 30px rgba(99, 102, 241, 0.4)',
                  borderRadius: '20px',
                }}
              >
                <img src={sidekickLogo} alt="Sidekick" className="w-full h-full object-contain rounded-xl" />
              </div>
            </motion.div>
            
            {/* Conversation - centered */}
            <div className="space-y-4 max-w-lg w-full">
              {/* Sidekick intro message */}
              <motion.div 
                className="rounded-2xl px-6 py-4 shadow-lg"
                style={{
                  background: 'linear-gradient(to right, #6366f1, #a855f7)',
                  boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: hasStarted ? 1 : 0, y: hasStarted ? 0 : 20 }}
              >
                <p className="text-white text-xl" style={{ fontWeight: 500 }}>
                  {introMessage.slice(0, introTypingIndex)}
                  {stage === 'intro' && introTypingIndex === 0 && (
                    <span className="inline-flex items-center gap-1">
                      <span className="animate-pulse">|</span>
                      <img src={sidekickIcon} alt="" className="inline-block w-5 h-5 animate-pulse" />
                    </span>
                  )}
                  {stage === 'intro' && introTypingIndex > 0 && introTypingIndex < introMessage.length && (
                    <span className="animate-pulse">|</span>
                  )}
                </p>
              </motion.div>
              
              {/* User response in centered view */}
              {(stage === 'user-response' || stage === 'intro-options') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-3 justify-end"
                >
                  <motion.div
                    className="rounded-2xl rounded-br-md px-5 py-3 shadow-sm"
                    style={{ background: '#e5e7eb' }}
                  >
                    <p style={{ color: '#374151' }} className="text-lg">
                      {stage === 'user-response' ? (
                        // Typing animation
                        userTypingIndex <= userMessageLine1.length ? (
                          <>
                            {userMessageLine1.slice(0, userTypingIndex)}
                            {userTypingIndex < userMessage.length && (
                              <span className="animate-pulse">|</span>
                            )}
                          </>
                        ) : (
                          <>
                            {userMessageLine1}
                            <br />
                            {userMessageLine2.slice(0, userTypingIndex - userMessageLine1.length - 1)}
                            {userTypingIndex < userMessage.length && (
                              <span className="animate-pulse">|</span>
                            )}
                          </>
                        )
                      ) : (
                        // Static display after typing complete
                        <>
                          {userMessageLine1}
                          <br />
                          {userMessageLine2}
                        </>
                      )}
                    </p>
                  </motion.div>
                  <img 
                    src={userAvatarIntro} 
                    alt="User" 
                    className="w-14 h-14 rounded-full object-cover shadow-lg flex-shrink-0"
                  />
                </motion.div>
              )}
              
              {/* Options in intro - centered view */}
              {stage === 'intro-options' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3 w-full"
                >
                  {sidekickOptions.map((option, i) => {
                    const Icon = option.icon;
                    const isSelected = selectedOption === option.id;
                    return (
                      <motion.button
                        key={option.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i, duration: 0.3 }}
                        onClick={() => handleOptionSelect(option.id)}
                        disabled={selectedOption !== null}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all text-left ${
                          isSelected 
                            ? 'border-indigo-500 bg-indigo-50' 
                            : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-lg'
                        }`}
                        style={{ 
                          boxShadow: isSelected 
                            ? '0 8px 20px rgba(99, 102, 241, 0.3)' 
                            : '0 2px 10px rgba(0, 0, 0, 0.08)' 
                        }}
                      >
                        <div 
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-indigo-500' : 'bg-gradient-to-br from-gray-50 to-gray-100'
                          }`} 
                          style={{ 
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: isSelected ? 'none' : `2px solid ${option.color}20`
                          }}
                        >
                          <Icon className="w-6 h-6" style={{ color: isSelected ? '#ffffff' : option.color }} />
                        </div>
                        <span className={`font-semibold text-lg ${isSelected ? 'text-indigo-700' : 'text-gray-700'}`}>
                          {option.label}
                        </span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto"
                          >
                            <Check className="w-6 h-6 text-indigo-500" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SPLIT LAYOUT */}
      <AnimatePresence>
        {isSplit && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center gap-16 px-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* LEFT SIDE - User & Board */}
            <motion.div
              className="flex flex-col items-center justify-center"
              style={{ width: '42%', maxWidth: '460px', flexShrink: 0 }}
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              {/* User selection message */}
              <div className="flex items-end gap-3 mb-6">
                <img 
                  src={userAvatarIntro} 
                  alt="User" 
                  className="w-14 h-14 rounded-full object-cover shadow-xl flex-shrink-0"
                />
                <motion.div
                  className="rounded-2xl rounded-bl-md px-4 py-3 shadow-lg"
                  style={{ background: '#e5e7eb' }}
                >
                  <p style={{ color: '#374151' }} className="text-base font-medium">
                    {selectedOption && sidekickOptions.find(o => o.id === selectedOption)?.label}
                  </p>
                </motion.div>
              </div>

              {/* Simple status indicator */}
              <AnimatePresence mode="wait">
                {(stage === 'split' || stage === 'transition') && (
                  <motion.div
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-gray-400"
                  >
                    <Zap className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Getting ready...</p>
                  </motion.div>
                )}
                
                {selectedOption && stage !== 'split' && stage !== 'transition' && (
                  <motion.div
                    key="working"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg"
                      animate={{ scale: stage === 'complete' ? 1 : [1, 1.05, 1] }}
                      transition={{ repeat: stage === 'complete' ? 0 : Infinity, duration: 1.5 }}
                    >
                      {stage === 'complete' ? (
                        <Check className="w-8 h-8 text-white" />
                      ) : (
                        <Sparkles className="w-8 h-8 text-white" />
                      )}
                    </motion.div>
                    <p className="text-gray-600 font-medium">
                      {stage === 'complete' ? 'All done!' : 'Sidekick is working...'}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {sidekickOptions.find(o => o.id === selectedOption)?.label}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* RIGHT SIDE - Sidekick Panel */}
            <motion.div
              className="flex items-center justify-center"
              style={{ width: '48%', maxWidth: '520px', flexShrink: 0 }}
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            >
              <motion.div
                className="rounded-2xl overflow-hidden w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ 
                  background: 'linear-gradient(135deg, #ec4899, #a855f7, #f59e0b)',
                  padding: '3px',
                  boxShadow: '0 0 50px rgba(236, 72, 153, 0.15)',
                }}
              >
                <div 
                  className="rounded-[14px] flex flex-col p-5"
                  style={{ 
                    background: '#ffffff',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    minHeight: '550px',
                  }}
                >
                  {/* Sidekick Header */}
                  <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <img src={sidekickLogo} alt="Sidekick" className="w-10 h-10 rounded-xl" />
                    <div>
                      <h3 className="text-gray-900 font-semibold">Sidekick</h3>
                      <p className="text-gray-500 text-sm">AI Assistant</p>
                    </div>
                  </div>

                  {/* Messages area */}
                  <div className="flex-1 flex flex-col">
                    {/* Getting ready message */}
                    {(stage === 'split' || stage === 'transition') && (
                      <div className="mb-4">
                        <div 
                          className="rounded-xl px-4 py-3"
                          style={{ 
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                          }}
                        >
                          <p className="text-white text-sm font-medium">
                            {selectedOption ? `Great choice! Let me help you ${sidekickOptions.find(o => o.id === selectedOption)?.label.toLowerCase()}...` : 'Getting ready...'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Story messages */}
                    {(stage !== 'split' && stage !== 'transition' && stage !== 'intro' && stage !== 'intro-options' && selectedOption) && (
                      <div className="mb-4">
                        <div 
                          className="rounded-xl px-4 py-3"
                          style={{ 
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                          }}
                        >
                          <p className="text-white text-sm font-medium">
                            {getCurrentSidekickMessage()}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Stage content - all stages render here */}
                    <AnimatePresence mode="wait">
                      {/* Campaign stages */}
                      {stage === 'plan-display' && isCampaignFlow && (
                        <motion.div
                          key="plan"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex-1"
                        >
                          {renderCampaignBoard()}
                        </motion.div>
                      )}
                      
                      {(stage === 'landing-page' || stage === 'email-campaign' || stage === 'sending-emails' || 
                        stage === 'agents-creation' || stage === 'agent-calling' || stage === 'vibe-building') && 
                        isCampaignFlow && (
                        <motion.div
                          key={stage}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex-1"
                        >
                          {renderCampaignStageContent()}
                        </motion.div>
                      )}
                      
                      {/* Simple story stages */}
                      {stage === 'board-creation' && !isCampaignFlow && (
                        <motion.div
                          key="board"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex-1"
                        >
                          {renderSimpleBoard()}
                        </motion.div>
                      )}
                      
                      {stage === 'agent-creation' && !isCampaignFlow && (
                        <motion.div
                          key="agent"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex-1"
                        >
                          {renderSimpleAgent()}
                        </motion.div>
                      )}
                      
                      {stage === 'app-building' && !isCampaignFlow && (
                        <motion.div
                          key="app"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex-1"
                        >
                          {renderSimpleApp()}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Completion message */}
                    {stage === 'complete' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-auto"
                      >
                        <div 
                          className="rounded-xl px-4 py-3 text-center"
                          style={{ 
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                          }}
                        >
                          <p className="text-white text-sm font-medium flex items-center justify-center gap-2">
                            <Check className="w-4 h-4" />
                            Everything is ready!
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
