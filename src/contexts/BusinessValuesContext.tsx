import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TrendingUp, Target, Sparkles, Users, Clock, Zap, Link2, Shield } from 'lucide-react';

// Icon name to component mapping
export const iconMap: Record<string, any> = {
  TrendingUp,
  Target,
  Sparkles,
  Users,
  Clock,
  Zap,
  Link2,
  Shield,
};

export type SupportedFeature = 'WM' | 'CRM' | 'Campaigns' | 'Service' | 'Dev' | 'Sidekick' | 'Agents';

export interface BusinessValue {
  id: string;
  iconName: string; // Store icon name as string for serialization
  title: string;
  description: string;
  supportedBy: SupportedFeature[];
  replacesTools?: string[];
}

export type Department = 'marketing' | 'sales' | 'operations' | 'support' | 'product' | 'legal' | 'finance' | 'hr';

// Default values per department (matching App.tsx hardcoded values)
const defaultValues: Record<Department, BusinessValue[]> = {
  marketing: [
    { id: 'mkt-1', iconName: 'TrendingUp', title: 'Drive Demand Generation', description: 'AI-powered campaigns that generate qualified leads and accelerate pipeline growth', supportedBy: ['WM', 'CRM', 'Campaigns', 'Agents'], replacesTools: ['HubSpot Marketing Hub', 'Marketo', 'Pardot'] },
    { id: 'mkt-2', iconName: 'Target', title: 'Faster Campaign Execution', description: 'Launch campaigns 3x faster with AI agents handling routine tasks and optimization', supportedBy: ['WM', 'CRM', 'Campaigns', 'Agents', 'Sidekick'], replacesTools: ['Asana', 'Monday.com Marketing', 'CoSchedule'] },
    { id: 'mkt-3', iconName: 'Sparkles', title: 'Personalized Content at Scale', description: 'Create tailored content for every audience segment with AI-powered generation', supportedBy: ['WM', 'Campaigns', 'Agents', 'Sidekick'], replacesTools: ['Copy.ai', 'Jasper', 'ContentBot'] },
    { id: 'mkt-4', iconName: 'Users', title: 'Unified Customer Journey', description: 'Connect marketing to sales with seamless handoffs and shared context', supportedBy: ['WM', 'CRM'], replacesTools: ['Salesforce', 'HubSpot CRM'] },
    { id: 'mkt-5', iconName: 'Clock', title: 'Real-time Performance Insights', description: 'Make data-driven decisions with AI analyzing campaign metrics instantly', supportedBy: ['WM', 'CRM', 'Campaigns', 'Sidekick'], replacesTools: ['Google Analytics', 'Tableau', 'Looker'] },
  ],
  sales: [
    { id: 'sales-1', iconName: 'TrendingUp', title: 'Accelerate Deal Velocity', description: 'Close deals faster with AI agents managing follow-ups and pipeline updates', supportedBy: ['CRM', 'Agents', 'Sidekick'] },
    { id: 'sales-2', iconName: 'Target', title: 'Increase Win Rates', description: 'AI-powered insights help you focus on the highest-value opportunities', supportedBy: ['CRM', 'Sidekick'] },
    { id: 'sales-3', iconName: 'Users', title: 'Connected Customer Journey', description: 'Seamless handoffs from marketing to sales to support with unified context', supportedBy: ['CRM'] },
    { id: 'sales-4', iconName: 'Sparkles', title: 'Intelligent Lead Scoring', description: 'AI automatically prioritizes leads based on conversion likelihood', supportedBy: ['CRM', 'Agents'] },
    { id: 'sales-5', iconName: 'Clock', title: 'Automated Outreach', description: 'SDR agents handle initial outreach and qualification at scale', supportedBy: ['CRM', 'Agents', 'Sidekick'] },
  ],
  operations: [
    { id: 'ops-1', iconName: 'Zap', title: 'Streamlined Operations', description: 'AI agents automate routine tasks and optimize workflows across teams', supportedBy: ['WM', 'Agents', 'Sidekick'] },
    { id: 'ops-2', iconName: 'Target', title: 'Improved Efficiency', description: 'Reduce operational overhead by 40% with intelligent process automation', supportedBy: ['WM', 'Agents'] },
    { id: 'ops-3', iconName: 'Link2', title: 'Cross-functional Alignment', description: 'Keep all teams in sync with unified workflows and shared context', supportedBy: ['WM'] },
    { id: 'ops-4', iconName: 'TrendingUp', title: 'Data-driven Decisions', description: 'AI analysts surface insights from operational data in real-time', supportedBy: ['WM', 'Agents', 'Sidekick'] },
    { id: 'ops-5', iconName: 'Shield', title: 'Risk Mitigation', description: 'Proactively identify and resolve bottlenecks before they impact delivery', supportedBy: ['WM', 'Agents'] },
  ],
  support: [
    { id: 'sup-1', iconName: 'Users', title: 'Exceptional Service at Scale', description: 'AI agents handle tier-1 support, letting your team focus on complex issues', supportedBy: ['Service', 'Agents'] },
    { id: 'sup-2', iconName: 'Clock', title: 'Faster Resolution Times', description: 'Reduce ticket resolution time by 60% with intelligent routing and automation', supportedBy: ['Service', 'Agents', 'Sidekick'] },
    { id: 'sup-3', iconName: 'Sparkles', title: 'Proactive Support', description: 'AI predicts and prevents issues before customers even report them', supportedBy: ['Service', 'Agents'] },
    { id: 'sup-4', iconName: 'Target', title: 'Higher CSAT Scores', description: 'Deliver personalized support experiences that delight customers', supportedBy: ['Service', 'Sidekick'] },
    { id: 'sup-5', iconName: 'Link2', title: 'Unified Customer Context', description: 'Every agent has complete customer history and context instantly', supportedBy: ['Service'] },
  ],
  product: [
    { id: 'prod-1', iconName: 'Zap', title: 'Faster Time to Market', description: 'Ship features 2x faster with AI-powered development workflows', supportedBy: ['Dev', 'WM', 'Agents', 'Sidekick'] },
    { id: 'prod-2', iconName: 'Sparkles', title: 'Build Anything', description: 'AI agents help you create custom tools and integrations without limits', supportedBy: ['Dev', 'WM', 'Agents'] },
    { id: 'prod-3', iconName: 'Target', title: 'Better Code Quality', description: 'AI code reviewers catch bugs and suggest improvements automatically', supportedBy: ['Dev', 'Agents'] },
    { id: 'prod-4', iconName: 'Link2', title: 'Seamless Collaboration', description: 'Align product, design, and engineering with unified workflows', supportedBy: ['Dev', 'WM', 'Sidekick'] },
    { id: 'prod-5', iconName: 'TrendingUp', title: 'Data-driven Roadmaps', description: 'AI analyzes user feedback and metrics to prioritize features', supportedBy: ['Dev', 'WM', 'Sidekick'] },
  ],
  legal: [
    { id: 'legal-1', iconName: 'Shield', title: 'Ensure Compliance', description: 'AI monitors contracts and documents for compliance issues automatically', supportedBy: ['WM', 'Agents'] },
    { id: 'legal-2', iconName: 'Clock', title: 'Faster Contract Review', description: 'Review and approve contracts 5x faster with AI-powered analysis', supportedBy: ['WM', 'Agents', 'Sidekick'] },
    { id: 'legal-3', iconName: 'Target', title: 'Risk Management', description: 'Identify potential legal risks before they become problems', supportedBy: ['WM', 'Agents'] },
    { id: 'legal-4', iconName: 'Link2', title: 'Cross-team Visibility', description: 'Keep legal connected to all business units with unified workflows', supportedBy: ['WM'] },
    { id: 'legal-5', iconName: 'Sparkles', title: 'Intelligent Document Search', description: 'Find any clause or precedent instantly with AI-powered search', supportedBy: ['WM', 'Sidekick'] },
  ],
  finance: [
    { id: 'fin-1', iconName: 'TrendingUp', title: 'Financial Accuracy', description: 'AI eliminates manual errors in budgeting and financial reporting', supportedBy: ['WM', 'Agents'] },
    { id: 'fin-2', iconName: 'Clock', title: 'Faster Close Cycles', description: 'Close books 50% faster with automated reconciliation and reporting', supportedBy: ['WM', 'Agents', 'Sidekick'] },
    { id: 'fin-3', iconName: 'Target', title: 'Budget Optimization', description: 'AI analyzes spending patterns and suggests optimization opportunities', supportedBy: ['WM', 'Sidekick'] },
    { id: 'fin-4', iconName: 'Link2', title: 'Real-time Visibility', description: 'Give stakeholders instant access to financial metrics and forecasts', supportedBy: ['WM', 'Sidekick'] },
    { id: 'fin-5', iconName: 'Shield', title: 'Fraud Detection', description: 'AI monitors transactions and flags anomalies for review', supportedBy: ['WM', 'Agents'] },
  ],
  hr: [
    { id: 'hr-1', iconName: 'Users', title: 'Better Candidate Experience', description: 'AI agents provide personalized communication throughout the hiring process', supportedBy: ['WM', 'Agents', 'Sidekick'] },
    { id: 'hr-2', iconName: 'Clock', title: 'Faster Hiring', description: 'Reduce time-to-hire by 40% with AI-powered screening and scheduling', supportedBy: ['WM', 'Agents'] },
    { id: 'hr-3', iconName: 'Sparkles', title: 'Seamless Onboarding', description: 'AI agents guide new hires through onboarding, answering questions 24/7', supportedBy: ['WM', 'Agents', 'Sidekick'] },
    { id: 'hr-4', iconName: 'Target', title: 'Employee Engagement', description: 'Proactively identify and address employee satisfaction issues', supportedBy: ['WM', 'Sidekick'] },
    { id: 'hr-5', iconName: 'Link2', title: 'Lifecycle Management', description: 'Manage the entire employee journey from hire to retire in one platform', supportedBy: ['WM'] },
  ],
};

