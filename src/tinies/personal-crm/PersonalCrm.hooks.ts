import { useAuth } from '@hooks/useAuth';
import {
  DATABASE_PATHS,
  STORAGE_PATHS,
  uploadFile,
  deleteFile,
} from '@lib/firebase';
import { useTinyDataLoader, useTinyDataSaver } from '@lib/tinies/tinies.hooks';
import { useCallback, useEffect, useState } from 'react';
import { Contact, Artifact, PersonalCrmData } from './PersonalCrm.types';

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
    DATABASE_PATHS.PERSONAL_CRM,
    resetData,
  );

  // Update local state when data is loaded
  useEffect(() => {
    if (loadedData) {
      setContacts(loadedData.contacts || []);
      setArtifacts(loadedData.artifacts || []);
    }
  }, [loadedData]);

  // Save data to Firebase with debouncing
  const dataToSave: PersonalCrmData = {
    contacts,
    artifacts,
  };
  useTinyDataSaver(DATABASE_PATHS.PERSONAL_CRM, dataToSave, isLoaded);

  // Upload avatar image
  const uploadAvatar = useCallback(
    async (contactId: string, file: File): Promise<string> => {
      if (!user) throw new Error('User not authenticated');

      const path = `tinies/${STORAGE_PATHS.PERSONAL_CRM}/${user.uid}/avatars/${contactId}/${file.name}`;
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

      const path = `tinies/${STORAGE_PATHS.PERSONAL_CRM}/${user.uid}/artifacts/${artifactId}/${file.name}`;
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
