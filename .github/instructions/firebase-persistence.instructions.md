# Persisting Tiny Data in the Cloud with Firebase

This document provides guidelines for implementing cloud data persistence in tinies using Firebase Realtime Database and Firebase Storage.

## Overview

All tinies should persist their data to Firebase to provide users with a seamless experience across sessions and devices. This involves:

1. **Firebase Realtime Database** - For storing structured data (JSON)
2. **Firebase Storage** - For storing files and images
3. **Reusable Hooks** - Centralized persistence logic via `useTinyDataLoader` and `useTinyDataSaver`

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

### Step 2: Add Firebase Path

Add your tiny's path to `src/lib/firebase/firebase.const.ts`:

```typescript
export const FIREBASE_TINY_PATH = {
  // ... existing paths
  MY_TINY: 'my-tiny',
} as const;
```

This path is used for both Database and Storage operations.

### Step 3: Create a Defaults File

Create a `.defaults.ts` file with default values for all data objects. This is required for proper data normalization when loading from Firebase.

**File:** `MyTiny.defaults.ts`

```typescript
import { MyTinyData, Item } from './MyTiny.types';

export const defaultMyTinyData: MyTinyData = {
  items: [],
  selectedId: null,
  customSettings: {
    theme: 'light',
    notifications: true,
  },
};

export const defaultItem: Item = {
  id: '',
  name: '',
  description: '',
  createdAt: '',
  tags: [],
};
```

This file should export default values for every field in your data type. These defaults will be used with the `withDefaults()` utility to ensure all fields are present even when Firebase doesn't return certain fields.

### Step 4: Create a Hooks File

Create a `.hooks.ts` file for your tiny that uses the reusable Firebase hooks:

```typescript
import { FIREBASE_TINY_PATH } from '@lib/firebase';
import { useTinyDataLoader, useTinyDataSaver, withDefaults } from '@lib/tinies/tinies.hooks';
import { useCallback, useEffect, useState } from 'react';
import { defaultItem, defaultMyTinyData } from './MyTiny.defaults';
import { MyTinyData, Item } from './MyTiny.types';

export function useMyTinyData() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const resetData = useCallback(() => {
    setItems([]);
    setSelectedId(null);
  }, []);

  // Load data from Firebase on mount
  const { data: loadedData, isLoaded } = useTinyDataLoader<MyTinyData>(
    FIREBASE_TINY_PATH.MY_TINY,
    resetData,
  );

  // Update local state when data is loaded
  useEffect(() => {
    if (loadedData) {
      const normalized = withDefaults(loadedData, defaultMyTinyData);
      // Normalize nested items if needed
      const normalizedItems = normalized.items.map((item) =>
        withDefaults<Item>(item, defaultItem),
      );
      setItems(normalizedItems);
      setSelectedId(normalized.selectedId);
    }
  }, [loadedData]);

  // Save data to Firebase with debouncing
  const dataToSave: MyTinyData = {
    items,
    selectedId,
  };
  useTinyDataSaver(FIREBASE_TINY_PATH.MY_TINY, dataToSave, isLoaded);

  return {
    items,
    setItems,
    selectedId,
    setSelectedId,
  };
}
```

### Step 5: Use the Hook in Your Main Component

Update your main component to use the new hook:

```typescript
import { useMyTinyData } from './MyTiny.hooks';

export function MyTiny() {
  const { items, setItems, selectedId, setSelectedId } = useMyTinyData();
  
  // Rest of your component logic...
}
```

## Handling Missing Fields

Firebase may not return fields that were never set or contain `undefined` values. Always provide default values when extracting data:

```typescript
import { withDefaults } from '@lib/withDefaults';
import { defaultMyTinyData, defaultItem } from './MyTiny.data';

useEffect(() => {
  if (loadedData) {
    // Normalize loaded data using withDefaults to ensure all fields are present
    const normalized = withDefaults(loadedData, defaultMyTinyData);

    // If you have nested arrays/objects, normalize them as well
    const normalizedItems = normalized.items.map((item) =>
      withDefaults(item, defaultItem),
    );
    setItems(normalizedItems);

    setSelectedId(normalized.selectedId);
    setSettings(normalized.customSettings);
    setName(normalized.name);
    setCompleted(normalized.completed);
    setEnabled(normalized.enabled);
  }
}, [loadedData]);
```

## Firebase Storage

