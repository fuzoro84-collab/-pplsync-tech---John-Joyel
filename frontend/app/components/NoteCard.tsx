'use client';

interface Note {
  id: number;
  title: string;
  content: string;
  updated_at: string;
  created_at: string;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-2xl transition-shadow cursor-pointer"
      onClick={() => onEdit(note)}
    >
      <h3 className="text-xl font-bold text-deep-charcoal mb-3 break-words">
        {note.title}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-3 whitespace-pre-wrap break-words">
        {note.content}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {formatDate(note.updated_at)}
        </span>
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="text-calm-teal hover:text-opacity-80 font-semibold transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 font-semibold transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
