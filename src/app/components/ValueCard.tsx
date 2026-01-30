import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { WMIcon, CRMIcon, CampaignsIcon, ServiceIcon, DevIcon } from './ProductIcons';
import imgSidekick from '@/assets/6b31e36e4e4fdb48eeee59c4b63b85befe2e9c08.png';
import imgAgents from '@/assets/de6e6ab3d4154b79d6c85a7e92ebe37c5b85f3b6.png';

type SupportedFeature = 'WM' | 'CRM' | 'Campaigns' | 'Service' | 'Dev' | 'Sidekick' | 'Agents';

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  supportedBy?: SupportedFeature[];
  replacesTools?: string[];
}

const featureIconComponents: Record<SupportedFeature, React.ComponentType<{ className?: string }> | string> = {
  'WM': WMIcon,
  'CRM': CRMIcon,
  'Campaigns': CampaignsIcon,
  'Service': ServiceIcon,
  'Dev': DevIcon,
  'Sidekick': imgSidekick,
  'Agents': imgAgents,
};

export function ValueCard({ icon: Icon, title, description, delay = 0, supportedBy = [], replacesTools = [] }: ValueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="relative p-6 rounded-[var(--radius-card)] border border-border bg-gradient-to-br from-white/5 to-transparent overflow-hidden group hover:border-primary/50 transition-all"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-primary" />
      </div>

      {/* Content */}
      <h4 className="mb-2 font-['Poppins',sans-serif]">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Supported By Icons */}
      {supportedBy.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Powered by:</span>
            <div className="flex gap-1.5">
              {supportedBy.map((feature) => {
                const FeatureIcon = featureIconComponents[feature];
                
                if (typeof FeatureIcon === 'string') {
                  // It's an image path (Sidekick or Agents)
                  return (
                    <div key={feature} className="w-5 h-5 rounded-[4px] overflow-hidden shrink-0" title={feature}>
                      <img src={FeatureIcon} alt={feature} className="w-full h-full object-cover" />
                    </div>
                  );
                } else {
                  // It's a component (WM, CRM, Service, Dev)
                  return (
                    <div key={feature} className="shrink-0" title={feature}>
                      <FeatureIcon className="w-5 h-5" />
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      )}

      {/* Replaces Tools */}
      {replacesTools.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">Replaces:</span>
          <div className="flex gap-1.5 flex-wrap">
            {replacesTools.map((tool) => (
              <span 
                key={tool} 
                className="px-2 py-1 text-[10px] bg-border/30 text-muted-foreground rounded-[4px] border border-border/50"
                title={tool}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Glass effect overlay */}
      <div className="absolute inset-0 rounded-[var(--radius-card)] bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Inner shadow */}
      <div className="absolute inset-0 rounded-[var(--radius-card)] pointer-events-none shadow-[inset_0px_1px_3px_rgba(255,255,255,0.1)]" />
    </motion.div>
  );
}