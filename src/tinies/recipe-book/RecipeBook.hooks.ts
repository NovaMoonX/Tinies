import { useAuth } from '@hooks/useAuth';
import {
  FIREBASE_TINY_PATH,
  uploadFile,
  deleteFile,
} from '@lib/firebase';
import { useTinyDataLoader, useTinyDataSaver, withDefaults } from '@lib/tinies/tinies.hooks';
import { useCallback, useEffect, useState } from 'react';
import { Recipe, Ingredient } from './RecipeBook.types';

export interface RecipeBookData extends Record<string, unknown> {
  recipes: Recipe[];
}

const defaultRecipeBookData: RecipeBookData = {
  recipes: [],
};

const defaultIngredient: Ingredient = {
  id: '',
  name: '',
  amount: '',
  unit: '',
};

const defaultRecipe: Recipe = {
  id: '',
  name: '',
  type: 'lunch',
  description: '',
  prepTime: 0,
  cookTime: 0,
  servings: 0,
  ingredients: [],
  instructions: [],
  tags: [],
  imageUrl: null,
  dateAdded: '',
};

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
        const normalizedRecipe = withDefaults(
          recipe as Partial<Recipe> as Partial<Record<string, unknown>>,
          defaultRecipe as unknown as Record<string, unknown>,
        );
        return {
          ...normalizedRecipe,
          ingredients: (normalizedRecipe.ingredients as Ingredient[]).map((ingredient) =>
            withDefaults(
              ingredient as Partial<Ingredient> as Partial<Record<string, unknown>>,
              defaultIngredient as unknown as Record<string, unknown>,
            ),
          ),
        };
      });
      setRecipes(normalizedRecipes as unknown as Recipe[]);
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
