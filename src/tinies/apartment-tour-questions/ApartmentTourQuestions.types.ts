export interface Question {
  id: string;
  category: string;
  question: string;
  isCustom: boolean;
  associatedApartments: string[]; // Array of apartment IDs this question is associated with
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
  rentPrice: number | null;
}

export interface Apartment {
  id: string;
  name: string;
  address: string;
  website: string;
  phoneNumber: string;
  email: string;
  customLinks: CustomLink[];
  keyAmenities: string[];
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
  isCustom: boolean;
  unitId: string | null; // Optional: if specified, this cost is for a specific unit
  isOneTime: boolean; // True for one-time fees (security deposits, application fees), false/undefined for monthly costs
}

export interface ApartmentCost {
  apartmentId: string;
  costs: CostItem[];
}

/**
 * Firestore document structure for Apartment Tour Questions
 * This represents all the data for a user's apartment tour questions
 */
export interface ApartmentTourQuestionsData extends Record<string, unknown> {
  customQuestions: Question[];
  apartments: Apartment[];
  selectedApartment: string | null;
  answers: Answer[];
  notes: ApartmentNote[];
  followUps: FollowUpItem[];
  costs: ApartmentCost[];
  units: Unit[];
}