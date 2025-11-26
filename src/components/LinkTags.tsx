'use client';

import { useState } from 'react';

interface LinkTagsProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export function LinkTags({ tags, onAddTag, onRemoveTag }: LinkTagsProps) {
  const [inputValue, setInputValue] = useState('');
  const suggestedTags = ['Campaign', 'Social', 'Email', 'Q4-2025', 'Marketing', 'Product'];

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onAddTag(trimmedTag);
      setInputValue('');
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Tags (Optional)
      </label>
      
      {/* Display selected tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <div
              key={tag}
              className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm flex items-center gap-2"
            >
              <span>{tag}</span>
              <button
                onClick={() => onRemoveTag(tag)}
                className="hover:text-red-200 font-bold"
                aria-label={`Remove tag ${tag}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add tag input */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Type or select tag..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && inputValue.trim()) {
              handleAddTag(inputValue);
            }
          }}
          className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
        />
        {inputValue.trim() && (
          <button
            onClick={() => handleAddTag(inputValue)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
          >
            Add
          </button>
        )}
      </div>

      {/* Suggested tags */}
      <div className="flex flex-wrap gap-2">
        {suggestedTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleAddTag(tag)}
            disabled={tags.includes(tag)}
            className="px-3 py-1 bg-white border-2 border-gray-300 rounded-full text-sm hover:border-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

