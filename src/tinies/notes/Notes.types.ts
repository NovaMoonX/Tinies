export type NoteStatus = 'active' | 'archived' | 'trashed';

export type NoteColor = 
  | 'default'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'gray';

export interface Note {
  id: string;
  title: string;
  content: string;
  emoji: string | null;
  color: NoteColor;
  tags: string[];
  isPinned: boolean;
  status: NoteStatus;
  createdAt: string; // ISO date string
  lastEditedAt: string; // ISO date string
  trashedAt: string | null; // ISO date string when moved to trash
}

export interface NoteFilters {
  searchQuery: string;
  selectedTags: string[];
  selectedColors: NoteColor[];
  status: NoteStatus;
}
