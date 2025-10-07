import { firestore } from './firebase.config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

/**
 * Get a document from Firestore for a specific tiny and user
 * @param tinyCollection - The collection name from FIRESTORE_COLLECTIONS
 * @param userId - The user's ID
 * @returns The document data or null if it doesn't exist
 */
export async function getTinyData<T>(
  tinyCollection: string,
  userId: string,
): Promise<T | null> {
  try {
    const docRef = doc(firestore, tinyCollection, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as T;
    }
    return null;
  } catch (error) {
    console.error('Error getting tiny data:', error);
    return null;
  }
}

/**
 * Save data to Firestore for a specific tiny and user
 * @param tinyCollection - The collection name from FIRESTORE_COLLECTIONS
 * @param userId - The user's ID
 * @param data - The data to save
 */
export async function saveTinyData<T extends Record<string, unknown>>(
  tinyCollection: string,
  userId: string,
  data: T,
): Promise<void> {
  try {
    const docRef = doc(firestore, tinyCollection, userId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error('Error saving tiny data:', error);
    throw error;
  }
}

/**
 * Update specific fields in a Firestore document for a tiny and user
 * @param tinyCollection - The collection name from FIRESTORE_COLLECTIONS
 * @param userId - The user's ID
 * @param updates - Partial data to update
 */
export async function updateTinyData<T extends Record<string, unknown>>(
  tinyCollection: string,
  userId: string,
  updates: Partial<T>,
): Promise<void> {
  try {
    const docRef = doc(firestore, tinyCollection, userId);
    await updateDoc(docRef, updates as Record<string, unknown>);
  } catch (error) {
    console.error('Error updating tiny data:', error);
    throw error;
  }
}
