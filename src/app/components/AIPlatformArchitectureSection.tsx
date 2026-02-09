import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Loader2,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Activity,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  Search,
  PenLine,
  Send,
  Eye,
  Hammer,
  FileText,
  Mail,
  Phone,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';
import { useDepartments, useDepartmentData } from '@/hooks/useSupabase';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ArchitectureLayoutVariant = 'app_frame_list' | 'app_frame_canvas' | 'app_frame_board';

interface AIPlatformArchitectureSectionProps {
  layoutVariant?: ArchitectureLayoutVariant;
}

interface MappedAgent {
  name: string;
  image: string;
  description: string;
  value: string;
}

interface MappedDepartment {
  id: string;
  title: string;
  avatarImage: string;
  avatarBgColor: string;
}

interface DepartmentScenario {
  instructions: string[];
  tasks: string[];
  outcomes: string[];
}

type AgentActionType = 'research' | 'write' | 'analyze' | 'send' | 'review' | 'build';

interface ActionMeta {
  type: AgentActionType;
  label: string;
  Icon: LucideIcon;
  OutputIcon: LucideIcon;
}

type AgentStatus = 'working' | 'completing';

interface AgentCycleState {
  status: AgentStatus;
  task: string;
  completions: number;
  cycleDuration: number;
}

