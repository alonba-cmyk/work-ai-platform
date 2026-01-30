import { useState } from 'react';
import { AdminSidebar } from './components/AdminSidebar';
import { SiteSettingsEditor } from './components/SiteSettingsEditor';
import { NavigationItemsEditor } from './components/NavigationItemsEditor';
import { KnowledgeBaseEditor } from './components/KnowledgeBaseEditor';
import { Settings, LayoutDashboard, Globe, Target, AlertCircle, Sparkles, Building2, Database, Rocket, ExternalLink, CheckCircle, X } from 'lucide-react';

type NavigationSection = 'site_settings' | 'knowledge_base' | 'outcomes' | 'pain_points' | 'ai_transformations' | 'departments' | null;

type KnowledgeTab = 'products' | 'agents' | 'vibeapps' | 'sidekick';

export default function AdminApp() {
  const [activeNavSection, setActiveNavSection] = useState<NavigationSection>(null);
  const [knowledgeDefaultTab, setKnowledgeDefaultTab] = useState<KnowledgeTab | null>(null);
  const [loading] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Get the base URL for the main site (same origin, just root path)
  const getSiteUrl = () => {
    const baseUrl = window.location.origin;
    // If we're in admin, return the main site URL
    return baseUrl;
  };

  const handleOpenPreview = () => {
    window.open(getSiteUrl(), '_blank');
    setShowPublishModal(false);
  };

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
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowPublishModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg text-white font-medium transition-all shadow-lg shadow-green-900/20"
              >
                <Rocket className="w-5 h-5" />
                Publish
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors">
                <Settings className="w-5 h-5" />
                Settings
              </button>
            </div>
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

      {/* Publish Modal */}
      {showPublishModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowPublishModal(false)}
        >
          <div 
            className="bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Rocket className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Publish Site</h2>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Status Message */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-400 font-medium">השינויים שלך כבר שמורים!</p>
                    <p className="text-green-400/70 text-sm mt-1">
                      כל השינויים שביצעת בדשבורד נשמרים אוטומטית ל-Supabase ומוצגים באתר בזמן אמת.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleOpenPreview}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-white font-medium transition-all shadow-lg"
                >
                  <ExternalLink className="w-5 h-5" />
                  פתח את האתר בחלון חדש
                </button>

                <button
                  onClick={() => setShowPublishModal(false)}
                  className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-colors"
                >
                  סגור
                </button>
              </div>

              {/* Info */}
              <p className="text-gray-500 text-xs text-center mt-4">
                💡 טיפ: השתמש ב-Toggle כדי להסתיר/להציג פריטים באתר
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
