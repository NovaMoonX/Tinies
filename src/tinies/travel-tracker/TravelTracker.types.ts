export type DestinationType = 'us-state' | 'international-city';

export interface Photo {
  id: string;
  url: string;
  caption: string;
}

export interface Destination {
  id: string;
  type: DestinationType;
  name: string; // State name or city name
  country: string | null; // null for US states, country name for international cities
  description: string;
  photos: Photo[];
  visitDate: string; // ISO date string
}

/**
 * Main data structure for Travel Tracker
 */
export interface TravelTrackerData extends Record<string, unknown> {
  destinations: Destination[];
}
