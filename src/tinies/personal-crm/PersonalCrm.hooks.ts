import { useAuth } from '@hooks/useAuth';
import {
  FIREBASE_TINY_PATH,
  uploadFile,
  deleteFile,
} from '@lib/firebase';
import { useTinyDataLoader, useTinyDataSaver, withDefaults } from '@lib/tinies/tinies.hooks';
import { useCallback, useEffect, useState } from 'react';
import { Contact, Artifact, PersonalCrmData, PhoneNumber, Email, ContactNote, ArtifactComment } from './PersonalCrm.types';

const defaultPersonalCrmData: PersonalCrmData = {
  contacts: [],
  artifacts: [],
};

const defaultPhoneNumber: PhoneNumber = {
  id: '',
  label: '',
  number: '',
};

const defaultEmail: Email = {
  id: '',
  label: '',
  address: '',
};

const defaultContactNote: ContactNote = {
  id: '',
  text: '',
  dateAdded: '',
};

const defaultContact: Contact = {
  id: '',
  name: '',
  phones: [],
  emails: [],
  birthday: null,
  relationshipType: 'other',
  notes: [],
  interestingFacts: [],
  likes: [],
  dislikes: [],
  avatarUrl: null,
  dateAdded: '',
};

const defaultArtifactComment: ArtifactComment = {
  id: '',
  text: '',
  contactId: '',
  dateAdded: '',
};

const defaultArtifact: Artifact = {
  id: '',
  type: 'text',
  title: '',
  content: '',
  description: '',
  contactIds: [],
  comments: [],
  dateAdded: '',
  tags: [],
};

export function usePersonalCrmData() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);

  const resetData = useCallback(() => {
    setContacts([]);
    setArtifacts([]);
  }, []);

  // Load data from Firebase on mount
  const { data: loadedData, isLoaded } = useTinyDataLoader<PersonalCrmData>(
    FIREBASE_TINY_PATH.PERSONAL_CRM,
    resetData,
  );

  // Update local state when data is loaded
  useEffect(() => {
    if (loadedData) {
      const normalized = withDefaults(loadedData, defaultPersonalCrmData);
      
      // Normalize each individual contact and its nested objects
      const normalizedContacts = normalized.contacts.map((contact) => {
        const normalizedContact = withDefaults(
          contact as Partial<Contact> as Partial<Record<string, unknown>>,
          defaultContact as unknown as Record<string, unknown>,
        );
        return {
          ...normalizedContact,
          phones: (normalizedContact.phones as PhoneNumber[]).map((phone) =>
            withDefaults(
              phone as Partial<PhoneNumber> as Partial<Record<string, unknown>>,
              defaultPhoneNumber as unknown as Record<string, unknown>,
            ),
          ),
          emails: (normalizedContact.emails as Email[]).map((email) =>
            withDefaults(
              email as Partial<Email> as Partial<Record<string, unknown>>,
              defaultEmail as unknown as Record<string, unknown>,
            ),
          ),
          notes: (normalizedContact.notes as ContactNote[]).map((note) =>
            withDefaults(
              note as Partial<ContactNote> as Partial<Record<string, unknown>>,
              defaultContactNote as unknown as Record<string, unknown>,
            ),
          ),
        };
      });
      
      // Normalize each individual artifact and its nested objects
      const normalizedArtifacts = normalized.artifacts.map((artifact) => {
        const normalizedArtifact = withDefaults(
          artifact as Partial<Artifact> as Partial<Record<string, unknown>>,
          defaultArtifact as unknown as Record<string, unknown>,
        );
        return {
          ...normalizedArtifact,
          comments: (normalizedArtifact.comments as ArtifactComment[]).map((comment) =>
            withDefaults(
              comment as Partial<ArtifactComment> as Partial<Record<string, unknown>>,
              defaultArtifactComment as unknown as Record<string, unknown>,
            ),
          ),
        };
      });
      
      setContacts(normalizedContacts as unknown as Contact[]);
      setArtifacts(normalizedArtifacts as unknown as Artifact[]);
    }
  }, [loadedData]);

  // Save data to Firebase with debouncing
  const dataToSave: PersonalCrmData = {
    contacts,
    artifacts,
  };
  useTinyDataSaver(FIREBASE_TINY_PATH.PERSONAL_CRM, dataToSave, isLoaded);

  // Upload avatar image
  const uploadAvatar = useCallback(
    async (contactId: string, file: File): Promise<string> => {
      if (!user) throw new Error('User not authenticated');

      const path = `tinies/${FIREBASE_TINY_PATH.PERSONAL_CRM}/${user.uid}/avatars/${contactId}/${file.name}`;
      const downloadURL = await uploadFile(path, file);
      return downloadURL;
    },
    [user],
  );

  // Delete avatar image
  const deleteAvatar = useCallback(
    async (avatarUrl: string): Promise<void> => {
      if (!user) return;

      try {
        const urlObj = new URL(avatarUrl);
        const pathMatch = urlObj.pathname.match(/\/o\/(.+)/);
        if (pathMatch) {
          const encodedPath = pathMatch[1].split('?')[0];
          const path = decodeURIComponent(encodedPath);
          await deleteFile(path);
        }
      } catch (error) {
        console.error('Error deleting avatar:', error);
      }
    },
    [user],
  );

  // Upload artifact file
  const uploadArtifactFile = useCallback(
    async (artifactId: string, file: File): Promise<string> => {
      if (!user) throw new Error('User not authenticated');

      const path = `tinies/${FIREBASE_TINY_PATH.PERSONAL_CRM}/${user.uid}/artifacts/${artifactId}/${file.name}`;
      const downloadURL = await uploadFile(path, file);
      return downloadURL;
    },
    [user],
  );

  // Delete artifact file
  const deleteArtifactFile = useCallback(
    async (fileUrl: string): Promise<void> => {
      if (!user) return;

      try {
        const urlObj = new URL(fileUrl);
        const pathMatch = urlObj.pathname.match(/\/o\/(.+)/);
        if (pathMatch) {
          const encodedPath = pathMatch[1].split('?')[0];
          const path = decodeURIComponent(encodedPath);
          await deleteFile(path);
        }
      } catch (error) {
        console.error('Error deleting artifact file:', error);
      }
    },
    [user],
  );

  return {
    contacts,
    setContacts,
    artifacts,
    setArtifacts,
    uploadAvatar,
    deleteAvatar,
    uploadArtifactFile,
    deleteArtifactFile,
  };
}
