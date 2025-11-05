import { storage } from './firebase.config';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';

/**
 * Upload a file to Firebase Storage
 * @param path - The storage path (e.g., 'tinies/car-maintenance/userId/fileId')
 * @param file - The file to upload
 * @param metadata - Optional metadata for the file
 * @returns The download URL of the uploaded file
 */
export async function uploadFile(
  path: string,
  file: File,
  metadata?: Record<string, string>,
): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const customMetadata = metadata || {};
    
    await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata,
    });

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Get the download URL for a file in Firebase Storage
 * @param path - The storage path
 * @returns The download URL of the file
 */
export async function getFileURL(path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
}

/**
 * Delete a file from Firebase Storage
 * @param path - The storage path
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * List all files in a directory
 * @param path - The directory path
 * @returns Array of file references
 */
export async function listFiles(path: string): Promise<string[]> {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    
    const fileURLs = await Promise.all(
      result.items.map((item) => getDownloadURL(item)),
    );
    
    return fileURLs;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

/**
 * Delete all files in a directory
 * @param path - The directory path
 */
export async function deleteDirectory(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    
    await Promise.all(
      result.items.map((item) => deleteObject(item)),
    );
  } catch (error) {
    console.error('Error deleting directory:', error);
    throw error;
  }
}
