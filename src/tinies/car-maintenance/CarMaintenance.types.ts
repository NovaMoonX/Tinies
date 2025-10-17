export interface Car {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number | null;
  vin: string;
  licensePlate: string;
  mileage: number | null;
  notes: string;
}

export interface ServiceLocation {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  website: string;
  email: string;
  notes: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document';
  size: number;
}

export interface CarPart {
  id: string;
  name: string;
  category: 'internal' | 'external';
  isCustom: boolean;
}

export interface ServiceEntry {
  id: string;
  carId: string;
  serviceType: string;
  isRoutine: boolean;
  title: string;
  description: string;
  date: string; // ISO date string
  time: string;
  locationId: string | null;
  mileage: number | null;
  cost: number | null;
  notes: string;
  attachments: FileAttachment[];
  carParts: string[]; // Array of car part IDs
}

/**
 * Data structure for Car Maintenance Tracker
 */
export interface CarMaintenanceData extends Record<string, unknown> {
  cars: Car[];
  selectedCar: string | null;
  serviceEntries: ServiceEntry[];
  serviceLocations: ServiceLocation[];
  customCarParts: CarPart[];
}
