import { Home, Globe, Target, AlertCircle, Sparkles, Building2, Database } from 'lucide-react';

type NavigationSection = 'site_settings' | 'knowledge_base' | 'outcomes' | 'pain_points' | 'ai_transformations' | 'departments' | null;

interface AdminSidebarProps {
  activeNavSection: NavigationSection;
  onSelectNavSection: (section: NavigationSection) => void;
}

export function AdminSidebar({ 
  activeNavSection,
  onSelectNavSection 
}: AdminSidebarProps) {
  const mainNavItems = [
    { id: 'site_settings' as const, label: 'Site Settings', icon: Globe, color: '#3b82f6' },
    { id: 'knowledge_base' as const, label: 'Knowledge Base', icon: Database, color: '#8b5cf6' },
  ];

  // All intent types are now grouped together
  const intentTypeItems = [
    { id: 'departments' as const, label: 'Departments', icon: Building2, color: '#6366f1' },
    { id: 'outcomes' as const, label: 'Outcomes', icon: Target, color: '#10b981' },
    { id: 'pain_points' as const, label: 'Pain Points', icon: AlertCircle, color: '#f59e0b' },
    { id: 'ai_transformations' as const, label: 'AI Transformations', icon: Sparkles, color: '#8b5cf6' },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-white font-bold">Admin Panel</h1>
            <p className="text-gray-500 text-xs">AI Work Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-auto">
        {/* Dashboard link */}
        <button
          onClick={() => onSelectNavSection(null)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
            activeNavSection === null
              ? 'bg-indigo-600/20 text-indigo-400'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </button>

        {/* Main Navigation */}
        <div className="mt-4">
          <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 px-4">
            Settings
          </h3>
          <div className="space-y-1">
            {mainNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => onSelectNavSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeNavSection === item.id
                    ? 'bg-indigo-600/20 text-indigo-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon 
                  className="w-5 h-5" 
                  style={{ color: activeNavSection === item.id ? undefined : item.color }} 
                />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Intent Types Section - All customer entry points */}
        <div className="mt-6">
          <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 px-4">
            Intent Types
          </h3>
          <div className="space-y-1">
            {intentTypeItems.map(item => (
              <button
                key={item.id}
                onClick={() => onSelectNavSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeNavSection === item.id
                    ? 'bg-indigo-600/20 text-indigo-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon 
                  className="w-5 h-5" 
                  style={{ color: activeNavSection === item.id ? undefined : item.color }} 
                />
                <span className="flex-1 text-left truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-center text-gray-500 text-xs">
          <p>AI Work Platform CMS</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
