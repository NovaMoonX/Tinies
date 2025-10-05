import {
  Button,
  Form,
  Select,
  Textarea,
  FormFactories,
} from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { Plus, Trash, X } from '@moondreamsdev/dreamer-ui/symbols';
import { useState } from 'react';
import { Apartment } from './ApartmentTourQuestions.types';

interface ApartmentFormData {
  name: string;
  address?: string;
}

interface ApartmentSelectorProps {
  apartments: Apartment[];
  selectedApartment: string | null;
  onSelectApartment: (id: string) => void;
  onAddApartment: (name: string, address?: string) => void;
  onDeleteApartment: (id: string) => void;
}

export function ApartmentSelector({
  apartments,
  selectedApartment,
  onSelectApartment,
  onAddApartment,
  onDeleteApartment,
}: ApartmentSelectorProps) {
  const [formData, setFormData] = useState<ApartmentFormData>({
    name: '',
    address: '',
  });
  const [isAdding, setIsAdding] = useState(false);
  const { input } = FormFactories;

  const handleAddApartment = () => {
    onAddApartment(formData.name, formData.address || undefined);
    setFormData({ name: '', address: '' });
    setIsAdding(false);
  };

  const addApartmentDisabled = formData.name.trim() === '';

  return (
    <div className='bg-muted/30 rounded-2xl p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-foreground/90'>Your Apartments</h2>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            variant='primary'
            size='sm'
            className='inline-flex items-center'
          >
            <Plus className='mr-1 h-4 w-4' />
            Add Apartment
          </Button>
        )}
      </div>

      {isAdding && (
        <div className='bg-background rounded-xl p-4'>
          <div className='space-y-4'>
            <Form
              form={[
                input({
                  name: 'name',
                  label: 'Apartment Name',
                  placeholder: 'e.g., "123 Main St #4B"',
                  variant: 'outline',
                  required: true,
                }),
                input({
                  name: 'address',
                  label: 'Address',
                  placeholder: 'Full address (optional)',
                  variant: 'outline',
                  required: false,
                }),
              ]}
              onDataChange={(data: ApartmentFormData) => {
                setFormData(data);
              }}
            />
            <div className='flex gap-2'>
              <Button
                type='submit'
                size='sm'
                onClick={handleAddApartment}
                disabled={addApartmentDisabled}
              >
                Add Apartment
              </Button>
              <Button
                onClick={() => setIsAdding(false)}
                variant='outline'
                size='sm'
                type='button'
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {apartments.length === 0 && !isAdding && (
        <p className='text-foreground/60 text-center py-4'>
          Add apartments to track answers for each one.
        </p>
      )}

      <div className='space-y-3'>
        {apartments.map((apt) => (
          <div
            key={apt.id}
            className={join(
              'flex items-center gap-3 rounded-xl p-4 transition-all duration-200 cursor-pointer',
              selectedApartment === apt.id
                ? 'bg-primary/10 ring-2 ring-primary/20'
                : 'bg-background hover:bg-muted/30',
            )}
          >
            <button
              onClick={() => onSelectApartment(apt.id)}
              className='flex-1 text-left'
            >
              <div className='font-medium text-foreground/90'>{apt.name}</div>
              {apt.address && (
                <div className='text-foreground/60 text-sm mt-1'>
                  {apt.address}
                </div>
              )}
            </button>
            <Button
              onClick={() => onDeleteApartment(apt.id)}
              variant='destructive'
              size='sm'
            >
              <Trash className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

interface AddQuestionFormProps {
  categories: string[];
  onAdd: (question: string, category: string) => void;
}

export function AddQuestionForm({ categories, onAdd }: AddQuestionFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleAdd = () => {
    if (newQuestion.trim() && selectedCategory) {
      onAdd(newQuestion.trim(), selectedCategory);
      setNewQuestion('');
      setSelectedCategory('');
      setIsAdding(false);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setNewQuestion('');
    setSelectedCategory('');
  };

  if (!isAdding) {
    return (
      <div className='flex justify-center'>
        <Button
          onClick={() => setIsAdding(true)}
          variant='outline'
          size='sm'
          className='inline-flex items-center bg-muted/30 hover:bg-muted/50 border-0'
        >
          <Plus className='mr-1 h-4 w-4' />
          Add Custom Question
        </Button>
      </div>
    );
  }

  return (
    <div className='bg-muted/30 rounded-2xl p-6'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-foreground/90'>Add Custom Question</h3>
          <Button
            onClick={resetForm}
            variant='outline'
            size='sm'
            className='border-0 bg-background/50 hover:bg-background/80'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
        <div className='space-y-4'>
          <div>
            <label className='text-foreground/80 mb-2 block text-sm font-medium'>
              Category
            </label>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder='Select a category...'
              options={[
                ...categories.map((cat) => ({ value: cat, text: cat })),
                { value: 'Other', text: 'Other' },
              ]}
            />
          </div>
          <div>
            <label className='text-foreground/80 mb-2 block text-sm font-medium'>
              Question
            </label>
            <Textarea
              placeholder='Enter your custom question...'
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              rows={3}
              className='border-0 bg-background/50 focus:bg-background/80 transition-colors'
            />
          </div>
          <div className='flex gap-2'>
            <Button
              onClick={handleAdd}
              size='sm'
              disabled={!newQuestion.trim() || !selectedCategory}
            >
              Add Question
            </Button>
            <Button
              onClick={resetForm}
              variant='outline'
              size='sm'
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