interface SharedLayoutProps {
  agents: MappedAgent[];
  departments: MappedDepartment[];
  selectedDepartmentId: string | null;
  onSelectDepartment: (id: string) => void;
  selectedDepartment: MappedDepartment | undefined;
  isLoading: boolean;
  scenario: DepartmentScenario;
  agentStates: AgentCycleState[];
  totalCompletions: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const agentColors = [
  { bg: 'rgba(6,182,212,0.15)', border: 'rgba(6,182,212,0.5)', glow: 'rgba(6,182,212,0.25)', text: '#06b6d4' },
  { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.5)', glow: 'rgba(249,115,22,0.25)', text: '#f97316' },
  { bg: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.5)', glow: 'rgba(236,72,153,0.25)', text: '#ec4899' },
  { bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.5)', glow: 'rgba(139,92,246,0.25)', text: '#8b5cf6' },
  { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.5)', glow: 'rgba(16,185,129,0.25)', text: '#10b981' },
  { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.5)', glow: 'rgba(245,158,11,0.25)', text: '#f59e0b' },
  { bg: 'rgba(220,38,38,0.15)', border: 'rgba(220,38,38,0.5)', glow: 'rgba(220,38,38,0.25)', text: '#dc2626' },
  { bg: 'rgba(14,165,233,0.15)', border: 'rgba(14,165,233,0.5)', glow: 'rgba(14,165,233,0.25)', text: '#0ea5e9' },
  { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.5)', glow: 'rgba(168,85,247,0.25)', text: '#a855f7' },
  { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.5)', glow: 'rgba(34,197,94,0.25)', text: '#22c55e' },
];

const ORCHESTRATOR_MEMBERS = [
  { name: 'Sarah K.', role: 'Team Lead', color: '#6366f1' },
  { name: 'David M.', role: 'Product Manager', color: '#f59e0b' },
  { name: 'Lisa R.', role: 'Domain Expert', color: '#10b981' },
];

// ─── Department Scenarios ────────────────────────────────────────────────────

const departmentScenarios: Record<string, DepartmentScenario> = {
  marketing: {
    instructions: ['Launch Q3 campaign', 'Focus on Instagram this week', 'Increase ad budget by 20%', 'Prepare performance report'],
    tasks: ['Generating campaign briefs', 'Optimizing ad spend', 'Creating social posts', 'Analyzing audience segments', 'Designing email templates', 'Scheduling content calendar', 'A/B testing headlines', 'Building landing pages', 'Tracking conversions', 'Drafting press release'],
    outcomes: ['Campaign launched', '3x ROI achieved', '10K leads generated'],
  },
  sales: {
    instructions: ['Close enterprise deal', 'Follow up with Acme Corp', 'Update Q3 forecast', 'Prepare demo for Friday'],
    tasks: ['Qualifying new lead', 'Sending follow-up email', 'Updating deal pipeline', 'Preparing proposal deck', 'Scheduling demo call', 'Analyzing competitor pricing', 'Drafting contract terms', 'Building ROI model', 'Scoring lead intent', 'Logging call notes'],
    outcomes: ['Deal closed - $120K', 'Pipeline updated', '5 meetings booked'],
  },
  operations: {
    instructions: ['Optimize Q3 planning', 'Resolve delivery bottleneck', 'Reallocate team resources', 'Flag overdue milestones'],
    tasks: ['Analyzing bottlenecks', 'Generating capacity report', 'Optimizing resource allocation', 'Reviewing delivery metrics', 'Updating project timelines', 'Flagging at-risk items', 'Balancing workloads', 'Forecasting velocity', 'Mapping dependencies', 'Creating status report'],
    outcomes: ['30% faster delivery', 'Bottlenecks resolved', 'Q3 plan approved'],
  },
  support: {
    instructions: ['Handle ticket surge', 'Update KB for new feature', 'Improve response SLA', 'Escalate critical issues'],
    tasks: ['Responding to tickets', 'Routing escalations', 'Drafting KB article', 'Analyzing sentiment', 'Updating SLA dashboard', 'Categorizing tickets', 'Training new macros', 'Reviewing CSAT data', 'Merging duplicate tickets', 'Generating shift report'],
    outcomes: ['95% CSAT score', 'Avg. response < 2min', '200 tickets resolved'],
  },
  product: {
    instructions: ['Ship v2.0 feature', 'Prioritize bug fixes', 'Review new API design', 'Plan next sprint'],
    tasks: ['Reviewing pull request', 'Planning sprint backlog', 'Writing test cases', 'Updating documentation', 'Running regression suite', 'Triaging bug reports', 'Analyzing user feedback', 'Designing API schema', 'Building prototype', 'Monitoring rollout'],
    outcomes: ['Feature shipped', 'Zero P0 bugs', 'Sprint completed'],
  },
  hr: {
    instructions: ['Q3 hiring sprint', 'Onboard new designers', 'Schedule panel interviews', 'Finalize offer packages'],
    tasks: ['Screening candidates', 'Preparing onboarding', 'Scheduling interviews', 'Drafting offer letters', 'Updating job postings', 'Analyzing hiring funnel', 'Coordinating panels', 'Running background checks', 'Planning orientation', 'Sending welcome packs'],
    outcomes: ['12 hires onboarded', 'Time-to-hire -40%', 'Offer acceptance 95%'],
  },
  finance: {
    instructions: ['Month-end close', 'Audit Q2 expenses', 'Update revenue forecast', 'Process vendor payments'],
    tasks: ['Reconciling invoices', 'Validating entries', 'Processing payroll', 'Generating P&L report', 'Auditing expense claims', 'Updating forecasts', 'Reviewing accruals', 'Balancing ledgers', 'Filing tax forms', 'Preparing board deck'],
    outcomes: ['Books closed', 'Report delivered', 'Variance < 1%'],
  },
  legal: {
    instructions: ['Contract review batch', 'Check vendor compliance', 'Redline partnership terms', 'Prepare NDA updates'],
    tasks: ['Analyzing clauses', 'Checking compliance', 'Redlining terms', 'Summarizing amendments', 'Flagging risk items', 'Generating approval memo', 'Reviewing NDA terms', 'Cross-referencing policy', 'Drafting addendum', 'Archiving signed docs'],
    outcomes: ['15 contracts approved', 'Risk mitigated', 'Turnaround -50%'],
  },
};

const defaultScenario: DepartmentScenario = {
  instructions: ['Start new project', 'Assign team resources', 'Set up tracking', 'Define milestones'],
  tasks: ['Analyzing requirements', 'Creating project plan', 'Setting up workspace', 'Assigning resources', 'Defining milestones', 'Drafting kickoff agenda', 'Mapping stakeholders', 'Building timeline', 'Setting up channels', 'Creating templates'],
  outcomes: ['Project launched', 'Team aligned', 'First milestone set'],
};

// ─── Command Center Board Data ───────────────────────────────────────────────

interface BoardItem {
  name: string;
  status: string;
  statusColor: string;
  owner: string;
  metric: string;
  progress: number;
}

interface DepartmentBoard {
  boardName: string;
  columns: [string, string, string, string, string];
  items: BoardItem[];
}

const DEPARTMENT_BOARDS: Record<string, DepartmentBoard> = {
  sales: {
    boardName: 'CRM Board',
    columns: ['Lead', 'Status', 'Owner', 'Deal Value', 'Stage'],
    items: [
      { name: 'Acme Corp - Enterprise', status: 'Negotiation', statusColor: '#f59e0b', owner: 'Sarah K.', metric: '$120K', progress: 75 },
      { name: 'TechFlow - Mid-Market', status: 'Discovery', statusColor: '#6366f1', owner: 'David M.', metric: '$45K', progress: 30 },
      { name: 'Globex - Startup', status: 'Proposal Sent', statusColor: '#8b5cf6', owner: 'Lisa R.', metric: '$28K', progress: 55 },
      { name: 'Initech - Enterprise', status: 'Demo Scheduled', statusColor: '#06b6d4', owner: 'Sarah K.', metric: '$95K', progress: 40 },
      { name: 'CloudNet - SMB', status: 'Closed Won', statusColor: '#10b981', owner: 'David M.', metric: '$32K', progress: 100 },
      { name: 'Vertex Labs - Enterprise', status: 'Qualification', statusColor: '#f97316', owner: 'Lisa R.', metric: '$68K', progress: 15 },
    ],
  },
  marketing: {
    boardName: 'Campaign Board',
    columns: ['Campaign', 'Status', 'Owner', 'Budget', 'Reach'],
    items: [
      { name: 'Summer Launch Q3', status: 'Live', statusColor: '#10b981', owner: 'Sarah K.', metric: '$25K', progress: 82 },
      { name: 'Instagram Reels Sprint', status: 'Draft', statusColor: '#f59e0b', owner: 'Lisa R.', metric: '$8K', progress: 20 },
      { name: 'Email Nurture Series', status: 'Scheduled', statusColor: '#6366f1', owner: 'David M.', metric: '$3K', progress: 60 },
      { name: 'TechCrunch PR Push', status: 'In Review', statusColor: '#8b5cf6', owner: 'Sarah K.', metric: '$15K', progress: 45 },
      { name: 'LinkedIn Thought Leadership', status: 'Live', statusColor: '#10b981', owner: 'Lisa R.', metric: '$5K', progress: 90 },
    ],
  },
  operations: {
    boardName: 'Project Board',
    columns: ['Project', 'Status', 'Owner', 'Priority', 'Timeline'],
    items: [
      { name: 'Platform Migration v2', status: 'In Progress', statusColor: '#06b6d4', owner: 'David M.', metric: 'High', progress: 65 },
      { name: 'DevOps Pipeline', status: 'At Risk', statusColor: '#ef4444', owner: 'Sarah K.', metric: 'Critical', progress: 35 },
      { name: 'Q3 Resource Plan', status: 'Done', statusColor: '#10b981', owner: 'Lisa R.', metric: 'Medium', progress: 100 },
      { name: 'Vendor Onboarding', status: 'Planning', statusColor: '#f59e0b', owner: 'David M.', metric: 'Medium', progress: 10 },
      { name: 'SLA Dashboard', status: 'In Progress', statusColor: '#06b6d4', owner: 'Sarah K.', metric: 'High', progress: 50 },
    ],
  },
  support: {
    boardName: 'Ticket Board',
    columns: ['Ticket', 'Priority', 'Assignee', 'Category', 'SLA'],
    items: [
      { name: '#3840 System downtime', status: 'P1', statusColor: '#ef4444', owner: 'Emma S.', metric: 'Infrastructure', progress: 40 },
      { name: '#2291 API key reset', status: 'P2', statusColor: '#f59e0b', owner: 'David M.', metric: 'Authentication', progress: 80 },
      { name: '#4102 Billing discrepancy', status: 'P2', statusColor: '#f59e0b', owner: 'Lisa R.', metric: 'Billing', progress: 55 },
      { name: '#3955 SSO config issue', status: 'P3', statusColor: '#6366f1', owner: 'Sarah K.', metric: 'Integration', progress: 25 },
      { name: '#4200 Slow dashboard load', status: 'P2', statusColor: '#f59e0b', owner: 'Emma S.', metric: 'Performance', progress: 60 },
      { name: '#4180 Export failing', status: 'P3', statusColor: '#6366f1', owner: 'David M.', metric: 'Feature', progress: 90 },
    ],
  },
  product: {
    boardName: 'Sprint Board',
    columns: ['Item', 'Status', 'Assignee', 'Points', 'Type'],
    items: [
      { name: 'FEAT-1204 User Roles', status: 'In Dev', statusColor: '#06b6d4', owner: 'Tom R.', metric: '8 pts', progress: 55 },
      { name: 'BUG-892 Auth timeout', status: 'In Review', statusColor: '#8b5cf6', owner: 'Sarah K.', metric: '3 pts', progress: 85 },
      { name: 'FEAT-1210 API v2.1', status: 'In Dev', statusColor: '#06b6d4', owner: 'David M.', metric: '13 pts', progress: 30 },
      { name: 'BUG-901 Memory leak', status: 'Done', statusColor: '#10b981', owner: 'Tom R.', metric: '5 pts', progress: 100 },
      { name: 'FEAT-1215 Webhooks', status: 'To Do', statusColor: '#f59e0b', owner: 'Lisa R.', metric: '8 pts', progress: 0 },
    ],
  },
  hr: {
    boardName: 'Hiring Board',
    columns: ['Candidate', 'Stage', 'Recruiter', 'Role', 'Fit Score'],
    items: [
      { name: 'Rachel T.', status: 'Interview', statusColor: '#6366f1', owner: 'Sarah K.', metric: 'Sr. Designer', progress: 60 },
      { name: 'James K.', status: 'Screening', statusColor: '#f59e0b', owner: 'David M.', metric: 'Frontend Dev', progress: 25 },
      { name: 'Priya M.', status: 'Offer', statusColor: '#10b981', owner: 'Lisa R.', metric: 'Data Analyst', progress: 90 },
      { name: 'Alex C.', status: 'Interview', statusColor: '#6366f1', owner: 'Sarah K.', metric: 'DevOps Eng.', progress: 50 },
      { name: 'Sam W.', status: 'Rejected', statusColor: '#ef4444', owner: 'David M.', metric: 'PM', progress: 100 },
    ],
  },
  finance: {
    boardName: 'Finance Board',
    columns: ['Item', 'Status', 'Owner', 'Amount', 'Due Date'],
    items: [
      { name: 'INV-445 Vendor payment', status: 'Pending', statusColor: '#f59e0b', owner: 'Lisa R.', metric: '$24.5K', progress: 30 },
      { name: 'Feb Payroll Cycle', status: 'Processing', statusColor: '#06b6d4', owner: 'Sarah K.', metric: '$485K', progress: 65 },
      { name: 'Q2 Expense Audit', status: 'In Review', statusColor: '#8b5cf6', owner: 'David M.', metric: '$120K', progress: 45 },
      { name: 'Tax Filing Q4', status: 'Approved', statusColor: '#10b981', owner: 'Lisa R.', metric: '$38K', progress: 100 },
      { name: 'Revenue Forecast v3', status: 'Draft', statusColor: '#f59e0b', owner: 'Sarah K.', metric: '$2.1M', progress: 20 },
    ],
  },
  legal: {
    boardName: 'Contract Board',
    columns: ['Contract', 'Status', 'Reviewer', 'Risk', 'Due Date'],
    items: [
      { name: 'Vendor X MSA', status: 'In Review', statusColor: '#8b5cf6', owner: 'Sarah K.', metric: 'Medium', progress: 50 },
      { name: 'Partnership NDA', status: 'Redlined', statusColor: '#f59e0b', owner: 'David M.', metric: 'Low', progress: 70 },
      { name: 'CloudNet SLA', status: 'Approved', statusColor: '#10b981', owner: 'Lisa R.', metric: 'Low', progress: 100 },
      { name: 'Data Processing Agmt.', status: 'In Review', statusColor: '#8b5cf6', owner: 'Sarah K.', metric: 'High', progress: 35 },
      { name: 'Licensing Terms v2', status: 'Pending', statusColor: '#f59e0b', owner: 'David M.', metric: 'Medium', progress: 15 },
    ],
  },
};

// ─── Task Action Type Map ────────────────────────────────────────────────────

const ACTION_META: Record<AgentActionType, ActionMeta> = {
  research: { type: 'research', label: 'Researching', Icon: Search, OutputIcon: FileText },
  write: { type: 'write', label: 'Writing', Icon: PenLine, OutputIcon: FileText },
  analyze: { type: 'analyze', label: 'Analyzing', Icon: BarChart3, OutputIcon: BarChart3 },
  send: { type: 'send', label: 'Sending', Icon: Send, OutputIcon: Mail },
  review: { type: 'review', label: 'Reviewing', Icon: Eye, OutputIcon: CheckCircle2 },
  build: { type: 'build', label: 'Building', Icon: Hammer, OutputIcon: FileText },
};

const TASK_ACTION_MAP: Record<string, AgentActionType> = {
  'Generating campaign briefs': 'write', 'Optimizing ad spend': 'analyze', 'Creating social posts': 'write',
  'Analyzing audience segments': 'research', 'Designing email templates': 'build', 'Scheduling content calendar': 'build',
  'A/B testing headlines': 'analyze', 'Building landing pages': 'build', 'Tracking conversions': 'analyze',
  'Drafting press release': 'write', 'Qualifying new lead': 'research', 'Sending follow-up email': 'send',
  'Updating deal pipeline': 'build', 'Preparing proposal deck': 'write', 'Scheduling demo call': 'send',
  'Analyzing competitor pricing': 'analyze', 'Drafting contract terms': 'write', 'Building ROI model': 'build',
  'Scoring lead intent': 'analyze', 'Logging call notes': 'write', 'Analyzing bottlenecks': 'research',
  'Generating capacity report': 'write', 'Optimizing resource allocation': 'analyze', 'Reviewing delivery metrics': 'review',
  'Updating project timelines': 'build', 'Flagging at-risk items': 'review', 'Balancing workloads': 'analyze',
  'Forecasting velocity': 'analyze', 'Mapping dependencies': 'research', 'Creating status report': 'write',
  'Responding to tickets': 'send', 'Routing escalations': 'send', 'Drafting KB article': 'write',
  'Analyzing sentiment': 'research', 'Updating SLA dashboard': 'build', 'Categorizing tickets': 'analyze',
  'Training new macros': 'build', 'Reviewing CSAT data': 'review', 'Merging duplicate tickets': 'build',
  'Generating shift report': 'write', 'Reviewing pull request': 'review', 'Planning sprint backlog': 'build',
  'Writing test cases': 'write', 'Updating documentation': 'write', 'Running regression suite': 'analyze',
  'Triaging bug reports': 'review', 'Analyzing user feedback': 'research', 'Designing API schema': 'build',
  'Building prototype': 'build', 'Monitoring rollout': 'review', 'Screening candidates': 'research',
  'Preparing onboarding': 'build', 'Scheduling interviews': 'send', 'Drafting offer letters': 'write',
  'Updating job postings': 'write', 'Analyzing hiring funnel': 'analyze', 'Coordinating panels': 'send',
  'Running background checks': 'review', 'Planning orientation': 'build', 'Sending welcome packs': 'send',
  'Reconciling invoices': 'review', 'Validating entries': 'review', 'Processing payroll': 'build',
  'Generating P&L report': 'write', 'Auditing expense claims': 'review', 'Updating forecasts': 'analyze',
  'Reviewing accruals': 'review', 'Balancing ledgers': 'analyze', 'Filing tax forms': 'send',
  'Preparing board deck': 'write', 'Analyzing clauses': 'research', 'Checking compliance': 'review',
  'Redlining terms': 'write', 'Summarizing amendments': 'write', 'Flagging risk items': 'review',
  'Generating approval memo': 'write', 'Reviewing NDA terms': 'review', 'Cross-referencing policy': 'research',
  'Drafting addendum': 'write', 'Archiving signed docs': 'build',
};

function getTaskAction(task: string): ActionMeta {
  const type = TASK_ACTION_MAP[task] || 'build';
  return ACTION_META[type];
}

function getScenario(deptTitle: string | undefined): DepartmentScenario {
  if (!deptTitle) return defaultScenario;
  const key = deptTitle.toLowerCase().replace(/[^a-z]/g, '');
  for (const [k, v] of Object.entries(departmentScenarios)) {
    if (key.includes(k)) return v;
  }
  return defaultScenario;
}

// ─── Parallel Agent Cycles (cap 10) ──────────────────────────────────────────

const CYCLE_DURATIONS = [7000, 9500, 6200, 10500, 8200, 8800, 7400, 10000, 6800, 9200];
const COMPLETING_FLASH_MS = 1500;

function useParallelAgentCycles(agentCount: number, scenario: DepartmentScenario, resetKey: string | null): AgentCycleState[] {
  const tasksRef = useRef(scenario.tasks);
  tasksRef.current = scenario.tasks;
  const [states, setStates] = useState<AgentCycleState[]>([]);

  useEffect(() => {
    const count = Math.min(agentCount, 10);
    if (count === 0) { setStates([]); return; }

    const initial: AgentCycleState[] = Array.from({ length: count }, (_, i) => ({
      status: 'working' as const,
      task: tasksRef.current[i % tasksRef.current.length],
      completions: 0,
      cycleDuration: CYCLE_DURATIONS[i % CYCLE_DURATIONS.length],
    }));
    setStates(initial);

    const cleanups: Array<() => void> = [];
    const taskCounters = Array.from({ length: count }, (_, i) => i);

    for (let i = 0; i < count; i++) {
      const duration = CYCLE_DURATIONS[i % CYCLE_DURATIONS.length];
      const startDelay = 1200 + i * 800;
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          setStates(prev => {
            const next = [...prev];
            if (next[i]) next[i] = { ...next[i], status: 'completing', completions: next[i].completions + 1 };
            return next;
          });
          setTimeout(() => {
            taskCounters[i] = (taskCounters[i] + 1) % tasksRef.current.length;
            setStates(prev => {
              const next = [...prev];
              if (next[i]) next[i] = { ...next[i], status: 'working', task: tasksRef.current[taskCounters[i]] };
              return next;
            });
          }, COMPLETING_FLASH_MS);
        }, duration);
        cleanups.push(() => clearInterval(interval));
      }, startDelay);
      cleanups.push(() => clearTimeout(timeout));
    }
    return () => cleanups.forEach(fn => fn());
  }, [agentCount, resetKey]);

  return states;
}

// ─── Stars Background ────────────────────────────────────────────────────────

function StarsBackground({ count = 40 }: { count?: number }) {
  const stars = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      id: i, size: Math.random() * 2 + 1, left: Math.random() * 100,
      top: Math.random() * 100, duration: 2 + Math.random() * 2, delay: Math.random() * 2,
    })), [count]
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map(s => (
        <motion.div key={s.id} className="absolute rounded-full bg-white"
          style={{ width: s.size, height: s.size, left: `${s.left}%`, top: `${s.top}%` }}
          animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.3, 1] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }} />
      ))}
    </div>
  );
}

// ─── Department Selector ─────────────────────────────────────────────────────

