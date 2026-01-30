import type { Department } from '@/app/types';

export interface AdditionalProduct {
  id: string;
  name: 'Work Management' | 'CRM' | 'Service' | 'Dev';
  description: string;
  value: string;
}

export interface UseCase {
  id: string;
  name: string;
  description: string;
  value: string;
}

export const useCasesByDepartment: Record<Department, UseCase[]> = {
  marketing: [
    {
      id: 'campaign-management',
      name: 'Campaign management',
      description: 'Plan, execute, and track multi-channel marketing campaigns',
      value: 'Centralize campaign planning and execution'
    },
    {
      id: 'creative-production',
      name: 'Creative production',
      description: 'Manage creative workflows from brief to final delivery',
      value: 'Streamline creative production processes'
    },
    {
      id: 'marketing-requests',
      name: 'Marketing requests',
      description: 'Centralize and prioritize marketing requests across teams',
      value: 'Handle all marketing requests in one place'
    },
    {
      id: 'content-calendar',
      name: 'Content calendar',
      description: 'Plan and schedule content across all channels',
      value: 'Organize content strategy and publishing'
    },
    {
      id: 'performance-tracking',
      name: 'Performance tracking',
      description: 'Monitor campaign performance and marketing metrics',
      value: 'Track and optimize marketing ROI'
    },
    {
      id: 'digital-assets',
      name: 'Digital assets management',
      description: 'Store and organize brand assets and creative files',
      value: 'Centralized digital asset library'
    }
  ],
  sales: [
    {
      id: 'risk-analysis',
      name: 'Risk Analysis',
      description: 'Identify and mitigate deal risks proactively',
      value: 'Reduce deal slippage with risk insights'
    },
    {
      id: 'deal-management',
      name: 'Deal management',
      description: 'Track deals through your sales pipeline',
      value: 'Manage deals from lead to close'
    },
    {
      id: 'call-tracking',
      name: 'Automatic call & activity tracking',
      description: 'Auto-log calls, emails, and customer interactions',
      value: 'Never manually log activities again'
    },
    {
      id: 'lead-qualification',
      name: 'Lead generation & qualification',
      description: 'Capture and qualify leads automatically',
      value: 'Focus on high-quality opportunities'
    },
    {
      id: 'pipeline-forecasting',
      name: 'Pipeline forecasting',
      description: 'Predict revenue with AI-powered forecasting',
      value: 'Accurate revenue predictions'
    },
    {
      id: 'account-management',
      name: 'Account management',
      description: 'Manage customer relationships and renewals',
      value: 'Maximize customer lifetime value'
    }
  ],
  operations: [
    {
      id: 'portfolio-planning',
      name: 'Portfolio planning',
      description: 'Prioritize and plan strategic initiatives',
      value: 'Align execution with strategy'
    },
    {
      id: 'program-management',
      name: 'Program management',
      description: 'Coordinate complex cross-functional programs',
      value: 'Deliver programs on time and budget'
    },
    {
      id: 'risk-tracking',
      name: 'Risk tracking',
      description: 'Monitor and mitigate project risks',
      value: 'Prevent issues before they escalate'
    },
    {
      id: 'project-intake',
      name: 'Project intake',
      description: 'Standardize how work enters your organization',
      value: 'Consistent project initiation process'
    },
    {
      id: 'resource-capacity',
      name: 'Resource capacity',
      description: 'Optimize team allocation and workload',
      value: 'Maximize team utilization'
    },
    {
      id: 'executive-dashboards',
      name: 'Executive dashboards',
      description: 'Real-time visibility into portfolio health',
      value: 'Data-driven strategic decisions'
    }
  ],
  support: [
    {
      id: 'ticket-triage',
      name: 'Ticket triage & routing',
      description: 'Auto-categorize and route support tickets',
      value: 'Faster ticket resolution'
    },
    {
      id: 'sla-tracking',
      name: 'SLA tracking & at risk',
      description: 'Monitor SLAs and prevent breaches',
      value: 'Meet service level commitments'
    },
    {
      id: 'centralize-requests',
      name: 'Centralize requests',
      description: 'Unify requests from email, chat, and portals',
      value: 'Single source for all requests'
    },
    {
      id: 'escalation-workflow',
      name: 'Escalation workflow automation',
      description: 'Auto-escalate critical issues',
      value: 'Prevent customer dissatisfaction'
    },
    {
      id: 'service-dashboards',
      name: 'Service performance dashboards',
      description: 'Track team performance and CSAT',
      value: 'Improve service quality'
    },
    {
      id: 'service-portals',
      name: 'Service portals',
      description: 'Self-service portals for customers',
      value: 'Reduce support volume'
    }
  ],
  product: [
    {
      id: 'roadmap-planning',
      name: 'Roadmap planning',
      description: 'Build and communicate product roadmaps',
      value: 'Align teams around product strategy'
    },
    {
      id: 'sprint-execution',
      name: 'Sprint execution',
      description: 'Plan and track development sprints',
      value: 'Ship faster with agile workflows'
    },
    {
      id: 'feature-requests',
      name: 'Feature requests',
      description: 'Collect and prioritize feature ideas',
      value: 'Build what customers want'
    },
    {
      id: 'bug-triage',
      name: 'Bug triage',
      description: 'Track and prioritize bug fixes',
      value: 'Improve product quality'
    },
    {
      id: 'release-management',
      name: 'Release management',
      description: 'Coordinate product releases',
      value: 'Ship with confidence'
    },
    {
      id: 'incident-management',
      name: 'Incident management',
      description: 'Respond to and resolve incidents',
      value: 'Minimize downtime impact'
    }
  ],
  legal: [
    {
      id: 'contract-lifecycle',
      name: 'Contract lifecycle management',
      description: 'Manage contracts from draft to renewal',
      value: 'Streamline contract processes'
    },
    {
      id: 'legal-requests',
      name: 'Legal requests',
      description: 'Centralize legal requests from the business',
      value: 'Prioritize legal work effectively'
    },
    {
      id: 'matter-tracking',
      name: 'Matter tracking',
      description: 'Track legal matters and cases',
      value: 'Stay on top of all legal work'
    },
    {
      id: 'compliance-tracking',
      name: 'Compliance tracking',
      description: 'Monitor compliance requirements',
      value: 'Reduce compliance risk'
    },
    {
      id: 'document-repository',
      name: 'Document repository',
      description: 'Centralized legal document storage',
      value: 'Find legal docs instantly'
    },
    {
      id: 'approval-workflows',
      name: 'Approval workflows',
      description: 'Standardized approval processes',
      value: 'Faster legal approvals'
    }
  ],
  finance: [
    {
      id: 'budget-management',
      name: 'Budget management',
      description: 'Plan and track departmental budgets',
      value: 'Stay within budget'
    },
    {
      id: 'expense-management',
      name: 'Expense management',
      description: 'Submit and approve expenses',
      value: 'Faster expense processing'
    },
    {
      id: 'financial-close',
      name: 'Financial close',
      description: 'Coordinate month-end and year-end close',
      value: 'Close books faster'
    },
    {
      id: 'procurement',
      name: 'Procurement',
      description: 'Manage purchase requests and POs',
      value: 'Streamline procurement'
    },
    {
      id: 'audit-management',
      name: 'Audit management',
      description: 'Coordinate audit requests and responses',
      value: 'Reduce audit stress'
    },
    {
      id: 'financial-reporting',
      name: 'Financial reporting',
      description: 'Generate financial reports and dashboards',
      value: 'Real-time financial insights'
    }
  ],
  hr: [
    {
      id: 'recruiting',
      name: 'Recruiting',
      description: 'Track candidates through hiring pipeline',
      value: 'Hire faster and better'
    },
    {
      id: 'onboarding-offboarding',
      name: 'Onboarding & offboarding employee',
      description: 'Coordinate employee transitions',
      value: 'Seamless employee experience'
    },
    {
      id: 'hr-requests',
      name: 'HR requests & approvals',
      description: 'Handle time-off, benefits, and other requests',
      value: 'Centralized HR service delivery'
    },
    {
      id: 'performance-review',
      name: 'Performance review',
      description: 'Manage performance review cycles',
      value: 'Continuous performance management'
    },
    {
      id: 'hr-dashboards',
      name: 'HR dashboards',
      description: 'Track headcount, attrition, and other metrics',
      value: 'Data-driven HR decisions'
    },
    {
      id: 'employee-directory',
      name: 'Employee directory',
      description: 'Centralized employee information',
      value: 'Find anyone, anytime'
    }
  ]
};

