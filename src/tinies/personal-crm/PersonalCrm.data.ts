import { Contact, Artifact } from './PersonalCrm.types';

export const SAMPLE_CONTACTS: Contact[] = [
  {
    id: 'contact-1',
    name: 'Sarah Johnson',
    phones: [
      { id: 'phone-1', label: 'mobile', number: '(555) 123-4567' },
      { id: 'phone-2', label: 'work', number: '(555) 987-6543' },
    ],
    emails: [
      { id: 'email-1', label: 'personal', address: 'sarah.j@email.com' },
      { id: 'email-2', label: 'work', address: 'sjohnson@company.com' },
    ],
    birthday: '1990-05-15',
    relationshipType: 'friend',
    notes: [
      {
        id: 'note-1',
        text: 'Met at the tech conference in 2023. Really passionate about AI.',
        dateAdded: '2024-01-15T10:30:00Z',
      },
      {
        id: 'note-2',
        text: 'Recommended the book "The Design of Everyday Things"',
        dateAdded: '2024-06-20T14:45:00Z',
      },
    ],
    interestingFacts: [
      'Speaks three languages fluently',
      'Marathon runner',
      'Loves trying new coffee shops',
    ],
    likes: ['Coffee', 'Reading sci-fi', 'Hiking', 'Photography'],
    dislikes: ['Spicy food', 'Cold weather'],
    avatarUrl: null,
    dateAdded: '2024-01-10T08:00:00Z',
  },
  {
    id: 'contact-2',
    name: 'Michael Chen',
    phones: [{ id: 'phone-3', label: 'mobile', number: '(555) 234-5678' }],
    emails: [{ id: 'email-3', label: 'personal', address: 'mchen@email.com' }],
    birthday: '1988-11-22',
    relationshipType: 'colleague',
    notes: [
      {
        id: 'note-3',
        text: 'Team lead on the new project. Very supportive and knowledgeable.',
        dateAdded: '2024-03-10T09:15:00Z',
      },
    ],
    interestingFacts: ['Former chef turned software engineer', 'Plays guitar in a band'],
    likes: ['Cooking', 'Music', 'Video games', 'Board games'],
    dislikes: ['Traffic', 'Procrastination'],
    avatarUrl: null,
    dateAdded: '2024-03-05T12:00:00Z',
  },
  {
    id: 'contact-3',
    name: 'Emily Rodriguez',
    phones: [{ id: 'phone-4', label: 'mobile', number: '(555) 345-6789' }],
    emails: [
      { id: 'email-4', label: 'personal', address: 'emily.r@email.com' },
    ],
    birthday: '1995-08-30',
    relationshipType: 'family',
    notes: [
      {
        id: 'note-4',
        text: 'Birthday celebration at The Garden Restaurant - she loved it!',
        dateAdded: '2024-08-30T19:00:00Z',
      },
    ],
    interestingFacts: ['Yoga instructor', 'Vegan for 5 years'],
    likes: ['Yoga', 'Plants', 'Meditation', 'Documentaries'],
    dislikes: ['Loud noises', 'Being late'],
    avatarUrl: null,
    dateAdded: '2023-12-01T10:00:00Z',
  },
];

export const SAMPLE_ARTIFACTS: Artifact[] = [
  {
    id: 'artifact-1',
    type: 'link',
    title: 'AI Conference 2023',
    content: 'https://aiconference2023.example.com',
    description: 'Conference where I met Sarah',
    contactIds: ['contact-1'],
    notes: [
      {
        id: 'art-note-1',
        text: 'This was such an inspiring event! The keynote on ethics in AI really made me think.',
        contactName: 'Sarah Johnson',
        dateAdded: '2024-01-20T11:00:00Z',
      },
      {
        id: 'art-note-2',
        text: 'We should definitely go again next year!',
        contactName: 'Sarah Johnson',
        dateAdded: '2024-01-20T11:05:00Z',
      },
    ],
    dateAdded: '2024-01-15T10:30:00Z',
    tags: ['conference', 'ai', 'networking'],
  },
  {
    id: 'artifact-2',
    type: 'text',
    title: 'Recipe Exchange',
    content: 'Michael\'s famous pasta carbonara recipe:\n\n- 400g spaghetti\n- 200g guanciale\n- 4 egg yolks\n- 100g Pecorino Romano\n- Black pepper\n\nCook pasta, crisp guanciale, mix eggs and cheese, combine with hot pasta.',
    description: 'Recipe Michael shared during team lunch',
    contactIds: ['contact-2'],
    notes: [
      {
        id: 'art-note-3',
        text: 'The secret is to use really good quality guanciale and don\'t overcook the eggs!',
        contactName: 'Michael Chen',
        dateAdded: '2024-05-15T12:30:00Z',
      },
    ],
    dateAdded: '2024-05-15T12:00:00Z',
    tags: ['recipe', 'cooking', 'italian'],
  },
  {
    id: 'artifact-3',
    type: 'photo',
    title: 'Emily\'s Birthday Celebration',
    content: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800',
    description: 'Birthday dinner at The Garden Restaurant',
    contactIds: ['contact-3'],
    notes: [
      {
        id: 'art-note-4',
        text: 'Thank you so much for organizing this! Best birthday ever!',
        contactName: 'Emily Rodriguez',
        dateAdded: '2024-08-30T20:00:00Z',
      },
    ],
    dateAdded: '2024-08-30T19:00:00Z',
    tags: ['birthday', 'celebration', 'family'],
  },
  {
    id: 'artifact-4',
    type: 'text',
    title: 'Book Recommendations',
    content: 'List of books Sarah recommended:\n1. "The Design of Everyday Things" by Don Norman\n2. "Atomic Habits" by James Clear\n3. "Project Hail Mary" by Andy Weir',
    description: 'Book recommendations from Sarah',
    contactIds: ['contact-1'],
    notes: [
      {
        id: 'art-note-5',
        text: 'I think you\'ll especially love Project Hail Mary - it\'s a fun sci-fi adventure!',
        contactName: 'Sarah Johnson',
        dateAdded: '2024-06-20T15:00:00Z',
      },
    ],
    dateAdded: '2024-06-20T14:45:00Z',
    tags: ['books', 'recommendations'],
  },
];

export const RELATIONSHIP_TYPES = [
  'family',
  'friend',
  'colleague',
  'acquaintance',
  'professional',
  'other',
] as const;

export const ARTIFACT_TYPES = ['link', 'text', 'photo', 'file'] as const;
