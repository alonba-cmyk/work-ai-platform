import { useState } from 'react';
import { Plus, Trash2, GripVertical, Save, X, Edit2, Package } from 'lucide-react';
import type { ProductRow } from '@/types/database';
import { ImageUploader } from './ImageUploader';

// Import product icons
import imgWM from "@/assets/5d4f550f18adfa644c6653f867bc960bdc8a53dc.png";
import imgCRM from "@/assets/6cf10de3ca3f528bc9d9457024ed87915acf1b6f.png";
import imgCampaigns from "@/assets/41abe475f056daef6e610ed3282d554ea3b88606.png";
import imgService from "@/assets/9fae7b5cd33e1ccaf1f329bad81508b9daae5210.png";
import imgDev from "@/assets/f416d94ad48b77a56df38e1f5ca7412f0e86202f.png";
import imgVibe from "@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png";
import imgSidekick from "@/assets/sidekick-icon.png";
import imgAgents from "@/assets/agents-icon.png";
import imgWorkflows from "@/assets/workflows-icon.png";

// Get the correct icon based on product name
function getProductIcon(name: string): string | null {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('work management')) return imgWM;
  if (nameLower.includes('crm')) return imgCRM;
  if (nameLower.includes('campaign')) return imgCampaigns;
  if (nameLower.includes('service')) return imgService;
  if (nameLower.includes('dev')) return imgDev;
  if (nameLower.includes('vibe')) return imgVibe;
  if (nameLower.includes('sidekick')) return imgSidekick;
  if (nameLower.includes('workflow')) return imgWorkflows;
  if (nameLower.includes('agent')) return imgAgents;
  return null;
}

interface ProductsEditorProps {
  departmentId: string;
  products: ProductRow[];
  onAdd: (product: Omit<ProductRow, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdate: (id: string, updates: Partial<ProductRow>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

export function ProductsEditor({ departmentId, products, onAdd, onUpdate, onDelete, loading }: ProductsEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    image: '',
    use_cases: [] as string[],
  });
  const [newUseCase, setNewUseCase] = useState('');

  const resetForm = () => {
    setFormData({ name: '', description: '', value: '', image: '', use_cases: [] });
    setNewUseCase('');
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
      use_cases: formData.use_cases,
      replaces_tools: [],
      order_index: products.length,
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
      use_cases: formData.use_cases,
    });
    resetForm();
  };

  const startEdit = (product: ProductRow) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      value: product.value || '',
      image: product.image || '',
      use_cases: product.use_cases || [],
    });
  };

  const addUseCase = () => {
    if (newUseCase.trim()) {
      setFormData({ ...formData, use_cases: [...formData.use_cases, newUseCase.trim()] });
      setNewUseCase('');
    }
  };

  const removeUseCase = (index: number) => {
    setFormData({ 
      ...formData, 
      use_cases: formData.use_cases.filter((_, i) => i !== index) 
    });
  };

  if (loading) {
    return <div className="text-gray-400">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Products ({products.length})</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingId ? 'Edit Product' : 'Add New Product'}
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
                  placeholder="e.g. Work Management"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Value Proposition</label>
                <textarea
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
              
              {/* Use Cases */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Use Cases</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newUseCase}
                    onChange={(e) => setNewUseCase(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addUseCase())}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Add a use case"
                  />
                  <button
                    onClick={addUseCase}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.use_cases.map((uc, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                    >
                      {uc}
                      <button onClick={() => removeUseCase(i)} className="hover:text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Product Image</label>
              <ImageUploader
                currentImage={formData.image}
                onUpload={(url) => setFormData({ ...formData, image: url })}
                folder="products"
                label="Upload Product Image"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={editingId ? () => handleUpdate(editingId) : handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
            >
              <Save className="w-4 h-4" />
              {editingId ? 'Update' : 'Add Product'}
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

      {/* Products List */}
      <div className="space-y-3">
        {products.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No products yet. Add your first product!</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <GripVertical className="w-5 h-5 text-gray-600 cursor-grab" />
              
              <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                {(() => {
                  const icon = getProductIcon(product.name);
                  // Priority: 1) Product icon by name, 2) DB image, 3) Fallback
                  if (icon) {
                    return <img src={icon} alt={product.name} className="w-12 h-12 object-contain" />;
                  } else if (product.image) {
                    return <img src={product.image} alt={product.name} className="w-full h-full object-cover" />;
                  } else {
                    return <Package className="w-6 h-6 text-gray-600" />;
                  }
                })()}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{product.name}</h4>
                <p className="text-gray-400 text-sm truncate">{product.description}</p>
                {product.use_cases && product.use_cases.length > 0 && (
                  <p className="text-gray-500 text-xs mt-1">{product.use_cases.length} use cases</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdate(product.id, { is_active: !product.is_active })}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.is_active
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {product.is_active ? 'Active' : 'Hidden'}
                </button>
                <button
                  onClick={() => startEdit(product)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this product?')) {
                      onDelete(product.id);
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
