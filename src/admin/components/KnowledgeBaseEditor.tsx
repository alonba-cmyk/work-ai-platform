import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Edit2, Package, Users, Sparkles, Zap, Database, ChevronRight, Building2, Target, AlertCircle, Wand2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
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

// Get the correct icon based on item name
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

// Get tab-specific default icon
function getTabDefaultIcon(tabId: TabType): string | null {
  switch (tabId) {
    case 'agents': return imgAgents;
    case 'vibeapps': return imgVibe;
    case 'sidekick': return imgSidekick;
    default: return null;
  }
}

type TabType = 'products' | 'agents' | 'vibeapps' | 'sidekick';

interface ContentItem {
  id: string;
  name: string;
  description: string | null;
  value: string | null;
  image: string | null;
  department_id: string | null;
  order_index: number;
  is_active: boolean;
}

interface Department {
  id: string;
  name: string;
  title: string;
}

// Generic Intent Type (Departments, Outcomes, Pain Points, AI Transformations)
interface IntentType {
  id: string;
  title: string;
  avatar_color?: string;
}

// Tracks where each item is linked
interface ItemLinks {
  departments: number;
  outcomes: number;
  painPoints: number;
  aiTransformations: number;
}

const tabs = [
  { 
    id: 'products' as TabType, 
    label: 'Products', 
    icon: Package, 
    iconImage: null,
    table: 'products',
    description: 'AI-powered products like Work Management, CRM, Service, Dev',
    color: '#6366f1'
  },
  { 
    id: 'agents' as TabType, 
    label: 'Agents', 
    icon: Users, 
    iconImage: imgAgents,
    table: 'agents',
    description: 'AI agents that perform specialized tasks',
    color: '#8b5cf6'
  },
  { 
    id: 'vibeapps' as TabType, 
    label: 'Vibe Apps', 
    icon: Sparkles, 
    iconImage: imgVibe,
    table: 'vibe_apps',
    description: 'Custom apps built with Vibe AI app builder',
    color: '#ec4899'
  },
  { 
    id: 'sidekick' as TabType, 
    label: 'Sidekick', 
    icon: Zap, 
    iconImage: imgSidekick,
    table: 'sidekick_actions',
    description: 'Quick AI actions available everywhere',
    color: '#f59e0b'
  },
];

interface KnowledgeBaseEditorProps {
  defaultTab?: TabType | null;
  onTabChange?: () => void;
  onBack?: () => void;
}

