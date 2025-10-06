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
  // Building & Location
  {
    id: 'q1',
    category: 'Building & Location',
    question: 'What is the rent amount and what does it include (utilities, parking, etc.)?',
  },
  {
    id: 'q2',
    category: 'Building & Location',
    question: 'What is the security deposit amount and is it refundable?',
  },
  {
    id: 'q3',
    category: 'Building & Location',
    question: 'When is rent due each month and what payment methods are accepted?',
  },
  {
    id: 'q4',
    category: 'Building & Location',
    question: 'Are there any additional fees (pet fees, amenity fees, parking fees)?',
  },
  {
    id: 'q5',
    category: 'Building & Location',
    question: 'What is the lease term and are there options for renewal?',
  },
  {
    id: 'q6',
    category: 'Building & Location',
    question: 'Is there a penalty for breaking the lease early?',
  },
  {
    id: 'q7',
    category: 'Building & Location',
    question: 'What are the quiet hours and noise policies?',
  },
  {
    id: 'q8',
    category: 'Building & Location',
    question: 'Is the neighborhood safe? Are there recent crime statistics?',
  },
  {
    id: 'q9',
    category: 'Building & Location',
    question: 'How close is public transportation, grocery stores, and other amenities?',
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
    question: 'Is there adequate water pressure in the shower and sinks?',
  },
  {
    id: 'q14',
    category: 'Apartment Condition',
    question: 'Are there any signs of pests, mold, or water damage?',
  },
  {
    id: 'q15',
    category: 'Apartment Condition',
    question: 'Do all windows and doors close and lock properly?',
  },
  {
    id: 'q16',
    category: 'Apartment Condition',
    question: 'Is there sufficient storage space (closets, cabinets)?',
  },
  
  // Utilities & Services
  {
    id: 'q17',
    category: 'Utilities & Services',
    question: 'What utilities am I responsible for paying?',
  },
  {
    id: 'q18',
    category: 'Utilities & Services',
    question: 'What is the average monthly cost for utilities?',
  },
  {
    id: 'q19',
    category: 'Utilities & Services',
    question: 'Is internet/cable included or available? What providers service the building?',
  },
  {
    id: 'q20',
    category: 'Utilities & Services',
    question: 'Is there air conditioning and heating? What type and who controls it?',
  },
  {
    id: 'q21',
    category: 'Utilities & Services',
    question: 'Is laundry available? Is it in-unit, in the building, or off-site?',
  },
  {
    id: 'q22',
    category: 'Utilities & Services',
    question: 'Are trash and recycling services provided? Where are the bins located?',
  },
  
  // Policies & Rules
  {
    id: 'q23',
    category: 'Policies & Rules',
    question: 'What is the pet policy (allowed pets, size/breed restrictions, fees)?',
  },
  {
    id: 'q24',
    category: 'Policies & Rules',
    question: 'Are guests allowed to stay overnight? Are there visitor parking spots?',
  },
  {
    id: 'q25',
    category: 'Policies & Rules',
    question: 'Can I make modifications (paint walls, install shelves, etc.)?',
  },
  {
    id: 'q26',
    category: 'Policies & Rules',
    question: 'Is subletting allowed if I need to move before the lease ends?',
  },
  {
    id: 'q27',
    category: 'Policies & Rules',
    question: 'What is the smoking policy for the building and unit?',
  },
  
  // Building Amenities
  {
    id: 'q28',
    category: 'Building Amenities',
    question: 'What amenities are available (gym, pool, rooftop, etc.)?',
  },
  {
    id: 'q29',
    category: 'Building Amenities',
    question: 'Is parking available? Is it included in rent or an additional cost?',
  },
  {
    id: 'q30',
    category: 'Building Amenities',
    question: 'Is there secure package delivery or a mailroom?',
  },
  {
    id: 'q31',
    category: 'Building Amenities',
    question: 'What security features are in place (cameras, security staff, key fob access)?',
  },
  {
    id: 'q32',
    category: 'Building Amenities',
    question: 'Is there bike storage available?',
  },
  
  // Management & Maintenance
  {
    id: 'q33',
    category: 'Management & Maintenance',
    question: 'How quickly does maintenance respond to repair requests?',
  },
  {
    id: 'q34',
    category: 'Management & Maintenance',
    question: 'Is there 24/7 emergency maintenance available?',
  },
  {
    id: 'q35',
    category: 'Management & Maintenance',
    question: 'Who do I contact for maintenance issues or emergencies?',
  },
  {
    id: 'q36',
    category: 'Management & Maintenance',
    question: 'How often does the landlord or management conduct inspections?',
  },
  {
    id: 'q37',
    category: 'Management & Maintenance',
    question: 'Are there any planned renovations or construction that might cause disruption?',
  },
];