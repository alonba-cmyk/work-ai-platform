import { motion } from 'motion/react';
import { Package, Sparkles, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

// Import product icons components
import { WMIcon, DevIcon, CRMIcon, ServiceIcon, CampaignsIcon } from '@/app/components/ProductIcons';
import { IsometricPlatformVisualization } from '@/app/components/IsometricPlatform';
import { BusinessImpactPanel } from '@/app/components/BusinessImpactPanel';

import type { Department } from '@/app/types';

interface SolutionDisplayProps {
  department: string;
  products: Array<{
    name: string;
    description: string;
    value: string;
    image?: string;
    useCases?: string[];
    replacesTools?: string[];
  }>;
  capabilities: Array<{
    name: string;
    description: string;
    value: string;
  }>;
  agents: Array<{
    name: string;
    description: string;
    value: string;
    image?: string;
  }>;
  vibeApps: Array<{
    name: string;
    icon?: any;
    value: string;
    replacesTools: string[];
    image?: string;
  }>;
  values?: Array<{
    icon: any;
    title: string;
    description: string;
    supportedBy: Array<'WM' | 'CRM' | 'Service' | 'Dev' | 'Sidekick' | 'Agents'>;
    replacesTools?: string[];
  }>;
  availableAgents?: Array<{
    name: string;
    description: string;
    value: string;
    image?: string;
  }>;
  availableVibeApps?: Array<{
    name: string;
    icon?: any;
    value: string;
    replacesTools: string[];
    image?: string;
  }>;
  availableSidekickActions?: Array<{
    name: string;
    description: string;
    value: string;
  }>;
  availableProducts?: Array<{
    name: string;
    description: string;
    value: string;
    image?: string;
    useCases?: string[];
    replacesTools?: string[];
  }>;
  // Selected department info for header
  selectedDepartmentInfo?: {
    title: string;
    desc: string;
    avatarImage: string;
    avatarBgColor: string;
  };
  onChangeSelection?: () => void;
}

// Product icon components mapping
const productIconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  'Work Management': WMIcon,
  'CRM': CRMIcon,
  'Campaigns': CampaignsIcon,
  'Service': ServiceIcon,
  'Dev': DevIcon,
};

// Department-specific headlines
const departmentHeadlines: Record<string, { title: string; subtitle: string }> = {
  marketing: {
    title: 'Your AI-powered marketing end-to-end solution that delivers faster and drives demand',
    subtitle: 'built on monday AI work platform'
  },
  sales: {
    title: 'Your AI-powered sales end-to-end solution that accelerates deals and increases win rates',
    subtitle: 'built on monday AI work platform'
  },
  operations: {
    title: 'Your AI-powered operations end-to-end solution that optimizes processes and boosts efficiency',
    subtitle: 'built on monday AI work platform'
  },
  support: {
    title: 'Your AI-powered customer service end-to-end solution that resolves faster and delights customers',
    subtitle: 'built on monday AI work platform'
  },
  product: {
    title: 'Your AI-powered product development end-to-end solution that accelerates innovation and speeds time-to-market',
    subtitle: 'built on monday AI work platform'
  },
  legal: {
    title: 'Your AI-powered legal operations end-to-end solution that streamlines contracts and ensures compliance',
    subtitle: 'built on monday AI work platform'
  },
  finance: {
    title: 'Your AI-powered finance end-to-end solution that automates workflows and delivers real-time insights',
    subtitle: 'built on monday AI work platform'
  },
  hr: {
    title: 'Your AI-powered HR end-to-end solution that attracts talent and empowers your people',
    subtitle: 'built on monday AI work platform'
  }
};