export function KnowledgeBaseEditor({ defaultTab, onTabChange, onBack }: KnowledgeBaseEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab || 'products');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Link counts per item (shows where each item is used)
  const [itemLinks, setItemLinks] = useState<Record<string, ItemLinks>>({});

  // All Intent Types for assignment in edit form
  const [allDepartments, setAllDepartments] = useState<IntentType[]>([]);
  const [allOutcomes, setAllOutcomes] = useState<IntentType[]>([]);
  const [allPainPoints, setAllPainPoints] = useState<IntentType[]>([]);
  const [allAITransformations, setAllAITransformations] = useState<IntentType[]>([]);

  // Linked Intent Type IDs for currently edited item
  const [linkedDepts, setLinkedDepts] = useState<string[]>([]);
  const [linkedOutcomes, setLinkedOutcomes] = useState<string[]>([]);
  const [linkedPainPoints, setLinkedPainPoints] = useState<string[]>([]);
  const [linkedAITrans, setLinkedAITrans] = useState<string[]>([]);

  // Pending changes for Intent Type assignments (for Save button functionality)
  const [pendingIntentAdditions, setPendingIntentAdditions] = useState<{
    departments: Set<string>;
    outcomes: Set<string>;
    pain_points: Set<string>;
    ai_transformations: Set<string>;
  }>({ departments: new Set(), outcomes: new Set(), pain_points: new Set(), ai_transformations: new Set() });
  
  const [pendingIntentRemovals, setPendingIntentRemovals] = useState<{
    departments: Set<string>;
    outcomes: Set<string>;
    pain_points: Set<string>;
    ai_transformations: Set<string>;
  }>({ departments: new Set(), outcomes: new Set(), pain_points: new Set(), ai_transformations: new Set() });
  
  const [isSavingIntents, setIsSavingIntents] = useState(false);

  // Calculate if there are unsaved intent changes
  const hasUnsavedIntentChanges = 
    pendingIntentAdditions.departments.size > 0 || pendingIntentAdditions.outcomes.size > 0 || 
    pendingIntentAdditions.pain_points.size > 0 || pendingIntentAdditions.ai_transformations.size > 0 ||
    pendingIntentRemovals.departments.size > 0 || pendingIntentRemovals.outcomes.size > 0 || 
    pendingIntentRemovals.pain_points.size > 0 || pendingIntentRemovals.ai_transformations.size > 0;

  const pendingIntentChangesCount = 
    pendingIntentAdditions.departments.size + pendingIntentAdditions.outcomes.size + 
    pendingIntentAdditions.pain_points.size + pendingIntentAdditions.ai_transformations.size +
    pendingIntentRemovals.departments.size + pendingIntentRemovals.outcomes.size + 
    pendingIntentRemovals.pain_points.size + pendingIntentRemovals.ai_transformations.size;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    image: '',
    department_id: '',
  });

  const currentTab = tabs.find(t => t.id === activeTab)!;

  // Switch to default tab when it's provided (from navigation)
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
      onTabChange?.();
    }
  }, [defaultTab]);

  useEffect(() => {
    fetchDepartments();
    fetchAllIntentTypes();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchDepartments = async () => {
    const { data } = await supabase.from('departments').select('id, name, title').order('order_index');
    if (data) setDepartments(data);
  };

  // Fetch all Intent Types for assignment UI
  const fetchAllIntentTypes = async () => {
    const [depts, outcomes, painPoints, aiTrans] = await Promise.all([
      supabase.from('departments').select('id, title, avatar_color').order('order_index'),
      supabase.from('outcomes').select('id, title, avatar_color').order('order_index'),
      supabase.from('pain_points').select('id, title, avatar_color').order('order_index'),
      supabase.from('ai_transformations').select('id, title, avatar_color').order('order_index'),
    ]);

    if (depts.data) setAllDepartments(depts.data);
    if (outcomes.data) setAllOutcomes(outcomes.data);
    if (painPoints.data) setAllPainPoints(painPoints.data);
    if (aiTrans.data) setAllAITransformations(aiTrans.data);
  };

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(currentTab.table)
      .select('*')
      .order('order_index');
    
    if (!error && data) {
      setItems(data);
      // Fetch link counts for these items
      await fetchItemLinks(data.map(item => item.id));
    }
    setLoading(false);
  };

  // Fetch where each item is linked (departments, outcomes, pain_points, ai_transformations)
  const fetchItemLinks = async (itemIds: string[]) => {
    if (itemIds.length === 0) {
      setItemLinks({});
      return;
    }

    const idFieldName = activeTab === 'products' ? 'product_id' :
                        activeTab === 'agents' ? 'agent_id' :
                        activeTab === 'vibeapps' ? 'vibe_app_id' : 'sidekick_action_id';

    const contentType = activeTab === 'vibeapps' ? 'vibe_apps' : 
                        activeTab === 'sidekick' ? 'sidekick_actions' : activeTab;

    // Fetch from all junction tables in parallel
    const [deptLinks, outcomeLinks, painPointLinks, aiTransLinks] = await Promise.all([
      supabase.from(`department_${contentType}`).select(idFieldName),
      supabase.from(`outcome_${contentType}`).select(idFieldName),
      supabase.from(`pain_point_${contentType}`).select(idFieldName),
      supabase.from(`ai_transformation_${contentType}`).select(idFieldName),
    ]);

    // Count links per item
    const links: Record<string, ItemLinks> = {};
    itemIds.forEach(id => {
      links[id] = { departments: 0, outcomes: 0, painPoints: 0, aiTransformations: 0 };
    });

    // Count department links
    (deptLinks.data || []).forEach((link: any) => {
      const itemId = link[idFieldName];
      if (links[itemId]) links[itemId].departments++;
    });

    // Count outcome links
    (outcomeLinks.data || []).forEach((link: any) => {
      const itemId = link[idFieldName];
      if (links[itemId]) links[itemId].outcomes++;
    });

    // Count pain point links
    (painPointLinks.data || []).forEach((link: any) => {
      const itemId = link[idFieldName];
      if (links[itemId]) links[itemId].painPoints++;
    });

    // Count AI transformation links
    (aiTransLinks.data || []).forEach((link: any) => {
      const itemId = link[idFieldName];
      if (links[itemId]) links[itemId].aiTransformations++;
    });

    setItemLinks(links);
  };

  const resetForm = (skipWarning = false) => {
    // Check for unsaved changes before resetting
    if (!skipWarning && hasUnsavedIntentChanges && !confirm('You have unsaved assignment changes. Discard them?')) {
      return;
    }
    
    setFormData({
      name: '',
      description: '',
      value: '',
      image: '',
      department_id: '',
    });
    setShowAddForm(false);
    setEditingId(null);
    clearLinkedIntentTypes();
    resetPendingIntentChanges();
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) return;

    const insertData: Record<string, unknown> = {
      name: formData.name,
      description: formData.description || null,
      value: formData.value || null,
      image: formData.image || null,
      order_index: items.length,
      is_active: true,
    };

    // Only add department_id if selected
    if (formData.department_id) {
      insertData.department_id = formData.department_id;
    }

    const { error } = await supabase.from(currentTab.table).insert(insertData);

    if (!error) {
      await fetchItems();
      resetForm();
    }
  };

  const handleUpdate = async (id: string) => {
    const updateData: Record<string, unknown> = {
      name: formData.name,
      description: formData.description || null,
      value: formData.value || null,
      image: formData.image || null,
    };

    if (formData.department_id) {
      updateData.department_id = formData.department_id;
    }

    const { error } = await supabase
      .from(currentTab.table)
      .update(updateData)
      .eq('id', id);

    if (!error) {
      await fetchItems();
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase.from(currentTab.table).delete().eq('id', id);
    if (!error) {
      await fetchItems();
    }
  };

  const startEdit = async (item: ContentItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      description: item.description || '',
      value: item.value || '',
      image: item.image || '',
      department_id: item.department_id || '',
    });
    // Fetch linked Intent Types for this item
    await fetchLinkedIntentTypes(item.id);
  };

  // Fetch which Intent Types this item is linked to
  const fetchLinkedIntentTypes = async (itemId: string) => {
    const idFieldName = activeTab === 'products' ? 'product_id' :
                        activeTab === 'agents' ? 'agent_id' :
                        activeTab === 'vibeapps' ? 'vibe_app_id' : 'sidekick_action_id';

    const contentType = activeTab === 'vibeapps' ? 'vibe_apps' : 
                        activeTab === 'sidekick' ? 'sidekick_actions' : activeTab;

    try {
      const [deptLinks, outcomeLinks, painPointLinks, aiTransLinks] = await Promise.all([
        supabase.from(`department_${contentType}`).select('department_id').eq(idFieldName, itemId),
        supabase.from(`outcome_${contentType}`).select('outcome_id').eq(idFieldName, itemId),
        supabase.from(`pain_point_${contentType}`).select('pain_point_id').eq(idFieldName, itemId),
        supabase.from(`ai_transformation_${contentType}`).select('ai_transformation_id').eq(idFieldName, itemId),
      ]);

      setLinkedDepts((deptLinks.data || []).map((l: any) => l.department_id));
      setLinkedOutcomes((outcomeLinks.data || []).map((l: any) => l.outcome_id));
      setLinkedPainPoints((painPointLinks.data || []).map((l: any) => l.pain_point_id));
      setLinkedAITrans((aiTransLinks.data || []).map((l: any) => l.ai_transformation_id));
    } catch (error) {
      console.error('Error fetching linked Intent Types:', error);
      setLinkedDepts([]);
      setLinkedOutcomes([]);
      setLinkedPainPoints([]);
      setLinkedAITrans([]);
    }
  };

  // Clear linked Intent Types when form is reset
  const clearLinkedIntentTypes = () => {
    setLinkedDepts([]);
    setLinkedOutcomes([]);
    setLinkedPainPoints([]);
    setLinkedAITrans([]);
  };

  // Reset pending intent changes
  const resetPendingIntentChanges = () => {
    setPendingIntentAdditions({ departments: new Set(), outcomes: new Set(), pain_points: new Set(), ai_transformations: new Set() });
    setPendingIntentRemovals({ departments: new Set(), outcomes: new Set(), pain_points: new Set(), ai_transformations: new Set() });
  };

  // Toggle Intent Type link for the currently edited item (updates local state only)
  const toggleIntentLink = (
    intentType: 'departments' | 'outcomes' | 'pain_points' | 'ai_transformations',
    intentId: string,
    isCurrentlyLinked: boolean
  ) => {
    if (!editingId) return;

    // Get the original linked state (from DB)
    const originalLinked = intentType === 'departments' ? linkedDepts :
                           intentType === 'outcomes' ? linkedOutcomes :
                           intentType === 'pain_points' ? linkedPainPoints : linkedAITrans;
    const wasOriginallyLinked = originalLinked.includes(intentId);

    setPendingIntentAdditions(prev => {
      const newSet = new Set(prev[intentType]);
      if (!isCurrentlyLinked && !wasOriginallyLinked) {
        // Adding a new link that wasn't in DB
        newSet.add(intentId);
      } else {
        // Remove from additions if we're unlinking
        newSet.delete(intentId);
      }
      return { ...prev, [intentType]: newSet };
    });

    setPendingIntentRemovals(prev => {
      const newSet = new Set(prev[intentType]);
      if (isCurrentlyLinked && wasOriginallyLinked) {
        // Removing a link that was in DB
        newSet.add(intentId);
      } else {
        // Remove from removals if we're re-linking
        newSet.delete(intentId);
      }
      return { ...prev, [intentType]: newSet };
    });
  };

  // Check if an intent is currently linked (considering pending changes)
  const isIntentLinked = (intentType: 'departments' | 'outcomes' | 'pain_points' | 'ai_transformations', intentId: string): boolean => {
    const originalLinked = intentType === 'departments' ? linkedDepts :
                           intentType === 'outcomes' ? linkedOutcomes :
                           intentType === 'pain_points' ? linkedPainPoints : linkedAITrans;
    const wasOriginallyLinked = originalLinked.includes(intentId);
    const isPendingAddition = pendingIntentAdditions[intentType].has(intentId);
    const isPendingRemoval = pendingIntentRemovals[intentType].has(intentId);

    if (isPendingAddition) return true;
    if (isPendingRemoval) return false;
    return wasOriginallyLinked;
  };

  // Save all pending intent changes to Supabase
  const handleSaveIntentLinks = async () => {
    if (!editingId || !hasUnsavedIntentChanges) return;

    setIsSavingIntents(true);

    const contentType = activeTab === 'vibeapps' ? 'vibe_apps' : 
                        activeTab === 'sidekick' ? 'sidekick_actions' : activeTab;

    const idFieldName = activeTab === 'products' ? 'product_id' :
                        activeTab === 'agents' ? 'agent_id' :
                        activeTab === 'vibeapps' ? 'vibe_app_id' : 'sidekick_action_id';

    try {
      const promises: Promise<any>[] = [];

      // Process each intent type
      const intentTypes: Array<'departments' | 'outcomes' | 'pain_points' | 'ai_transformations'> = 
        ['departments', 'outcomes', 'pain_points', 'ai_transformations'];
      
      for (const intentType of intentTypes) {
        let junctionTable: string;
        let intentIdField: string;

        switch (intentType) {
          case 'departments':
            junctionTable = `department_${contentType}`;
            intentIdField = 'department_id';
            break;
          case 'outcomes':
            junctionTable = `outcome_${contentType}`;
            intentIdField = 'outcome_id';
            break;
          case 'pain_points':
            junctionTable = `pain_point_${contentType}`;
            intentIdField = 'pain_point_id';
            break;
          case 'ai_transformations':
            junctionTable = `ai_transformation_${contentType}`;
            intentIdField = 'ai_transformation_id';
            break;
        }

        // Handle removals
        for (const intentId of pendingIntentRemovals[intentType]) {
          promises.push(
            supabase.from(junctionTable).delete().eq(intentIdField, intentId).eq(idFieldName, editingId)
          );
        }

        // Handle additions
        for (const intentId of pendingIntentAdditions[intentType]) {
          promises.push(
            supabase.from(junctionTable).insert({ [intentIdField]: intentId, [idFieldName]: editingId })
          );
        }
      }

      await Promise.all(promises);

      // Refresh linked intents and reset pending changes
      await fetchItemIntentLinks(editingId);
      await fetchItemLinks(items.map(i => i.id));
      resetPendingIntentChanges();
    } catch (error) {
      console.error('Error saving intent links:', error);
      alert('Error saving changes. Please try again.');
    } finally {
      setIsSavingIntents(false);
    }
  };

  // Discard pending intent changes
  const handleDiscardIntentChanges = () => {
    if (hasUnsavedIntentChanges && !confirm('Are you sure you want to discard unsaved changes?')) {
      return false;
    }
    resetPendingIntentChanges();
    return true;
  };

  return (
    <div>
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

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Database className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Knowledge Base</h2>
          <p className="text-gray-400">Central source of truth for all AI capabilities and products</p>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              activeTab === tab.id
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-gray-700 bg-gray-900 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: `${tab.color}20` }}
              >
                {tab.iconImage ? (
                  <img src={tab.iconImage} alt={tab.label} className="w-7 h-7 object-contain" />
                ) : (
                  <tab.icon className="w-5 h-5" style={{ color: tab.color }} />
                )}
              </div>
              <span className="text-white font-semibold">{tab.label}</span>
            </div>
            <p className="text-gray-400 text-sm line-clamp-2">{tab.description}</p>
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <currentTab.icon className="w-6 h-6" style={{ color: currentTab.color }} />
            <h3 className="text-xl font-semibold text-white">
              {currentTab.label} ({items.length})
            </h3>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add {currentTab.label.slice(0, -1)}
          </button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              {editingId ? `Edit ${currentTab.label.slice(0, -1)}` : `Add New ${currentTab.label.slice(0, -1)}`}
            </h4>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder={activeTab === 'products' ? 'e.g. Work Management' : 'e.g. Content Writer'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder="What does this do?"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Value Proposition</label>
                  <textarea
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder="What value does this provide?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Image</label>
                  <ImageUploader
                    currentImage={formData.image}
                    onUpload={(url) => setFormData({ ...formData, image: url })}
                    folder="knowledge"
                    label="Upload Image"
                  />
                </div>
              </div>
            </div>

            {/* Intent Type Assignment Section - Only show when editing */}
            {editingId && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h5 className="text-md font-medium text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  Assign to Intent Types
                </h5>
                <p className="text-gray-400 text-sm mb-4">
                  Select which Departments, Outcomes, Pain Points, and AI Transformations this {currentTab.label.slice(0, -1).toLowerCase()} should be linked to.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {/* Departments */}
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-medium text-white">Departments</span>
                      <span className="text-xs text-gray-500">({linkedDepts.length} selected)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {allDepartments.map(dept => {
                        const isLinked = isIntentLinked('departments', dept.id);
                        return (
                          <button
                            key={dept.id}
                            type="button"
                            onClick={() => toggleIntentLink('departments', dept.id, isLinked)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isLinked
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {dept.title}
                          </button>
                        );
                      })}
                      {allDepartments.length === 0 && (
                        <span className="text-gray-500 text-xs">No departments available</span>
                      )}
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-white">Outcomes</span>
                      <span className="text-xs text-gray-500">({linkedOutcomes.length} selected)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {allOutcomes.map(outcome => {
                        const isLinked = isIntentLinked('outcomes', outcome.id);
                        return (
                          <button
                            key={outcome.id}
                            type="button"
                            onClick={() => toggleIntentLink('outcomes', outcome.id, isLinked)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isLinked
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {outcome.title}
                          </button>
                        );
                      })}
                      {allOutcomes.length === 0 && (
                        <span className="text-gray-500 text-xs">No outcomes available</span>
                      )}
                    </div>
                  </div>

                  {/* Pain Points */}
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-medium text-white">Pain Points</span>
                      <span className="text-xs text-gray-500">({linkedPainPoints.length} selected)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {allPainPoints.map(painPoint => {
                        const isLinked = isIntentLinked('pain_points', painPoint.id);
                        return (
                          <button
                            key={painPoint.id}
                            type="button"
                            onClick={() => toggleIntentLink('pain_points', painPoint.id, isLinked)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isLinked
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {painPoint.title}
                          </button>
                        );
                      })}
                      {allPainPoints.length === 0 && (
                        <span className="text-gray-500 text-xs">No pain points available</span>
                      )}
                    </div>
                  </div>

                  {/* AI Transformations */}
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <Wand2 className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-white">AI Transformations</span>
                      <span className="text-xs text-gray-500">({linkedAITrans.length} selected)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {allAITransformations.map(aiTrans => {
                        const isLinked = isIntentLinked('ai_transformations', aiTrans.id);
                        return (
                          <button
                            key={aiTrans.id}
                            type="button"
                            onClick={() => toggleIntentLink('ai_transformations', aiTrans.id, isLinked)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isLinked
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {aiTrans.title}
                          </button>
                        );
                      })}
                      {allAITransformations.length === 0 && (
                        <span className="text-gray-500 text-xs">No AI transformations available</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Save/Discard Intent Changes */}
                {hasUnsavedIntentChanges && (
                  <div className="mt-4 p-4 bg-gray-700/50 border border-amber-600/30 rounded-xl">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-amber-400">
                        {pendingIntentChangesCount} unsaved assignment{pendingIntentChangesCount !== 1 ? 's' : ''}
                      </p>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleDiscardIntentChanges()}
                          className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-gray-300 rounded-lg text-sm transition-colors"
                        >
                          Discard
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveIntentLinks}
                          disabled={isSavingIntents}
                          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
                        >
                          {isSavingIntents ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-3 h-3" />
                              Save Assignments
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={editingId ? () => handleUpdate(editingId) : handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Update' : 'Add'}
              </button>
              <button
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Items List */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <currentTab.icon className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: currentTab.color }} />
            <p className="text-gray-400">No {currentTab.label.toLowerCase()} yet.</p>
            <p className="text-gray-500 text-sm">Add your first one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                {/* Icon */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ backgroundColor: `${currentTab.color}20` }}
                >
                  {(() => {
                    const productIcon = getProductIcon(item.name);
                    const tabDefaultIcon = getTabDefaultIcon(activeTab);
                    // Priority for Products: 1) Product icon by name, 2) DB image, 3) Lucide fallback
                    // Priority for other tabs: 1) Tab default icon, 2) DB image, 3) Lucide fallback
                    if (activeTab === 'products' && productIcon) {
                      return <img src={productIcon} alt="" className="w-10 h-10 object-contain" />;
                    } else if (tabDefaultIcon) {
                      return <img src={tabDefaultIcon} alt="" className="w-10 h-10 object-contain" />;
                    } else if (item.image) {
                      return <img src={item.image} alt="" className="w-10 h-10 object-contain" />;
                    } else {
                      return <currentTab.icon className="w-6 h-6" style={{ color: currentTab.color }} />;
                    }
                  })()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-medium truncate">{item.name}</h4>
                  </div>
                  <p className="text-gray-400 text-sm truncate">{item.description}</p>
                  
                  {/* Link badges showing where this item is used */}
                  {itemLinks[item.id] && (
                    <div className="flex items-center gap-2 mt-2">
                      {itemLinks[item.id].departments > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs">
                          <Building2 className="w-3 h-3" />
                          {itemLinks[item.id].departments} Dept
                        </span>
                      )}
                      {itemLinks[item.id].outcomes > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-300 rounded text-xs">
                          <Target className="w-3 h-3" />
                          {itemLinks[item.id].outcomes} Outcome
                        </span>
                      )}
                      {itemLinks[item.id].painPoints > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-xs">
                          <AlertCircle className="w-3 h-3" />
                          {itemLinks[item.id].painPoints} Pain
                        </span>
                      )}
                      {itemLinks[item.id].aiTransformations > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">
                          <Wand2 className="w-3 h-3" />
                          {itemLinks[item.id].aiTransformations} AI
                        </span>
                      )}
                      {itemLinks[item.id].departments === 0 && 
                       itemLinks[item.id].outcomes === 0 && 
                       itemLinks[item.id].painPoints === 0 && 
                       itemLinks[item.id].aiTransformations === 0 && (
                        <span className="text-xs text-gray-500 italic">Not linked anywhere</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <ChevronRight className="w-5 h-5 text-indigo-400 mt-0.5" />
          <div>
            <h4 className="text-indigo-300 font-medium">How it works</h4>
            <p className="text-indigo-200/70 text-sm mt-1">
              Items you add here become available to link in <strong>multiple</strong> Departments, Outcomes, Pain Points, and AI Transformations.
              Each item can be assigned to as many places as needed. The badges above show where each item is currently linked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
