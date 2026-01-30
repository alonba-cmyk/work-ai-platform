import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GripVertical, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TabItem {
  id: string;
  label: string;
  icon: string;
  order_index: number;
}

interface SiteSettings {
  hero_title: string;
  hero_subtitle: string;
  tabs: TabItem[];
}

interface SiteSettingsEditorProps {
  onBack?: () => void;
}

export function SiteSettingsEditor({ onBack }: SiteSettingsEditorProps) {
  const [settings, setSettings] = useState<SiteSettings>({
    hero_title: 'What would you like to achieve?',
    hero_subtitle: 'Choose your department to see your tailored AI solution',
    tabs: [
      { id: '1', label: 'Department', icon: 'Building', order_index: 0 },
      { id: '2', label: 'Outcome', icon: 'Target', order_index: 1 },
      { id: '3', label: 'Pain Point', icon: 'AlertCircle', order_index: 2 },
      { id: '4', label: 'AI Transformation', icon: 'Sparkles', order_index: 3 },
      { id: '5', label: 'Custom Solution', icon: 'Wand', order_index: 4 },
    ]
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

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
        setSettings({
          hero_title: data.hero_title || settings.hero_title,
          hero_subtitle: data.hero_subtitle || settings.hero_subtitle,
          tabs: data.tabs || settings.tabs,
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
      
      const { error: updateError } = await supabase
        .from('site_settings')
        .upsert({
          id: 'main',
          hero_title: settings.hero_title,
          hero_subtitle: settings.hero_subtitle,
          tabs: settings.tabs,
          updated_at: new Date().toISOString(),
        });

      if (updateError) {
        console.error('Save error:', updateError);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
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

  return (
    <div className="max-w-3xl">
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

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
        <h2 className="text-xl font-semibold text-white mb-6">Hero Section</h2>
        
        {/* Hero Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Main Title
          </label>
          <input
            type="text"
            value={settings.hero_title}
            onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Hero Subtitle */}
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
              className="flex items-center gap-4 bg-gray-800 rounded-lg p-4"
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
        <h3 className="text-sm font-semibold text-gray-400 mb-4">Preview</h3>
        <div className="bg-gray-950 rounded-lg p-8 text-center">
          <div className="flex justify-center gap-2 mb-8">
            {settings.tabs.map((tab, i) => (
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

      {/* Save Button */}
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