interface BusinessValuesContextType {
  values: Record<Department, BusinessValue[]>;
  getValuesForDepartment: (department: Department) => BusinessValue[];
  updateValue: (department: Department, value: BusinessValue) => void;
  addValue: (department: Department, value: Omit<BusinessValue, 'id'>) => void;
  deleteValue: (department: Department, valueId: string) => void;
  reorderValues: (department: Department, values: BusinessValue[]) => void;
  resetToDefault: (department: Department) => void;
  resetAllToDefault: () => void;
}

const BusinessValuesContext = createContext<BusinessValuesContextType | undefined>(undefined);

const STORAGE_KEY = 'business-values';

export function BusinessValuesProvider({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<Record<Department, BusinessValue[]>>(defaultValues);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all departments exist
        setValues({ ...defaultValues, ...parsed });
      }
    } catch (error) {
      console.error('Error loading business values from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever values change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch (error) {
      console.error('Error saving business values to localStorage:', error);
    }
  }, [values]);

  const getValuesForDepartment = (department: Department): BusinessValue[] => {
    return values[department] || [];
  };

  const updateValue = (department: Department, updatedValue: BusinessValue) => {
    setValues(prev => ({
      ...prev,
      [department]: prev[department].map(v => 
        v.id === updatedValue.id ? updatedValue : v
      ),
    }));
  };

  const addValue = (department: Department, value: Omit<BusinessValue, 'id'>) => {
    const newValue: BusinessValue = {
      ...value,
      id: `${department}-${Date.now()}`,
    };
    setValues(prev => ({
      ...prev,
      [department]: [...prev[department], newValue],
    }));
  };

  const deleteValue = (department: Department, valueId: string) => {
    setValues(prev => ({
      ...prev,
      [department]: prev[department].filter(v => v.id !== valueId),
    }));
  };

  const reorderValues = (department: Department, newOrder: BusinessValue[]) => {
    setValues(prev => ({
      ...prev,
      [department]: newOrder,
    }));
  };

  const resetToDefault = (department: Department) => {
    setValues(prev => ({
      ...prev,
      [department]: defaultValues[department],
    }));
  };

  const resetAllToDefault = () => {
    setValues(defaultValues);
  };

  return (
    <BusinessValuesContext.Provider
      value={{
        values,
        getValuesForDepartment,
        updateValue,
        addValue,
        deleteValue,
        reorderValues,
        resetToDefault,
        resetAllToDefault,
      }}
    >
      {children}
    </BusinessValuesContext.Provider>
  );
}

export function useBusinessValues() {
  const context = useContext(BusinessValuesContext);
  if (context === undefined) {
    throw new Error('useBusinessValues must be used within a BusinessValuesProvider');
  }
  return context;
}

// Helper to get icon component from name
export function getIconComponent(iconName: string) {
  return iconMap[iconName] || TrendingUp;
}
