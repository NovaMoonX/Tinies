import {
  Destination,
  Photo,
  TravelTrackerData,
} from './TravelTracker.types';

export const defaultTravelTrackerData: TravelTrackerData = {
  destinations: [],
};

export const defaultPhoto: Photo = {
  id: '',
  url: '',
  caption: '',
};

export const defaultDestination: Destination = {
  id: '',
  type: 'us-state',
  name: '',
  country: null,
  description: '',
  photos: [],
  visitDate: '',
};

