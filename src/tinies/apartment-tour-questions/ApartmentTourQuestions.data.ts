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

export const QUESTIONS: Question[] = [
  // Pricing & Lease Terms
  {
    id: 'q1',
    category: 'Pricing & Lease Terms',
    question: 'What is the security deposit amount? Are there any non-refundable fees (admin, application, etc.)?',
  },
  {
    id: 'q2',
    category: 'Pricing & Lease Terms',
    question: 'Are there any move-in specials or promotions?',
  },
  {
    id: 'q3',
    category: 'Pricing & Lease Terms',
    question: 'What are the lease term lengths available?',
  },
  
  // Building & Security
  {
    id: 'q4',
    category: 'Building & Security',
    question: "What are the building's security features? Is there controlled access, security cameras, or on-site security?",
  },
  {
    id: 'q5',
    category: 'Building & Security',
    question: "What are the building's policies on noise and quiet hours?",
  },
  
  // Amenities & Services
  {
    id: 'q6',
    category: 'Amenities & Services',
    question: 'Is there assigned parking, and if so, what is the availability?',
  },
  {
    id: 'q7',
    category: 'Amenities & Services',
    question: 'How does guest access and parking work?',
  },
  {
    id: 'q8',
    category: 'Amenities & Services',
    question: 'What is the process for getting packages or mail?',
  },
  {
    id: 'q9',
    category: 'Amenities & Services',
    question: 'How is trash and recycling handled? How to handle bulk items?',
  },
  
  // Apartment Condition
  {
    id: 'q10',
    category: 'Apartment Condition',
    question: 'Are there any current maintenance issues that need to be addressed?',
  },
  {
    id: 'q11',
    category: 'Apartment Condition',
    question: 'When was the apartment last renovated or updated?',
  },
  {
    id: 'q12',
    category: 'Apartment Condition',
    question: 'Do all appliances work properly (stove, refrigerator, dishwasher, etc.)?',
  },
  {
    id: 'q13',
    category: 'Apartment Condition',
    question: 'What is the size of the fridge/freezer?',
  },
  {
    id: 'q14',
    category: 'Apartment Condition',
    question: 'Is there adequate water pressure in the shower and sinks?',
  },
  {
    id: 'q15',
    category: 'Apartment Condition',
    question: 'Are there any signs of pests, mold, or water damage?',
  },
  {
    id: 'q16',
    category: 'Apartment Condition',
    question: 'Do all windows and doors close and lock properly?',
  },
  {
    id: 'q17',
    category: 'Apartment Condition',
    question: 'Is there sufficient storage space (closets, cabinets)?',
  },
  
  // Utilities & Services
  {
    id: 'q18',
    category: 'Utilities & Services',
    question: 'Is internet/cable included or available? What providers service the building?',
  },
  {
    id: 'q19',
    category: 'Utilities & Services',
    question: 'Is there air conditioning and heating? What type and who controls it?',
  },
  {
    id: 'q20',
    category: 'Utilities & Services',
    question: 'Is laundry available? Is it in-unit, in the building, or off-site?',
  },
  
  // Management & Maintenance
  {
    id: 'q21',
    category: 'Management & Maintenance',
    question: 'What is the policy for emergency repairs?',
  },
  {
    id: 'q22',
    category: 'Management & Maintenance',
    question: 'Are there any upcoming renovations or construction planned for the building?',
  },
  {
    id: 'q23',
    category: 'Management & Maintenance',
    question: 'How quickly does maintenance respond to repair requests?',
  },
  {
    id: 'q24',
    category: 'Management & Maintenance',
    question: 'Who do I contact for maintenance issues or emergencies?',
  },
  
  // Policies & Rules
  {
    id: 'q25',
    category: 'Policies & Rules',
    question: 'What is the early-termination process and fee?',
  },
  {
    id: 'q26',
    category: 'Policies & Rules',
    question: "What is the department's policy on subletting?",
  },
  {
    id: 'q27',
    category: 'Policies & Rules',
    question: 'What is the policy on holes in the wall?',
  },
  {
    id: 'q28',
    category: 'Policies & Rules',
    question: 'What is the pet policy (allowed pets, size/breed restrictions, fees)?',
  },
  {
    id: 'q29',
    category: 'Policies & Rules',
    question: 'What is the smoking policy for the building and unit?',
  },
  
  // Location & Transportation
  {
    id: 'q30',
    category: 'Location & Transportation',
    question: 'What is public transportation like in the area?',
  },
  {
    id: 'q31',
    category: 'Location & Transportation',
    question: 'How close is the apartment to grocery stores and other amenities?',
  },
];