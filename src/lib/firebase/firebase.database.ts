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
    const dataRef = ref(database, `tinies/${tinyPath}/${userId}`);
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
    const dataRef = ref(database, `tinies/${tinyPath}/${userId}`);
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
    const dataRef = ref(database, `tinies/${tinyPath}/${userId}`);
    await update(dataRef, updates as Record<string, unknown>);
  } catch (error) {
    console.error('Error updating tiny data:', error);
    throw error;
  }
}

/**
 * Save a tiny visit timestamp for a user
 * @param tinyId - The tiny's ID
 * @param userId - The user's ID
 */
export async function saveTinyVisit(
  tinyId: string,
  userId: string,
): Promise<void> {
  try {
    const visitRef = ref(database, `tiny-visits/${userId}/${tinyId}`);
    await set(visitRef, { lastVisitedAt: Date.now() });
  } catch (error) {
    console.error('Error saving tiny visit:', error);
    throw error;
  }
}

/**
 * Get all tiny visits for a user
 * @param userId - The user's ID
 * @returns Map of tiny IDs to visit timestamps
 */
export async function getTinyVisits(
  userId: string,
): Promise<Record<string, { lastVisitedAt: number }> | null> {
  try {
    const visitsRef = ref(database, `tiny-visits/${userId}`);
    const snapshot = await get(visitsRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('Error getting tiny visits:', error);
    return null;
  }
}
