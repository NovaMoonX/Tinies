export type RelationshipType = 
  | 'family' 
  | 'friend' 
  | 'colleague' 
  | 'acquaintance' 
  | 'professional' 
  | 'other';

export type ArtifactType = 'link' | 'text' | 'photo' | 'file';

export interface PhoneNumber {
  id: string;
  label: string; // e.g., "mobile", "work", "home"
  number: string;
}

export interface Email {
  id: string;
  label: string; // e.g., "personal", "work"
  address: string;
}

export interface ContactNote {
  id: string;
  text: string;
  dateAdded: string; // ISO date string
}

export interface Contact {
  id: string;
  name: string;
  phones: PhoneNumber[];
  emails: Email[];
  birthday: string | null; // ISO date string
  relationshipType: RelationshipType;
  notes: ContactNote[];
  interestingFacts: string[];
  likes: string[];
  dislikes: string[];
  avatarUrl: string | null;
  dateAdded: string; // ISO date string
}

export interface ArtifactComment {
  id: string;
  text: string;
  contactId: string; // Which contact made this comment
  dateAdded: string; // ISO date string
}

export interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  content: string; // URL for links, text content, file path/URL for photos/files
  description: string;
  contactIds: string[]; // Associated contacts
  comments: ArtifactComment[]; // Comments from contacts about this artifact
  dateAdded: string; // ISO date string
  tags: string[];
}

export interface PersonalCrmFilters {
  searchQuery: string;
  selectedRelationshipTypes: RelationshipType[];
  view: 'contacts' | 'artifacts';
  selectedArtifactTypes: ArtifactType[];
  selectedContactIds: string[]; // Filter artifacts by associated contacts
}
