import { useAuth } from '@hooks/useAuth';
import {
  DATABASE_PATHS,
  STORAGE_PATHS,
  getTinyData,
  saveTinyData,
  uploadFile,
  deleteFile,
} from '@lib/firebase';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Contact, Artifact, PersonalCrmData } from './PersonalCrm.types';

export function usePersonalCrmData() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetData = useCallback(() => {
    setContacts([]);
    setArtifacts([]);
  }, []);

  // Load data from Firebase on mount
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoaded(true);
        return;
      }

      try {
        const data = await getTinyData<PersonalCrmData>(
          DATABASE_PATHS.PERSONAL_CRM,
          user.uid,
        );

        if (data) {
          setContacts(data.contacts || []);
          setArtifacts(data.artifacts || []);
        }
      } catch (error) {
        console.error('Error loading personal CRM data:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    if (!user) {
      resetData();
    }

    loadData();
  }, [user, resetData]);

  // Save data to Firebase with debouncing
  useEffect(() => {
    if (!isLoaded || !user) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      const dataToSave: PersonalCrmData = {
        contacts,
        artifacts,
      };

      saveTinyData(DATABASE_PATHS.PERSONAL_CRM, user.uid, dataToSave).catch(
        (error) => {
          console.error('Error saving personal CRM data:', error);
        },
      );
    }, 2000);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [contacts, artifacts, isLoaded, user]);

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
