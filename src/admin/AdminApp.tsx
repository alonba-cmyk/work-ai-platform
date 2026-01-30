import { useState } from 'react';
import { AdminSidebar } from './components/AdminSidebar';
import { SiteSettingsEditor } from './components/SiteSettingsEditor';
import { NavigationItemsEditor } from './components/NavigationItemsEditor';
import { KnowledgeBaseEditor } from './components/KnowledgeBaseEditor';
import { Settings, LayoutDashboard, Globe, Target, AlertCircle, Sparkles, Building2, Database } from 'lucide-react';

type NavigationSection = 'site_settings' | 'knowledge_base' | 'outcomes' | 'pain_points' | 'ai_transformations' | 'departments' | null;

type KnowledgeTab = 'products' | 'agents' | 'vibeapps' | 'sidekick';

export default function AdminApp() {
  const [activeNavSection, setActiveNavSection] = useState<NavigationSection>(null);
  const [knowledgeDefaultTab, setKnowledgeDefaultTab] = useState<KnowledgeTab | null>(null);
  const [loading] = useState(false);

  // Navigate to Knowledge Base with a specific tab open
  const navigateToKnowledge = (tab?: KnowledgeTab) => {
    setKnowledgeDefaultTab(tab || null);
    setActiveNavSection('knowledge_base');
  };

  const handleSelectNavSection = (section: NavigationSection) => {
    setActiveNavSection(section);
  };

  const getNavSectionTitle = () => {
    switch (activeNavSection) {
      case 'site_settings': return 'Site Settings';
      case 'knowledge_base': return 'Knowledge Base';
      case 'outcomes': return 'Business Outcomes';
      case 'pain_points': return 'Pain Points';
      case 'ai_transformations': return 'AI Transformations';
      case 'departments': return 'Departments';
      default: return 'Admin Dashboard';
    }
  };

  const getNavSectionSubtitle = () => {
    switch (activeNavSection) {
      case 'site_settings': return 'Edit hero section, navigation tabs, and site content';
      case 'knowledge_base': return 'Central source of truth for all AI capabilities and products';
      case 'outcomes': return 'Manage business outcomes navigation items';
      case 'pain_points': return 'Manage pain points navigation items';
      case 'ai_transformations': return 'Manage AI transformations navigation items';
      case 'departments': return 'Manage departments and their content';
      default: return 'Select a section from the sidebar to start editing';
    }
  };

  const getNavSectionIcon = () => {
    switch (activeNavSection) {
      case 'site_settings': return <Globe className="w-6 h-6 text-blue-500" />;
      case 'outcomes': return <Target className="w-6 h-6 text-green-500" />;
      case 'pain_points': return <AlertCircle className="w-6 h-6 text-amber-500" />;
      case 'ai_transformations': return <Sparkles className="w-6 h-6 text-purple-500" />;
      case 'departments': return <Building2 className="w-6 h-6 text-indigo-500" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <AdminSidebar
        activeNavSection={activeNavSection}
        onSelectNavSection={handleSelectNavSection}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{getNavSectionTitle()}</h1>
              <p className="text-gray-400 text-sm mt-1">{getNavSectionSubtitle()}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors">
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          {/* Site Settings */}
          {activeNavSection === 'site_settings' && (
            <SiteSettingsEditor onBack={() => setActiveNavSection(null)} />
          )}

          {/* Knowledge Base */}
          {activeNavSection === 'knowledge_base' && (
            <KnowledgeBaseEditor 
              defaultTab={knowledgeDefaultTab} 
              onTabChange={() => setKnowledgeDefaultTab(null)}
              onBack={() => setActiveNavSection(null)}
            />
          )}

          {/* Navigation Items Editors */}
          {activeNavSection === 'outcomes' && (
            <NavigationItemsEditor
              type="outcomes"
              title="Business Outcomes"
              icon={<Target className="w-6 h-6 text-green-500" />}
              onNavigateToKnowledge={navigateToKnowledge}
              onBack={() => setActiveNavSection(null)}
            />
          )}
          {activeNavSection === 'pain_points' && (
            <NavigationItemsEditor
              type="pain_points"
              title="Pain Points"
              icon={<AlertCircle className="w-6 h-6 text-amber-500" />}
              onNavigateToKnowledge={navigateToKnowledge}
              onBack={() => setActiveNavSection(null)}
            />
          )}
          {activeNavSection === 'ai_transformations' && (
            <NavigationItemsEditor
              type="ai_transformations"
              title="AI Transformations"
              icon={<Sparkles className="w-6 h-6 text-purple-500" />}
              onNavigateToKnowledge={navigateToKnowledge}
              onBack={() => setActiveNavSection(null)}
            />
          )}

          {/* Departments Editor - Now using same pattern as other intent types */}
          {activeNavSection === 'departments' && (
            <NavigationItemsEditor
              type="departments"
              title="Departments"
              icon={<Building2 className="w-6 h-6 text-indigo-500" />}
              onNavigateToKnowledge={navigateToKnowledge}
              onBack={() => setActiveNavSection(null)}
            />
          )}

          {/* Welcome Screen */}
          {!activeNavSection && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LayoutDashboard className="w-12 h-12 text-gray-600" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Welcome to Admin Panel</h2>
                <p className="text-gray-400 mb-8">Select a section from the sidebar to start editing</p>
                
                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                  <button
                    onClick={() => setActiveNavSection('site_settings')}
                    className="flex items-center gap-3 p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors text-left"
                  >
                    <Globe className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-white font-medium">Site Settings</p>
                      <p className="text-gray-400 text-sm">Hero & Tabs</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveNavSection('knowledge_base')}
                    className="flex items-center gap-3 p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors text-left"
                  >
                    <Database className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-white font-medium">Knowledge Base</p>
                      <p className="text-gray-400 text-sm">All AI content</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveNavSection('departments')}
                    className="flex items-center gap-3 p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors text-left"
                  >
                    <Building2 className="w-8 h-8 text-indigo-500" />
                    <div>
                      <p className="text-white font-medium">Departments</p>
                      <p className="text-gray-400 text-sm">Manage content</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveNavSection('outcomes')}
                    className="flex items-center gap-3 p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors text-left"
                  >
                    <Target className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-white font-medium">Outcomes</p>
                      <p className="text-gray-400 text-sm">Business goals</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
