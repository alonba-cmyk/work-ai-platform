import { AnimatedStoryView } from './AnimatedStoryView';

interface InActionViewProps {
  department: string;
  products: Array<{ name: string; value?: string; image?: string }>;
  agents: Array<{ name: string; value?: string; image?: string }>;
  vibeApps: Array<{ name: string; value?: string; image?: string }>;
  sidekickActions: Array<{ name: string; value?: string; image?: string }>;
}

export function InActionView({ 
  department
}: InActionViewProps) {
  // Render the animated story view
  return <AnimatedStoryView department={department} />;
}
