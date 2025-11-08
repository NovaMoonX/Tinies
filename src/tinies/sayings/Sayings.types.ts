export interface Saying {
  id: string;
  saying: string;
  meaning: string;
  author: string | null;
  moreInfo: string | null;
  dateHeard: string | null; // ISO date string
  tags: string[];
  dateAdded: string; // ISO date string
}

export interface SayingFilters {
  searchQuery: string;
  selectedTags: string[];
  favoriteTagsOnly: boolean;
}

export type SortOption = 'newest' | 'oldest' | 'alphabetical';

export interface SayingsData extends Record<string, unknown> {
  sayings: Saying[];
  favoriteTags: string[];
}

export interface QuizQuestion {
  saying: Saying;
  type: 'saying' | 'meaning';
}
