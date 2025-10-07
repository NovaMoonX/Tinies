import { database } from './firebase.config';
import { ref, get, set, update } from 'firebase/database';

/**
 * Get data from Firebase Realtime Database for a specific tiny and user
 * @param tinyPath - The path name from DATABASE_PATHS
 * @param userId - The user's ID
 * @returns The data or null if it doesn't exist
 */
export async function getTinyData<T>(
  tinyPath: string,
  userId: string,
): Promise<T | null> {
  try {
    const dataRef = ref(database, `${tinyPath}/${userId}`);
    const snapshot = await get(dataRef);

    if (snapshot.exists()) {
      return snapshot.val() as T;
    }
    return null;
  } catch (error) {
    console.error('Error getting tiny data:', error);
    return null;
  }
}

/**
 * Save data to Firebase Realtime Database for a specific tiny and user
 * @param tinyPath - The path name from DATABASE_PATHS
 * @param userId - The user's ID
 * @param data - The data to save
 */
export async function saveTinyData<T extends Record<string, unknown>>(
  tinyPath: string,
  userId: string,
  data: T,
): Promise<void> {
  try {
    const dataRef = ref(database, `${tinyPath}/${userId}`);
    await set(dataRef, data);
  } catch (error) {
    console.error('Error saving tiny data:', error);
    throw error;
  }
}

/**
 * Update specific fields in Firebase Realtime Database for a tiny and user
 * @param tinyPath - The path name from DATABASE_PATHS
 * @param userId - The user's ID
 * @param updates - Partial data to update
 */
export async function updateTinyData<T extends Record<string, unknown>>(
  tinyPath: string,
  userId: string,
  updates: Partial<T>,
): Promise<void> {
  try {
    const dataRef = ref(database, `${tinyPath}/${userId}`);
    await update(dataRef, updates as Record<string, unknown>);
  } catch (error) {
    console.error('Error updating tiny data:', error);
    throw error;
  }
}
