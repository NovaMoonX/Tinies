import { FIREBASE_TINY_PATH } from '@lib/firebase';
import { useTinyDataLoader, useTinyDataSaver, withDefaults } from '@lib/tinies/tinies.hooks';
import { useCallback, useEffect, useState } from 'react';
import { defaultNote, defaultNotesData } from './Notes.defaults';
import { Note, NotesData } from './Notes.types';

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
        withDefaults<Note>(note, defaultNote),
      );
      setNotes(normalizedNotes);
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
