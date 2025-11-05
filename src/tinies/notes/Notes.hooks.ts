import { useAuth } from '@hooks/useAuth';
import { DATABASE_PATHS, getTinyData, saveTinyData } from '@lib/firebase';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Note } from './Notes.types';

export interface NotesData extends Record<string, unknown> {
  notes: Note[];
}

export function useNotesData() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetData = useCallback(() => {
    setNotes([]);
  }, []);

  // Load data from Firebase on mount
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoaded(true);
        return;
      }

      try {
        const data = await getTinyData<NotesData>(
          DATABASE_PATHS.NOTES,
          user.uid,
        );

        if (data) {
          setNotes(data.notes || []);
        }
      } catch (error) {
        console.error('Error loading notes data:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    if (!user) {
      resetData();
    }

    loadData();
  }, [user, resetData]);

  // Save data to Firebase with debouncing
  useEffect(() => {
    if (!isLoaded || !user) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      const dataToSave: NotesData = {
        notes,
      };

      saveTinyData(DATABASE_PATHS.NOTES, user.uid, dataToSave).catch(
        (error) => {
          console.error('Error saving notes data:', error);
        },
      );
    }, 2000);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [notes, isLoaded, user]);

  return {
    notes,
    setNotes,
  };
}
