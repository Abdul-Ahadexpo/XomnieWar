import React, { useState } from 'react';
import { Upload, Image, Loader2, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', '2a78816b4b5cc1c4c3b18f8f258eda60');

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    return data.data.url;
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 32 * 1024 * 1024) { // 32MB limit
      setError('Image must be smaller than 32MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const imageUrl = await uploadToImgBB(file);
      onImageUploaded(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Image Preview */}
      {currentImage && (
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={currentImage}
              alt="Current avatar"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-purple-500/50 object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/128x128/8B5CF6/FFFFFF?text=?';
              }}
            />
            <div className="absolute -top-2 -right-2 bg-purple-600 rounded-full p-1">
              <Image className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          dragOver
            ? 'border-purple-400 bg-purple-500/10'
            : 'border-gray-600 hover:border-purple-500 hover:bg-purple-500/5'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        {uploading ? (
          <div className="space-y-3">
            <Loader2 className="h-8 w-8 text-purple-400 animate-spin mx-auto" />
            <p className="text-purple-400 text-sm">Uploading image...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="h-8 w-8 text-gray-400 mx-auto" />
            <div>
              <p className="text-gray-300 text-sm mb-2">
                Drag & drop an image here, or click to select
              </p>
              <label className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-colors text-sm">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Supports: JPG, PNG, GIF (max 32MB)
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-center space-x-2">
          <X className="h-4 w-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Manual URL Input */}
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-2">Or paste an image URL:</p>
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          onChange={(e) => {
            if (e.target.value && e.target.value.startsWith('http')) {
              onImageUploaded(e.target.value);
            }
          }}
          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        />
      </div>
    </div>
  );
};

export default ImageUploader;