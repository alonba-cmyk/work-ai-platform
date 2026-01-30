import { useState } from 'react';
import { Plus, Trash2, GripVertical, Save, X, Edit2, Sparkles } from 'lucide-react';
import type { VibeAppRow } from '@/types/database';
import { ImageUploader } from './ImageUploader';

// Import Vibe icon
import imgVibe from "@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png";

interface VibeAppsEditorProps {
  departmentId: string;
  vibeApps: VibeAppRow[];
  onAdd: (app: Omit<VibeAppRow, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdate: (id: string, updates: Partial<VibeAppRow>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

export function VibeAppsEditor({ departmentId, vibeApps, onAdd, onUpdate, onDelete, loading }: VibeAppsEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    icon: 'Sparkles',
    image: '',
    replaces_tools: [] as string[],
  });
  const [newTool, setNewTool] = useState('');

  const resetForm = () => {
    setFormData({ name: '', value: '', icon: 'Sparkles', image: '', replaces_tools: [] });
    setNewTool('');
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) return;
    
    await onAdd({
      department_id: departmentId,
      name: formData.name,
      value: formData.value,
      icon: formData.icon,
      image: formData.image || null,
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

  if (loading) {
    return <div className="text-gray-400">Loading vibe apps...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Vibe Apps ({vibeApps.length})</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Vibe App
        </button>
      </div>

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
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">App Image</label>
              <ImageUploader
                currentImage={formData.image}
                onUpload={(url) => setFormData({ ...formData, image: url })}
                folder="vibeapps"
                label="Upload App Image"
              />
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
