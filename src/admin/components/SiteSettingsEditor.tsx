import { useState, useEffect, useRef } from 'react';
import { Save, Plus, Trash2, GripVertical, ArrowLeft, Upload, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TabItem {
  id: string;
  label: string;
  icon: string;
  order_index: number;
  enabled: boolean;
}

interface SectionsVisibility {
  hero: boolean;
  hero_alternative: boolean;
  hero_outcome_cards: boolean;
  work_comparison: boolean;
  sidekick_capabilities: boolean;
  sidekick: boolean;
  departments: boolean;
  ai_platform: boolean;
  project_management: boolean;
  agents_showcase: boolean;
  teams_and_agents: boolean;
  teams_and_agents_v2: boolean;
  ai_platform_architecture: boolean;
}

type TeamsAgentsV2Layout = 'mixed_circle' | 'team_with_agents' | 'side_by_side_unified' | 'cards_layout';
type AIPlatformArchLayout = 'app_frame_list' | 'app_frame_canvas' | 'app_frame_board';

interface HeroSettings {
  logo_url: string;
  platform_label: string;
  headline_text: string;
  headline_gradient_text: string;
  font_size: 'small' | 'medium' | 'large' | 'xlarge';
  background_type: 'solid' | 'gradient' | 'image';
  background_color: string;
  background_gradient_from: string;
  background_gradient_to: string;
  background_image_url: string;
}

interface SolutionTabsVisibility {
  overview: boolean;
  inAction: boolean;
  businessValue: boolean;
  test: boolean;
  products: boolean;
  capabilities: boolean;
}

interface SiteSettings {
  hero_title: string;
  hero_subtitle: string;
  tabs: TabItem[];
  sections_visibility: SectionsVisibility;
  sections_order: string[];
  hero_settings: HeroSettings;
  solution_tabs_visibility: SolutionTabsVisibility;
  teams_agents_v2_layout: TeamsAgentsV2Layout;
  team_flanked_featured_agents: Record<string, string[]>;
  ai_platform_arch_layout: AIPlatformArchLayout;
}

const defaultSectionsVisibility: SectionsVisibility = {
  hero: true,
  hero_alternative: false,
  hero_outcome_cards: false,
  work_comparison: false,
  sidekick_capabilities: false,
  sidekick: true,
  departments: true,
  ai_platform: true,
  project_management: false,
  agents_showcase: false,
  teams_and_agents: false,
  teams_and_agents_v2: false,
  ai_platform_architecture: false,
};

const defaultHeroSettings: HeroSettings = {
  logo_url: '',
  platform_label: 'AI Work Platform',
  headline_text: 'Empowering every team ',
  headline_gradient_text: 'to accelerate business impact',
  font_size: 'large',
  background_type: 'gradient',
  background_color: '#000000',
  background_gradient_from: '#000000',
  background_gradient_to: '#1a1a2e',
  background_image_url: '',
};

const defaultSolutionTabsVisibility: SolutionTabsVisibility = {
  overview: true,
  inAction: true,
  businessValue: true,
  test: true,
  products: true,
  capabilities: true,
};

const defaultSectionsOrder: string[] = [
  'hero',
  'hero_alternative',
  'hero_outcome_cards',
  'work_comparison',
  'sidekick_capabilities',
  'sidekick',
  'agents_showcase',
  'project_management',
  'teams_and_agents',
  'teams_and_agents_v2',
  'ai_platform_architecture',
  'departments',
  'ai_platform',
];

// Sortable Section Card Component
interface SortableSectionCardProps {
  id: string;
  label: string;
  isVisible: boolean;
  onToggle: () => void;
}

function SortableSectionCard({ id, label, isVisible, onToggle }: SortableSectionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 bg-gray-800 rounded-lg transition-opacity ${
        isVisible ? '' : 'opacity-60'
      } ${isDragging ? 'shadow-xl ring-2 ring-indigo-500' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-700 rounded"
        >
          <GripVertical className="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <span className="text-white font-medium">{label}</span>
          <span className={`ml-3 text-xs px-2 py-1 rounded ${
            isVisible
              ? 'bg-green-500/20 text-green-400'
              : 'bg-gray-600/20 text-gray-500'
          }`}>
            {isVisible ? 'Visible' : 'Hidden'}
          </span>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-14 h-7 rounded-full transition-colors ${
          isVisible ? 'bg-indigo-600' : 'bg-gray-600'
        }`}
      >
        <div
          className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
            isVisible ? 'left-8' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}

interface SiteSettingsEditorProps {
  onBack?: () => void;
}

export function SiteSettingsEditor({ onBack }: SiteSettingsEditorProps) {
  const [settings, setSettings] = useState<SiteSettings>({
    hero_title: 'What would you like to achieve?',
    hero_subtitle: 'Choose your department to see your tailored AI solution',
    tabs: [
      { id: '1', label: 'Department', icon: 'Building', order_index: 0, enabled: true },
      { id: '2', label: 'Outcome', icon: 'Target', order_index: 1, enabled: true },
      { id: '3', label: 'Pain Point', icon: 'AlertCircle', order_index: 2, enabled: true },
      { id: '4', label: 'AI Transformation', icon: 'Sparkles', order_index: 3, enabled: true },
      { id: '5', label: 'Custom Solution', icon: 'Wand', order_index: 4, enabled: true },
    ],
    sections_visibility: defaultSectionsVisibility,
    sections_order: defaultSectionsOrder,
    hero_settings: defaultHeroSettings,
    solution_tabs_visibility: defaultSolutionTabsVisibility,
    teams_agents_v2_layout: 'mixed_circle',
    team_flanked_featured_agents: {},
    ai_platform_arch_layout: 'app_frame_canvas',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<'sections' | 'hero' | 'tabs'>('sections');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (data && !error) {
        // Ensure all tabs have the enabled property (for backward compatibility)
        const tabsWithEnabled = (data.tabs || settings.tabs).map((tab: TabItem) => ({
          ...tab,
          enabled: tab.enabled !== undefined ? tab.enabled : true,
        }));
        
        // Extract _order and _teams_agents_v2_layout from sections_visibility if they exist
        const sectionsVisibilityData = data.sections_visibility || {};
        const { _order, _teams_agents_v2_layout, _team_flanked_featured_agents, _ai_platform_arch_layout, ...sectionsVisibilityWithoutOrder } = sectionsVisibilityData;
        
        setSettings({
          hero_title: data.hero_title || settings.hero_title,
          hero_subtitle: data.hero_subtitle || settings.hero_subtitle,
          tabs: tabsWithEnabled,
          sections_visibility: (() => {
            const merged = { ...defaultSectionsVisibility, ...sectionsVisibilityWithoutOrder };
            console.log('Loaded sections_visibility from DB:', data.sections_visibility);
            console.log('Merged with defaults:', merged);
            return merged;
          })(),
          sections_order: (() => {
            const savedOrder = _order || data.sections_order || defaultSectionsOrder;
            // Append any new sections from defaults that aren't in the saved order
            const missingSections = defaultSectionsOrder.filter(s => !savedOrder.includes(s));
            return [...savedOrder, ...missingSections];
          })(),
          hero_settings: { ...defaultHeroSettings, ...data.hero_settings },
          solution_tabs_visibility: data.solution_tabs_visibility || defaultSolutionTabsVisibility,
          teams_agents_v2_layout: _teams_agents_v2_layout || 'mixed_circle',
          team_flanked_featured_agents: _team_flanked_featured_agents || {},
          ai_platform_arch_layout: _ai_platform_arch_layout || 'app_frame_canvas',
        });
      }
    } catch (err) {
      console.log('No settings found, using defaults');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      console.log('Saving sections_visibility:', settings.sections_visibility);
      
      // Store sections_order and teams_agents_v2_layout inside sections_visibility JSONB
      const sectionsVisibilityWithExtras = {
        ...settings.sections_visibility,
        _order: settings.sections_order,
        _teams_agents_v2_layout: settings.teams_agents_v2_layout,
        _team_flanked_featured_agents: settings.team_flanked_featured_agents,
        _ai_platform_arch_layout: settings.ai_platform_arch_layout,
      };
      
      const { error: updateError } = await supabase
        .from('site_settings')
        .upsert({
          id: 'main',
          hero_title: settings.hero_title,
          hero_subtitle: settings.hero_subtitle,
          tabs: settings.tabs,
          sections_visibility: sectionsVisibilityWithExtras,
          hero_settings: settings.hero_settings,
          solution_tabs_visibility: settings.solution_tabs_visibility,
          updated_at: new Date().toISOString(),
        });

      if (updateError) {
        console.error('Save error:', updateError);
        alert('Save failed: ' + updateError.message);
      } else {
        console.log('Save successful!');
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section: keyof SectionsVisibility) => {
    setSettings({
      ...settings,
      sections_visibility: {
        ...settings.sections_visibility,
        [section]: !settings.sections_visibility[section],
      },
    });
  };

  const toggleSolutionTab = (tab: keyof SolutionTabsVisibility) => {
    setSettings({
      ...settings,
      solution_tabs_visibility: {
        ...settings.solution_tabs_visibility,
        [tab]: !settings.solution_tabs_visibility[tab],
      },
    });
  };

  // Drag and drop sensors and handlers
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = settings.sections_order.indexOf(active.id as string);
      const newIndex = settings.sections_order.indexOf(over.id as string);
      
      const newOrder = arrayMove(settings.sections_order, oldIndex, newIndex);
      
      setSettings({
        ...settings,
        sections_order: newOrder,
      });
    }
  };

  const updateHeroSettings = (field: keyof HeroSettings, value: string) => {
    setSettings({
      ...settings,
      hero_settings: {
        ...settings.hero_settings,
        [field]: value,
      },
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateHeroSettings('logo_url', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateHeroSettings('background_image_url', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateTab = (id: string, field: string, value: string) => {
    setSettings({
      ...settings,
      tabs: settings.tabs.map(tab => 
        tab.id === id ? { ...tab, [field]: value } : tab
      )
    });
  };

  const addTab = () => {
    const newTab: TabItem = {
      id: Date.now().toString(),
      label: 'New Tab',
      icon: 'Star',
      order_index: settings.tabs.length,
      enabled: true,
    };
    setSettings({
      ...settings,
      tabs: [...settings.tabs, newTab]
    });
  };

  const removeTab = (id: string) => {
    setSettings({
      ...settings,
      tabs: settings.tabs.filter(tab => tab.id !== id)
    });
  };

  const iconOptions = [
    'Building', 'Target', 'AlertCircle', 'Sparkles', 'Wand', 'Star', 
    'Zap', 'Users', 'TrendingUp', 'Shield', 'Code', 'Heart',
    'Lightbulb', 'Rocket', 'Globe', 'Settings'
  ];

  if (loading) {
    return <div className="text-gray-400">Loading settings...</div>;
  }

  const sectionLabels: Record<keyof SectionsVisibility, string> = {
    hero: 'Hero Section',
    hero_alternative: 'Hero Alternative (White)',
    hero_outcome_cards: 'Hero Outcome Cards (Two-column)',
    work_comparison: 'Work Comparison (Black/White)',
    sidekick_capabilities: 'Sidekick (Half story)',
    sidekick: 'Sidekick (Full story)',
    departments: 'Departments Selector',
    ai_platform: 'AI Work Platform',
    project_management: 'Project Management (New World)',
    agents_showcase: 'Agents Showcase (monday agents)',
    teams_and_agents: 'Teams and Agents',
    teams_and_agents_v2: 'Teams and Agents V2 (Multi-Layout)',
    ai_platform_architecture: 'AI Platform Architecture (Vision)',
  };

  const solutionTabLabels: Record<keyof SolutionTabsVisibility, string> = {
    overview: 'Overview',
    inAction: 'In Action',
    businessValue: 'Business Value',
    test: 'Test',
    products: 'AI-powered Products',
    capabilities: 'AI Work Capabilities',
  };

  const fontSizeOptions = [
    { value: 'small', label: 'Small', size: '1.5rem' },
    { value: 'medium', label: 'Medium', size: '2.25rem' },
    { value: 'large', label: 'Large', size: '3rem' },
    { value: 'xlarge', label: 'Extra Large', size: '3.75rem' },
  ];

  return (
    <div className="max-w-4xl">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
      )}

      {/* Panel Tabs */}
      <div className="flex gap-2 mb-6">
        {(['sections', 'hero', 'tabs'] as const).map((panel) => (
          <button
            key={panel}
            onClick={() => setActivePanel(panel)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activePanel === panel
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {panel === 'sections' ? 'Sections' : panel === 'hero' ? 'Hero Editor' : 'Navigation Tabs'}
          </button>
        ))}
      </div>

      {/* Sections Visibility Panel */}
      {activePanel === 'sections' && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Section Visibility & Order</h2>
          <p className="text-gray-400 text-sm mb-6">
            Drag sections to reorder them on the main page. Toggle visibility with the switch.
          </p>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={settings.sections_order}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {settings.sections_order.map((sectionId) => {
                  const section = sectionId as keyof SectionsVisibility;
                  // Skip if section doesn't exist in visibility settings
                  if (!(section in settings.sections_visibility)) return null;
                  
                  return (
                    <SortableSectionCard
                      key={section}
                      id={section}
                      label={sectionLabels[section]}
                      isVisible={settings.sections_visibility[section]}
                      onToggle={() => toggleSection(section)}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>

          {/* Teams & Agents V2 Layout Variant Selector */}
          {settings.sections_visibility.teams_and_agents_v2 && (
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-indigo-500/30">
              <h3 className="text-md font-semibold text-white mb-3">Teams & Agents V2 - Layout Variant</h3>
              <p className="text-gray-400 text-xs mb-4">Choose the visual layout for the Teams & Agents V2 section.</p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 'mixed_circle' as TeamsAgentsV2Layout, label: 'Mixed Circle', desc: 'Team and agents in a unified circular arrangement' },
                  { value: 'team_with_agents' as TeamsAgentsV2Layout, label: 'Team + Agents Below', desc: 'Team on top, complementary agents below' },
                  { value: 'side_by_side_unified' as TeamsAgentsV2Layout, label: 'Side by Side (Unified)', desc: 'Left/right with flowing gradient connection' },
                  { value: 'cards_layout' as TeamsAgentsV2Layout, label: 'Cards', desc: 'Cards pairing each team member with an AI agent' },
                  { value: 'team_flanked' as TeamsAgentsV2Layout, label: 'Team Flanked', desc: 'Team in center, agents flanking from both sides' },
                ]).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSettings({
                      ...settings,
                      teams_agents_v2_layout: option.value,
                    })}
                    className={`p-3 rounded-lg text-left transition-all ${
                      settings.teams_agents_v2_layout === option.value
                        ? 'bg-indigo-600/30 border-2 border-indigo-500 ring-1 ring-indigo-400/30'
                        : 'bg-gray-700/50 border-2 border-transparent hover:bg-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className={`block text-sm font-medium ${
                      settings.teams_agents_v2_layout === option.value ? 'text-indigo-300' : 'text-white'
                    }`}>
                      {option.label}
                    </span>
                    <span className="block text-xs text-gray-400 mt-1">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Platform Architecture Layout Variant Selector */}
          {settings.sections_visibility.ai_platform_architecture && (
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-cyan-500/30">
              <h3 className="text-md font-semibold text-white mb-3">AI Platform Architecture - Layout Variant</h3>
              <p className="text-gray-400 text-xs mb-4">Choose the visual style. Both show a unified system with agents working in parallel.</p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 'app_frame_board' as AIPlatformArchLayout, label: 'App Frame - Board', desc: 'monday-board-style view with large agent rows, clear AI identity, use-case header, and instruction flow' },
                  { value: 'app_frame_canvas' as AIPlatformArchLayout, label: 'App Frame - Canvas', desc: 'Agent workstations on a visual canvas: each agent has a positioned desk showing task, activity detail, and progress' },
                  { value: 'app_frame_list' as AIPlatformArchLayout, label: 'App Frame - List', desc: 'Structured board with rows: each agent on a line with task detail, progress bar, and status' },
                ]).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSettings({
                      ...settings,
                      ai_platform_arch_layout: option.value,
                    })}
                    className={`p-3 rounded-lg text-left transition-all ${
                      settings.ai_platform_arch_layout === option.value
                        ? 'bg-cyan-600/30 border-2 border-cyan-500 ring-1 ring-cyan-400/30'
                        : 'bg-gray-700/50 border-2 border-transparent hover:bg-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className={`block text-sm font-medium ${
                      settings.ai_platform_arch_layout === option.value ? 'text-cyan-300' : 'text-white'
                    }`}>
                      {option.label}
                    </span>
                    <span className="block text-xs text-gray-400 mt-1">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Solution Tabs Visibility */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Solution Tabs Visibility</h3>
            <p className="text-gray-400 text-sm mb-4">Control which tabs are visible in the AI Work Platform section.</p>
            
            <div className="space-y-3">
              {(Object.keys(settings.solution_tabs_visibility) as Array<keyof SolutionTabsVisibility>).map((tab) => (
                <div
                  key={tab}
                  className={`flex items-center justify-between p-3 bg-gray-800/50 rounded-lg transition-opacity ${
                    settings.solution_tabs_visibility[tab] ? '' : 'opacity-60'
                  }`}
                >
                  <div>
                    <span className="text-white font-medium">{solutionTabLabels[tab]}</span>
                    <span className={`ml-3 text-xs px-2 py-1 rounded ${
                      settings.solution_tabs_visibility[tab]
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-gray-600/20 text-gray-500'
                    }`}>
                      {settings.solution_tabs_visibility[tab] ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleSolutionTab(tab)}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      settings.solution_tabs_visibility[tab] ? 'bg-purple-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.solution_tabs_visibility[tab] ? 'left-8' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Editor Panel */}
      {activePanel === 'hero' && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Hero Section Editor</h2>
          
          {/* Logo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Custom Logo
            </label>
            <div className="flex items-center gap-4">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                onClick={() => logoInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Logo
              </button>
              {settings.hero_settings.logo_url && (
                <div className="relative">
                  <img
                    src={settings.hero_settings.logo_url}
                    alt="Logo preview"
                    className="h-12 w-auto object-contain bg-gray-800 rounded p-2"
                  />
                  <button
                    onClick={() => updateHeroSettings('logo_url', '')}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {!settings.hero_settings.logo_url && (
                <span className="text-gray-500 text-sm">Using default monday.com logo</span>
              )}
            </div>
          </div>

          {/* Platform Label */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Platform Label
            </label>
            <input
              type="text"
              value={settings.hero_settings.platform_label}
              onChange={(e) => updateHeroSettings('platform_label', e.target.value)}
              placeholder="AI Work Platform"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Headline Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Main Headline (Regular Text)
            </label>
            <input
              type="text"
              value={settings.hero_settings.headline_text}
              onChange={(e) => updateHeroSettings('headline_text', e.target.value)}
              placeholder="Empowering every team "
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Headline Gradient Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Headline (Gradient Text)
            </label>
            <input
              type="text"
              value={settings.hero_settings.headline_gradient_text}
              onChange={(e) => updateHeroSettings('headline_gradient_text', e.target.value)}
              placeholder="to accelerate business impact"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-gray-500 text-xs mt-1">This text will have a gradient color effect</p>
          </div>

          {/* Subtitle (legacy field) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={settings.hero_subtitle}
              onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Font Size */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Headline Font Size
            </label>
            <div className="flex gap-2">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateHeroSettings('font_size', option.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    settings.hero_settings.font_size === option.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Background Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Background Type
            </label>
            <div className="flex gap-2 mb-4">
              {(['solid', 'gradient', 'image'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => updateHeroSettings('background_type', type)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    settings.hero_settings.background_type === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Solid Color Picker */}
            {settings.hero_settings.background_type === 'solid' && (
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-400">Color:</label>
                <input
                  type="color"
                  value={settings.hero_settings.background_color}
                  onChange={(e) => updateHeroSettings('background_color', e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.hero_settings.background_color}
                  onChange={(e) => updateHeroSettings('background_color', e.target.value)}
                  className="w-28 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                />
              </div>
            )}

            {/* Gradient Picker */}
            {settings.hero_settings.background_type === 'gradient' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-400 w-16">From:</label>
                  <input
                    type="color"
                    value={settings.hero_settings.background_gradient_from}
                    onChange={(e) => updateHeroSettings('background_gradient_from', e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.hero_settings.background_gradient_from}
                    onChange={(e) => updateHeroSettings('background_gradient_from', e.target.value)}
                    className="w-28 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-400 w-16">To:</label>
                  <input
                    type="color"
                    value={settings.hero_settings.background_gradient_to}
                    onChange={(e) => updateHeroSettings('background_gradient_to', e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.hero_settings.background_gradient_to}
                    onChange={(e) => updateHeroSettings('background_gradient_to', e.target.value)}
                    className="w-28 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                {/* Gradient Preview */}
                <div
                  className="h-12 rounded-lg"
                  style={{
                    background: `linear-gradient(to bottom, ${settings.hero_settings.background_gradient_from}, ${settings.hero_settings.background_gradient_to})`,
                  }}
                />
              </div>
            )}

            {/* Image Upload */}
            {settings.hero_settings.background_type === 'image' && (
              <div className="space-y-4">
                <input
                  ref={bgImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBgImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => bgImageInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Background Image
                </button>
                {settings.hero_settings.background_image_url && (
                  <div className="relative">
                    <img
                      src={settings.hero_settings.background_image_url}
                      alt="Background preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => updateHeroSettings('background_image_url', '')}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hero Preview */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">Preview</h3>
            <div
              className="rounded-lg p-8 text-center min-h-[200px] flex flex-col items-center justify-center"
              style={{
                background:
                  settings.hero_settings.background_type === 'solid'
                    ? settings.hero_settings.background_color
                    : settings.hero_settings.background_type === 'gradient'
                    ? `linear-gradient(to bottom, ${settings.hero_settings.background_gradient_from}, ${settings.hero_settings.background_gradient_to})`
                    : settings.hero_settings.background_image_url
                    ? `url(${settings.hero_settings.background_image_url}) center/cover`
                    : '#000',
              }}
            >
              {settings.hero_settings.logo_url ? (
                <img src={settings.hero_settings.logo_url} alt="Logo" className="h-16 mb-4" />
              ) : (
                <div className="w-24 h-16 bg-gradient-to-r from-purple-500 via-cyan-400 to-yellow-400 rounded mb-4 flex items-center justify-center text-white text-xs">
                  monday.com
                </div>
              )}
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">
                {settings.hero_settings.platform_label}
              </p>
              <p
                style={{
                  fontSize: fontSizeOptions.find(f => f.value === settings.hero_settings.font_size)?.size || '2.25rem',
                }}
              >
                <span className="text-white/80">{settings.hero_settings.headline_text}</span>
                <span className="bg-gradient-to-r from-[#eaecd8] via-[#c7ede0] to-[#6161ff] bg-clip-text text-transparent">
                  {settings.hero_settings.headline_gradient_text}
                </span>
              </p>
              <p className="text-gray-400 text-sm mt-4">{settings.hero_subtitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Editor Panel */}
      {activePanel === 'tabs' && (
        <>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6">Legacy Hero Settings</h2>
            
            {/* Hero Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Main Title (Selector Section)
              </label>
              <input
                type="text"
                value={settings.hero_title}
                onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

      {/* Tabs Editor */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Navigation Tabs</h2>
          <button
            onClick={addTab}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Tab
          </button>
        </div>

        <div className="space-y-3">
          {settings.tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`flex items-center gap-4 bg-gray-800 rounded-lg p-4 transition-opacity ${
                tab.enabled === false ? 'opacity-50' : ''
              }`}
            >
              <GripVertical className="w-5 h-5 text-gray-600 cursor-grab" />
              
              <span className="text-gray-500 text-sm w-6">{index + 1}</span>
              
              <input
                type="text"
                value={tab.label}
                onChange={(e) => updateTab(tab.id, 'label', e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Tab label"
              />
              
              <select
                value={tab.icon}
                onChange={(e) => updateTab(tab.id, 'icon', e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>

              {/* Toggle switch */}
              <button
                onClick={() => updateTab(tab.id, 'enabled', !tab.enabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  tab.enabled !== false ? 'bg-indigo-600' : 'bg-gray-600'
                }`}
                title={tab.enabled !== false ? 'Enabled' : 'Disabled'}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    tab.enabled !== false ? 'left-7' : 'left-1'
                  }`}
                />
              </button>

              <button
                onClick={() => removeTab(tab.id)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

          {/* Preview */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">Preview (showing only enabled tabs)</h3>
            <div className="bg-gray-950 rounded-lg p-8 text-center">
              <div className="flex justify-center gap-2 mb-8">
                {settings.tabs.filter(tab => tab.enabled !== false).map((tab, i) => (
                  <div
                    key={tab.id}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      i === 0 ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{settings.hero_title}</h1>
              <p className="text-gray-400">{settings.hero_subtitle}</p>
            </div>
          </div>
        </>
      )}

      {/* Save Button - Always visible */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
          saved
            ? 'bg-green-600 text-white'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        } disabled:opacity-50`}
      >
        <Save className="w-5 h-5" />
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  );
}
