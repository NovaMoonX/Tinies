import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Car,
  ServiceEntry,
  ServiceLocation,
  CarPart,
  FileAttachment,
  CarMaintenanceData,
} from './CarMaintenance.types';
import {
  generateId,
  getAllDefaultParts,
  autoDetectCarParts,
} from './CarMaintenance.utils';
import { useAuth } from '@hooks/useAuth';
import {
  FIREBASE_TINY_PATH,
  uploadFile,
  deleteFile,
} from '@lib/firebase';
import { useTinyDataLoader, useTinyDataSaver, withDefaults } from '@lib/tinies/tinies.hooks';

const defaultCarMaintenanceData: CarMaintenanceData = {
  cars: [],
  selectedCar: null,
  serviceEntries: [],
  serviceLocations: [],
  customCarParts: [],
};

const defaultCar: Car = {
  id: '',
  name: '',
  make: '',
  model: '',
  year: null,
  vin: '',
  licensePlate: '',
  mileage: null,
  notes: '',
};

const defaultServiceLocation: ServiceLocation = {
  id: '',
  name: '',
  address: '',
  phoneNumber: '',
  website: '',
  email: '',
  notes: '',
};

const defaultFileAttachment: FileAttachment = {
  id: '',
  name: '',
  url: '',
  type: 'document',
  size: 0,
};

const defaultCarPart: CarPart = {
  id: '',
  name: '',
  category: 'internal',
  isCustom: false,
};

const defaultServiceEntry: ServiceEntry = {
  id: '',
  carId: '',
  serviceType: '',
  isRoutine: false,
  title: '',
  description: '',
  date: '',
  time: '',
  locationId: null,
  mileage: null,
  cost: null,
  notes: '',
  attachments: [],
  carParts: [],
};