// Product-specific use cases mapping: Department -> Product -> Use Case IDs
export const productUseCasesMapping: Record<Department, Record<string, string[]>> = {
  marketing: {
    'Work Management': ['campaign-management', 'creative-production', 'content-calendar', 'performance-tracking'],
    'CRM': ['campaign-management', 'performance-tracking'],
    'Service': ['marketing-requests', 'creative-production'],
    'Dev': ['digital-assets', 'performance-tracking']
  },
  sales: {
    'Work Management': ['deal-management', 'account-management'],
    'CRM': ['risk-analysis', 'deal-management', 'call-tracking', 'lead-qualification', 'pipeline-forecasting', 'account-management'],
    'Service': ['account-management'],
    'Dev': ['call-tracking', 'pipeline-forecasting']
  },
  operations: {
    'Work Management': ['portfolio-planning', 'program-management', 'project-intake', 'resource-capacity', 'executive-dashboards'],
    'CRM': ['risk-tracking'],
    'Service': ['project-intake', 'resource-capacity'],
    'Dev': ['executive-dashboards']
  },
  support: {
    'Work Management': ['service-dashboards'],
    'CRM': ['centralize-requests'],
    'Service': ['ticket-triage', 'sla-tracking', 'centralize-requests', 'escalation-workflow', 'service-dashboards', 'service-portals'],
    'Dev': ['ticket-triage', 'service-portals']
  },
  product: {
    'Work Management': ['roadmap-planning', 'feature-requests', 'release-management'],
    'CRM': ['feature-requests'],
    'Service': ['feature-requests', 'bug-triage'],
    'Dev': ['roadmap-planning', 'sprint-execution', 'bug-triage', 'release-management', 'incident-management']
  },
  legal: {
    'Work Management': ['matter-tracking', 'approval-workflows'],
    'CRM': ['contract-lifecycle'],
    'Service': ['legal-requests', 'approval-workflows'],
    'Dev': ['document-repository', 'compliance-tracking']
  },
  finance: {
    'Work Management': ['budget-management', 'financial-close', 'audit-management'],
    'CRM': ['procurement'],
    'Service': ['expense-management', 'procurement'],
    'Dev': ['financial-reporting', 'audit-management']
  },
  hr: {
    'Work Management': ['performance-review', 'hr-dashboards'],
    'CRM': ['recruiting'],
    'Service': ['onboarding-offboarding', 'hr-requests'],
    'Dev': ['employee-directory', 'hr-dashboards']
  }
};

