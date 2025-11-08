export interface Saying {
  id: string;
  saying: string;
  meaning: string;
  author: string | null;
  moreInfo: string | null;
  dateHeard: string | null; // ISO date string
  tags: string[];
  isFavorite: boolean;
  dateAdded: string; // ISO date string
}

export interface SayingFilters {
  searchQuery: string;
  selectedTags: string[];
  favoritesOnly: boolean;
}

export type SortOption = 'newest' | 'oldest' | 'alphabetical';

export interface SayingsData extends Record<string, unknown> {
  sayings: Saying[];
}

export interface QuizQuestion {
  saying: Saying;
  type: 'saying' | 'meaning';
}
