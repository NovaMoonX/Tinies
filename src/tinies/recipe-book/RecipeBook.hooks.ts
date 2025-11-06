import { useAuth } from '@hooks/useAuth';
import {
  FIREBASE_TINY_PATH,
  uploadFile,
  deleteFile,
} from '@lib/firebase';
import { useTinyDataLoader, useTinyDataSaver, withDefaults } from '@lib/tinies/tinies.hooks';
import { useCallback, useEffect, useState } from 'react';
import {
  defaultIngredient,
  defaultRecipe,
  defaultRecipeBookData,
} from './RecipeBook.defaults';
import { Ingredient, Recipe, RecipeBookData } from './RecipeBook.types';

export function useRecipeBookData() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const resetData = useCallback(() => {
    setRecipes([]);
  }, []);

  // Load data from Firebase on mount
  const { data: loadedData, isLoaded } = useTinyDataLoader<RecipeBookData>(
    FIREBASE_TINY_PATH.RECIPE_BOOK,
    resetData,
  );

  // Update local state when data is loaded
  useEffect(() => {
    if (loadedData) {
      const normalized = withDefaults(loadedData, defaultRecipeBookData);
      // Normalize each individual recipe and its ingredients
      const normalizedRecipes = normalized.recipes.map((recipe) => {
        const normalizedRecipe = withDefaults<Recipe>(recipe, defaultRecipe);
        return {
          ...normalizedRecipe,
          ingredients: normalizedRecipe.ingredients.map((ingredient) =>
            withDefaults<Ingredient>(ingredient, defaultIngredient),
          ),
        };
      });
      setRecipes(normalizedRecipes);
    }
  }, [loadedData]);

  // Save data to Firebase with debouncing
  const dataToSave: RecipeBookData = {
    recipes,
  };
  useTinyDataSaver(FIREBASE_TINY_PATH.RECIPE_BOOK, dataToSave, isLoaded);

  // Upload recipe image
  const uploadRecipeImage = useCallback(
    async (recipeId: string, file: File): Promise<string> => {
      if (!user) throw new Error('User not authenticated');

      const path = `tinies/${FIREBASE_TINY_PATH.RECIPE_BOOK}/${user.uid}/${recipeId}/${file.name}`;
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
