import { useAuth } from '@hooks/useAuth';
import {
  FIREBASE_TINY_PATH,
  uploadFile,
  deleteFile,
} from '@lib/firebase';
import { useTinyDataLoader, useTinyDataSaver, withDefaults } from '@lib/tinies/tinies.hooks';
import { useCallback, useEffect, useState } from 'react';
import { Artifact, Contact, PersonalCrmData } from './PersonalCrm.types';
import {
  defaultArtifact,
  defaultArtifactComment,
  defaultContact,
  defaultContactNote,
  defaultEmail,
  defaultPersonalCrmData,
  defaultPhoneNumber,
} from './PersonalCrm.defaults';

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
        const normalizedContact = withDefaults(contact, defaultContact);
        return {
          ...normalizedContact,
          phones: normalizedContact.phones.map((phone) =>
            withDefaults(phone, defaultPhoneNumber),
          ),
          emails: normalizedContact.emails.map((email) =>
            withDefaults(email, defaultEmail),
          ),
          notes: normalizedContact.notes.map((note) =>
            withDefaults(note, defaultContactNote),
          ),
        };
      });
      
      // Normalize each individual artifact and its nested objects
      const normalizedArtifacts = normalized.artifacts.map((artifact) => {
        const normalizedArtifact = withDefaults(artifact, defaultArtifact);
        return {
          ...normalizedArtifact,
          comments: normalizedArtifact.comments.map((comment) =>
            withDefaults(comment, defaultArtifactComment),
          ),
        };
      });
      
      setContacts(normalizedContacts);
      setArtifacts(normalizedArtifacts);
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
