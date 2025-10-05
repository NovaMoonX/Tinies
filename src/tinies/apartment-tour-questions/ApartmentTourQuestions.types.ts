export interface Question {
  id: string;
  category: string;
  question: string;
  isCustom?: boolean;
  associatedApartments?: string[]; // Array of apartment IDs this question is associated with
}

export interface Apartment {
  id: string;
  name: string;
  address?: string;
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