import type { Department } from '@/app/types';

// Import Vibe app images
import socialMediaCalendarImage from '@/assets/5c1e9558f0852bdc2f86cf1e2165d47ef6a97194.png';
import customerSegmentationImage from '@/assets/bc17ecea9b6a3dea74c123dfa6a80072df0aa8f0.png';

export interface AdditionalAgent {
  id: string;
  name: string;
  description: string;
  value: string;
  image?: string;
}

export interface AdditionalVibeApp {
  id: string;
  name: string;
  value: string;
  replacesTools: string[];
  image?: string;
}

export interface AdditionalSidekickAction {
  id: string;
  name: string;
  description: string;
  value: string;
}

export const additionalAgentsByDepartment: Record<Department, AdditionalAgent[]> = {
  marketing: [
    {
      id: 'translator',
      name: 'Translator',
      description: 'Translates marketing content across multiple languages while maintaining brand voice and cultural nuances',
      value: 'Expand to global markets 10x faster with AI-powered localization'
    },
    {
      id: 'market-researcher',
      name: 'Market Researcher',
      description: 'Analyzes market trends, competitor activity, and customer insights',
      value: 'Stay ahead of the competition with AI-powered market intelligence'
    },
    {
      id: 'seo-optimizer',
      name: 'SEO Optimizer',
      description: 'Optimizes content for search engines and tracks keyword performance',
      value: 'Increase organic traffic by 50% with intelligent SEO recommendations'
    },
    {
      id: 'social-media-manager',
      name: 'Social Media Manager',
      description: 'Schedules posts, analyzes engagement, and suggests optimal posting times',
      value: 'Boost social engagement with AI that knows when and what to post'
    },
    {
      id: 'email-optimizer',
      name: 'Email Optimizer',
      description: 'A/B tests subject lines, optimizes send times, and personalizes content',
      value: 'Increase email open rates by 35% with smart optimization'
    }
  ],
  sales: [
    {
      id: 'negotiation-assistant',
      name: 'Negotiation Assistant',
      description: 'Provides real-time negotiation strategies and pricing recommendations',
      value: 'Close better deals with AI-powered negotiation insights'
    },
    {
      id: 'sales-forecaster',
      name: 'Sales Forecaster',
      description: 'Predicts deal outcomes and revenue forecasts based on historical data',
      value: 'Achieve 90% forecast accuracy with predictive AI'
    },
    {
      id: 'account-manager',
      name: 'Account Manager',
      description: 'Monitors account health, identifies upsell opportunities, and prevents churn',
      value: 'Increase account retention by 25% with proactive AI monitoring'
    },
    {
      id: 'competitor-tracker',
      name: 'Competitor Tracker',
      description: 'Monitors competitor pricing, features, and market positioning',
      value: 'Win more deals with real-time competitive intelligence'
    }
  ],
  operations: [
    {
      id: 'capacity-planner',
      name: 'Capacity Planner',
      description: 'Optimizes resource allocation and predicts capacity needs',
      value: 'Maximize team utilization with intelligent capacity planning'
    },
    {
      id: 'risk-detector',
      name: 'Risk Detector',
      description: 'Identifies project risks and suggests mitigation strategies',
      value: 'Prevent project delays with proactive risk detection'
    },
    {
      id: 'workflow-designer',
      name: 'Workflow Designer',
      description: 'Creates and optimizes automated workflows based on best practices',
      value: 'Build better processes with AI-recommended workflow templates'
    },
    {
      id: 'vendor-manager',
      name: 'Vendor Manager',
      description: 'Manages vendor relationships, contracts, and performance',
      value: 'Optimize vendor spend and improve service quality'
    }
  ],
  support: [
    {
      id: 'sentiment-analyzer',
      name: 'Sentiment Analyzer',
      description: 'Analyzes customer sentiment and escalates negative experiences',
      value: 'Prevent customer churn with real-time sentiment monitoring'
    },
    {
      id: 'knowledge-curator',
      name: 'Knowledge Curator',
      description: 'Maintains and updates knowledge base articles automatically',
      value: 'Reduce support volume by 40% with always-updated documentation'
    },
    {
      id: 'escalation-manager',
      name: 'Escalation Manager',
      description: 'Intelligently routes complex issues to the right specialists',
      value: 'Resolve critical issues faster with smart escalation routing'
    },
    {
      id: 'feedback-analyzer',
      name: 'Feedback Analyzer',
      description: 'Aggregates customer feedback and identifies trends',
      value: 'Turn customer feedback into actionable product improvements'
    }
  ],
  product: [
    {
      id: 'feature-prioritizer',
      name: 'Feature Prioritizer',
      description: 'Analyzes user feedback and usage data to recommend feature priorities',
      value: 'Build what matters most with data-driven prioritization'
    },
    {
      id: 'bug-triager',
      name: 'Bug Triager',
      description: 'Automatically categorizes, prioritizes, and assigns bugs',
      value: 'Reduce bug resolution time by 50% with intelligent triage'
    },
    {
      id: 'release-coordinator',
      name: 'Release Coordinator',
      description: 'Manages release schedules, dependencies, and rollout strategies',
      value: 'Ship releases with confidence and zero surprises'
    },
    {
      id: 'documentation-writer',
      name: 'Documentation Writer',
      description: 'Generates technical documentation from code and requirements',
      value: 'Keep docs in sync with code automatically'
    }
  ],
  legal: [
    {
      id: 'clause-library',
      name: 'Clause Library Manager',
      description: 'Maintains a library of approved clauses and suggests alternatives',
      value: 'Draft contracts 10x faster with approved clause templates'
    },
    {
      id: 'obligation-tracker',
      name: 'Obligation Tracker',
      description: 'Tracks contractual obligations and sends renewal reminders',
      value: 'Never miss a contract deadline or obligation'
    },
    {
      id: 'regulatory-monitor',
      name: 'Regulatory Monitor',
      description: 'Monitors regulatory changes and assesses impact on business',
      value: 'Stay compliant with automated regulatory tracking'
    },
    {
      id: 'redline-analyzer',
      name: 'Redline Analyzer',
      description: 'Analyzes contract changes and highlights risky modifications',
      value: 'Review contract changes 5x faster with AI analysis'
    }
  ],
  finance: [
    {
      id: 'cash-flow-forecaster',
      name: 'Cash Flow Forecaster',
      description: 'Predicts cash flow and identifies potential shortfalls',
      value: 'Optimize working capital with accurate cash flow predictions'
    },
    {
      id: 'expense-auditor',
      name: 'Expense Auditor',
      description: 'Reviews expense reports and flags policy violations',
      value: 'Reduce expense fraud and improve compliance'
    },
    {
      id: 'financial-reporter',
      name: 'Financial Reporter',
      description: 'Generates financial reports and variance analyses automatically',
      value: 'Close books in days, not weeks, with automated reporting'
    },
    {
      id: 'ap-automator',
      name: 'AP Automator',
      description: 'Automates accounts payable workflows and payment scheduling',
      value: 'Process invoices 80% faster with intelligent automation'
    }
  ],
  hr: [
    {
      id: 'skills-mapper',
      name: 'Skills Mapper',
      description: 'Maps employee skills and identifies training opportunities',
      value: 'Build a future-ready workforce with skills gap analysis'
    },
    {
      id: 'performance-coach',
      name: 'Performance Coach',
      description: 'Provides personalized performance improvement suggestions',
      value: 'Improve team performance with AI-powered coaching'
    },
    {
      id: 'retention-predictor',
      name: 'Retention Predictor',
      description: 'Identifies flight-risk employees and suggests retention strategies',
      value: 'Reduce turnover by 30% with proactive retention'
    },
    {
      id: 'benefits-advisor',
      name: 'Benefits Advisor',
      description: 'Helps employees understand and optimize their benefits',
      value: 'Increase benefits utilization and employee satisfaction'
    }
  ]
};

