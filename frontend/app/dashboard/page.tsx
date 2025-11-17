'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';

interface Note {
  id: number;
  title: string;
  content: string;
  updated_at: string;
  created_at: string;
}

interface User {
  username: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
    fetchNotes();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        router.push('/login');
        return;
      }

      const data = await response.json();
      if (data.user) {
        setUser({ username: data.user.username, email: data.user.email });
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch notes');
      }

      const data = await response.json();
      setNotes(data.notes);
      setLoading(false);
    } catch (err) {
      setError('Failed to load notes');
      setLoading(false);
    }
  };

  const handleAddNote = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = async (noteData: { note_title: string; note_content: string }) => {
    try {
      if (selectedNote) {
        const response = await fetch(`/api/notes/${selectedNote.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(noteData),
        });

        if (!response.ok) {
          throw new Error('Failed to update note');
        }

        const data = await response.json();
        setNotes(notes.map(note => 
          note.id === selectedNote.id ? data.note : note
        ));
      } else {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(noteData),
        });

        if (!response.ok) {
          throw new Error('Failed to create note');
        }

        const data = await response.json();
        setNotes([data.note, ...notes]);
      }

      setIsModalOpen(false);
      setSelectedNote(null);
    } catch (err) {
      setError('Failed to save note');
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-white flex items-center justify-center">
        <div className="text-xl text-deep-charcoal">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-white">
      <Navbar
        isAuthenticated={true}
        username={user?.username || 'User'}
        showActions={true}
        onAddNote={handleAddNote}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="mb-6">
              <svg
                className="w-24 h-24 text-gray-300 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-deep-charcoal mb-2">
              No notes yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start creating your first note!
            </p>
            <button
              onClick={handleAddNote}
              className="px-8 py-3 rounded-lg font-semibold bg-calm-teal text-white hover:bg-opacity-90 transition-colors shadow-lg"
            >
              Add Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}
      </main>

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNote(null);
        }}
        onSave={handleSaveNote}
        note={selectedNote}
      />
    </div>
  );
}