function DepartmentSelector({ departments, selectedId, onSelect }: {
  departments: MappedDepartment[]; selectedId: string | null; onSelect: (id: string) => void;
}) {
  return (
    <div className="flex justify-center gap-6 p-4 rounded-2xl mx-auto"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
      {departments.map((dept, i) => {
        const sel = selectedId === dept.id;
        return (
          <motion.button key={dept.id} initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: sel ? 1.1 : 1 }}
            transition={{ delay: 0.1 + i * 0.05, scale: { type: 'spring', stiffness: 300, damping: 20 } }}
            whileHover={{ scale: sel ? 1.12 : 1.05 }} whileTap={{ scale: 1.0 }}
            onClick={() => onSelect(dept.id)}
            className="flex flex-col items-center gap-2 transition-all duration-300"
            style={{ opacity: sel ? 1 : 0.55 }}>
            <div className="relative rounded-full flex items-center justify-center"
              style={{ width: sel ? 60 : 56, height: sel ? 60 : 56, backgroundColor: dept.avatarBgColor,
                border: sel ? '3px solid rgba(97,97,255,0.9)' : '2px solid rgba(255,255,255,0.15)',
                boxShadow: sel ? `0 0 25px ${dept.avatarBgColor}, 0 0 50px rgba(97,97,255,0.4)` : 'none',
                transition: 'width 0.3s, height 0.3s' }}>
              {dept.avatarImage ? <img src={dept.avatarImage} alt={dept.title} className="w-full h-full rounded-full object-cover" /> :
                <span className="text-white text-base font-bold">{dept.title.charAt(0).toUpperCase()}</span>}
            </div>
            <span className="font-semibold whitespace-nowrap"
              style={{ color: sel ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: sel ? 14 : 13, transition: 'font-size 0.3s, color 0.3s' }}>
              {dept.title.toLowerCase()}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Section Shell ───────────────────────────────────────────────────────────

function SectionShell({ children, departments, selectedId, onSelect }: {
  children: React.ReactNode; departments: MappedDepartment[]; selectedId: string | null; onSelect: (id: string) => void;
}) {
  return (
    <section className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center py-16 px-6"
      style={{ background: 'linear-gradient(145deg, #0f0f23 0%, #1a1a3e 50%, #0a0a1a 100%)' }}>
      <StarsBackground count={80} />
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '80px 80px' }} />
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <p className="text-purple-400 font-medium text-sm tracking-widest uppercase mb-3">AI Work Platform</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            <span className="text-white/80">Your team orchestrates, </span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">agents deliver</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Agents work in parallel, powered by Work Context, to drive real business outcomes</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mb-4">
          <DepartmentSelector departments={departments} selectedId={selectedId} onSelect={onSelect} />
        </motion.div>
        {children}
      </div>
    </section>
  );
}

// ─── Typing Dots (shows agent is actively working) ──────────────────────────

function TypingDots({ color }: { color: string }) {
  return (
    <span className="inline-flex items-center gap-[3px] ml-1">
      {[0, 1, 2].map(i => (
        <motion.span key={i} className="w-[3px] h-[3px] rounded-full inline-block"
          style={{ background: color }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </span>
  );
}

// ─── Agent activity detail lines (simulates output preview) ─────────────────

const AGENT_ACTIVITY_DETAILS: Record<string, string[]> = {
  'Generating campaign briefs': ['Drafting brief for "Summer Launch" campaign…', 'Pulling Q3 benchmarks from Google Ads…'],
  'Optimizing ad spend': ['Shifting $5K budget from Facebook to Instagram…', 'CPC dropped 12% on Segment A…'],
  'Creating social posts': ['Writing Instagram carousel for @brand…', 'Designing LinkedIn post: "AI in 2026"…'],
  'Analyzing audience segments': ['Segment "Enterprise CTOs" — 3.2K users…', 'Engagement score: 78 for Cohort B…'],
  'Designing email templates': ['Building template for "Welcome Series"…', 'Personalizing for 12K subscribers…'],
  'Scheduling content calendar': ['Scheduling post for Tue 9AM (peak)…', 'Syncing 8 posts with campaign timeline…'],
  'A/B testing headlines': ['Variant B: "Save 40%" — CTR up 23%…', 'Winner selected with 95% confidence…'],
  'Building landing pages': ['Generating hero copy for /promo-q3…', 'Optimizing signup form — 3 fields…'],
  'Tracking conversions': ['UTM tagged: summer_launch_ig_cta…', '340 conversions attributed from email…'],
  'Drafting press release': ['Writing CEO quote for TechCrunch piece…', 'Formatting for AP style distribution…'],
  'Qualifying new lead': ['Reviewing lead profile: Mike T. from TechFlow…', 'Checking ICP fit — matches Enterprise segment…'],
  'Sending follow-up email': ['Composing email to Sarah@AcmeCorp…', 'Adding proposal attachment for review…'],
  'Updating deal pipeline': ['Moving Acme Corp to Stage 3: Negotiation…', 'Updating forecast — 75% probability…'],
  'Preparing proposal deck': ['Pulling Globex financials for ROI slide…', 'Customizing pricing for 500-seat plan…'],
  'Scheduling demo call': ['Calling lead: Dan R. at Initech…', 'Booking 30min slot with VP of Sales…'],
  'Analyzing competitor pricing': ['Comparing vs. Competitor X Pro plan…', 'Building side-by-side feature matrix…'],
  'Drafting contract terms': ['Reviewing SLA for CloudNet deal…', 'Customizing data-residency clause…'],
  'Building ROI model': ['Modeling 3-year savings for OmniTech…', 'Projecting $240K annual cost reduction…'],
  'Scoring lead intent': ['Lead #4521 visited pricing page 3x…', 'Intent score: 87 — flagging as hot lead…'],
  'Logging call notes': ['Transcribing call with Lisa@Vertex…', 'Extracting 4 action items from meeting…'],
  'Analyzing bottlenecks': ['Sprint 14 blocked — DevOps pipeline…', 'Team Alpha at 120% capacity…'],
  'Generating capacity report': ['R&D: 87% utilized, 3 open slots…', 'Projecting Q4 headcount needs…'],
  'Optimizing resource allocation': ['Moving Jake R. to Project Mercury…', 'Rebalancing QA across 3 squads…'],
  'Reviewing delivery metrics': ['Sprint velocity dropped 15% vs avg…', 'SLA breach on Ticket #8842…'],
  'Updating project timelines': ['Pushing Milestone 3 to Oct 15…', 'Critical path: API → QA → Deploy…'],
  'Flagging at-risk items': ['Task "DB Migration" overdue by 3 days…', 'Escalating to PM: blocked by vendor…'],
  'Responding to tickets': ['Replying to Ticket #2291 from Alex M.…', 'Attaching KB article: "Reset API key"…'],
  'Routing escalations': ['Ticket #3840 → P1 — assigning to Tier 2…', 'Notifying on-call: Emma S.…'],
  'Drafting KB article': ['Writing "How to configure SSO"…', 'Adding step-by-step screenshots…'],
  'Analyzing sentiment': ['Customer @jdoe — frustration detected…', 'CSAT dip on "Billing" category…'],
  'Reviewing pull request': ['PR #482 by @tom — 14 files changed…', 'Suggesting fix in auth-middleware.ts…'],
  'Planning sprint backlog': ['Prioritizing FEAT-1204: User Roles…', 'Estimating: 8 story points…'],
  'Writing test cases': ['Generating edge cases for /api/users…', 'Coverage: 94% → targeting 97%…'],
  'Updating documentation': ['Syncing docs for v2.1 API changes…', 'Adding code samples to /docs/auth…'],
  'Screening candidates': ['Reviewing CV: Rachel T. — Sr. Designer…', 'Skills match: 92% for role #DP-04…'],
  'Preparing onboarding': ['Creating Day 1 plan for 3 new hires…', 'Setting up Slack, Jira, GitHub access…'],
  'Scheduling interviews': ['Booking panel: Tues 2PM with hiring mgr…', 'Sending invite to candidate@email.com…'],
  'Reconciling invoices': ['Matching PO #7291 to vendor receipt…', 'Flagging $2.4K discrepancy on INV-445…'],
  'Validating entries': ['Cross-checking 142 journal entries…', 'Balance check: AR ledger ✓…'],
  'Processing payroll': ['Running payroll for 320 employees…', 'Generating pay stubs for Feb cycle…'],
  'Analyzing clauses': ['Reviewing §4.2 liability cap in Vendor X…', 'Comparing to standard MSA template…'],
  'Checking compliance': ['GDPR audit on data-processing terms…', 'Cross-referencing SOC 2 policy…'],
  'Redlining terms': ['Marking 3 changes in §7 payment terms…', 'Adding note: "Negotiate 60→45 days"…'],
};

function getActivityDetail(task: string, tick: number): string {
  const details = AGENT_ACTIVITY_DETAILS[task];
  if (!details || details.length === 0) return `Processing ${task.toLowerCase()}…`;
  return details[tick % details.length];
}

// ─── Live Call Tasks & Transcripts ───────────────────────────────────────────

const CALL_TASKS = new Set([
  'Scheduling demo call',
  'Logging call notes',
  'Qualifying new lead',
  'Responding to tickets',
  'Routing escalations',
  'Scheduling interviews',
]);

const CALL_TRANSCRIPTS: Record<string, Array<{ speaker: string; text: string; contact: string }>> = {
  'Scheduling demo call': [
    { speaker: 'Agent', text: 'Hi Dan, let me walk you through the platform…', contact: 'Dan R. at Initech' },
    { speaker: 'Dan R.', text: 'Sure, I\'m curious about the enterprise plan', contact: 'Dan R. at Initech' },
    { speaker: 'Agent', text: 'Great — let me share my screen…', contact: 'Dan R. at Initech' },
    { speaker: 'Dan R.', text: 'Can you show me the integrations?', contact: 'Dan R. at Initech' },
    { speaker: 'Agent', text: 'Absolutely, here\'s the connector library…', contact: 'Dan R. at Initech' },
  ],
  'Logging call notes': [
    { speaker: 'Agent', text: 'Thanks for the update Lisa, noted on the timeline', contact: 'Lisa@Vertex' },
    { speaker: 'Lisa', text: 'We need the proposal by Friday', contact: 'Lisa@Vertex' },
    { speaker: 'Agent', text: 'Understood, I\'ll have it ready Thursday', contact: 'Lisa@Vertex' },
    { speaker: 'Lisa', text: 'Also loop in our CTO for the next call', contact: 'Lisa@Vertex' },
  ],
  'Qualifying new lead': [
    { speaker: 'Agent', text: 'Hi Mike, thanks for reaching out…', contact: 'Mike T. at TechFlow' },
    { speaker: 'Mike T.', text: 'We have a team of 200, looking for automation', contact: 'Mike T. at TechFlow' },
    { speaker: 'Agent', text: 'That\'s a great fit — let me explain our plans…', contact: 'Mike T. at TechFlow' },
    { speaker: 'Mike T.', text: 'What about data security?', contact: 'Mike T. at TechFlow' },
    { speaker: 'Agent', text: 'We\'re SOC 2 and GDPR compliant…', contact: 'Mike T. at TechFlow' },
  ],
  'Responding to tickets': [
    { speaker: 'Agent', text: 'Hi Alex, I see the issue with your API key…', contact: 'Alex M.' },
    { speaker: 'Alex M.', text: 'Yes, it stopped working after the update', contact: 'Alex M.' },
    { speaker: 'Agent', text: 'I\'ve regenerated your key, try now…', contact: 'Alex M.' },
    { speaker: 'Alex M.', text: 'Works now, thank you!', contact: 'Alex M.' },
  ],
  'Routing escalations': [
    { speaker: 'Agent', text: 'Connecting you with our Tier 2 team…', contact: 'Customer #3840' },
    { speaker: 'Customer', text: 'This is urgent, our system is down', contact: 'Customer #3840' },
    { speaker: 'Agent', text: 'I\'ve flagged this as P1, Emma is joining now…', contact: 'Customer #3840' },
  ],
  'Scheduling interviews': [
    { speaker: 'Agent', text: 'Hi Rachel, confirming Tuesday at 2PM…', contact: 'Rachel T.' },
    { speaker: 'Rachel T.', text: 'Sounds good, who will be on the panel?', contact: 'Rachel T.' },
    { speaker: 'Agent', text: 'The hiring manager and design lead…', contact: 'Rachel T.' },
    { speaker: 'Rachel T.', text: 'Perfect, I\'ll prepare my portfolio', contact: 'Rachel T.' },
  ],
};

// ─── useInstructionStream (cycles through instructions) ──────────────────────

function useInstructionStream(instructions: string[], intervalMs = 5000): Array<{ id: number; text: string; time: string }> {
  const [items, setItems] = useState<Array<{ id: number; text: string; time: string }>>([]);
  const idRef = useRef(0);
  const indexRef = useRef(0);

  useEffect(() => {
    // Reset on change
    idRef.current = 0;
    indexRef.current = 0;
    // Immediately show first instruction
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setItems([{ id: idRef.current++, text: instructions[0], time }]);
    indexRef.current = 1;

    const interval = setInterval(() => {
      const t = new Date();
      const ts = `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`;
      const nextText = instructions[indexRef.current % instructions.length];
      indexRef.current++;
      setItems(prev => [{ id: idRef.current++, text: nextText, time: ts }, ...prev].slice(0, 4));
    }, intervalMs);
    return () => clearInterval(interval);
  }, [instructions, intervalMs]);

  return items;
}

// ─── ChatFeed (scrolling instruction bubbles from orchestrators) ─────────────

function ChatFeed({ items, deptColor }: {
  items: Array<{ id: number; text: string; time: string }>;
  deptColor: string;
}) {
  return (
    <div className="flex flex-col gap-2 overflow-hidden" style={{ maxHeight: 200 }}>
      <AnimatePresence initial={false}>
        {items.map((item, idx) => (
          <motion.div key={item.id}
            layout
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: idx === 0 ? 1 : 0.6, x: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="relative px-3 py-2 rounded-xl rounded-tl-sm"
            style={{
              background: idx === 0 ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.05)',
              border: `1px solid ${idx === 0 ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.1)'}`,
            }}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ background: ORCHESTRATOR_MEMBERS[item.id % ORCHESTRATOR_MEMBERS.length].color, border: '1px solid rgba(139,92,246,0.4)' }}>
                <span className="text-white text-[7px] font-bold">
                  {ORCHESTRATOR_MEMBERS[item.id % ORCHESTRATOR_MEMBERS.length].name.charAt(0)}
                </span>
              </div>
              <span className="text-white/40 text-[8px] font-semibold">
                {ORCHESTRATOR_MEMBERS[item.id % ORCHESTRATOR_MEMBERS.length].name}
              </span>
              <span className="text-white/15 text-[7px] ml-auto flex-shrink-0">{item.time}</span>
            </div>
            <p className="text-white/85 text-[11px] font-medium leading-relaxed pl-[22px]">
              &quot;{item.text}&quot;
            </p>
            {/* Pulse on newest */}
            {idx === 0 && (
              <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
                initial={{ opacity: 0.3 }} animate={{ opacity: 0 }}
                transition={{ duration: 1 }}
                style={{ background: 'rgba(99,102,241,0.15)' }} />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Instruction Pulse (ripple from sidebar to canvas) ───────────────────────

function InstructionPulse({ trigger }: { trigger: number }) {
  return (
    <AnimatePresence>
      {trigger > 0 && (
        <motion.div key={trigger}
          className="absolute top-1/2 left-0 w-full h-[2px] pointer-events-none z-20"
          initial={{ scaleX: 0, opacity: 0.7, transformOrigin: 'left' }}
          animate={{ scaleX: 1, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.4), transparent)' }} />
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP FRAME LAYOUT
// 3-column: Orchestrators | Agent Board | Business Impact + Logs
// Agent rows are rich — showing active work detail, not just a label.
// ═══════════════════════════════════════════════════════════════════════════════

function AppFrameLayout(props: SharedLayoutProps) {
  const { agents, departments, selectedDepartmentId, onSelectDepartment, selectedDepartment, isLoading, scenario, agentStates, totalCompletions } = props;

  const count = agentStates.length;
  const workingCount = agentStates.filter(s => s.status === 'working').length;

  const visibleOutcomes = useMemo(() => {
    const idx = Math.min(Math.floor(totalCompletions / 3), scenario.outcomes.length - 1);
    return totalCompletions > 0 ? scenario.outcomes.slice(0, idx + 1) : [];
  }, [totalCompletions, scenario.outcomes]);

  // Activity feed (logs)
  const [feed, setFeed] = useState<Array<{ id: number; agent: string; task: string; time: string }>>([]);
  const feedIdRef = useRef(0);
  const prevRef = useRef<number[]>([]);
  useEffect(() => {
    if (agentStates.length === 0) { setFeed([]); prevRef.current = []; return; }
    agentStates.forEach((s, i) => {
      if (prevRef.current[i] !== undefined && s.completions > prevRef.current[i]) {
        const a = agents[i % agents.length];
        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        setFeed(f => [{ id: feedIdRef.current++, agent: a.name, task: s.task, time }, ...f].slice(0, 8));
      }
    });
    prevRef.current = agentStates.map(s => s.completions);
  }, [agentStates, agents]);
  useEffect(() => { setFeed([]); }, [selectedDepartmentId]);

  // Tick counter for cycling detail text
  const [detailTick, setDetailTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDetailTick(p => p + 1), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <SectionShell departments={departments} selectedId={selectedDepartmentId} onSelect={onSelectDepartment}>
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-purple-400 animate-spin" /></div>
      ) : agents.length === 0 ? (
        <div className="text-center py-20 text-white/40">No agents found for this department</div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={selectedDepartmentId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)',
              boxShadow: '0 0 60px rgba(99,102,241,0.04), 0 8px 32px rgba(0,0,0,0.3)' }}>

            {/* ── Title Bar ── */}
            <div className="flex items-center justify-between px-5 py-2.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(239,68,68,0.7)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(234,179,8,0.7)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(34,197,94,0.7)' }} />
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-white/70 text-xs font-semibold tracking-wide">AI Work Platform</span>
                  <span className="text-white/20 text-xs">/</span>
                  <span className="text-white/50 text-xs">{selectedDepartment?.title || 'Department'} Canvas</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/20 text-[10px]">{count} agents · {workingCount} active</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md" style={{ background: 'rgba(16,185,129,0.08)' }}>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-400/80 text-[10px] font-semibold uppercase tracking-wider">Live</span>
                </div>
              </div>
            </div>

            {/* ── Main: 3 columns ── */}
            <div className="flex" style={{ height: 480, maxHeight: 480 }}>

              {/* ── LEFT: Orchestrators ── */}
              <div className="flex-shrink-0 flex flex-col p-5 overflow-hidden"
                style={{ width: 220, borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">Orchestrators</span>
                  </div>
                  <p className="text-white/25 text-[10px] leading-relaxed">Your team directs the AI workforce</p>
                </div>
                <div className="flex flex-col gap-2.5 mb-4">
                  {ORCHESTRATOR_MEMBERS.map((member, i) => (
                    <motion.div key={member.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-2.5 p-2 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                        style={{ background: member.color, border: '2px solid rgba(139,92,246,0.3)' }}>
                        <span className="text-white text-[10px] font-bold">{member.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-white/80 text-[11px] font-semibold truncate">{member.name}</p>
                        <p className="text-white/30 text-[9px]">{member.role}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {/* Instruction */}
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  className="relative px-3 py-2 rounded-xl rounded-tl-sm"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <MessageSquare className="w-3 h-3 text-indigo-400" />
                    <span className="text-indigo-400/60 text-[8px] uppercase tracking-wider font-semibold">Instruction</span>
                  </div>
                  <p className="text-white/85 text-[11px] font-medium leading-relaxed">{`"${scenario.instructions[0]}"`}</p>
                </motion.div>
              </div>

              {/* ── CENTER: Agent Board ── */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Board Header */}
                <div className="grid gap-2 px-4 py-2.5 items-center"
                  style={{
                    gridTemplateColumns: '36px 1fr 130px 80px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(255,255,255,0.015)',
                  }}>
                  <span />
                  <span className="text-white/20 text-[9px] uppercase tracking-widest font-semibold">Agent & Current Work</span>
                  <span className="text-white/20 text-[9px] uppercase tracking-widest font-semibold">Progress</span>
                  <span className="text-white/20 text-[9px] uppercase tracking-widest font-semibold text-center">Status</span>
                </div>

                {/* Board Rows -- richer, showing work detail */}
                <div className="flex-1 overflow-hidden">
                  {agentStates.map((state, i) => {
                    const agent = agents[i % agents.length];
                    const color = agentColors[i % agentColors.length];
                    const isCompleting = state.status === 'completing';
                    const isWorking = state.status === 'working';
                    const detail = getActivityDetail(state.task, detailTick + i);
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.05 }}
                        className="grid gap-2 px-4 py-3 items-center transition-all duration-300"
                        style={{
                          gridTemplateColumns: '48px 1fr 130px 80px',
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                          borderLeft: `3px solid ${isCompleting ? 'rgba(16,185,129,0.6)' : color.border}`,
                          background: isCompleting ? 'rgba(16,185,129,0.04)' : 'transparent',
                        }}>

                        {/* Avatar */}
                        <div className="relative w-11 h-11 flex-shrink-0">
                          {isWorking && (
                            <motion.div className="absolute inset-0 rounded-full"
                              animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                              style={{ background: `radial-gradient(circle, ${color.text}40, transparent)` }} />
                          )}
                          {isCompleting && (
                            <motion.div className="absolute inset-0 rounded-full"
                              initial={{ scale: 1, opacity: 0.4 }} animate={{ scale: 1.6, opacity: 0 }}
                              transition={{ duration: 0.6 }}
                              style={{ background: 'rgba(16,185,129,0.3)' }} />
                          )}
                          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
                            style={{ border: `2px solid ${isCompleting ? 'rgba(16,185,129,0.5)' : color.border}`,
                              background: agent.image ? 'transparent' : color.bg }}>
                            {agent.image ?
                              <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" style={{ mixBlendMode: 'lighten' }} /> :
                              <span className="text-white font-bold text-xs">{agent.name.charAt(0)}</span>}
                          </div>
                        </div>

                        {/* Agent info: name + task + live detail */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white/90 text-[13px] font-semibold truncate">{agent.name}</p>
                            {isWorking && <TypingDots color={color.text} />}
                          </div>
                          <p className="text-white/50 text-[11px] font-medium truncate mt-0.5" style={{ color: isCompleting ? '#10b981' : color.text + '99' }}>
                            {isCompleting ? '✓ ' + state.task : state.task}
                          </p>
                          {/* Live detail - what the agent is actually doing right now */}
                          {isWorking && (
                            <AnimatePresence mode="wait">
                              <motion.p key={detail} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-white/25 text-[10px] truncate mt-0.5 italic">
                                {detail}
                              </motion.p>
                            </AnimatePresence>
                          )}
                          {isCompleting && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              className="text-emerald-400/40 text-[10px] mt-0.5">
                              Task completed · picking next task…
                            </motion.p>
                          )}
                        </div>

                        {/* Progress bar */}
                        <div>
                          {isWorking ? (
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                              <motion.div className="h-full rounded-full"
                                style={{ background: `linear-gradient(90deg, ${color.text}, ${color.text}cc)` }}
                                key={state.completions}
                                initial={{ width: '0%' }} animate={{ width: '100%' }}
                                transition={{ duration: state.cycleDuration / 1000, ease: 'linear' }} />
                            </div>
                          ) : (
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                              <motion.div className="h-full rounded-full bg-emerald-500/60 w-full"
                                initial={{ opacity: 0.5 }} animate={{ opacity: [1, 0.6, 1] }}
                                transition={{ duration: 0.8 }} />
                            </div>
                          )}
                          {/* Micro count under progress */}
                          <div className="flex justify-between mt-0.5">
                            <span className="text-white/15 text-[8px]">{isCompleting ? 'done' : 'in progress'}</span>
                            <span className="text-emerald-400/40 text-[8px] font-semibold">{state.completions > 0 ? `${state.completions} done` : ''}</span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div className="flex justify-center">
                          {isCompleting ? (
                            <motion.span initial={{ scale: 0.85 }} animate={{ scale: 1 }}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold"
                              style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                              <CheckCircle2 className="w-3 h-3" />
                            </motion.span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold"
                              style={{ background: `${color.text}10`, color: color.text + 'aa' }}>
                              <motion.span className="w-1.5 h-1.5 rounded-full inline-block"
                                style={{ background: color.text }}
                                animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                              <Sparkles className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* ── RIGHT: Business Impact + Activity Log ── */}
              <div className="flex-shrink-0 flex flex-col overflow-hidden"
                style={{ width: 230, borderLeft: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>

                {/* Business Impact */}
                <div className="p-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Business Impact</span>
                  </div>

                  {/* Metric tiles */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2 rounded-lg text-center"
                      style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)' }}>
                      <p className="text-indigo-300 text-lg font-bold leading-none">{totalCompletions}</p>
                      <p className="text-white/25 text-[8px] uppercase mt-0.5">Tasks Done</p>
                    </div>
                    <div className="p-2 rounded-lg text-center"
                      style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.12)' }}>
                      <p className="text-cyan-300 text-lg font-bold leading-none">{workingCount}</p>
                      <p className="text-white/25 text-[8px] uppercase mt-0.5">Active Now</p>
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="flex flex-col gap-1.5">
                    <AnimatePresence>
                      {visibleOutcomes.map(o => (
                        <motion.div key={o} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span className="text-emerald-300 text-[11px] font-semibold">{o}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Activity Log */}
                <div className="flex-1 p-4 overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Activity Log</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <AnimatePresence initial={false}>
                      {feed.map(item => (
                        <motion.div key={item.id}
                          initial={{ opacity: 0, x: 16, height: 0 }}
                          animate={{ opacity: 1, x: 0, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                          className="px-2.5 py-1.5 rounded-lg"
                          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-white/60 text-[10px] font-semibold truncate">{item.agent}</span>
                            <span className="text-white/15 text-[8px] flex-shrink-0 ml-1">{item.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400/60 flex-shrink-0" />
                            <span className="text-white/30 text-[9px] truncate">{item.task}</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {feed.length === 0 && (
                      <motion.div animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 2, repeat: Infinity }}
                        className="text-white/15 text-[10px] text-center py-6">Agents working…</motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </SectionShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VARIANT B: APP FRAME CANVAS
// Same 3-column frame but center is a visual canvas with agent workstations.
// Each agent has a positioned "desk" showing rich work activity.
// ═══════════════════════════════════════════════════════════════════════════════

// Tighter grid positions – cards are ~150px wide so columns at 0%, 26%, 52%, 78%
// Slight vertical stagger for organic feel
const CANVAS_POSITIONS_GRID: Array<{ x: number; y: number }> = [
  // Row 1 (4 columns)
  { x: 1, y: 2 },  { x: 26, y: 0 },  { x: 51, y: 3 },  { x: 76, y: 1 },
  // Row 2
  { x: 1, y: 35 }, { x: 26, y: 33 }, { x: 51, y: 36 }, { x: 76, y: 34 },
  // Row 3
  { x: 1, y: 68 }, { x: 26, y: 66 }, { x: 51, y: 69 }, { x: 76, y: 67 },
];

function getCanvasPositions(count: number) {
  return CANVAS_POSITIONS_GRID.slice(0, count);
}

// ─── Agent Workstation Card (with action types + output preview) ─────────────

function AgentWorkstation({ agent, index, state, detail, x, y, delay = 0, receivedFrom }: {
  agent: MappedAgent; index: number; state: AgentCycleState; detail: string;
  x: number; y: number; delay?: number; receivedFrom?: string | null;
}) {
  const color = agentColors[index % agentColors.length];
  const isWorking = state.status === 'working';
  const isCompleting = state.status === 'completing';
  const actionMeta = getTaskAction(state.task);
  const ActionIcon = actionMeta.Icon;
  const OutputIcon = actionMeta.OutputIcon;

  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, width: '22%', minWidth: 140, maxWidth: 170, zIndex: isCompleting ? 10 : 1 }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 120 }}>

      <div className="rounded-xl p-2.5 transition-all duration-300 relative overflow-hidden"
        style={{
          background: 'rgba(15,15,35,0.95)',
          border: `1.5px solid ${isCompleting ? 'rgba(16,185,129,0.5)' : color.border + '80'}`,
          boxShadow: isWorking
            ? `0 0 20px ${color.glow}, 0 4px 16px rgba(0,0,0,0.4)`
            : isCompleting
              ? '0 0 30px rgba(16,185,129,0.2), 0 4px 16px rgba(0,0,0,0.4)'
              : `0 0 10px ${color.glow}, 0 4px 12px rgba(0,0,0,0.3)`,
        }}>

        {/* Subtle background pulse when working */}
        {isWorking && (
          <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
            animate={{ opacity: [0.02, 0.06, 0.02] }}
            transition={{ duration: 2.5 + index * 0.3, repeat: Infinity }}
            style={{ background: `linear-gradient(135deg, ${color.text}15, transparent)` }} />
        )}

        {/* Header: avatar + name + action label */}
        <div className="flex items-center gap-2 mb-2 relative z-10">
          <div className="relative w-10 h-10 flex-shrink-0">
            {isWorking && (
              <motion.div className="absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                style={{ background: `radial-gradient(circle, ${color.text}40, transparent)` }} />
            )}
            {isCompleting && (
              <motion.div className="absolute inset-0 rounded-full"
                initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.7 }}
                style={{ background: 'rgba(16,185,129,0.3)' }} />
            )}
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
              style={{ border: `1.5px solid ${isCompleting ? 'rgba(16,185,129,0.5)' : color.border}`,
                background: agent.image ? 'transparent' : color.bg }}>
              {agent.image ?
                <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" style={{ mixBlendMode: 'lighten' }} /> :
                <span className="text-white font-bold text-[11px]">{agent.name.charAt(0)}</span>}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
              style={isCompleting
                ? { background: '#10b981', boxShadow: '0 0 5px rgba(16,185,129,0.5)' }
                : { background: color.text, boxShadow: `0 0 4px ${color.glow}` }}>
              {isCompleting
                ? <CheckCircle2 className="w-2 h-2 text-white" />
                : <ActionIcon className="w-2 h-2 text-white" />}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="text-white/90 text-[12px] font-semibold truncate">{agent.name}</p>
              {isWorking && <TypingDots color={color.text} />}
            </div>
            {/* Action type label */}
            <div className="flex items-center gap-1">
              <ActionIcon className="w-2 h-2 flex-shrink-0"
                style={{ color: isCompleting ? '#10b981' : color.text + 'aa' }} />
              <p className="text-[7px] font-semibold uppercase tracking-wider"
                style={{ color: isCompleting ? '#10b981' : color.text + '80' }}>
                {isCompleting ? 'Done' : actionMeta.label}
              </p>
            </div>
          </div>
        </div>

        {/* Received handoff notification */}
        {receivedFrom && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md mb-1.5 relative z-10"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <Send className="w-2 h-2 text-purple-400" />
            <span className="text-purple-300 text-[7px] font-semibold truncate">From {receivedFrom}</span>
          </motion.div>
        )}

        {/* Task card with action icon */}
        <div className="rounded-lg px-2 py-1.5 mb-1.5 relative z-10"
          style={{
            background: isCompleting ? 'rgba(16,185,129,0.08)' : `${color.text}08`,
            border: `1px solid ${isCompleting ? 'rgba(16,185,129,0.15)' : color.text + '15'}`,
          }}>
          <div className="flex items-center gap-1">
            {isCompleting ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                <OutputIcon className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              </motion.div>
            ) : (
              <motion.div
                animate={actionMeta.type === 'analyze' ? { opacity: [0.6, 1, 0.6] } : {}}
                transition={actionMeta.type === 'analyze' ? { duration: 1.5, repeat: Infinity } : {}}>
                <ActionIcon className="w-2.5 h-2.5 flex-shrink-0" style={{ color: color.text + 'aa' }} />
              </motion.div>
            )}
            <p className="text-[9px] font-semibold truncate leading-tight"
              style={{ color: isCompleting ? '#10b981' : color.text + 'cc' }}>
              {isCompleting ? '✓ ' + state.task : state.task}
            </p>
          </div>
          {/* Live activity detail */}
          {isWorking && (
            <AnimatePresence mode="wait">
              <motion.p key={detail} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-white/25 text-[8px] truncate mt-0.5 italic leading-tight pl-[14px]">
                {detail}
              </motion.p>
            </AnimatePresence>
          )}
          {isCompleting && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-emerald-400/40 text-[8px] mt-0.5 pl-[14px]">
              next task…
            </motion.p>
          )}
        </div>

        {/* Progress bar + completions */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex-1">
            {isWorking ? (
              <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${color.text}, ${color.text}cc)` }}
                  key={state.completions}
                  initial={{ width: '0%' }} animate={{ width: '100%' }}
                  transition={{ duration: state.cycleDuration / 1000, ease: 'linear' }} />
              </div>
            ) : (
              <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div className="h-full rounded-full bg-emerald-500/60 w-full"
                  initial={{ opacity: 0.5 }} animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 0.8 }} />
              </div>
            )}
          </div>
          {state.completions > 0 && (
            <span className="text-emerald-400/40 text-[7px] font-semibold flex-shrink-0">{state.completions}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Canvas Collaboration Particles ──────────────────────────────────────────

function CanvasParticles({ positions }: { positions: Array<{ x: number; y: number }> }) {
  const connections = useMemo(() => {
    const pairs: Array<{ from: number; to: number }> = [];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length && pairs.length < 16; j++) {
        // Connect nearby agents (within ~40% distance)
        const dx = positions[i].x - positions[j].x;
        const dy = positions[i].y - positions[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < 50) {
          pairs.push({ from: i, to: j });
        }
      }
    }
    return pairs;
  }, [positions]);

  // Offset to center of card roughly (card is ~150px wide, ~120px tall)
  const cx = (pos: { x: number; y: number }) => `calc(${pos.x}% + 75px)`;
  const cy = (pos: { x: number; y: number }) => `calc(${pos.y}% + 55px)`;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="canvasGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {connections.map((c, idx) => {
        const from = positions[c.from];
        const to = positions[c.to];
        const col = agentColors[c.from % agentColors.length].text;
        return (
          <g key={idx}>
            <line x1={cx(from)} y1={cy(from)} x2={cx(to)} y2={cy(to)}
              stroke="rgba(139,92,246,0.07)" strokeWidth="1" strokeDasharray="4 6" />
            <motion.circle r="2" fill={col} filter="url(#canvasGlow)"
              animate={{
                cx: [cx(from), cx(to)],
                cy: [cy(from), cy(to)],
                opacity: [0, 0.6, 0],
              }}
              transition={{ duration: 3 + idx * 0.4, repeat: Infinity, delay: idx * 0.8, ease: 'easeInOut' }} />
          </g>
        );
      })}
    </svg>
  );
}

// ─── HandoffParticle (animated packet from one agent to another) ─────────────

function HandoffParticle({ fromPos, toPos, color, label }: {
  fromPos: { x: number; y: number }; toPos: { x: number; y: number };
  color: string; label: string;
}) {
  // Card center offsets (card is ~150px wide, ~120px tall)
  const fx = `calc(${fromPos.x}% + 75px)`;
  const fy = `calc(${fromPos.y}% + 55px)`;
  const tx = `calc(${toPos.x}% + 75px)`;
  const ty = `calc(${toPos.y}% + 55px)`;

  return (
    <motion.div className="absolute pointer-events-none z-30"
      initial={{ left: fx, top: fy, opacity: 0, scale: 0.5 }}
      animate={{ left: [fx, tx], top: [fy, ty], opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}>
      <div className="flex items-center gap-1 px-2 py-1 rounded-full"
        style={{ background: 'rgba(15,15,35,0.95)', border: `1.5px solid ${color}`, boxShadow: `0 0 12px ${color}40` }}>
        <Send className="w-2.5 h-2.5" style={{ color }} />
        <span className="text-[8px] font-semibold whitespace-nowrap" style={{ color }}>{label}</span>
      </div>
    </motion.div>
  );
}

// ─── useHandoffs hook ────────────────────────────────────────────────────────

interface HandoffEvent {
  id: number;
  from: number;
  to: number;
  label: string;
}

function useHandoffs(agentStates: AgentCycleState[], agents: MappedAgent[]): { handoffs: HandoffEvent[]; receivedMap: Record<number, string | null> } {
  const [handoffs, setHandoffs] = useState<HandoffEvent[]>([]);
  const [receivedMap, setReceivedMap] = useState<Record<number, string | null>>({});
  const idRef = useRef(0);
  const prevCompletionsRef = useRef<number[]>([]);

  useEffect(() => {
    if (agentStates.length === 0) { prevCompletionsRef.current = []; return; }
    agentStates.forEach((s, i) => {
      if (prevCompletionsRef.current[i] !== undefined && s.completions > prevCompletionsRef.current[i]) {
        // ~50% chance of handoff
        if (Math.random() < 0.5 && agentStates.length > 1) {
          let target = i;
          while (target === i) target = Math.floor(Math.random() * agentStates.length);
          const agentFrom = agents[i % agents.length];
          const actionMeta = getTaskAction(s.task);
          const label = actionMeta.label;
          const newId = idRef.current++;
          setHandoffs(prev => [...prev, { id: newId, from: i, to: target, label }]);
          // Show "received from" on target agent
          setReceivedMap(prev => ({ ...prev, [target]: agentFrom.name }));
          // Clear handoff particle and received after animation
          setTimeout(() => {
            setHandoffs(prev => prev.filter(h => h.id !== newId));
          }, 2200);
          setTimeout(() => {
            setReceivedMap(prev => ({ ...prev, [target]: null }));
          }, 4000);
        }
      }
    });
    prevCompletionsRef.current = agentStates.map(s => s.completions);
  }, [agentStates, agents]);

  // Reset on agent change
  useEffect(() => {
    setHandoffs([]);
    setReceivedMap({});
    prevCompletionsRef.current = [];
  }, [agents.length]);

  return { handoffs, receivedMap };
}

// ─── App Frame Canvas Layout ─────────────────────────────────────────────────

function AppFrameCanvasLayout(props: SharedLayoutProps) {
  const { agents, departments, selectedDepartmentId, onSelectDepartment, selectedDepartment, isLoading, scenario, agentStates, totalCompletions } = props;

  const count = agentStates.length;
  const workingCount = agentStates.filter(s => s.status === 'working').length;
  const positions = useMemo(() => getCanvasPositions(count), [count]);

  const visibleOutcomes = useMemo(() => {
    const idx = Math.min(Math.floor(totalCompletions / 3), scenario.outcomes.length - 1);
    return totalCompletions > 0 ? scenario.outcomes.slice(0, idx + 1) : [];
  }, [totalCompletions, scenario.outcomes]);

  // Activity feed (logs)
  const [feed, setFeed] = useState<Array<{ id: number; agent: string; task: string; time: string }>>([]);
  const feedIdRef = useRef(0);
  const prevRef = useRef<number[]>([]);
  useEffect(() => {
    if (agentStates.length === 0) { setFeed([]); prevRef.current = []; return; }
    agentStates.forEach((s, i) => {
      if (prevRef.current[i] !== undefined && s.completions > prevRef.current[i]) {
        const a = agents[i % agents.length];
        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        setFeed(f => [{ id: feedIdRef.current++, agent: a.name, task: s.task, time }, ...f].slice(0, 8));
      }
    });
    prevRef.current = agentStates.map(s => s.completions);
  }, [agentStates, agents]);
  useEffect(() => { setFeed([]); }, [selectedDepartmentId]);

  // Detail tick
  const [detailTick, setDetailTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDetailTick(p => p + 1), 5000);
    return () => clearInterval(t);
  }, []);

  // Live instruction stream (chat feed)
  const instructionItems = useInstructionStream(scenario.instructions, 8000);
  const instructionPulseTrigger = instructionItems.length > 0 ? instructionItems[0].id : 0;

  // Handoffs
  const { handoffs, receivedMap } = useHandoffs(agentStates, agents);

  return (
    <SectionShell departments={departments} selectedId={selectedDepartmentId} onSelect={onSelectDepartment}>
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-purple-400 animate-spin" /></div>
      ) : agents.length === 0 ? (
        <div className="text-center py-20 text-white/40">No agents found for this department</div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={selectedDepartmentId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)',
              boxShadow: '0 0 60px rgba(99,102,241,0.04), 0 8px 32px rgba(0,0,0,0.3)' }}>

            {/* ── Title Bar ── */}
            <div className="flex items-center justify-between px-5 py-2.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(239,68,68,0.7)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(234,179,8,0.7)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(34,197,94,0.7)' }} />
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-white/70 text-xs font-semibold tracking-wide">AI Work Platform</span>
                  <span className="text-white/20 text-xs">/</span>
                  <span className="text-white/50 text-xs">{selectedDepartment?.title || 'Department'} Canvas</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/20 text-[10px]">{count} agents · {workingCount} active</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md" style={{ background: 'rgba(16,185,129,0.08)' }}>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-400/80 text-[10px] font-semibold uppercase tracking-wider">Live</span>
                </div>
              </div>
            </div>

            {/* ── Main: 3 columns ── */}
            <div className="flex" style={{ height: count > 8 ? 560 : count > 4 ? 480 : 380, maxHeight: 560 }}>

              {/* ── LEFT: Orchestrators + Live Instruction Chat ── */}
              <div className="flex-shrink-0 flex flex-col p-4 overflow-hidden"
                style={{ width: 230, borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>

                {/* Orchestrators header + inline avatars */}
                <div className="mb-3 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">Orchestrators</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    {/* Stacked avatars */}
                    <div className="flex -space-x-2 flex-shrink-0">
                      {ORCHESTRATOR_MEMBERS.map((member, i) => (
                        <motion.div key={member.name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.08 }}
                          className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center ring-2 ring-[rgba(15,15,35,0.9)]"
                          style={{ background: member.color, zIndex: 3 - i }}>
                          <span className="text-white text-[9px] font-bold">{member.name.charAt(0)}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white/60 text-[10px] font-semibold truncate">
                        {ORCHESTRATOR_MEMBERS.map(m => m.name.split(' ')[0]).join(', ')}
                      </p>
                      <p className="text-white/25 text-[8px]">Directing AI workforce</p>
                    </div>
                  </div>
                </div>

                {/* Live Instruction Chat Feed – prominent, right below orchestrators */}
                <div className="flex-1 min-h-0 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-2 flex-shrink-0">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-indigo-300 text-[10px] uppercase tracking-wider font-bold">Live Instructions</span>
                    <motion.span className="w-1.5 h-1.5 bg-indigo-400 rounded-full ml-auto flex-shrink-0"
                      animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <ChatFeed items={instructionItems} deptColor={selectedDepartment?.avatarBgColor || '#6366f1'} />
                  </div>
                </div>
              </div>

              {/* ── CENTER: Agent Canvas ── */}
              <div className="flex-1 relative min-w-0 overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.005)' }}>
                {/* Subtle dot grid background to ground the agents */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }} />
                {/* Instruction pulse ripple */}
                <InstructionPulse trigger={instructionPulseTrigger} />

                {/* Particles between workstations */}
                {positions.length > 1 && <CanvasParticles positions={positions} />}

                {/* Handoff particles */}
                <AnimatePresence>
                  {handoffs.map(h => {
                    const fromPos = positions[h.from];
                    const toPos = positions[h.to];
                    if (!fromPos || !toPos) return null;
                    const hColor = agentColors[h.from % agentColors.length].text;
                    return <HandoffParticle key={h.id} fromPos={fromPos} toPos={toPos} color={hColor} label={h.label} />;
                  })}
                </AnimatePresence>

                {/* Agent workstations */}
                {agentStates.map((state, i) => {
                  const agent = agents[i % agents.length];
                  const pos = positions[i];
                  if (!pos) return null;
                  const detail = getActivityDetail(state.task, detailTick + i);
                  return (
                    <AgentWorkstation key={i} agent={agent} index={i} state={state} detail={detail}
                      x={pos.x} y={pos.y} delay={0.08 + i * 0.05}
                      receivedFrom={receivedMap[i] || null} />
                  );
                })}
              </div>

              {/* ── RIGHT: Business Impact + Activity Log ── */}
              <div className="flex-shrink-0 flex flex-col overflow-hidden"
                style={{ width: 230, borderLeft: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
                {/* Business Impact */}
                <div className="p-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Business Impact</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2 rounded-lg text-center"
                      style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)' }}>
                      <p className="text-indigo-300 text-lg font-bold leading-none">{totalCompletions}</p>
                      <p className="text-white/25 text-[8px] uppercase mt-0.5">Tasks Done</p>
                    </div>
                    <div className="p-2 rounded-lg text-center"
                      style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.12)' }}>
                      <p className="text-cyan-300 text-lg font-bold leading-none">{workingCount}</p>
                      <p className="text-white/25 text-[8px] uppercase mt-0.5">Active Now</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <AnimatePresence>
                      {visibleOutcomes.map(o => (
                        <motion.div key={o} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span className="text-emerald-300 text-[11px] font-semibold">{o}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
                {/* Activity Log */}
                <div className="flex-1 p-4 overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Activity Log</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <AnimatePresence initial={false}>
                      {feed.map(item => (
                        <motion.div key={item.id}
                          initial={{ opacity: 0, x: 16, height: 0 }}
                          animate={{ opacity: 1, x: 0, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                          className="px-2.5 py-1.5 rounded-lg"
                          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-white/60 text-[10px] font-semibold truncate">{item.agent}</span>
                            <span className="text-white/15 text-[8px] flex-shrink-0 ml-1">{item.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400/60 flex-shrink-0" />
                            <span className="text-white/30 text-[9px] truncate">{item.task}</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {feed.length === 0 && (
                      <motion.div animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 2, repeat: Infinity }}
                        className="text-white/15 text-[10px] text-center py-6">Agents working…</motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </SectionShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VARIANT C: APP FRAME BOARD
// monday-board-style center with large agent rows, AI identity, use-case header,
// prominent orchestrators with live instruction stream.
// ═══════════════════════════════════════════════════════════════════════════════

function AppFrameBoardLayout(props: SharedLayoutProps) {
  const { agents, departments, selectedDepartmentId, onSelectDepartment, selectedDepartment, isLoading, scenario, agentStates, totalCompletions } = props;

  const count = agentStates.length;
  const workingCount = agentStates.filter(s => s.status === 'working').length;

  const visibleOutcomes = useMemo(() => {
    const idx = Math.min(Math.floor(totalCompletions / 3), scenario.outcomes.length - 1);
    return totalCompletions > 0 ? scenario.outcomes.slice(0, idx + 1) : [];
  }, [totalCompletions, scenario.outcomes]);

  // Activity feed (logs)
  const [feed, setFeed] = useState<Array<{ id: number; agent: string; task: string; time: string }>>([]);
  const feedIdRef = useRef(0);
  const prevRef = useRef<number[]>([]);
  useEffect(() => {
    if (agentStates.length === 0) { setFeed([]); prevRef.current = []; return; }
    agentStates.forEach((s, i) => {
      if (prevRef.current[i] !== undefined && s.completions > prevRef.current[i]) {
        const a = agents[i % agents.length];
        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        setFeed(f => [{ id: feedIdRef.current++, agent: a.name, task: s.task, time }, ...f].slice(0, 8));
      }
    });
    prevRef.current = agentStates.map(s => s.completions);
  }, [agentStates, agents]);
  useEffect(() => { setFeed([]); }, [selectedDepartmentId]);

  // Detail tick
  const [detailTick, setDetailTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDetailTick(p => p + 1), 5000);
    return () => clearInterval(t);
  }, []);

  // Live instruction stream
  const instructionItems = useInstructionStream(scenario.instructions, 8000);

  // Instruction highlight pulse on agent rows
  const [highlightPulse, setHighlightPulse] = useState(0);
  const prevInstructionIdRef = useRef(0);
  useEffect(() => {
    if (instructionItems.length > 0 && instructionItems[0].id !== prevInstructionIdRef.current) {
      prevInstructionIdRef.current = instructionItems[0].id;
      setHighlightPulse(p => p + 1);
    }
  }, [instructionItems]);

  // Agent-to-agent handoffs
  const { handoffs, receivedMap } = useHandoffs(agentStates, agents);

  // Command Center board toggle
  const [showBoard, setShowBoard] = useState(false);
  useEffect(() => { setShowBoard(false); }, [selectedDepartmentId]);
  const deptKey = (selectedDepartment?.title || '').toLowerCase().replace(/[^a-z]/g, '');
  const boardData = DEPARTMENT_BOARDS[deptKey] || DEPARTMENT_BOARDS['operations'];

  return (
    <SectionShell departments={departments} selectedId={selectedDepartmentId} onSelect={onSelectDepartment}>
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-purple-400 animate-spin" /></div>
      ) : agents.length === 0 ? (
        <div className="text-center py-20 text-white/40">No agents found for this department</div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={selectedDepartmentId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)',
              boxShadow: '0 0 60px rgba(99,102,241,0.04), 0 8px 32px rgba(0,0,0,0.3)' }}>

            {/* ── Title Bar ── */}
            <div className="flex items-center justify-between px-5 py-2.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(239,68,68,0.7)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(234,179,8,0.7)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(34,197,94,0.7)' }} />
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-white/70 text-xs font-semibold tracking-wide">AI Work Platform</span>
                  <span className="text-white/20 text-xs">/</span>
                  <span className="text-white/50 text-xs">{selectedDepartment?.title || 'Department'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/20 text-[10px]">{count} agents · {workingCount} active</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md" style={{ background: 'rgba(16,185,129,0.08)' }}>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-400/80 text-[10px] font-semibold uppercase tracking-wider">Live</span>
                </div>
              </div>
            </div>


            {/* ── Main: 3 columns ── */}
            <div className="flex" style={{ height: 520, maxHeight: 520 }}>

              {/* ── LEFT: Orchestrators + Live Instructions ── */}
              <div className="flex-shrink-0 flex flex-col overflow-hidden"
                style={{ width: 240, borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>

                {/* Orchestrators Section */}
                <div className="p-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">Your Team</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {ORCHESTRATOR_MEMBERS.map((member, i) => (
                      <motion.div key={member.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-3 p-2.5 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                          style={{ background: member.color, border: '2px solid rgba(139,92,246,0.3)' }}>
                          <span className="text-white text-sm font-bold">{member.name.charAt(0)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white/85 text-[12px] font-semibold truncate">{member.name}</p>
                          <p className="text-white/35 text-[10px]">{member.role}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Live Instructions Feed */}
                <div className="flex-1 p-4 overflow-hidden min-h-0 flex flex-col">
                  <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Instructions</span>
                    <motion.span className="w-1.5 h-1.5 bg-indigo-400 rounded-full ml-auto flex-shrink-0"
                      animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  </div>
                  {/* Directing arrow */}
                  <div className="flex items-center gap-1.5 mb-2 flex-shrink-0">
                    <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.3), rgba(99,102,241,0.05))' }} />
                    <span className="text-indigo-400/40 text-[8px] uppercase tracking-wider">directing agents →</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <ChatFeed items={instructionItems} deptColor={selectedDepartment?.avatarBgColor || '#6366f1'} />
                  </div>
                </div>
              </div>

              {/* ── CENTER: Agent Board ── */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Board Header - Use Case Context */}
                <div className="px-5 py-3 flex items-center justify-between flex-shrink-0"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(99,102,241,0.03)' }}>
                  <div className="flex items-center gap-3">
                    {selectedDepartment?.avatarImage ? (
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ background: selectedDepartment.avatarBgColor, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img src={selectedDepartment.avatarImage} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: selectedDepartment?.avatarBgColor || '#6366f1', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <span className="text-white font-bold text-sm">{selectedDepartment?.title?.charAt(0) || 'D'}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-white/90 text-sm font-bold leading-tight">
                        {selectedDepartment?.title || 'Department'}: {scenario.instructions[0]}
                      </p>
                      <p className="text-white/35 text-[10px] mt-0.5">
                        {showBoard ? `${boardData.boardName} · ${boardData.items.length} items` : `${count} AI Agents working in parallel`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowBoard(v => !v)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer"
                      style={{
                        background: showBoard ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${showBoard ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.08)'}`,
                      }}>
                      <LayoutGrid className="w-3 h-3" style={{ color: showBoard ? '#818cf8' : 'rgba(255,255,255,0.4)' }} />
                      <span className="text-[10px] font-semibold" style={{ color: showBoard ? '#818cf8' : 'rgba(255,255,255,0.4)' }}>
                        {showBoard ? 'AI Agents' : boardData.boardName}
                      </span>
                    </button>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md"
                      style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span className="text-purple-300 text-[10px] font-semibold">AI Powered</span>
                    </div>
                  </div>
                </div>

                {!showBoard ? (<>
                {/* Column Headers */}
                <div className="flex items-center px-4 py-2 flex-shrink-0"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                  <div className="flex items-center gap-3" style={{ width: 200 }}>
                    <span className="text-white/25 text-[9px] uppercase tracking-widest font-semibold">AI Agent</span>
                  </div>
                  <div style={{ width: 130 }}>
                    <span className="text-white/25 text-[9px] uppercase tracking-widest font-semibold">Action</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-white/25 text-[9px] uppercase tracking-widest font-semibold">Current Task</span>
                  </div>
                  <div style={{ width: 90 }} className="text-center">
                    <span className="text-white/25 text-[9px] uppercase tracking-widest font-semibold">Collab</span>
                  </div>
                  <div style={{ width: 100 }}>
                    <span className="text-white/25 text-[9px] uppercase tracking-widest font-semibold">Progress</span>
                  </div>
                  <div style={{ width: 50 }} className="text-center">
                    <span className="text-white/25 text-[9px] uppercase tracking-widest font-semibold">Status</span>
                  </div>
                </div>

                {/* Agent Rows */}
                <div className="flex-1 overflow-hidden relative">
                  {agentStates.map((state, i) => {
                    const agent = agents[i % agents.length];
                    const color = agentColors[i % agentColors.length];
                    const isCompleting = state.status === 'completing';
                    const isWorking = state.status === 'working';
                    const detail = getActivityDetail(state.task, detailTick + i);
                    const actionMeta = getTaskAction(state.task);
                    const ActionIcon = actionMeta.Icon;
                    const OutputIcon = actionMeta.OutputIcon;
                    const collaboratingWith = receivedMap[i] || null;
                    const collaboratingAgent = collaboratingWith ? agents.find(a => a.name === collaboratingWith) : null;
                    const collaboratingIdx = collaboratingWith ? agents.findIndex(a => a.name === collaboratingWith) : -1;
                    const collabColor = collaboratingIdx >= 0 ? agentColors[collaboratingIdx % agentColors.length] : null;

                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.05 }}
                        className="flex items-center px-4 py-3 transition-all duration-300 relative"
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                          borderLeft: `3px solid ${isCompleting ? 'rgba(16,185,129,0.6)' : color.border}`,
                          background: isCompleting ? 'rgba(16,185,129,0.04)' : 'transparent',
                        }}>

                        {/* Instruction highlight ripple */}
                        <AnimatePresence>
                          {highlightPulse > 0 && (
                            <motion.div key={highlightPulse}
                              className="absolute inset-0 pointer-events-none z-0"
                              initial={{ opacity: 0.15, x: '-100%' }}
                              animate={{ opacity: 0, x: '100%' }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
                              style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.1), transparent)' }} />
                          )}
                        </AnimatePresence>

                        {/* Agent Column: Large avatar + AI badge + name */}
                        <div className="flex items-center gap-3 relative z-10" style={{ width: 220 }}>
                          <div className="relative w-14 h-14 flex-shrink-0">
                            {isWorking && (
                              <motion.div className="absolute inset-0 rounded-full"
                                animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                style={{ background: `radial-gradient(circle, ${color.text}40, transparent)` }} />
                            )}
                            {isCompleting && (
                              <motion.div className="absolute inset-0 rounded-full"
                                initial={{ scale: 1, opacity: 0.4 }} animate={{ scale: 1.6, opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                style={{ background: 'rgba(16,185,129,0.3)' }} />
                            )}
                            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
                              style={{ border: `2px solid ${isCompleting ? 'rgba(16,185,129,0.5)' : color.border}`,
                                background: agent.image ? 'transparent' : color.bg }}>
                              {agent.image ?
                                <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" style={{ mixBlendMode: 'lighten' }} /> :
                                <span className="text-white font-bold text-sm">{agent.name.charAt(0)}</span>}
                            </div>
                            {/* AI Agent badge */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ background: 'rgba(139,92,246,0.9)', boxShadow: '0 0 6px rgba(139,92,246,0.5)', border: '1.5px solid rgba(15,15,35,0.9)' }}>
                              <Sparkles className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-white/90 text-sm font-semibold truncate">{agent.name}</p>
                              {isWorking && <TypingDots color={color.text} />}
                            </div>
                            <p className="text-purple-400/50 text-[10px] font-semibold uppercase tracking-wider">AI Agent</p>
                          </div>
                        </div>

                        {/* Action Column: Icon + Label */}
                        <div className="relative z-10 flex items-center gap-2" style={{ width: 130 }}>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: isCompleting ? 'rgba(16,185,129,0.1)' : `${color.text}10`,
                              border: `1px solid ${isCompleting ? 'rgba(16,185,129,0.2)' : color.text + '20'}`,
                            }}>
                            {isCompleting
                              ? <OutputIcon className="w-3.5 h-3.5 text-emerald-400" />
                              : <ActionIcon className="w-3.5 h-3.5" style={{ color: color.text + 'cc' }} />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold truncate"
                              style={{ color: isCompleting ? '#10b981' : color.text + 'bb' }}>
                              {isCompleting ? 'Done' : actionMeta.label}
                            </p>
                          </div>
                        </div>

                        {/* Task Column: Current task + detail */}
                        <div className="flex-1 min-w-0 relative z-10 pr-3">
                          <p className="text-white/70 text-[12px] font-medium truncate"
                            style={{ color: isCompleting ? '#10b981cc' : undefined }}>
                            {isCompleting ? '✓ ' + state.task : state.task}
                          </p>
                          {isWorking && CALL_TASKS.has(state.task) && CALL_TRANSCRIPTS[state.task] ? (() => {
                            const transcript = CALL_TRANSCRIPTS[state.task];
                            const line = transcript[detailTick % transcript.length];
                            const callMins = Math.floor((detailTick * 5 + i * 13) % 600 / 60);
                            const callSecs = (detailTick * 5 + i * 13) % 60;
                            const timer = `${callMins}:${callSecs.toString().padStart(2, '0')}`;
                            const contactInitial = line.contact.charAt(0);
                            return (
                              <>
                                <div className="flex items-center gap-0 mt-1.5">
                                  {/* Agent avatar */}
                                  <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                                    style={{ background: agent.image ? 'transparent' : color.bg, border: `1.5px solid ${color.border}` }}>
                                    {agent.image ?
                                      <img src={agent.image} alt="" className="w-full h-full object-cover" style={{ mixBlendMode: 'lighten' }} /> :
                                      <span className="text-white font-bold text-[7px]">{agent.name.charAt(0)}</span>}
                                  </div>
                                  {/* Connecting line with pulse */}
                                  <div className="relative flex-1 mx-1" style={{ minWidth: 30, maxWidth: 60, height: 2 }}>
                                    <div className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(90deg, ${color.text}50, rgba(16,185,129,0.5))` }} />
                                    <motion.div className="absolute top-[-1px] w-2 h-2 rounded-full"
                                      style={{ background: color.text, boxShadow: `0 0 6px ${color.text}` }}
                                      animate={{ left: ['0%', '100%', '0%'] }}
                                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
                                  </div>
                                  {/* Contact avatar */}
                                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(16,185,129,0.15)', border: '1.5px solid rgba(16,185,129,0.5)' }}>
                                    <span className="text-emerald-400 font-bold text-[7px]">{contactInitial}</span>
                                  </div>
                                  <span className="text-emerald-400/70 text-[9px] font-semibold truncate ml-1.5">{line.contact}</span>
                                  <span className="text-white/20 text-[9px] ml-auto flex-shrink-0 tabular-nums">{timer}</span>
                                </div>
                                <AnimatePresence mode="wait">
                                  <motion.p key={detailTick} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-white/30 text-[9px] truncate mt-0.5 italic">
                                    <span className="not-italic font-semibold" style={{ color: line.speaker === 'Agent' ? 'rgba(139,92,246,0.6)' : 'rgba(99,102,241,0.5)' }}>
                                      {line.speaker}:
                                    </span>
                                    {' "' + line.text + '"'}
                                  </motion.p>
                                </AnimatePresence>
                              </>
                            );
                          })() : isWorking ? (
                            <AnimatePresence mode="wait">
                              <motion.p key={detail} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-white/25 text-[10px] truncate mt-0.5 italic">
                                {detail}
                              </motion.p>
                            </AnimatePresence>
                          ) : null}
                          {isCompleting && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              className="text-emerald-400/40 text-[10px] mt-0.5">
                              Task completed · picking next…
                            </motion.p>
                          )}
                        </div>

                        {/* Collab Column */}
                        <div className="relative z-10 flex justify-center" style={{ width: 90 }}>
                          <AnimatePresence mode="wait">
                            {collaboratingWith && collaboratingAgent ? (
                              <motion.div key={collaboratingWith}
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.7 }}
                                className="flex items-center gap-1.5">
                                <div className="relative">
                                  <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center"
                                    style={{
                                      background: collaboratingAgent.image ? 'transparent' : (collabColor?.bg || 'rgba(99,102,241,0.15)'),
                                      border: `1.5px solid ${collabColor?.border || 'rgba(99,102,241,0.5)'}`,
                                    }}>
                                    {collaboratingAgent.image ?
                                      <img src={collaboratingAgent.image} alt="" className="w-full h-full object-cover" style={{ mixBlendMode: 'lighten' }} /> :
                                      <span className="text-white font-bold text-[8px]">{collaboratingAgent.name.charAt(0)}</span>}
                                  </div>
                                  <motion.div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center"
                                    style={{ background: 'rgba(99,102,241,0.9)', border: '1px solid rgba(15,15,35,0.9)' }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}>
                                    <Zap className="w-1.5 h-1.5 text-white" />
                                  </motion.div>
                                </div>
                                <span className="text-indigo-300/70 text-[9px] font-medium truncate max-w-[45px]">
                                  {collaboratingWith.split(' ')[0]}
                                </span>
                              </motion.div>
                            ) : (
                              <motion.span key="idle"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-white/10 text-[9px]">—</motion.span>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Progress Column */}
                        <div className="relative z-10" style={{ width: 100 }}>
                          {isWorking ? (
                            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                              <motion.div className="h-full rounded-full"
                                style={{ background: `linear-gradient(90deg, ${color.text}, ${color.text}cc)` }}
                                key={state.completions}
                                initial={{ width: '0%' }} animate={{ width: '100%' }}
                                transition={{ duration: state.cycleDuration / 1000, ease: 'linear' }} />
                            </div>
                          ) : (
                            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                              <motion.div className="h-full rounded-full bg-emerald-500/60 w-full"
                                initial={{ opacity: 0.5 }} animate={{ opacity: [1, 0.6, 1] }}
                                transition={{ duration: 0.8 }} />
                            </div>
                          )}
                          <div className="flex justify-between mt-0.5">
                            <span className="text-white/15 text-[8px]">{isCompleting ? 'done' : 'in progress'}</span>
                            {state.completions > 0 && (
                              <span className="text-emerald-400/40 text-[8px] font-semibold">{state.completions} done</span>
                            )}
                          </div>
                        </div>

                        {/* Status Column */}
                        <div className="relative z-10 flex justify-center" style={{ width: 50 }}>
                          {isCompleting ? (
                            <motion.span initial={{ scale: 0.85 }} animate={{ scale: 1 }}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg"
                              style={{ background: 'rgba(16,185,129,0.15)' }}>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            </motion.span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg"
                              style={{ background: `${color.text}10` }}>
                              <motion.div className="w-2 h-2 rounded-full"
                                style={{ background: color.text }}
                                animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}

                </div>
                </>) : (
                  <>
                  {/* ── Command Center Board View ── */}
                  <div className="flex items-center px-4 py-2 flex-shrink-0"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                    {boardData.columns.map((col, ci) => (
                      <div key={ci} style={{ width: ci === 0 ? 200 : ci === 1 ? 100 : ci === 2 ? 100 : ci === 3 ? 100 : undefined }}
                        className={ci === 4 ? 'flex-1 min-w-0' : ''}>
                        <span className="text-white/25 text-[9px] uppercase tracking-widest font-semibold">{col}</span>
                      </div>
                    ))}
                    <div style={{ width: 80 }}>
                      <span className="text-white/25 text-[9px] uppercase tracking-widest font-semibold">Progress</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    {boardData.items.map((item, i) => {
                      // Progress advances based on agent task completions, staggered per item
                      const boost = Math.floor(totalCompletions * (1.8 + i * 0.6));
                      const liveProgress = Math.min(item.progress + boost, 100);
                      const isDone = liveProgress >= 100;
                      const liveStatus = isDone && item.status !== 'Closed Won' && item.status !== 'Done' && item.status !== 'Approved' ? 'Done' : item.status;
                      const liveColor = isDone ? '#10b981' : item.statusColor;
                      return (
                      <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.05 }}
                        className="flex items-center px-4 py-3 transition-all duration-300"
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                          borderLeft: `3px solid ${liveColor}`,
                          background: isDone ? 'rgba(16,185,129,0.03)' : 'transparent',
                        }}>
                        {/* Name */}
                        <div style={{ width: 200 }} className="min-w-0 pr-2">
                          <p className="text-white/80 text-[12px] font-medium truncate">{item.name}</p>
                        </div>
                        {/* Status */}
                        <div style={{ width: 100 }}>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold"
                            style={{ background: liveColor + '18', color: liveColor, border: `1px solid ${liveColor}30` }}>
                            {liveStatus}
                          </span>
                        </div>
                        {/* Owner */}
                        <div style={{ width: 100 }} className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: ORCHESTRATOR_MEMBERS.find(m => m.name === item.owner)?.color || '#6366f1' }}>
                            <span className="text-white text-[7px] font-bold">{item.owner.charAt(0)}</span>
                          </div>
                          <span className="text-white/50 text-[10px] truncate">{item.owner}</span>
                        </div>
                        {/* Metric */}
                        <div style={{ width: 100 }}>
                          <span className="text-white/60 text-[11px] font-medium">{item.metric}</span>
                        </div>
                        {/* Extra column - empty flex space */}
                        <div className="flex-1 min-w-0" />
                        {/* Progress */}
                        <div style={{ width: 80 }}>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <motion.div className="h-full rounded-full"
                              style={{ background: liveColor }}
                              animate={{ width: `${liveProgress}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut' }} />
                          </div>
                          <span className="text-white/20 text-[8px] mt-0.5 block">{liveProgress}%</span>
                        </div>
                        {isDone && liveStatus === 'Done' && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-1 flex-shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          </motion.div>
                        )}
                      </motion.div>
                      );
                    })}
                  </div>
                  </>
                )}
              </div>

              {/* ── RIGHT: Business Impact + Activity Log ── */}
              <div className="flex-shrink-0 flex flex-col overflow-hidden"
                style={{ width: 230, borderLeft: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
                {/* Business Impact */}
                <div className="p-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Business Impact</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2 rounded-lg text-center"
                      style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)' }}>
                      <p className="text-indigo-300 text-lg font-bold leading-none">{totalCompletions}</p>
                      <p className="text-white/25 text-[8px] uppercase mt-0.5">Tasks Done</p>
                    </div>
                    <div className="p-2 rounded-lg text-center"
                      style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.12)' }}>
                      <p className="text-cyan-300 text-lg font-bold leading-none">{workingCount}</p>
                      <p className="text-white/25 text-[8px] uppercase mt-0.5">Active Now</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <AnimatePresence>
                      {visibleOutcomes.map(o => (
                        <motion.div key={o} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span className="text-emerald-300 text-[11px] font-semibold">{o}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
                {/* Activity Log */}
                <div className="flex-1 p-4 overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Activity Log</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <AnimatePresence initial={false}>
                      {feed.map(item => (
                        <motion.div key={item.id}
                          initial={{ opacity: 0, x: 16, height: 0 }}
                          animate={{ opacity: 1, x: 0, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                          className="px-2.5 py-1.5 rounded-lg"
                          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-white/60 text-[10px] font-semibold truncate">{item.agent}</span>
                            <span className="text-white/15 text-[8px] flex-shrink-0 ml-1">{item.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400/60 flex-shrink-0" />
                            <span className="text-white/30 text-[9px] truncate">{item.task}</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {feed.length === 0 && (
                      <motion.div animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 2, repeat: Infinity }}
                        className="text-white/15 text-[10px] text-center py-6">Agents working…</motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </SectionShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function AIPlatformArchitectureSection({
  layoutVariant = 'app_frame_board',
}: AIPlatformArchitectureSectionProps) {
  const { departments, loading: departmentsLoading } = useDepartments();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const { agents: departmentAgents, loading: agentsLoading } = useDepartmentData(selectedDepartmentId);

  useEffect(() => {
    if (departments.length > 0 && !selectedDepartmentId) {
      setSelectedDepartmentId(departments[0].id);
    }
  }, [departments, selectedDepartmentId]);

  const mappedDepartments = useMemo<MappedDepartment[]>(() =>
    departments.map(dept => ({
      id: dept.id,
      title: dept.name || dept.title,
      avatarImage: dept.avatar_image || '',
      avatarBgColor: dept.avatar_bg_color || dept.avatar_color || '#6366f1',
    })),
    [departments]
  );

  const mappedAgents = useMemo<MappedAgent[]>(() =>
    departmentAgents.map(agent => ({
      name: agent.name,
      image: agent.image || '',
      description: agent.description || '',
      value: agent.value || '',
    })),
    [departmentAgents]
  );

  const selectedDepartment = mappedDepartments.find(d => d.id === selectedDepartmentId);
  const scenario = getScenario(selectedDepartment?.title);
  const isLoading = departmentsLoading || agentsLoading;

  const agentStates = useParallelAgentCycles(mappedAgents.length, scenario, selectedDepartmentId);
  const totalCompletions = agentStates.reduce((sum, s) => sum + s.completions, 0);

  const sharedProps: SharedLayoutProps = {
    agents: mappedAgents,
    departments: mappedDepartments,
    selectedDepartmentId,
    onSelectDepartment: setSelectedDepartmentId,
    selectedDepartment,
    isLoading,
    scenario,
    agentStates,
    totalCompletions,
  };

  switch (layoutVariant) {
    case 'app_frame_list':
      return <AppFrameLayout {...sharedProps} />;
    case 'app_frame_canvas':
      return <AppFrameCanvasLayout {...sharedProps} />;
    case 'app_frame_board':
    default:
      return <AppFrameBoardLayout {...sharedProps} />;
  }
}
