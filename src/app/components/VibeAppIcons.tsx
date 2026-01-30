import { 
  Mail, Share2, Calendar, Award, BarChart3, Users,
  FolderKanban, Workflow, BarChart, Ticket, Bot, AlertCircle,
  Code2, ListChecks, Wrench, FileText, ShieldCheck, Search,
  Receipt, DollarSign, LineChart, UserPlus, UserCheck, UsersRound
} from 'lucide-react';

interface VibeAppIconProps {
  type: 'email' | 'social' | 'calendar' | 'leadscoring' | 'pipeline' | 'interaction' |
        'project' | 'workflow' | 'insights' | 'ticket' | 'supportbot' | 'proactive' |
        'codereview' | 'sprint' | 'devtools' | 'contract' | 'compliance' | 'legalsearch' |
        'invoice' | 'budget' | 'financial' | 'recruitment' | 'onboarding' | 'lifecycle';
  className?: string;
}

export function VibeAppIcon({ type, className = "w-10 h-10" }: VibeAppIconProps) {
  const configs: Record<typeof type, { Icon: any; bgGradient: string; iconColor: string }> = {
    email: {
      Icon: Mail,
      bgGradient: 'linear-gradient(135deg, #FC527D 0%, #FF84E4 100%)',
      iconColor: '#FFFFFF'
    },
    social: {
      Icon: Share2,
      bgGradient: 'linear-gradient(135deg, #FF6B9D 0%, #FFA7C4 100%)',
      iconColor: '#FFFFFF'
    },
    calendar: {
      Icon: Calendar,
      bgGradient: 'linear-gradient(135deg, #E64980 0%, #FA5C8C 100%)',
      iconColor: '#FFFFFF'
    },
    leadscoring: {
      Icon: Award,
      bgGradient: 'linear-gradient(135deg, #FC527D 0%, #FF84E4 100%)',
      iconColor: '#FFFFFF'
    },
    pipeline: {
      Icon: BarChart3,
      bgGradient: 'linear-gradient(135deg, #FF6B9D 0%, #FFA7C4 100%)',
      iconColor: '#FFFFFF'
    },
    interaction: {
      Icon: Users,
      bgGradient: 'linear-gradient(135deg, #E64980 0%, #FA5C8C 100%)',
      iconColor: '#FFFFFF'
    },
    project: {
      Icon: FolderKanban,
      bgGradient: 'linear-gradient(135deg, #FC527D 0%, #FF84E4 100%)',
      iconColor: '#FFFFFF'
    },
    workflow: {
      Icon: Workflow,
      bgGradient: 'linear-gradient(135deg, #FF6B9D 0%, #FFA7C4 100%)',
      iconColor: '#FFFFFF'
    },
    insights: {
      Icon: BarChart,
      bgGradient: 'linear-gradient(135deg, #E64980 0%, #FA5C8C 100%)',
      iconColor: '#FFFFFF'
    },
    ticket: {
      Icon: Ticket,
      bgGradient: 'linear-gradient(135deg, #FC527D 0%, #FF84E4 100%)',
      iconColor: '#FFFFFF'
    },
    supportbot: {
      Icon: Bot,
      bgGradient: 'linear-gradient(135deg, #FF6B9D 0%, #FFA7C4 100%)',
      iconColor: '#FFFFFF'
    },
    proactive: {
      Icon: AlertCircle,
      bgGradient: 'linear-gradient(135deg, #E64980 0%, #FA5C8C 100%)',
      iconColor: '#FFFFFF'
    },
    codereview: {
      Icon: Code2,
      bgGradient: 'linear-gradient(135deg, #FC527D 0%, #FF84E4 100%)',
      iconColor: '#FFFFFF'
    },
    sprint: {
      Icon: ListChecks,
      bgGradient: 'linear-gradient(135deg, #FF6B9D 0%, #FFA7C4 100%)',
      iconColor: '#FFFFFF'
    },
    devtools: {
      Icon: Wrench,
      bgGradient: 'linear-gradient(135deg, #E64980 0%, #FA5C8C 100%)',
      iconColor: '#FFFFFF'
    },
    contract: {
      Icon: FileText,
      bgGradient: 'linear-gradient(135deg, #FC527D 0%, #FF84E4 100%)',
      iconColor: '#FFFFFF'
    },
    compliance: {
      Icon: ShieldCheck,
      bgGradient: 'linear-gradient(135deg, #FF6B9D 0%, #FFA7C4 100%)',
      iconColor: '#FFFFFF'
    },
    legalsearch: {
      Icon: Search,
      bgGradient: 'linear-gradient(135deg, #E64980 0%, #FA5C8C 100%)',
      iconColor: '#FFFFFF'
    },
    invoice: {
      Icon: Receipt,
      bgGradient: 'linear-gradient(135deg, #FC527D 0%, #FF84E4 100%)',
      iconColor: '#FFFFFF'
    },
    budget: {
      Icon: DollarSign,
      bgGradient: 'linear-gradient(135deg, #FF6B9D 0%, #FFA7C4 100%)',
      iconColor: '#FFFFFF'
    },
    financial: {
      Icon: LineChart,
      bgGradient: 'linear-gradient(135deg, #E64980 0%, #FA5C8C 100%)',
      iconColor: '#FFFFFF'
    },
    recruitment: {
      Icon: UserPlus,
      bgGradient: 'linear-gradient(135deg, #FC527D 0%, #FF84E4 100%)',
      iconColor: '#FFFFFF'
    },
    onboarding: {
      Icon: UserCheck,
      bgGradient: 'linear-gradient(135deg, #FF6B9D 0%, #FFA7C4 100%)',
      iconColor: '#FFFFFF'
    },
    lifecycle: {
      Icon: UsersRound,
      bgGradient: 'linear-gradient(135deg, #E64980 0%, #FA5C8C 100%)',
      iconColor: '#FFFFFF'
    }
  };

  const config = configs[type];

  // Fallback to a default config if type is not found
  if (!config) {
    return (
      <div 
        className={`${className} rounded-xl flex items-center justify-center shadow-lg`}
        style={{ background: 'linear-gradient(135deg, #FC527D 0%, #FF84E4 100%)' }}
      >
        <FolderKanban 
          className="w-[60%] h-[60%]" 
          style={{ color: '#FFFFFF', strokeWidth: 2 }}
        />
      </div>
    );
  }

  return (
    <div 
      className={`${className} rounded-xl flex items-center justify-center shadow-lg`}
      style={{ background: config.bgGradient }}
    >
      <config.Icon 
        className="w-[60%] h-[60%]" 
        style={{ color: config.iconColor, strokeWidth: 2 }}
      />
    </div>
  );
}