export const additionalVibeAppsByDepartment: Record<Department, AdditionalVibeApp[]> = {
  marketing: [
    {
      id: 'social-media-calendar',
      name: 'Social media calendar',
      value: 'Schedule and post content across social media platforms',
      replacesTools: ['Hootsuite', 'Buffer', 'Sprout Social'],
      image: socialMediaCalendarImage
    },
    {
      id: 'customer-segmentation-app',
      name: 'Customer segmentation app',
      value: 'Segment and target customers effectively',
      replacesTools: ['HubSpot Marketing Hub', 'Marketo', 'Pardot'],
      image: customerSegmentationImage
    },
    {
      id: 'email-marketing-automation',
      name: 'Email Marketing Automation',
      value: 'Automate email campaigns and nurture leads',
      replacesTools: ['HubSpot Marketing Hub', 'Marketo', 'Pardot']
    },
    {
      id: 'content-calendar-management',
      name: 'Content Calendar Management',
      value: 'Organize and schedule content for all channels',
      replacesTools: ['CoSchedule', 'Trello', 'Asana']
    },
    {
      id: 'performance-analytics',
      name: 'Performance Analytics',
      value: 'Track campaign ROI and attribution across all channels',
      replacesTools: ['Google Analytics', 'Mixpanel', 'Amplitude']
    },
    {
      id: 'content-generator',
      name: 'Content Generator',
      value: 'Generate blog posts, social content, and ad copy at scale',
      replacesTools: ['Copy.ai', 'Jasper', 'Writesonic']
    },
    {
      id: 'lead-nurturing',
      name: 'Lead Nurturing',
      value: 'Automate multi-touch lead nurturing campaigns',
      replacesTools: ['HubSpot', 'Pardot', 'Marketo']
    },
    {
      id: 'ab-testing',
      name: 'A/B Testing Platform',
      value: 'Test and optimize landing pages and campaigns',
      replacesTools: ['Optimizely', 'VWO', 'Google Optimize']
    }
  ],
  sales: [
    {
      id: 'lead-scoring',
      name: 'Lead Scoring',
      value: 'Automatically prioritize leads based on conversion likelihood',
      replacesTools: ['Salesforce Pardot', 'HubSpot CRM', 'Drift']
    },
    {
      id: 'sales-pipeline-management',
      name: 'Sales Pipeline Management',
      value: 'Track and manage the sales pipeline efficiently',
      replacesTools: ['Salesforce', 'Pipedrive', 'Close']
    },
    {
      id: 'customer-interaction-tracking',
      name: 'Customer Interaction Tracking',
      value: 'Capture and analyze customer interactions',
      replacesTools: ['Gong', 'Chorus', 'Salesforce']
    },
    {
      id: 'sales-forecasting',
      name: 'Sales Forecasting',
      value: 'Predict revenue and track forecast accuracy',
      replacesTools: ['Clari', 'Gong', 'InsightSquared']
    },
    {
      id: 'proposal-generator',
      name: 'Proposal Generator',
      value: 'Create customized sales proposals automatically',
      replacesTools: ['PandaDoc', 'Proposify', 'Qwilr']
    },
    {
      id: 'deal-room',
      name: 'Deal Room',
      value: 'Collaborate with prospects in a branded deal space',
      replacesTools: ['DocSend', 'Paperflite', 'Highspot']
    },
    {
      id: 'competitor-intel',
      name: 'Competitor Intelligence',
      value: 'Track competitor mentions and win/loss insights',
      replacesTools: ['Klue', 'Crayon', 'Kompyte']
    }
  ],
  operations: [
    {
      id: 'project-management',
      name: 'Project Management',
      value: 'Plan, track, and manage projects efficiently',
      replacesTools: ['Asana', 'Trello', 'Basecamp']
    },
    {
      id: 'workflow-automation',
      name: 'Workflow Automation',
      value: 'Automate repetitive tasks and workflows',
      replacesTools: ['Zapier', 'Make', 'IFTTT']
    },
    {
      id: 'operational-insights',
      name: 'Operational Insights',
      value: 'Analyze and visualize operational data',
      replacesTools: ['Tableau', 'Looker', 'Power BI']
    },
    {
      id: 'resource-planning',
      name: 'Resource Planning',
      value: 'Optimize team allocation across projects',
      replacesTools: ['Forecast', 'Float', 'Resource Guru']
    },
    {
      id: 'workflow-optimizer',
      name: 'Workflow Optimizer',
      value: 'Identify and eliminate process bottlenecks',
      replacesTools: ['Process Street', 'Tallyfy', 'Kissflow']
    },
    {
      id: 'vendor-portal',
      name: 'Vendor Portal',
      value: 'Manage vendor contracts and performance',
      replacesTools: ['Coupa', 'SAP Ariba', 'Ivalua']
    },
    {
      id: 'capacity-dashboard',
      name: 'Capacity Dashboard',
      value: 'Monitor team capacity and utilization in real-time',
      replacesTools: ['Teamwork', 'Smartsheet', 'Wrike']
    }
  ],
  support: [
    {
      id: 'ticket-management',
      name: 'Ticket Management',
      value: 'Track and manage customer support tickets',
      replacesTools: ['Zendesk', 'Freshdesk', 'Salesforce Service Cloud']
    },
    {
      id: 'customer-support-automation',
      name: 'Customer Support Automation',
      value: 'Automate routine support tasks',
      replacesTools: ['Zendesk', 'Freshdesk', 'Salesforce Service Cloud']
    },
    {
      id: 'proactive-support',
      name: 'Proactive Support',
      value: 'Predict and prevent issues before customers report them',
      replacesTools: ['Zendesk', 'Freshdesk', 'Salesforce Service Cloud']
    },
    {
      id: 'knowledge-base',
      name: 'Knowledge Base',
      value: 'Build and maintain a searchable help center',
      replacesTools: ['Zendesk Guide', 'Help Scout', 'Intercom Articles']
    },
    {
      id: 'chatbot-builder',
      name: 'Chatbot Builder',
      value: 'Create AI chatbots for instant customer support',
      replacesTools: ['Intercom', 'Drift', 'Ada']
    },
    {
      id: 'feedback-collector',
      name: 'Feedback Collector',
      value: 'Gather and analyze customer feedback automatically',
      replacesTools: ['Qualtrics', 'SurveyMonkey', 'Typeform']
    },
    {
      id: 'sla-tracker',
      name: 'SLA Tracker',
      value: 'Monitor and enforce service level agreements',
      replacesTools: ['Zendesk', 'Freshdesk', 'Help Scout']
    }
  ],
  product: [
    {
      id: 'code-review-automation',
      name: 'Code Review Automation',
      value: 'Automate code reviews and catch bugs',
      replacesTools: ['GitHub Actions', 'Jenkins', 'GitLab CI/CD']
    },
    {
      id: 'sprint-management',
      name: 'Sprint Management',
      value: 'Plan and track sprints efficiently',
      replacesTools: ['Jira', 'Trello', 'Monday.com']
    },
    {
      id: 'product-development-tools',
      name: 'Product Development Tools',
      value: 'Create custom tools and integrations',
      replacesTools: ['GitHub Actions', 'Jenkins', 'GitLab CI/CD']
    },
    {
      id: 'feature-voting',
      name: 'Feature Voting',
      value: 'Collect and prioritize feature requests from users',
      replacesTools: ['ProductBoard', 'Canny', 'UserVoice']
    },
    {
      id: 'roadmap-planner',
      name: 'Roadmap Planner',
      value: 'Create and share visual product roadmaps',
      replacesTools: ['Aha!', 'ProductPlan', 'Roadmunk']
    },
    {
      id: 'user-analytics',
      name: 'User Analytics',
      value: 'Track product usage and user behavior',
      replacesTools: ['Amplitude', 'Mixpanel', 'Heap']
    },
    {
      id: 'release-notes',
      name: 'Release Notes',
      value: 'Generate and publish release notes automatically',
      replacesTools: ['LaunchNotes', 'Beamer', 'AnnounceKit']
    }
  ],
  legal: [
    {
      id: 'contract-management',
      name: 'Contract Management',
      value: 'Manage and track legal contracts',
      replacesTools: ['DocuSign', 'Adobe Sign', 'Salesforce Contract Management']
    },
    {
      id: 'compliance-monitoring',
      name: 'Compliance Monitoring',
      value: 'Automatically monitor contracts and documents for compliance',
      replacesTools: ['DocuSign', 'Adobe Sign', 'Salesforce Contract Management']
    },
    {
      id: 'legal-document-search',
      name: 'Legal Document Search',
      value: 'Find any clause or precedent instantly with AI-powered search',
      replacesTools: ['DocuSign', 'Adobe Sign', 'Salesforce Contract Management']
    },
    {
      id: 'esignature',
      name: 'E-Signature',
      value: 'Send and track contract signatures digitally',
      replacesTools: ['DocuSign', 'Adobe Sign', 'HelloSign']
    },
    {
      id: 'contract-repository',
      name: 'Contract Repository',
      value: 'Centralized storage and search for all contracts',
      replacesTools: ['ContractWorks', 'Concord', 'Agiloft']
    },
    {
      id: 'obligation-manager',
      name: 'Obligation Manager',
      value: 'Track and manage contractual obligations',
      replacesTools: ['ContractWorks', 'Icertis', 'Agiloft']
    },
    {
      id: 'matter-management',
      name: 'Matter Management',
      value: 'Organize and track legal matters and cases',
      replacesTools: ['Clio', 'MyCase', 'CaseText']
    }
  ],
  finance: [
    {
      id: 'invoice-management',
      name: 'Invoice Management',
      value: 'Automate invoice processing and reconciliation',
      replacesTools: ['QuickBooks', 'Xero', 'Sage']
    },
    {
      id: 'budget-tracking',
      name: 'Budget Tracking',
      value: 'Track and manage budgets efficiently',
      replacesTools: ['QuickBooks', 'Xero', 'Sage']
    },
    {
      id: 'financial-reporting',
      name: 'Financial Reporting',
      value: 'Generate financial reports and forecasts',
      replacesTools: ['QuickBooks', 'Xero', 'Sage']
    },
    {
      id: 'expense-tracking',
      name: 'Expense Tracking',
      value: 'Track and approve expenses in real-time',
      replacesTools: ['Expensify', 'Concur', 'Divvy']
    },
    {
      id: 'budget-planner',
      name: 'Budget Planner',
      value: 'Create and monitor departmental budgets',
      replacesTools: ['Adaptive Insights', 'Anaplan', 'Planful']
    },
    {
      id: 'ar-automation',
      name: 'AR Automation',
      value: 'Automate accounts receivable and collections',
      replacesTools: ['Versapay', 'Tesorio', 'HighRadius']
    },
    {
      id: 'financial-forecasting',
      name: 'Financial Forecasting',
      value: 'Build financial models and forecasts',
      replacesTools: ['Anaplan', 'Vena', 'OneStream']
    }
  ],
  hr: [
    {
      id: 'recruitment-automation',
      name: 'Recruitment Automation',
      value: 'Automate the recruitment process',
      replacesTools: ['Greenhouse', 'Workday', 'LinkedIn Recruiter']
    },
    {
      id: 'onboarding-management',
      name: 'Onboarding Management',
      value: 'Manage new hire onboarding efficiently',
      replacesTools: ['Greenhouse', 'Workday', 'LinkedIn Recruiter']
    },
    {
      id: 'employee-lifecycle-tracking',
      name: 'Employee Lifecycle Tracking',
      value: 'Track the entire employee journey',
      replacesTools: ['Greenhouse', 'Workday', 'LinkedIn Recruiter']
    },
    {
      id: 'employee-engagement',
      name: 'Employee Engagement',
      value: 'Measure and improve employee satisfaction',
      replacesTools: ['Culture Amp', 'Officevibe', 'Lattice']
    },
    {
      id: 'performance-reviews',
      name: 'Performance Reviews',
      value: 'Conduct 360-degree performance evaluations',
      replacesTools: ['Lattice', 'BambooHR', '15Five']
    },
    {
      id: 'time-tracking',
      name: 'Time Tracking',
      value: 'Track employee hours and attendance',
      replacesTools: ['Harvest', 'Toggl', 'Clockify']
    },
    {
      id: 'learning-management',
      name: 'Learning Management',
      value: 'Deliver training and track employee development',
      replacesTools: ['Docebo', 'TalentLMS', 'Lessonly']
    }
  ]
};