export const additionalProductsByDepartment: Record<Department, AdditionalProduct[]> = {
  marketing: [
    {
      id: 'add-wm-marketing',
      name: 'Work Management',
      description: 'Add monday Work Management for marketing projects',
      value: 'Coordinate marketing campaigns and initiatives'
    },
    {
      id: 'add-crm-marketing',
      name: 'CRM',
      description: 'Add monday CRM to manage leads and customer relationships',
      value: 'Align marketing and sales with unified customer data'
    },
    {
      id: 'add-service-marketing',
      name: 'Service',
      description: 'Add monday Service to handle marketing requests',
      value: 'Streamline marketing service delivery'
    },
    {
      id: 'add-dev-marketing',
      name: 'Dev',
      description: 'Add monday Dev for marketing tech projects',
      value: 'Coordinate marketing technology initiatives'
    }
  ],
  sales: [
    {
      id: 'add-wm-sales',
      name: 'Work Management',
      description: 'Add monday Work Management for sales operations',
      value: 'Coordinate sales projects and initiatives'
    },
    {
      id: 'add-service-sales',
      name: 'Service',
      description: 'Add monday Service for sales support',
      value: 'Improve post-sales customer experience'
    },
    {
      id: 'add-dev-sales',
      name: 'Dev',
      description: 'Add monday Dev for sales tools and integrations',
      value: 'Build custom sales solutions'
    }
  ],
  operations: [
    {
      id: 'add-crm-ops',
      name: 'CRM',
      description: 'Add monday CRM for vendor relationships',
      value: 'Manage vendor and partner relationships'
    },
    {
      id: 'add-service-ops',
      name: 'Service',
      description: 'Add monday Service for internal requests',
      value: 'Centralize internal service delivery'
    }
  ],
  support: [
    {
      id: 'add-wm-support',
      name: 'Work Management',
      description: 'Add monday Work Management for support projects',
      value: 'Coordinate support initiatives and improvements'
    },
    {
      id: 'add-crm-support',
      name: 'CRM',
      description: 'Add monday CRM for customer relationships',
      value: 'Unified view of customer interactions'
    },
    {
      id: 'add-dev-support',
      name: 'Dev',
      description: 'Add monday Dev for support tools',
      value: 'Build custom support solutions'
    }
  ],
  product: [
    {
      id: 'add-wm-product',
      name: 'Work Management',
      description: 'Add monday Work Management for product initiatives',
      value: 'Coordinate cross-functional product work'
    },
    {
      id: 'add-crm-product',
      name: 'CRM',
      description: 'Add monday CRM for customer feedback',
      value: 'Connect product to customer insights'
    },
    {
      id: 'add-service-product',
      name: 'Service',
      description: 'Add monday Service for feature requests',
      value: 'Streamline feature request intake'
    }
  ],
  legal: [
    {
      id: 'add-wm-legal',
      name: 'Work Management',
      description: 'Add monday Work Management for legal projects',
      value: 'Coordinate legal initiatives and projects'
    },
    {
      id: 'add-crm-legal',
      name: 'CRM',
      description: 'Add monday CRM for outside counsel management',
      value: 'Manage relationships with external counsel'
    },
    {
      id: 'add-service-legal',
      name: 'Service',
      description: 'Add monday Service for legal requests',
      value: 'Centralize legal service delivery'
    }
  ],
  finance: [
    {
      id: 'add-wm-finance',
      name: 'Work Management',
      description: 'Add monday Work Management for finance projects',
      value: 'Coordinate financial initiatives'
    },
    {
      id: 'add-crm-finance',
      name: 'CRM',
      description: 'Add monday CRM for vendor relationships',
      value: 'Manage vendor and supplier relationships'
    },
    {
      id: 'add-service-finance',
      name: 'Service',
      description: 'Add monday Service for finance requests',
      value: 'Streamline finance service delivery'
    }
  ],
  hr: [
    {
      id: 'add-wm-hr',
      name: 'Work Management',
      description: 'Add monday Work Management for HR projects',
      value: 'Coordinate HR initiatives and programs'
    },
    {
      id: 'add-crm-hr',
      name: 'CRM',
      description: 'Add monday CRM for candidate relationships',
      value: 'Enhance recruiting with CRM capabilities'
    },
    {
      id: 'add-dev-hr',
      name: 'Dev',
      description: 'Add monday Dev for HR tools',
      value: 'Build custom HR solutions'
    }
  ]
};