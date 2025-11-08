import { Ingredient, Recipe, RecipeBookData } from './RecipeBook.types';

export const defaultRecipeBookData: RecipeBookData = {
  recipes: [],
};

export const defaultIngredient: Ingredient = {
  id: '',
  name: '',
  amount: '',
  unit: '',
};

export const defaultRecipe: Recipe = {
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

