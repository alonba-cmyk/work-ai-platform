import { motion } from 'motion/react';
import svgPaths from '@/imports/svg-c26pkj3rdu';

// Background glow component
function GlowEffect() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg className="w-[300px] h-[300px] md:w-[400px] md:h-[400px]" fill="none" preserveAspectRatio="none" viewBox="0 0 304.582 304.582">
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="304.582" id="filter0_f_hero" width="304.582" x="0" y="0">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_hero" stdDeviation="46.6298" />
          </filter>
          <radialGradient cx="0" cy="0" gradientTransform="translate(152.291 152.291) rotate(90) scale(59.0313)" gradientUnits="userSpaceOnUse" id="paint0_radial_hero" r="1">
            <stop offset="0.685" stopColor="#3FD1FF" />
            <stop offset="1" stopColor="#266799" />
          </radialGradient>
        </defs>
        <g filter="url(#filter0_f_hero)" opacity="0.6">
          <circle cx="152.291" cy="152.291" fill="url(#paint0_radial_hero)" r="59.0313" />
        </g>
        {/* Particles */}
        <circle cx="172.47" cy="228.409" fill="white" r="2.66145" />
        <path d={svgPaths.p2b856f80} fill="white" opacity="0.4" />
        <circle cx="153.66" cy="190.91" fill="white" opacity="0.4" r="1.12405" />
        <circle cx="170.329" cy="143.542" fill="white" r="1.66831" />
        <path d={svgPaths.pba93100} fill="white" />
        <circle cx="119.773" cy="115.031" fill="white" r="1.06458" />
        <path d={svgPaths.p26a31900} fill="white" opacity="0.4" />
        <path d={svgPaths.p22197000} fill="white" />
        <circle cx="138.936" cy="211.908" fill="white" r="1.06458" />
        <circle cx="146.388" cy="245.974" fill="white" r="1.06458" />
        <path d={svgPaths.p2e4bd400} fill="white" />
        <circle cx="97.417" cy="192.745" fill="white" r="1.06458" />
        <path d={svgPaths.p28717bb1} fill="white" opacity="0.4" />
        <circle cx="195.358" cy="124.612" fill="white" opacity="0.4" r="1.06458" />
        <circle cx="77.1898" cy="68.1887" fill="white" r="1.06458" />
        <circle cx="66.5438" cy="186.358" fill="white" opacity="0.4" r="1.06458" />
        <circle cx="122.967" cy="228.941" fill="white" opacity="0.7" r="1.06458" />
        <path d={svgPaths.pbe34900} fill="white" />
        <path d={svgPaths.pcc82500} fill="white" />
        <circle cx="192.768" cy="83.6974" fill="white" r="1.66831" />
        <circle cx="119.24" cy="60.205" fill="white" opacity="0.4" r="2.66145" />
        <circle cx="214.059" cy="146.507" fill="white" r="1.66831" />
        <circle cx="77.7935" cy="149.701" fill="white" r="1.66831" />
      </svg>
    </div>
  );
}

// Monday.com logo component with gradient
function MondayLogo() {
  return (
    <svg className="w-[100px] h-[60px] md:w-[134px] md:h-[78px]" fill="none" preserveAspectRatio="none" viewBox="0 0 133.731 78">
      <defs>
        <linearGradient id="mondayGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="15.66%" stopColor="#8181ff" />
          <stop offset="41.66%" stopColor="#33DBDB" />
          <stop offset="53.16%" stopColor="#35D58E" />
          <stop offset="64.16%" stopColor="#FFD633" />
          <stop offset="85.66%" stopColor="#FC527D" />
          <stop offset="100%" stopColor="#8181ff" />
        </linearGradient>
        <linearGradient id="mondayGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="15.66%" stopColor="#8181ff" />
          <stop offset="41.66%" stopColor="#33DBDB" />
          <stop offset="53.16%" stopColor="#35D58E" />
          <stop offset="64.16%" stopColor="#FFD633" />
          <stop offset="85.66%" stopColor="#FC527D" />
          <stop offset="100%" stopColor="#8181ff" />
        </linearGradient>
        <linearGradient id="mondayGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="15.66%" stopColor="#8181ff" />
          <stop offset="41.66%" stopColor="#33DBDB" />
          <stop offset="53.16%" stopColor="#35D58E" />
          <stop offset="64.16%" stopColor="#FFD633" />
          <stop offset="85.66%" stopColor="#FC527D" />
          <stop offset="100%" stopColor="#8181ff" />
        </linearGradient>
      </defs>
      <g>
        {/* Left dot */}
        <path d={svgPaths.p2a1ee680} fill="url(#mondayGradient1)" />
        {/* Middle dot */}
        <path d={svgPaths.p17567300} fill="url(#mondayGradient2)" />
        {/* Right dot */}
        <path d={svgPaths.p14d670f0} fill="url(#mondayGradient3)" />
      </g>
    </svg>
  );
}

interface HeroLogoProps {
  customLogoUrl?: string;
}

export function HeroLogo({ customLogoUrl }: HeroLogoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative flex items-center justify-center mb-8"
    >
      {/* Glow effect background */}
      <GlowEffect />
      
      {/* Custom Logo or Default Monday.com Logo */}
      <div className="relative z-10">
        {customLogoUrl ? (
          <img 
            src={customLogoUrl} 
            alt="Logo" 
            className="h-[60px] md:h-[78px] w-auto object-contain"
          />
        ) : (
          <MondayLogo />
        )}
      </div>
    </motion.div>
  );
}
