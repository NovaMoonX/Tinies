import { Tabs, TabsContent } from '@moondreamsdev/dreamer-ui/components';
import { useActionModal } from '@moondreamsdev/dreamer-ui/hooks';
import { useState, useMemo } from 'react';
import TinyPage from '@ui/layout/TinyPage';
import { Contact, Artifact, PersonalCrmFilters, ArtifactComment, RelationshipType, ArtifactType } from './PersonalCrm.types';
import { SAMPLE_CONTACTS, SAMPLE_ARTIFACTS } from './PersonalCrm.data';
import {
  filterContacts,
  filterArtifacts,
  generateId,
} from './PersonalCrm.utils';
import {
  ContactDetailsModal,
  AddContactModal,
  EditContactModal,
  ArtifactDetailsModal,
  AddArtifactModal,
  EditArtifactModal,
  ContactsTabContent,
  ArtifactsTabContent,
} from './PersonalCrm.components';

export function PersonalCrm() {
  const { confirm } = useActionModal();
  const [contacts, setContacts] = useState<Contact[]>(SAMPLE_CONTACTS);
  const [artifacts, setArtifacts] = useState<Artifact[]>(SAMPLE_ARTIFACTS);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false);
  const [isArtifactDetailsOpen, setIsArtifactDetailsOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isAddArtifactModalOpen, setIsAddArtifactModalOpen] = useState(false);
  const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);
  const [isEditArtifactModalOpen, setIsEditArtifactModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRelationshipTypes, setSelectedRelationshipTypes] = useState<RelationshipType[]>([]);
  const [selectedArtifactTypes, setSelectedArtifactTypes] = useState<ArtifactType[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  const filteredContacts = useMemo(() => {
    const filters: PersonalCrmFilters = {
      searchQuery,
      selectedRelationshipTypes,
      view: 'contacts',
      selectedArtifactTypes: [],
      selectedContactIds: [],
    };
    const result = filterContacts(contacts, filters);
    return result;
  }, [contacts, searchQuery, selectedRelationshipTypes]);

  const filteredArtifacts = useMemo(() => {
    const filters: PersonalCrmFilters = {
      searchQuery,
      selectedRelationshipTypes: [],
      view: 'artifacts',
      selectedArtifactTypes,
      selectedContactIds,
    };
    const result = filterArtifacts(artifacts, filters);
    return result;
  }, [artifacts, searchQuery, selectedArtifactTypes, selectedContactIds]);

  const handleAddContact = (contactData: Omit<Contact, 'id' | 'dateAdded'>) => {
    const newContact: Contact = {
      ...contactData,
      id: generateId('contact'),
      dateAdded: new Date().toISOString(),
    };

    setContacts([newContact, ...contacts]);
  };

  const handleDeleteContact = async (id: string) => {
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return;

    const confirmed = await confirm({
      title: 'Delete Contact',
      message: `Are you sure you want to delete ${contact.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
    });

    if (confirmed) {
      setContacts(contacts.filter((c) => c.id !== id));
      if (selectedContact?.id === id) {
        setSelectedContact(null);
        setIsContactDetailsOpen(false);
      }
    }
  };

  const handleEditContact = (id: string, updates: Partial<Contact>) => {
    setContacts(contacts.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    if (selectedContact?.id === id) {
      setSelectedContact({ ...selectedContact, ...updates });
    }
  };

  const handleAddNote = (contactId: string, noteText: string) => {
    const newNote = {
      id: generateId('note'),
      text: noteText,
      dateAdded: new Date().toISOString(),
    };

    setContacts(
      contacts.map((c) =>
        c.id === contactId ? { ...c, notes: [...c.notes, newNote] } : c
      )
    );

    if (selectedContact?.id === contactId) {
      setSelectedContact({
        ...selectedContact,
        notes: [...selectedContact.notes, newNote],
      });
    }
  };

  const handleEditNote = (contactId: string, noteId: string, newText: string) => {
    const updatedContacts = contacts.map((c) => {
      if (c.id === contactId) {
        const updatedNotes = c.notes.map((note) =>
          note.id === noteId ? { ...note, text: newText } : note
        );
        return { ...c, notes: updatedNotes };
      }
      return c;
    });

    setContacts(updatedContacts);

    if (selectedContact?.id === contactId) {
      const updatedNotes = selectedContact.notes.map((note) =>
        note.id === noteId ? { ...note, text: newText } : note
      );
      setSelectedContact({ ...selectedContact, notes: updatedNotes });
    }
  };

  const handleDeleteNote = async (contactId: string, noteId: string) => {
    const contact = contacts.find((c) => c.id === contactId);
    const note = contact?.notes.find((n) => n.id === noteId);
    
    if (!note) return;

    const confirmed = await confirm({
      title: 'Delete Note',
      description: 'Are you sure you want to delete this note? This action cannot be undone.',
      confirmLabel: 'Delete',
      variant: 'destructive',
    });

    if (!confirmed) return;

    const updatedContacts = contacts.map((c) => {
      if (c.id === contactId) {
        const filteredNotes = c.notes.filter((note) => note.id !== noteId);
        return { ...c, notes: filteredNotes };
      }
      return c;
    });

    setContacts(updatedContacts);

    if (selectedContact?.id === contactId) {
      const filteredNotes = selectedContact.notes.filter((note) => note.id !== noteId);
      setSelectedContact({ ...selectedContact, notes: filteredNotes });
    }
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsContactDetailsOpen(true);
  };

  const handleAddArtifact = (artifactData: Omit<Artifact, 'id' | 'dateAdded'>) => {
    const newArtifact: Artifact = {
      ...artifactData,
      id: generateId('artifact'),
      dateAdded: new Date().toISOString(),
    };

    setArtifacts([newArtifact, ...artifacts]);
  };

  const handleDeleteArtifact = async (id: string) => {
    const artifact = artifacts.find((a) => a.id === id);
    if (!artifact) return;

    const confirmed = await confirm({
      title: 'Delete Artifact',
      message: `Are you sure you want to delete "${artifact.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
    });

    if (confirmed) {
      setArtifacts(artifacts.filter((a) => a.id !== id));
      if (selectedArtifact?.id === id) {
        setSelectedArtifact(null);
        setIsArtifactDetailsOpen(false);
      }
    }
  };

  const handleEditArtifact = (id: string, updates: Partial<Artifact>) => {
    setArtifacts(artifacts.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    if (selectedArtifact?.id === id) {
      setSelectedArtifact({ ...selectedArtifact, ...updates });
    }
  };

  const handleArtifactClick = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setIsArtifactDetailsOpen(true);
  };

  const handleAddArtifactComment = (
    artifactId: string,
    commentData: Omit<ArtifactComment, 'id' | 'dateAdded'>
  ) => {
    const newComment: ArtifactComment = {
      ...commentData,
      id: `comment-${Date.now()}`,
      dateAdded: new Date().toISOString(),
    };

    const updatedArtifacts = artifacts.map((a) =>
        a.id === artifactId ? { ...a, comments: [...a.comments, newComment] } : a
    );
    setArtifacts(updatedArtifacts);

    // Update selected artifact if it's currently open
    if (selectedArtifact && selectedArtifact.id === artifactId) {
      setSelectedArtifact({
        ...selectedArtifact,
        comments: [...selectedArtifact.comments, newComment],
      });
    }
  };

  return (
    <TinyPage
      title='👥 Personal CRM'
      description='Manage your personal and professional relationships. Track contacts, save artifacts (links, notes, photos), and remember the important details that make relationships meaningful.'
    >
      {/* Stats */}
      <div className='bg-muted/30 rounded-2xl p-6'>
        <div className='flex flex-col items-center justify-between'>
          <div className='flex gap-8'>
            <div className='text-center'>
              <div className='mb-1 text-3xl sm:text-4xl font-bold'>{contacts.length}</div>
              <div className='text-foreground/60 text-sm sm:text-base'>Contacts</div>
            </div>
            <div className='text-center'>
              <div className='mb-1 text-3xl sm:text-4xl font-bold'>{artifacts.length}</div>
              <div className='text-foreground/60 text-sm sm:text-base'>Artifacts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue='contacts'
        variant='underline'
        tabsList={[
          { value: 'contacts', label: '👤 Contacts' },
          { value: 'artifacts', label: '📦 Artifacts' },
        ]}
        tabsWidth='full'
      >
        <TabsContent value='contacts'>
          <ContactsTabContent
            contacts={filteredContacts}
            allContacts={contacts}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedRelationshipTypes={selectedRelationshipTypes}
            onRelationshipTypesChange={setSelectedRelationshipTypes}
            onAddContact={() => setIsAddContactModalOpen(true)}
            onContactClick={handleContactClick}
            onDeleteContact={handleDeleteContact}
          />
        </TabsContent>

        <TabsContent value='artifacts'>
          <ArtifactsTabContent
            artifacts={filteredArtifacts}
            allArtifacts={artifacts}
            contacts={contacts}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedArtifactTypes={selectedArtifactTypes}
            onArtifactTypesChange={setSelectedArtifactTypes}
            selectedContactIds={selectedContactIds}
            onContactIdsChange={setSelectedContactIds}
            onAddArtifact={() => setIsAddArtifactModalOpen(true)}
            onArtifactClick={handleArtifactClick}
            onDeleteArtifact={handleDeleteArtifact}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ContactDetailsModal
        contact={selectedContact}
        isOpen={isContactDetailsOpen}
        onClose={() => setIsContactDetailsOpen(false)}
        onEdit={() => {
          setIsContactDetailsOpen(false);
          setIsEditContactModalOpen(true);
        }}
        onDelete={handleDeleteContact}
        onAddNote={handleAddNote}
        onEditNote={handleEditNote}
        onDeleteNote={handleDeleteNote}
      />

      <ArtifactDetailsModal
        artifact={selectedArtifact}
        isOpen={isArtifactDetailsOpen}
        onClose={() => setIsArtifactDetailsOpen(false)}
        onEdit={() => {
          setIsArtifactDetailsOpen(false);
          setIsEditArtifactModalOpen(true);
        }}
        onDelete={handleDeleteArtifact}
        contacts={contacts}
        onAddComment={handleAddArtifactComment}
      />

      <AddContactModal
        isOpen={isAddContactModalOpen}
        onClose={() => setIsAddContactModalOpen(false)}
        onAdd={handleAddContact}
      />

      <EditContactModal
        isOpen={isEditContactModalOpen}
        onClose={() => setIsEditContactModalOpen(false)}
        contact={selectedContact}
        onSave={(updates) => {
          if (selectedContact) {
            handleEditContact(selectedContact.id, updates);
            setIsEditContactModalOpen(false);
          }
        }}
      />

      <AddArtifactModal
        isOpen={isAddArtifactModalOpen}
        onClose={() => setIsAddArtifactModalOpen(false)}
        onAdd={handleAddArtifact}
      />

      <EditArtifactModal
        isOpen={isEditArtifactModalOpen}
        onClose={() => setIsEditArtifactModalOpen(false)}
        artifact={selectedArtifact}
        onSave={(updates) => {
          if (selectedArtifact) {
            handleEditArtifact(selectedArtifact.id, updates);
            setIsEditArtifactModalOpen(false);
          }
        }}
      />
    </TinyPage>
  );
}

export default PersonalCrm;