export function SolutionDisplay({ 
  department, 
  products, 
  capabilities, 
  agents, 
  vibeApps,
  values = [],
  availableAgents = [],
  availableVibeApps = [],
  availableSidekickActions = [],
  availableProducts = [],
  selectedDepartmentInfo,
  onChangeSelection
}: SolutionDisplayProps) {
  const headline = departmentHeadlines[department] || { title: 'Your AI-powered solution', subtitle: 'built on monday AI work platform' };
  
  // State for dynamic items
  const [allProducts, setAllProducts] = useState(products);
  const [allAgents, setAllAgents] = useState(agents);
  const [allSidekickActions, setAllSidekickActions] = useState(capabilities);
  const [allVibeApps, setAllVibeApps] = useState(vibeApps);
  
  // State for Business Impact Panel
  const [isImpactPanelOpen, setIsImpactPanelOpen] = useState(false);
  
  // Track original items to prevent removal
  const [originalProducts, setOriginalProducts] = useState(products.map(p => p.name));
  const [originalAgents, setOriginalAgents] = useState(agents.map(a => a.name));
  const [originalSidekickActions, setOriginalSidekickActions] = useState(capabilities.map(c => c.name));
  const [originalVibeApps, setOriginalVibeApps] = useState(vibeApps.map(v => v.name));
  
  // Update state when department changes (props change)
  useEffect(() => {
    setAllProducts(products);
    setAllAgents(agents);
    setAllSidekickActions(capabilities);
    setAllVibeApps(vibeApps);
    setOriginalProducts(products.map(p => p.name));
    setOriginalAgents(agents.map(a => a.name));
    setOriginalSidekickActions(capabilities.map(c => c.name));
    setOriginalVibeApps(vibeApps.map(v => v.name));
  }, [department, products, agents, capabilities, vibeApps]);
  
  // Handlers for adding items
  const handleAddProduct = (productName: string) => {
    const productToAdd = availableProducts.find(p => p.name === productName);
    if (productToAdd && !allProducts.find(p => p.name === productName)) {
      setAllProducts([...allProducts, productToAdd]);
    }
  };
  
  const handleAddAgent = (agentName: string) => {
    const agentToAdd = availableAgents.find(a => a.name === agentName);
    if (agentToAdd && !allAgents.find(a => a.name === agentName)) {
      setAllAgents([...allAgents, agentToAdd]);
    }
  };
  
  const handleAddSidekickAction = (actionName: string) => {
    const actionToAdd = availableSidekickActions.find(a => a.name === actionName);
    if (actionToAdd && !allSidekickActions.find(a => a.name === actionName)) {
      setAllSidekickActions([...allSidekickActions, actionToAdd]);
    }
  };
  
  const handleAddVibeApp = (appName: string) => {
    const appToAdd = availableVibeApps.find(a => a.name === appName);
    if (appToAdd && !allVibeApps.find(a => a.name === appName)) {
      setAllVibeApps([...allVibeApps, {
        ...appToAdd,
        icon: appToAdd.icon || <Sparkles className="w-5 h-5" />, // Use icon from app or default to Sparkles
        replacesTools: appToAdd.replacesTools || []
      }]);
    }
  };
  
  // Handlers for removing items (allow removal of all items)
  const handleRemoveProduct = (productName: string) => {
    setAllProducts(allProducts.filter(p => p.name !== productName));
  };
  
  const handleRemoveAgent = (agentName: string) => {
    setAllAgents(allAgents.filter(a => a.name !== agentName));
  };
  
  const handleRemoveSidekickAction = (actionName: string) => {
    setAllSidekickActions(allSidekickActions.filter(a => a.name !== actionName));
  };
  
  const handleRemoveVibeApp = (appName: string) => {
    setAllVibeApps(allVibeApps.filter(a => a.name !== appName));
  };
  
  return (
    <div className="relative w-full flex flex-col items-center justify-start pb-16">
      {/* Full Screen Isometric Visualization */}
      <div className="w-full flex-1 px-0 xl:pl-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full h-full"
        >
          <IsometricPlatformVisualization
            department={department}
            products={allProducts.map(p => ({
              name: p.name,
              description: p.description,
              value: p.value,
              image: p.image,
              useCases: p.useCases, // Add use cases
              replacesTools: p.replacesTools, // Add replaces tools
              icon: (() => {
                const IconComp = productIconComponents[p.name];
                return IconComp ? <IconComp /> : <Package className="w-6 h-6" />;
              })()
            }))}
            agents={allAgents}
            sidekickActions={allSidekickActions}
            vibeApps={allVibeApps}
            availableAgents={availableAgents}
            availableVibeApps={availableVibeApps}
            availableSidekickActions={availableSidekickActions}
            availableProducts={availableProducts}
            onAddProduct={handleAddProduct}
            onAddAgent={handleAddAgent}
            onAddSidekickAction={handleAddSidekickAction}
            onAddVibeApp={handleAddVibeApp}
            onRemoveProduct={handleRemoveProduct}
            onRemoveAgent={handleRemoveAgent}
            onRemoveSidekickAction={handleRemoveSidekickAction}
            onRemoveVibeApp={handleRemoveVibeApp}
            originalProductNames={originalProducts}
            originalAgentNames={originalAgents}
            originalSidekickActionNames={originalSidekickActions}
            originalVibeAppNames={originalVibeApps}
            onViewImpact={values.length > 0 ? () => setIsImpactPanelOpen(true) : undefined}
            selectedDepartmentInfo={selectedDepartmentInfo}
            onChangeSelection={onChangeSelection}
          />
        </motion.div>
      </div>
      
      {/* Business Impact Panel */}
      {values.length > 0 && (
        <BusinessImpactPanel
          isOpen={isImpactPanelOpen}
          onClose={() => setIsImpactPanelOpen(false)}
          values={values}
          selectedItems={{
            products: allProducts.map(p => p.name),
            agents: allAgents.map(a => a.name),
            sidekick: allSidekickActions.map(a => a.name),
            vibe: allVibeApps.map(a => a.name),
          }}
        />
      )}
    </div>
  );
}