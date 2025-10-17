import { useState, useCallback } from 'react';
import { Destination, Photo, DestinationType } from './TravelTracker.types';

export function useTravelTracker() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

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

  const deletePhoto = useCallback((destinationId: string, photoId: string) => {
    setDestinations((prev) => {
      const result = prev.map((d) =>
        d.id === destinationId
          ? { ...d, photos: d.photos.filter((p) => p.id !== photoId) }
          : d
      );
      return result;
    });
  }, []);

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
  };
}
