export interface Question {
  id: string;
  category: string;
  question: string;
  isCustom?: boolean;
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