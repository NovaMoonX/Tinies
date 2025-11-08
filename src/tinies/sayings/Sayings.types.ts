export interface Saying {
  id: string;
  saying: string;
  meaning: string;
  author: string | null;
  moreInfo: string | null;
  dateHeard: number | null; // timestamp in milliseconds
  tags: string[];
  isFavorite: boolean;
  dateAdded: number; // timestamp in milliseconds
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
