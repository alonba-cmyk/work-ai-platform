// Import real product icons from Figma
import imgWM from "@/assets/5d4f550f18adfa644c6653f867bc960bdc8a53dc.png";
import imgCRM from "@/assets/6cf10de3ca3f528bc9d9457024ed87915acf1b6f.png";
import imgCampaigns from "@/assets/41abe475f056daef6e610ed3282d554ea3b88606.png";
import imgService from "@/assets/9fae7b5cd33e1ccaf1f329bad81508b9daae5210.png";
import imgDev from "@/assets/f416d94ad48b77a56df38e1f5ca7412f0e86202f.png";
import imgAgents from "@/assets/50fa24641e7dcf6f4b9a73238d293ef7bb60b528.png";
import imgSidekick from "@/assets/118e32d3321e688093c59d5dd9a67bb37acb1f52.png";
import imgVibe from "@/assets/48bf64e6f0f3db302604b8108740e09a09780084.png";

// Work Management Icon (Blue)
export function WMIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div className={className}>
      <img 
        src={imgWM} 
        alt="monday work management" 
        className="block size-full object-contain"
      />
    </div>
  );
}

// CRM Icon (Turquoise)
export function CRMIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div className={className}>
      <img 
        src={imgCRM} 
        alt="monday CRM" 
        className="block size-full object-contain"
      />
    </div>
  );
}

// Campaigns Icon (Cyan)  
export function CampaignsIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div className={className}>
      <img 
        src={imgCampaigns} 
        alt="monday campaigns" 
        className="block size-full object-contain"
      />
    </div>
  );
}

// Service Icon (Pink)
export function ServiceIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div className={className}>
      <img 
        src={imgService} 
        alt="monday service" 
        className="block size-full object-contain"
      />
    </div>
  );
}

// Dev Icon (Green)
export function DevIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div className={className}>
      <img 
        src={imgDev} 
        alt="monday dev" 
        className="block size-full object-contain"
      />
    </div>
  );
}

// Agents Icon (Yellow)
export function AgentsIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div className={className}>
      <img 
        src={imgAgents} 
        alt="monday agents" 
        className="block size-full object-contain"
      />
    </div>
  );
}

// Sidekick Icon (Purple)
export function SidekickIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div className={className}>
      <img 
        src={imgSidekick} 
        alt="monday sidekick" 
        className="block size-full object-contain"
      />
    </div>
  );
}

// Vibe Icon (Orange)
export function VibeIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div className={className}>
      <img 
        src={imgVibe} 
        alt="monday vibe" 
        className="block size-full object-contain"
      />
    </div>
  );
}