import { useState } from 'react';
import { Plus, Trash2, GripVertical, Save, X, Edit2, Users } from 'lucide-react';
import type { AgentRow } from '@/types/database';
import { ImageUploader } from './ImageUploader';

// Import agent-related icons
import imgAgents from "@/assets/agents-icon.png";

interface AgentsEditorProps {
  departmentId: string;
  agents: AgentRow[];
  onAdd: (agent: Omit<AgentRow, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdate: (id: string, updates: Partial<AgentRow>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

export function AgentsEditor({ departmentId, agents, onAdd, onUpdate, onDelete, loading }: AgentsEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    image: '',
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', value: '', image: '' });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) return;
    
    await onAdd({
      department_id: departmentId,
      name: formData.name,
      description: formData.description,
      value: formData.value,
      image: formData.image || null,
      order_index: agents.length,
      is_active: true,
    });
    resetForm();
  };

  const handleUpdate = async (id: string) => {
    await onUpdate(id, {
      name: formData.name,
      description: formData.description,
      value: formData.value,
      image: formData.image || null,
    });
    resetForm();
  };

  const startEdit = (agent: AgentRow) => {
    setEditingId(agent.id);
    setFormData({
      name: agent.name,
      description: agent.description || '',
      value: agent.value || '',
      image: agent.image || '',
    });
  };

  if (loading) {
    return <div className="text-gray-400">Loading agents...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Agents ({agents.length})</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Agent
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingId ? 'Edit Agent' : 'Add New Agent'}
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
                  placeholder="e.g. Content Creator"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="What does this agent do?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Value Proposition</label>
                <textarea
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="What value does this agent provide?"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Agent Image</label>
              <ImageUploader
                currentImage={formData.image}
                onUpload={(url) => setFormData({ ...formData, image: url })}
                folder="agents"
                label="Upload Agent Image"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={editingId ? () => handleUpdate(editingId) : handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
            >
              <Save className="w-4 h-4" />
              {editingId ? 'Update' : 'Add Agent'}
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

      {/* Agents List */}
      <div className="space-y-3">
        {agents.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
            <p className="text-gray-400">No agents yet. Add your first agent!</p>
          </div>
        ) : (
          agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center gap-4 bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <GripVertical className="w-5 h-5 text-gray-600 cursor-grab" />
              
              <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                {agent.image ? (
                  <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                ) : (
                  <img src={imgAgents} alt={agent.name} className="w-12 h-12 object-contain" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{agent.name}</h4>
                <p className="text-gray-400 text-sm truncate">{agent.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdate(agent.id, { is_active: !agent.is_active })}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    agent.is_active
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {agent.is_active ? 'Active' : 'Hidden'}
                </button>
                <button
                  onClick={() => startEdit(agent)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this agent?')) {
                      onDelete(agent.id);
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