For tinies that need to store files or images, use Firebase Storage.

### Step 1: Import Storage Functions

The storage path uses the same `FIREBASE_TINY_PATH` constant:

```typescript
import { useAuth } from '@hooks/useAuth';
import {
  FIREBASE_TINY_PATH,
  uploadFile,
  deleteFile,
} from '@lib/firebase';
```

### Step 2: Add File Upload/Delete Methods to Your Hook

Extend your hooks file with file upload and delete functionality:

```typescript
export function useMyTinyData() {
  const { user } = useAuth();
  // ... existing state and hooks

  // Upload file to Firebase Storage
  const uploadItemImage = useCallback(
    async (itemId: string, file: File): Promise<string> => {
      if (!user) throw new Error('User not authenticated');

      const path = `tinies/${FIREBASE_TINY_PATH.MY_TINY}/${user.uid}/${itemId}/${file.name}`;
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
        const pathMatch = urlObj.pathname.match(/\/o\/(.+)/);
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

## Reusable Hooks

### useTinyDataLoader

Loads data from Firebase Realtime Database with proper authentication and error handling.

```typescript
const { data: loadedData, isLoaded } = useTinyDataLoader<MyTinyData>(
  FIREBASE_TINY_PATH.MY_TINY,
  resetData,
);
```

**Parameters:**
- `tinyPath` - Path from `FIREBASE_TINY_PATH` constant
- `resetData` - Callback to reset local state when user logs out

**Returns:**
- `data` - The loaded data (or null if not loaded yet)
- `isLoaded` - Boolean indicating if the initial load is complete

### useTinyDataSaver

Saves data to Firebase Realtime Database with automatic debouncing.

```typescript
const dataToSave: MyTinyData = { items, selectedId };
useTinyDataSaver(FIREBASE_TINY_PATH.MY_TINY, dataToSave, isLoaded);
```

**Parameters:**
- `tinyPath` - Path from `FIREBASE_TINY_PATH` constant
- `data` - The data object to save
- `isLoaded` - Boolean to prevent saving before initial load completes
- `debounceMs` - Optional debounce time in milliseconds (default: 2000)

## Best Practices

### 1. Debouncing

All save operations are automatically debounced by 2 seconds through `useTinyDataSaver`. No need to implement this manually.

### 2. Loading State

Always use the `isLoaded` state to prevent saving data before the initial load completes:

```typescript
const { data: loadedData, isLoaded } = useTinyDataLoader<MyTinyData>(
  FIREBASE_TINY_PATH.MY_TINY,
  resetData,
);

// Only saves after isLoaded is true
useTinyDataSaver(FIREBASE_TINY_PATH.MY_TINY, dataToSave, isLoaded);
```

### 3. User Authentication

The hooks automatically handle user authentication. Data is:
- Loaded only when user is authenticated
- Reset when user logs out
- Scoped to the current user's ID

### 4. Reset on Logout

Always provide a `resetData` callback to clear local state when user logs out:

```typescript
const resetData = useCallback(() => {
  setItems([]);
  setSelectedId(null);
}, []);
```

### 5. Error Handling

Errors are automatically logged by the hooks. No additional error handling is required unless you need custom behavior.

### 6. File Path Structure

Use a consistent structure for file paths:

```
tinies/{FIREBASE_TINY_PATH}/{userId}/{entityId}/{fileName}
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

1. Define your data type (extends `Record<string, unknown>`) in `.types.ts`
2. Create a `.defaults.ts` file with default values for all data objects
   - This file should export an object containing default values for every field in your data type.
   - This is required for proper data normalization when loading from Firebase.
3. Add the path to `FIREBASE_TINY_PATH` in `firebase.const.ts`
4. Create a hooks file using `useTinyDataLoader`, `useTinyDataSaver`, and `withDefaults`
5. Update your main component to use the new hook
6. Test that data persists across page refreshes
7. Test that data resets when user logs out
8. For file storage, add upload/delete methods using the storage functions

## Examples

For complete examples, refer to these tinies:

- **Notes** - Simple Firebase Realtime Database integration
- **Recipe Book** - Database + support for image uploads
- **Personal CRM** - Database + Storage for avatars and artifact files
- **Travel Tracker** - Database + Storage for destination photos
- **Car Maintenance** - Database + Storage for file attachments
- **Apartment Tour Questions** - Complex data structure with multiple entities
