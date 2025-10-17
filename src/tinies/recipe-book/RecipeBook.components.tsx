import {
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Label,
  Modal,
  Select,
  Textarea,
} from '@moondreamsdev/dreamer-ui/components';
import { Plus, Trash, X } from '@moondreamsdev/dreamer-ui/symbols';
import { useState } from 'react';
import { RECIPE_TYPES } from './RecipeBook.data';
import { Recipe, RecipeType, Ingredient, RecipeFilters } from './RecipeBook.types';
import { formatTime, getTotalTime, generateIngredientId } from './RecipeBook.utils';

interface RecipeCardProps {
  recipe: Recipe;
  onView: () => void;
  onDelete: () => void;
}

export function RecipeCard({ recipe, onView, onDelete }: RecipeCardProps) {
  const recipeTypeConfig = RECIPE_TYPES.find((t) => t.value === recipe.type);
  const totalTime = getTotalTime(recipe);

  return (
    <Card className='group h-full transition-all hover:shadow-lg'>
      <div className='flex h-full flex-col p-4'>
        <div className='mb-3 flex items-start justify-between'>
          <div className='flex-1'>
            <div className='mb-1 flex items-center gap-2'>
              <span className='text-2xl'>{recipeTypeConfig?.emoji}</span>
              <Badge variant='secondary' size='sm'>
                {recipeTypeConfig?.label}
              </Badge>
            </div>
            <h3 className='mb-1 text-lg font-semibold'>{recipe.name}</h3>
            <p className='text-foreground/60 mb-2 line-clamp-2 text-sm'>
              {recipe.description}
            </p>
          </div>
          <Button
            onClick={onDelete}
            variant='destructive'
            size='sm'
            className='opacity-0 transition-opacity group-hover:opacity-100'
          >
            <Trash className='h-4 w-4' />
          </Button>
        </div>

        <div className='mb-3 flex flex-wrap gap-2 text-sm text-foreground/70'>
          <div className='flex items-center gap-1'>
            <span>⏱️</span>
            <span>Prep: {formatTime(recipe.prepTime)}</span>
          </div>
          <div className='flex items-center gap-1'>
            <span>👨‍🍳</span>
            <span>Cook: {formatTime(recipe.cookTime)}</span>
          </div>
          <div className='font-medium'>
            Total: {formatTime(totalTime)}
          </div>
        </div>

        <div className='mb-3 flex items-center gap-2 text-sm text-foreground/70'>
          <span>🍽️ {recipe.servings} servings</span>
          <span>•</span>
          <span>📝 {recipe.ingredients.length} ingredients</span>
        </div>

        {recipe.tags.length > 0 && (
          <div className='mb-3 flex flex-wrap gap-1'>
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant='muted' size='sm'>
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Button onClick={onView} variant='outline' className='mt-auto w-full'>
          View Recipe
        </Button>
      </div>
    </Card>
  );
}

interface RecipeDetailsModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

export function RecipeDetailsModal({ recipe, isOpen, onClose }: RecipeDetailsModalProps) {
  const recipeTypeConfig = RECIPE_TYPES.find((t) => t.value === recipe.type);
  const totalTime = getTotalTime(recipe);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={recipe.name}
    >
      <div className='space-y-6'>
        {/* Header Info */}
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <span className='text-3xl'>{recipeTypeConfig?.emoji}</span>
            <Badge variant='secondary'>{recipeTypeConfig?.label}</Badge>
          </div>
          <p className='text-foreground/70'>{recipe.description}</p>
          
          <div className='bg-muted/30 rounded-lg p-4'>
            <div className='grid grid-cols-2 gap-3 text-sm md:grid-cols-4'>
              <div>
                <div className='text-foreground/60 mb-1'>Prep Time</div>
                <div className='font-medium'>{formatTime(recipe.prepTime)}</div>
              </div>
              <div>
                <div className='text-foreground/60 mb-1'>Cook Time</div>
                <div className='font-medium'>{formatTime(recipe.cookTime)}</div>
              </div>
              <div>
                <div className='text-foreground/60 mb-1'>Total Time</div>
                <div className='font-medium'>{formatTime(totalTime)}</div>
              </div>
              <div>
                <div className='text-foreground/60 mb-1'>Servings</div>
                <div className='font-medium'>{recipe.servings}</div>
              </div>
            </div>
          </div>

          {recipe.tags.length > 0 && (
            <div className='flex flex-wrap gap-1'>
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant='muted' size='sm'>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div>
          <h3 className='mb-3 text-lg font-semibold'>Ingredients</h3>
          <div className='bg-muted/20 space-y-2 rounded-lg p-4'>
            {recipe.ingredients.map((ingredient) => (
              <div key={ingredient.id} className='flex items-center gap-2 text-sm'>
                <span className='text-primary'>•</span>
                <span className='font-medium'>
                  {ingredient.amount} {ingredient.unit}
                </span>
                <span>{ingredient.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <h3 className='mb-3 text-lg font-semibold'>Instructions</h3>
          <div className='space-y-3'>
            {recipe.instructions.map((instruction, index) => (
              <div key={index} className='flex gap-3'>
                <div className='bg-primary text-primary-foreground flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold'>
                  {index + 1}
                </div>
                <p className='text-foreground/80 flex-1 pt-1 text-sm'>{instruction}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

interface FilterSectionProps {
  filters: RecipeFilters;
  onFiltersChange: (filters: RecipeFilters) => void;
  totalRecipes: number;
  filteredRecipes: number;
}

export function FilterSection({
  filters,
  onFiltersChange,
  totalRecipes,
  filteredRecipes,
}: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTypeToggle = (type: RecipeType) => {
    const newTypes = filters.selectedTypes.includes(type)
      ? filters.selectedTypes.filter((t) => t !== type)
      : [...filters.selectedTypes, type];
    
    onFiltersChange({ ...filters, selectedTypes: newTypes });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      selectedTypes: [],
      maxCookTime: null,
      maxPrepTime: null,
      noPrepTime: false,
    });
  };

  const hasActiveFilters =
    filters.searchQuery ||
    filters.selectedTypes.length > 0 ||
    filters.maxCookTime !== null ||
    filters.maxPrepTime !== null ||
    filters.noPrepTime;

  return (
    <div className='bg-muted/30 rounded-2xl p-4 md:p-6'>
      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold'>Search & Filters</h2>
          <p className='text-foreground/60 text-sm'>
            Showing {filteredRecipes} of {totalRecipes} recipes
          </p>
        </div>
        {hasActiveFilters && (
          <Button onClick={handleClearFilters} variant='outline' size='sm'>
            Clear All
          </Button>
        )}
      </div>

      {/* Search */}
      <div className='mb-4'>
        <Input
          type='text'
          placeholder='Search recipes by name, description, or tags...'
          value={filters.searchQuery}
          onChange={(e) =>
            onFiltersChange({ ...filters, searchQuery: e.target.value })
          }
        />
      </div>

      {/* Quick Filters */}
      <div className='mb-4 flex flex-wrap items-center gap-2'>
        <Checkbox
          checked={filters.noPrepTime}
          onCheckedChange={(checked) =>
            onFiltersChange({ ...filters, noPrepTime: checked })
          }
          size={16}
        />
        <Label>No Prep Time</Label>
      </div>

      {/* Advanced Filters Toggle */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant='outline'
        size='sm'
        className='mb-2 w-full'
      >
        {isExpanded ? '▼' : '▶'} Advanced Filters
      </Button>

      {isExpanded && (
        <div className='space-y-4 pt-2'>
          {/* Recipe Types */}
          <div>
            <Label className='mb-2'>Recipe Types</Label>
            <div className='flex flex-wrap gap-2'>
              {RECIPE_TYPES.map((type) => {
                const isSelected = filters.selectedTypes.includes(type.value);
                return (
                  <Button
                    key={type.value}
                    onClick={() => handleTypeToggle(type.value)}
                    variant={isSelected ? 'secondary' : 'outline'}
                    size='sm'
                  >
                    <span>{type.emoji}</span>
                    <span>{type.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Max Cook Time */}
          <div>
            <Label htmlFor='max-cook-time'>Max Cook Time (minutes)</Label>
            <Input
              id='max-cook-time'
              type='number'
              placeholder='e.g., 30'
              value={filters.maxCookTime?.toString() || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : null;
                onFiltersChange({ ...filters, maxCookTime: value });
              }}
            />
          </div>

          {/* Max Prep Time */}
          <div>
            <Label htmlFor='max-prep-time'>Max Prep Time (minutes)</Label>
            <Input
              id='max-prep-time'
              type='number'
              placeholder='e.g., 15'
              value={filters.maxPrepTime?.toString() || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : null;
                onFiltersChange({ ...filters, maxPrepTime: value });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (recipe: Omit<Recipe, 'id' | 'dateAdded'>) => void;
  allTags: string[];
}

export function AddRecipeModal({ isOpen, onClose, onAdd, allTags }: AddRecipeModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<RecipeType>('dinner');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('0');
  const [cookTime, setCookTime] = useState('0');
  const [servings, setServings] = useState('4');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: generateIngredientId(), name: '', amount: '', unit: '' },
  ]);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: generateIngredientId(), name: '', amount: '', unit: '' },
    ]);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const handleUpdateIngredient = (
    id: string,
    field: keyof Ingredient,
    value: string
  ) => {
    setIngredients(
      ingredients.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing))
    );
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleUpdateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag.trim())) {
      setSelectedTags([...selectedTags, tag.trim()]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const availableTags = allTags.filter((tag) => !selectedTags.includes(tag));

  const handleSubmit = () => {
    if (!name.trim()) return;

    const filteredIngredients = ingredients.filter(
      (ing) => ing.name.trim() && ing.amount.trim()
    );

    const filteredInstructions = instructions.filter((inst) => inst.trim());

    onAdd({
      name: name.trim(),
      type,
      description: description.trim(),
      prepTime: parseInt(prepTime) || 0,
      cookTime: parseInt(cookTime) || 0,
      servings: parseInt(servings) || 1,
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
      tags: selectedTags,
      imageUrl: null,
    });

    // Reset form
    setName('');
    setType('dinner');
    setDescription('');
    setPrepTime('0');
    setCookTime('0');
    setServings('4');
    setIngredients([{ id: generateIngredientId(), name: '', amount: '', unit: '' }]);
    setInstructions(['']);
    setSelectedTags([]);
    setShowTagDropdown(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Add New Recipe'>
      <div className='space-y-4'>
        {/* Basic Info */}
        <div>
          <Label htmlFor='recipe-name'>Recipe Name *</Label>
          <Input
            id='recipe-name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='e.g., Chocolate Chip Cookies'
          />
        </div>

        <div>
          <Label htmlFor='recipe-type'>Recipe Type *</Label>
          <Select
            id='recipe-type'
            value={type}
            onChange={(value) => setType(value as RecipeType)}
            options={RECIPE_TYPES.map((t) => ({
              value: t.value,
              text: `${t.emoji} ${t.label}`,
            }))}
          />
        </div>

        <div>
          <Label htmlFor='recipe-description'>Description</Label>
          <Textarea
            id='recipe-description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Brief description of your recipe...'
            rows={2}
          />
        </div>

        {/* Times and Servings */}
        <div className='grid grid-cols-3 gap-3'>
          <div>
            <Label htmlFor='prep-time'>Prep Time (min)</Label>
            <Input
              id='prep-time'
              type='number'
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor='cook-time'>Cook Time (min)</Label>
            <Input
              id='cook-time'
              type='number'
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor='servings'>Servings</Label>
            <Input
              id='servings'
              type='number'
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <div className='mb-2 flex items-center justify-between'>
            <Label>Ingredients</Label>
            <Button onClick={handleAddIngredient} variant='outline' size='sm'>
              <Plus className='h-4 w-4' />
              Add Ingredient
            </Button>
          </div>
          <div className='space-y-2'>
            {ingredients.map((ingredient) => (
              <div key={ingredient.id} className='flex gap-2'>
                <Input
                  placeholder='Amount'
                  value={ingredient.amount}
                  onChange={(e) =>
                    handleUpdateIngredient(ingredient.id, 'amount', e.target.value)
                  }
                  className='w-20'
                />
                <Input
                  placeholder='Unit'
                  value={ingredient.unit}
                  onChange={(e) =>
                    handleUpdateIngredient(ingredient.id, 'unit', e.target.value)
                  }
                  className='w-24'
                />
                <Input
                  placeholder='Ingredient name'
                  value={ingredient.name}
                  onChange={(e) =>
                    handleUpdateIngredient(ingredient.id, 'name', e.target.value)
                  }
                  className='flex-1'
                />
                {ingredients.length > 1 && (
                  <Button
                    onClick={() => handleRemoveIngredient(ingredient.id)}
                    variant='outline'
                    size='sm'
                  >
                    <Trash className='h-4 w-4' />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <div className='mb-2 flex items-center justify-between'>
            <Label>Instructions</Label>
            <Button onClick={handleAddInstruction} variant='outline' size='sm'>
              <Plus className='h-4 w-4' />
              Add Step
            </Button>
          </div>
          <div className='space-y-2'>
            {instructions.map((instruction, index) => (
              <div key={index} className='flex gap-2'>
                <div className='bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold'>
                  {index + 1}
                </div>
                <Textarea
                  placeholder={`Step ${index + 1}...`}
                  value={instruction}
                  onChange={(e) => handleUpdateInstruction(index, e.target.value)}
                  rows={2}
                  className='flex-1'
                />
                {instructions.length > 1 && (
                  <Button
                    onClick={() => handleRemoveInstruction(index)}
                    variant='outline'
                    size='sm'
                  >
                    <Trash className='h-4 w-4' />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className='mb-2 flex items-center justify-between'>
            <Label>Tags</Label>
            <Button
              onClick={() => setShowTagDropdown(!showTagDropdown)}
              variant='outline'
              size='sm'
            >
              <Plus className='h-4 w-4' />
              {showTagDropdown ? 'Hide' : 'Add Tag'}
            </Button>
          </div>

          {showTagDropdown && (
            <div className='bg-background mb-3 rounded-xl p-4'>
              <div className='space-y-3'>
                <Input
                  placeholder='Enter new tag (e.g., "quick", "healthy")'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      handleAddTag(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                {availableTags.length > 0 && (
                  <>
                    <div className='text-foreground/60 text-sm'>
                      Or select from existing tags:
                    </div>
                    <div className='bg-muted/20 max-h-48 overflow-y-auto rounded-lg p-3'>
                      <div className='flex flex-wrap gap-2'>
                        {availableTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant='secondary'
                            className='cursor-pointer hover:opacity-80'
                            onClick={() => handleAddTag(tag)}
                          >
                            + {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {selectedTags.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
              {selectedTags.map((tag) => (
                <Badge key={tag} variant='secondary' className='group relative'>
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className='hover:bg-destructive/20 ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full'
                    title='Remove tag'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </Badge>
              ))}
            </div>
          ) : !showTagDropdown ? (
            <p className='text-foreground/60 py-4 text-center text-sm'>
              No tags yet. Add tags to categorize your recipe.
            </p>
          ) : null}
        </div>

        {/* Actions */}
        <div className='flex gap-2 pt-4'>
          <Button onClick={handleSubmit} disabled={!name.trim()} className='flex-1'>
            Add Recipe
          </Button>
          <Button onClick={onClose} variant='outline'>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
