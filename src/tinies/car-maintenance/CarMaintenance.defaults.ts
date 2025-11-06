import {
  Car,
  CarMaintenanceData,
  CarPart,
  FileAttachment,
  ServiceEntry,
  ServiceLocation,
} from './CarMaintenance.types';

export const defaultCarMaintenanceData: CarMaintenanceData = {
  cars: [],
  selectedCar: null,
  serviceEntries: [],
  serviceLocations: [],
  customCarParts: [],
};

export const defaultCar: Car = {
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

export const defaultServiceLocation: ServiceLocation = {
  id: '',
  name: '',
  address: '',
  phoneNumber: '',
  website: '',
  email: '',
  notes: '',
};

export const defaultFileAttachment: FileAttachment = {
  id: '',
  name: '',
  url: '',
  type: 'document',
  size: 0,
};

export const defaultCarPart: CarPart = {
  id: '',
  name: '',
  category: 'internal',
  isCustom: false,
};

export const defaultServiceEntry: ServiceEntry = {
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

