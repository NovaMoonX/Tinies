import { Saying, SayingFilters, SortOption } from './Sayings.types';

export function generateSayingId(): string {
  return `saying-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function filterSayings(
  sayings: Saying[],
  filters: SayingFilters,
): Saying[] {
  const result = sayings.filter((saying) => {
    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSaying = saying.saying.toLowerCase().includes(query);
      const matchesMeaning = saying.meaning.toLowerCase().includes(query);
      const matchesAuthor = saying.author?.toLowerCase().includes(query);
      const matchesTags = saying.tags.some((tag) => tag.toLowerCase().includes(query));

      if (!matchesSaying && !matchesMeaning && !matchesAuthor && !matchesTags) {
        return false;
      }
    }

    // Tag filter
    if (filters.selectedTags.length > 0) {
      const hasSelectedTag = filters.selectedTags.some((selectedTag) =>
        saying.tags.includes(selectedTag),
      );
      if (!hasSelectedTag) {
        return false;
      }
    }

    // Favorites filter
    if (filters.favoritesOnly && !saying.isFavorite) {
      return false;
    }

    return true;
  });

  return result;
}

export function sortSayings(sayings: Saying[], sortOption: SortOption): Saying[] {
  const sorted = [...sayings];

  switch (sortOption) {
    case 'newest':
      sorted.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
      break;
    case 'oldest':
      sorted.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
      break;
    case 'alphabetical':
      sorted.sort((a, b) => a.saying.localeCompare(b.saying));
      break;
  }

  return sorted;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
