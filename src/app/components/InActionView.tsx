import { AnimatedStoryView } from './AnimatedStoryView';

interface InActionViewProps {
  department: string;
  products: Array<{ name: string; value?: string; image?: string }>;
  agents: Array<{ name: string; value?: string; image?: string }>;
  vibeApps: Array<{ name: string; value?: string; image?: string }>;
  sidekickActions: Array<{ name: string; value?: string; image?: string }>;
}

export function InActionView({ 
  department,
  agents
}: InActionViewProps) {
  // Render the animated story view with agents data - wrapped in fixed width container
  return (
    <div style={{ width: '100%', minWidth: '100%' }}>
      <AnimatedStoryView department={department} agents={agents} />
    </div>
  );
}
