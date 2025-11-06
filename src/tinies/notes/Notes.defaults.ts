import { Note, NotesData } from './Notes.types';

export const defaultNotesData: NotesData = {
  notes: [],
};

export const defaultNote: Note = {
  id: '',
  title: '',
  content: '',
  list: null,
  emoji: null,
  color: 'default',
  tags: [],
  isPinned: false,
  status: 'active',
  createdAt: 0,
  lastEditedAt: 0,
  trashedAt: null,
};

