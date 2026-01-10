import { Note, NoteFilters } from './Notes.types';

/**
 * Generate a unique ID for a note
 */
export function generateNoteId(): string {
  const result = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  return result;
}

/**
 * Filter notes based on search query and filters
 */
export function filterNotes(notes: Note[], filters: NoteFilters): Note[] {
  const result = notes.filter((note) => {
    // Filter by status
    if (note.status !== filters.status) {
      return false;
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = note.title.toLowerCase().includes(query);
      const matchesContent = note.content.toLowerCase().includes(query);
      const matchesTags = note.tags.some((tag) =>
        tag.toLowerCase().includes(query)
      );

      if (!matchesTitle && !matchesContent && !matchesTags) {
        return false;
      }
    }

    // Filter by selected tags
    if (filters.selectedTags.length > 0) {
      const hasMatchingTag = filters.selectedTags.some((tag) =>
        note.tags.includes(tag)
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Filter by selected colors
    if (filters.selectedColors.length > 0) {
      if (!filters.selectedColors.includes(note.color)) {
        return false;
      }
    }

    return true;
  });

  return result;
}

/**
 * Sort notes: pinned first, then by last edited date (or trashedAt for trashed notes)
 */
export function sortNotes(notes: Note[]): Note[] {
  const result = [...notes].sort((a, b) => {
    // Pinned notes first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // For trashed notes, sort by trashedAt (newest first)
    if (a.status === 'trashed' && b.status === 'trashed') {
      const dateA = a.trashedAt || 0;
      const dateB = b.trashedAt || 0;
      return dateB - dateA;
    }

    // For other notes, sort by last edited date (newest first)
    return b.lastEditedAt - a.lastEditedAt;
  });

  return result;
}

/**
 * Check if a note should be auto-deleted (trashed for more than 30 days)
 */
export function shouldAutoDelete(note: Note): boolean {
  if (note.status !== 'trashed' || !note.trashedAt) {
    return false;
  }

  const daysSinceTrashed = (Date.now() - note.trashedAt) / (1000 * 60 * 60 * 24);

  const result = daysSinceTrashed >= 30;
  return result;
}

/**
 * Remove auto-deleted notes from the list
 */
export function removeAutoDeletedNotes(notes: Note[]): Note[] {
  const result = notes.filter((note) => !shouldAutoDelete(note));
  return result;
}

/**
 * Format a date for display
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - timestamp;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    const result = 'Today';
    return result;
  } else if (diffInDays === 1) {
    const result = 'Yesterday';
    return result;
  } else if (diffInDays < 7) {
    const result = `${diffInDays} days ago`;
    return result;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    const result = weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    return result;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    const result = months === 1 ? '1 month ago' : `${months} months ago`;
    return result;
  } else {
    const result = date.toLocaleDateString();
    return result;
  }
}

/**
 * Get days remaining before auto-deletion
 */
export function getDaysUntilDeletion(note: Note): number | null {
  if (note.status !== 'trashed' || !note.trashedAt) {
    return null;
  }

  const daysSinceTrashed = (Date.now() - note.trashedAt) / (1000 * 60 * 60 * 24);
  const daysRemaining = 30 - Math.floor(daysSinceTrashed);

  const result = Math.max(0, daysRemaining);
  return result;
}

/**
 * Parse text and identify URLs
 * Returns an array of segments, each marked as either text or URL
 */
export function parseTextForUrls(text: string): Array<{ type: 'text' | 'url'; content: string }> {
  // URL regex pattern that matches http, https, and www URLs
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  const segments: Array<{ type: 'text' | 'url'; content: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = urlPattern.exec(text)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: text.substring(lastIndex, match.index),
      });
    }

    // Add the URL
    segments.push({
      type: 'url',
      content: match[0],
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last URL
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.substring(lastIndex),
    });
  }

  return segments.length > 0 ? segments : [{ type: 'text', content: text }];
}
