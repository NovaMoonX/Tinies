# Persisting Tiny Data in the Cloud with Firebase

This document provides guidelines for implementing cloud data persistence in tinies using Firebase Realtime Database and Firebase Storage.

## Overview

All tinies should persist their data to Firebase to provide users with a seamless experience across sessions and devices. This involves:

1. **Firebase Realtime Database** - For storing structured data (JSON)
2. **Firebase Storage** - For storing files and images

## Firebase Realtime Database

### Step 1: Define Your Data Type

Create a data interface in your tiny's `.types.ts` file that extends `Record<string, unknown>`:

```typescript
export interface MyTinyData extends Record<string, unknown> {
  items: Item[];
  selectedId: string | null;
  customSettings: Settings;
}
```

**Important:** Never use `undefined` fields in your types. Use `null` instead.

### Step 2: Add Database Path

Add your tiny's database path to `src/lib/firebase/firebase.const.ts`:

```typescript
export const DATABASE_PATHS = {
  // ... existing paths
  MY_TINY: 'my-tiny',
} as const;
```

### Step 3: Create a Hooks File

Create a `.hooks.ts` file for your tiny that handles Firebase persistence. Reference the Apartment Tour Questions tiny as an example:

```typescript
import { useAuth } from '@hooks/useAuth';
import { DATABASE_PATHS, getTinyData, saveTinyData } from '@lib/firebase';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MyTinyData, Item } from './MyTiny.types';

export function useMyTinyData() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetData = useCallback(() => {
    setItems([]);
    setSelectedId(null);
  }, []);

  // Load data from Firebase on mount
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoaded(true);
        return;
      }

      try {
        const data = await getTinyData<MyTinyData>(
          DATABASE_PATHS.MY_TINY,
          user.uid,
        );

        if (data) {
          setItems(data.items || []);
          setSelectedId(data.selectedId || null);
        }
      } catch (error) {
        console.error('Error loading my tiny data:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    if (!user) {
      resetData();
    }

    loadData();
  }, [user, resetData]);

  // Save data to Firebase with debouncing (2 seconds)
  useEffect(() => {
    if (!isLoaded || !user) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      const dataToSave: MyTinyData = {
        items,
        selectedId,
      };

      saveTinyData(DATABASE_PATHS.MY_TINY, user.uid, dataToSave).catch(
        (error) => {
          console.error('Error saving my tiny data:', error);
        },
      );
    }, 2000);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [items, selectedId, isLoaded, user]);

  return {
    items,
    setItems,
    selectedId,
    setSelectedId,
  };
}
```

### Step 4: Use the Hook in Your Main Component

Update your main component to use the new hook:

```typescript
import { useMyTinyData } from './MyTiny.hooks';

export function MyTiny() {
  const { items, setItems, selectedId, setSelectedId } = useMyTinyData();
  
  // Rest of your component logic...
}
```

## Firebase Storage

For tinies that need to store files or images, use Firebase Storage.

### Step 1: Add Storage Path

Add your tiny's storage path to `src/lib/firebase/firebase.const.ts`:

```typescript
export const STORAGE_PATHS = {
  // ... existing paths
  MY_TINY: 'my-tiny',
} as const;
```

### Step 2: Add File Upload/Delete Methods to Your Hook

Extend your hooks file with file upload and delete functionality:

```typescript
import {
  DATABASE_PATHS,
  STORAGE_PATHS,
  getTinyData,
  saveTinyData,
  uploadFile,
  deleteFile,
} from '@lib/firebase';

export function useMyTinyData() {
  // ... existing state and effects

  // Upload file to Firebase Storage
  const uploadItemImage = useCallback(
    async (itemId: string, file: File): Promise<string> => {
      if (!user) throw new Error('User not authenticated');

      const path = \`tinies/\${STORAGE_PATHS.MY_TINY}/\${user.uid}/\${itemId}/\${file.name}\`;
      const downloadURL = await uploadFile(path, file);
      return downloadURL;
    },
    [user],
  );

  // Delete file from Firebase Storage
  const deleteItemImage = useCallback(
    async (imageUrl: string): Promise<void> => {
      if (!user) return;

      try {
        // Extract path from Firebase Storage URL
        const urlObj = new URL(imageUrl);
        const pathMatch = urlObj.pathname.match(/\\/o\\/(.+)/);
        if (pathMatch) {
          const encodedPath = pathMatch[1].split('?')[0];
          const path = decodeURIComponent(encodedPath);
          await deleteFile(path);
        }
      } catch (error) {
        console.error('Error deleting item image:', error);
      }
    },
    [user],
  );

  return {
    items,
    setItems,
    uploadItemImage,
    deleteItemImage,
  };
}
```

### Available Storage Functions

The following functions are available from `@lib/firebase`:

- **uploadFile(path, file, metadata?)** - Upload a file and get its download URL
- **getFileURL(path)** - Get the download URL for a file
- **deleteFile(path)** - Delete a file
- **listFiles(path)** - List all files in a directory
- **deleteDirectory(path)** - Delete all files in a directory

## Best Practices

### 1. Debouncing

Always debounce save operations to avoid excessive writes to Firebase. The standard debounce time is **2 seconds**.

### 2. Loading State

Track loading state with `isLoaded` to prevent saving data before the initial load completes.

### 3. User Authentication

Always check if the user is authenticated before loading or saving data:

```typescript
if (!user) {
  setIsLoaded(true);
  return;
}
```

### 4. Reset on Logout

Reset all data when the user logs out:

```typescript
if (!user) {
  resetData();
}
```

### 5. Error Handling

Always catch and log errors from Firebase operations:

```typescript
try {
  await saveTinyData(path, userId, data);
} catch (error) {
  console.error('Error saving data:', error);
}
```

### 6. File Path Structure

Use a consistent structure for file paths:

```
tinies/{STORAGE_PATH}/{userId}/{entityId}/{fileName}
```

Example:
```
tinies/car-maintenance/user123/service-456/receipt.pdf
```

### 7. Cleanup on Delete

When deleting entities that have associated files, always delete the files from Storage:

```typescript
const deleteItem = async (itemId: string) => {
  const item = items.find(i => i.id === itemId);
  
  // Delete associated files
  if (item?.imageUrl) {
    await deleteItemImage(item.imageUrl);
  }
  
  // Delete from state
  setItems(items.filter(i => i.id !== itemId));
};
```

## Data Structure in Firebase

Your data will be stored in Firebase Realtime Database at:

```
/tinies/{tiny-path}/{userId}
```

For example:
```
/tinies/car-maintenance/user123
  {
    cars: [...],
    serviceEntries: [...],
    selectedCar: "car-456"
  }
```

## Migration Guide

If you have an existing tiny without Firebase persistence:

1. Define your data type
2. Add database and storage paths to constants
3. Create a hooks file with Firebase integration
4. Update your main component to use the new hook
5. Test that data persists across page refreshes
6. Test that data resets when user logs out

## Examples

For complete examples, refer to these tinies:

- **Apartment Tour Questions** - Full Firebase Realtime Database integration
- **Car Maintenance** - Firebase Realtime Database + Storage for file attachments
- **Travel Tracker** - Firebase Realtime Database + Storage for photos
- **Recipe Book** - Firebase Realtime Database with support for image uploads
- **Personal CRM** - Firebase Realtime Database + Storage for avatars and artifact files
- **Notes** - Simple Firebase Realtime Database integration
