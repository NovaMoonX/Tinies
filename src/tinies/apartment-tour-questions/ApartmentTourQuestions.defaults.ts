import {
  Answer,
  Apartment,
  ApartmentCost,
  ApartmentNote,
  ApartmentTourQuestionsData,
  CostItem,
  CustomLink,
  FollowUpItem,
  Question,
  Unit,
} from './ApartmentTourQuestions.types';

export const defaultApartmentTourData: ApartmentTourQuestionsData = {
  customQuestions: [],
  apartments: [],
  selectedApartment: null,
  answers: [],
  notes: [],
  followUps: [],
  costs: [],
  units: [],
};

export const defaultQuestion: Question = {
  id: '',
  category: '',
  question: '',
  isCustom: false,
  associatedApartments: [],
};

export const defaultCustomLink: CustomLink = {
  id: '',
  label: '',
  url: '',
};

export const defaultApartment: Apartment = {
  id: '',
  name: '',
  address: '',
  website: '',
  phoneNumber: '',
  email: '',
  customLinks: [],
  keyAmenities: [],
};

export const defaultUnit: Unit = {
  id: '',
  name: '',
  apartmentId: '',
  rentPrice: null,
};

export const defaultAnswer: Answer = {
  questionId: '',
  apartmentId: '',
  answer: '',
};

export const defaultApartmentNote: ApartmentNote = {
  apartmentId: '',
  note: '',
};

export const defaultFollowUpItem: FollowUpItem = {
  id: '',
  apartmentId: '',
  text: '',
  completed: false,
};

export const defaultCostItem: CostItem = {
  id: '',
  label: '',
  amount: 0,
  isCustom: false,
  unitId: null,
  isOneTime: false,
};

export const defaultApartmentCost: ApartmentCost = {
  apartmentId: '',
  costs: [],
};

