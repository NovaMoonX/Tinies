import { Button, Badge, Card, Modal, Input, Textarea, Select, Label } from '@moondreamsdev/dreamer-ui/components';
import { Trash, Plus } from '@moondreamsdev/dreamer-ui/symbols';
import { useState, useEffect } from 'react';
import {
  Contact,
  Artifact,
  ArtifactComment,
  RelationshipType,
  ArtifactType,
  PersonalCrmFilters,
} from './PersonalCrm.types';
import {
  formatDate,
  formatBirthday,
  getRelationshipTypeLabel,
  getArtifactTypeIcon,
  getContactsByIds,
  generateId,
} from './PersonalCrm.utils';
import { RELATIONSHIP_TYPES, ARTIFACT_TYPES } from './PersonalCrm.data';

/* ============================================================================
 * Contact Card Component
 * ========================================================================= */
interface ContactCardProps {
  contact: Contact;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export function ContactCard({ contact, onClick, onDelete }: ContactCardProps) {
  const primaryEmail = contact.emails[0]?.address || 'No email';
  const primaryPhone = contact.phones[0]?.number || 'No phone';

  return (
    <div onClick={onClick} className='cursor-pointer'>
      <Card className='hover:border-primary/50 transition-colors'>
        <div className='space-y-4'>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <h3 className='mb-1 text-lg font-semibold'>{contact.name}</h3>
              <Badge variant='secondary' className='text-xs'>
                {getRelationshipTypeLabel(contact.relationshipType)}
              </Badge>
            </div>
            <Button
              variant='tertiary'
              size='sm'
              onClick={(e) => {
                e.stopPropagation();
                onDelete(contact.id);
              }}
            >
              <Trash className='h-4 w-4' />
            </Button>
          </div>

          <div className='space-y-2 text-sm'>
            {contact.emails.length > 0 && (
              <div className='text-foreground/70 flex items-center gap-2'>
                <span className='text-lg'>📧</span>
                <span className='truncate'>{primaryEmail}</span>
              </div>
            )}
            {contact.phones.length > 0 && (
              <div className='text-foreground/70 flex items-center gap-2'>
                <span className='text-lg'>📞</span>
                <span>{primaryPhone}</span>
              </div>
            )}
            {contact.birthday && (
              <div className='text-foreground/70 flex items-center gap-2'>
                <span className='text-lg'>🎂</span>
                <span>{formatBirthday(contact.birthday)}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ============================================================================
 * Contact Details Modal Component
 * ========================================================================= */
interface ContactDetailsModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onAddNote: (contactId: string, noteText: string) => void;
  onEditNote: (contactId: string, noteId: string, newText: string) => void;
  onDeleteNote: (contactId: string, noteId: string) => void;
}

export function ContactDetailsModal({
  contact,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onAddNote,
  onEditNote,
  onDeleteNote,
}: ContactDetailsModalProps) {
  const [newNoteText, setNewNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState('');

  if (!contact) return null;

  const handleAddNote = () => {
    if (newNoteText.trim()) {
      onAddNote(contact.id, newNoteText.trim());
      setNewNoteText('');
    }
  };

  const handleStartEditNote = (noteId: string, currentText: string) => {
    setEditingNoteId(noteId);
    setEditNoteText(currentText);
  };

  const handleSaveEditNote = (noteId: string) => {
    if (editNoteText.trim()) {
      onEditNote(contact.id, noteId, editNoteText.trim());
      setEditingNoteId(null);
      setEditNoteText('');
    }
  };

  const handleCancelEditNote = () => {
    setEditingNoteId(null);
    setEditNoteText('');
  };

  const handleDeleteNote = (noteId: string) => {
    onDeleteNote(contact.id, noteId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={contact.name}>
      <div className='space-y-6'>
        {/* Relationship Type */}
        <div>
          <Badge variant='secondary'>{getRelationshipTypeLabel(contact.relationshipType)}</Badge>
        </div>

        {/* Contact Information */}
        <div className='space-y-4'>
          <h3 className='font-semibold'>Contact Information</h3>
          
          {contact.phones.length > 0 && (
            <div className='space-y-2'>
              <p className='text-foreground/70 text-sm'>Phone Numbers</p>
              {contact.phones.map((phone) => (
                <div key={phone.id} className='flex items-center gap-2 text-sm'>
                  <span className='text-lg'>📞</span>
                  <span className='text-foreground/60 capitalize'>{phone.label}:</span>
                  <span>{phone.number}</span>
                </div>
              ))}
            </div>
          )}

          {contact.emails.length > 0 && (
            <div className='space-y-2'>
              <p className='text-foreground/70 text-sm'>Email Addresses</p>
              {contact.emails.map((email) => (
                <div key={email.id} className='flex items-center gap-2 text-sm'>
                  <span className='text-lg'>📧</span>
                  <span className='text-foreground/60 capitalize'>{email.label}:</span>
                  <span>{email.address}</span>
                </div>
              ))}
            </div>
          )}

          {contact.birthday && (
            <div className='flex items-center gap-2 text-sm'>
              <span className='text-lg'>🎂</span>
              <span className='text-foreground/60'>Birthday:</span>
              <span>{formatBirthday(contact.birthday)}</span>
            </div>
          )}
        </div>

        {/* Interesting Facts */}
        {contact.interestingFacts.length > 0 && (
          <div className='space-y-2'>
            <h3 className='font-semibold'>Interesting Facts</h3>
            <ul className='list-inside list-disc space-y-1 text-sm'>
              {contact.interestingFacts.map((fact, index) => (
                <li key={index}>{fact}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Likes */}
        {contact.likes.length > 0 && (
          <div className='space-y-2'>
            <h3 className='font-semibold'>Likes</h3>
            <div className='flex flex-wrap gap-2'>
              {contact.likes.map((like, index) => (
                <Badge key={index} variant='secondary'>
                  {like}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Dislikes */}
        {contact.dislikes.length > 0 && (
          <div className='space-y-2'>
            <h3 className='font-semibold'>Dislikes</h3>
            <div className='flex flex-wrap gap-2'>
              {contact.dislikes.map((dislike, index) => (
                <Badge key={index} variant='secondary'>
                  {dislike}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {contact.notes.length > 0 && (
          <div className='space-y-2'>
            <h3 className='font-semibold'>Notes</h3>
            <div className='space-y-3'>
              {contact.notes.map((note) => (
                <div key={note.id} className='bg-muted/30 rounded-lg p-3'>
                  {editingNoteId === note.id ? (
                    <div className='space-y-2'>
                      <Textarea
                        name='editNote'
                        value={editNoteText}
                        onChange={(e) => setEditNoteText(e.target.value)}
                        rows={2}
                        className='text-sm'
                      />
                      <div className='flex gap-2'>
                        <Button
                          onClick={() => handleSaveEditNote(note.id)}
                          disabled={!editNoteText.trim()}
                          size='sm'
                          className='flex-1'
                        >
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEditNote}
                          variant='outline'
                          size='sm'
                          className='flex-1'
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className='mb-1 text-sm'>{note.text}</p>
                      <div className='flex items-center justify-between'>
                        <p className='text-foreground/50 text-xs'>{formatDate(note.dateAdded)}</p>
                        <div className='flex gap-1'>
                          <Button
                            onClick={() => handleStartEditNote(note.id, note.text)}
                            variant='base'
                            size='sm'
                            className='h-6 px-2 text-xs'
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteNote(note.id)}
                            variant='base'
                            size='sm'
                            className='h-6 px-2 text-xs text-destructive hover:text-destructive'
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Note */}
        <div className='space-y-2'>
          <h3 className='font-semibold'>Add Note</h3>
          <div className='flex gap-2'>
            <Textarea
              name='newNote'
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder='Enter a note about this contact...'
              rows={2}
              className='flex-1'
            />
          </div>
          <Button
            onClick={handleAddNote}
            disabled={!newNoteText.trim()}
            size='sm'
            className='w-full'
          >
            <Plus className='h-4 w-4' />
            Add Note
          </Button>
        </div>

        {/* Actions */}
        <div className='flex gap-2'>
          <Button onClick={onEdit} className='flex-1'>
            <span className='text-lg'>✏️</span>
            Edit
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              onDelete(contact.id);
              onClose();
            }}
            className='flex-1'
          >
            <Trash className='h-4 w-4' />
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ============================================================================
 * Add Contact Modal Component
 * ========================================================================= */
interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (contact: Omit<Contact, 'id' | 'dateAdded'>) => void;
}

export function AddContactModal({ isOpen, onClose, onAdd }: AddContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    relationshipType: 'friend' as RelationshipType,
    phone: '',
    phoneLabel: 'mobile',
    email: '',
    emailLabel: 'personal',
    birthday: '',
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    const newContact: Omit<Contact, 'id' | 'dateAdded'> = {
      name: formData.name,
      relationshipType: formData.relationshipType,
      phones: formData.phone
        ? [{ id: generateId('phone'), label: formData.phoneLabel, number: formData.phone }]
        : [],
      emails: formData.email
        ? [{ id: generateId('email'), label: formData.emailLabel, address: formData.email }]
        : [],
      birthday: formData.birthday || null,
      notes: [],
      interestingFacts: [],
      likes: [],
      dislikes: [],
      avatarUrl: null,
    };

    onAdd(newContact);
    
    // Reset form
    setFormData({
      name: '',
      relationshipType: 'friend',
      phone: '',
      phoneLabel: 'mobile',
      email: '',
      emailLabel: 'personal',
      birthday: '',
    });
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Add New Contact'>
      <div className='space-y-4'>
        <div>
          <label className='mb-1 block text-sm font-medium'>Name *</label>
          <Input
            name='name'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder='Enter name'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium'>Relationship Type</label>
          <Select
            value={formData.relationshipType}
            onChange={(value) => setFormData({ ...formData, relationshipType: value as RelationshipType })}
            options={RELATIONSHIP_TYPES.map((type) => ({
              value: type,
              text: getRelationshipTypeLabel(type),
            }))}
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium'>Email</label>
          <Input
            name='email'
            type='email'
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder='email@example.com'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium'>Phone</label>
          <Input
            name='phone'
            type='tel'
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder='(555) 123-4567'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium'>Birthday</label>
          <Input
            name='birthday'
            type='date'
            value={formData.birthday}
            onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
          />
        </div>

        <div className='flex gap-2'>
          <Button onClick={handleSubmit} className='flex-1' disabled={!formData.name.trim()}>
            Add Contact
          </Button>
          <Button variant='outline' onClick={onClose} className='flex-1'>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ============================================================================
 * Artifact Card Component
 * ========================================================================= */
interface ArtifactCardProps {
  artifact: Artifact;
  contacts: Contact[];
  onClick: () => void;
  onDelete: (id: string) => void;
}

export function ArtifactCard({ artifact, contacts, onClick, onDelete }: ArtifactCardProps) {
  const associatedContacts = getContactsByIds(contacts, artifact.contactIds);

  return (
    <div onClick={onClick} className='cursor-pointer'>
      <Card className='hover:border-primary/50 transition-colors'>
        <div className='space-y-4'>
          <div className='flex items-start justify-between'>
            <div className='flex items-start gap-3'>
              <span className='text-3xl'>{getArtifactTypeIcon(artifact.type)}</span>
              <div className='flex-1'>
                <h3 className='mb-1 text-lg font-semibold'>{artifact.title}</h3>
                <p className='text-foreground/70 mb-2 text-sm'>{artifact.description}</p>
              </div>
            </div>
            <Button
              variant='tertiary'
              size='sm'
              onClick={(e) => {
                e.stopPropagation();
                onDelete(artifact.id);
              }}
            >
              <Trash className='h-4 w-4' />
            </Button>
          </div>

          {associatedContacts.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {associatedContacts.map((contact) => (
                <Badge key={contact.id} variant='secondary' className='text-xs'>
                  {contact.name}
                </Badge>
              ))}
            </div>
          )}

          {artifact.tags.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {artifact.tags.map((tag, index) => (
                <Badge key={index} variant='muted' className='text-xs'>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ============================================================================
 * Artifact Details Modal Component
 * ========================================================================= */
interface ArtifactDetailsModalProps {
  artifact: Artifact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
  contacts: Contact[];
  onAddComment: (artifactId: string, comment: Omit<ArtifactComment, 'id' | 'dateAdded'>) => void;
}

export function ArtifactDetailsModal({
  artifact,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  contacts,
  onAddComment,
}: ArtifactDetailsModalProps) {
  const [newComment, setNewComment] = useState({ text: '', contactId: '' });

  if (!artifact) return null;

  const associatedContacts = getContactsByIds(contacts, artifact.contactIds);

  const handleAddComment = () => {
    if (!newComment.text.trim() || !newComment.contactId) return;

    onAddComment(artifact.id, {
      text: newComment.text,
      contactId: newComment.contactId,
    });

    setNewComment({ text: '', contactId: '' });
  };

  const getContactName = (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId);
    
    return contact ? contact.name : 'Unknown Contact';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={artifact.title}>
      <div className='space-y-6'>
        {/* Type Badge */}
        <div className='flex items-center gap-2'>
          <span className='text-2xl'>{getArtifactTypeIcon(artifact.type)}</span>
          <Badge variant='secondary' className='capitalize'>
            {artifact.type}
          </Badge>
        </div>

        {/* Description */}
        <div>
          <p className='text-foreground/70'>{artifact.description}</p>
        </div>

        {/* Content */}
        <div className='space-y-2'>
          <h3 className='font-semibold'>Content</h3>
          {artifact.type === 'link' ? (
            <a
              href={artifact.content}
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline flex items-center gap-2'
              onClick={(e) => e.stopPropagation()}
            >
              <span className='text-lg'>🔗</span>
              {artifact.content}
              <span className='text-lg'>↗️</span>
            </a>
          ) : artifact.type === 'photo' ? (
            <img
              src={artifact.content}
              alt={artifact.title}
              className='max-h-96 w-full rounded-lg object-cover'
            />
          ) : (
            <div className='bg-muted/30 whitespace-pre-wrap rounded-lg p-4 text-sm'>
              {artifact.content}
            </div>
          )}
        </div>

        {/* Associated Contacts */}
        {associatedContacts.length > 0 && (
          <div className='space-y-2'>
            <h3 className='font-semibold'>Associated Contacts</h3>
            <div className='flex flex-wrap gap-2'>
              {associatedContacts.map((contact) => (
                <Badge key={contact.id} variant='secondary'>
                  {contact.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {artifact.tags.length > 0 && (
          <div className='space-y-2'>
            <h3 className='font-semibold'>Tags</h3>
            <div className='flex flex-wrap gap-2'>
              {artifact.tags.map((tag, index) => (
                <Badge key={index} variant='muted'>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Comments (Chat-like) */}
        <div className='space-y-3'>
          <h3 className='font-semibold'>Comments</h3>
          
          {artifact.comments.length > 0 && (
            <div className='bg-muted/20 max-h-64 space-y-3 overflow-y-auto rounded-lg p-4'>
              {artifact.comments.map((comment) => (
                <div key={comment.id} className='bg-background rounded-lg p-3 shadow-sm'>
                  <p className='mb-1 text-sm font-medium'>{getContactName(comment.contactId)}</p>
                  <p className='mb-1 text-sm'>{comment.text}</p>
                  <p className='text-foreground/50 text-xs'>{formatDate(comment.dateAdded)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Form */}
          <div className='bg-muted/30 space-y-3 rounded-lg p-4'>
            <div>
              <Label htmlFor='contact-select'>Select Contact</Label>
              <select
                id='contact-select'
                className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                value={newComment.contactId}
                onChange={(e) => setNewComment({ ...newComment, contactId: e.target.value })}
              >
                <option value=''>Select a contact...</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name}
                  </option>
                ))}
              </select>
            </div>
            <Textarea
              name='commentText'
              value={newComment.text}
              onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
              placeholder='Add a comment about this artifact...'
              rows={3}
            />
            <Button
              size='sm'
              onClick={handleAddComment}
              disabled={!newComment.text.trim() || !newComment.contactId}
            >
              Add Comment
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className='flex gap-2'>
          <Button onClick={onEdit} className='flex-1'>
            <span className='text-lg'>✏️</span>
            Edit
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              onDelete(artifact.id);
              onClose();
            }}
            className='flex-1'
          >
            <Trash className='h-4 w-4' />
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ============================================================================
 * Add Artifact Modal Component
 * ========================================================================= */
interface AddArtifactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (artifact: Omit<Artifact, 'id' | 'dateAdded'>) => void;
}

export function AddArtifactModal({ isOpen, onClose, onAdd }: AddArtifactModalProps) {
  const [formData, setFormData] = useState({
    type: 'text' as ArtifactType,
    title: '',
    description: '',
    content: '',
    contactIds: [] as string[],
    tags: '',
  });
  const [photoInputMethod, setPhotoInputMethod] = useState<'url' | 'upload'>('url');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local URL for the uploaded file
      const fileUrl = URL.createObjectURL(file);
      setFormData({ ...formData, content: fileUrl });
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    const newArtifact: Omit<Artifact, 'id' | 'dateAdded'> = {
      type: formData.type,
      title: formData.title,
      description: formData.description,
      content: formData.content,
      contactIds: formData.contactIds,
      comments: [],
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    };

    onAdd(newArtifact);
    
    // Reset form
    setFormData({
      type: 'text',
      title: '',
      description: '',
      content: '',
      contactIds: [],
      tags: '',
    });
    setPhotoInputMethod('url');
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Add New Artifact'>
      <div className='space-y-4'>
        <div>
          <label className='mb-1 block text-sm font-medium'>Type</label>
          <Select
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value as ArtifactType })}
            options={ARTIFACT_TYPES.map((type) => ({
              value: type,
              text: `${getArtifactTypeIcon(type)} ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            }))}
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium'>Title *</label>
          <Input
            name='title'
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder='Enter title'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium'>Description</label>
          <Input
            name='description'
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder='Brief description'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium'>
            {formData.type === 'link' ? 'URL *' : formData.type === 'photo' ? 'Photo *' : 'Content *'}
          </label>
          {formData.type === 'text' ? (
            <Textarea
              name='content'
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder='Enter content...'
              rows={5}
            />
          ) : formData.type === 'photo' ? (
            <>
              <div className='mb-3 flex gap-2'>
                <Button
                  type='button'
                  variant={photoInputMethod === 'url' ? 'primary' : 'outline'}
                  size='sm'
                  onClick={() => setPhotoInputMethod('url')}
                  className='flex-1'
                >
                  URL
                </Button>
                <Button
                  type='button'
                  variant={photoInputMethod === 'upload' ? 'primary' : 'outline'}
                  size='sm'
                  onClick={() => setPhotoInputMethod('upload')}
                  className='flex-1'
                >
                  Upload
                </Button>
              </div>
              {photoInputMethod === 'url' ? (
                <Input
                  name='content'
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder='https://example.com/image.jpg'
                />
              ) : (
                <div>
                  <Label htmlFor='photo-file'>Upload Photo</Label>
                  <input
                    id='photo-file'
                    type='file'
                    accept='image/*'
                    onChange={handleFileUpload}
                    className='w-full rounded-md border border-foreground/20 px-3 py-2 text-sm file:mr-4 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90'
                  />
                  {formData.content && (
                    <div className='mt-2'>
                      <img
                        src={formData.content}
                        alt='Preview'
                        className='h-48 w-full rounded-lg object-cover'
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <Input
              name='content'
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={
                formData.type === 'link'
                  ? 'https://example.com'
                  : 'file-path-or-url'
              }
            />
          )}
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium'>Tags (comma-separated)</label>
          <Input
            name='tags'
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder='tag1, tag2, tag3'
          />
        </div>

        <div className='flex gap-2'>
          <Button
            onClick={handleSubmit}
            className='flex-1'
            disabled={!formData.title.trim() || !formData.content.trim()}
          >
            Add Artifact
          </Button>
          <Button variant='outline' onClick={onClose} className='flex-1'>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ============================================================================
 * Filter Section Component
 * ========================================================================= */
interface FilterSectionProps {
  filters: PersonalCrmFilters;
  onFiltersChange: (filters: PersonalCrmFilters) => void;
  totalContacts: number;
  totalArtifacts: number;
  filteredCount: number;
}

export function FilterSection({
  filters,
  onFiltersChange,
  totalContacts,
  totalArtifacts,
  filteredCount,
}: FilterSectionProps) {
  const isFiltering =
    filters.searchQuery ||
    filters.selectedRelationshipTypes.length > 0 ||
    filters.selectedArtifactTypes.length > 0;

  const handleClearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      selectedRelationshipTypes: [],
      view: filters.view,
      selectedArtifactTypes: [],
      selectedContactIds: [],
    });
  };

  return (
    <div className='bg-muted/30 space-y-4 rounded-2xl p-6'>
      {/* View Toggle */}
      <div className='flex gap-2'>
        <Button
          variant={filters.view === 'contacts' ? 'primary' : 'outline'}
          onClick={() => onFiltersChange({ ...filters, view: 'contacts' })}
          className='flex-1'
        >
          👤 Contacts ({totalContacts})
        </Button>
        <Button
          variant={filters.view === 'artifacts' ? 'primary' : 'outline'}
          onClick={() => onFiltersChange({ ...filters, view: 'artifacts' })}
          className='flex-1'
        >
          📦 Artifacts ({totalArtifacts})
        </Button>
      </div>

      {/* Search */}
      <div>
        <Input
          name='search'
          value={filters.searchQuery}
          onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
          placeholder={`Search ${filters.view}...`}
        />
      </div>

      {/* Filters by view */}
      {filters.view === 'contacts' && (
        <div>
          <label className='mb-2 block text-sm font-medium'>Relationship Type</label>
          <div className='flex flex-wrap gap-2'>
            {RELATIONSHIP_TYPES.map((type) => (
              <Badge
                key={type}
                variant={filters.selectedRelationshipTypes.includes(type) ? 'secondary' : 'muted'}
                className='cursor-pointer'
                onClick={() => {
                  const newTypes = filters.selectedRelationshipTypes.includes(type)
                    ? filters.selectedRelationshipTypes.filter((t) => t !== type)
                    : [...filters.selectedRelationshipTypes, type];
                  onFiltersChange({ ...filters, selectedRelationshipTypes: newTypes });
                }}
              >
                {getRelationshipTypeLabel(type)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {filters.view === 'artifacts' && (
        <div>
          <label className='mb-2 block text-sm font-medium'>Artifact Type</label>
          <div className='flex flex-wrap gap-2'>
            {ARTIFACT_TYPES.map((type) => (
              <Badge
                key={type}
                variant={filters.selectedArtifactTypes.includes(type) ? 'secondary' : 'muted'}
                className='cursor-pointer'
                onClick={() => {
                  const newTypes = filters.selectedArtifactTypes.includes(type)
                    ? filters.selectedArtifactTypes.filter((t) => t !== type)
                    : [...filters.selectedArtifactTypes, type];
                  onFiltersChange({ ...filters, selectedArtifactTypes: newTypes });
                }}
              >
                {getArtifactTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Results and Clear */}
      <div className='flex items-center justify-between pt-2'>
        <p className='text-foreground/70 text-sm'>
          {isFiltering ? (
            <>
              Showing {filteredCount} of {filters.view === 'contacts' ? totalContacts : totalArtifacts}{' '}
              {filters.view}
            </>
          ) : (
            <>
              {filters.view === 'contacts' ? totalContacts : totalArtifacts} total {filters.view}
            </>
          )}
        </p>
        {isFiltering && (
          <Button variant='tertiary' size='sm' onClick={handleClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
 * Contacts Tab Content Component
 * ========================================================================= */
interface ContactsTabContentProps {
  contacts: Contact[];
  allContacts: Contact[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRelationshipTypes: RelationshipType[];
  onRelationshipTypesChange: (types: RelationshipType[]) => void;
  onAddContact: () => void;
  onContactClick: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
}

export function ContactsTabContent({
  contacts,
  allContacts,
  searchQuery,
  onSearchChange,
  selectedRelationshipTypes,
  onRelationshipTypesChange,
  onAddContact,
  onContactClick,
  onDeleteContact,
}: ContactsTabContentProps) {
  const isFiltering = searchQuery || selectedRelationshipTypes.length > 0;

  const handleClearFilters = () => {
    onSearchChange('');
    onRelationshipTypesChange([]);
  };

  return (
    <div className='space-y-6 pt-6'>
      {/* Add Contact Button */}
      <div className='flex justify-center'>
        <Button onClick={onAddContact}>
          <Plus className='h-5 w-5' />
          Add Contact
        </Button>
      </div>

      {/* Search and Filters */}
      <div className='bg-muted/30 space-y-4 rounded-2xl p-6'>
        <div>
          <Input
            name='search'
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder='Search contacts...'
          />
        </div>

        <div>
          <label className='mb-2 block text-sm font-medium'>Relationship Type</label>
          <div className='flex flex-wrap gap-2'>
            {RELATIONSHIP_TYPES.map((type) => (
              <Badge
                key={type}
                variant={selectedRelationshipTypes.includes(type) ? 'secondary' : 'muted'}
                className='cursor-pointer'
                onClick={() => {
                  const newTypes = selectedRelationshipTypes.includes(type)
                    ? selectedRelationshipTypes.filter((t) => t !== type)
                    : [...selectedRelationshipTypes, type];
                  onRelationshipTypesChange(newTypes);
                }}
              >
                {getRelationshipTypeLabel(type)}
              </Badge>
            ))}
          </div>
        </div>

        <div className='flex items-center justify-between pt-2'>
          <p className='text-foreground/70 text-sm'>
            {isFiltering ? (
              <>
                Showing {contacts.length} of {allContacts.length} contacts
              </>
            ) : (
              <>{allContacts.length} total contacts</>
            )}
          </p>
          {isFiltering && (
            <Button variant='tertiary' size='sm' onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Contact Grid */}
      {contacts.length > 0 ? (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onClick={() => onContactClick(contact)}
              onDelete={onDeleteContact}
            />
          ))}
        </div>
      ) : (
        <div className='bg-muted/30 rounded-2xl p-12 text-center'>
          <p className='text-foreground/60 mb-4'>
            {isFiltering
              ? 'No contacts match your filters.'
              : 'No contacts yet. Add your first contact to get started!'}
          </p>
          <Button onClick={onAddContact}>
            <Plus className='h-5 w-5' />
            Add Your First Contact
          </Button>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * Artifacts Tab Content Component
 * ========================================================================= */
interface ArtifactsTabContentProps {
  artifacts: Artifact[];
  allArtifacts: Artifact[];
  contacts: Contact[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedArtifactTypes: ArtifactType[];
  onArtifactTypesChange: (types: ArtifactType[]) => void;
  selectedContactIds: string[];
  onContactIdsChange: (ids: string[]) => void;
  onAddArtifact: () => void;
  onArtifactClick: (artifact: Artifact) => void;
  onDeleteArtifact: (id: string) => void;
}

export function ArtifactsTabContent({
  artifacts,
  allArtifacts,
  contacts,
  searchQuery,
  onSearchChange,
  selectedArtifactTypes,
  onArtifactTypesChange,
  selectedContactIds,
  onContactIdsChange,
  onAddArtifact,
  onArtifactClick,
  onDeleteArtifact,
}: ArtifactsTabContentProps) {
  const isFiltering = searchQuery || selectedArtifactTypes.length > 0 || selectedContactIds.length > 0;

  const handleClearFilters = () => {
    onSearchChange('');
    onArtifactTypesChange([]);
    onContactIdsChange([]);
  };

  return (
    <div className='space-y-6 pt-6'>
      {/* Add Artifact Button */}
      <div className='flex justify-center'>
        <Button onClick={onAddArtifact}>
          <Plus className='h-5 w-5' />
          Add Artifact
        </Button>
      </div>

      {/* Search and Filters */}
      <div className='bg-muted/30 space-y-4 rounded-2xl p-6'>
        <div>
          <Input
            name='search'
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder='Search artifacts...'
          />
        </div>

        <div>
          <label className='mb-2 block text-sm font-medium'>Artifact Type</label>
          <div className='flex flex-wrap gap-2'>
            {ARTIFACT_TYPES.map((type) => (
              <Badge
                key={type}
                variant={selectedArtifactTypes.includes(type) ? 'secondary' : 'muted'}
                className='cursor-pointer'
                onClick={() => {
                  const newTypes = selectedArtifactTypes.includes(type)
                    ? selectedArtifactTypes.filter((t) => t !== type)
                    : [...selectedArtifactTypes, type];
                  onArtifactTypesChange(newTypes);
                }}
              >
                {getArtifactTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className='mb-2 block text-sm font-medium'>Filter by Contact</label>
          <div className='flex flex-wrap gap-2'>
            {contacts.map((contact) => (
              <Badge
                key={contact.id}
                variant={selectedContactIds.includes(contact.id) ? 'secondary' : 'muted'}
                className='cursor-pointer'
                onClick={() => {
                  const newContactIds = selectedContactIds.includes(contact.id)
                    ? selectedContactIds.filter((id) => id !== contact.id)
                    : [...selectedContactIds, contact.id];
                  onContactIdsChange(newContactIds);
                }}
              >
                {contact.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className='flex items-center justify-between pt-2'>
          <p className='text-foreground/70 text-sm'>
            {isFiltering ? (
              <>
                Showing {artifacts.length} of {allArtifacts.length} artifacts
              </>
            ) : (
              <>{allArtifacts.length} total artifacts</>
            )}
          </p>
          {isFiltering && (
            <Button variant='tertiary' size='sm' onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Artifact Grid */}
      {artifacts.length > 0 ? (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {artifacts.map((artifact) => (
            <ArtifactCard
              key={artifact.id}
              artifact={artifact}
              contacts={contacts}
              onClick={() => onArtifactClick(artifact)}
              onDelete={onDeleteArtifact}
            />
          ))}
        </div>
      ) : (
        <div className='bg-muted/30 rounded-2xl p-12 text-center'>
          <p className='text-foreground/60 mb-4'>
            {isFiltering
              ? 'No artifacts match your filters.'
              : 'No artifacts yet. Add your first artifact to get started!'}
          </p>
          <Button onClick={onAddArtifact}>
            <Plus className='h-5 w-5' />
            Add Your First Artifact
          </Button>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * Edit Contact Modal Component
 * ========================================================================= */
interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onSave: (updates: Partial<Contact>) => void;
}

export function EditContactModal({ isOpen, onClose, contact, onSave }: EditContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    relationshipType: 'friend' as RelationshipType,
    phone: '',
    phoneLabel: 'mobile',
    email: '',
    emailLabel: 'personal',
    birthday: '',
  });

  // Update form when contact changes
  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        relationshipType: contact.relationshipType,
        phone: contact.phones[0]?.number || '',
        phoneLabel: contact.phones[0]?.label || 'mobile',
        email: contact.emails[0]?.address || '',
        emailLabel: contact.emails[0]?.label || 'personal',
        birthday: contact.birthday || '',
      });
    }
  }, [contact]);

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    const updates: Partial<Contact> = {
      name: formData.name,
      relationshipType: formData.relationshipType,
      phones: formData.phone
        ? [{ id: contact?.phones[0]?.id || generateId('phone'), label: formData.phoneLabel, number: formData.phone }]
        : [],
      emails: formData.email
        ? [{ id: contact?.emails[0]?.id || generateId('email'), label: formData.emailLabel, address: formData.email }]
        : [],
      birthday: formData.birthday || null,
    };

    onSave(updates);
    onClose();
  };

  if (!contact) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Edit Contact'>
      <div className='space-y-4'>
        <div>
          <label className='mb-1 block text-sm font-medium'>Name *</label>
          <Input
            name='name'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder='Enter name'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium'>Relationship Type</label>
          <Select
            value={formData.relationshipType}
            onChange={(value) => setFormData({ ...formData, relationshipType: value as RelationshipType })}
            options={RELATIONSHIP_TYPES.map((type) => ({
              value: type,
              text: getRelationshipTypeLabel(type),
            }))}
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium'>Phone</label>
          <div className='flex gap-2'>
            <Select
              value={formData.phoneLabel}
              onChange={(value) => setFormData({ ...formData, phoneLabel: value })}
              options={[
                { value: 'mobile', text: 'Mobile' },
                { value: 'work', text: 'Work' },
                { value: 'home', text: 'Home' },
              ]}
              className='w-32'
            />
            <Input
              name='phone'
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder='(555) 123-4567'
              className='flex-1'
            />
          </div>
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium'>Email</label>
          <div className='flex gap-2'>
            <Select
              value={formData.emailLabel}
              onChange={(value) => setFormData({ ...formData, emailLabel: value })}
              options={[
                { value: 'personal', text: 'Personal' },
                { value: 'work', text: 'Work' },
              ]}
              className='w-32'
            />
            <Input
              name='email'
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder='email@example.com'
              type='email'
              className='flex-1'
            />
          </div>
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium'>Birthday</label>
          <Input
            name='birthday'
            value={formData.birthday}
            onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
            type='date'
          />
        </div>

        <div className='flex gap-2'>
          <Button onClick={handleSubmit} className='flex-1' disabled={!formData.name.trim()}>
            Save Changes
          </Button>
          <Button variant='outline' onClick={onClose} className='flex-1'>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ============================================================================
 * Edit Artifact Modal Component
 * ========================================================================= */
interface EditArtifactModalProps {
  isOpen: boolean;
  onClose: () => void;
  artifact: Artifact | null;
  onSave: (updates: Partial<Artifact>) => void;
}

export function EditArtifactModal({ isOpen, onClose, artifact, onSave }: EditArtifactModalProps) {
  const [formData, setFormData] = useState({
    type: 'text' as ArtifactType,
    title: '',
    description: '',
    content: '',
    tags: '',
  });
  const [photoInputMethod, setPhotoInputMethod] = useState<'url' | 'upload'>('url');

  // Update form when artifact changes
  useEffect(() => {
    if (artifact) {
      setFormData({
        type: artifact.type,
        title: artifact.title,
        description: artifact.description,
        content: artifact.content,
        tags: artifact.tags.join(', '),
      });
    }
  }, [artifact]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setFormData({ ...formData, content: fileUrl });
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    const updates: Partial<Artifact> = {
      type: formData.type,
      title: formData.title,
      description: formData.description,
      content: formData.content,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    };

    onSave(updates);
    onClose();
  };

  if (!artifact) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Edit Artifact'>
      <div className='space-y-4'>
        <div>
          <label className='mb-1 block text-sm font-medium'>Type</label>
          <Select
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value as ArtifactType })}
            options={ARTIFACT_TYPES.map((type) => ({
              value: type,
              text: `${getArtifactTypeIcon(type)} ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            }))}
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium'>Title *</label>
          <Input
            name='title'
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder='Enter title'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium'>Description</label>
          <Input
            name='description'
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder='Brief description'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium'>
            {formData.type === 'link' ? 'URL *' : formData.type === 'photo' ? 'Photo *' : 'Content *'}
          </label>
          {formData.type === 'text' ? (
            <Textarea
              name='content'
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder='Enter content...'
              rows={5}
            />
          ) : formData.type === 'photo' ? (
            <>
              <div className='mb-3 flex gap-2'>
                <Button
                  type='button'
                  variant={photoInputMethod === 'url' ? 'primary' : 'outline'}
                  size='sm'
                  onClick={() => setPhotoInputMethod('url')}
                  className='flex-1'
                >
                  URL
                </Button>
                <Button
                  type='button'
                  variant={photoInputMethod === 'upload' ? 'primary' : 'outline'}
                  size='sm'
                  onClick={() => setPhotoInputMethod('upload')}
                  className='flex-1'
                >
                  Upload
                </Button>
              </div>
              {photoInputMethod === 'url' ? (
                <Input
                  name='content'
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder='https://example.com/image.jpg'
                />
              ) : (
                <div>
                  <Label htmlFor='photo-file-edit'>Upload Photo</Label>
                  <input
                    id='photo-file-edit'
                    type='file'
                    accept='image/*'
                    onChange={handleFileUpload}
                    className='w-full rounded-md border border-foreground/20 px-3 py-2 text-sm file:mr-4 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90'
                  />
                  {formData.content && (
                    <div className='mt-2'>
                      <img
                        src={formData.content}
                        alt='Preview'
                        className='h-48 w-full rounded-lg object-cover'
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <Input
              name='content'
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={
                formData.type === 'link'
                  ? 'https://example.com'
                  : 'file-path-or-url'
              }
            />
          )}
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium'>Tags (comma-separated)</label>
          <Input
            name='tags'
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder='tag1, tag2, tag3'
          />
        </div>

        <div className='flex gap-2'>
          <Button
            onClick={handleSubmit}
            className='flex-1'
            disabled={!formData.title.trim() || !formData.content.trim()}
          >
            Save Changes
          </Button>
          <Button variant='outline' onClick={onClose} className='flex-1'>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
