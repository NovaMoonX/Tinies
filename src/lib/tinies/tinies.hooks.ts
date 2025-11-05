import { useAuth } from '@hooks/useAuth';
import { getTinyData, saveTinyData } from '@lib/firebase';
import { useEffect, useRef, useState } from 'react';

/**
 * Hook to load data from Firebase Realtime Database for a specific tiny
 * @param tinyPath - The path name from DATABASE_PATHS
 * @param resetData - Callback to reset local state when user logs out
 * @returns Object containing loaded data and loading state
 */
export function useTinyDataLoader<T extends Record<string, unknown>>(
  tinyPath: string,
  resetData: () => void,
) {
  const { user } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoaded(true);
        return;
      }

      try {
        const loadedData = await getTinyData<T>(tinyPath, user.uid);

        if (loadedData) {
          setData(loadedData);
        }
      } catch (error) {
        console.error(`Error loading ${tinyPath} data:`, error);
      } finally {
        setIsLoaded(true);
      }
    };

    if (!user) {
      resetData();
    }

    loadData();
  }, [user, resetData, tinyPath]);

  return { data, isLoaded };
}

/**
 * Hook to save data to Firebase Realtime Database with debouncing
 * @param tinyPath - The path name from DATABASE_PATHS
 * @param data - The data to save
 * @param isLoaded - Whether initial data has been loaded (prevents saving before load)
 * @param debounceMs - Debounce time in milliseconds (default: 2000)
 */
export function useTinyDataSaver<T extends Record<string, unknown>>(
  tinyPath: string,
  data: T,
  isLoaded: boolean,
  debounceMs: number = 2000,
) {
  const { user } = useAuth();
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      saveTinyData(tinyPath, user.uid, data).catch((error) => {
        console.error(`Error saving ${tinyPath} data:`, error);
      });
    }, debounceMs);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [data, isLoaded, user, tinyPath, debounceMs]);
}