export const additionalSidekickActionsByDepartment: Record<Department, AdditionalSidekickAction[]> = {
  marketing: [
    {
      id: 'optimize-headlines',
      name: 'Optimize ad headlines',
      description: 'AI suggests high-performing headline variations',
      value: 'Increase CTR with AI-optimized headlines'
    },
    {
      id: 'analyze-competitors',
      name: 'Analyze competitor campaigns',
      description: 'Compare your campaigns to competitor strategies',
      value: 'Stay ahead with competitive intelligence'
    },
    {
      id: 'suggest-keywords',
      name: 'Suggest SEO keywords',
      description: 'Find high-value keywords for your content',
      value: 'Rank higher with smart keyword suggestions'
    },
    {
      id: 'personalize-emails',
      name: 'Personalize email content',
      description: 'Customize emails based on recipient data',
      value: 'Boost engagement with personalization at scale'
    }
  ],
  sales: [
    {
      id: 'score-leads',
      name: 'Score and prioritize leads',
      description: 'AI ranks leads by conversion probability',
      value: 'Focus on the hottest opportunities'
    },
    {
      id: 'predict-churn',
      name: 'Predict customer churn',
      description: 'Identify at-risk accounts before they leave',
      value: 'Prevent churn with early warning signals'
    },
    {
      id: 'generate-proposals',
      name: 'Generate sales proposals',
      description: 'Create customized proposals in seconds',
      value: 'Close deals faster with instant proposals'
    },
    {
      id: 'recommend-actions',
      name: 'Recommend next actions',
      description: 'AI suggests the best next step for each deal',
      value: 'Never wonder what to do next'
    }
  ],
  operations: [
    {
      id: 'predict-delays',
      name: 'Predict project delays',
      description: 'AI forecasts potential timeline risks',
      value: 'Stay on schedule with early warnings'
    },
    {
      id: 'optimize-schedules',
      name: 'Optimize team schedules',
      description: 'Balance workload across team members',
      value: 'Maximize productivity with smart scheduling'
    },
    {
      id: 'suggest-process',
      name: 'Suggest process improvements',
      description: 'AI identifies workflow inefficiencies',
      value: 'Continuously improve your operations'
    },
    {
      id: 'allocate-resources',
      name: 'Auto-allocate resources',
      description: 'Assign resources based on availability and skills',
      value: 'Optimize resource utilization'
    }
  ],
  support: [
    {
      id: 'suggest-responses',
      name: 'Suggest ticket responses',
      description: 'AI recommends responses based on similar tickets',
      value: 'Resolve tickets faster with smart suggestions'
    },
    {
      id: 'detect-escalations',
      name: 'Detect escalation needs',
      description: 'AI identifies tickets that need immediate attention',
      value: 'Prevent issues from becoming crises'
    },
    {
      id: 'update-kb',
      name: 'Update knowledge base',
      description: 'Auto-generate KB articles from resolved tickets',
      value: 'Build your knowledge base automatically'
    },
    {
      id: 'analyze-satisfaction',
      name: 'Analyze satisfaction trends',
      description: 'Track CSAT trends and identify issues',
      value: 'Improve service with trend insights'
    }
  ],
  product: [
    {
      id: 'prioritize-bugs',
      name: 'Prioritize bug fixes',
      description: 'AI ranks bugs by impact and severity',
      value: 'Fix what matters most first'
    },
    {
      id: 'estimate-effort',
      name: 'Estimate development effort',
      description: 'AI predicts how long features will take',
      value: 'Plan sprints with accurate estimates'
    },
    {
      id: 'analyze-usage',
      name: 'Analyze feature usage',
      description: 'Understand which features drive engagement',
      value: 'Build features users actually want'
    },
    {
      id: 'generate-tests',
      name: 'Generate test cases',
      description: 'Auto-create test scenarios from requirements',
      value: 'Ship with confidence and fewer bugs'
    }
  ],
  legal: [
    {
      id: 'extract-terms',
      name: 'Extract key contract terms',
      description: 'AI pulls out important clauses and dates',
      value: 'Review contracts in minutes, not hours'
    },
    {
      id: 'compare-versions',
      name: 'Compare contract versions',
      description: 'Highlight changes between contract versions',
      value: 'Spot risky changes instantly'
    },
    {
      id: 'suggest-clauses',
      name: 'Suggest standard clauses',
      description: 'AI recommends approved legal language',
      value: 'Draft contracts with pre-approved clauses'
    },
    {
      id: 'track-deadlines',
      name: 'Track renewal deadlines',
      description: 'Never miss a contract renewal or termination date',
      value: 'Stay on top of all contract obligations'
    }
  ],
  finance: [
    {
      id: 'categorize-expenses',
      name: 'Categorize expenses',
      description: 'AI automatically tags and categorizes transactions',
      value: 'Save hours on expense categorization'
    },
    {
      id: 'detect-duplicates',
      name: 'Detect duplicate invoices',
      description: 'Prevent double payments automatically',
      value: 'Eliminate costly duplicate payments'
    },
    {
      id: 'forecast-revenue',
      name: 'Forecast revenue',
      description: 'AI predicts future revenue based on trends',
      value: 'Plan better with accurate forecasts'
    },
    {
      id: 'optimize-cash',
      name: 'Optimize cash flow',
      description: 'Suggest payment timing to maximize cash',
      value: 'Improve working capital management'
    }
  ],
  hr: [
    {
      id: 'screen-resumes',
      name: 'Screen candidate resumes',
      description: 'AI ranks candidates by fit and experience',
      value: 'Find top candidates 10x faster'
    },
    {
      id: 'suggest-training',
      name: 'Suggest training programs',
      description: 'Recommend learning based on skills gaps',
      value: 'Develop employees with personalized training'
    },
    {
      id: 'predict-attrition',
      name: 'Predict employee attrition',
      description: 'Identify employees likely to leave',
      value: 'Retain top talent proactively'
    },
    {
      id: 'generate-jds',
      name: 'Generate job descriptions',
      description: 'Create compelling JDs from role requirements',
      value: 'Attract better candidates with optimized JDs'
    }
  ]
};