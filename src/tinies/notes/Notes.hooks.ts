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
      setNotes(normalized.notes);
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
