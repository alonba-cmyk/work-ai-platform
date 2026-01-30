import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Search, Package } from 'lucide-react';
import { useState } from 'react';
import sidekickIcon from '@/assets/c3e06e6c0d8e1f48d4291d5d6620c109eb135451.png';
import vibeLogo from '@/assets/11b463a7bf5ae34a13ea40edee0998bb48211c27.png';
import { WMIcon, DevIcon, CRMIcon, ServiceIcon, CampaignsIcon } from '@/app/components/ProductIcons';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'product' | 'agent' | 'sidekick' | 'vibe';
  onAdd: (itemName: string) => void;
  onRemove?: (itemName: string) => void;
  availableItems: Array<{ name: string; description?: string; image?: string; value?: string }>;
  selectedItems?: string[]; // Names of already selected items
  originalItems?: string[]; // Names of original items that cannot be removed
}

export function AddItemModal({ isOpen, onClose, type, onAdd, onRemove, availableItems, selectedItems = [], originalItems = [] }: AddItemModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Product icon components mapping
  const productIconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
    'Work Management': WMIcon,
    'CRM': CRMIcon,
    'Campaigns': CampaignsIcon,
    'Service': ServiceIcon,
    'Dev': DevIcon,
  };
  
  const typeConfig = {
    product: {
      title: 'Add Product',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.3)'
    },
    agent: {
      title: 'Add AI Agent',
      color: '#06b6d4',
      bgColor: 'rgba(6, 182, 212, 0.1)',
      borderColor: 'rgba(6, 182, 212, 0.3)'
    },
    sidekick: {
      title: 'Add Sidekick Action',
      color: '#8B5CF6', // Purple
      bgColor: 'rgba(139, 92, 246, 0.08)',
      borderColor: 'rgba(139, 92, 246, 0.25)'
    },
    vibe: {
      title: 'Add Vibe App',
      color: '#f59e0b', // Amber/Orange
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'rgba(245, 158, 11, 0.3)'
    }
  };
  
  const config = typeConfig[type];
  
  const filteredItems = availableItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAdd = (itemName: string) => {
    onAdd(itemName);
    onClose();
    setSearchQuery('');
  };
  
  const handleRemove = (itemName: string) => {
    if (onRemove) {
      onRemove(itemName);
      onClose();
      setSearchQuery('');
    }
  };
  
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div key="additem-modal-wrapper">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl rounded-2xl border backdrop-blur-xl overflow-hidden"
              style={{
                background: type === 'sidekick' 
                  ? 'linear-gradient(135deg, #1E1B32 0%, #252238 100%)'
                  : 'linear-gradient(135deg, rgba(30, 35, 48, 0.98), rgba(20, 24, 35, 0.98))',
                borderColor: type === 'sidekick' ? 'rgba(139, 92, 246, 0.3)' : config.borderColor,
                boxShadow: type === 'sidekick' 
                  ? '0 20px 60px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                  : `0 20px 60px ${config.color}30, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
              }}
            >
              {/* Header */}
              <div 
                className="flex items-center justify-between p-6 border-b"
                style={{ borderColor: type === 'sidekick' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.1)' }}
              >
                <div className="flex items-center gap-4">
                  {/* Icon - show Sidekick icon only for sidekick type */}
                  {type === 'sidekick' && (
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center relative overflow-hidden p-1"
                    >
                      <img src={sidekickIcon} alt="Sidekick" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div>
                    {type === 'sidekick' && (
                      <div 
                        className="text-xs mb-1"
                        style={{ 
                          color: 'rgba(139, 92, 246, 1)',
                          fontWeight: 'var(--font-weight-semibold)',
                          letterSpacing: '0.05em'
                        }}
                      >
                        SIDEKICK ACTION
                      </div>
                    )}
                    <h2 
                      className="text-2xl text-white"
                      style={{ fontWeight: 'var(--font-weight-bold)' }}
                    >
                      {config.title}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: type === 'sidekick' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
              
              {/* Search */}
              <div className="p-6">
                <div 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Search className="w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-white outline-none"
                    style={{ fontWeight: 'var(--font-weight-regular)' }}
                  />
                </div>
              </div>
              
              {/* Items List */}
              <div className="px-6 pb-6 max-h-[400px] overflow-y-auto">
                <div className="space-y-2">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItems.includes(item.name);
                    const canRemove = isSelected && onRemove;
                    
                    return (
                      <motion.button
                        key={item.name}
                        whileHover={!isSelected || canRemove ? { scale: 1.02 } : {}}
                        whileTap={!isSelected || canRemove ? { scale: 0.98 } : {}}
                        onClick={() => {
                          if (canRemove) {
                            handleRemove(item.name);
                          } else if (!isSelected) {
                            handleAdd(item.name);
                          }
                        }}
                        className={`w-full flex items-start gap-4 rounded-xl border transition-all text-left relative ${
                          type === 'vibe' ? 'p-0 overflow-hidden' : 'p-4'
                        }`}
                        style={{
                          background: isSelected ? 'rgba(34, 197, 94, 0.1)' : config.bgColor,
                          borderColor: isSelected ? 'rgba(34, 197, 94, 0.4)' : config.borderColor,
                          cursor: 'pointer',
                        }}
                      >
                        {/* Vibe Layout - Large Image Card */}
                        {type === 'vibe' ? (
                          <>
                            {/* Large Image Container */}
                            <div className="w-48 h-32 flex-shrink-0 relative overflow-hidden">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div 
                                  className="w-full h-full flex items-center justify-center"
                                  style={{
                                    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.12), rgba(249, 115, 22, 0.08))'
                                  }}
                                >
                                  <img 
                                    src={vibeLogo} 
                                    alt="Vibe" 
                                    className="w-16 h-16 object-contain"
                                  />
                                </div>
                              )}
                            </div>
                            
                            {/* Text Content - Right Side */}
                            <div className="flex-1 p-4 flex flex-col justify-center">
                              <h3 
                                className="text-base text-white mb-1"
                                style={{ fontWeight: 'var(--font-weight-semibold)' }}
                              >
                                {item.name}
                                {isSelected && (
                                  <span 
                                    className="ml-2 text-xs px-2 py-0.5 rounded-full"
                                    style={{ 
                                      background: 'rgba(34, 197, 94, 0.2)',
                                      color: '#22c55e',
                                      fontWeight: 'var(--font-weight-medium)'
                                    }}
                                  >
                                    Added
                                  </span>
                                )}
                              </h3>
                              {(item.description || (item as any).value) && (
                                <p 
                                  className="text-sm text-white/60"
                                  style={{ fontWeight: 'var(--font-weight-regular)' }}
                                >
                                  {item.description || (item as any).value}
                                </p>
                              )}
                            </div>
                            
                            {/* Action Button - Absolute Top Right */}
                            {canRemove ? (
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute top-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                }}
                              >
                                <X 
                                  className="w-5 h-5" 
                                  style={{ color: '#ef4444' }} 
                                />
                              </motion.div>
                            ) : !isSelected ? (
                              <div 
                                className="absolute top-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: `linear-gradient(135deg, ${config.color}30, ${config.color}15)`,
                                }}
                              >
                                <Plus 
                                  className="w-5 h-5" 
                                  style={{ color: config.color }} 
                                />
                              </div>
                            ) : null}
                          </>
                        ) : (
                          <>
                            {/* Original Layout for Sidekick, Agent, Product */}
                            {/* Sidekick Icon - Left Side */}
                            {type === 'sidekick' && (
                              <div 
                                className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 p-1.5"
                              >
                                <img src={sidekickIcon} alt="Sidekick" className="w-full h-full object-contain" />
                              </div>
                            )}
                            
                            {/* Content Container */}
                            <div className="flex items-start gap-4 flex-1">
                              {/* Image/Logo for non-sidekick items */}
                              {type !== 'sidekick' && (
                                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2"
                                  style={{
                                    background: type === 'product' 
                                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(37, 99, 235, 0.08))'
                                      : type === 'agent' && !item.image
                                      ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(8, 145, 178, 0.08))'
                                      : 'transparent'
                                  }}
                                >
                                  {type === 'product' ? (
                                    // Show product icon for products
                                    (() => {
                                      const IconComp = productIconComponents[item.name];
                                      return IconComp ? <IconComp className="w-full h-full" /> : <Package className="w-10 h-10 text-blue-400" />;
                                    })()
                                  ) : item.image ? (
                                    <img 
                                      src={item.image} 
                                      alt={item.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : null}
                                </div>
                              )}
                              
                              {/* Text Content */}
                              <div className="flex-1 min-w-0">
                                <h3 
                                  className="text-base text-white mb-1"
                                  style={{ fontWeight: 'var(--font-weight-semibold)' }}
                                >
                                  {item.name}
                                  {isSelected && (
                                    <span 
                                      className="ml-2 text-xs px-2 py-0.5 rounded-full"
                                      style={{ 
                                        background: 'rgba(34, 197, 94, 0.2)',
                                        color: '#22c55e',
                                        fontWeight: 'var(--font-weight-medium)'
                                      }}
                                    >
                                      Added
                                    </span>
                                  )}
                                </h3>
                                {(item.description || (item as any).value) && (
                                  <p 
                                    className="text-sm text-white/60"
                                    style={{ fontWeight: 'var(--font-weight-regular)' }}
                                  >
                                    {item.description || (item as any).value}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {/* Action Button - Right Side */}
                            {canRemove ? (
                              // X Button for removable items
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                }}
                              >
                                <X 
                                  className="w-5 h-5" 
                                  style={{ color: '#ef4444' }} 
                                />
                              </motion.div>
                            ) : !isSelected ? (
                              // Plus Icon for non-selected items
                              <div 
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: `linear-gradient(135deg, ${config.color}30, ${config.color}15)`,
                                }}
                              >
                                <Plus 
                                  className="w-5 h-5" 
                                  style={{ color: config.color }} 
                                />
                              </div>
                            ) : null}
                          </>
                        )}
                      </motion.button>
                    );
                  })}
                  
                  {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                      <p 
                        className="text-white/40"
                        style={{ fontWeight: 'var(--font-weight-regular)' }}
                      >
                        No items found
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}