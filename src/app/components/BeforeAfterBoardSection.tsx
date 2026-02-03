import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Zap, Mail, Users, Phone, Sparkles, PhoneCall, Globe, FileText, Calendar, MapPin, Pause, Play, Send } from 'lucide-react';
import { useHeroSidekickTheme } from '@/contexts/SidekickThemeContext';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';
import agentsLogo from '@/assets/99be461a455ae49743d963276e2023ed6cd1445d.png';
import mondayAgentsLogo from '@/assets/agents-logo-new.png';
import vibeLogo from '@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png';
import workManagementLogo from '@/assets/monday-work-management-logo.png';
import crmLogo from '@/assets/monday-crm-logo-new.png';
import campaignsLogo from '@/assets/monday-campaigns-logo-new.png';
// Agent images from assets
import agentImage1 from '@/assets/053936dfeea2ccad575c77f11dabe02cb2e01b92.png';
import agentImage2 from '@/assets/f158e4bd7406bb7f1accf54fb06c7de8cfd09e48.png';
import agentImage3 from '@/assets/552ed6ec83999a43766184b9ddf41b03d687acdf.png';
import agentImageSales from '@/assets/c7005ced01914c6b1f5e7c0f86f6d5e4e22d3e9f.png';
// Additional agent images
import salesAgent1 from '@/assets/1a6545c2a20393d4de191bc3df98cac4c2b88431.png';
// User avatar for Sidekick intro conversation - uses the woman with glasses image
import userAvatarIntro from '@/assets/c7005ced01914c6b1f5e7c0f86f6d5e4e22d3e9f.png';
// Marketing RSVP Agent image
const marketingRsvpAgent = 'https://fymyrxqjmnekcmrpvtju.supabase.co/storage/v1/object/public/Agents/Frame%202147238712.png';

interface BeforeAfterBoardSectionProps {
  onExplore?: () => void;
}

// Tasks configuration - matches the event planning flow
const tasks = [
  { text: 'Build landing page & event registration' },
  { text: 'Build email campaign' },
  { text: 'Create design / creative' },
  { text: 'Send emails to leads' },
  { text: 'Confirm guest attendance' },
  { text: 'Send event results report to CMO' },
];

// Stage types for the complete flow
type Stage = 
  | 'intro' 
  | 'user-response'
  | 'context-response'
  | 'context-recognition'
  | 'landing-page' 
  | 'landing-page-done'
  | 'email-campaign' 
  | 'design-selection' 
  | 'email-preview'
  | 'sending-emails' 
  | 'attendance-request' 
  | 'agents-creation' 
  | 'agent-calling' 
  | 'agent-board-calling'
  | 'vibe-request'
  | 'vibe-building'
  | 'report';

// Stage grouping for progress indicator - maps stages to 6 main chapters
const stageGroups: Record<number, Stage[]> = {
  1: ['intro', 'user-response', 'context-response', 'context-recognition'],
  2: ['landing-page', 'landing-page-done'],
  3: ['email-campaign', 'design-selection', 'email-preview', 'sending-emails'],
  4: ['attendance-request', 'agents-creation', 'agent-calling', 'agent-board-calling'],
  5: ['vibe-request', 'vibe-building'],
  6: ['report']
};

// User-friendly labels for each stage group
const stageLabels: Record<number, string> = {
  1: "Getting started...",
  2: "Building your landing page...",
  3: "Creating email campaign...",
  4: "Setting up AI agents...",
  5: "Creating with Vibe...",
  6: "Generating insights..."
};

// Helper function to get current step from stage
const getCurrentStep = (stage: Stage): number => {
  for (const [step, stages] of Object.entries(stageGroups)) {
    if (stages.includes(stage)) return parseInt(step);
  }
  return 1;
};

// Board types
type BoardType = 'work-management' | 'crm' | 'agents' | 'agents-creation' | 'vibe' | 'campaigns';

