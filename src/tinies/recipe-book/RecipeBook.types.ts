export type RecipeType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'appetizer' | 'beverage';

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  type: RecipeType;
  description: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
  imageUrl: string | null;
  dateAdded: string; // ISO date string
}

export interface RecipeFilters {
  searchQuery: string;
  selectedTypes: RecipeType[];
  maxCookTime: number | null;
  maxPrepTime: number | null;
  noPrepTime: boolean;
}

export interface RecipeBookData extends Record<string, unknown> {
  recipes: Recipe[];
}

