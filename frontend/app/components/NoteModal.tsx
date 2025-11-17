'use client';

import { useState, useEffect, useRef } from 'react';

interface Note {
  id?: number;
  title: string;
  content: string;
}

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: { note_title: string; note_content: string }) => void;
  note?: Note | null;
}

export default function NoteModal({ isOpen, onClose, onSave, note }: NoteModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      } else {
        setTitle('');
        setContent('');
      }
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, note]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSave({ note_title: title, note_content: content });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="w-full text-2xl font-bold text-deep-charcoal mb-4 px-2 py-2 border-b-2 border-gray-200 focus:border-calm-teal outline-none transition-colors"
            maxLength={200}
            required
          />
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your note..."
            className="w-full min-h-[300px] text-gray-700 px-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-calm-teal focus:border-transparent outline-none resize-none transition-all"
            required
          />

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg font-semibold bg-calm-teal text-white hover:bg-opacity-90 transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
