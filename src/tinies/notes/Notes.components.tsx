import {
  Badge,
  Button,
  Card,
  Input,
  Label,
  Modal,
  Select,
  Textarea,
} from '@moondreamsdev/dreamer-ui/components';
import { Plus, Trash, X } from '@moondreamsdev/dreamer-ui/symbols';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { useEffect, useState } from 'react';
import { NOTE_COLORS } from './Notes.data';
import { Note, NoteColor, NoteFilters, NoteStatus } from './Notes.types';
import { formatDate, getDaysUntilDeletion } from './Notes.utils';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onTogglePin: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onTrash: () => void;
  onRestore: () => void;
  onDelete: () => void;
}

export function NoteCard({
  note,
  onClick,
  onTogglePin,
  onArchive,
  onUnarchive,
  onTrash,
  onRestore,
  onDelete,
}: NoteCardProps) {
  const colorConfig = NOTE_COLORS.find((c) => c.value === note.color);
  const daysUntilDeletion = getDaysUntilDeletion(note);

  return (
    <Card
      className={join(
        'group relative h-full transition-all hover:shadow-lg border',
        colorConfig?.class,
        colorConfig?.borderClass
      )}
    >
      <div className='flex h-full flex-col p-4'>
        {/* Header with emoji and actions */}
        <div className='mb-2 flex items-start justify-between gap-2'>
          <div className='flex items-center gap-2'>
            {note.emoji && <span className='text-2xl'>{note.emoji}</span>}
          </div>
          <div className='flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
            {note.status === 'active' && (
              <>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin();
                  }}
                  variant='outline'
                  size='sm'
                  title={note.isPinned ? 'Unpin' : 'Pin'}
                >
                  {note.isPinned ? '📍' : '📌'}
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive();
                  }}
                  variant='outline'
                  size='sm'
                  title='Archive'
                >
                  📦
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrash();
                  }}
                  variant='outline'
                  size='sm'
                  title='Move to trash'
                >
                  <Trash className='h-4 w-4' />
                </Button>
              </>
            )}
            {note.status === 'archived' && (
              <>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnarchive();
                  }}
                  variant='outline'
                  size='sm'
                  title='Unarchive'
                >
                  ↩️
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrash();
                  }}
                  variant='outline'
                  size='sm'
                  title='Move to trash'
                >
                  <Trash className='h-4 w-4' />
                </Button>
              </>
            )}
            {note.status === 'trashed' && (
              <>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestore();
                  }}
                  variant='outline'
                  size='sm'
                  title='Restore'
                >
                  ↩️
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  variant='destructive'
                  size='sm'
                  title='Delete permanently'
                >
                  <Trash className='h-4 w-4' />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          className='mb-2 cursor-pointer text-lg font-semibold'
          onClick={onClick}
        >
          {note.title || 'Untitled'}
        </h3>

        {/* Content preview */}
        <p
          className='text-foreground/70 mb-3 line-clamp-4 cursor-pointer whitespace-pre-wrap text-sm'
          onClick={onClick}
        >
          {note.content}
        </p>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className='mb-3 flex flex-wrap gap-1'>
            {note.tags.map((tag) => (
              <Badge key={tag} variant='secondary' size='sm'>
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className='text-foreground/50 mt-auto flex items-center justify-between text-xs'>
          <span>Edited {formatDate(note.lastEditedAt)}</span>
          {note.status === 'trashed' && daysUntilDeletion !== null && (
            <span className='text-destructive'>
              Deletes in {daysUntilDeletion} days
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

interface FilterSectionProps {
  filters: NoteFilters;
  onFiltersChange: (filters: NoteFilters) => void;
  allTags: string[];
  noteCount: number;
  activeCount: number;
  archivedCount: number;
  trashedCount: number;
}

export function FilterSection({
  filters,
  onFiltersChange,
  allTags,
  noteCount,
  activeCount,
  archivedCount,
  trashedCount,
}: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className='bg-muted/30 space-y-4 rounded-2xl p-6'>
      {/* Stats and Status Selector */}
      <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
        <div className='grid w-full grid-cols-3 gap-4 text-center sm:w-auto sm:text-left'>
          <div>
            <div className='mb-1 text-2xl font-bold'>{activeCount}</div>
            <div className='text-foreground/60 text-xs'>Active</div>
          </div>
          <div>
            <div className='mb-1 text-2xl font-bold'>{archivedCount}</div>
            <div className='text-foreground/60 text-xs'>Archived</div>
          </div>
          <div>
            <div className='mb-1 text-2xl font-bold'>{trashedCount}</div>
            <div className='text-foreground/60 text-xs'>Trash</div>
          </div>
        </div>

        <div className='flex w-full items-center gap-2 sm:w-auto'>
          <Select
            value={filters.status}
            onChange={(value) =>
              onFiltersChange({
                ...filters,
                status: value as NoteStatus,
              })
            }
            options={[
              { value: 'active', text: 'Active Notes' },
              { value: 'archived', text: 'Archived Notes' },
              { value: 'trashed', text: 'Trash' },
            ]}
          />
        </div>
      </div>

      {/* Search */}
      <div className='relative'>
        <span className='text-foreground/40 absolute left-3 top-1/2 -translate-y-1/2 text-lg'>🔍</span>
        <Input
          type='text'
          placeholder='Search notes...'
          value={filters.searchQuery}
          onChange={(e) =>
            onFiltersChange({ ...filters, searchQuery: e.target.value })
          }
          className='pl-9'
        />
      </div>

      {/* Advanced Filters Toggle */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant='outline'
        size='sm'
        className='w-full'
      >
        {isExpanded ? 'Hide' : 'Show'} Advanced Filters
      </Button>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className='space-y-4 pt-2'>
          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div>
              <Label className='mb-2 block text-sm font-medium'>
                Filter by Tags
              </Label>
              <div className='flex flex-wrap gap-2'>
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={
                      filters.selectedTags.includes(tag)
                        ? 'secondary'
                        : 'muted'
                    }
                    className='cursor-pointer'
                    onClick={() => {
                      const newTags = filters.selectedTags.includes(tag)
                        ? filters.selectedTags.filter((t) => t !== tag)
                        : [...filters.selectedTags, tag];
                      onFiltersChange({ ...filters, selectedTags: newTags });
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Color Filter */}
          <div>
            <Label className='mb-2 block text-sm font-medium'>
              Filter by Color
            </Label>
            <div className='flex flex-wrap gap-2'>
              {NOTE_COLORS.filter((c) => c.value !== 'default').map((color) => (
                <div
                  key={color.value}
                  className={join(
                    'h-8 w-8 cursor-pointer rounded-full border-2 transition-all',
                    color.class,
                    filters.selectedColors.includes(color.value)
                      ? 'border-foreground scale-110'
                      : 'border-border hover:scale-105'
                  )}
                  onClick={() => {
                    const newColors = filters.selectedColors.includes(
                      color.value
                    )
                      ? filters.selectedColors.filter((c) => c !== color.value)
                      : [...filters.selectedColors, color.value];
                    onFiltersChange({ ...filters, selectedColors: newColors });
                  }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Count */}
      {(filters.selectedTags.length > 0 ||
        filters.selectedColors.length > 0 ||
        filters.searchQuery) && (
        <div className='flex items-center justify-between'>
          <span className='text-foreground/60 text-sm'>
            Showing {noteCount} of{' '}
            {filters.status === 'active'
              ? activeCount
              : filters.status === 'archived'
                ? archivedCount
                : trashedCount}{' '}
            notes
          </span>
          <Button
            onClick={() =>
              onFiltersChange({
                ...filters,
                searchQuery: '',
                selectedTags: [],
                selectedColors: [],
              })
            }
            variant='outline'
            size='sm'
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'lastEditedAt'>) => void;
  initialNote?: Note;
  mode: 'add' | 'edit';
  allTags: string[];
}

export function NoteModal({
  isOpen,
  onClose,
  onSave,
  initialNote,
  mode,
  allTags,
}: NoteModalProps) {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [emoji, setEmoji] = useState(initialNote?.emoji || '');
  const [color, setColor] = useState<NoteColor>(initialNote?.color || 'default');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialNote?.tags || []);

  // Sync state when initialNote changes
  useEffect(() => {
    setTitle(initialNote?.title || '');
    setContent(initialNote?.content || '');
    setEmoji(initialNote?.emoji || '');
    setColor(initialNote?.color || 'default');
    setTags(initialNote?.tags || []);
  }, [initialNote]);

  const handleSave = () => {
    onSave({
      title,
      content,
      emoji: emoji || null,
      color,
      tags,
      isPinned: initialNote?.isPinned || false,
      status: initialNote?.status || 'active',
      trashedAt: initialNote?.trashedAt || null,
    });
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'add' ? 'Add Note' : 'Edit Note'}>
      <div className='space-y-4'>
        {/* Emoji */}
        <div>
          <Label htmlFor='emoji'>Emoji (optional)</Label>
          <Input
            id='emoji'
            type='text'
            placeholder='🎉'
            value={emoji}
            onChange={(e) => {
              // Get the first emoji/character using spread operator to handle multi-byte Unicode
              const chars = [...e.target.value];
              setEmoji(chars[0] || '');
            }}
            maxLength={10}
            className='max-w-20'
          />
        </div>

        {/* Title */}
        <div>
          <Label htmlFor='title'>Title</Label>
          <Input
            id='title'
            type='text'
            placeholder='Note title...'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Content */}
        <div>
          <Label htmlFor='content'>Content</Label>
          <Textarea
            id='content'
            placeholder='Note content...'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
          />
        </div>

        {/* Color */}
        <div>
          <Label className='mb-2 block'>Color</Label>
          <div className='flex flex-wrap gap-2'>
            {NOTE_COLORS.map((colorOption) => (
              <div
                key={colorOption.value}
                className={join(
                  'h-10 w-10 cursor-pointer rounded-full border-2 transition-all',
                  colorOption.class,
                  color === colorOption.value
                    ? 'border-foreground scale-110'
                    : 'border-border hover:scale-105'
                )}
                onClick={() => setColor(colorOption.value)}
                title={colorOption.label}
              />
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <Label htmlFor='tag-input'>Tags</Label>
          <div className='flex gap-2'>
            <Input
              id='tag-input'
              type='text'
              placeholder='Add a tag...'
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button onClick={handleAddTag} variant='outline'>
              <Plus className='h-4 w-4' />
            </Button>
          </div>

          {/* Existing tags that can be added */}
          {allTags.length > 0 && (
            <div className='mt-2'>
              <p className='text-foreground/60 mb-1 text-xs'>Existing tags:</p>
              <div className='flex flex-wrap gap-1'>
                {allTags
                  .filter((tag) => !tags.includes(tag))
                  .map((tag) => (
                    <Badge
                      key={tag}
                      variant='muted'
                      className='cursor-pointer hover:bg-secondary'
                      onClick={() => {
                        if (!tags.includes(tag)) {
                          setTags([...tags, tag]);
                        }
                      }}
                    >
                      + {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Selected tags */}
          {tags.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-2'>
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
        </div>

        {/* Actions */}
        <div className='flex gap-2'>
          <Button onClick={handleSave} className='flex-1'>
            {mode === 'add' ? 'Add Note' : 'Save Changes'}
          </Button>
          <Button onClick={onClose} variant='outline' className='flex-1'>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
