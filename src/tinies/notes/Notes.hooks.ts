import { FIREBASE_TINY_PATH } from '@lib/firebase';
import { useTinyDataLoader, useTinyDataSaver, withDefaults } from '@lib/tinies/tinies.hooks';
import { useCallback, useEffect, useState } from 'react';
import { Note } from './Notes.types';

export interface NotesData extends Record<string, unknown> {
  notes: Note[];
}

const defaultNotesData: NotesData = {
  notes: [],
};

const defaultNote: Note = {
  id: '',
  title: '',
  content: '',
  list: null,
  emoji: null,
  color: 'default',
  tags: [],
  isPinned: false,
  status: 'active',
  createdAt: 0,
  lastEditedAt: 0,
  trashedAt: null,
};

export function useNotesData() {
  const [notes, setNotes] = useState<Note[]>([]);

  const resetData = useCallback(() => {
    setNotes([]);
  }, []);

  // Load data from Firebase on mount
  const { data: loadedData, isLoaded } = useTinyDataLoader<NotesData>(
    FIREBASE_TINY_PATH.NOTES,
    resetData,
  );

  // Update local state when data is loaded
  useEffect(() => {
    if (loadedData) {
      const normalized = withDefaults(loadedData, defaultNotesData);
      // Normalize each individual note
      const normalizedNotes = normalized.notes.map((note) =>
        withDefaults(
          note as Partial<Note> as Partial<Record<string, unknown>>,
          defaultNote as unknown as Record<string, unknown>,
        ),
      );
      setNotes(normalizedNotes as unknown as Note[]);
    }
  }, [loadedData]);

  // Save data to Firebase with debouncing
  const dataToSave: NotesData = {
    notes,
  };
  useTinyDataSaver(FIREBASE_TINY_PATH.NOTES, dataToSave, isLoaded);

  return {
    notes,
    setNotes,
  };
}
