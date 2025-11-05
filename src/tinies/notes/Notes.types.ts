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
  list: string[] | null; // List items for list-style notes
  emoji: string | null;
  color: NoteColor;
  tags: string[];
  isPinned: boolean;
  status: NoteStatus;
  createdAt: number; // Timestamp in milliseconds
  lastEditedAt: number; // Timestamp in milliseconds
  trashedAt: number | null; // Timestamp in milliseconds when moved to trash
}

export interface NoteFilters {
  searchQuery: string;
  selectedTags: string[];
  selectedColors: NoteColor[];
  status: NoteStatus;
}
