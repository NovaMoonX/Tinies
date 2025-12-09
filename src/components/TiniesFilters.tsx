import { ALL_CATEGORIES, ALL_TAGS, Tiny } from '@/lib/tinies';
import {
  Badge,
  Button,
  Input,
  Modal,
  Select,
} from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import { getTinyVisits } from '@lib/firebase';

type SortOption = 'alphabetical' | 'alphabetical-reverse' | 'date-created' | 'date-created-reverse' | 'last-visited' | 'last-visited-reverse';

interface TiniesFiltersProps {
  tinies: Tiny[];
  onFilteredTiniesChange: (tinies: Tiny[]) => void;
}

function TiniesFilters({ tinies, onFilteredTiniesChange }: TiniesFiltersProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(
    user ? 'last-visited' : 'alphabetical'
  );
  const [tinyVisits, setTinyVisits] = useState<Record<string, { lastVisitedAt: number }> | null>(null);

  // Load tiny visits when user is authenticated
  useEffect(() => {
    if (user) {
      getTinyVisits(user.uid).then((visits) => {
        setTinyVisits(visits);
      });
      // Update default sort when user logs in
      setSortOption('last-visited');
    } else {
      setTinyVisits(null);
      // Update default sort when user logs out
      setSortOption('alphabetical');
    }
  }, [user]);

  const filteredAndSortedTinies = useMemo(() => {
    let filtered = tinies;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tiny) =>
          tiny.title.toLowerCase().includes(query) ||
          tiny.description.toLowerCase().includes(query) ||
          tiny.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          tiny.categories.some((cat) => cat.toLowerCase().includes(query)),
      );
    }

    // Filter by selected tags
    if (selectedTags.size > 0) {
      filtered = filtered.filter((tiny) =>
        tiny.tags.some((tag) => selectedTags.has(tag)),
      );
    }

    // Filter by selected categories
    if (selectedCategories.size > 0) {
      filtered = filtered.filter((tiny) =>
        tiny.categories.some((cat) => selectedCategories.has(cat)),
      );
    }

    // Sort the filtered results
    const sorted = [...filtered];
    switch (sortOption) {
      case 'alphabetical':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'alphabetical-reverse':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'date-created':
        sorted.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        break;
      case 'date-created-reverse':
        sorted.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        break;
      case 'last-visited':
        if (tinyVisits) {
          sorted.sort((a, b) => {
            const aVisit = tinyVisits[a.id]?.lastVisitedAt || 0;
            const bVisit = tinyVisits[b.id]?.lastVisitedAt || 0;
            return bVisit - aVisit; // Most recent first
          });
        }
        break;
      case 'last-visited-reverse':
        if (tinyVisits) {
          sorted.sort((a, b) => {
            const aVisit = tinyVisits[a.id]?.lastVisitedAt || 0;
            const bVisit = tinyVisits[b.id]?.lastVisitedAt || 0;
            return aVisit - bVisit; // Least recent first
          });
        }
        break;
    }

    return sorted;
  }, [tinies, searchQuery, selectedTags, selectedCategories, sortOption, tinyVisits]);

  // Update parent component when filtered/sorted tinies change
  useEffect(() => {
    onFilteredTiniesChange(filteredAndSortedTinies);
  }, [filteredAndSortedTinies, onFilteredTiniesChange]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags(new Set());
    setSelectedCategories(new Set());
  };

  const getDesktopBadgeClass = (isActive: boolean) =>
    join(
      'hover:opacity-90 transition-opacity',
      isActive ? 'shadow-lg scale-105' : 'hover:shadow-md',
    );

  const canFilter = ALL_CATEGORIES.length > 0 || ALL_TAGS.length > 0;

  const hasActiveFilters = selectedTags.size > 0 || selectedCategories.size > 0;

  const hasAdvancedFilters =
    selectedTags.size > 0 || selectedCategories.size > 0;

  return (
    <>
      <div className='space-y-6 p-2 sm:p-6'>
        {/* Large Centered Search */}
        <div className='flex flex-col items-center space-y-4'>
          <div className='w-full max-w-2xl'>
            <Input
              type='text'
              placeholder='Search your tiny...'
              value={searchQuery}
              variant='outline'
              rounded='full'
              onChange={(e) => setSearchQuery(e.target.value)}
              className='focus:border-primary/80! px-3 py-2 shadow-sm md:px-6 md:py-4 md:text-lg'
            />
          </div>

          {/* Sort Dropdown */}
          <div className='w-full max-w-2xl'>
            <Select
              value={sortOption}
              onChange={(value) => setSortOption(value as SortOption)}
              options={[
                { value: 'alphabetical', text: 'Alphabetical (A-Z)' },
                { value: 'alphabetical-reverse', text: 'Alphabetical (Z-A)' },
                { value: 'date-created', text: 'Date Created (Oldest First)' },
                { value: 'date-created-reverse', text: 'Date Created (Newest First)' },
                ...(user ? [
                  { value: 'last-visited', text: 'Last Visited (Recent First)' },
                  { value: 'last-visited-reverse', text: 'Last Visited (Oldest First)' },
                ] : []),
              ]}
            />
          </div>

          {/* Filters Button - Mobile Only */}
          {canFilter && (
            <Button
              variant='outline'
              onClick={() => setIsFiltersModalOpen(true)}
              className='flex items-center sm:hidden'
            >
              Filters
              {hasAdvancedFilters && (
                <Badge variant='primary' className='ml-2'>
                  {selectedTags.size + selectedCategories.size}
                </Badge>
              )}
            </Button>
          )}
        </div>

        {/* Desktop Filters - Hidden on Mobile */}
        <div className='hidden space-y-6 sm:block'>
          {/* Categories */}
          {ALL_CATEGORIES.length > 0 && (
            <div className='text-center'>
              <h3 className='text-foreground/70 mb-4 text-sm font-semibold tracking-wider uppercase'>
                Categories
              </h3>
              <div className='flex flex-wrap justify-center gap-3'>
                {ALL_CATEGORIES.map((category) => (
                  <Badge
                    key={category}
                    onClick={() => toggleCategory(category)}
                    role='button'
                    size='sm'
                    variant={
                      selectedCategories.has(category) ? 'secondary' : 'muted'
                    }
                    className={getDesktopBadgeClass(
                      selectedCategories.has(category),
                    )}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {ALL_TAGS.length > 0 && (
            <div className='text-center'>
              <h3 className='text-foreground/70 mb-4 text-sm font-semibold tracking-wider uppercase'>
                Tags
              </h3>
              <div className='flex flex-wrap justify-center gap-3'>
                {ALL_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    role='button'
                    size='sm'
                    variant={selectedTags.has(tag) ? 'secondary' : 'muted'}
                    className={getDesktopBadgeClass(selectedTags.has(tag))}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className='flex h-fit items-center justify-center gap-2'>
          <span className='opacity-60'>
            Showing {filteredAndSortedTinies.length} of {tinies.length}
          </span>

          {/* Clear filters button for desktop */}
          {hasActiveFilters && (
            <div className='hidden text-center sm:block'>
              <Button variant='tertiary' onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <Modal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        title='Filter Tinies'
      >
        <div className='space-y-6 p-2'>
          {/* Categories */}
          {ALL_CATEGORIES.length > 0 && (
            <div className='text-center'>
              <h3 className='text-foreground/70 mb-4 text-sm font-semibold tracking-wider uppercase'>
                Categories
              </h3>
              <div className='flex flex-wrap justify-center gap-3'>
                {ALL_CATEGORIES.map((category) => (
                  <Badge
                    key={category}
                    onClick={() => toggleCategory(category)}
                    role='button'
                    size='sm'
                    variant={
                      selectedCategories.has(category) ? 'secondary' : 'muted'
                    }
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {ALL_TAGS.length > 0 && (
            <div className='text-center'>
              <h3 className='text-foreground/70 mb-4 text-sm font-semibold tracking-wider uppercase'>
                Tags
              </h3>
              <div className='flex flex-wrap justify-center gap-3'>
                {ALL_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    role='button'
                    size='sm'
                    variant={selectedTags.has(tag) ? 'secondary' : 'muted'}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className='border-border/50 flex flex-col gap-3 border-t pt-6'>
            {hasAdvancedFilters && (
              <Button variant='outline' onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
            <Button onClick={() => setIsFiltersModalOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default TiniesFilters;
