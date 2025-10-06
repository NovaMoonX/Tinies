export interface Question {
  id: string;
  category: string;
  question: string;
  isCustom?: boolean;
  associatedApartments?: string[]; // Array of apartment IDs this question is associated with
}

export interface CustomLink {
  id: string;
  label: string;
  url: string;
}

export interface Unit {
  id: string;
  name: string;
  apartmentId: string;
  rentPrice?: number;
}

export interface Apartment {
  id: string;
  name: string;
  address?: string;
  website?: string;
  phoneNumber?: string;
  email?: string;
  customLinks?: CustomLink[];
}

export interface Answer {
  questionId: string;
  apartmentId: string;
  answer: string;
}

export interface ApartmentNote {
  apartmentId: string;
  note: string;
}

export interface FollowUpItem {
  id: string;
  apartmentId: string;
  text: string;
  completed: boolean;
}

export interface CostItem {
  id: string;
  label: string;
  amount: number;
  isCustom?: boolean;
  unitId?: string; // Optional: if specified, this cost is for a specific unit
}

export interface ApartmentCost {
  apartmentId: string;
  costs: CostItem[];
}