import { Button } from '@moondreamsdev/dreamer-ui/components';
import { Plus } from '@moondreamsdev/dreamer-ui/symbols';
import { useState, useMemo } from 'react';
import { Saying, SayingFilters, SortOption } from './Sayings.types';
import {
  SayingCard,
  SayingDetailsModal,
  FilterSection,
  AddSayingModal,
  EditSayingModal,
  QuizModal,
} from './Sayings.components';
import { filterSayings, generateSayingId, sortSayings } from './Sayings.utils';
import TinyPage from '@ui/layout/TinyPage';
import { useSayingsData } from './Sayings.hooks';

export function Sayings() {
  const { sayings, setSayings } = useSayingsData();
  const [selectedSaying, setSelectedSaying] = useState<Saying | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [filters, setFilters] = useState<SayingFilters>({
    searchQuery: '',
    selectedTags: [],
    favoritesOnly: false,
  });
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const filteredSayings = useMemo(() => {
    const filtered = filterSayings(sayings, filters);
    const sorted = sortSayings(filtered, sortOption);
    return sorted;
  }, [sayings, filters, sortOption]);

  const allTags = useMemo(() => {
    const tags = sayings.flatMap((saying) => saying.tags);
    const result = Array.from(new Set(tags)).sort();
    return result;
  }, [sayings]);

  const handleAddSaying = (sayingData: Omit<Saying, 'id' | 'dateAdded'>) => {
    const newSaying: Saying = {
      ...sayingData,
      id: generateSayingId(),
      dateAdded: Date.now(),
    };

    setSayings([newSaying, ...sayings]);
  };

  const handleDeleteSaying = (id: string) => {
    setSayings(sayings.filter((s) => s.id !== id));
    if (selectedSaying?.id === id) {
      setSelectedSaying(null);
    }
  };

  const handleUpdateSaying = (updatedSaying: Saying) => {
    setSayings(sayings.map((s) => (s.id === updatedSaying.id ? updatedSaying : s)));
    setSelectedSaying(null);
    setIsEditModalOpen(false);
  };

  const handleEditClick = () => {
    setSelectedSaying(selectedSaying);
    setIsEditModalOpen(true);
  };

  const handleToggleFavorite = (id: string) => {
    setSayings(
      sayings.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  };

  return (
    <TinyPage
      title='💭 Sayings'
      description='Remember and learn from wise sayings, proverbs, and quotes. Test your knowledge with a quiz, organize by tags, and favorite the ones that matter most.'
    >
      {/* Stats */}
      <div className='bg-muted/30 rounded-2xl p-6'>
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <div className='text-center sm:text-left'>
            <div className='mb-1 text-3xl font-bold'>{sayings.length}</div>
            <div className='text-foreground/60 text-sm'>Total Sayings</div>
          </div>
          <div className='flex gap-2'>
            <Button
              onClick={() => setIsQuizModalOpen(true)}
              variant='outline'
              disabled={sayings.length === 0}
            >
              🧠 Quiz Me
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className='h-5 w-5' />
              Add Saying
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterSection
        filters={filters}
        onFiltersChange={setFilters}
        sortOption={sortOption}
        onSortChange={setSortOption}
        totalSayings={sayings.length}
        filteredSayings={filteredSayings.length}
        availableTags={allTags}
      />

      {/* Sayings Grid */}
      {filteredSayings.length > 0 ? (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredSayings.map((saying) => (
            <SayingCard
              key={saying.id}
              saying={saying}
              onView={() => setSelectedSaying(saying)}
              onDelete={() => handleDeleteSaying(saying.id)}
              onToggleFavorite={() => handleToggleFavorite(saying.id)}
            />
          ))}
        </div>
      ) : (
        <div className='bg-muted/30 rounded-2xl p-12 text-center'>
          <p className='text-foreground/60 text-lg'>
            {sayings.length === 0
              ? 'No sayings yet. Add your first saying to get started!'
              : 'No sayings match your filters.'}
          </p>
        </div>
      )}

      {/* Modals */}
      {selectedSaying && (
        <>
          <SayingDetailsModal
            saying={selectedSaying}
            isOpen={!!selectedSaying && !isEditModalOpen}
            onClose={() => setSelectedSaying(null)}
            onEdit={handleEditClick}
            onToggleFavorite={() => handleToggleFavorite(selectedSaying.id)}
          />
          <EditSayingModal
            saying={selectedSaying}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedSaying(null);
            }}
            onUpdate={handleUpdateSaying}
            existingTags={allTags}
          />
        </>
      )}

      <AddSayingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSaying}
        existingTags={allTags}
      />

      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        sayings={sayings}
      />
    </TinyPage>
  );
}

export default Sayings;
