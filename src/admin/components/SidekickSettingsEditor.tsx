import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Sparkles, RotateCcw, Check, ChevronDown, ChevronRight, Undo2, Save, Upload, Image, Loader2 } from 'lucide-react';
import { useSidekickTheme, sidekickPresets, SidekickPanelTheme, defaultHeroTheme, defaultInActionTheme } from '@/contexts/SidekickThemeContext';
import { supabase } from '@/lib/supabase';

interface SidekickSettingsEditorProps {
  onBack?: () => void;
}

type TabType = 'hero' | 'inaction';
type AccordionSection = 'panel' | 'header' | 'intro' | 'cards' | 'text' | 'accents' | null;

// Simple color/text input
function ColorInput({ 
  label, 
  value, 
  onChange,
  description
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
      <div className="flex-1">
        <p className="text-sm text-white font-medium">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-48 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-indigo-500"
        placeholder="Value..."
      />
    </div>
  );
}

// Background picker with solid/gradient options
function BackgroundPicker({
  label,
  value,
  onChange,
  description
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}) {
  const isGradient = value.includes('gradient');
  const [mode, setMode] = useState<'solid' | 'gradient'>(isGradient ? 'gradient' : 'solid');
  
  // Helper functions for color conversion
  const hexToRgba = (hex: string, alpha: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return hex;
  };

  const parseColorToHexAndAlpha = (color: string): { hex: string; alpha: number } => {
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1]);
      const g = parseInt(rgbaMatch[2]);
      const b = parseInt(rgbaMatch[3]);
      const a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;
      const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
      return { hex, alpha: a };
    }
    if (color.startsWith('#')) {
      return { hex: color.slice(0, 7), alpha: 1 };
    }
    return { hex: '#2d2d37', alpha: 1 };
  };

  // Parse current value
  const [solidColor, setSolidColor] = useState('#2d2d37');
  const [solidOpacity, setSolidOpacity] = useState(1);
  const [gradientColor1, setGradientColor1] = useState('#2d2d37');
  const [gradientColor2, setGradientColor2] = useState('#23232d');
  const [gradientColor3, setGradientColor3] = useState('#28283a');
  const [gradientOpacity1, setGradientOpacity1] = useState(0.92);
  const [gradientOpacity2, setGradientOpacity2] = useState(0.95);
  const [gradientOpacity3, setGradientOpacity3] = useState(0.9);
  const [gradientAngle, setGradientAngle] = useState(145);

  const updateGradient = (c1: string, o1: number, c2: string, o2: number, c3: string, o3: number, angle: number) => {
    const color1 = o1 < 1 ? hexToRgba(c1, o1) : c1;
    const color2 = o2 < 1 ? hexToRgba(c2, o2) : c2;
    const color3 = o3 < 1 ? hexToRgba(c3, o3) : c3;
    const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3})`;
    onChange(gradient);
  };

  const updateSolid = (hex: string, opacity: number) => {
    setSolidColor(hex);
    setSolidOpacity(opacity);
    if (opacity < 1) {
      onChange(hexToRgba(hex, opacity));
    } else {
      onChange(hex);
    }
  };

  const handleModeChange = (newMode: 'solid' | 'gradient') => {
    setMode(newMode);
    if (newMode === 'solid') {
      updateSolid(solidColor, solidOpacity);
    } else {
      updateGradient(gradientColor1, gradientOpacity1, gradientColor2, gradientOpacity2, gradientColor3, gradientOpacity3, gradientAngle);
    }
  };

  return (
    <div className="py-4 border-b border-gray-800 last:border-0">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-white font-medium">{label}</p>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleModeChange('solid')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'solid' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Solid Color
        </button>
        <button
          onClick={() => handleModeChange('gradient')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'gradient' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Gradient
        </button>
      </div>

      {/* Preview with checkered background for transparency */}
      <div 
        className="w-full h-16 rounded-xl mb-4 border border-gray-700 overflow-hidden relative"
        style={{ 
          background: `linear-gradient(45deg, #333 25%, transparent 25%), 
                       linear-gradient(-45deg, #333 25%, transparent 25%), 
                       linear-gradient(45deg, transparent 75%, #333 75%), 
                       linear-gradient(-45deg, transparent 75%, #333 75%)`,
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
        }}
      >
        <div 
          className="absolute inset-0"
          style={{ background: value }}
        />
      </div>

      {mode === 'solid' ? (
        /* Solid color picker with opacity */
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 w-16">Color:</span>
            <div 
              className="w-10 h-10 rounded-lg border border-gray-600 overflow-hidden relative"
              style={{ 
                background: `linear-gradient(45deg, #444 25%, transparent 25%), 
                             linear-gradient(-45deg, #444 25%, transparent 25%), 
                             linear-gradient(45deg, transparent 75%, #444 75%), 
                             linear-gradient(-45deg, transparent 75%, #444 75%)`,
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
              }}
            >
              <div 
                className="absolute inset-0"
                style={{ background: hexToRgba(solidColor, solidOpacity) }}
              />
              <input
                type="color"
                value={solidColor}
                onChange={(e) => updateSolid(e.target.value, solidOpacity)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <input
              type="text"
              value={solidOpacity < 1 ? hexToRgba(solidColor, solidOpacity) : solidColor}
              onChange={(e) => {
                const parsed = parseColorToHexAndAlpha(e.target.value);
                setSolidColor(parsed.hex);
                setSolidOpacity(parsed.alpha);
                onChange(e.target.value);
              }}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 font-mono text-xs"
            />
          </div>
          {/* Opacity slider for solid */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 w-16">Opacity:</span>
            <div className="flex-1 relative h-6 flex items-center">
              <div 
                className="absolute inset-x-0 h-3 rounded-full"
                style={{ background: `linear-gradient(to right, transparent, ${solidColor})` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(solidOpacity * 100)}
                onChange={(e) => updateSolid(solidColor, parseInt(e.target.value) / 100)}
                className="relative w-full h-3 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-400 [&::-webkit-slider-thumb]:shadow-md"
              />
            </div>
            <span className="text-xs text-gray-300 w-10 text-right font-mono">{Math.round(solidOpacity * 100)}%</span>
          </div>
        </div>
      ) : (
        /* Gradient builder with opacity per color */
        <div className="space-y-4">
          {/* Angle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 w-16">Angle:</span>
            <input
              type="range"
              min="0"
              max="360"
              value={gradientAngle}
              onChange={(e) => {
                const angle = parseInt(e.target.value);
                setGradientAngle(angle);
                updateGradient(gradientColor1, gradientOpacity1, gradientColor2, gradientOpacity2, gradientColor3, gradientOpacity3, angle);
              }}
              className="flex-1"
            />
            <span className="text-sm text-gray-300 w-12">{gradientAngle}°</span>
          </div>

          {/* Color stop 1 */}
          <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 w-16">Color 1:</span>
              <input
                type="color"
                value={gradientColor1}
                onChange={(e) => {
                  setGradientColor1(e.target.value);
                  updateGradient(e.target.value, gradientOpacity1, gradientColor2, gradientOpacity2, gradientColor3, gradientOpacity3, gradientAngle);
                }}
                className="w-10 h-8 rounded cursor-pointer border border-gray-600"
              />
              <input
                type="text"
                value={gradientColor1}
                onChange={(e) => {
                  setGradientColor1(e.target.value);
                  updateGradient(e.target.value, gradientOpacity1, gradientColor2, gradientOpacity2, gradientColor3, gradientOpacity3, gradientAngle);
                }}
                className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-gray-300 font-mono text-xs"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-16">Opacity:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(gradientOpacity1 * 100)}
                onChange={(e) => {
                  const opacity = parseInt(e.target.value) / 100;
                  setGradientOpacity1(opacity);
                  updateGradient(gradientColor1, opacity, gradientColor2, gradientOpacity2, gradientColor3, gradientOpacity3, gradientAngle);
                }}
                className="flex-1"
              />
              <span className="text-xs text-gray-400 w-10 text-right">{Math.round(gradientOpacity1 * 100)}%</span>
            </div>
          </div>

          {/* Color stop 2 */}
          <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 w-16">Color 2:</span>
              <input
                type="color"
                value={gradientColor2}
                onChange={(e) => {
                  setGradientColor2(e.target.value);
                  updateGradient(gradientColor1, gradientOpacity1, e.target.value, gradientOpacity2, gradientColor3, gradientOpacity3, gradientAngle);
                }}
                className="w-10 h-8 rounded cursor-pointer border border-gray-600"
              />
              <input
                type="text"
                value={gradientColor2}
                onChange={(e) => {
                  setGradientColor2(e.target.value);
                  updateGradient(gradientColor1, gradientOpacity1, e.target.value, gradientOpacity2, gradientColor3, gradientOpacity3, gradientAngle);
                }}
                className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-gray-300 font-mono text-xs"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-16">Opacity:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(gradientOpacity2 * 100)}
                onChange={(e) => {
                  const opacity = parseInt(e.target.value) / 100;
                  setGradientOpacity2(opacity);
                  updateGradient(gradientColor1, gradientOpacity1, gradientColor2, opacity, gradientColor3, gradientOpacity3, gradientAngle);
                }}
                className="flex-1"
              />
              <span className="text-xs text-gray-400 w-10 text-right">{Math.round(gradientOpacity2 * 100)}%</span>
            </div>
          </div>

          {/* Color stop 3 */}
          <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 w-16">Color 3:</span>
              <input
                type="color"
                value={gradientColor3}
                onChange={(e) => {
                  setGradientColor3(e.target.value);
                  updateGradient(gradientColor1, gradientOpacity1, gradientColor2, gradientOpacity2, e.target.value, gradientOpacity3, gradientAngle);
                }}
                className="w-10 h-8 rounded cursor-pointer border border-gray-600"
              />
              <input
                type="text"
                value={gradientColor3}
                onChange={(e) => {
                  setGradientColor3(e.target.value);
                  updateGradient(gradientColor1, gradientOpacity1, gradientColor2, gradientOpacity2, e.target.value, gradientOpacity3, gradientAngle);
                }}
                className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-gray-300 font-mono text-xs"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-16">Opacity:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(gradientOpacity3 * 100)}
                onChange={(e) => {
                  const opacity = parseInt(e.target.value) / 100;
                  setGradientOpacity3(opacity);
                  updateGradient(gradientColor1, gradientOpacity1, gradientColor2, gradientOpacity2, gradientColor3, opacity, gradientAngle);
                }}
                className="flex-1"
              />
              <span className="text-xs text-gray-400 w-10 text-right">{Math.round(gradientOpacity3 * 100)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Color picker with opacity slider
function ColorPicker({ 
  label, 
  value, 
  onChange,
  description
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  description?: string;
}) {
  // Parse color value to extract hex and alpha
  const parseColor = (val: string): { hex: string; alpha: number } => {
    // Check for rgba
    const rgbaMatch = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1]);
      const g = parseInt(rgbaMatch[2]);
      const b = parseInt(rgbaMatch[3]);
      const a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;
      const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
      return { hex, alpha: a };
    }
    // Check for hex
    if (val.startsWith('#')) {
      return { hex: val.slice(0, 7), alpha: 1 };
    }
    return { hex: '#ffffff', alpha: 1 };
  };

  const hexToRgba = (hex: string, alpha: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return hex;
  };

  const { hex, alpha } = parseColor(value);
  const [currentHex, setCurrentHex] = useState(hex);
  const [currentAlpha, setCurrentAlpha] = useState(alpha);

  // Update output when hex or alpha changes
  const updateColor = (newHex: string, newAlpha: number) => {
    setCurrentHex(newHex);
    setCurrentAlpha(newAlpha);
    if (newAlpha < 1) {
      onChange(hexToRgba(newHex, newAlpha));
    } else {
      onChange(newHex);
    }
  };

  return (
    <div className="py-3 border-b border-gray-800 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <p className="text-sm text-white font-medium">{label}</p>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {/* Color preview with checkered background for transparency */}
          <div 
            className="w-10 h-10 rounded-lg border border-gray-600 overflow-hidden relative"
            style={{ 
              background: `linear-gradient(45deg, #444 25%, transparent 25%), 
                           linear-gradient(-45deg, #444 25%, transparent 25%), 
                           linear-gradient(45deg, transparent 75%, #444 75%), 
                           linear-gradient(-45deg, transparent 75%, #444 75%)`,
              backgroundSize: '8px 8px',
              backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
            }}
          >
            <div 
              className="absolute inset-0"
              style={{ background: hexToRgba(currentHex, currentAlpha) }}
            />
            <input
              type="color"
              value={currentHex}
              onChange={(e) => updateColor(e.target.value, currentAlpha)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <input
            type="text"
            value={currentAlpha < 1 ? hexToRgba(currentHex, currentAlpha) : currentHex}
            onChange={(e) => {
              const parsed = parseColor(e.target.value);
              setCurrentHex(parsed.hex);
              setCurrentAlpha(parsed.alpha);
              onChange(e.target.value);
            }}
            className="w-44 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-indigo-500 font-mono text-xs"
            placeholder="Color value..."
          />
        </div>
      </div>
      
      {/* Opacity slider */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 w-14">Opacity:</span>
        <div className="flex-1 relative h-6 flex items-center">
          <div 
            className="absolute inset-x-0 h-3 rounded-full"
            style={{ 
              background: `linear-gradient(to right, transparent, ${currentHex})`,
            }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(currentAlpha * 100)}
            onChange={(e) => updateColor(currentHex, parseInt(e.target.value) / 100)}
            className="relative w-full h-3 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-400 [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>
        <span className="text-xs text-gray-300 w-10 text-right font-mono">{Math.round(currentAlpha * 100)}%</span>
      </div>
    </div>
  );
}

// Preview component
function SidekickPreview({ theme, title }: { theme: SidekickPanelTheme; title: string }) {
  return (
    <div className="relative space-y-6">
      {/* Intro Screen Preview */}
      <div>
        <p className="text-xs text-gray-500 mb-2 text-center">Intro Screen</p>
        <div 
          className="rounded-xl p-4 border border-gray-700"
          style={{ background: theme.introBackground || '#ffffff' }}
        >
          {/* Sidekick bubble */}
          <div 
            className="rounded-xl px-3 py-2 mb-2 max-w-[85%]"
            style={{
              background: `linear-gradient(to right, ${theme.introBubbleGradientFrom || '#6366f1'}, ${theme.introBubbleGradientTo || '#a855f7'})`,
              boxShadow: `0 4px 6px -1px ${theme.introBubbleShadow || 'rgba(99, 102, 241, 0.3)'}`,
            }}
          >
            <p className="text-white text-xs font-medium">
              {(theme.introMessage || "Hey! I'm Sidekick...").substring(0, 25)}...
            </p>
          </div>
          {/* User bubble */}
          <div 
            className="rounded-xl rounded-br-sm px-3 py-2 ml-auto max-w-[70%]"
            style={{ background: theme.userMessageBg || '#4f46e5' }}
          >
            <p style={{ color: theme.userMessageText || '#ffffff' }} className="text-xs">
              Cool, what can you do?
            </p>
          </div>
        </div>
      </div>

      {/* Panel Preview */}
      <div>
        <p className="text-xs text-gray-500 mb-2 text-center">{title}</p>
        <div 
          className="rounded-2xl overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #ec4899, #a855f7, #f59e0b)',
            padding: '3px',
            boxShadow: '0 0 30px rgba(236, 72, 153, 0.2)',
          }}
        >
          <div 
            className="rounded-[14px] p-4"
            style={{ 
              background: theme.panelBackground,
              backdropFilter: `blur(${theme.panelBackdropBlur})`,
              boxShadow: theme.panelShadow,
            }}
          >
            {/* Header */}
            <div 
              className="flex items-center gap-2 pb-3 mb-3"
              style={{ borderBottom: `1px solid ${theme.headerBorderColor}` }}
            >
              {theme.headerLogo ? (
                <img src={theme.headerLogo} alt="Logo" className="w-8 h-8 object-contain" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="flex items-center gap-1">
                <span style={{ color: theme.headerPrimaryText }} className="font-bold text-sm">{theme.headerPrimaryLabel || 'monday'}</span>
                <span style={{ color: theme.headerSecondaryText }} className="font-medium text-sm">{theme.headerSecondaryLabel || 'sidekick'}</span>
              </div>
            </div>
            
            {/* Sample card */}
            <div 
              className="rounded-xl p-3 mb-2"
              style={{ 
                background: theme.cardBackground,
                border: `1px solid ${theme.cardBorder}`,
                backdropFilter: `blur(${theme.cardBackdropBlur})`,
              }}
            >
              <p style={{ color: theme.primaryText }} className="text-sm font-medium mb-1">Perfect! Here's my plan:</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${theme.amberAccent}30` }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: theme.amberAccent }}></div>
                  </div>
                  <span style={{ color: theme.secondaryText }} className="text-xs">Send invitations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${theme.purpleAccent}30` }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: theme.purpleAccent }}></div>
                  </div>
                  <span style={{ color: theme.secondaryText }} className="text-xs">Create AI agent</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="rounded-full h-2 overflow-hidden" style={{ background: theme.progressBarBg }}>
              <div 
                className="h-full rounded-full w-2/3"
                style={{ background: `linear-gradient(to right, ${theme.indigoAccent}, ${theme.purpleAccent})` }}
              ></div>
            </div>
            
            {/* Status */}
            <p style={{ color: theme.greenAccent }} className="text-xs mt-2 text-center font-medium">
              ✓ Task complete!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SidekickSettingsEditor({ onBack }: SidekickSettingsEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [expandedSection, setExpandedSection] = useState<AccordionSection>('panel');
  
  // Undo history - store last 20 states
  const heroHistoryRef = useRef<string[]>([]);
  const inActionHistoryRef = useRef<string[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  
  // Save state
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    heroTheme,
    inActionTheme,
    heroPresetId,
    inActionPresetId,
    setHeroPreset,
    setInActionPreset,
    setHeroTheme,
    setInActionTheme,
    updateHeroThemeProperty,
    updateInActionThemeProperty,
    resetHeroToDefault,
    resetInActionToDefault,
  } = useSidekickTheme();

  const currentTheme = activeTab === 'hero' ? heroTheme : inActionTheme;
  const currentPresetId = activeTab === 'hero' ? heroPresetId : inActionPresetId;
  const setPreset = activeTab === 'hero' ? setHeroPreset : setInActionPreset;
  const historyRef = activeTab === 'hero' ? heroHistoryRef : inActionHistoryRef;
  const setTheme = activeTab === 'hero' ? setHeroTheme : setInActionTheme;
  
  // Load themes on initial mount - try localStorage first, then Supabase
  const hasLoadedRef = useRef(false);
  useEffect(() => {
    if (hasLoadedRef.current) return; // Only run once
    hasLoadedRef.current = true;
    
    const loadThemes = async () => {
      // Try localStorage first (faster and always works)
      try {
        const localHeroTheme = localStorage.getItem('sidekick_hero_theme');
        const localInActionTheme = localStorage.getItem('sidekick_inaction_theme');
        
        if (localHeroTheme) {
          setHeroTheme(JSON.parse(localHeroTheme) as SidekickPanelTheme);
        }
        if (localInActionTheme) {
          setInActionTheme(JSON.parse(localInActionTheme) as SidekickPanelTheme);
        }
        
        // If we found local themes, we're done
        if (localHeroTheme || localInActionTheme) {
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.warn('Could not load from localStorage:', e);
      }
      
      // Fallback: try Supabase
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('sidekick_hero_theme, sidekick_inaction_theme')
          .single();
        
        if (data && !error) {
          if (data.sidekick_hero_theme) {
            setHeroTheme(data.sidekick_hero_theme as SidekickPanelTheme);
          }
          if (data.sidekick_inaction_theme) {
            setInActionTheme(data.sidekick_inaction_theme as SidekickPanelTheme);
          }
        }
      } catch (err) {
        console.log('No sidekick themes found, using defaults');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Wrap updateProperty to save history
  const updatePropertyWithHistory = (key: keyof typeof currentTheme, value: string) => {
    // Save current state to history before making change
    const currentState = JSON.stringify(currentTheme);
    historyRef.current.push(currentState);
    if (historyRef.current.length > 20) {
      historyRef.current.shift(); // Keep only last 20
    }
    setCanUndo(true);
    setHasChanges(true);
    
    // Apply the update
    if (activeTab === 'hero') {
      updateHeroThemeProperty(key, value);
    } else {
      updateInActionThemeProperty(key, value);
    }
  };

  // Handle save - saves to localStorage (always works) and tries Supabase
  const handleSave = async () => {
    setIsSaving(true);
    
    // Always save to localStorage first (guaranteed to work)
    try {
      localStorage.setItem('sidekick_hero_theme', JSON.stringify(heroTheme));
      localStorage.setItem('sidekick_inaction_theme', JSON.stringify(inActionTheme));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
    
    // Try to save to Supabase as well
    try {
      // Check if site_settings row exists
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .single();
      
      const updateData = {
        sidekick_hero_theme: heroTheme,
        sidekick_inaction_theme: inActionTheme,
      };
      
      if (existing) {
        // Update existing row - use the actual ID from the existing row
        const { error } = await supabase
          .from('site_settings')
          .update(updateData)
          .eq('id', existing.id);
        
        if (error) {
          console.warn('Supabase save failed (using localStorage):', error.message);
        }
      } else {
        // Insert new row
        const { error } = await supabase
          .from('site_settings')
          .insert({ id: 'main', ...updateData });
        
        if (error) {
          console.warn('Supabase insert failed (using localStorage):', error.message);
        }
      }
      
      setHasChanges(false);
      setShowSaved(true);
    } catch (err: any) {
      // Supabase failed but localStorage worked
      console.warn('Supabase error (themes saved to localStorage):', err?.message);
      setHasChanges(false);
      setShowSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-hide saved message
  useEffect(() => {
    if (showSaved) {
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSaved]);

  const handleUndo = () => {
    if (historyRef.current.length > 0) {
      const previousState = historyRef.current.pop();
      if (previousState) {
        const parsed = JSON.parse(previousState);
        setTheme(parsed);
      }
      setCanUndo(historyRef.current.length > 0);
    }
  };

  const handleResetToDefault = () => {
    // Save current state before reset
    const currentState = JSON.stringify(currentTheme);
    historyRef.current.push(currentState);
    setCanUndo(true);
    
    if (activeTab === 'hero') {
      resetHeroToDefault();
    } else {
      resetInActionToDefault();
    }
  };

  const updateProperty = updatePropertyWithHistory;
  const resetToDefault = handleResetToDefault;

  const toggleSection = (section: AccordionSection) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderAccordionHeader = (section: AccordionSection, title: string) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-3 px-4 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors"
    >
      <span className="text-white font-medium">{title}</span>
      {expandedSection === section ? (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );

  // Show loading state while fetching from Supabase
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="ml-3 text-gray-400">Loading sidekick themes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Sidekick Settings</h2>
              <p className="text-gray-400 text-sm">Customize the look and feel of Sidekick panels</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Saved indicator */}
          {showSaved && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400">
              <Check className="w-4 h-4" />
              Saved!
            </div>
          )}
          
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              canUndo 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                : 'bg-gray-900 text-gray-600 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-4 h-4" />
            Undo
          </button>
          <button
            onClick={resetToDefault}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all ${
              hasChanges && !isSaving
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-900/30' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Saving...' : 'Save to Database'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-900 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'hero'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Hero Sidekick
        </button>
        <button
          onClick={() => setActiveTab('inaction')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'inaction'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          In Action Sidekick
        </button>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="col-span-2 space-y-4">
          {/* Presets */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Theme Presets</h3>
            <div className="grid grid-cols-4 gap-3">
              {sidekickPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setPreset(preset.id)}
                  className={`relative p-3 rounded-xl border-2 transition-all ${
                    currentPresetId === preset.id
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                  }`}
                >
                  {currentPresetId === preset.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div 
                    className="w-full h-12 rounded-lg mb-2"
                    style={{ background: preset.theme.panelBackground }}
                  ></div>
                  <p className="text-sm font-medium text-white">{preset.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Settings */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">Custom Settings</h3>
              <p className="text-sm text-gray-500">Fine-tune individual properties</p>
            </div>

            <div className="p-4 space-y-2">
              {/* Panel Settings */}
              <div>
                {renderAccordionHeader('panel', 'Panel Background')}
                {expandedSection === 'panel' && (
                  <div className="mt-2 p-4 bg-gray-850 rounded-lg border border-gray-800">
                    <BackgroundPicker
                      label="Background"
                      value={currentTheme.panelBackground}
                      onChange={(v) => updateProperty('panelBackground', v)}
                      description="Choose solid color or gradient"
                    />
                    <ColorInput
                      label="Backdrop Blur"
                      value={currentTheme.panelBackdropBlur}
                      onChange={(v) => updateProperty('panelBackdropBlur', v)}
                      description="e.g., 20px, 0px"
                    />
                    <ColorPicker
                      label="Border Color"
                      value={currentTheme.panelBorderColor}
                      onChange={(v) => updateProperty('panelBorderColor', v)}
                    />
                    <ColorInput
                      label="Box Shadow"
                      value={currentTheme.panelShadow}
                      onChange={(v) => updateProperty('panelShadow', v)}
                      description="CSS box-shadow value"
                    />
                    <BackgroundPicker
                      label="Outer Background"
                      value={currentTheme.panelOuterBackground || '#1a1a2e'}
                      onChange={(v) => updateProperty('panelOuterBackground', v)}
                      description="Dark area behind the panel frame (50/50 view)"
                    />
                  </div>
                )}
              </div>

              {/* Header Settings */}
              <div>
                {renderAccordionHeader('header', 'Header & Logo')}
                {expandedSection === 'header' && (
                  <div className="mt-2 p-4 bg-gray-850 rounded-lg border border-gray-800 space-y-4">
                    {/* Logo Upload/URL */}
                    <div className="py-3 border-b border-gray-800">
                      <p className="text-sm text-white font-medium mb-2">Logo</p>
                      <p className="text-xs text-gray-500 mb-3">Upload an image or enter a URL. Leave empty for default Sidekick logo.</p>
                      
                      <div className="flex items-start gap-4">
                        {/* Logo preview */}
                        <div className="w-16 h-16 rounded-xl bg-gray-800 border-2 border-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {currentTheme.headerLogo ? (
                            <img 
                              src={currentTheme.headerLogo} 
                              alt="Logo preview" 
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          {/* Upload button */}
                          <div className="flex gap-2">
                            <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer transition-colors">
                              <Upload className="w-4 h-4 text-white" />
                              <span className="text-sm text-white font-medium">Upload Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const base64 = event.target?.result as string;
                                      updateProperty('headerLogo', base64);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            {currentTheme.headerLogo && (
                              <button
                                onClick={() => updateProperty('headerLogo', '')}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 text-sm transition-colors"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                          
                          {/* URL input */}
                          <div className="flex items-center gap-2">
                            <Image className="w-4 h-4 text-gray-500" />
                            <input
                              type="text"
                              value={currentTheme.headerLogo?.startsWith('data:') ? '' : (currentTheme.headerLogo || '')}
                              onChange={(e) => updateProperty('headerLogo', e.target.value)}
                              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-indigo-500"
                              placeholder="Or enter image URL..."
                            />
                          </div>
                          
                          {currentTheme.headerLogo?.startsWith('data:') && (
                            <p className="text-xs text-green-400 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Custom image uploaded
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Header Text */}
                    <div className="py-3 border-b border-gray-800">
                      <p className="text-sm text-white font-medium mb-2">Header Text</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Primary Text</label>
                          <input
                            type="text"
                            value={currentTheme.headerPrimaryLabel}
                            onChange={(e) => updateProperty('headerPrimaryLabel', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-indigo-500"
                            placeholder="monday"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Secondary Text</label>
                          <input
                            type="text"
                            value={currentTheme.headerSecondaryLabel}
                            onChange={(e) => updateProperty('headerSecondaryLabel', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-indigo-500"
                            placeholder="sidekick"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Header Colors */}
                    <ColorPicker
                      label="Header Border"
                      value={currentTheme.headerBorderColor}
                      onChange={(v) => updateProperty('headerBorderColor', v)}
                    />
                    <ColorPicker
                      label="Primary Text Color"
                      value={currentTheme.headerPrimaryText}
                      onChange={(v) => updateProperty('headerPrimaryText', v)}
                    />
                    <ColorPicker
                      label="Secondary Text Color"
                      value={currentTheme.headerSecondaryText}
                      onChange={(v) => updateProperty('headerSecondaryText', v)}
                    />
                  </div>
                )}
              </div>

              {/* Intro Screen Settings */}
              <div>
                {renderAccordionHeader('intro', 'Intro Screen')}
                {expandedSection === 'intro' && (
                  <div className="mt-2 p-4 bg-gray-850 rounded-lg border border-gray-800 space-y-4">
                    {/* Intro Message */}
                    <div className="py-3 border-b border-gray-800">
                      <p className="text-sm text-white font-medium mb-2">Welcome Message</p>
                      <p className="text-xs text-gray-500 mb-3">The message shown when Sidekick first appears</p>
                      <textarea
                        value={currentTheme.introMessage || "Hey! I'm Sidekick, your AI assistant ✨"}
                        onChange={(e) => updateProperty('introMessage', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-indigo-500 resize-none"
                        rows={2}
                        placeholder="Hey! I'm Sidekick, your AI assistant ✨"
                      />
                    </div>

                    {/* Intro Background */}
                    <BackgroundPicker
                      label="Intro Background"
                      value={currentTheme.introBackground || '#ffffff'}
                      onChange={(v) => updateProperty('introBackground', v)}
                      description="Background color of the intro screen"
                    />

                    {/* Sidekick Bubble Gradient */}
                    <div className="py-3 border-b border-gray-800">
                      <p className="text-sm text-white font-medium mb-2">Sidekick Bubble Gradient</p>
                      <p className="text-xs text-gray-500 mb-3">Colors for the AI message bubble</p>
                      
                      {/* Preview */}
                      <div 
                        className="rounded-2xl px-6 py-4 mb-4 max-w-[80%]"
                        style={{ 
                          background: `linear-gradient(to right, ${currentTheme.introBubbleGradientFrom || '#6366f1'}, ${currentTheme.introBubbleGradientTo || '#a855f7'})`,
                          boxShadow: `0 10px 15px -3px ${currentTheme.introBubbleShadow || 'rgba(99, 102, 241, 0.3)'}`,
                        }}
                      >
                        <p className="text-white text-sm font-medium">
                          {(currentTheme.introMessage || "Hey! I'm Sidekick...").substring(0, 40)}...
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <ColorPicker
                          label="Gradient From"
                          value={currentTheme.introBubbleGradientFrom || '#6366f1'}
                          onChange={(v) => updateProperty('introBubbleGradientFrom', v)}
                        />
                        <ColorPicker
                          label="Gradient To"
                          value={currentTheme.introBubbleGradientTo || '#a855f7'}
                          onChange={(v) => updateProperty('introBubbleGradientTo', v)}
                        />
                      </div>
                      <div className="mt-3">
                        <ColorPicker
                          label="Bubble Shadow"
                          value={currentTheme.introBubbleShadow || 'rgba(99, 102, 241, 0.3)'}
                          onChange={(v) => updateProperty('introBubbleShadow', v)}
                          description="Shadow color with transparency"
                        />
                      </div>
                    </div>

                    {/* User Bubble */}
                    <div className="py-3">
                      <p className="text-sm text-white font-medium mb-2">User Response Bubble</p>
                      <p className="text-xs text-gray-500 mb-3">Color for user messages</p>
                      
                      {/* User bubble preview */}
                      <div 
                        className="rounded-2xl rounded-br-md px-6 py-4 mb-4 ml-auto max-w-[70%]"
                        style={{ 
                          background: currentTheme.userMessageBg || '#4f46e5',
                        }}
                      >
                        <p style={{ color: currentTheme.userMessageText || '#ffffff' }} className="text-sm font-medium">
                          Sure, let's get started!
                        </p>
                      </div>

                      <ColorPicker
                        label="User Bubble Color"
                        value={currentTheme.userMessageBg || '#4f46e5'}
                        onChange={(v) => updateProperty('userMessageBg', v)}
                      />
                      <ColorPicker
                        label="User Text Color"
                        value={currentTheme.userMessageText || '#ffffff'}
                        onChange={(v) => updateProperty('userMessageText', v)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Settings */}
              <div>
                {renderAccordionHeader('cards', 'Cards')}
                {expandedSection === 'cards' && (
                  <div className="mt-2 p-4 bg-gray-850 rounded-lg border border-gray-800">
                    <ColorPicker
                      label="Card Background"
                      value={currentTheme.cardBackground}
                      onChange={(v) => updateProperty('cardBackground', v)}
                    />
                    <ColorPicker
                      label="Card Border"
                      value={currentTheme.cardBorder}
                      onChange={(v) => updateProperty('cardBorder', v)}
                    />
                    <ColorPicker
                      label="Card Blur"
                      value={currentTheme.cardBackdropBlur}
                      onChange={(v) => updateProperty('cardBackdropBlur', v)}
                    />
                    <ColorPicker
                      label="Progress Bar BG"
                      value={currentTheme.progressBarBg}
                      onChange={(v) => updateProperty('progressBarBg', v)}
                    />
                  </div>
                )}
              </div>

              {/* Text Settings */}
              <div>
                {renderAccordionHeader('text', 'Text Colors')}
                {expandedSection === 'text' && (
                  <div className="mt-2 p-4 bg-gray-850 rounded-lg border border-gray-800">
                    <ColorPicker
                      label="Header Primary"
                      value={currentTheme.headerPrimaryText}
                      onChange={(v) => updateProperty('headerPrimaryText', v)}
                    />
                    <ColorPicker
                      label="Header Secondary"
                      value={currentTheme.headerSecondaryText}
                      onChange={(v) => updateProperty('headerSecondaryText', v)}
                    />
                    <ColorPicker
                      label="Primary Text"
                      value={currentTheme.primaryText}
                      onChange={(v) => updateProperty('primaryText', v)}
                    />
                    <ColorPicker
                      label="Secondary Text"
                      value={currentTheme.secondaryText}
                      onChange={(v) => updateProperty('secondaryText', v)}
                    />
                    <ColorPicker
                      label="Muted Text"
                      value={currentTheme.mutedText}
                      onChange={(v) => updateProperty('mutedText', v)}
                    />
                  </div>
                )}
              </div>

              {/* Accent Colors */}
              <div>
                {renderAccordionHeader('accents', 'Accent Colors')}
                {expandedSection === 'accents' && (
                  <div className="mt-2 p-4 bg-gray-850 rounded-lg border border-gray-800">
                    <ColorPicker
                      label="Green Accent"
                      value={currentTheme.greenAccent}
                      onChange={(v) => updateProperty('greenAccent', v)}
                      description="Success states"
                    />
                    <ColorPicker
                      label="Amber Accent"
                      value={currentTheme.amberAccent}
                      onChange={(v) => updateProperty('amberAccent', v)}
                      description="Warnings, email"
                    />
                    <ColorPicker
                      label="Indigo Accent"
                      value={currentTheme.indigoAccent}
                      onChange={(v) => updateProperty('indigoAccent', v)}
                      description="Primary actions"
                    />
                    <ColorPicker
                      label="Purple Accent"
                      value={currentTheme.purpleAccent}
                      onChange={(v) => updateProperty('purpleAccent', v)}
                      description="AI/Agent related"
                    />
                    <ColorPicker
                      label="User Message BG"
                      value={currentTheme.userMessageBg}
                      onChange={(v) => updateProperty('userMessageBg', v)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 sticky top-4">
            <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
            <SidekickPreview 
              theme={currentTheme} 
              title={activeTab === 'hero' ? 'Hero Sidekick' : 'In Action Sidekick'} 
            />
            
            {currentPresetId === 'custom' && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-amber-400 text-xs text-center">
                  Custom theme - click "Save to Database" to persist
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
