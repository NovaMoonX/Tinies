import { Tabs, TabsContent } from '@moondreamsdev/dreamer-ui/components';
import { useState, useMemo } from 'react';
import TinyPage from '@ui/layout/TinyPage';
import { Contact, Artifact, PersonalCrmFilters, ArtifactNote, RelationshipType, ArtifactType } from './PersonalCrm.types';
import { SAMPLE_CONTACTS, SAMPLE_ARTIFACTS } from './PersonalCrm.data';
import {
  filterContacts,
  filterArtifacts,
  generateId,
} from './PersonalCrm.utils';
import {
  ContactDetailsModal,
  AddContactModal,
  ArtifactDetailsModal,
  AddArtifactModal,
  ContactsTabContent,
  ArtifactsTabContent,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRelationshipTypes, setSelectedRelationshipTypes] = useState<RelationshipType[]>([]);
  const [selectedArtifactTypes, setSelectedArtifactTypes] = useState<ArtifactType[]>([]);

  const filteredContacts = useMemo(() => {
    const filters: PersonalCrmFilters = {
      searchQuery,
      selectedRelationshipTypes,
      view: 'contacts',
      selectedArtifactTypes: [],
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
    };
    const result = filterArtifacts(artifacts, filters);
    return result;
  }, [artifacts, searchQuery, selectedArtifactTypes]);

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
