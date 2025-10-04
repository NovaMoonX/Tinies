import { ALL_CATEGORIES, ALL_TAGS, Tiny } from '@/lib/tinies';
import {
  Badge,
  Button,
  Input,
  Modal,
} from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { useEffect, useMemo, useState } from 'react';

interface TiniesFiltersProps {
  tinies: Tiny[];
  onFilteredTiniesChange: (tinies: Tiny[]) => void;
}

function TiniesFilters({ tinies, onFilteredTiniesChange }: TiniesFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const filteredTinies = useMemo(() => {
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

    return filtered;
  }, [tinies, searchQuery, selectedTags, selectedCategories]);

  // Update parent component when filtered tinies change
  useEffect(() => {
    onFilteredTiniesChange(filteredTinies);
  }, [filteredTinies, onFilteredTiniesChange]);

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
            Showing {filteredTinies.length} of {tinies.length}
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
