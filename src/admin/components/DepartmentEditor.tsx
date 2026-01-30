import { useState, useEffect } from 'react';
import { Save, Palette } from 'lucide-react';
import type { DepartmentRow } from '@/types/database';
import { ImageUploader } from './ImageUploader';

interface DepartmentEditorProps {
  department: DepartmentRow;
  onUpdate: (id: string, updates: Partial<DepartmentRow>) => Promise<void>;
  stats?: { products: number; agents: number; vibeApps: number; actions: number };
}

export function DepartmentEditor({ department, onUpdate, stats }: DepartmentEditorProps) {
  const [title, setTitle] = useState(department.title);
  const [description, setDescription] = useState(department.description || '');
  const [avatarColor, setAvatarColor] = useState(department.avatar_color);
  const [avatarImage, setAvatarImage] = useState(department.avatar_image || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTitle(department.title);
    setDescription(department.description || '');
    setAvatarColor(department.avatar_color);
    setAvatarImage(department.avatar_image || '');
  }, [department]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdate(department.id, {
        title,
        description,
        avatar_color: avatarColor,
        avatar_image: avatarImage,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const presetColors = [
    '#97aeff', '#ffc875', '#ff5ac4', '#ff7575',
    '#a358d1', '#5ac4a3', '#ff9a6c', '#6fcfed',
    '#6161ff', '#ff6b6b', '#4ecdc4', '#45b7d1',
  ];

  return (
    <div className="max-w-2xl">
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-6">Department Settings</h2>
        
        {/* Avatar Preview */}
        <div className="flex items-center gap-6 mb-8">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: avatarColor }}
          >
            {avatarImage ? (
              <img src={avatarImage} alt={title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-3xl font-bold">{title.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1">
            <ImageUploader
              currentImage={avatarImage}
              onUpload={setAvatarImage}
              folder="avatars"
              label="Upload Avatar"
            />
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Department Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Color Picker */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Palette className="w-4 h-4 inline mr-2" />
            Avatar Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {presetColors.map(color => (
              <button
                key={color}
                onClick={() => setAvatarColor(color)}
                className={`w-10 h-10 rounded-lg transition-all ${
                  avatarColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
            <input
              type="color"
              value={avatarColor}
              onChange={(e) => setAvatarColor(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer"
            />
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
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Products</p>
          <p className="text-2xl font-bold text-white mt-1">{stats?.products ?? '-'}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Agents</p>
          <p className="text-2xl font-bold text-white mt-1">{stats?.agents ?? '-'}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Vibe Apps</p>
          <p className="text-2xl font-bold text-white mt-1">{stats?.vibeApps ?? '-'}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Actions</p>
          <p className="text-2xl font-bold text-white mt-1">{stats?.actions ?? '-'}</p>
        </div>
      </div>
    </div>
  );
}
