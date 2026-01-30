// Import individual product logo components from Figma
import Frame2147238759 from '@/imports/Frame2147238759';
import workManagementText from '@/assets/af177479d7ac0789c019f0f146b05d2dfa7a2cbd.png';

// Re-export the main frame for easy usage
export { default as ProductSuiteFrame } from '@/imports/Frame2147238759';

// Product logo components - extracted from the Figma frame
// These can be used individually in our custom components

export function WorkManagementLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="w-14 h-14 flex-shrink-0">
        {/* WM Icon - Blue */}
        <svg className="block size-full" fill="none" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="40" fill="#6161FF" />
          <g transform="translate(16, 16)">
            {/* WM symbol paths */}
            <path d="M12 12 L24 36 L36 12" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </svg>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-['Poppins',sans-serif] font-bold text-white text-sm leading-none">monday</span>
        <img 
          src={workManagementText} 
          alt="work management" 
          className="h-3.5 object-contain object-left"
        />
      </div>
    </div>
  );
}

export function CRMLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="w-14 h-14 flex-shrink-0">
        {/* CRM Icon - Turquoise */}
        <svg className="block size-full" fill="none" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="40" fill="#00D2D2" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-['Poppins',sans-serif] font-bold text-white text-sm leading-none">monday</span>
        <span className="font-['Poppins',sans-serif] font-semibold text-white text-sm leading-none">CRM</span>
      </div>
    </div>
  );
}

export function CampaignsLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="w-14 h-14 flex-shrink-0">
        {/* Campaigns Icon - Cyan */}
        <svg className="block size-full" fill="none" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="40" fill="#00D2D2" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-['Poppins',sans-serif] font-bold text-white text-sm leading-none">monday</span>
        <span className="font-['Poppins',sans-serif] font-semibold text-white text-sm leading-none">campaigns</span>
      </div>
    </div>
  );
}

export function ServiceLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="w-14 h-14 flex-shrink-0">
        {/* Service Icon - Pink */}
        <svg className="block size-full" fill="none" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="40" fill="#FB275D" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-['Poppins',sans-serif] font-bold text-white text-sm leading-none">monday</span>
        <span className="font-['Poppins',sans-serif] font-semibold text-white text-sm leading-none">service</span>
      </div>
    </div>
  );
}

export function DevLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="w-14 h-14 flex-shrink-0">
        {/* Dev Icon - Green */}
        <svg className="block size-full" fill="none" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="40" fill="#00CA72" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-['Poppins',sans-serif] font-bold text-white text-sm leading-none">monday</span>
        <span className="font-['Poppins',sans-serif] font-semibold text-white text-sm leading-none">dev</span>
      </div>
    </div>
  );
}

// AI Capabilities logos
export function VibeLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-[#FF6D3B] to-[#FFD633] rounded-2xl flex items-center justify-center">
        <Palette className="w-7 h-7 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="font-['Poppins',sans-serif] font-bold text-white text-sm leading-none">monday</span>
        <span className="font-['Poppins',sans-serif] font-light text-white text-sm leading-none">vibe</span>
      </div>
    </div>
  );
}

export function SidekickLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-[#FF6D3B] via-[#FFD633] to-[#FC527D] rounded-2xl flex items-center justify-center">
        <Sparkles className="w-7 h-7 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="font-['Poppins',sans-serif] font-bold text-white text-sm leading-none">monday</span>
        <span className="font-['Poppins',sans-serif] font-semibold text-white text-sm leading-none">sidekick</span>
      </div>
    </div>
  );
}

export function AgentsLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-[#6161FF] to-[#33DBDB] rounded-2xl flex items-center justify-center">
        <Bot className="w-7 h-7 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="font-['Poppins',sans-serif] font-bold text-white text-sm leading-none">monday</span>
        <span className="font-['Poppins',sans-serif] font-semibold text-white text-sm leading-none">agents</span>
      </div>
    </div>
  );
}

export function WorkflowsLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-[#6161FF] to-[#9593FF] rounded-2xl flex items-center justify-center">
        <Workflow className="w-7 h-7 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="font-['Poppins',sans-serif] font-bold text-white text-sm leading-none">monday</span>
        <span className="font-['Poppins',sans-serif] font-light text-white text-sm leading-none">workflows</span>
      </div>
    </div>
  );
}

// Icon imports
import { Palette, Sparkles, Bot, Workflow } from 'lucide-react';