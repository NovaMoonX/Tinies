import {
  Badge,
  Button,
  Card,
  Input,
  Label,
  Modal,
  Select,
  Textarea,
  Checkbox,
  Disclosure,
} from '@moondreamsdev/dreamer-ui/components';
import { useActionModal } from '@moondreamsdev/dreamer-ui/hooks';
import { Plus, Trash, X, Star, ChevronLeft, ChevronRight } from '@moondreamsdev/dreamer-ui/symbols';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { useState, useMemo } from 'react';
import { Saying, SayingFilters, SortOption, QuizQuestion } from './Sayings.types';

interface SayingCardProps {
  saying: Saying;
  onView: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export function SayingCard({ saying, onView, onDelete, onToggleFavorite }: SayingCardProps) {
  const { showActionModal } = useActionModal();

  const handleDelete = () => {
    showActionModal({
      title: 'Delete Saying',
      description: 'Are you sure you want to delete this saying? This action cannot be undone.',
      confirmLabel: 'Delete',
      onConfirm: onDelete,
    });
  };

  return (
    <Card className='group h-full transition-all hover:shadow-lg'>
      <div className='flex h-full flex-col p-4'>
        <div className='mb-3 flex items-start justify-between gap-2'>
          <div className='flex-1'>
            <div className='mb-2 flex items-center gap-2'>
              <button
                onClick={onToggleFavorite}
                className='hover:scale-110 transition-transform'
              >
                <Star 
                  className={join(
                    'h-5 w-5',
                    saying.isFavorite ? 'text-primary fill-current' : 'text-muted-foreground'
                  )}
                />
              </button>
              <h3 className='text-lg font-semibold'>{saying.saying}</h3>
            </div>
            <p className='text-foreground/60 line-clamp-3 text-sm'>{saying.meaning}</p>
          </div>
          <Button
            onClick={handleDelete}
            variant='destructive'
            size='sm'
            className='opacity-0 transition-opacity group-hover:opacity-100'
          >
            <Trash className='h-4 w-4' />
          </Button>
        </div>

        {saying.author && (
          <p className='text-foreground/70 mb-2 text-sm italic'>— {saying.author}</p>
        )}

        {saying.tags.length > 0 && (
          <div className='mb-3 flex flex-wrap gap-1'>
            {saying.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant='muted' 
                size='sm'
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Button onClick={onView} variant='outline' className='mt-auto w-full'>
          View Details
        </Button>
      </div>
    </Card>
  );
}

interface SayingDetailsModalProps {
  saying: Saying;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onToggleFavorite: () => void;
}

export function SayingDetailsModal({
  saying,
  isOpen,
  onClose,
  onEdit,
  onToggleFavorite,
}: SayingDetailsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Saying Details'>
      <div className='space-y-6'>
        {/* Favorite Toggle */}
        <div className='flex items-center gap-2'>
          <button
            onClick={onToggleFavorite}
            className='hover:scale-110 transition-transform'
          >
            <Star 
              className={join(
                'h-6 w-6',
                saying.isFavorite ? 'text-primary fill-current' : 'text-muted-foreground'
              )}
            />
          </button>
          <span className='text-sm text-foreground/60'>
            {saying.isFavorite ? 'Favorited' : 'Click to favorite'}
          </span>
        </div>

        {/* Saying */}
        <div>
          <Label className='mb-2'>Saying</Label>
          <p className='text-lg font-semibold'>{saying.saying}</p>
        </div>

        {/* Meaning */}
        <div>
          <Label className='mb-2'>Meaning</Label>
          <p className='text-foreground/80'>{saying.meaning}</p>
        </div>

        {/* Author */}
        {saying.author && (
          <div>
            <Label className='mb-2'>Author</Label>
            <p className='text-foreground/80 italic'>— {saying.author}</p>
          </div>
        )}

        {/* More Info */}
        {saying.moreInfo && (
          <div>
            <Label className='mb-2'>More Info</Label>
            <p className='text-foreground/80'>{saying.moreInfo}</p>
          </div>
        )}

        {/* Date Heard */}
        {saying.dateHeard && (
          <div>
            <Label className='mb-2'>Date Heard</Label>
            <p className='text-foreground/80'>
              {new Date(saying.dateHeard).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Tags */}
        {saying.tags.length > 0 && (
          <div>
            <Label className='mb-2'>Tags</Label>
            <div className='flex flex-wrap gap-2'>
              {saying.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant='secondary'
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className='flex gap-2'>
          <Button onClick={onEdit} variant='outline' className='flex-1'>
            Edit Saying
          </Button>
          <Button onClick={onClose} className='flex-1'>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

interface AddSayingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (saying: Omit<Saying, 'id' | 'dateAdded'>) => void;
  existingTags: string[];
}

export function AddSayingModal({ isOpen, onClose, onAdd, existingTags }: AddSayingModalProps) {
  const [saying, setSaying] = useState('');
  const [meaning, setMeaning] = useState('');
  const [author, setAuthor] = useState('');
  const [moreInfo, setMoreInfo] = useState('');
  const [dateHeard, setDateHeard] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const handleSubmit = () => {
    if (!saying.trim() || !meaning.trim()) return;

    onAdd({
      saying: saying.trim(),
      meaning: meaning.trim(),
      author: author.trim() || null,
      moreInfo: moreInfo.trim() || null,
      dateHeard: dateHeard ? new Date(dateHeard).getTime() : null,
      tags,
      isFavorite,
    });

    // Reset form
    setSaying('');
    setMeaning('');
    setAuthor('');
    setMoreInfo('');
    setDateHeard('');
    setTags([]);
    setNewTag('');
    setIsFavorite(false);
    onClose();
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const availableTags = existingTags.filter((tag) => !tags.includes(tag));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Add New Saying'>
      <div className='space-y-4'>
        {/* Saying */}
        <div>
          <Label htmlFor='saying'>Saying *</Label>
          <Textarea
            id='saying'
            name='saying'
            value={saying}
            onChange={(e) => setSaying(e.target.value)}
            placeholder='Enter the saying...'
            rows={3}
          />
        </div>

        {/* Meaning */}
        <div>
          <Label htmlFor='meaning'>Meaning *</Label>
          <Textarea
            id='meaning'
            name='meaning'
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            placeholder='What does this saying mean?'
            rows={3}
          />
        </div>

        {/* Author */}
        <div>
          <Label htmlFor='author'>Author</Label>
          <Input
            id='author'
            name='author'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder='Who said this?'
          />
        </div>

        {/* More Info */}
        <div>
          <Label htmlFor='moreInfo'>More Info</Label>
          <Textarea
            id='moreInfo'
            name='moreInfo'
            value={moreInfo}
            onChange={(e) => setMoreInfo(e.target.value)}
            placeholder='Additional context or information...'
            rows={2}
          />
        </div>

        {/* Date Heard */}
        <div>
          <Label htmlFor='dateHeard'>Date Heard</Label>
          <Input
            id='dateHeard'
            name='dateHeard'
            type='date'
            value={dateHeard}
            onChange={(e) => setDateHeard(e.target.value)}
          />
        </div>

        {/* Tags */}
        <div>
          <Label>Tags</Label>
          {tags.length > 0 && (
            <div className='mb-2 flex flex-wrap gap-2'>
              {tags.map((tag) => (
                <Badge key={tag} variant='secondary'>
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className='ml-1 hover:text-destructive'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <div className='flex gap-2'>
            <Input
              name='newTag'
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(newTag);
                }
              }}
              placeholder='Add a tag...'
            />
            <Button onClick={() => handleAddTag(newTag)} variant='outline' size='sm'>
              <Plus className='h-4 w-4' />
            </Button>
          </div>
          {availableTags.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant='muted'
                  size='sm'
                  className='cursor-pointer hover:bg-primary hover:text-primary-foreground'
                  onClick={() => handleAddTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Favorite */}
        <div className='flex items-center gap-2'>
          <Checkbox
            id='isFavorite'
            checked={isFavorite}
            onCheckedChange={(checked) => setIsFavorite(checked as boolean)}
          />
          <Label htmlFor='isFavorite'>Mark as favorite</Label>
        </div>

        <div className='flex gap-2'>
          <Button onClick={onClose} variant='outline' className='flex-1'>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!saying.trim() || !meaning.trim()}
            className='flex-1'
          >
            Add Saying
          </Button>
        </div>
      </div>
    </Modal>
  );
}

interface EditSayingModalProps {
  saying: Saying;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (saying: Saying) => void;
  existingTags: string[];
}

export function EditSayingModal({
  saying,
  isOpen,
  onClose,
  onUpdate,
  existingTags,
}: EditSayingModalProps) {
  const [sayingText, setSayingText] = useState(saying.saying);
  const [meaning, setMeaning] = useState(saying.meaning);
  const [author, setAuthor] = useState(saying.author || '');
  const [moreInfo, setMoreInfo] = useState(saying.moreInfo || '');
  const [dateHeard, setDateHeard] = useState(
    saying.dateHeard ? new Date(saying.dateHeard).toISOString().split('T')[0] : ''
  );
  const [tags, setTags] = useState<string[]>(saying.tags);
  const [newTag, setNewTag] = useState('');
  const [isFavorite, setIsFavorite] = useState(saying.isFavorite);

  const handleSubmit = () => {
    if (!sayingText.trim() || !meaning.trim()) return;

    onUpdate({
      ...saying,
      saying: sayingText.trim(),
      meaning: meaning.trim(),
      author: author.trim() || null,
      moreInfo: moreInfo.trim() || null,
      dateHeard: dateHeard ? new Date(dateHeard).getTime() : null,
      tags,
      isFavorite,
    });

    onClose();
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const availableTags = existingTags.filter((tag) => !tags.includes(tag));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Edit Saying'>
      <div className='space-y-4'>
        {/* Saying */}
        <div>
          <Label htmlFor='edit-saying'>Saying *</Label>
          <Textarea
            id='edit-saying'
            name='saying'
            value={sayingText}
            onChange={(e) => setSayingText(e.target.value)}
            placeholder='Enter the saying...'
            rows={3}
          />
        </div>

        {/* Meaning */}
        <div>
          <Label htmlFor='edit-meaning'>Meaning *</Label>
          <Textarea
            id='edit-meaning'
            name='meaning'
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            placeholder='What does this saying mean?'
            rows={3}
          />
        </div>

        {/* Author */}
        <div>
          <Label htmlFor='edit-author'>Author</Label>
          <Input
            id='edit-author'
            name='author'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder='Who said this?'
          />
        </div>

        {/* More Info */}
        <div>
          <Label htmlFor='edit-moreInfo'>More Info</Label>
          <Textarea
            id='edit-moreInfo'
            name='moreInfo'
            value={moreInfo}
            onChange={(e) => setMoreInfo(e.target.value)}
            placeholder='Additional context or information...'
            rows={2}
          />
        </div>

        {/* Date Heard */}
        <div>
          <Label htmlFor='edit-dateHeard'>Date Heard</Label>
          <Input
            id='edit-dateHeard'
            name='dateHeard'
            type='date'
            value={dateHeard}
            onChange={(e) => setDateHeard(e.target.value)}
          />
        </div>

        {/* Tags */}
        <div>
          <Label>Tags</Label>
          {tags.length > 0 && (
            <div className='mb-2 flex flex-wrap gap-2'>
              {tags.map((tag) => (
                <Badge key={tag} variant='secondary'>
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className='ml-1 hover:text-destructive'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <div className='flex gap-2'>
            <Input
              name='newTag'
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(newTag);
                }
              }}
              placeholder='Add a tag...'
            />
            <Button onClick={() => handleAddTag(newTag)} variant='outline' size='sm'>
              <Plus className='h-4 w-4' />
            </Button>
          </div>
          {availableTags.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant='muted'
                  size='sm'
                  className='cursor-pointer hover:bg-primary hover:text-primary-foreground'
                  onClick={() => handleAddTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Favorite */}
        <div className='flex items-center gap-2'>
          <Checkbox
            id='edit-isFavorite'
            checked={isFavorite}
            onCheckedChange={(checked) => setIsFavorite(checked as boolean)}
          />
          <Label htmlFor='edit-isFavorite'>Mark as favorite</Label>
        </div>

        <div className='flex gap-2'>
          <Button onClick={onClose} variant='outline' className='flex-1'>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!sayingText.trim() || !meaning.trim()}
            className='flex-1'
          >
            Update Saying
          </Button>
        </div>
      </div>
    </Modal>
  );
}

interface FilterSectionProps {
  filters: SayingFilters;
  onFiltersChange: (filters: SayingFilters) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalSayings: number;
  filteredSayings: number;
  availableTags: string[];
}

export function FilterSection({
  filters,
  onFiltersChange,
  sortOption,
  onSortChange,
  totalSayings,
  filteredSayings,
  availableTags,
}: FilterSectionProps) {
  const sortOptions = [
    { value: 'newest' as const, label: 'Newest First' },
    { value: 'oldest' as const, label: 'Oldest First' },
    { value: 'alphabetical' as const, label: 'Alphabetical' },
  ];

  return (
    <div className='bg-muted/30 rounded-2xl p-6'>
      <div className='mb-4 space-y-4'>
        {/* Search and Sort */}
        <div className='flex flex-col gap-4 sm:flex-row'>
          <div className='flex-1'>
            <Input
              name='search'
              value={filters.searchQuery}
              onChange={(e) =>
                onFiltersChange({ ...filters, searchQuery: e.target.value })
              }
              placeholder='Search sayings, meanings, authors, or tags...'
            />
          </div>
          <div className='w-full sm:w-48'>
            <Select
              name='sort'
              options={sortOptions}
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
            />
          </div>
        </div>

        {/* Favorites Filter */}
        <div className='flex items-center gap-2'>
          <Checkbox
            id='favorites-only'
            checked={filters.favoritesOnly}
            onCheckedChange={(checked) =>
              onFiltersChange({ ...filters, favoritesOnly: checked as boolean })
            }
          />
          <Label htmlFor='favorites-only'>Show only favorites</Label>
        </div>
      </div>

      {/* Advanced Filters */}
      <Disclosure label='Advanced Filters' className='rounded-xl'>
        <div className='space-y-4 p-2 pt-2'>
          {/* Tag Filters */}
          {availableTags.length > 0 && (
            <div>
              <Label className='mb-2'>Filter by Tags</Label>
              <div className='flex flex-wrap gap-2'>
                {availableTags.map((tag) => {
                  const isSelected = filters.selectedTags.includes(tag);
                  return (
                    <Badge
                      key={tag}
                      variant={isSelected ? 'default' : 'muted'}
                      size='sm'
                      className='cursor-pointer'
                      onClick={() => {
                        const newTags = isSelected
                          ? filters.selectedTags.filter((t) => t !== tag)
                          : [...filters.selectedTags, tag];
                        onFiltersChange({ ...filters, selectedTags: newTags });
                      }}
                    >
                      {tag}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {filters.selectedTags.length > 0 && (
            <Button
              onClick={() => onFiltersChange({ ...filters, selectedTags: [] })}
              variant='outline'
              size='sm'
            >
              Clear Tag Filters
            </Button>
          )}
        </div>
      </Disclosure>

      {/* Results Count */}
      <div className='text-foreground/60 mt-4 text-sm'>
        Showing {filteredSayings} of {totalSayings} sayings
      </div>
    </div>
  );
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  sayings: Saying[];
}

export function QuizModal({ isOpen, onClose, sayings }: QuizModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  // Initialize quiz when opened
  useMemo(() => {
    if (isOpen && sayings.length > 0) {
      const questions: QuizQuestion[] = sayings.map((saying) => ({
        saying,
        type: Math.random() < 0.5 ? 'saying' : 'meaning',
      }));
      // Shuffle questions
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
      setQuizQuestions(questions);
      setCurrentIndex(0);
      setShowAnswer(false);
    }
  }, [isOpen, sayings]);

  if (quizQuestions.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title='Quiz'>
        <div className='py-8 text-center'>
          <p className='text-foreground/60'>No sayings available for quiz.</p>
          <Button onClick={onClose} className='mt-4'>
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  const currentQuestion = quizQuestions[currentIndex];
  const progress = ((currentIndex + 1) / quizQuestions.length) * 100;

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Sayings Quiz'>
      <div className='space-y-6'>
        {/* Progress */}
        <div>
          <div className='mb-2 flex items-center justify-between text-sm'>
            <span>
              Question {currentIndex + 1} of {quizQuestions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className='bg-muted h-2 rounded-full'>
            <div
              className='bg-primary h-full rounded-full transition-all'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className='bg-muted/30 min-h-32 rounded-xl p-6'>
          <Label className='mb-3 text-sm uppercase tracking-wide'>
            {currentQuestion.type === 'saying' ? 'What is the meaning?' : 'What is the saying?'}
          </Label>
          <p className='text-lg font-medium'>
            {currentQuestion.type === 'saying'
              ? currentQuestion.saying.saying
              : currentQuestion.saying.meaning}
          </p>
          {currentQuestion.saying.author && currentQuestion.type === 'saying' && (
            <p className='text-foreground/70 mt-2 text-sm italic'>
              — {currentQuestion.saying.author}
            </p>
          )}
        </div>

        {/* Answer */}
        {showAnswer ? (
          <div className='bg-primary/10 rounded-xl p-6'>
            <Label className='mb-3 text-sm uppercase tracking-wide'>Answer</Label>
            <p className='text-lg font-medium'>
              {currentQuestion.type === 'saying'
                ? currentQuestion.saying.meaning
                : currentQuestion.saying.saying}
            </p>
            {currentQuestion.saying.author && currentQuestion.type === 'meaning' && (
              <p className='text-foreground/70 mt-2 text-sm italic'>
                — {currentQuestion.saying.author}
              </p>
            )}
            {currentQuestion.saying.moreInfo && (
              <div className='mt-4'>
                <Label className='mb-2 text-sm'>More Info</Label>
                <p className='text-foreground/80 text-sm'>{currentQuestion.saying.moreInfo}</p>
              </div>
            )}
          </div>
        ) : (
          <Button onClick={() => setShowAnswer(true)} className='w-full'>
            Show Answer
          </Button>
        )}

        {/* Navigation */}
        <div className='flex gap-2'>
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant='outline'
            className='flex-1'
          >
            <ChevronLeft className='h-4 w-4' />
            Previous
          </Button>
          <Button onClick={handleNext} className='flex-1'>
            {currentIndex === quizQuestions.length - 1 ? (
              'Finish'
            ) : (
              <>
                Next
                <ChevronRight className='h-4 w-4' />
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
