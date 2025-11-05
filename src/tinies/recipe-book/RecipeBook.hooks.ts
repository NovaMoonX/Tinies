import { useAuth } from '@hooks/useAuth';
import {
  DATABASE_PATHS,
  STORAGE_PATHS,
  uploadFile,
  deleteFile,
} from '@lib/firebase';
import { useTinyDataLoader, useTinyDataSaver } from '@lib/tinies/tinies.hooks';
import { useCallback, useEffect, useState } from 'react';
import { Recipe } from './RecipeBook.types';

export interface RecipeBookData extends Record<string, unknown> {
  recipes: Recipe[];
}

export function useRecipeBookData() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const resetData = useCallback(() => {
    setRecipes([]);
  }, []);

  // Load data from Firebase on mount
  const { data: loadedData, isLoaded } = useTinyDataLoader<RecipeBookData>(
    DATABASE_PATHS.RECIPE_BOOK,
    resetData,
  );

  // Update local state when data is loaded
  useEffect(() => {
    if (loadedData) {
      setRecipes(loadedData.recipes || []);
    }
  }, [loadedData]);

  // Save data to Firebase with debouncing
  const dataToSave: RecipeBookData = {
    recipes,
  };
  useTinyDataSaver(DATABASE_PATHS.RECIPE_BOOK, dataToSave, isLoaded);

  // Upload recipe image
  const uploadRecipeImage = useCallback(
    async (recipeId: string, file: File): Promise<string> => {
      if (!user) throw new Error('User not authenticated');

      const path = `tinies/${STORAGE_PATHS.RECIPE_BOOK}/${user.uid}/${recipeId}/${file.name}`;
      const downloadURL = await uploadFile(path, file);
      return downloadURL;
    },
    [user],
  );

  // Delete recipe image
  const deleteRecipeImage = useCallback(
    async (imageUrl: string): Promise<void> => {
      if (!user) return;

      // Extract path from URL - Firebase storage URLs contain the path
      // Format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?...
      try {
        const urlObj = new URL(imageUrl);
        const pathMatch = urlObj.pathname.match(/\/o\/(.+)/);
        if (pathMatch) {
          const encodedPath = pathMatch[1].split('?')[0];
          const path = decodeURIComponent(encodedPath);
          await deleteFile(path);
        }
      } catch (error) {
        console.error('Error deleting recipe image:', error);
      }
    },
    [user],
  );

  return {
    recipes,
    setRecipes,
    uploadRecipeImage,
    deleteRecipeImage,
  };
}