// Contacts data for CRM board
const contactsData = [
  { name: 'Sarah Johnson', company: 'TechCorp', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  { name: 'Mike Chen', company: 'StartupX', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { name: 'Emily Davis', company: 'GlobalInc', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  { name: 'Alex Kim', company: 'MediaHub', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  { name: 'Jordan Lee', company: 'FinanceOne', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' }
];

export function BeforeAfterBoardSection({ onExplore }: BeforeAfterBoardSectionProps) {
  // Get theme and loading state from context
  const { theme: sidekickTheme, isLoading: themeLoading } = useHeroSidekickTheme();
  
  // Ref for intersection observer
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const [stage, setStage] = useState<Stage>('intro');
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [introTypingIndex, setIntroTypingIndex] = useState(0);
  const [landingProgress, setLandingProgress] = useState(0);
  const [showLandingSuccess, setShowLandingSuccess] = useState(false);
  const [emailsSent, setEmailsSent] = useState(0);
  const [confirmedContacts, setConfirmedContacts] = useState<number[]>([]);
  const [agentProgress, setAgentProgress] = useState(0);
  const [vibeProgress, setVibeProgress] = useState(0);
  const [reportProgress, setReportProgress] = useState(0);
  const [callMessageIndex, setCallMessageIndex] = useState(0);
  const [designSelected, setDesignSelected] = useState(false);
  
  // Board calling state (for last 2 leads)
  const [boardCallingIndex, setBoardCallingIndex] = useState(3); // Start with lead index 3
  const [boardCallTimer, setBoardCallTimer] = useState(0);
  
  // Pause state
  const [isPaused, setIsPaused] = useState(false);

  // All conversation messages
  const introMessage = sidekickTheme.introMessage || "Hey! I'm Sidekick, your AI assistant ✨";
  const userResponseMessage = "Cool, what can you do for me?";
  const contextResponseMessage = "I see you have an event coming up!";
  const contextMessage = "I have a suggestion for your upcoming event";
  const emailUserMessage = "Great! Now let's send out the invitations";
  const emailSidekickMessage = "I'll create an email campaign for you!";
  const attendanceUserMessage = "Can you help me confirm attendance for the event?";
  const attendanceSidekickMessage = "Sure! Let me create AI agents to call and confirm attendance.";
  const vibeUserMessage = "I need an app to check in attendees at the event";
  const vibeSidekickMessage = "I'll build an Event Map app with Vibe!";
  const callMessage = "Hi! Will you be joining us for the marketing event?";
  
  // Typing state for all conversations
  const [userTypingIndex, setUserTypingIndex] = useState(0);
  const [contextTypingIndex, setContextTypingIndex] = useState(0);
  const [showVibeUserResponse, setShowVibeUserResponse] = useState(false);
  const [vibeUserResponseTypingIndex, setVibeUserResponseTypingIndex] = useState(0);
  const [showBoardAfterPlan, setShowBoardAfterPlan] = useState(false);
  const vibeUserResponseMessage = "Yes, let's start with the landing page";
  const [landingDoneSidekickTypingIndex, setLandingDoneSidekickTypingIndex] = useState(0);
  const [showLandingDoneUserResponse, setShowLandingDoneUserResponse] = useState(false);
  const [landingDoneUserTypingIndex, setLandingDoneUserTypingIndex] = useState(0);
  const landingDoneSidekickMessage = "The landing page is ready! Would you like to make any changes?";
  const landingDoneUserMessage = "It's perfect! Let's continue with the plan";
  const [emailUserTypingIndex, setEmailUserTypingIndex] = useState(0);
  const [emailSidekickTypingIndex, setEmailSidekickTypingIndex] = useState(0);
  const [attendanceUserTypingIndex, setAttendanceUserTypingIndex] = useState(0);
  const [attendanceSidekickTypingIndex, setAttendanceSidekickTypingIndex] = useState(0);
  const [vibeUserTypingIndex, setVibeUserTypingIndex] = useState(0);
  const [vibeSidekickTypingIndex, setVibeSidekickTypingIndex] = useState(0);

  // Determine current board type based on stage
  const getCurrentBoard = (): BoardType => {
    if (stage === 'design-selection' || stage === 'email-preview') {
      return 'campaigns';
    }
    if (stage === 'sending-emails') {
      return 'crm';
    }
    if (stage === 'agents-creation') {
      return 'agents-creation';
    }
    if (stage === 'agent-calling' || stage === 'agent-board-calling') {
      return 'agents';
    }
    // Vibe building stays on work-management - app appears only in Sidekick
    return 'work-management';
  };

  // Get current active task index based on stage
  const getCurrentTaskIndex = (): number => {
    switch (stage) {
      case 'intro': return -1;
      case 'user-response': return -1;
      case 'context-response': return -1;
      case 'context-recognition': return -1;
      case 'landing-page': return 0;
      case 'landing-page-done': return 0;
      case 'email-campaign': return 1;
      case 'design-selection': return 2;
      case 'email-preview': return 3;
      case 'sending-emails': return 3;
      case 'attendance-request': return 4;
      case 'agents-creation': return 4;
      case 'agent-calling': return 4;
      case 'agent-board-calling': return 4;
      case 'vibe-request': return 4;
      case 'vibe-building': return 4;
      case 'report': return 5;
      default: return -1;
    }
  };

  // Navigate to a specific stage (for pagination clicks)
  const navigateToStage = (targetStage: string) => {
    // Pause the animation first
    setIsPaused(true);
    
    // Reset all typing indices
    setIntroTypingIndex(0);
    setUserTypingIndex(0);
    setContextTypingIndex(0);
    setShowVibeUserResponse(false);
    setVibeUserResponseTypingIndex(0);
    setShowBoardAfterPlan(false);
    setLandingDoneSidekickTypingIndex(0);
    setShowLandingDoneUserResponse(false);
    setLandingDoneUserTypingIndex(0);
    setEmailUserTypingIndex(0);
    setEmailSidekickTypingIndex(0);
    setAttendanceUserTypingIndex(0);
    setAttendanceSidekickTypingIndex(0);
    setVibeUserTypingIndex(0);
    setVibeSidekickTypingIndex(0);
    setCallMessageIndex(0);
    
    // Reset progress based on target stage
    const stageOrder = ['intro', 'user-response', 'context-response', 'context-recognition', 'landing-page', 'landing-page-done', 'email-campaign', 'design-selection', 'email-preview', 'sending-emails', 'attendance-request', 'agents-creation', 'agent-calling', 'agent-board-calling', 'vibe-request', 'vibe-building', 'report'];
    const targetIndex = stageOrder.indexOf(targetStage);
    
    // Set completed tasks based on target stage
    // Also set showBoardAfterPlan based on target stage
    if (targetIndex <= stageOrder.indexOf('context-recognition')) {
      setCompletedTasks([]);
      setLandingProgress(0);
      setShowLandingSuccess(false);
      setEmailsSent(0);
      setConfirmedContacts([]);
      setAgentProgress(0);
      setVibeProgress(0);
      setReportProgress(0);
      // Board should not be visible when navigating to context-recognition
      setShowBoardAfterPlan(false);
    } else if (targetIndex <= stageOrder.indexOf('landing-page-done')) {
      // Board should be visible for stages after context-recognition
      setShowBoardAfterPlan(true);
      setCompletedTasks([]);
      setLandingProgress(targetStage === 'landing-page' ? 0 : 100);
      setEmailsSent(0);
      setConfirmedContacts([]);
      setAgentProgress(0);
      setVibeProgress(0);
      setReportProgress(0);
    } else if (targetIndex <= stageOrder.indexOf('sending-emails')) {
      setCompletedTasks([0]);
      setLandingProgress(100);
      setEmailsSent(targetStage === 'sending-emails' ? 0 : 0);
      setConfirmedContacts([]);
      setAgentProgress(0);
      setVibeProgress(0);
      setReportProgress(0);
    } else if (targetIndex <= stageOrder.indexOf('agent-board-calling')) {
      setCompletedTasks([0, 1, 2, 3]);
      setLandingProgress(100);
      setEmailsSent(150);
      setConfirmedContacts([]);
      setAgentProgress(0);
      setVibeProgress(0);
      setReportProgress(0);
    } else if (targetIndex <= stageOrder.indexOf('vibe-building')) {
      setCompletedTasks([0, 1, 2, 3, 4]);
      setLandingProgress(100);
      setEmailsSent(150);
      setConfirmedContacts([0, 1, 2]);
      setAgentProgress(100);
      setVibeProgress(targetStage === 'vibe-building' ? 0 : 0);
      setReportProgress(0);
    } else {
      setCompletedTasks([0, 1, 2, 3, 4, 5]);
      setLandingProgress(100);
      setEmailsSent(150);
      setConfirmedContacts([0, 1, 2]);
      setAgentProgress(100);
      setVibeProgress(100);
      setReportProgress(0);
    }
    
    // Set the target stage
    setStage(targetStage as any);
    
    // Resume after a short delay
    setTimeout(() => setIsPaused(false), 100);
  };

  // Intersection Observer - start animation only when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setIsInView(true);
          setHasStarted(true);
        }
      },
      { threshold: 0.3 } // Trigger when 30% of section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  // Intro typing - only starts after section is in view
  useEffect(() => {
    if (stage !== 'intro' || isPaused || !hasStarted) return;
    if (introTypingIndex < introMessage.length) {
      const timer = setTimeout(() => setIntroTypingIndex(prev => prev + 1), 30);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setStage('user-response'), 800);
    }
  }, [stage, introTypingIndex, isPaused, hasStarted]);

  // User response typing
  useEffect(() => {
    if (stage !== 'user-response' || isPaused) return;
    if (userTypingIndex < userResponseMessage.length) {
      const timer = setTimeout(() => setUserTypingIndex(prev => prev + 1), 35);
      return () => clearTimeout(timer);
    } else {
      // After user finishes typing, move to show-options
      setTimeout(() => setStage('context-response'), 800);
    }
  }, [stage, userTypingIndex, isPaused]);

  // Context response - just transition to context-recognition
  useEffect(() => {
    if (stage !== 'context-response' || isPaused) return;
    // After a brief pause, move to context-recognition
    const timer = setTimeout(() => setStage('context-recognition'), 500);
    return () => clearTimeout(timer);
  }, [stage, isPaused]);

  // Context recognition typing -> show plan -> show board -> user response -> landing page
  useEffect(() => {
    if (stage !== 'context-recognition' || isPaused) return;
    if (contextTypingIndex < contextMessage.length) {
      const timer = setTimeout(() => setContextTypingIndex(prev => prev + 1), 20);
      return () => clearTimeout(timer);
    } else if (!showBoardAfterPlan) {
      // After plan is fully displayed (last item at 1.2s delay + 0.5s for animation), show the board
      const timer = setTimeout(() => setShowBoardAfterPlan(true), 800);
      return () => clearTimeout(timer);
    } else if (!showVibeUserResponse) {
      // After board appears, show user response after 1 second
      const timer = setTimeout(() => setShowVibeUserResponse(true), 1000);
      return () => clearTimeout(timer);
    } else if (vibeUserResponseTypingIndex < vibeUserResponseMessage.length) {
      // Type the user response
      const timer = setTimeout(() => setVibeUserResponseTypingIndex(prev => prev + 1), 25);
      return () => clearTimeout(timer);
    } else {
      // After user response is typed, transition to landing page
      const timer = setTimeout(() => setStage('landing-page'), 700);
      return () => clearTimeout(timer);
    }
  }, [stage, contextTypingIndex, showBoardAfterPlan, showVibeUserResponse, vibeUserResponseTypingIndex, isPaused]);

  // Landing page building with Vibe
  useEffect(() => {
    if (stage !== 'landing-page' || isPaused) return;
    if (landingProgress < 100) {
      const timer = setTimeout(() => setLandingProgress(prev => Math.min(prev + 4, 100)), 100);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCompletedTasks([0]);
        setStage('landing-page-done');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [stage, landingProgress, isPaused]);

  // Show success overlay after delay when landing page is complete
  useEffect(() => {
    if (landingProgress >= 100 && !showLandingSuccess) {
      const timer = setTimeout(() => setShowLandingSuccess(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [landingProgress, showLandingSuccess]);

  // Landing page done -> sidekick message -> user response -> email campaign
  useEffect(() => {
    if (stage !== 'landing-page-done' || isPaused) return;
    // First type the sidekick message
    if (landingDoneSidekickTypingIndex < landingDoneSidekickMessage.length) {
      const timer = setTimeout(() => setLandingDoneSidekickTypingIndex(prev => prev + 1), 12);
      return () => clearTimeout(timer);
    } else if (!showLandingDoneUserResponse) {
      // After sidekick message, show user response after a short delay
      const timer = setTimeout(() => setShowLandingDoneUserResponse(true), 600);
      return () => clearTimeout(timer);
    } else if (landingDoneUserTypingIndex < landingDoneUserMessage.length) {
      // Type the user response
      const timer = setTimeout(() => setLandingDoneUserTypingIndex(prev => prev + 1), 20);
      return () => clearTimeout(timer);
    } else {
      // After user response, move to email campaign
      const timer = setTimeout(() => setStage('email-campaign'), 700);
      return () => clearTimeout(timer);
    }
  }, [stage, landingDoneSidekickTypingIndex, showLandingDoneUserResponse, landingDoneUserTypingIndex, isPaused]);

  // Email campaign - user typing then sidekick typing
  useEffect(() => {
    if (stage !== 'email-campaign' || isPaused) return;
    // First type the user message
    if (emailUserTypingIndex < emailUserMessage.length) {
      const timer = setTimeout(() => setEmailUserTypingIndex(prev => prev + 1), 45);
      return () => clearTimeout(timer);
    }
    // Then type the sidekick response
    if (emailSidekickTypingIndex < emailSidekickMessage.length) {
      const timer = setTimeout(() => setEmailSidekickTypingIndex(prev => prev + 1), 65);
      return () => clearTimeout(timer);
    }
    // Then move to next stage
    const timer = setTimeout(() => {
      setCompletedTasks(prev => [...new Set([...prev, 1])]);
      setStage('design-selection');
    }, 1500);
    return () => clearTimeout(timer);
  }, [stage, emailUserTypingIndex, emailSidekickTypingIndex, isPaused]);

  // Design selection -> email preview
  useEffect(() => {
    if (stage !== 'design-selection' || isPaused) return;
    
    // Reset selection state when entering stage
    setDesignSelected(false);
    
    // Simulate user selecting after a delay
    const selectTimer = setTimeout(() => {
      setDesignSelected(true);
    }, 1500);
    
    // Then transition to next stage
    const timer = setTimeout(() => {
      setCompletedTasks(prev => [...new Set([...prev, 2])]);
      setStage('email-preview');
    }, 3000);
    return () => {
      clearTimeout(selectTimer);
      clearTimeout(timer);
    };
  }, [stage, isPaused]);

  // Email preview -> sending emails
  useEffect(() => {
    if (stage !== 'email-preview' || isPaused) return;
    const timer = setTimeout(() => setStage('sending-emails'), 4500);
    return () => clearTimeout(timer);
  }, [stage, isPaused]);

  // Sending emails
  useEffect(() => {
    if (stage !== 'sending-emails' || isPaused) return;
    if (emailsSent < 5) {
      const timer = setTimeout(() => setEmailsSent(prev => prev + 1), 700);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCompletedTasks(prev => [...new Set([...prev, 3])]);
        setStage('attendance-request');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, emailsSent, isPaused]);

  // Attendance request - user typing then sidekick typing
  useEffect(() => {
    if (stage !== 'attendance-request' || isPaused) return;
    // First type the user message
    if (attendanceUserTypingIndex < attendanceUserMessage.length) {
      const timer = setTimeout(() => setAttendanceUserTypingIndex(prev => prev + 1), 45);
      return () => clearTimeout(timer);
    }
    // Then type the sidekick response
    if (attendanceSidekickTypingIndex < attendanceSidekickMessage.length) {
      const timer = setTimeout(() => setAttendanceSidekickTypingIndex(prev => prev + 1), 40);
      return () => clearTimeout(timer);
    }
    // Then move to next stage
    const timer = setTimeout(() => setStage('agents-creation'), 1500);
    return () => clearTimeout(timer);
  }, [stage, attendanceUserTypingIndex, attendanceSidekickTypingIndex, isPaused]);

  // Agents creation
  useEffect(() => {
    if (stage !== 'agents-creation' || isPaused) return;
    if (agentProgress < 100) {
      const timer = setTimeout(() => setAgentProgress(prev => Math.min(prev + 8, 100)), 150);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setStage('agent-calling'), 800);
      return () => clearTimeout(timer);
    }
  }, [stage, agentProgress, isPaused]);

  // Agent calling with typing message (first 3 leads with dark overlay)
  useEffect(() => {
    if (stage !== 'agent-calling' || isPaused) return;
    if (callMessageIndex < callMessage.length) {
      const timer = setTimeout(() => setCallMessageIndex(prev => prev + 1), 50);
      return () => clearTimeout(timer);
    } else if (confirmedContacts.length < 3) {
      // Confirm first 3 leads during dark overlay
      const timer = setTimeout(() => {
        setConfirmedContacts(prev => [...prev, prev.length]);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      // After 3 leads confirmed, transition to board calling for last 2
      const timer = setTimeout(() => {
        setBoardCallingIndex(3);
        setBoardCallTimer(0);
        setStage('agent-board-calling');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, callMessageIndex, confirmedContacts, isPaused]);

  // Agent board calling (last 2 leads with inline call indicator)
  useEffect(() => {
    if (stage !== 'agent-board-calling' || isPaused) return;
    
    // Increment call timer
    const timerInterval = setInterval(() => {
      setBoardCallTimer(prev => prev + 1);
    }, 1000);
    
    // After ~2.5 seconds, confirm current lead and move to next
    const confirmTimer = setTimeout(() => {
      if (boardCallingIndex === 3) {
        // Confirm lead 3, move to lead 4
        setConfirmedContacts(prev => [...prev, 3]);
        setBoardCallingIndex(4);
        setBoardCallTimer(0);
      } else if (boardCallingIndex === 4) {
        // Confirm lead 4, finish
        setConfirmedContacts(prev => [...prev, 4]);
        setTimeout(() => {
          setCompletedTasks(prev => [...new Set([...prev, 4])]);
          setStage('vibe-request');
        }, 800);
      }
    }, 2500);
    
    return () => {
      clearInterval(timerInterval);
      clearTimeout(confirmTimer);
    };
  }, [stage, boardCallingIndex, isPaused]);

  // Vibe request - user typing then sidekick typing
  useEffect(() => {
    if (stage !== 'vibe-request' || isPaused) return;
    // First type the user message
    if (vibeUserTypingIndex < vibeUserMessage.length) {
      const timer = setTimeout(() => setVibeUserTypingIndex(prev => prev + 1), 45);
      return () => clearTimeout(timer);
    }
    // Then type the sidekick response
    if (vibeSidekickTypingIndex < vibeSidekickMessage.length) {
      const timer = setTimeout(() => setVibeSidekickTypingIndex(prev => prev + 1), 40);
      return () => clearTimeout(timer);
    }
    // Then move to next stage
    const timer = setTimeout(() => setStage('vibe-building'), 1500);
    return () => clearTimeout(timer);
  }, [stage, vibeUserTypingIndex, vibeSidekickTypingIndex, isPaused]);

  // Vibe building
  useEffect(() => {
    if (stage !== 'vibe-building' || isPaused) return;
    if (vibeProgress < 100) {
      const timer = setTimeout(() => setVibeProgress(prev => Math.min(prev + 5, 100)), 120);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setStage('report'), 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, vibeProgress, isPaused]);

  // Report generation
  useEffect(() => {
    if (stage !== 'report' || isPaused) return;
    if (reportProgress < 100) {
      const timer = setTimeout(() => setReportProgress(prev => Math.min(prev + 6, 100)), 140);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCompletedTasks([0, 1, 2, 3, 4, 5]);
        // Reset after complete
        setTimeout(() => {
          setStage('intro');
          setCompletedTasks([]);
          setIntroTypingIndex(0);
          setUserTypingIndex(0);
          setContextTypingIndex(0);
          setShowVibeUserResponse(false);
          setVibeUserResponseTypingIndex(0);
          setShowBoardAfterPlan(false);
          setLandingDoneSidekickTypingIndex(0);
          setShowLandingDoneUserResponse(false);
          setLandingDoneUserTypingIndex(0);
          setEmailUserTypingIndex(0);
          setEmailSidekickTypingIndex(0);
          setAttendanceUserTypingIndex(0);
          setAttendanceSidekickTypingIndex(0);
          setVibeUserTypingIndex(0);
          setVibeSidekickTypingIndex(0);
          setLandingProgress(0);
          setShowLandingSuccess(false);
          setEmailsSent(0);
          setConfirmedContacts([]);
          setAgentProgress(0);
          setVibeProgress(0);
          setReportProgress(0);
          setCallMessageIndex(0);
          setBoardCallingIndex(3);
          setBoardCallTimer(0);
        }, 4000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, reportProgress, isPaused]);

  const currentBoard = getCurrentBoard();
  const isIntro = stage === 'intro' || stage === 'user-response' || stage === 'context-response';

  // Render Work Management Board
  const renderWorkManagementBoard = () => (
    <div className="h-full p-4 flex flex-col items-center justify-center">
      <div 
        className="rounded-2xl overflow-hidden flex flex-col w-full"
        style={{ 
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          height: '620px',
          maxHeight: '92%',
        }}
      >
        {/* Board Header - logo on left, app icon on right when built */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <img src={workManagementLogo} alt="Work Management" className="h-9 object-contain" />
          
          {/* Show Vibe app icon after it's built */}
          {vibeProgress >= 100 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-orange-400/20 rounded-xl px-3 py-2 border border-pink-400/30"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="text-right">
                <span className="text-gray-700 text-xs block">Event Map App</span>
                <span className="text-green-600 text-xs flex items-center gap-1">
                  <Check className="w-3 h-3" /> Live
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Title Section - moved from footer */}
        <div className="px-5 py-3.5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs block">Marketing</span>
              <span className="text-gray-900 font-bold text-lg">Monthly tasks</span>
            </div>
            <div className="bg-gray-100 rounded-full px-3.5 py-1.5">
              <span className="text-gray-700 font-medium">{completedTasks.length}/{tasks.length}</span>
            </div>
          </div>
        </div>

        {/* Task Rows */}
        <div className="flex-1 p-4 flex flex-col justify-center overflow-hidden">
          <div className="space-y-2.5">
            {tasks.map((task, index) => {
              const isCompleted = completedTasks.includes(index);
              const isCurrent = getCurrentTaskIndex() === index;
              
              return (
                <motion.div
                  key={index}
                  className="h-14 rounded-xl flex items-center px-5 gap-4"
                  style={{ 
                    background: isCompleted 
                      ? 'rgba(34, 197, 94, 0.1)' 
                      : isCurrent 
                        ? 'rgba(99, 102, 241, 0.1)' 
                        : '#f8f9fa',
                    border: isCompleted 
                      ? '1px solid rgba(34, 197, 94, 0.3)' 
                      : isCurrent 
                        ? '1px solid rgba(99, 102, 241, 0.3)' 
                        : '1px solid #e5e7eb',
                  }}
                  animate={{
                    scale: isCurrent ? [1, 1.01, 1] : 1,
                    boxShadow: isCurrent ? '0 0 20px rgba(99, 102, 241, 0.2)' : 'none',
                  }}
                  transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  ) : isCurrent ? (
                    <motion.div
                      className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0"
                      animate={{ boxShadow: ['0 0 0 0 rgba(99, 102, 241, 0)', '0 0 0 5px rgba(99, 102, 241, 0.3)', '0 0 0 0 rgba(99, 102, 241, 0)'] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Zap className="w-3.5 h-3.5 text-white" />
                    </motion.div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg border-2 border-gray-300 flex-shrink-0" />
                  )}
                  
                  <span className={`flex-1 text-base ${
                    isCompleted ? 'text-green-600 line-through' : isCurrent ? 'text-gray-900 font-semibold' : 'text-gray-500'
                  }`}>
                    {task.text}
                  </span>
                  
                  <div className="w-20 flex justify-center">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      isCompleted 
                        ? 'bg-green-100 text-green-600' 
                        : isCurrent 
                          ? 'bg-indigo-100 text-indigo-600' 
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? 'Done' : isCurrent ? 'Active' : 'Pending'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>


        {/* Pagination and Controls */}
        <div className="px-5 py-2.5 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {/* Pagination dots - clickable */}
            <div className="flex items-center gap-1.5">
              {['context-recognition', 'landing-page', 'email-campaign', 'sending-emails', 'agents-creation', 'vibe-building', 'report'].map((s) => {
                const stageOrder = ['intro', 'user-response', 'context-recognition', 'landing-page', 'landing-page-done', 'email-campaign', 'design-selection', 'email-preview', 'sending-emails', 'attendance-request', 'agents-creation', 'agent-calling', 'agent-board-calling', 'vibe-request', 'vibe-building', 'report'];
                const currentIndex = stageOrder.indexOf(stage);
                const dotIndex = stageOrder.indexOf(s);
                const isActive = currentIndex >= dotIndex;
                const isCurrent = stage === s || 
                  (s === 'landing-page' && (stage === 'landing-page' || stage === 'landing-page-done')) ||
                  (s === 'email-campaign' && (stage === 'email-campaign' || stage === 'design-selection' || stage === 'email-preview')) ||
                  (s === 'agents-creation' && (stage === 'agents-creation' || stage === 'agent-calling' || stage === 'agent-board-calling' || stage === 'attendance-request')) ||
                  (s === 'vibe-building' && (stage === 'vibe-building' || stage === 'vibe-request'));
                
                return (
                  <motion.button
                    key={s}
                    onClick={() => navigateToStage(s)}
                    className={`rounded-full transition-all cursor-pointer hover:opacity-80 ${isCurrent ? 'w-4 h-2 bg-indigo-400' : isActive ? 'w-2 h-2 bg-indigo-500' : 'w-2 h-2 bg-white/20'}`}
                    animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    title={s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  />
                );
              })}
            </div>
            
            {/* Pause/Play button */}
            <motion.button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isPaused ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  Pause
                </>
              )}
            </motion.button>
          </div>
        </div>

      </div>
    </div>
  );

  // Render CRM Board
  const renderCRMBoard = () => (
    <div className="h-full p-4 flex flex-col items-center justify-center">
      <div 
        className="rounded-2xl overflow-hidden flex flex-col w-full"
        style={{ 
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          height: '620px',
          maxHeight: '92%',
        }}
      >
        {/* CRM Header - just logo like Work Management */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <img src={crmLogo} alt="CRM" className="h-10 object-contain" />
          <div className="bg-green-100 rounded-full px-3 py-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-green-600 text-sm font-medium">Active</span>
          </div>
        </div>

        {/* Title Section - like WM board */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs block">NAM</span>
              <span className="text-gray-900 font-bold text-lg">Customers</span>
            </div>
            <div className="bg-gray-100 rounded-full px-4 py-2">
              <span className="text-gray-700 font-medium">{confirmedContacts.length}/5 confirmed</span>
            </div>
          </div>
        </div>

        {/* Column Headers */}
        <div className="flex items-center px-6 py-3 border-b border-gray-100 text-gray-500 text-xs font-medium">
          <div className="w-12"></div>
          <div className="flex-1">Contact</div>
          <div className="w-24 text-center">Company</div>
          <div className="w-24 text-center">Status</div>
        </div>

        {/* Contact Rows */}
        <div className="flex-1 p-4 flex flex-col justify-center">
          <div className="space-y-3">
            {contactsData.map((contact, index) => {
              const isConfirmed = confirmedContacts.includes(index);
              const isInvited = emailsSent > index;
              const hasEmail = emailsSent > index && (stage === 'sending-emails' || stage === 'attendance-request' || stage === 'agents-creation' || stage === 'agent-calling' || stage === 'agent-board-calling');
              
              return (
                <motion.div
                  key={index}
                  className="h-16 rounded-xl flex items-center px-6 gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    borderColor: isConfirmed ? 'rgba(34, 197, 94, 0.6)' : isInvited ? 'rgba(20, 184, 166, 0.4)' : '#e5e7eb',
                    boxShadow: isConfirmed ? '0 0 20px rgba(34, 197, 94, 0.3)' : isInvited ? '0 0 15px rgba(20, 184, 166, 0.2)' : 'none',
                  }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  style={{ 
                    background: isConfirmed 
                      ? 'rgba(34, 197, 94, 0.1)' 
                      : isInvited 
                        ? 'rgba(20, 184, 166, 0.1)' 
                        : '#f8f9fa',
                    border: isConfirmed 
                      ? '1px solid rgba(34, 197, 94, 0.3)' 
                      : '1px solid #e5e7eb',
                  }}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                    <img src={contact.image} alt={contact.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="flex-1 text-gray-900 text-base font-medium">{contact.name}</span>
                  <span className="w-28 text-center text-gray-500 text-sm">{contact.company}</span>
                  {/* Gmail-style email icon - appears and stays like in Marketing In Action */}
                  <AnimatePresence>
                    {hasEmail && !isConfirmed && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-8 h-8 rounded flex items-center justify-center bg-white border border-gray-300 flex-shrink-0"
                      >
                        <Mail className="w-4 h-4 text-red-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="w-28 flex justify-center">
                    {isConfirmed ? (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-sm px-3 py-1.5 rounded-full bg-green-100 text-green-600 flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> Confirmed
                      </motion.span>
                    ) : isInvited ? (
                      <span className="text-sm px-3 py-1.5 rounded-full bg-teal-100 text-teal-600">Invited</span>
                    ) : (
                      <span className="text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-400">New</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Pagination and Controls */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {/* Pagination dots - clickable */}
            <div className="flex items-center gap-1.5">
              {['context-recognition', 'landing-page', 'email-campaign', 'sending-emails', 'agents-creation', 'vibe-building', 'report'].map((s) => {
                const stageOrder = ['intro', 'user-response', 'context-response', 'context-recognition', 'landing-page', 'landing-page-done', 'email-campaign', 'design-selection', 'email-preview', 'sending-emails', 'attendance-request', 'agents-creation', 'agent-calling', 'agent-board-calling', 'vibe-request', 'vibe-building', 'report'];
                const currentIndex = stageOrder.indexOf(stage);
                const dotIndex = stageOrder.indexOf(s);
                const isActive = currentIndex >= dotIndex;
                const isCurrent = stage === s || 
                  (s === 'landing-page' && (stage === 'landing-page' || stage === 'landing-page-done')) ||
                  (s === 'email-campaign' && (stage === 'email-campaign' || stage === 'design-selection' || stage === 'email-preview')) ||
                  (s === 'agents-creation' && (stage === 'agents-creation' || stage === 'agent-calling' || stage === 'agent-board-calling' || stage === 'attendance-request')) ||
                  (s === 'vibe-building' && (stage === 'vibe-building' || stage === 'vibe-request'));
                
                return (
                  <motion.button
                    key={s}
                    onClick={() => navigateToStage(s)}
                    className={`rounded-full transition-all cursor-pointer hover:opacity-80 ${isCurrent ? 'w-4 h-2 bg-indigo-400' : isActive ? 'w-2 h-2 bg-indigo-500' : 'w-2 h-2 bg-gray-300'}`}
                    animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    title={s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  />
                );
              })}
            </div>
            
            {/* Pause/Play button */}
            <motion.button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isPaused ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  Pause
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Campaigns Board for email template selection
  const renderCampaignsBoard = () => {
    const templates = [
      {
        id: 1,
        name: 'Vibrant Event',
        description: 'Bold gradient design',
        gradient: 'from-purple-600 via-pink-500 to-orange-400',
        accent: 'purple',
      },
      {
        id: 2,
        name: 'Elegant Minimal',
        description: 'Clean professional look',
        gradient: 'from-slate-700 to-slate-900',
        accent: 'slate',
      },
      {
        id: 3,
        name: 'Fresh & Modern',
        description: 'Bright and inviting',
        gradient: 'from-teal-500 via-cyan-500 to-blue-500',
        accent: 'teal',
      },
    ];

    return (
      <div className="h-full p-4 flex flex-col items-center justify-center">
        <div 
          className="rounded-2xl overflow-hidden flex flex-col w-full"
          style={{ 
            background: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            height: '620px',
            maxHeight: '92%',
          }}
        >
          {/* Campaigns Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <img src={campaignsLogo} alt="monday campaigns" className="h-10 object-contain" />
            <div className="bg-teal-100 rounded-full px-3 py-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span className="text-teal-600 text-sm font-medium">Creating</span>
            </div>
          </div>

          {/* Title Section */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-500 text-xs block">Email Campaign</span>
                <span className="text-gray-900 font-bold text-lg">Event Invitations</span>
              </div>
              <div className="bg-gray-100 rounded-full px-4 py-2">
                <span className="text-gray-700 font-medium">5 recipients</span>
              </div>
            </div>
          </div>

          {/* Template Selection */}
          <div className="flex-1 p-6 overflow-hidden">
            <p className="text-gray-600 text-sm mb-4">Choose your email template:</p>
            <div className="grid grid-cols-3 gap-4 h-full max-h-[380px]">
              {templates.map((template, index) => {
                const isSelected = designSelected && index === 0;
                const isHovered = !designSelected && index === 0;
                
                return (
                  <motion.div
                    key={template.id}
                    className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${
                      isSelected ? 'ring-4 ring-teal-500 ring-offset-2' : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: isSelected ? 1.02 : isHovered ? 1.01 : 1,
                    }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Email Preview Card */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden h-full flex flex-col shadow-sm">
                      {/* Email Header Preview */}
                      <div className={`bg-gradient-to-br ${template.gradient} p-4 text-center relative overflow-hidden`}>
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-1 right-2 w-8 h-8 border border-white/40 rounded-full"></div>
                          <div className="absolute bottom-1 left-3 w-6 h-6 border border-white/30 rounded-lg rotate-12"></div>
                        </div>
                        <Sparkles className="w-6 h-6 text-white mx-auto mb-2 relative z-10" />
                        <p className="text-white font-bold text-sm relative z-10">You're Invited!</p>
                        <p className="text-white/80 text-xs relative z-10">Annual Event 2026</p>
                      </div>
                      
                      {/* Email Body Preview */}
                      <div className="p-3 flex-1 bg-gray-50">
                        <div className="space-y-2">
                          <div className="h-2 bg-gray-200 rounded w-full"></div>
                          <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                          <div className="h-2 bg-gray-200 rounded w-3/5"></div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <div className="h-6 bg-gray-200 rounded flex-1"></div>
                          <div className="h-6 bg-gray-200 rounded flex-1"></div>
                        </div>
                      </div>
                      
                      {/* Template Name */}
                      <div className="p-3 border-t border-gray-100 bg-white">
                        <p className="font-medium text-gray-900 text-sm">{template.name}</p>
                        <p className="text-gray-500 text-xs">{template.description}</p>
                      </div>
                    </div>
                    
                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {['context-recognition', 'landing-page', 'email-campaign', 'sending-emails', 'agents-creation', 'vibe-building', 'report'].map((s) => {
                  const stageOrder = ['intro', 'user-response', 'context-response', 'context-recognition', 'landing-page', 'landing-page-done', 'email-campaign', 'design-selection', 'email-preview', 'sending-emails', 'attendance-request', 'agents-creation', 'agent-calling', 'agent-board-calling', 'vibe-request', 'vibe-building', 'report'];
                  const currentIndex = stageOrder.indexOf(stage);
                  const dotIndex = stageOrder.indexOf(s);
                  const isActive = currentIndex >= dotIndex;
                  const isCurrent = stage === s || 
                    (s === 'landing-page' && (stage === 'landing-page' || stage === 'landing-page-done')) ||
                    (s === 'email-campaign' && (stage === 'email-campaign' || stage === 'design-selection' || stage === 'email-preview')) ||
                    (s === 'agents-creation' && (stage === 'agents-creation' || stage === 'agent-calling' || stage === 'agent-board-calling' || stage === 'attendance-request')) ||
                    (s === 'vibe-building' && (stage === 'vibe-building' || stage === 'vibe-request'));
                  
                  return (
                    <motion.button
                      key={s}
                      onClick={() => navigateToStage(s)}
                      className={`rounded-full transition-all cursor-pointer hover:opacity-80 ${isCurrent ? 'w-4 h-2 bg-teal-400' : isActive ? 'w-2 h-2 bg-teal-500' : 'w-2 h-2 bg-gray-300'}`}
                      animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      title={s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    />
                  );
                })}
              </div>
              
              {designSelected && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg font-medium text-sm"
                >
                  <Send className="w-4 h-4" />
                  Sending Campaign...
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Agents Board (monday agents style)
  const renderAgentsBoard = () => (
    <div className="h-full p-4 flex flex-col items-center justify-center">
      <div 
        className="rounded-2xl overflow-hidden flex flex-col w-full"
        style={{ 
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          height: '620px',
          maxHeight: '92%',
        }}
      >
        {/* Agents Header - shows CRM logo since agents work within CRM */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img src={crmLogo} alt="CRM" className="h-12 object-contain" />
          </div>
          <div className="bg-green-100 rounded-full px-3 py-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-green-600 text-sm font-medium">Active</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 px-6 py-3 border-b border-gray-100 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Leads:</span>
            <span className="text-gray-900 font-medium">5</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-green-600">Confirmed:</span>
            <span className="text-green-600 font-medium">{confirmedContacts.length}</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-gray-400">In progress...</span>
          </div>
        </div>

        {/* Contact Rows */}
        <div className="flex-1 p-4 flex flex-col justify-center">
          <div className="space-y-2">
            {contactsData.map((contact, index) => {
              const isConfirmed = confirmedContacts.includes(index);
              const isBeingCalled = stage === 'agent-board-calling' && index === boardCallingIndex && !isConfirmed;
              
              // Active call row - special styling with audio bars and timer
              if (isBeingCalled) {
                const minutes = Math.floor(boardCallTimer / 60);
                const seconds = boardCallTimer % 60;
                const timerDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                
                return (
                  <motion.div
                    key={index}
                    className="h-16 rounded-xl flex items-center px-4 gap-3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      boxShadow: ['0 0 20px rgba(34, 197, 94, 0.3)', '0 0 30px rgba(34, 197, 94, 0.5)', '0 0 20px rgba(34, 197, 94, 0.3)']
                    }}
                    transition={{ 
                      boxShadow: { duration: 1.5, repeat: Infinity }
                    }}
                    style={{ 
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.4)',
                    }}
                  >
                    {/* Avatars - Lead + Connecting Line + Agent */}
                    <div className="flex items-center gap-1">
                      {/* Lead Avatar */}
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-400" style={{ boxShadow: '0 0 12px rgba(34, 197, 94, 0.4)' }}>
                        <img src={contact.image} alt={contact.name} className="w-full h-full object-cover" />
                      </div>
                      
                      {/* Connecting Line with pulse */}
                      <div className="relative w-8 h-0.5">
                        <div className="absolute inset-0 bg-green-1000/30 rounded-full"></div>
                        <motion.div 
                          className="absolute inset-y-0 left-0 bg-green-400 rounded-full"
                          animate={{ width: ['0%', '100%', '0%'] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        />
                      </div>
                      
                      {/* Agent Avatar */}
                      <motion.div 
                        className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-500"
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ boxShadow: '0 0 12px rgba(34, 197, 94, 0.5)' }}
                      >
                        <img src={marketingRsvpAgent} alt="Agent" className="w-full h-full object-contain" style={{ transform: 'scale(1.3)' }} />
                      </motion.div>
                    </div>
                    
                    {/* Name & Company */}
                    <div className="flex-1">
                      <span className="text-gray-900 font-medium block">{contact.name}</span>
                      <span className="text-green-600 text-sm">{contact.company}</span>
                    </div>
                    
                    {/* Audio Wave Bars */}
                    <div className="flex items-center gap-0.5 h-6">
                      {[0, 1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-green-400 rounded-full"
                          animate={{ 
                            height: ['8px', '20px', '12px', '24px', '8px']
                          }}
                          transition={{ 
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.15
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Timer */}
                    <div className="text-green-400 font-mono text-sm font-medium min-w-[40px] text-right">
                      {timerDisplay}
                    </div>
                  </motion.div>
                );
              }
              
              return (
                <motion.div
                  key={index}
                  className="h-16 rounded-xl flex items-center px-5 gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ 
                    background: isConfirmed 
                      ? 'rgba(34, 197, 94, 0.1)' 
                      : '#f8f9fa',
                    border: isConfirmed 
                      ? '1px solid rgba(34, 197, 94, 0.3)' 
                      : '1px solid #e5e7eb',
                  }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                      <img src={contact.image} alt={contact.name} className="w-full h-full object-cover" />
                    </div>
                    {isConfirmed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-900 font-medium block">{contact.name}</span>
                    <span className="text-gray-500 text-sm">{contact.company}</span>
                  </div>
                  <div className="w-28 flex justify-end">
                    {isConfirmed ? (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-sm text-green-600 flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> Confirmed
                      </motion.span>
                    ) : (
                      <span className="text-sm text-gray-400">Pending</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Pagination and Controls */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {/* Pagination dots - clickable */}
            <div className="flex items-center gap-1.5">
              {['context-recognition', 'landing-page', 'email-campaign', 'sending-emails', 'agents-creation', 'vibe-building', 'report'].map((s) => {
                const stageOrder = ['intro', 'user-response', 'context-response', 'context-recognition', 'landing-page', 'landing-page-done', 'email-campaign', 'design-selection', 'email-preview', 'sending-emails', 'attendance-request', 'agents-creation', 'agent-calling', 'agent-board-calling', 'vibe-request', 'vibe-building', 'report'];
                const currentIndex = stageOrder.indexOf(stage);
                const dotIndex = stageOrder.indexOf(s);
                const isActive = currentIndex >= dotIndex;
                const isCurrent = stage === s || 
                  (s === 'landing-page' && (stage === 'landing-page' || stage === 'landing-page-done')) ||
                  (s === 'email-campaign' && (stage === 'email-campaign' || stage === 'design-selection' || stage === 'email-preview')) ||
                  (s === 'agents-creation' && (stage === 'agents-creation' || stage === 'agent-calling' || stage === 'agent-board-calling' || stage === 'attendance-request')) ||
                  (s === 'vibe-building' && (stage === 'vibe-building' || stage === 'vibe-request'));
                
                return (
                  <motion.button
                    key={s}
                    onClick={() => navigateToStage(s)}
                    className={`rounded-full transition-all cursor-pointer hover:opacity-80 ${isCurrent ? 'w-4 h-2 bg-indigo-400' : isActive ? 'w-2 h-2 bg-indigo-500' : 'w-2 h-2 bg-gray-300'}`}
                    animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    title={s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  />
                );
              })}
            </div>
            
            {/* Pause/Play button */}
            <motion.button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isPaused ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  Pause
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Vibe Board
  const renderVibeBoard = () => (
    <div className="h-full p-6 flex flex-col">
      <div 
        className="flex-1 rounded-2xl overflow-hidden flex flex-col"
        style={{ 
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Vibe Header - logo on left */}
        <div className="flex items-center p-5 border-b border-white/10">
          <img src={vibeLogo} alt="Vibe" className="h-10 object-contain rounded-lg" />
        </div>

        {/* App Preview */}
        <div className="flex-1 p-6 flex items-center justify-center">
          <motion.div
            className="w-full max-w-sm bg-white/5 rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-center mb-6">
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 mx-auto mb-4 flex items-center justify-center"
                animate={{ rotate: vibeProgress < 100 ? 360 : 0 }}
                transition={{ duration: 2, repeat: vibeProgress < 100 ? Infinity : 0, ease: 'linear' }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-white font-bold text-lg mb-1">Event Map App</h3>
              <p className="text-white/50 text-sm">Track attendance in real-time</p>
            </div>

            {vibeProgress < 100 ? (
              <>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-pink-500 to-orange-400"
                    style={{ width: `${vibeProgress}%` }}
                  />
                </div>
                <p className="text-white/40 text-xs text-center">Building app... {vibeProgress}%</p>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-1000/20 rounded-xl p-3 border border-green-500/30"
              >
                <p className="text-green-400 text-center font-medium flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" /> App ready!
                </p>
              </motion.div>
            )}

            <div className="mt-6 space-y-2">
              {['QR Code Scanner', 'Guest List', 'Real-time Updates'].map((feature, i) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-2 text-white/60 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: vibeProgress > i * 30 ? 1 : 0.3, x: 0 }}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${vibeProgress > i * 30 + 30 ? 'bg-green-1000' : 'bg-white/10'}`}>
                    {vibeProgress > i * 30 + 30 && <Check className="w-3 h-3 text-white" />}
                  </div>
                  {feature}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  // Get status text based on progress
  const getVibeStatusText = () => {
    if (landingProgress < 25) return "Analyzing requirements...";
    if (landingProgress < 50) return "Generating design...";
    if (landingProgress < 75) return "Adding content...";
    if (landingProgress < 100) return "Finalizing app...";
    return "App Ready!";
  };

  // Get status text for agent creation
  const getAgentStatusText = () => {
    if (agentProgress < 20) return "Initializing AI model...";
    if (agentProgress < 40) return "Loading knowledge base...";
    if (agentProgress < 60) return "Configuring capabilities...";
    if (agentProgress < 80) return "Training on your data...";
    if (agentProgress < 100) return "Finalizing agent...";
    return "Agent Ready!";
  };

  // Render impressive Agent Creation experience (right panel)
  const renderAgentCreationExperience = () => (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        }}
      />
      
      {/* Animated particles/dots */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header with monday agents branding */}
      <motion.div 
        className="relative z-10 flex items-center gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl"
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(34, 211, 238, 0.3)',
              '0 0 40px rgba(34, 211, 238, 0.5)',
              '0 0 20px rgba(34, 211, 238, 0.3)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <img src={mondayAgentsLogo} alt="monday agents" className="w-full h-full object-cover" />
        </motion.div>
        <div>
          <h2 className="text-white font-bold text-2xl">
            <span className="text-white">monday</span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">agents</span>
          </h2>
          <p className="text-gray-400 text-sm">AI-powered automation</p>
        </div>
      </motion.div>

      {/* Main agent creation card */}
      <motion.div
        className="relative z-10 bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl"
        style={{ width: '400px' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Glowing border effect */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-50"
          style={{
            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(20, 184, 166, 0.1))',
            filter: 'blur(1px)',
          }}
        />

        {/* Agent avatar section */}
        <div className="relative flex flex-col items-center mb-6">
          {/* Outer glow ring */}
          <motion.div
            className="absolute w-36 h-36 rounded-full"
            style={{
              background: agentProgress >= 100 
                ? 'linear-gradient(135deg, #22c55e, #10b981)' 
                : 'linear-gradient(135deg, #06b6d4, #14b8a6)',
              filter: 'blur(20px)',
              opacity: 0.4,
            }}
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Progress ring */}
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="#374151"
                strokeWidth="6"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="url(#agentGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={364}
                initial={{ strokeDashoffset: 364 }}
                animate={{ strokeDashoffset: 364 - (364 * agentProgress / 100) }}
                transition={{ duration: 0.3 }}
              />
              <defs>
                <linearGradient id="agentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Agent image */}
            <div className="absolute inset-2 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700">
              <img 
                src={marketingRsvpAgent} 
                alt="Agent" 
                className="w-full h-full object-contain"
                style={{ 
                  filter: agentProgress >= 100 ? 'grayscale(0)' : `grayscale(${1 - agentProgress/100})`,
                  transform: 'scale(1.2)'
                }}
              />
            </div>
            
            {/* Completion checkmark */}
            {agentProgress >= 100 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-900"
              >
                <Check className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Agent name */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-white font-bold text-xl mb-1">Marketing RSVP Agent</h3>
          <p className="text-gray-400 text-sm">Confirms attendance & follows up with guests</p>
        </motion.div>

        {/* Progress steps */}
        <div className="space-y-3 mb-6">
          {[
            { text: 'Initializing agent...', threshold: 0 },
            { text: 'Loading knowledge base...', threshold: 25 },
            { text: 'Configuring call scripts...', threshold: 50 },
            { text: 'Agent ready!', threshold: 75 },
          ].map((step, index) => {
            const isComplete = agentProgress >= step.threshold + 25;
            const isActive = agentProgress >= step.threshold && agentProgress < step.threshold + 25;
            
            return (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isComplete ? 'bg-gradient-to-br from-cyan-400 to-teal-500' : 
                  isActive ? 'bg-cyan-500/20 border border-cyan-400' : 
                  'bg-gray-700'
                }`}>
                  {isComplete ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : isActive ? (
                    <motion.div 
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  ) : (
                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                  )}
                </div>
                <span className={`text-sm ${
                  isComplete ? 'text-cyan-400' : 
                  isActive ? 'text-white' : 
                  'text-gray-500'
                }`}>
                  {step.text}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-teal-500"
              initial={{ width: 0 }}
              animate={{ width: `${agentProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-400 text-xs">
              {agentProgress >= 100 ? 'Agent Ready!' : 'Creating agent...'}
            </span>
            <span className="text-cyan-400 font-bold text-sm">{agentProgress}%</span>
          </div>
        </div>
      </motion.div>

      {/* Bottom status */}
      {agentProgress >= 100 && (
        <motion.div
          className="relative z-10 mt-6 flex items-center gap-2 text-green-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">Agent is ready to make calls!</span>
        </motion.div>
      )}
    </div>
  );

  // Render immersive Vibe experience
  const renderVibeExperience = () => (
    <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              background: `rgba(${Math.random() > 0.5 ? '236, 72, 153' : '168, 85, 247'}, ${Math.random() * 0.4 + 0.1})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Vibe branding */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.div
            animate={{ 
              rotate: landingProgress < 100 ? 360 : 0,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              rotate: { duration: 3, repeat: landingProgress < 100 ? Infinity : 0, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity },
            }}
            className="relative"
          >
            {/* Glow effect behind logo */}
            <div 
              className="absolute inset-0 blur-xl"
              style={{
                background: 'linear-gradient(135deg, #ec4899, #f59e0b)',
                opacity: 0.5,
                transform: 'scale(1.5)',
              }}
            />
            <img src={vibeLogo} alt="Vibe" className="w-16 h-16 object-contain relative z-10" />
          </motion.div>
          <div>
            <h2 className="text-white font-bold text-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
              Building with Vibe
            </h2>
            <p className="text-gray-400 text-sm">{getVibeStatusText()}</p>
          </div>
        </motion.div>

        {/* Phone mockup with glowing ring */}
        <div className="relative">
          {/* Outer glow ring */}
          <motion.div
            className="absolute -inset-4 rounded-[3rem]"
            style={{
              background: landingProgress >= 100 
                ? 'linear-gradient(135deg, #22c55e, #10b981)' 
                : 'linear-gradient(135deg, #ec4899, #a855f7, #f59e0b)',
              opacity: 0.3,
              filter: 'blur(20px)',
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Circular progress indicator */}
          <svg className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)]" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 48}
              strokeDashoffset={2 * Math.PI * 48 * (1 - landingProgress / 100)}
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Phone frame */}
          <motion.div 
            className="relative bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ 
              width: '240px',
              height: '480px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            {/* Phone notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-2xl z-10"></div>
            
            {/* Phone screen */}
            <div className="w-full h-full rounded-[2rem] overflow-hidden bg-white">
              {/* Hero section - always visible */}
              <div 
                className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-5 text-center relative overflow-hidden"
                style={{ opacity: landingProgress > 10 ? 1 : 0.3 }}
              >
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-2 right-4 w-8 h-8 border border-white/40 rounded-full"></div>
                  <div className="absolute bottom-2 left-3 w-6 h-6 border border-white/40 rounded-lg rotate-12"></div>
                </div>
                {landingProgress > 20 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Sparkles className="w-8 h-8 text-white mx-auto mb-2" />
                  </motion.div>
                )}
                {landingProgress > 30 && (
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white font-bold text-base"
                  >
                    Annual Event 2026
                  </motion.h3>
                )}
                {landingProgress > 40 && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/80 text-xs mt-1"
                  >
                    The future awaits
                  </motion.p>
                )}
              </div>
              
              {/* Content section */}
              <div className="p-4 space-y-3">
                {landingProgress > 50 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium text-xs">March 15, 2026</p>
                      <p className="text-gray-500 text-[10px]">9:00 AM - 6:00 PM</p>
                    </div>
                  </motion.div>
                )}
                {landingProgress > 65 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium text-xs">Innovation Center</p>
                      <p className="text-gray-500 text-[10px]">San Francisco, CA</p>
                    </div>
                  </motion.div>
                )}
                {landingProgress > 80 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium text-xs">500+ Attendees</p>
                      <p className="text-gray-500 text-[10px]">Join the community</p>
                    </div>
                  </motion.div>
                )}
                {landingProgress > 95 && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl py-2.5 font-semibold text-xs mt-3 shadow-lg"
                  >
                    Register Now
                  </motion.button>
                )}
              </div>
              
              {/* Skeleton placeholders for unloaded content */}
              {landingProgress < 50 && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                      <div className="h-2 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                      <div className="h-2 bg-gray-200 rounded animate-pulse w-14"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Success overlay - shows after delay */}
            {showLandingSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-2 rounded-[2rem] bg-green-500/20 backdrop-blur-sm flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Progress percentage */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <span className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
            {landingProgress}%
          </span>
        </motion.div>
      </div>
    </div>
  );

  // Get status text for event map app
  const getNetworkingVibeStatusText = () => {
    if (vibeProgress < 25) return "Loading venue layout...";
    if (vibeProgress < 50) return "Mapping event areas...";
    if (vibeProgress < 75) return "Adding room details...";
    if (vibeProgress < 100) return "Finalizing map...";
    return "Event Map Ready!";
  };

  // Render immersive Vibe experience for Event Map App (Desktop View)
  const renderNetworkingVibeExperience = () => {
    return (
      <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
        {/* Animated gradient background */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
          }}
        />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                background: `rgba(${Math.random() > 0.5 ? '59, 130, 246' : '99, 102, 241'}, ${Math.random() * 0.4 + 0.1})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center w-full px-6">
          {/* Vibe branding */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <motion.div
              animate={{ 
                rotate: vibeProgress < 100 ? 360 : 0,
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 3, repeat: vibeProgress < 100 ? Infinity : 0, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity },
              }}
              className="relative"
            >
              <div 
                className="absolute inset-0 blur-xl"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  opacity: 0.5,
                  transform: 'scale(1.5)',
                }}
              />
              <img src={vibeLogo} alt="Vibe" className="w-12 h-12 object-contain relative z-10" />
            </motion.div>
            <div>
              <h2 className="text-white font-bold text-xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Building Event Map
              </h2>
              <p className="text-gray-400 text-sm">{getNetworkingVibeStatusText()}</p>
            </div>
          </motion.div>

          {/* Desktop browser mockup */}
          <div className="relative w-full max-w-2xl">
            {/* Outer glow */}
            <motion.div
              className="absolute -inset-4 rounded-2xl"
              style={{
                background: vibeProgress >= 100 
                  ? 'linear-gradient(135deg, #22c55e, #10b981)' 
                  : 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)',
                opacity: 0.3,
                filter: 'blur(20px)',
              }}
              animate={{
                scale: [1, 1.02, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Browser frame */}
            <motion.div 
              className="relative bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              {/* Browser chrome */}
              <div className="bg-gray-700 px-4 py-3 flex items-center gap-3">
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                
                {/* Address bar */}
                <div className="flex-1 bg-gray-600 rounded-lg px-4 py-1.5 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="text-gray-300 text-sm">map.vibe.app</span>
                </div>
              </div>
              
              {/* Browser content - Event Map UI */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{ height: '380px' }}>
                {/* App header */}
                <div 
                  className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-5 py-2.5 border-b border-white/10"
                  style={{ opacity: vibeProgress > 10 ? 1 : 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-bold text-base">Annual Event 2026</p>
                        <p className="text-white/60 text-xs">Interactive Venue Map</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="bg-green-500/20 border border-green-400/30 rounded-full px-3 py-1 flex items-center gap-2"
                        animate={{ boxShadow: ['0 0 0 0 rgba(74, 222, 128, 0.4)', '0 0 0 8px rgba(74, 222, 128, 0)', '0 0 0 0 rgba(74, 222, 128, 0)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-green-400 text-xs font-semibold">LIVE</span>
                      </motion.div>
                      <div className="bg-white/10 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                        </svg>
                        <span className="text-white/70 text-xs">Floor 1</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Venue Map */}
                <div className="p-3 h-[calc(100%-52px)]" style={{ opacity: vibeProgress > 20 ? 1 : 0.3 }}>
                  <div className="bg-slate-800/50 rounded-2xl h-full p-3 border border-white/10 relative overflow-hidden backdrop-blur-sm">
                    {/* Animated grid floor pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="w-full h-full" style={{ 
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
                        backgroundSize: '24px 24px'
                      }}></div>
                    </div>
                    
                    {/* Glowing ambient effects */}
                    <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
                    
                    {/* Venue areas */}
                    <div className="relative h-full">
                      {/* Main Stage - top center */}
                      <motion.div 
                        className="absolute rounded-xl flex items-center justify-center overflow-hidden"
                        style={{ top: '3%', left: '22%', width: '56%', height: '28%' }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: vibeProgress > 30 ? 1 : 0.3, scale: 1 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent_50%)]"></div>
                        <motion.div 
                          className="absolute inset-0 opacity-30"
                          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                          style={{ background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)', backgroundSize: '200% 200%' }}
                        />
                        <div className="relative text-center z-10">
                          <div className="flex items-center justify-center gap-1.5 mb-1">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                            </svg>
                            <p className="text-white font-bold text-sm">Main Stage</p>
                          </div>
                          <div className="flex items-center justify-center gap-1">
                            <motion.div 
                              className="w-1.5 h-1.5 bg-red-400 rounded-full"
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                            <p className="text-white/80 text-[10px] font-medium">Keynote in Progress</p>
                          </div>
                        </div>
                        {vibeProgress > 50 && (
                          <motion.div 
                            className="absolute top-2 right-2 bg-red-500 rounded-md px-1.5 py-0.5 flex items-center gap-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                            <span className="text-white text-[9px] font-bold">LIVE</span>
                          </motion.div>
                        )}
                        {/* Attendee count */}
                        <motion.div 
                          className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm rounded-md px-2 py-0.5 flex items-center gap-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: vibeProgress > 60 ? 1 : 0 }}
                        >
                          <svg className="w-3 h-3 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                          </svg>
                          <span className="text-white/90 text-[9px] font-medium">847</span>
                        </motion.div>
                      </motion.div>
                      
                      {/* Workshop Rooms - left side */}
                      <motion.div 
                        className="absolute flex flex-col gap-1.5"
                        style={{ top: '35%', left: '2%', width: '18%', height: '62%' }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: vibeProgress > 40 ? 1 : 0.3, x: 0 }}
                      >
                        {[
                          { name: 'Workshop A', status: 'AI & ML', color: 'from-blue-500 to-cyan-500', people: 42 },
                          { name: 'Workshop B', status: 'Design', color: 'from-pink-500 to-rose-500', people: 38 },
                          { name: 'Workshop C', status: 'DevOps', color: 'from-emerald-500 to-teal-500', people: 31 }
                        ].map((room, i) => (
                          <motion.div 
                            key={room.name}
                            className="flex-1 rounded-lg flex flex-col items-center justify-center relative overflow-hidden border border-white/10"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${room.color} opacity-80`}></div>
                            <div className="relative z-10 text-center">
                              <p className="text-white font-semibold text-[10px]">{room.name}</p>
                              <p className="text-white/70 text-[8px]">{room.status}</p>
                            </div>
                            <div className="absolute bottom-1 right-1 bg-black/30 rounded px-1 py-0.5 flex items-center gap-0.5">
                              <svg className="w-2 h-2 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                              </svg>
                              <span className="text-white/80 text-[7px]">{room.people}</span>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                      
                      {/* Food & Drinks - right side */}
                      <motion.div 
                        className="absolute rounded-xl flex flex-col items-center justify-center overflow-hidden border border-white/10"
                        style={{ top: '35%', right: '2%', width: '20%', height: '28%' }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: vibeProgress > 50 ? 1 : 0.3, x: 0 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500"></div>
                        <div className="relative z-10 text-center">
                          <svg className="w-5 h-5 text-white mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-white font-semibold text-xs">Food Court</p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            <p className="text-white/80 text-[9px]">Open Now</p>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Expo Hall - center */}
                      <motion.div 
                        className="absolute rounded-xl flex items-center justify-center overflow-hidden border border-white/10"
                        style={{ top: '38%', left: '22%', width: '34%', height: '26%' }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: vibeProgress > 60 ? 1 : 0.3, scale: 1 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600"></div>
                        <motion.div 
                          className="absolute inset-0"
                          style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)' }}
                        />
                        <div className="relative z-10 text-center">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <p className="text-white font-bold text-sm">Expo Hall</p>
                          </div>
                          <p className="text-white/70 text-[10px]">24 Exhibitors</p>
                        </div>
                        <motion.div 
                          className="absolute bottom-1.5 left-1.5 bg-black/40 backdrop-blur-sm rounded-md px-2 py-0.5 flex items-center gap-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: vibeProgress > 70 ? 1 : 0 }}
                        >
                          <svg className="w-3 h-3 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                          </svg>
                          <span className="text-white/90 text-[9px] font-medium">156</span>
                        </motion.div>
                      </motion.div>
                      
                      {/* VIP Lounge - right bottom */}
                      <motion.div 
                        className="absolute rounded-xl flex items-center justify-center overflow-hidden border border-yellow-400/30"
                        style={{ bottom: '8%', right: '2%', width: '20%', height: '26%' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: vibeProgress > 65 ? 1 : 0.3 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 via-amber-600 to-orange-700"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
                        <div className="relative z-10 text-center">
                          <svg className="w-4 h-4 text-yellow-200 mx-auto mb-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                          </svg>
                          <p className="text-white font-semibold text-xs">VIP Lounge</p>
                          <p className="text-yellow-200/70 text-[8px]">Exclusive Access</p>
                        </div>
                      </motion.div>
                      
                      {/* Registration & Entry - bottom */}
                      <motion.div 
                        className="absolute rounded-xl flex items-center justify-center overflow-hidden border border-white/10"
                        style={{ bottom: '3%', left: '22%', width: '34%', height: '16%' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: vibeProgress > 70 ? 1 : 0.3, y: 0 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600"></div>
                        <div className="relative z-10 flex items-center gap-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-white font-semibold text-xs">Registration</p>
                            <p className="text-white/70 text-[9px]">Badge Pickup</p>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* You Are Here marker */}
                      {vibeProgress > 85 && (
                        <motion.div 
                          className="absolute flex flex-col items-center"
                          style={{ top: '50%', left: '52%' }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <motion.div 
                            className="relative"
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <svg className="w-8 h-8 text-blue-500 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            <motion.div 
                              className="absolute -inset-2 bg-blue-500/30 rounded-full"
                              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </motion.div>
                          <motion.div 
                            className="bg-blue-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full mt-0.5 shadow-lg border border-blue-400/50"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            You are here
                          </motion.div>
                        </motion.div>
                      )}
                      
                      {/* Animated walking paths */}
                      {vibeProgress > 90 && (
                        <>
                          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.4 }}>
                            <motion.circle
                              cx="45%"
                              cy="70%"
                              r="3"
                              fill="#60a5fa"
                              initial={{ cx: '45%', cy: '70%' }}
                              animate={{ cx: ['45%', '50%', '55%'], cy: ['70%', '55%', '45%'] }}
                              transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
                            />
                            <motion.circle
                              cx="60%"
                              cy="50%"
                              r="2.5"
                              fill="#a78bfa"
                              initial={{ cx: '60%', cy: '50%' }}
                              animate={{ cx: ['60%', '40%', '25%'], cy: ['50%', '55%', '50%'] }}
                              transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
                            />
                          </svg>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Success overlay */}
              {vibeProgress >= 100 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
            
            {/* Progress bar below browser */}
            <div className="mt-4">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                  style={{ width: `${vibeProgress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-400 text-sm">{getNetworkingVibeStatusText()}</span>
                <span className="text-white font-bold text-sm">{vibeProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Sidekick content based on stage
  const renderSidekickContent = () => {
    switch (stage) {
      case 'context-recognition':
        const planSteps = [
          { icon: Globe, text: 'Create event landing page', delay: 0.4 },
          { icon: Mail, text: 'Design & send email campaign', delay: 0.6 },
          { icon: Users, text: 'Set up AI agents for confirmations', delay: 0.8 },
          { icon: Calendar, text: 'Build event map app with Vibe', delay: 1.0 },
          { icon: FileText, text: 'Generate event report', delay: 1.2 },
        ];
        const showPlan = contextTypingIndex >= contextMessage.length;
        return (
          <motion.div
            key="context"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {/* Current Sidekick message with plan */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 shadow-md bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl rounded-tl-md px-4 py-3 shadow-lg shadow-indigo-500/25">
                <p className="text-white font-medium">
                  {contextMessage.slice(0, contextTypingIndex)}
                  {contextTypingIndex < contextMessage.length && (
                    <span className="animate-pulse">|</span>
                  )}
                </p>
              </div>
            </div>
            
            {/* Plan steps card */}
            {showPlan && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl px-4 py-4 border ml-11"
                style={{
                  background: '#f8fafc',
                  borderColor: '#e2e8f0',
                }}
              >
                <div className="space-y-2.5">
                  {planSteps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + (i * 0.2) }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <step.icon className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                      <p className="text-gray-700 text-sm">{step.text}</p>
                    </motion.div>
                  ))}
                </div>
                
                {!showVibeUserResponse && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                    className="mt-4 pt-3 border-t border-gray-200"
                  >
                    <p className="text-indigo-500 text-xs font-medium">Waiting for your response...</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* User response to start Vibe */}
            {showVibeUserResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-3 justify-end"
              >
                <div 
                  className="rounded-2xl rounded-br-md px-4 py-3 shadow-lg max-w-[80%]"
                  style={{ background: '#e5e7eb' }}
                >
                  <p className="text-gray-800 text-sm">
                    {vibeUserResponseMessage.slice(0, vibeUserResponseTypingIndex)}
                    {vibeUserResponseTypingIndex < vibeUserResponseMessage.length && (
                      <span className="animate-pulse">|</span>
                    )}
                  </p>
                </div>
                <img 
                  src={userAvatarIntro} 
                  alt="User" 
                  className="w-10 h-10 rounded-full object-cover shadow-md flex-shrink-0"
                />
              </motion.div>
            )}
          </motion.div>
        );

      case 'landing-page':
        return (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {/* Sidekick message with Vibe logo - simplified since preview is on board */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 shadow-md bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div 
                className="flex-1 backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-4 border"
                style={{
                  background: sidekickTheme.cardBackground,
                  borderColor: sidekickTheme.cardBorder,
                  backdropFilter: `blur(${sidekickTheme.cardBackdropBlur})`,
                }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
                  >
                    <img src={vibeLogo} alt="Vibe" className="w-8 h-8 object-contain" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">Building your landing page...</p>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mt-2">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-pink-500 to-orange-400"
                        style={{ width: `${landingProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'landing-page-done':
        return (
          <motion.div
            key="landing-done"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {/* Sidekick message - landing page is ready */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 shadow-md bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div 
                className="flex-1 backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-3 border"
                style={{
                  background: sidekickTheme.cardBackground,
                  borderColor: sidekickTheme.cardBorder,
                  backdropFilter: `blur(${sidekickTheme.cardBackdropBlur})`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-green-400 text-sm font-medium">Landing page is live!</span>
                </div>
                <p className="text-white/90 text-sm">
                  {landingDoneSidekickMessage.slice(0, landingDoneSidekickTypingIndex)}
                  {landingDoneSidekickTypingIndex < landingDoneSidekickMessage.length && (
                    <span className="animate-pulse">|</span>
                  )}
                </p>
              </div>
            </div>

            {/* User response */}
            {showLandingDoneUserResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-3 justify-end"
              >
                <div 
                  className="rounded-2xl rounded-br-md px-4 py-2 shadow-sm max-w-[80%]"
                  style={{ background: '#e5e7eb' }}
                >
                  <p style={{ color: '#374151' }} className="text-sm">
                    {landingDoneUserMessage.slice(0, landingDoneUserTypingIndex)}
                    {landingDoneUserTypingIndex < landingDoneUserMessage.length && (
                      <span className="animate-pulse">|</span>
                    )}
                  </p>
                </div>
                <img 
                  src={userAvatarIntro} 
                  alt="User" 
                  className="w-10 h-10 rounded-full object-cover shadow-md flex-shrink-0"
                />
              </motion.div>
            )}
          </motion.div>
        );

      case 'email-campaign':
        return (
          <motion.div
            key="email-campaign"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {/* User message with avatar */}
            <div className="flex items-end gap-3 justify-end">
              <div 
                className="rounded-2xl rounded-br-md px-3 py-2 max-w-[75%] shadow-lg"
                style={{ background: sidekickTheme.userMessageBg }}
              >
                <p className="text-sm" style={{ color: sidekickTheme.userMessageText }}>
                  {emailUserMessage.slice(0, emailUserTypingIndex)}
                  {emailUserTypingIndex < emailUserMessage.length && (
                    <span className="animate-pulse">|</span>
                  )}
                </p>
              </div>
              <img 
                src={userAvatarIntro} 
                alt="User" 
                className="w-10 h-10 rounded-full object-cover shadow-md flex-shrink-0"
              />
            </div>
            {/* Sidekick response */}
            {emailUserTypingIndex >= emailUserMessage.length && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-sm rounded-2xl px-4 py-4 border"
                style={{
                  background: sidekickTheme.cardBackground,
                  borderColor: sidekickTheme.cardBorder,
                  backdropFilter: `blur(${sidekickTheme.cardBackdropBlur})`,
                }}
              >
                <p className="font-medium mb-3" style={{ color: sidekickTheme.primaryText }}>
                  {emailSidekickMessage.slice(0, emailSidekickTypingIndex)}
                  {emailSidekickTypingIndex < emailSidekickMessage.length && (
                    <span className="animate-pulse">|</span>
                  )}
                </p>
                {emailSidekickTypingIndex >= emailSidekickMessage.length && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 p-2 rounded-lg"
                    style={{ background: `${sidekickTheme.amberAccent}30` }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${sidekickTheme.amberAccent}40` }}>
                      <Mail className="w-4 h-4" style={{ color: sidekickTheme.amberAccent }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: sidekickTheme.primaryText }}>Email Campaign</p>
                      <p className="text-xs" style={{ color: sidekickTheme.mutedText }}>Personalized invitations</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        );

      case 'design-selection':
        return (
          <motion.div
            key="design"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Design options card */}
            <div 
              className="backdrop-blur-sm rounded-2xl px-4 py-4 border"
              style={{
                background: sidekickTheme.cardBackground,
                borderColor: sidekickTheme.cardBorder,
                backdropFilter: `blur(${sidekickTheme.cardBackdropBlur})`,
              }}
            >
              <p className="text-white text-base font-medium mb-3">Choose your email design:</p>
              <div className="space-y-2">
                {/* Minimalist option */}
                <div className="p-2.5 rounded-xl border border-white/20 cursor-pointer hover:border-white/40 transition-all flex items-center gap-3 bg-white/5">
                  <div className="w-14 h-10 rounded-lg bg-white/20 border border-white/30 flex flex-col items-center justify-center flex-shrink-0">
                    <div className="w-7 h-0.5 bg-white/50 rounded mb-1"></div>
                    <div className="w-4 h-0.5 bg-white/30 rounded"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Minimalist</p>
                    <p className="text-xs text-white/60">Clean and simple</p>
                  </div>
                </div>
                
                {/* Colorful option - animates selection */}
                <motion.div 
                  className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors duration-300 ${
                    designSelected 
                      ? 'border-indigo-400 bg-indigo-500/30' 
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                  animate={designSelected ? { 
                    boxShadow: ['0 0 0px rgba(99, 102, 241, 0)', '0 0 15px rgba(99, 102, 241, 0.4)', '0 0 0px rgba(99, 102, 241, 0)'] 
                  } : {}}
                  transition={{ duration: 2, repeat: designSelected ? Infinity : 0 }}
                >
                  <div className="w-14 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium text-white ${designSelected ? 'font-semibold' : ''}`}>Colorful</p>
                    <p className={`text-xs ${designSelected ? 'text-indigo-300' : 'text-white/60'}`}>Eye-catching design</p>
                  </div>
                  <AnimatePresence>
                    {designSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      >
                        <Check className="w-5 h-5 text-indigo-300" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                
                {/* Formal option */}
                <div className="p-2.5 rounded-xl border border-white/20 cursor-pointer hover:border-white/40 transition-all flex items-center gap-3 bg-white/5">
                  <div className="w-14 h-10 rounded-lg bg-slate-800 flex flex-col items-center justify-center flex-shrink-0">
                    <div className="w-5 h-0.5 bg-amber-400 rounded mb-1"></div>
                    <div className="w-7 h-0.5 bg-white/70 rounded"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Formal</p>
                    <p className="text-xs text-white/60">Professional look</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'email-preview':
        return (
          <motion.div
            key="email-preview"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-2"
          >
            {/* Header */}
            <div 
              className="backdrop-blur-sm rounded-2xl px-4 py-3 border"
              style={{
                background: sidekickTheme.cardBackground,
                borderColor: sidekickTheme.cardBorder,
                backdropFilter: `blur(${sidekickTheme.cardBackdropBlur})`,
              }}
            >
              <p className="text-white text-sm font-medium">Here's your email preview:</p>
            </div>
            
            {/* Email preview - email client frame */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-xl p-1 shadow-xl border border-gray-300"
            >
              {/* Email client header - dark style */}
              <div className="flex items-center gap-2 px-2 py-1 border-b border-gray-700">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-gray-400 text-[9px]">New Message</span>
                </div>
              </div>
              
              {/* Email content - white background */}
              <div className="bg-white rounded-b-lg overflow-hidden">
              
              {/* Email meta */}
              <div className="px-3 py-2 border-b border-gray-100 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 text-[10px] w-10">From:</span>
                  <span className="text-gray-700 text-[10px] font-medium">Marketing &lt;events@company.com&gt;</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 text-[10px] w-10">Subject:</span>
                  <span className="text-gray-900 text-[10px] font-bold">You're Invited! Annual Event 2026</span>
                </div>
              </div>
              
              {/* Email body */}
              <div className="p-3">
                {/* Hero banner */}
                <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-lg p-4 text-center mb-3 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1 left-2 w-5 h-5 border border-white/30 rounded-full"></div>
                    <div className="absolute bottom-2 right-3 w-6 h-6 border border-white/30 rounded-lg rotate-12"></div>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-6 h-6 text-white mx-auto mb-1.5" />
                  </motion.div>
                  <h3 className="text-white font-bold text-base mb-0.5">You're Invited!</h3>
                  <p className="text-white/90 text-[10px]">Join us for an unforgettable experience</p>
                </div>
                
                {/* Event details - compact */}
                <div className="space-y-2 mb-3">
                  <p className="text-gray-600 text-[10px] leading-relaxed">
                    We're thrilled to invite you to our Annual Company Event!
                  </p>
                  
                  <div className="bg-gray-100 rounded-md p-2 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center">
                        <Calendar className="w-3 h-3 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-gray-900 text-[11px] font-medium">March 15, 2026 • 6:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-pink-100 flex items-center justify-center">
                        <MapPin className="w-3 h-3 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-gray-900 text-[11px] font-medium">Grand Conference Center</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* CTA Button */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md py-2 font-bold text-xs shadow-md shadow-purple-500/30"
                >
                  RSVP Now
                </motion.button>
              </div>
              </div>
            </motion.div>
          </motion.div>
        );

      case 'sending-emails':
        return (
          <motion.div
            key="sending"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-indigo-500/20 rounded-2xl p-4 border border-indigo-400/30">
              <div className="flex items-center gap-3 mb-4">
                <img src={campaignsLogo} alt="monday campaigns" className="w-10 h-10 rounded-lg" />
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
                    className="w-3 h-3 rounded-full bg-green-500" 
                  />
                )}
                {emailsSent >= 5 && <Check className="w-5 h-5 text-green-500" />}
                <span className={`text-lg font-bold ${emailsSent >= 5 ? 'text-green-400' : 'text-indigo-300'}`}>
                  {emailsSent}/5 sent
                </span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  animate={{ width: `${(emailsSent / 5) * 100}%` }}
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
        );

      case 'attendance-request':
        return (
          <motion.div
            key="attendance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {/* User message with avatar */}
            <div className="flex items-end gap-3 justify-end">
              <div 
                className="rounded-2xl rounded-br-md px-3 py-2 max-w-[75%] shadow-lg"
                style={{ background: sidekickTheme.userMessageBg }}
              >
                <p className="text-sm" style={{ color: sidekickTheme.userMessageText }}>
                  {attendanceUserMessage.slice(0, attendanceUserTypingIndex)}
                  {attendanceUserTypingIndex < attendanceUserMessage.length && (
                    <span className="animate-pulse">|</span>
                  )}
                </p>
              </div>
              <img 
                src={userAvatarIntro} 
                alt="User" 
                className="w-10 h-10 rounded-full object-cover shadow-md flex-shrink-0"
              />
            </div>
            {/* Sidekick response */}
            {attendanceUserTypingIndex >= attendanceUserMessage.length && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-sm rounded-2xl px-4 py-4 border"
                style={{
                  background: sidekickTheme.cardBackground,
                  borderColor: sidekickTheme.cardBorder,
                  backdropFilter: `blur(${sidekickTheme.cardBackdropBlur})`,
                }}
              >
                <p className="font-medium" style={{ color: sidekickTheme.primaryText }}>
                  {attendanceSidekickMessage.slice(0, attendanceSidekickTypingIndex)}
                  {attendanceSidekickTypingIndex < attendanceSidekickMessage.length && (
                    <span className="animate-pulse">|</span>
                  )}
                </p>
              </motion.div>
            )}
          </motion.div>
        );

      case 'agents-creation':
        return (
          <motion.div
            key="agents-sidekick"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-6 px-4"
          >
            {/* Sidekick icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            
            {/* Status message */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10 text-center">
              <p className="text-white font-medium mb-3">
                {agentProgress >= 100 ? 'Agent is ready!' : 'Creating your AI agent...'}
              </p>
              
              {/* Mini progress bar */}
              <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-teal-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${agentProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <p className="text-white/60 text-sm mt-2">{agentProgress}%</p>
            </div>
            
            {/* Ready indicator */}
            {agentProgress >= 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 mt-4 text-green-400"
              >
                <Check className="w-5 h-5" />
                <span className="font-medium">Ready to make calls</span>
              </motion.div>
            )}
          </motion.div>
        );

      case 'agents-creation-old': // keeping old version as backup
        return (
          <motion.div
            key="agents-old"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-purple-50 rounded-2xl px-4 py-4 border border-purple-200 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <p className="text-base font-bold text-white">Creating AI Agents</p>
                  <p className="text-purple-300 text-sm">for follow-up calls</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[salesAgent1, agentImage1, agentImage3, marketingRsvpAgent].map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: agentProgress > i * 25 ? 1 : 0 }}
                    className="relative"
                  >
                    <img src={img} alt="" className="w-12 h-12 rounded-lg object-cover mx-auto border-2 border-purple-200 shadow-sm" />
                    {agentProgress > i * 25 + 20 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-2.5 h-2.5 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
              {agentProgress >= 100 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/20 rounded-xl p-3 border border-green-400/30"
                >
                  <p className="text-green-300 font-semibold text-center flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" /> Agents ready!
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="h-2.5 bg-white/20 rounded-full overflow-hidden mb-2">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-indigo-400 to-purple-400"
                      style={{ width: `${agentProgress}%` }}
                    />
                  </div>
                  <p className="text-white/60 text-sm text-center">{agentProgress}%</p>
                </>
              )}
            </div>
          </motion.div>
        );

      case 'agent-calling':
        const pendingLeads = 5 - confirmedContacts.length;
        return (
          <motion.div
            key="calling"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Card with responses */}
            <div 
              className="backdrop-blur-sm rounded-2xl px-4 py-4 border"
              style={{
                background: sidekickTheme.cardBackground,
                borderColor: sidekickTheme.cardBorder,
                backdropFilter: `blur(${sidekickTheme.cardBackdropBlur})`,
              }}
            >
              {/* Header */}
              <p className="text-white text-sm font-medium mb-3">Responses coming in:</p>
              
              {/* Contact rows */}
              <div className="space-y-2">
                {contactsData.slice(0, 3).map((contact, index) => {
                  const isConfirmed = confirmedContacts.includes(index);
                  return (
                    <motion.div
                      key={contact.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ 
                        opacity: isConfirmed ? 1 : 0.3,
                        x: isConfirmed ? 0 : 20
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-green-500/20 border border-green-400/30"
                    >
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-300">
                        <img src={contact.image} alt={contact.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-white flex-1">{contact.name}</span>
                      {isConfirmed && (
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
                  );
                })}
              </div>
              
              {/* Pending leads button */}
              {pendingLeads > 0 && (
                <div className="mt-3 bg-amber-100 rounded-lg p-2 border border-amber-300">
                  <p className="text-amber-800 text-xs text-center font-medium">
                    {pendingLeads} leads need follow-up
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 'agent-board-calling':
        const currentContact = contactsData[boardCallingIndex];
        const mins = Math.floor(boardCallTimer / 60);
        const secs = boardCallTimer % 60;
        return (
          <motion.div
            key="board-calling"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            {/* Current call indicator */}
            <motion.div 
              className="bg-green-500/20 rounded-2xl p-4 border border-green-400/30"
              animate={{ 
                boxShadow: ['0 0 0px rgba(34, 197, 94, 0.1)', '0 0 15px rgba(34, 197, 94, 0.2)', '0 0 0px rgba(34, 197, 94, 0.1)']
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                {/* Avatars */}
                <div className="flex items-center -space-x-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-400 z-10">
                    <img src={currentContact?.image} alt={currentContact?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-1000 flex items-center justify-center border-2 border-green-300 z-20">
                    <PhoneCall className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                {/* Name */}
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{currentContact?.name}</p>
                  <p className="text-green-400 text-xs">{currentContact?.company}</p>
                </div>
                
                {/* Audio bars */}
                <div className="flex items-center gap-0.5 h-5">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-green-1000 rounded-full"
                      animate={{ height: ['6px', '16px', '10px', '20px', '6px'] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
                
                {/* Timer */}
                <div className="text-green-400 font-mono text-sm font-medium">
                  {mins}:{secs.toString().padStart(2, '0')}
                </div>
              </div>
            </motion.div>
            
            {/* Progress */}
            <div 
              className="backdrop-blur-sm rounded-xl p-3 border"
              style={{
                background: sidekickTheme.cardBackground,
                borderColor: sidekickTheme.cardBorder,
                backdropFilter: `blur(${sidekickTheme.cardBackdropBlur})`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm">Progress</span>
                <span className="text-green-400 font-bold">{confirmedContacts.length}/5</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                  initial={{ width: '60%' }}
                  animate={{ width: `${(confirmedContacts.length / 5) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Recent confirmations */}
            {confirmedContacts.length >= 3 && (
              <div className="space-y-2">
                {confirmedContacts.slice(-2).map((idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-green-500/20 rounded-lg p-2 border border-green-400/30 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">{contactsData[idx]?.name} confirmed!</span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        );

      case 'vibe-request':
        return (
          <motion.div
            key="vibe-request"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {/* User message with avatar */}
            <div className="flex items-end gap-3 justify-end">
              <div 
                className="rounded-2xl rounded-br-md px-3 py-2 max-w-[75%] shadow-lg"
                style={{ background: sidekickTheme.userMessageBg }}
              >
                <p style={{ color: sidekickTheme.userMessageText }} className="text-sm">
                  {vibeUserMessage.slice(0, vibeUserTypingIndex)}
                  {vibeUserTypingIndex < vibeUserMessage.length && (
                    <span className="animate-pulse">|</span>
                  )}
                </p>
              </div>
              <img 
                src={userAvatarIntro} 
                alt="User" 
                className="w-10 h-10 rounded-full object-cover shadow-md flex-shrink-0"
              />
            </div>
            {/* Sidekick response with Vibe accent */}
            {vibeUserTypingIndex >= vibeUserMessage.length && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-sm rounded-2xl px-4 py-4 border"
                style={{
                  background: sidekickTheme.cardBackground,
                  borderColor: sidekickTheme.cardBorder,
                  backdropFilter: `blur(${sidekickTheme.cardBackdropBlur})`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                    <img src={vibeLogo} alt="Vibe" className="w-10 h-10 object-contain" />
                  </div>
                  <p className="font-medium" style={{ color: sidekickTheme.primaryText }}>
                    {vibeSidekickMessage.slice(0, vibeSidekickTypingIndex)}
                    {vibeSidekickTypingIndex < vibeSidekickMessage.length && (
                      <span className="animate-pulse">|</span>
                    )}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      case 'vibe-building':
        const isAppReady = vibeProgress >= 100;
        return (
          <motion.div
            key="vibe-building"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {/* Loading card with Vibe branding */}
            <div 
              className={`rounded-2xl px-5 py-5 border ${isAppReady ? 'bg-green-500/20 border-green-400/30' : 'backdrop-blur-sm'}`}
              style={!isAppReady ? {
                background: sidekickTheme.cardBackground,
                borderColor: sidekickTheme.cardBorder,
                backdropFilter: `blur(${sidekickTheme.cardBackdropBlur})`,
              } : undefined}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: isAppReady ? 0 : 360 }}
                  transition={{ duration: 2, repeat: isAppReady ? 0 : Infinity, ease: 'linear' }}
                  className="w-14 h-14 flex-shrink-0 flex items-center justify-center"
                >
                  {isAppReady ? (
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-7 h-7 text-white" />
                    </div>
                  ) : (
                    <img src={vibeLogo} alt="Vibe" className="w-12 h-12 object-contain" />
                  )}
                </motion.div>
                <div className="flex-1">
                  <p className={`font-medium text-base ${isAppReady ? 'text-green-400' : 'text-white'}`}>
                    {isAppReady ? 'Event Map Ready!' : 'Building Event Map...'}
                  </p>
                  <p className="text-white/70 text-sm mt-1">
                    {isAppReady ? 'Attendees can navigate the venue' : getNetworkingVibeStatusText()}
                  </p>
                  {!isAppReady && (
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden mt-3">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400"
                        style={{ width: `${vibeProgress}%` }}
                      />
                    </div>
                  )}
                  {!isAppReady && (
                    <p className="text-white/60 text-xs mt-1">{vibeProgress}% complete</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Success message */}
            {isAppReady && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 shadow-lg"
              >
                <p className="text-white text-center font-medium flex items-center justify-center gap-2 text-sm">
                  <Check className="w-4 h-4" /> Event Map is live!
                </p>
              </motion.div>
            )}
          </motion.div>
        );

      case 'report':
        return (
          <motion.div
            key="report"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {reportProgress < 100 ? (
              // Generating state
              <div className="bg-indigo-500/20 rounded-2xl p-5 border border-indigo-400/30">
                <div className="flex items-center gap-4 mb-5">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
                  >
                    <FileText className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-lg font-bold text-white">Event Report</p>
                    <p className="text-indigo-300 text-sm">Generating for CMO...</p>
                  </div>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-2">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    style={{ width: `${reportProgress}%` }}
                  />
                </div>
                <p className="text-white/60 text-sm text-center font-medium">{reportProgress}%</p>
              </div>
            ) : (
              // Complete state - celebratory design
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-2xl"
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600"></div>
                
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        left: `${10 + (i * 8)}%`,
                        top: '-10px',
                        background: ['#fbbf24', '#f472b6', '#818cf8', '#34d399'][i % 4],
                      }}
                      animate={{
                        y: [0, 200],
                        opacity: [1, 0],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </div>
                
                <div className="relative p-5 text-center">
                  {/* Success icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
                    className="w-16 h-16 rounded-full bg-white mx-auto mb-3 flex items-center justify-center shadow-xl"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Check className="w-8 h-8 text-green-500" />
                    </motion.div>
                  </motion.div>
                  
                  {/* Title */}
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white font-bold text-xl mb-1"
                  >
                    All Tasks Complete!
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/80 text-sm mb-4"
                  >
                    Event campaign successfully finished
                  </motion.p>
                  
                  {/* Stats cards */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-2 justify-center"
                  >
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                      <div className="text-white font-bold text-lg">5</div>
                      <div className="text-white/80 text-[10px]">Emails Sent</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                      <div className="text-white font-bold text-lg">5</div>
                      <div className="text-white/80 text-[10px]">Confirmed</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                      <div className="text-white font-bold text-lg">1</div>
                      <div className="text-white/80 text-[10px]">App Built</div>
                    </div>
                  </motion.div>
                  
                  {/* Report ready badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30"
                  >
                    <FileText className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold text-xs">Report sent to CMO</span>
                    <Check className="w-3.5 h-3.5 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden select-none" 
      style={{ height: '100vh', width: '100vw', background: '#ffffff' }}
    >
      {/* Connecting line between Sidekick and CRM during email sending */}
      {stage === 'sending-emails' && (
        <motion.div
          className="absolute pointer-events-none overflow-hidden"
          style={{
            top: '50%',
            left: '35%',
            right: '50%',
            height: '4px',
            transform: 'translateY(-50%)',
            zIndex: 5,
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Line base */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full shadow-lg opacity-40" />
          
          {/* Flowing pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(45, 212, 191, 0.8) 50%, transparent 100%)',
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      )}

      {/* Connecting line between Sidekick and Vibe app during landing-page */}
      {stage === 'landing-page' && (
        <motion.div
          className="absolute pointer-events-none overflow-hidden"
          style={{
            top: '50%',
            left: '35%',
            right: '50%',
            height: '4px',
            transform: 'translateY(-50%)',
            zIndex: 5,
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Line base - purple/pink for Vibe */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-full shadow-lg opacity-40" />
          
          {/* Flowing pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(168, 85, 247, 0.8) 50%, transparent 100%)',
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      )}

      {/* Connecting line between Sidekick and Vibe app during vibe-building */}
      {stage === 'vibe-building' && (
        <motion.div
          className="absolute pointer-events-none overflow-hidden"
          style={{
            top: '50%',
            left: '35%',
            right: '50%',
            height: '4px',
            transform: 'translateY(-50%)',
            zIndex: 5,
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Line base - purple/pink for Vibe */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-full shadow-lg opacity-40" />
          
          {/* Flowing pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(168, 85, 247, 0.8) 50%, transparent 100%)',
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      )}

      {/* Main container - always present, animates layout */}
      {/* flex-row-reverse puts Sidekick (second child) on left, Board (first child) on right */}
      <div className="h-full w-full flex flex-row-reverse">
        {/* LEFT SIDE - Board (hidden during intro, slides in after plan is shown) */}
        <motion.div
          className="h-full"
          initial={false}
          animate={{
            width: (isIntro || (stage === 'context-recognition' && !showBoardAfterPlan)) ? '0%' : '50%',
            opacity: (isIntro || (stage === 'context-recognition' && !showBoardAfterPlan)) ? 0 : 1,
          }}
          transition={{ duration: 0.7, type: 'spring', bounce: 0.15 }}
          style={{
            background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
          }}
        >
          {!isIntro && (stage !== 'context-recognition' || showBoardAfterPlan) && (
            <AnimatePresence mode="wait">
              {/* Show Vibe experience during landing-page stages */}
              {(stage === 'landing-page' || stage === 'landing-page-done') && (
                <motion.div key="vibe-exp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  {renderVibeExperience()}
                </motion.div>
              )}
              {/* Show Networking Vibe experience during vibe-request and vibe-building stages */}
              {(stage === 'vibe-request' || stage === 'vibe-building') && (
                <motion.div key="networking-vibe-exp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  {renderNetworkingVibeExperience()}
                </motion.div>
              )}
              {/* Show Agent Creation experience during agents-creation stage */}
              {stage === 'agents-creation' && (
                <motion.div key="agents-creation-exp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  {renderAgentCreationExperience()}
                </motion.div>
              )}
              {currentBoard === 'work-management' && stage !== 'landing-page' && stage !== 'landing-page-done' && stage !== 'vibe-request' && stage !== 'vibe-building' && stage !== 'agents-creation' && (
                <motion.div key="wm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  {renderWorkManagementBoard()}
                </motion.div>
              )}
              {/* Campaigns Board for design-selection stage */}
              {(stage === 'design-selection' || stage === 'email-preview') && (
                <motion.div key="campaigns" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="h-full">
                  {renderCampaignsBoard()}
                </motion.div>
              )}
              {currentBoard === 'crm' && stage !== 'design-selection' && stage !== 'email-preview' && (
                <motion.div key="crm" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="h-full relative">
                  {renderCRMBoard()}
                  {/* Agent Calling Overlay */}
                  {stage === 'agent-calling' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-2xl m-6"
                    >
                      <div className="text-center space-y-6">
                        {/* Agent and Lead Avatars with connecting line */}
                        <div className="flex items-center justify-center gap-4">
                          {/* Lead Avatar */}
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-20 h-20 rounded-full overflow-hidden border-4 border-yellow-400"
                            style={{ boxShadow: '0 0 25px rgba(250, 204, 21, 0.4)' }}
                          >
                            <img 
                              src={contactsData[Math.min(confirmedContacts.length, contactsData.length - 1)]?.image} 
                              alt="Lead" 
                              className="w-full h-full object-cover" 
                            />
                          </motion.div>
                          
                          {/* Connecting Line with pulse */}
                          <div className="relative w-24 h-1.5">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-green-400 to-green-500 rounded-full opacity-40"></div>
                            <motion.div 
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 to-green-500 rounded-full"
                              animate={{ width: ['0%', '100%', '0%'] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          </div>
                          
                          {/* Agent Avatar */}
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                            className="w-20 h-20 rounded-full overflow-hidden border-4 border-green-500"
                            style={{ boxShadow: '0 0 25px rgba(34, 197, 94, 0.5)' }}
                          >
                            <img src={marketingRsvpAgent} alt="Agent" className="w-full h-full object-contain" style={{ transform: 'scale(1.3)' }} />
                          </motion.div>
                        </div>
                        
                        {/* Call Status */}
                        <div>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="w-14 h-14 rounded-full bg-green-1000 flex items-center justify-center mx-auto mb-3"
                            style={{ boxShadow: '0 0 25px rgba(34, 197, 94, 0.6)' }}
                          >
                            <PhoneCall className="w-7 h-7 text-white" />
                          </motion.div>
                          <p className="text-white font-bold text-xl mb-1">Active Call</p>
                          <p className="text-green-400 text-sm flex items-center justify-center gap-2">
                            <motion.span 
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="w-2 h-2 rounded-full bg-green-400"
                            />
                            Calling {contactsData[Math.min(confirmedContacts.length, contactsData.length - 1)]?.name}...
                          </p>
                        </div>
                        
                        {/* Call Message */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="bg-white/10 rounded-xl p-4 max-w-sm mx-auto border border-white/20"
                        >
                          <p className="text-white/80 text-sm italic">
                            "{callMessage.slice(0, callMessageIndex)}"
                            {callMessageIndex < callMessage.length && (
                              <span className="animate-pulse">|</span>
                            )}
                          </p>
                        </motion.div>
                        
                        {/* Confirmed Count */}
                        {confirmedContacts.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-1000/20 rounded-xl px-4 py-2 border border-green-400/30"
                          >
                            <p className="text-green-400 font-semibold flex items-center justify-center gap-2">
                              <Check className="w-5 h-5" /> {confirmedContacts.length} confirmed
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
              {currentBoard === 'agents' && (
                <motion.div key="agents" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="h-full relative">
                  {renderAgentsBoard()}
                  {/* Agent Calling Overlay */}
                  {stage === 'agent-calling' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-2xl m-6"
                    >
                      <div className="text-center space-y-6">
                        {/* Agent and Lead Avatars with connecting line */}
                        <div className="flex items-center justify-center gap-4">
                          {/* Lead Avatar */}
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-20 h-20 rounded-full overflow-hidden border-4 border-yellow-400"
                            style={{ boxShadow: '0 0 25px rgba(250, 204, 21, 0.4)' }}
                          >
                            <img 
                              src={contactsData[Math.min(confirmedContacts.length, contactsData.length - 1)]?.image} 
                              alt="Lead" 
                              className="w-full h-full object-cover" 
                            />
                          </motion.div>
                          
                          {/* Connecting Line with pulse */}
                          <div className="relative w-24 h-1.5">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-green-400 to-green-500 rounded-full opacity-40"></div>
                            <motion.div 
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 to-green-500 rounded-full"
                              animate={{ width: ['0%', '100%', '0%'] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          </div>
                          
                          {/* Agent Avatar */}
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                            className="w-20 h-20 rounded-full overflow-hidden border-4 border-green-500"
                            style={{ boxShadow: '0 0 25px rgba(34, 197, 94, 0.5)' }}
                          >
                            <img src={marketingRsvpAgent} alt="Agent" className="w-full h-full object-contain" style={{ transform: 'scale(1.3)' }} />
                          </motion.div>
                        </div>
                        
                        {/* Call Status */}
                        <div>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="w-14 h-14 rounded-full bg-green-1000 flex items-center justify-center mx-auto mb-3"
                            style={{ boxShadow: '0 0 25px rgba(34, 197, 94, 0.6)' }}
                          >
                            <PhoneCall className="w-7 h-7 text-white" />
                          </motion.div>
                          <p className="text-white font-bold text-xl mb-1">Active Call</p>
                          <p className="text-green-400 text-sm flex items-center justify-center gap-2">
                            <motion.span 
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="w-2 h-2 rounded-full bg-green-400"
                            />
                            Calling {contactsData[Math.min(confirmedContacts.length, contactsData.length - 1)]?.name}...
                          </p>
                        </div>
                        
                        {/* Call Message */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="bg-white/10 rounded-xl p-4 max-w-sm mx-auto border border-white/20"
                        >
                          <p className="text-white/80 text-sm italic">
                            "{callMessage.slice(0, callMessageIndex)}"
                            {callMessageIndex < callMessage.length && (
                              <span className="animate-pulse">|</span>
                            )}
                          </p>
                        </motion.div>
                        
                        {/* Confirmed Count */}
                        {confirmedContacts.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-1000 rounded-xl px-6 py-3"
                            style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' }}
                          >
                            <p className="text-white font-semibold flex items-center justify-center gap-2">
                              <Check className="w-5 h-5" /> {confirmedContacts.length} confirmed
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
              {currentBoard === 'vibe' && (
                <motion.div key="vibe" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="h-full">
                  {renderVibeBoard()}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>

        {/* RIGHT SIDE - Sidekick (full width during intro and until board appears, 50% after) */}
        <motion.div
          className="h-full flex items-center justify-center"
          initial={false}
          animate={{ 
            background: themeLoading 
              ? '#000000' 
              : '#ffffff',
            width: (isIntro || (stage === 'context-recognition' && !showBoardAfterPlan)) ? '100%' : '50%',
          }}
          transition={{ duration: 0.7, type: 'spring', bounce: 0.15 }}
        >
          {isIntro ? (
            // Intro: Clean background with just conversation - no panel border
            <div className="w-full h-full flex flex-col items-center justify-center px-8">
              {/* Sidekick Logo */}
              <motion.div 
                className="mb-8"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
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
              
              {/* Conversation messages */}
              <div className="space-y-4 max-w-lg w-full">
                {/* Sidekick intro message */}
                <motion.div 
                  className="rounded-2xl px-6 py-4 shadow-lg"
                  style={{
                    background: `linear-gradient(to right, ${sidekickTheme.introBubbleGradientFrom || '#6366f1'}, ${sidekickTheme.introBubbleGradientTo || '#a855f7'})`,
                    boxShadow: `0 10px 15px -3px ${sidekickTheme.introBubbleShadow || 'rgba(99, 102, 241, 0.3)'}`,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-white text-xl" style={{ fontWeight: 500 }}>
                    {introMessage.slice(0, introTypingIndex)}
                    {introTypingIndex < introMessage.length && (
                      <span className="animate-pulse">|</span>
                    )}
                  </p>
                </motion.div>
                
                {/* User response with avatar - appears after intro is done */}
                {(stage === 'user-response' || stage === 'context-response') && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-3 justify-end"
                  >
                    <motion.div
                      className="rounded-2xl rounded-br-md px-5 py-3 shadow-sm"
                      style={{ background: '#e5e7eb' }}
                    >
                      <p style={{ color: '#374151' }} className="text-lg whitespace-nowrap">
                        {stage === 'user-response' 
                          ? userResponseMessage.slice(0, userTypingIndex)
                          : userResponseMessage
                        }
                        {stage === 'user-response' && userTypingIndex < userResponseMessage.length && (
                          <span className="animate-pulse">|</span>
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

                {/* Context response - brief transition message */}
                {stage === 'context-response' && (
                  <motion.div 
                    className="rounded-2xl px-5 py-3 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: `linear-gradient(to right, ${sidekickTheme.introBubbleGradientFrom || '#6366f1'}, ${sidekickTheme.introBubbleGradientTo || '#a855f7'})`,
                      boxShadow: `0 10px 15px -3px ${sidekickTheme.introBubbleShadow || 'rgba(99, 102, 241, 0.3)'}`,
                    }}
                  >
                    <p className="text-white text-lg" style={{ fontWeight: 500 }}>
                      <span className="animate-pulse">...</span>
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            // After intro: Sidekick Panel with gradient border (dark background)
            <motion.div
              className="rounded-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ 
                background: 'linear-gradient(135deg, #ec4899, #a855f7, #f59e0b)',
                padding: '3px',
                boxShadow: '0 0 50px rgba(236, 72, 153, 0.3)',
                margin: '24px',
                width: '100%',
                maxWidth: '400px',
                height: '560px',
                zIndex: 20,
                position: 'relative',
              }}
            >
              <div 
                className="h-full rounded-[14px] flex flex-col p-5"
                style={{ 
                  background: sidekickTheme.panelBackground,
                  backdropFilter: `blur(${sidekickTheme.panelBackdropBlur})`,
                  WebkitBackdropFilter: `blur(${sidekickTheme.panelBackdropBlur})`,
                  boxShadow: sidekickTheme.panelShadow,
                }}
              >
                {/* Sidekick Header - dark background style */}
                <div 
                  className="flex items-center gap-3 mb-4 pb-3"
                  style={{ borderBottom: `1px solid ${sidekickTheme.panelBorderColor}` }}
                >
                  <div className="w-10 h-10 flex-shrink-0">
                    <img src={sidekickLogo} alt="Sidekick" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span style={{ color: sidekickTheme.headerPrimaryText }} className="font-bold text-lg">{sidekickTheme.headerPrimaryLabel || 'monday'}</span>
                    <span style={{ color: sidekickTheme.headerSecondaryText }} className="font-medium text-lg">{sidekickTheme.headerSecondaryLabel || 'sidekick'}</span>
                  </div>
                </div>

                {/* Content area */}
                <div className="flex-1 flex flex-col justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    {renderSidekickContent()}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Progress Indicator - Left Side Vertical */}
      {hasStarted && (
        <motion.div
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="group flex flex-col items-center gap-3 px-4 py-5 rounded-2xl bg-gradient-to-b from-white via-purple-50/50 to-blue-50/50 backdrop-blur-md shadow-lg border border-purple-100/50">
            {/* User Avatar at top */}
            <img 
              src={userAvatarIntro} 
              alt="User" 
              className="w-8 h-8 rounded-full object-cover shadow-md ring-2 ring-purple-200"
            />
            
            {/* Vertical Progress Dots */}
            <div className="flex flex-col items-center gap-3">
              {[1, 2, 3, 4, 5, 6].map((step) => {
                const currentStep = getCurrentStep(stage);
                const isActive = step === currentStep;
                const isCompleted = step < currentStep;
                
                return (
                  <div key={step} className="relative flex items-center">
                    <motion.div
                      className={`rounded-full ${
                        isActive 
                          ? 'w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-300' 
                          : isCompleted 
                            ? 'w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400' 
                            : 'w-3 h-3 border-2 border-gray-300 bg-white'
                      }`}
                      animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    {/* Label on hover only */}
                    {isActive && (
                      <span 
                        className="absolute left-7 text-xs font-medium text-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 px-2 py-1 rounded-lg shadow-sm"
                      >
                        {stageLabels[step]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Sidekick Star at bottom */}
            <img 
              src={sidekickLogo} 
              alt="Sidekick" 
              className="w-8 h-8 object-contain"
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
