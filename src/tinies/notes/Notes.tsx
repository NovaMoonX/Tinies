import { Button } from '@moondreamsdev/dreamer-ui/components';
import { useActionModal } from '@moondreamsdev/dreamer-ui/hooks';
import { Plus } from '@moondreamsdev/dreamer-ui/symbols';
import { useEffect, useMemo, useState } from 'react';
import { Note, NoteFilters } from './Notes.types';
import { FilterSection, NoteCard, NoteModal } from './Notes.components';
import {
  filterNotes,
  generateNoteId,
  removeAutoDeletedNotes,
  sortNotes,
} from './Notes.utils';
import TinyPage from '@ui/layout/TinyPage';
import { useNotesData } from './Notes.hooks';

export function Notes() {
  const { notes, setNotes } = useNotesData();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filters, setFilters] = useState<NoteFilters>({
    searchQuery: '',
    selectedTags: [],
    selectedColors: [],
    status: 'active',
  });

  const { confirm } = useActionModal();

  // Auto-delete trashed notes after 30 days (run once on mount)
  useEffect(() => {
    const cleanedNotes = removeAutoDeletedNotes(notes);
    if (cleanedNotes.length !== notes.length) {
      setNotes(cleanedNotes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const allTags = useMemo(() => {
    const tags = notes.flatMap((note) => note.tags);
    const result = Array.from(new Set(tags)).sort();
    return result;
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const filtered = filterNotes(notes, filters);
    const result = sortNotes(filtered);
    return result;
  }, [notes, filters]);

  // Separate pinned and unpinned notes
  const pinnedNotes = useMemo(() => {
    return filteredNotes.filter((note) => note.isPinned);
  }, [filteredNotes]);

  const unpinnedNotes = useMemo(() => {
    return filteredNotes.filter((note) => !note.isPinned);
  }, [filteredNotes]);

  const activeCount = notes.filter((n) => n.status === 'active').length;
  const archivedCount = notes.filter((n) => n.status === 'archived').length;
  const trashedCount = notes.filter((n) => n.status === 'trashed').length;

  const handleAddNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'lastEditedAt'>) => {
    const now = Date.now();
    const newNote: Note = {
      ...noteData,
      id: generateNoteId(),
      createdAt: now,
      lastEditedAt: now,
    };

    setNotes([newNote, ...notes]);
  };

  const handleUpdateNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'lastEditedAt'>) => {
    if (!selectedNote) return;
    
    const now = Date.now();
    const noteWithUpdatedTime: Note = {
      ...selectedNote,
      ...noteData,
      lastEditedAt: now,
    };

    setNotes(notes.map((n) => (n.id === selectedNote.id ? noteWithUpdatedTime : n)));
    setSelectedNote(null);
    setIsEditModalOpen(false);
  };

  const handleTogglePin = (id: string) => {
    setNotes(
      notes.map((n) =>
        n.id === id ? { ...n, isPinned: !n.isPinned, lastEditedAt: Date.now() } : n
      )
    );
  };

  const handleArchive = (id: string) => {
    setNotes(
      notes.map((n) =>
        n.id === id ? { ...n, status: 'archived', isPinned: false, lastEditedAt: Date.now() } : n
      )
    );
  };

  const handleUnarchive = (id: string) => {
    setNotes(
      notes.map((n) =>
        n.id === id ? { ...n, status: 'active', lastEditedAt: Date.now() } : n
      )
    );
  };

  const handleTrash = (id: string) => {
    setNotes(
      notes.map((n) =>
        n.id === id
          ? {
              ...n,
              status: 'trashed',
              isPinned: false,
              trashedAt: Date.now(),
              lastEditedAt: Date.now(),
            }
          : n
      )
    );
  };

  const handleRestore = (id: string) => {
    setNotes(
      notes.map((n) =>
        n.id === id
          ? {
              ...n,
              status: 'active',
              trashedAt: null,
              lastEditedAt: Date.now(),
            }
          : n
      )
    );
  };

  const handleDeletePermanently = async (id: string) => {
    const confirmed = await confirm({
      title: 'Delete Note Permanently',
      message:
        'Are you sure you want to permanently delete this note? This action cannot be undone.',
      confirmText: 'Delete Permanently',
      cancelText: 'Cancel',
      destructive: true,
    });

    if (confirmed) {
      setNotes(notes.filter((n) => n.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setIsEditModalOpen(true);
  };

  return (
    <TinyPage
      title='📝 Notes'
      description='A simple note-taking app inspired by Google Keep. Create notes with titles, tags, emojis, and custom colors. Pin important notes, archive old ones, and move unwanted notes to trash (auto-deleted after 30 days).'
    >
      {/* Filters and Stats */}
      <FilterSection
        filters={filters}
        onFiltersChange={setFilters}
        allTags={allTags}
        noteCount={filteredNotes.length}
        activeCount={activeCount}
        archivedCount={archivedCount}
        trashedCount={trashedCount}
      />

      {/* Add Note Button */}
      {filters.status === 'active' && (
        <div className='flex justify-center'>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className='h-5 w-5' />
            Add Note
          </Button>
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className='space-y-6'>
          {/* Pinned Notes Section */}
          {pinnedNotes.length > 0 && (
            <div>
              <h2 className='text-foreground/70 mb-3 text-sm font-semibold uppercase tracking-wide'>
                Pinned
              </h2>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onClick={() => handleNoteClick(note)}
                    onTogglePin={() => handleTogglePin(note.id)}
                    onArchive={() => handleArchive(note.id)}
                    onUnarchive={() => handleUnarchive(note.id)}
                    onTrash={() => handleTrash(note.id)}
                    onRestore={() => handleRestore(note.id)}
                    onDelete={() => handleDeletePermanently(note.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Unpinned Notes Section */}
          {unpinnedNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <h2 className='text-foreground/70 mb-3 text-sm font-semibold uppercase tracking-wide'>
                  Others
                </h2>
              )}
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {unpinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onClick={() => handleNoteClick(note)}
                    onTogglePin={() => handleTogglePin(note.id)}
                    onArchive={() => handleArchive(note.id)}
                    onUnarchive={() => handleUnarchive(note.id)}
                    onTrash={() => handleTrash(note.id)}
                    onRestore={() => handleRestore(note.id)}
                    onDelete={() => handleDeletePermanently(note.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className='bg-muted/30 rounded-2xl p-12 text-center'>
          <p className='text-foreground/60 text-lg'>
            {filters.searchQuery || filters.selectedTags.length > 0 || filters.selectedColors.length > 0
              ? 'No notes match your filters'
              : filters.status === 'active'
                ? 'No active notes. Create your first note!'
                : filters.status === 'archived'
                  ? 'No archived notes'
                  : 'No notes in trash'}
          </p>
        </div>
      )}

      {/* Add Note Modal */}
      <NoteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddNote}
        mode='add'
        allTags={allTags}
      />

      {/* Edit Note Modal */}
      {selectedNote && (
        <NoteModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedNote(null);
          }}
          onSave={handleUpdateNote}
          initialNote={selectedNote}
          mode='edit'
          allTags={allTags}
        />
      )}
    </TinyPage>
  );
}

export default Notes;
