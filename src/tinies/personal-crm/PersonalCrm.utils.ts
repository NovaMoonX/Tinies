import { Contact, Artifact, PersonalCrmFilters } from './PersonalCrm.types';

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function filterContacts(
  contacts: Contact[],
  filters: PersonalCrmFilters
): Contact[] {
  let result = contacts;

  // Filter by search query
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    result = result.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.emails.some((email) => email.address.toLowerCase().includes(query)) ||
        contact.phones.some((phone) => phone.number.includes(query)) ||
        contact.notes.some((note) => note.text.toLowerCase().includes(query))
    );
  }

  // Filter by relationship type
  if (filters.selectedRelationshipTypes.length > 0) {
    result = result.filter((contact) =>
      filters.selectedRelationshipTypes.includes(contact.relationshipType)
    );
  }

  return result;
}

export function filterArtifacts(
  artifacts: Artifact[],
  filters: PersonalCrmFilters
): Artifact[] {
  let result = artifacts;

  // Filter by search query
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    result = result.filter(
      (artifact) =>
        artifact.title.toLowerCase().includes(query) ||
        artifact.description.toLowerCase().includes(query) ||
        artifact.content.toLowerCase().includes(query) ||
        artifact.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        artifact.notes.some((note) => note.text.toLowerCase().includes(query))
    );
  }

  // Filter by artifact type
  if (filters.selectedArtifactTypes.length > 0) {
    result = result.filter((artifact) =>
      filters.selectedArtifactTypes.includes(artifact.type)
    );
  }

  return result;
}

export function getContactById(contacts: Contact[], id: string): Contact | null {
  const contact = contacts.find((c) => c.id === id);
  return contact || null;
}

export function getContactsByIds(contacts: Contact[], ids: string[]): Contact[] {
  return contacts.filter((c) => ids.includes(c.id));
}

export function getArtifactsByContactId(artifacts: Artifact[], contactId: string): Artifact[] {
  return artifacts.filter((a) => a.contactIds.includes(contactId));
}

export function formatPhoneNumber(phone: string): string {
  // Simple formatting for display
  return phone;
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatBirthday(isoDate: string): string {
  // Parse date string directly to avoid timezone issues
  // Birthday is stored as 'YYYY-MM-DD' without time component
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day); // month is 0-indexed
  
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
}

export function getUpcomingBirthdays(contacts: Contact[], daysAhead = 30): Contact[] {
  const today = new Date();
  const result: Contact[] = [];

  for (const contact of contacts) {
    if (!contact.birthday) continue;

    // Parse birthday without timezone conversion
    const [, month, day] = contact.birthday.split('-').map(Number);
    const thisYear = today.getFullYear();
    
    // Create birthday date for this year
    const birthdayThisYear = new Date(thisYear, month - 1, day); // month is 0-indexed
    
    // If birthday already passed this year, check next year
    if (birthdayThisYear < today) {
      birthdayThisYear.setFullYear(thisYear + 1);
    }

    const daysUntil = Math.floor(
      (birthdayThisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntil >= 0 && daysUntil <= daysAhead) {
      result.push(contact);
    }
  }

  return result;
}

export function getRelationshipTypeLabel(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function getArtifactTypeIcon(type: string): string {
  switch (type) {
    case 'link':
      return '🔗';
    case 'text':
      return '📝';
    case 'photo':
      return '📷';
    case 'file':
      return '📎';
    default:
      return '📄';
  }
}
