import { useState, useCallback, useMemo } from 'react';
import {
  Car,
  ServiceEntry,
  ServiceLocation,
  CarPart,
  FileAttachment,
} from './CarMaintenance.types';
import {
  generateId,
  getAllDefaultParts,
  autoDetectCarParts,
} from './CarMaintenance.utils';

export function useCarMaintenance() {
  // State
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [serviceEntries, setServiceEntries] = useState<ServiceEntry[]>([]);
  const [serviceLocations, setServiceLocations] = useState<ServiceLocation[]>(
    [],
  );
  const [customCarParts, setCustomCarParts] = useState<CarPart[]>([]);

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
  };
}
