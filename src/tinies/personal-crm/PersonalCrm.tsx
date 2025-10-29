import { Button } from '@moondreamsdev/dreamer-ui/components';
import { Plus } from '@moondreamsdev/dreamer-ui/symbols';
import { useState, useMemo } from 'react';
import TinyPage from '@ui/layout/TinyPage';
import { Contact, Artifact, PersonalCrmFilters, ArtifactNote } from './PersonalCrm.types';
import { SAMPLE_CONTACTS, SAMPLE_ARTIFACTS } from './PersonalCrm.data';
import {
  filterContacts,
  filterArtifacts,
  generateId,
} from './PersonalCrm.utils';
import {
  ContactCard,
  ContactDetailsModal,
  AddContactModal,
  ArtifactCard,
  ArtifactDetailsModal,
  AddArtifactModal,
  FilterSection,
} from './PersonalCrm.components';

export function PersonalCrm() {
  const [contacts, setContacts] = useState<Contact[]>(SAMPLE_CONTACTS);
  const [artifacts, setArtifacts] = useState<Artifact[]>(SAMPLE_ARTIFACTS);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false);
  const [isArtifactDetailsOpen, setIsArtifactDetailsOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isAddArtifactModalOpen, setIsAddArtifactModalOpen] = useState(false);
  const [filters, setFilters] = useState<PersonalCrmFilters>({
    searchQuery: '',
    selectedRelationshipTypes: [],
    view: 'contacts',
    selectedArtifactTypes: [],
  });

  const filteredContacts = useMemo(() => {
    const result = filterContacts(contacts, filters);
    return result;
  }, [contacts, filters]);

  const filteredArtifacts = useMemo(() => {
    const result = filterArtifacts(artifacts, filters);
    return result;
  }, [artifacts, filters]);

  const handleAddContact = (contactData: Omit<Contact, 'id' | 'dateAdded'>) => {
    const newContact: Contact = {
      ...contactData,
      id: generateId('contact'),
      dateAdded: new Date().toISOString(),
    };

    setContacts([newContact, ...contacts]);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
    if (selectedContact?.id === id) {
      setSelectedContact(null);
      setIsContactDetailsOpen(false);
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

  const handleDeleteArtifact = (id: string) => {
    setArtifacts(artifacts.filter((a) => a.id !== id));
    if (selectedArtifact?.id === id) {
      setSelectedArtifact(null);
      setIsArtifactDetailsOpen(false);
    }
  };

  const handleArtifactClick = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setIsArtifactDetailsOpen(true);
  };

  const handleAddArtifactNote = (
    artifactId: string,
    noteData: Omit<ArtifactNote, 'id' | 'dateAdded'>
  ) => {
    const newNote: ArtifactNote = {
      ...noteData,
      id: generateId('note'),
      dateAdded: new Date().toISOString(),
    };

    setArtifacts(
      artifacts.map((a) =>
        a.id === artifactId ? { ...a, notes: [...a.notes, newNote] } : a
      )
    );

    // Update selected artifact if it's the same one
    if (selectedArtifact?.id === artifactId) {
      setSelectedArtifact({
        ...selectedArtifact,
        notes: [...selectedArtifact.notes, newNote],
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
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <div className='flex gap-8'>
            <div className='text-center sm:text-left'>
              <div className='mb-1 text-3xl font-bold'>{contacts.length}</div>
              <div className='text-foreground/60 text-sm'>Contacts</div>
            </div>
            <div className='text-center sm:text-left'>
              <div className='mb-1 text-3xl font-bold'>{artifacts.length}</div>
              <div className='text-foreground/60 text-sm'>Artifacts</div>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button onClick={() => setIsAddContactModalOpen(true)}>
              <Plus className='h-5 w-5' />
              Add Contact
            </Button>
            <Button onClick={() => setIsAddArtifactModalOpen(true)} variant='secondary'>
              <Plus className='h-5 w-5' />
              Add Artifact
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterSection
        filters={filters}
        onFiltersChange={setFilters}
        totalContacts={contacts.length}
        totalArtifacts={artifacts.length}
        filteredCount={
          filters.view === 'contacts' ? filteredContacts.length : filteredArtifacts.length
        }
      />

      {/* Content Grid */}
      {filters.view === 'contacts' ? (
        <>
          {filteredContacts.length > 0 ? (
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {filteredContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onClick={() => handleContactClick(contact)}
                  onDelete={handleDeleteContact}
                />
              ))}
            </div>
          ) : (
            <div className='bg-muted/30 rounded-2xl p-12 text-center'>
              <p className='text-foreground/60 mb-4'>
                {filters.searchQuery ||
                filters.selectedRelationshipTypes.length > 0
                  ? 'No contacts match your filters.'
                  : 'No contacts yet. Add your first contact to get started!'}
              </p>
              <Button onClick={() => setIsAddContactModalOpen(true)}>
                <Plus className='h-5 w-5' />
                Add Your First Contact
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          {filteredArtifacts.length > 0 ? (
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {filteredArtifacts.map((artifact) => (
                <ArtifactCard
                  key={artifact.id}
                  artifact={artifact}
                  contacts={contacts}
                  onClick={() => handleArtifactClick(artifact)}
                  onDelete={handleDeleteArtifact}
                />
              ))}
            </div>
          ) : (
            <div className='bg-muted/30 rounded-2xl p-12 text-center'>
              <p className='text-foreground/60 mb-4'>
                {filters.searchQuery || filters.selectedArtifactTypes.length > 0
                  ? 'No artifacts match your filters.'
                  : 'No artifacts yet. Add your first artifact to get started!'}
              </p>
              <Button onClick={() => setIsAddArtifactModalOpen(true)}>
                <Plus className='h-5 w-5' />
                Add Your First Artifact
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <ContactDetailsModal
        contact={selectedContact}
        isOpen={isContactDetailsOpen}
        onClose={() => setIsContactDetailsOpen(false)}
        onEdit={() => {
          // TODO: Implement edit functionality
          setIsContactDetailsOpen(false);
        }}
        onDelete={handleDeleteContact}
        artifacts={artifacts}
      />

      <ArtifactDetailsModal
        artifact={selectedArtifact}
        isOpen={isArtifactDetailsOpen}
        onClose={() => setIsArtifactDetailsOpen(false)}
        onDelete={handleDeleteArtifact}
        contacts={contacts}
        onAddNote={handleAddArtifactNote}
      />

      <AddContactModal
        isOpen={isAddContactModalOpen}
        onClose={() => setIsAddContactModalOpen(false)}
        onAdd={handleAddContact}
      />

      <AddArtifactModal
        isOpen={isAddArtifactModalOpen}
        onClose={() => setIsAddArtifactModalOpen(false)}
        onAdd={handleAddArtifact}
      />
    </TinyPage>
  );
}

export default PersonalCrm;
