import { useState } from 'react';
import { Plus, Trash2, GripVertical, Save, X, Edit2, Sparkles, Palette, Eye, Zap, RotateCcw } from 'lucide-react';
import type { VibeAppRow } from '@/types/database';
import { ImageUploader } from './ImageUploader';
import { useVibeTheme, vibePresets, VibeCardTheme } from '@/contexts/VibeThemeContext';

// Import Vibe icon
import imgVibe from "@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png";

// Default placeholder images for Vibe apps
const defaultVibeImages = [
  'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Campaign_health_tracker.svg',
  'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Social_media_content_calendar.svg',
  'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Customer_segmentation_app.svg',
  'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Deal_flow_analyzer.svg',
  'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Sales_forecasting_app.svg',
];

interface VibeAppsEditorProps {
  departmentId: string;
  vibeApps: VibeAppRow[];
  onAdd: (app: Omit<VibeAppRow, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdate: (id: string, updates: Partial<VibeAppRow>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

// Live Preview Component
function VibeCardPreview({ 
  name, 
  value, 
  image, 
  theme 
}: { 
  name: string; 
  value: string; 
  image: string; 
  theme: VibeCardTheme;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isBuildYourOwn = name.toLowerCase().includes('build your own');
  
  return (
    <div 
      className="relative w-full h-48 rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
      style={{
        background: theme.cardBackground,
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: theme.cardShadow,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {image && !isBuildYourOwn ? (
        <>
          <img src={image} alt={name} className="w-full h-full object-cover" />
          
          {/* Gradient overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.2) 100%)',
            }}
          />
          
          {/* Info bar */}
          <div 
            className="absolute bottom-0 left-0 right-0 px-4 py-3"
            style={{
              background: theme.infoBarBackground,
              backdropFilter: 'blur(12px)',
              borderTop: `1px solid ${theme.infoBarBorder}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.iconGradientFrom}, ${theme.iconGradientTo})`,
                }}
              >
                <Zap className="w-4 h-4" style={{ color: theme.iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold leading-tight mb-0.5" style={{ color: theme.titleColor }}>
                  {name || 'App Name'}
                </h4>
                <p className="text-xs leading-tight truncate" style={{ color: theme.subtitleColor }}>
                  {value || 'App description'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Hover overlay */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 transition-opacity duration-200"
            style={{
              background: `linear-gradient(135deg, ${theme.hoverGradientFrom}, ${theme.hoverGradientTo})`,
              opacity: isHovered ? 1 : 0,
            }}
          >
            <span className="text-lg font-bold text-white">Open in Vibe</span>
            <span className="text-white/80 text-sm">Click to explore</span>
          </div>
        </>
      ) : (
        // No image / Build your own style
        <div className="w-full h-full p-4 flex flex-col items-center justify-center relative">
          {isBuildYourOwn ? (
            <>
              <div 
                className="absolute inset-0 rounded-xl"
                style={{
                  background: theme.buildYourOwnGradient,
                  padding: '2px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{
                  background: theme.buildYourOwnGradient,
                  boxShadow: '0 8px 24px rgba(255, 131, 224, 0.3)',
                }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 
                className="text-base font-bold text-center mb-1"
                style={{ 
                  backgroundImage: theme.buildYourOwnGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {name || 'Build your own'}
              </h4>
              <p className="text-sm text-white/70 text-center">{value || 'Create custom apps'}</p>
            </>
          ) : (
            <>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{
                  background: `linear-gradient(135deg, ${theme.iconGradientFrom}, ${theme.iconGradientTo})`,
                }}
              >
                <Zap className="w-6 h-6" style={{ color: theme.iconColor }} />
              </div>
              <h4 className="text-base font-bold text-center mb-1" style={{ color: theme.titleColor }}>
                {name || 'App Name'}
              </h4>
              <p className="text-sm text-center" style={{ color: theme.subtitleColor }}>
                {value || 'App description'}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Color Picker Component
function ColorPicker({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-gray-400 w-32">{label}</label>
      <div className="flex items-center gap-2 flex-1">
        <input
          type="color"
          value={value.startsWith('#') ? value : '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}

export function VibeAppsEditor({ departmentId, vibeApps, onAdd, onUpdate, onDelete, loading }: VibeAppsEditorProps) {
  const { theme, presetId, setTheme, applyPreset, resetToDefault } = useVibeTheme();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDesignPanel, setShowDesignPanel] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    icon: 'Sparkles',
    image: '',
    replaces_tools: [] as string[],
  });
  const [newTool, setNewTool] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const resetForm = () => {
    setFormData({ name: '', value: '', icon: 'Sparkles', image: '', replaces_tools: [] });
    setNewTool('');
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) return;
    
    // Assign a default image if none provided
    const imageToUse = formData.image || defaultVibeImages[vibeApps.length % defaultVibeImages.length];
    
    await onAdd({
      department_id: departmentId,
      name: formData.name,
      value: formData.value,
      icon: formData.icon,
      image: imageToUse,
      replaces_tools: formData.replaces_tools,
      order_index: vibeApps.length,
      is_active: true,
    });
    resetForm();
  };

  const handleUpdate = async (id: string) => {
    await onUpdate(id, {
      name: formData.name,
      value: formData.value,
      icon: formData.icon,
      image: formData.image || null,
      replaces_tools: formData.replaces_tools,
    });
    resetForm();
  };

  const startEdit = (app: VibeAppRow) => {
    setEditingId(app.id);
    setFormData({
      name: app.name,
      value: app.value || '',
      icon: app.icon || 'Sparkles',
      image: app.image || '',
      replaces_tools: app.replaces_tools || [],
    });
  };

  const addTool = () => {
    if (newTool.trim()) {
      setFormData({ ...formData, replaces_tools: [...formData.replaces_tools, newTool.trim()] });
      setNewTool('');
    }
  };

  const removeTool = (index: number) => {
    setFormData({ 
      ...formData, 
      replaces_tools: formData.replaces_tools.filter((_, i) => i !== index) 
    });
  };

  const updateThemeProperty = (key: keyof VibeCardTheme, value: string) => {
    setTheme({ ...theme, [key]: value });
    setHasChanges(true);
  };

  const handleSaveDesign = () => {
    setHasChanges(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleResetDesign = () => {
    resetToDefault();
    setHasChanges(false);
  };

  if (loading) {
    return <div className="text-gray-400">Loading vibe apps...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Vibe Apps ({vibeApps.length})</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDesignPanel(!showDesignPanel)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${
              showDesignPanel 
                ? 'bg-pink-600 hover:bg-pink-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <Palette className="w-4 h-4" />
            Design Settings
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Vibe App
          </button>
        </div>
      </div>

      {/* Design Settings Panel */}
      {showDesignPanel && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-pink-500/30 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-pink-400" />
              <h3 className="text-lg font-semibold text-white">Vibe Card Design</h3>
            </div>
            <div className="flex items-center gap-3">
              {showSaved && (
                <span className="text-green-400 text-sm">Saved!</span>
              )}
              <button
                onClick={handleResetDesign}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 text-sm transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
              <button
                onClick={handleSaveDesign}
                disabled={!hasChanges}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-white text-sm transition-colors ${
                  hasChanges 
                    ? 'bg-pink-600 hover:bg-pink-700' 
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Left: Settings */}
            <div className="space-y-6">
              {/* Preset Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Theme Preset</label>
                <div className="flex gap-2">
                  {vibePresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        applyPreset(preset.id);
                        setHasChanges(true);
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        presetId === preset.id
                          ? 'bg-pink-600 text-white ring-2 ring-pink-400'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Card Styling</label>
                <div className="space-y-3 bg-gray-800/50 p-4 rounded-lg">
                  <ColorPicker 
                    label="Card Border" 
                    value={theme.cardBorder} 
                    onChange={(v) => updateThemeProperty('cardBorder', v)} 
                  />
                  <ColorPicker 
                    label="Icon Color" 
                    value={theme.iconColor} 
                    onChange={(v) => updateThemeProperty('iconColor', v)} 
                  />
                  <ColorPicker 
                    label="Title Color" 
                    value={theme.titleColor} 
                    onChange={(v) => updateThemeProperty('titleColor', v)} 
                  />
                  <ColorPicker 
                    label="Subtitle Color" 
                    value={theme.subtitleColor} 
                    onChange={(v) => updateThemeProperty('subtitleColor', v)} 
                  />
                </div>
              </div>

              {/* Hover Effect */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Hover Effect Gradient</label>
                <div className="space-y-3 bg-gray-800/50 p-4 rounded-lg">
                  <ColorPicker 
                    label="Gradient From" 
                    value={theme.hoverGradientFrom} 
                    onChange={(v) => updateThemeProperty('hoverGradientFrom', v)} 
                  />
                  <ColorPicker 
                    label="Gradient To" 
                    value={theme.hoverGradientTo} 
                    onChange={(v) => updateThemeProperty('hoverGradientTo', v)} 
                  />
                </div>
              </div>
            </div>

            {/* Right: Live Preview */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-300">Live Preview</label>
              </div>
              <div className="bg-gray-950 rounded-xl p-6 border border-gray-800">
                <div className="grid grid-cols-2 gap-4">
                  <VibeCardPreview 
                    name="Campaign Tracker" 
                    value="Track campaign performance" 
                    image={defaultVibeImages[0]}
                    theme={theme}
                  />
                  <VibeCardPreview 
                    name="Build your own" 
                    value="Create custom apps" 
                    image=""
                    theme={theme}
                  />
                </div>
                <p className="text-gray-500 text-xs text-center mt-4">
                  Hover over cards to see the effect
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingId ? 'Edit Vibe App' : 'Add New Vibe App'}
          </h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Social Media Calendar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Value</label>
                <textarea
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="What value does this app provide?"
                />
              </div>
              
              {/* Replaces Tools */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Replaces Tools</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Hootsuite"
                  />
                  <button
                    onClick={addTool}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.replaces_tools.map((tool, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                    >
                      {tool}
                      <button onClick={() => removeTool(i)} className="hover:text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">App Image</label>
                <ImageUploader
                  currentImage={formData.image}
                  onUpload={(url) => setFormData({ ...formData, image: url })}
                  folder="vibeapps"
                  label="Upload App Image"
                />
              </div>
              
              {/* Live Preview */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-300">Preview</label>
                </div>
                <VibeCardPreview 
                  name={formData.name}
                  value={formData.value}
                  image={formData.image || defaultVibeImages[vibeApps.length % defaultVibeImages.length]}
                  theme={theme}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={editingId ? () => handleUpdate(editingId) : handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
            >
              <Save className="w-4 h-4" />
              {editingId ? 'Update' : 'Add Vibe App'}
            </button>
            <button
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Vibe Apps List */}
      <div className="space-y-3">
        {vibeApps.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
            <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No vibe apps yet. Add your first vibe app!</p>
          </div>
        ) : (
          vibeApps.map((app) => (
            <div
              key={app.id}
              className="flex items-center gap-4 bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <GripVertical className="w-5 h-5 text-gray-600 cursor-grab" />
              
              <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                {app.image ? (
                  <img src={app.image} alt={app.name} className="w-full h-full object-cover" />
                ) : (
                  <img src={imgVibe} alt={app.name} className="w-12 h-12 object-contain" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{app.name}</h4>
                <p className="text-gray-400 text-sm truncate">{app.value}</p>
                {app.replaces_tools && app.replaces_tools.length > 0 && (
                  <p className="text-gray-500 text-xs mt-1">Replaces: {app.replaces_tools.join(', ')}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdate(app.id, { is_active: !app.is_active })}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    app.is_active
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {app.is_active ? 'Active' : 'Hidden'}
                </button>
                <button
                  onClick={() => startEdit(app)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this vibe app?')) {
                      onDelete(app.id);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
