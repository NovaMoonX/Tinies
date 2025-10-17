import { Recipe, RecipeFilters } from './RecipeBook.types';

export function filterRecipes(recipes: Recipe[], filters: RecipeFilters): Recipe[] {
  let result = [...recipes];

  // Search by name
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    result = result.filter((recipe) =>
      recipe.name.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // Filter by recipe types
  if (filters.selectedTypes.length > 0) {
    result = result.filter((recipe) =>
      filters.selectedTypes.includes(recipe.type)
    );
  }

  // Filter by max cook time
  if (filters.maxCookTime !== null) {
    const maxCookTime = filters.maxCookTime;
    result = result.filter((recipe) => recipe.cookTime <= maxCookTime);
  }

  // Filter by max prep time
  if (filters.maxPrepTime !== null) {
    const maxPrepTime = filters.maxPrepTime;
    result = result.filter((recipe) => recipe.prepTime <= maxPrepTime);
  }

  // Filter by no prep time
  if (filters.noPrepTime) {
    result = result.filter((recipe) => recipe.prepTime === 0);
  }

  return result;
}

export function getTotalTime(recipe: Recipe): number {
  return recipe.prepTime + recipe.cookTime;
}

export function formatTime(minutes: number): string {
  if (minutes === 0) {
    return 'No time needed';
  }
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${remainingMinutes} min`;
}

export function generateRecipeId(): string {
  return `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateIngredientId(): string {
  return `ing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
