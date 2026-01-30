import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useImageUpload } from '@/hooks/useSupabase';

interface ImageUploaderProps {
  currentImage: string | null;
  onUpload: (url: string) => void;
  folder?: string;
  label?: string;
}

export function ImageUploader({ currentImage, onUpload, folder = 'general', label = 'Upload Image' }: ImageUploaderProps) {
  const { uploadImage, uploading, error } = useImageUpload();
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const url = await uploadImage(file, folder);
    if (url) {
      onUpload(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div>
      {currentImage ? (
        <div className="relative inline-block">
          <img
            src={currentImage}
            alt="Uploaded"
            className="w-32 h-32 object-cover rounded-lg border border-gray-700"
          />
          <button
            onClick={() => onUpload('')}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-2 px-2 py-1 bg-gray-900/80 rounded text-xs text-white hover:bg-gray-900 transition-colors"
          >
            Change
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-400 text-sm mt-2">Uploading...</span>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-500 mb-2" />
              <span className="text-gray-400 text-sm">{label}</span>
              <span className="text-gray-500 text-xs mt-1">Drag & drop or click</span>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
