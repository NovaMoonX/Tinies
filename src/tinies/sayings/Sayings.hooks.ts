import { FIREBASE_TINY_PATH } from '@lib/firebase';
import { useTinyDataLoader, useTinyDataSaver, withDefaults } from '@lib/tinies/tinies.hooks';
import { useCallback, useEffect, useState } from 'react';
import { defaultSaying, defaultSayingsData } from './Sayings.defaults';
import { Saying, SayingsData } from './Sayings.types';

export function useSayingsData() {
  const [sayings, setSayings] = useState<Saying[]>([]);

  const resetData = useCallback(() => {
    setSayings([]);
  }, []);

  // Load data from Firebase on mount
  const { data: loadedData, isLoaded } = useTinyDataLoader<SayingsData>(
    FIREBASE_TINY_PATH.SAYINGS,
    resetData,
  );

  // Update local state when data is loaded
  useEffect(() => {
    if (loadedData) {
      const normalized = withDefaults(loadedData, defaultSayingsData);
      // Normalize each individual saying
      const normalizedSayings = normalized.sayings.map((saying) =>
        withDefaults<Saying>(saying, defaultSaying),
      );
      setSayings(normalizedSayings);
    }
  }, [loadedData]);

  // Save data to Firebase with debouncing
  const dataToSave: SayingsData = {
    sayings,
  };
  useTinyDataSaver(FIREBASE_TINY_PATH.SAYINGS, dataToSave, isLoaded);

  return {
    sayings,
    setSayings,
  };
}
