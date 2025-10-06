import { Question, CostItem } from './ApartmentTourQuestions.types';

// Building-wide default cost categories (not associated with units)
// Note: Rent is handled separately and can be unit-specific
export const DEFAULT_COST_CATEGORIES: Omit<CostItem, 'id' | 'amount'>[] = [
  { label: 'Water', isCustom: false },
  { label: 'Electricity', isCustom: false },
  { label: 'Gas', isCustom: false },
  { label: 'Pet Fee', isCustom: false },
  { label: 'Parking', isCustom: false },
];

// Default one-time fees (paid once, not monthly)
export const DEFAULT_ONE_TIME_FEES: Omit<CostItem, 'id' | 'amount'>[] = [
  { label: 'Security Deposit', isCustom: false, isOneTime: true },
  { label: 'Application Fee', isCustom: false, isOneTime: true },
  { label: 'Admin Fee', isCustom: false, isOneTime: true },
  { label: 'Pet Deposit', isCustom: false, isOneTime: true },
  { label: 'Key Fee', isCustom: false, isOneTime: true },
];

const BASE_QUESTIONS: Omit<Question, 'id'>[] = [
  // Pricing & Lease Terms
  {
    category: 'Pricing & Lease Terms',
    question: 'What is included in the rent?',
  },
  {
    category: 'Pricing & Lease Terms',
    question: 'Are any fees refundable (i.e. security deposit)?',
  },
  {
    category: 'Pricing & Lease Terms',
    question: 'Are there any move-in specials or promotions?',
  },
  {
    category: 'Pricing & Lease Terms',
    question: 'What are the lease term lengths available?',
  },

  // Building & Security
  {
    category: 'Building & Security',
    question:
      "What are the building's security features? Is there controlled access, security cameras, or on-site security?",
  },
  {
    category: 'Building & Security',
    question: "What are the building's policies on noise and quiet hours?",
  },

  // Parking
  {
    category: 'Parking',
    question: 'Is there assigned or unassigned parking?',
  },
  {
    category: 'Parking',
    question: 'How does guest access and parking work?',
  },

  // Amenities & Services
  {
    category: 'Amenities & Services',
    question: 'What is the process for getting packages or mail?',
  },
  {
    category: 'Amenities & Services',
    question: 'How is trash and recycling handled? How to handle bulk items?',
  },
  {
    category: 'Amenities & Services',
    question: 'What size is the gym and what equipment is available?',
  },
  {
    category: 'Amenities & Services',
    question: 'What are the hours for all amenities?',
  },

  // Apartment Condition
  {
    category: 'Apartment Condition',
    question:
      'Are there any current maintenance issues that need to be addressed?',
  },
  {
    category: 'Apartment Condition',
    question: 'What is the size of the fridge/freezer?',
  },
  {
    category: 'Apartment Condition',
    question: 'Is there adequate water pressure in the shower and sinks?',
  },
  {
    category: 'Apartment Condition',
    question: 'Are there any signs of pests, mold, or water damage?',
  },
  {
    category: 'Apartment Condition',
    question: 'Do all windows and doors close and lock properly?',
  },
  {
    category: 'Apartment Condition',
    question: 'Is there sufficient storage space (closets, cabinets)?',
  },
  {
    category: 'Apartment Condition',
    question: 'When was the apartment last renovated or updated?',
  },
  {
    category: 'Apartment Condition',
    question:
      'Do all appliances work properly (stove, refrigerator, dishwasher, etc.)?',
  },

  // Utilities & Services
  {
    category: 'Utilities & Services',
    question:
      'Is internet/cable included or available? What providers service the building?',
  },
  {
    category: 'Utilities & Services',
    question:
      'Is there air conditioning and heating? What type and who controls it?',
  },
  {
    category: 'Utilities & Services',
    question:
      'Is laundry available? Is it in-unit, in the building, or off-site?',
  },

  // Management & Maintenance
  {
    category: 'Management & Maintenance',
    question: 'What is the policy for emergency repairs?',
  },
  {
    category: 'Management & Maintenance',
    question:
      'Are there any upcoming renovations or construction planned for the building?',
  },
  {
    category: 'Management & Maintenance',
    question: 'How quickly does maintenance respond to repair requests?',
  },
  {
    category: 'Management & Maintenance',
    question: 'Who do I contact for maintenance issues or emergencies?',
  },

  // Policies & Rules
  {
    category: 'Policies & Rules',
    question: 'What is the early-termination process and fee?',
  },
  {
    category: 'Policies & Rules',
    question: "What is the department's policy on subletting?",
  },
  {
    category: 'Policies & Rules',
    question: 'What is the policy on holes in the wall?',
  },
  {
    category: 'Policies & Rules',
    question:
      'What is the pet policy (allowed pets, size/breed restrictions, fees)?',
  },
  {
    category: 'Policies & Rules',
    question: 'What is the smoking policy for the building and unit?',
  },

  // Location & Transportation
  {
    category: 'Location & Transportation',
    question: 'What is public transportation like in the area?',
  },
  {
    category: 'Location & Transportation',
    question:
      'How close is the apartment to grocery stores and other shopping areas?',
  },
  {
    category: 'Location & Transportation',
    question: 'Is there areas to go for walks or runs nearby?',
  },
];

export const QUESTIONS = BASE_QUESTIONS.map((q, index) => ({
  ...q,
  id: `q${index + 1}`,
}));
