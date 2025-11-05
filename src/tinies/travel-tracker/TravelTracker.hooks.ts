import { useState, useCallback, useEffect, useRef } from 'react';
import { Destination, Photo, DestinationType, TravelTrackerData } from './TravelTracker.types';
import { useAuth } from '@hooks/useAuth';
import {
  DATABASE_PATHS,
  STORAGE_PATHS,
  getTinyData,
  saveTinyData,
  uploadFile,
  deleteFile,
} from '@lib/firebase';

export function useTravelTracker() {
  const { user } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetData = useCallback(() => {
    setDestinations([]);
    setSelectedDestination(null);
  }, []);

  // Load data from Firebase on mount
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoaded(true);
        return;
      }

      try {
        const data = await getTinyData<TravelTrackerData>(
          DATABASE_PATHS.TRAVEL_TRACKER,
          user.uid,
        );

        if (data) {
          setDestinations(data.destinations || []);
        }
      } catch (error) {
        console.error('Error loading travel tracker data:', error);
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
      const dataToSave: TravelTrackerData = {
        destinations,
      };

      saveTinyData(DATABASE_PATHS.TRAVEL_TRACKER, user.uid, dataToSave).catch(
        (error) => {
          console.error('Error saving travel tracker data:', error);
        },
      );
    }, 2000);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [destinations, isLoaded, user]);

  // Upload photo to Firebase Storage
  const uploadPhoto = useCallback(
    async (destinationId: string, file: File): Promise<string> => {
      if (!user) throw new Error('User not authenticated');

      const photoId = `photo-${Date.now()}`;
      const path = `tinies/${STORAGE_PATHS.TRAVEL_TRACKER}/${user.uid}/${destinationId}/${photoId}`;
      const downloadURL = await uploadFile(path, file);
      return downloadURL;
    },
    [user],
  );

  // Delete photo from Firebase Storage
  const deletePhotoFile = useCallback(
    async (photoUrl: string): Promise<void> => {
      if (!user) return;

      try {
        const urlObj = new URL(photoUrl);
        const pathMatch = urlObj.pathname.match(/\/o\/(.+)/);
        if (pathMatch) {
          const encodedPath = pathMatch[1].split('?')[0];
          const path = decodeURIComponent(encodedPath);
          await deleteFile(path);
        }
      } catch (error) {
        console.error('Error deleting photo file:', error);
      }
    },
    [user],
  );

  const addDestination = useCallback((
    type: DestinationType,
    name: string,
    country: string | null,
  ) => {
    const newDestination: Destination = {
      id: `dest-${Date.now()}`,
      type,
      name,
      country,
      description: '',
      photos: [],
      visitDate: new Date().toISOString().split('T')[0],
    };

    setDestinations((prev) => {
      const result = [...prev, newDestination];
      return result;
    });
    
    setSelectedDestination(newDestination.id);
  }, []);

  const deleteDestination = useCallback((destinationId: string) => {
    setDestinations((prev) => {
      const result = prev.filter((d) => d.id !== destinationId);
      return result;
    });
    
    if (selectedDestination === destinationId) {
      setSelectedDestination(null);
    }
  }, [selectedDestination]);

  const updateDescription = useCallback((destinationId: string, description: string) => {
    setDestinations((prev) => {
      const result = prev.map((d) =>
        d.id === destinationId ? { ...d, description } : d
      );
      return result;
    });
  }, []);

  const updateVisitDate = useCallback((destinationId: string, visitDate: string) => {
    setDestinations((prev) => {
      const result = prev.map((d) =>
        d.id === destinationId ? { ...d, visitDate } : d
      );
      return result;
    });
  }, []);

  const addPhoto = useCallback((destinationId: string, url: string, caption: string) => {
    const newPhoto: Photo = {
      id: `photo-${Date.now()}`,
      url,
      caption,
    };

    setDestinations((prev) => {
      const result = prev.map((d) =>
        d.id === destinationId
          ? { ...d, photos: [...d.photos, newPhoto] }
          : d
      );
      return result;
    });
  }, []);

  const deletePhoto = useCallback(async (destinationId: string, photoId: string) => {
    // Get the photo URL before deleting to remove from storage
    setDestinations((prev) => {
      const destination = prev.find((d) => d.id === destinationId);
      const photo = destination?.photos.find((p) => p.id === photoId);
      
      if (photo?.url) {
        deletePhotoFile(photo.url).catch((error) => {
          console.error('Error deleting photo file:', error);
        });
      }

      const result = prev.map((d) =>
        d.id === destinationId
          ? { ...d, photos: d.photos.filter((p) => p.id !== photoId) }
          : d
      );
      return result;
    });
  }, [deletePhotoFile]);

  const updatePhotoCaption = useCallback((
    destinationId: string,
    photoId: string,
    caption: string,
  ) => {
    setDestinations((prev) => {
      const result = prev.map((d) =>
        d.id === destinationId
          ? {
              ...d,
              photos: d.photos.map((p) =>
                p.id === photoId ? { ...p, caption } : p
              ),
            }
          : d
      );
      return result;
    });
  }, []);

  const getDestination = useCallback((destinationId: string) => {
    const result = destinations.find((d) => d.id === destinationId);
    return result;
  }, [destinations]);

  return {
    destinations,
    selectedDestination,
    setSelectedDestination,
    addDestination,
    deleteDestination,
    updateDescription,
    updateVisitDate,
    addPhoto,
    deletePhoto,
    updatePhotoCaption,
    getDestination,
    uploadPhoto,
  };
}
