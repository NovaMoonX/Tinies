import { useState, useCallback, useEffect } from 'react';
import { Destination, Photo, DestinationType, TravelTrackerData } from './TravelTracker.types';
import { useAuth } from '@hooks/useAuth';
import {
  FIREBASE_TINY_PATH,
  uploadFile,
  deleteFile,
} from '@lib/firebase';
import { useTinyDataLoader, useTinyDataSaver, withDefaults } from '@lib/tinies/tinies.hooks';

const defaultTravelTrackerData: TravelTrackerData = {
  destinations: [],
};

const defaultPhoto: Photo = {
  id: '',
  url: '',
  caption: '',
};

const defaultDestination: Destination = {
  id: '',
  type: 'us-state',
  name: '',
  country: null,
  description: '',
  photos: [],
  visitDate: '',
};

export function useTravelTracker() {
  const { user } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  const resetData = useCallback(() => {
    setDestinations([]);
    setSelectedDestination(null);
  }, []);

  // Load data from Firebase on mount
  const { data: loadedData, isLoaded } = useTinyDataLoader<TravelTrackerData>(
    FIREBASE_TINY_PATH.TRAVEL_TRACKER,
    resetData,
  );

  // Update local state when data is loaded
  useEffect(() => {
    if (loadedData) {
      const normalized = withDefaults(loadedData, defaultTravelTrackerData);
      // Normalize each individual destination and its photos
      const normalizedDestinations = normalized.destinations.map((destination) => {
        const normalizedDestination = withDefaults(
          destination as Partial<Destination> as Partial<Record<string, unknown>>,
          defaultDestination as unknown as Record<string, unknown>,
        );
        return {
          ...normalizedDestination,
          photos: (normalizedDestination.photos as Photo[]).map((photo) =>
            withDefaults(
              photo as Partial<Photo> as Partial<Record<string, unknown>>,
              defaultPhoto as unknown as Record<string, unknown>,
            ),
          ),
        };
      });
      setDestinations(normalizedDestinations as unknown as Destination[]);
    }
  }, [loadedData]);

  // Save data to Firebase with debouncing
  const dataToSave: TravelTrackerData = {
    destinations,
  };
  useTinyDataSaver(FIREBASE_TINY_PATH.TRAVEL_TRACKER, dataToSave, isLoaded);

  // Upload photo to Firebase Storage
  const uploadPhoto = useCallback(
    async (destinationId: string, file: File): Promise<string> => {
      if (!user) throw new Error('User not authenticated');

      const photoId = `photo-${Date.now()}`;
      const path = `tinies/${FIREBASE_TINY_PATH.TRAVEL_TRACKER}/${user.uid}/${destinationId}/${photoId}`;
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
    // Get the photo URL from current state
    let photoUrl: string | null = null;
    
    setDestinations((prev) => {
      const destination = prev.find((d) => d.id === destinationId);
      const photo = destination?.photos.find((p) => p.id === photoId);
      
      if (photo?.url) {
        photoUrl = photo.url;
      }

      const result = prev.map((d) =>
        d.id === destinationId
          ? { ...d, photos: d.photos.filter((p) => p.id !== photoId) }
          : d
      );
      return result;
    });
    
    // Delete file from storage after state update
    if (photoUrl) {
      await deletePhotoFile(photoUrl);
    }
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
