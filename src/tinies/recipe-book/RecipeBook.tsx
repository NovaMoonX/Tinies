import { Button } from '@moondreamsdev/dreamer-ui/components';
import { Plus } from '@moondreamsdev/dreamer-ui/symbols';
import { useState, useMemo } from 'react';
import { Recipe, RecipeFilters } from './RecipeBook.types';
import {
  RecipeCard,
  RecipeDetailsModal,
  FilterSection,
  AddRecipeModal,
  EditRecipeModal,
} from './RecipeBook.components';
import { filterRecipes, generateRecipeId } from './RecipeBook.utils';
import TinyPage from '@ui/layout/TinyPage';
import { useRecipeBookData } from './RecipeBook.hooks';

export function RecipeBook() {
  const { recipes, setRecipes } = useRecipeBookData();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filters, setFilters] = useState<RecipeFilters>({
    searchQuery: '',
    selectedTypes: [],
    maxCookTime: null,
    maxPrepTime: null,
    noPrepTime: false,
  });

  const filteredRecipes = useMemo(() => {
    return filterRecipes(recipes, filters);
  }, [recipes, filters]);

  const allTags = useMemo(() => {
    const tags = recipes.flatMap((recipe) => recipe.tags);
    const result = Array.from(new Set(tags)).sort();
    return result;
  }, [recipes]);

  const handleAddRecipe = (recipeData: Omit<Recipe, 'id' | 'dateAdded'>) => {
    const newRecipe: Recipe = {
      ...recipeData,
      id: generateRecipeId(),
      dateAdded: new Date().toISOString(),
    };

    setRecipes([newRecipe, ...recipes]);
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipes(recipes.filter((r) => r.id !== id));
    if (selectedRecipe?.id === id) {
      setSelectedRecipe(null);
    }
  };

  const handleUpdateRecipe = (updatedRecipe: Recipe) => {
    setRecipes(recipes.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)));
    setSelectedRecipe(null);
    setIsEditModalOpen(false);
  };

  const handleEditClick = () => {
    setSelectedRecipe(selectedRecipe);
    setIsEditModalOpen(true);
  };

  return (
    <TinyPage
      title='📖 Recipe Book'
      description='Your personal collection of favorite recipes. Search by name, filter by cook time, prep time, and recipe type. Add your own recipes with custom ingredients.'
    >
      {/* Stats */}
        <div className='bg-muted/30 rounded-2xl p-6'>
          <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
            <div className='text-center sm:text-left'>
              <div className='mb-1 text-3xl font-bold'>{recipes.length}</div>
              <div className='text-foreground/60 text-sm'>Total Recipes</div>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className='h-5 w-5' />
              Add Recipe
            </Button>
          </div>
        </div>

        {/* Filters */}
        <FilterSection
          filters={filters}
          onFiltersChange={setFilters}
          totalRecipes={recipes.length}
          filteredRecipes={filteredRecipes.length}
        />

        {/* Recipe Grid */}
        {filteredRecipes.length > 0 ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onView={() => setSelectedRecipe(recipe)}
                onDelete={() => handleDeleteRecipe(recipe.id)}
              />
            ))}
          </div>
        ) : (
          <div className='bg-muted/30 rounded-2xl p-12 text-center'>
            <div className='text-foreground/60 space-y-2'>
              <p className='text-lg font-medium'>No recipes found</p>
              <p className='text-sm'>
                {filters.searchQuery ||
                filters.selectedTypes.length > 0 ||
                filters.maxCookTime !== null ||
                filters.maxPrepTime !== null ||
                filters.noPrepTime
                  ? 'Try adjusting your filters to see more recipes.'
                  : 'Add your first recipe to get started!'}
              </p>
            </div>
          </div>
        )}

        {/* Recipe Details Modal */}
        {selectedRecipe && !isEditModalOpen && (
          <RecipeDetailsModal
            recipe={selectedRecipe}
            isOpen={!!selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
            onEdit={handleEditClick}
          />
        )}

        {/* Edit Recipe Modal */}
        {selectedRecipe && isEditModalOpen && (
          <EditRecipeModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedRecipe(null);
            }}
            onUpdate={handleUpdateRecipe}
            recipe={selectedRecipe}
            allTags={allTags}
          />
        )}

        {/* Add Recipe Modal */}
        <AddRecipeModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddRecipe}
          allTags={allTags}
        />
    </TinyPage>
  );
}

export default RecipeBook;
