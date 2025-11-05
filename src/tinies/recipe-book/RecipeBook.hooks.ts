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
import { Recipe } from './RecipeBook.types';

export interface RecipeBookData extends Record<string, unknown> {
  recipes: Recipe[];
}

export function useRecipeBookData() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetData = useCallback(() => {
    setRecipes([]);
  }, []);

  // Load data from Firebase on mount
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoaded(true);
        return;
      }

      try {
        const data = await getTinyData<RecipeBookData>(
          DATABASE_PATHS.RECIPE_BOOK,
          user.uid,
        );

        if (data) {
          setRecipes(data.recipes || []);
        }
      } catch (error) {
        console.error('Error loading recipe book data:', error);
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
      const dataToSave: RecipeBookData = {
        recipes,
      };

      saveTinyData(DATABASE_PATHS.RECIPE_BOOK, user.uid, dataToSave).catch(
        (error) => {
          console.error('Error saving recipe book data:', error);
        },
      );
    }, 2000);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [recipes, isLoaded, user]);

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
