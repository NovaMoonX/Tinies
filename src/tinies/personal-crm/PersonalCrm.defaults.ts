import {
  Artifact,
  ArtifactComment,
  Contact,
  ContactNote,
  Email,
  PersonalCrmData,
  PhoneNumber,
} from './PersonalCrm.types';

export const defaultPersonalCrmData: PersonalCrmData = {
  contacts: [],
  artifacts: [],
};

export const defaultPhoneNumber: PhoneNumber = {
  id: '',
  label: '',
  number: '',
};

export const defaultEmail: Email = {
  id: '',
  label: '',
  address: '',
};

export const defaultContactNote: ContactNote = {
  id: '',
  text: '',
  dateAdded: '',
};

export const defaultContact: Contact = {
  id: '',
  name: '',
  headline: null,
  phones: [],
  emails: [],
  birthday: null,
  relationshipType: 'other',
  notes: [],
  interestingFacts: [],
  likes: [],
  dislikes: [],
  avatarUrl: null,
  dateAdded: '',
};

export const defaultArtifactComment: ArtifactComment = {
  id: '',
  text: '',
  contactId: '',
  dateAdded: '',
};

export const defaultArtifact: Artifact = {
  id: '',
  type: 'text',
  title: '',
  content: '',
  description: '',
  contactIds: [],
  comments: [],
  dateAdded: '',
  tags: [],
};

