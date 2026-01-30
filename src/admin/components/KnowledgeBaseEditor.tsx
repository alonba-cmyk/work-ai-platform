import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Edit2, Package, Users, Sparkles, Zap, Database, ChevronRight, Building2, Target, AlertCircle, Wand2, ArrowLeft, Search, ChevronDown, ArrowUpDown } from 'lucide-react';
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

// Tracks where each item is linked (counts)
interface ItemLinks {
  departments: number;
  outcomes: number;
  painPoints: number;
  aiTransformations: number;
}

// Tracks actual linked names for display
interface ItemLinkDetails {
  departmentNames: string[];
  outcomeNames: string[];
  painPointNames: string[];
  aiTransformationNames: string[];
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
  
  // Actual linked names for display
  const [itemLinkDetails, setItemLinkDetails] = useState<Record<string, ItemLinkDetails>>({});
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'name-desc' | 'links'>('name');

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
      setItemLinkDetails({});
      return;
    }

    const idFieldName = activeTab === 'products' ? 'product_id' :
                        activeTab === 'agents' ? 'agent_id' :
                        activeTab === 'vibeapps' ? 'vibe_app_id' : 'sidekick_action_id';

    const contentType = activeTab === 'vibeapps' ? 'vibe_apps' : 
                        activeTab === 'sidekick' ? 'sidekick_actions' : activeTab;

    // Fetch from all junction tables with names in parallel
    const [deptLinks, outcomeLinks, painPointLinks, aiTransLinks] = await Promise.all([
      supabase.from(`department_${contentType}`).select(`${idFieldName}, department_id, departments(title)`),
      supabase.from(`outcome_${contentType}`).select(`${idFieldName}, outcome_id, outcomes(title)`),
      supabase.from(`pain_point_${contentType}`).select(`${idFieldName}, pain_point_id, pain_points(title)`),
      supabase.from(`ai_transformation_${contentType}`).select(`${idFieldName}, ai_transformation_id, ai_transformations(title)`),
    ]);

    // Count links per item and collect names
    const links: Record<string, ItemLinks> = {};
    const details: Record<string, ItemLinkDetails> = {};
    
    itemIds.forEach(id => {
      links[id] = { departments: 0, outcomes: 0, painPoints: 0, aiTransformations: 0 };
      details[id] = { departmentNames: [], outcomeNames: [], painPointNames: [], aiTransformationNames: [] };
    });

    // Process department links
    (deptLinks.data || []).forEach((link: any) => {
      const itemId = link[idFieldName];
      if (links[itemId]) {
        links[itemId].departments++;
        const name = link.departments?.title;
        if (name && !details[itemId].departmentNames.includes(name)) {
          details[itemId].departmentNames.push(name);
        }
      }
    });

    // Process outcome links
    (outcomeLinks.data || []).forEach((link: any) => {
      const itemId = link[idFieldName];
      if (links[itemId]) {
        links[itemId].outcomes++;
        const name = link.outcomes?.title;
        if (name && !details[itemId].outcomeNames.includes(name)) {
          details[itemId].outcomeNames.push(name);
        }
      }
    });

    // Process pain point links
    (painPointLinks.data || []).forEach((link: any) => {
      const itemId = link[idFieldName];
      if (links[itemId]) {
        links[itemId].painPoints++;
        const name = link.pain_points?.title;
        if (name && !details[itemId].painPointNames.includes(name)) {
          details[itemId].painPointNames.push(name);
        }
      }
    });

    // Process AI transformation links
    (aiTransLinks.data || []).forEach((link: any) => {
      const itemId = link[idFieldName];
      if (links[itemId]) {
        links[itemId].aiTransformations++;
        const name = link.ai_transformations?.title;
        if (name && !details[itemId].aiTransformationNames.includes(name)) {
          details[itemId].aiTransformationNames.push(name);
        }
      }
    });

    setItemLinks(links);
    setItemLinkDetails(details);
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

  // Handle modal close with unsaved changes check
  const handleCloseModal = () => {
    if (hasUnsavedIntentChanges) {
      if (!confirm('יש לך שינויים שלא נשמרו. לסגור בלי לשמור?')) {
        return;
      }
    }
    resetForm(true);
  };

  // ESC key handler for modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (showAddForm || editingId)) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showAddForm, editingId, hasUnsavedIntentChanges]);

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
      // Also save any pending intent type assignments
      if (hasUnsavedIntentChanges) {
        await saveIntentLinksInternal(id);
      }
      await fetchItems();
      resetForm(true); // Skip warning since we just saved
    }
  };

  // Internal function to save intent links (used by both handleUpdate and handleSaveIntentLinks)
  const saveIntentLinksInternal = async (itemId: string) => {
    const contentType = activeTab === 'vibeapps' ? 'vibe_apps' : 
                        activeTab === 'sidekick' ? 'sidekick_actions' : activeTab;

    const idFieldName = activeTab === 'products' ? 'product_id' :
                        activeTab === 'agents' ? 'agent_id' :
                        activeTab === 'vibeapps' ? 'vibe_app_id' : 'sidekick_action_id';

    const intentTypes = ['departments', 'outcomes', 'pain_points', 'ai_transformations'] as const;

    for (const intentType of intentTypes) {
      const tableName = `${intentType.replace('_', '_').replace('departments', 'department').replace('outcomes', 'outcome').replace('pain_points', 'pain_point').replace('ai_transformations', 'ai_transformation')}_${contentType}`;
      const intentIdField = intentType === 'departments' ? 'department_id' :
                            intentType === 'outcomes' ? 'outcome_id' :
                            intentType === 'pain_points' ? 'pain_point_id' : 'ai_transformation_id';

      // Handle additions
      for (const intentId of pendingIntentAdditions[intentType]) {
        await supabase.from(tableName).upsert({
          [idFieldName]: itemId,
          [intentIdField]: intentId
        });
      }

      // Handle removals
      for (const intentId of pendingIntentRemovals[intentType]) {
        await supabase.from(tableName)
          .delete()
          .eq(idFieldName, itemId)
          .eq(intentIdField, intentId);
      }
    }

    resetPendingIntentChanges();
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

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }
      // Department filter
      if (filterDepartment) {
        const deptNames = itemLinkDetails[item.id]?.departmentNames || [];
        if (!deptNames.includes(filterDepartment)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'links':
          const aLinks = (itemLinks[a.id]?.departments || 0) + (itemLinks[a.id]?.outcomes || 0) + 
                         (itemLinks[a.id]?.painPoints || 0) + (itemLinks[a.id]?.aiTransformations || 0);
          const bLinks = (itemLinks[b.id]?.departments || 0) + (itemLinks[b.id]?.outcomes || 0) + 
                         (itemLinks[b.id]?.painPoints || 0) + (itemLinks[b.id]?.aiTransformations || 0);
          return bLinks - aLinks;
        default:
          return 0;
      }
    });

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

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${currentTab.label.toLowerCase()}...`}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={filterDepartment || ''}
              onChange={(e) => setFilterDepartment(e.target.value || null)}
              className="appearance-none pl-4 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="">All Departments</option>
              {allDepartments.map(dept => (
                <option key={dept.id} value={dept.title}>{dept.title}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'name-desc' | 'links')}
              className="appearance-none pl-4 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="name">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="links">Most Links</option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Modal Add/Edit Form */}
        {(showAddForm || editingId) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={handleCloseModal}
            />
            
            {/* Modal Content */}
            <div className="relative bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-gray-700 bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${currentTab.color}20` }}
                  >
                    {currentTab.iconImage ? (
                      <img src={currentTab.iconImage} alt="" className="w-6 h-6 object-contain" />
                    ) : (
                      <currentTab.icon className="w-5 h-5" style={{ color: currentTab.color }} />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {editingId ? `Edit ${currentTab.label.slice(0, -1)}` : `Add New ${currentTab.label.slice(0, -1)}`}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {editingId ? 'Update the details below' : 'Fill in the details to create a new item'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Modal Body - Scrollable with hidden scrollbar */}
              <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600">
                {/* Top Section: Image + Basic Info */}
                <div className="flex gap-6 mb-8">
                  {/* Image Section */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 overflow-hidden flex items-center justify-center">
                      {formData.image ? (
                        <img src={formData.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <currentTab.icon className="w-12 h-12 text-gray-600" />
                      )}
                    </div>
                    <div className="mt-3">
                      <ImageUploader
                        currentImage={formData.image}
                        onUpload={(url) => setFormData({ ...formData, image: url })}
                        folder="knowledge"
                        label={formData.image ? "Change" : "Add Image"}
                      />
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-500"
                        placeholder={activeTab === 'products' ? 'e.g. Work Management' : 'e.g. Content Writer'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Value Proposition</label>
                      <input
                        type="text"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-500"
                        placeholder="Short value statement"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none transition-all placeholder:text-gray-500"
                    placeholder="Describe what this does..."
                  />
                </div>

            {/* Intent Type Assignment Section - Only show when editing */}
            {editingId && (
              <div className="pt-6 border-t border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-sm font-semibold text-white uppercase tracking-wide flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    Link to Intent Types
                  </h5>
                  <span className="text-xs text-gray-500">
                    {linkedDepts.length + linkedOutcomes.length + linkedPainPoints.length + linkedAITrans.length} total links
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Departments */}
                  <div className="group bg-gradient-to-br from-indigo-500/5 to-indigo-600/10 rounded-xl p-4 border border-indigo-500/20 hover:border-indigo-500/40 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-white">Departments</span>
                      </div>
                      {linkedDepts.length > 0 && (
                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">{linkedDepts.length}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {allDepartments.map(dept => {
                        const isLinked = isIntentLinked('departments', dept.id);
                        return (
                          <button
                            key={dept.id}
                            type="button"
                            onClick={() => toggleIntentLink('departments', dept.id, isLinked)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              isLinked
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
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
                  <div className="group bg-gradient-to-br from-green-500/5 to-green-600/10 rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <Target className="w-3.5 h-3.5 text-green-400" />
                        </div>
                        <span className="text-sm font-medium text-white">Outcomes</span>
                      </div>
                      {linkedOutcomes.length > 0 && (
                        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">{linkedOutcomes.length}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {allOutcomes.map(outcome => {
                        const isLinked = isIntentLinked('outcomes', outcome.id);
                        return (
                          <button
                            key={outcome.id}
                            type="button"
                            onClick={() => toggleIntentLink('outcomes', outcome.id, isLinked)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              isLinked
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                                : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
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
                  <div className="group bg-gradient-to-br from-amber-500/5 to-amber-600/10 rounded-xl p-4 border border-amber-500/20 hover:border-amber-500/40 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <span className="text-sm font-medium text-white">Pain Points</span>
                      </div>
                      {linkedPainPoints.length > 0 && (
                        <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">{linkedPainPoints.length}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {allPainPoints.map(painPoint => {
                        const isLinked = isIntentLinked('pain_points', painPoint.id);
                        return (
                          <button
                            key={painPoint.id}
                            type="button"
                            onClick={() => toggleIntentLink('pain_points', painPoint.id, isLinked)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              isLinked
                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                                : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
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
                  <div className="group bg-gradient-to-br from-purple-500/5 to-purple-600/10 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <span className="text-sm font-medium text-white">AI Transformations</span>
                      </div>
                      {linkedAITrans.length > 0 && (
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">{linkedAITrans.length}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {allAITransformations.map(aiTrans => {
                        const isLinked = isIntentLinked('ai_transformations', aiTrans.id);
                        return (
                          <button
                            key={aiTrans.id}
                            type="button"
                            onClick={() => toggleIntentLink('ai_transformations', aiTrans.id, isLinked)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              isLinked
                                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                                : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
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

                {/* Pending changes indicator - will be saved with main Save button */}
                {hasUnsavedIntentChanges && (
                  <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                      <p className="text-sm text-indigo-300">
                        {pendingIntentChangesCount} assignment change{pendingIntentChangesCount !== 1 ? 's' : ''} pending - click "Save Changes" below to save
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            </div>

              {/* Modal Footer - Sticky */}
              <div className="flex items-center justify-between px-8 py-5 border-t border-gray-700 bg-gray-800/50">
                <div className="text-sm text-gray-400">
                  {editingId ? 'Press ESC to cancel' : 'Fill in all required fields'}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={editingId ? () => handleUpdate(editingId) : handleAdd}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {editingId ? 'Save Changes' : 'Add Item'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Items List */}
        {/* Results count when filtering */}
        {(searchQuery || filterDepartment) && !loading && (
          <div className="text-sm text-gray-400 mb-4">
            Showing {filteredItems.length} of {items.length} {currentTab.label.toLowerCase()}
            {filterDepartment && <span className="text-indigo-400"> in {filterDepartment}</span>}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <currentTab.icon className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: currentTab.color }} />
            <p className="text-gray-400">No {currentTab.label.toLowerCase()} yet.</p>
            <p className="text-gray-500 text-sm">Add your first one to get started!</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30 text-gray-600" />
            <p className="text-gray-400">No matching {currentTab.label.toLowerCase()} found.</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterDepartment(null); }}
              className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
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
                  {itemLinkDetails[item.id] && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {/* Department names */}
                      {itemLinkDetails[item.id].departmentNames.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-md text-xs">
                          <Building2 className="w-3 h-3 flex-shrink-0" />
                          {itemLinkDetails[item.id].departmentNames.slice(0, 2).join(', ')}
                          {itemLinkDetails[item.id].departmentNames.length > 2 && (
                            <span className="text-indigo-400">+{itemLinkDetails[item.id].departmentNames.length - 2}</span>
                          )}
                        </span>
                      )}
                      {/* Outcome names */}
                      {itemLinkDetails[item.id].outcomeNames.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-300 rounded-md text-xs">
                          <Target className="w-3 h-3 flex-shrink-0" />
                          {itemLinkDetails[item.id].outcomeNames.slice(0, 2).join(', ')}
                          {itemLinkDetails[item.id].outcomeNames.length > 2 && (
                            <span className="text-green-400">+{itemLinkDetails[item.id].outcomeNames.length - 2}</span>
                          )}
                        </span>
                      )}
                      {/* Pain Point names */}
                      {itemLinkDetails[item.id].painPointNames.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-md text-xs">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          {itemLinkDetails[item.id].painPointNames.slice(0, 2).join(', ')}
                          {itemLinkDetails[item.id].painPointNames.length > 2 && (
                            <span className="text-amber-400">+{itemLinkDetails[item.id].painPointNames.length - 2}</span>
                          )}
                        </span>
                      )}
                      {/* AI Transformation names */}
                      {itemLinkDetails[item.id].aiTransformationNames.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-md text-xs">
                          <Wand2 className="w-3 h-3 flex-shrink-0" />
                          {itemLinkDetails[item.id].aiTransformationNames.slice(0, 2).join(', ')}
                          {itemLinkDetails[item.id].aiTransformationNames.length > 2 && (
                            <span className="text-purple-400">+{itemLinkDetails[item.id].aiTransformationNames.length - 2}</span>
                          )}
                        </span>
                      )}
                      {/* Not linked message */}
                      {itemLinkDetails[item.id].departmentNames.length === 0 && 
                       itemLinkDetails[item.id].outcomeNames.length === 0 && 
                       itemLinkDetails[item.id].painPointNames.length === 0 && 
                       itemLinkDetails[item.id].aiTransformationNames.length === 0 && (
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