export function useCarMaintenance() {
  const { user } = useAuth();
  // State
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [serviceEntries, setServiceEntries] = useState<ServiceEntry[]>([]);
  const [serviceLocations, setServiceLocations] = useState<ServiceLocation[]>(
    [],
  );
  const [customCarParts, setCustomCarParts] = useState<CarPart[]>([]);

  const resetData = useCallback(() => {
    setCars([]);
    setSelectedCar(null);
    setServiceEntries([]);
    setServiceLocations([]);
    setCustomCarParts([]);
  }, []);

  // Load data from Firebase on mount
  const { data: loadedData, isLoaded } = useTinyDataLoader<CarMaintenanceData>(
    FIREBASE_TINY_PATH.CAR_MAINTENANCE,
    resetData,
  );

  // Update local state when data is loaded
  useEffect(() => {
    if (loadedData) {
      const normalized = withDefaults(loadedData, defaultCarMaintenanceData);
      
      // Normalize each individual car
      const normalizedCars = normalized.cars.map((car) =>
        withDefaults(
          car as Partial<Car> as Partial<Record<string, unknown>>,
          defaultCar as unknown as Record<string, unknown>,
        ),
      );
      
      // Normalize each individual service location
      const normalizedServiceLocations = normalized.serviceLocations.map((location) =>
        withDefaults(
          location as Partial<ServiceLocation> as Partial<Record<string, unknown>>,
          defaultServiceLocation as unknown as Record<string, unknown>,
        ),
      );
      
      // Normalize each individual service entry and its nested objects
      const normalizedServiceEntries = normalized.serviceEntries.map((entry) => {
        const normalizedEntry = withDefaults(
          entry as Partial<ServiceEntry> as Partial<Record<string, unknown>>,
          defaultServiceEntry as unknown as Record<string, unknown>,
        );
        return {
          ...normalizedEntry,
          attachments: (normalizedEntry.attachments as FileAttachment[]).map((attachment) =>
            withDefaults(
              attachment as Partial<FileAttachment> as Partial<Record<string, unknown>>,
              defaultFileAttachment as unknown as Record<string, unknown>,
            ),
          ),
        };
      });
      
      // Normalize each individual custom car part
      const normalizedCustomCarParts = normalized.customCarParts.map((part) =>
        withDefaults(
          part as Partial<CarPart> as Partial<Record<string, unknown>>,
          defaultCarPart as unknown as Record<string, unknown>,
        ),
      );
      
      setCars(normalizedCars as unknown as Car[]);
      setSelectedCar(normalized.selectedCar);
      setServiceEntries(normalizedServiceEntries as unknown as ServiceEntry[]);
      setServiceLocations(normalizedServiceLocations as unknown as ServiceLocation[]);
      setCustomCarParts(normalizedCustomCarParts as unknown as CarPart[]);
    }
  }, [loadedData]);

  // Save data to Firebase with debouncing
  const dataToSave: CarMaintenanceData = {
    cars,
    selectedCar,
    serviceEntries,
    serviceLocations,
    customCarParts,
  };
  useTinyDataSaver(FIREBASE_TINY_PATH.CAR_MAINTENANCE, dataToSave, isLoaded);

  // Upload file to Firebase Storage
  const uploadAttachment = useCallback(
    async (serviceEntryId: string, file: File): Promise<FileAttachment> => {
      if (!user) throw new Error('User not authenticated');

      const attachmentId = `attachment-${Date.now()}`;
      const path = `tinies/${FIREBASE_TINY_PATH.CAR_MAINTENANCE}/${user.uid}/${serviceEntryId}/${attachmentId}-${file.name}`;
      const downloadURL = await uploadFile(path, file);

      const attachment: FileAttachment = {
        id: attachmentId,
        name: file.name,
        url: downloadURL,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        size: file.size,
      };

      return attachment;
    },
    [user],
  );

  // Delete file from Firebase Storage
  const deleteAttachmentFile = useCallback(
    async (attachmentUrl: string): Promise<void> => {
      if (!user) return;

      try {
        const urlObj = new URL(attachmentUrl);
        const pathMatch = urlObj.pathname.match(/\/o\/(.+)/);
        if (pathMatch) {
          const encodedPath = pathMatch[1].split('?')[0];
          const path = decodeURIComponent(encodedPath);
          await deleteFile(path);
        }
      } catch (error) {
        console.error('Error deleting attachment file:', error);
      }
    },
    [user],
  );

  // Get all available car parts (default + custom)
  const allCarParts = useMemo(() => {
    const defaultParts = getAllDefaultParts();
    const result = [
      ...defaultParts.map((part) => ({
        id: `default-${part.name.toLowerCase().replace(/\s+/g, '-')}`,
        ...part,
        isCustom: false,
      })),
      ...customCarParts,
    ];
    return result;
  }, [customCarParts]);

  // Car operations
  const addCar = useCallback((name: string) => {
    const newCar: Car = {
      id: generateId(),
      name,
      make: '',
      model: '',
      year: null,
      vin: '',
      licensePlate: '',
      mileage: null,
      notes: '',
    };
    setCars((prev) => [...prev, newCar]);
    setSelectedCar(newCar.id);
  }, []);

  const deleteCar = useCallback((carId: string) => {
    setCars((prev) => prev.filter((car) => car.id !== carId));
    setServiceEntries((prev) => prev.filter((entry) => entry.carId !== carId));
    setSelectedCar((prev) => (prev === carId ? null : prev));
  }, []);

  const updateCar = useCallback(
    (carId: string, updates: Partial<Omit<Car, 'id'>>) => {
      setCars((prev) =>
        prev.map((car) => (car.id === carId ? { ...car, ...updates } : car)),
      );
    },
    [],
  );

  const getCar = useCallback(
    (carId: string) => {
      const result = cars.find((car) => car.id === carId);
      return result;
    },
    [cars],
  );

  // Service entry operations
  const addServiceEntry = useCallback(
    (
      carId: string,
      serviceType: string,
      isRoutine: boolean,
      title: string,
      description: string,
      date: string,
      time: string,
      locationId: string | null,
      mileage: number | null,
      cost: number | null,
      notes: string,
      attachments: FileAttachment[],
      manualCarParts: string[],
    ) => {
      // Auto-detect car parts from title, description, and notes
      const autoDetectedParts = autoDetectCarParts(
        title,
        description,
        notes,
        allCarParts,
      );

      // Combine manual and auto-detected parts (remove duplicates)
      const allPartIds = Array.from(
        new Set([...manualCarParts, ...autoDetectedParts]),
      );

      const newEntry: ServiceEntry = {
        id: generateId(),
        carId,
        serviceType,
        isRoutine,
        title,
        description,
        date,
        time,
        locationId,
        mileage,
        cost,
        notes,
        attachments,
        carParts: allPartIds,
      };
      setServiceEntries((prev) => [newEntry, ...prev]);
    },
    [allCarParts],
  );

  const deleteServiceEntry = useCallback((entryId: string) => {
    setServiceEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  }, []);

  const updateServiceEntry = useCallback(
    (entryId: string, updates: Partial<Omit<ServiceEntry, 'id' | 'carId'>>) => {
      setServiceEntries((prev) =>
        prev.map((entry) => {
          if (entry.id !== entryId) return entry;

          const updatedEntry = { ...entry, ...updates };

          // Re-run auto-detection if title, description, or notes changed
          if (
            updates.title !== undefined ||
            updates.description !== undefined ||
            updates.notes !== undefined
          ) {
            const autoDetectedParts = autoDetectCarParts(
              updatedEntry.title,
              updatedEntry.description,
              updatedEntry.notes,
              allCarParts,
            );

            // Keep manually added parts and merge with newly auto-detected ones
            const manualParts = entry.carParts || [];
            updatedEntry.carParts = Array.from(
              new Set([...manualParts, ...autoDetectedParts]),
            );
          }

          return updatedEntry;
        }),
      );
    },
    [allCarParts],
  );

  const getServiceEntriesForCar = useCallback(
    (carId: string) => {
      const result = serviceEntries.filter((entry) => entry.carId === carId);
      return result;
    },
    [serviceEntries],
  );

  // Service location operations
  const addServiceLocation = useCallback(
    (
      name: string,
      address: string,
      phoneNumber: string,
      website: string,
      email: string,
      notes: string,
    ) => {
      const newLocation: ServiceLocation = {
        id: generateId(),
        name,
        address,
        phoneNumber,
        website,
        email,
        notes,
      };
      setServiceLocations((prev) => [...prev, newLocation]);
      return newLocation.id;
    },
    [],
  );

  const deleteServiceLocation = useCallback((locationId: string) => {
    setServiceLocations((prev) =>
      prev.filter((location) => location.id !== locationId),
    );
    // Update service entries that reference this location
    setServiceEntries((prev) =>
      prev.map((entry) =>
        entry.locationId === locationId
          ? { ...entry, locationId: null }
          : entry,
      ),
    );
  }, []);

  const updateServiceLocation = useCallback(
    (
      locationId: string,
      updates: Partial<Omit<ServiceLocation, 'id'>>,
    ) => {
      setServiceLocations((prev) =>
        prev.map((location) =>
          location.id === locationId ? { ...location, ...updates } : location,
        ),
      );
    },
    [],
  );

  // Car parts operations
  const addCustomCarPart = useCallback(
    (name: string, category: 'internal' | 'external') => {
      const newPart: CarPart = {
        id: generateId(),
        name,
        category,
        isCustom: true,
      };
      setCustomCarParts((prev) => [...prev, newPart]);
      return newPart.id;
    },
    [],
  );

  const deleteCustomCarPart = useCallback((partId: string) => {
    setCustomCarParts((prev) => prev.filter((part) => part.id !== partId));
    // Remove this part from all service entries
    setServiceEntries((prev) =>
      prev.map((entry) => ({
        ...entry,
        carParts: entry.carParts.filter((id) => id !== partId),
      })),
    );
  }, []);

  const updateServiceCarParts = useCallback(
    (entryId: string, partIds: string[]) => {
      setServiceEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId ? { ...entry, carParts: partIds } : entry,
        ),
      );
    },
    [],
  );

  return {
    // State
    cars,
    selectedCar,
    serviceEntries,
    serviceLocations,
    allCarParts,

    // Car operations
    addCar,
    deleteCar,
    updateCar,
    getCar,
    setSelectedCar,

    // Service entry operations
    addServiceEntry,
    deleteServiceEntry,
    updateServiceEntry,
    getServiceEntriesForCar,

    // Service location operations
    addServiceLocation,
    deleteServiceLocation,
    updateServiceLocation,

    // Car parts operations
    addCustomCarPart,
    deleteCustomCarPart,
    updateServiceCarParts,

    // File operations
    uploadAttachment,
    deleteAttachmentFile,
  };
}
