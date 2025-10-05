import {
  Button,
  Form,
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
    <div className='bg-muted/30 space-y-6 rounded-2xl p-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-foreground/90 text-xl font-semibold'>
          Your Apartments
        </h2>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            variant='primary'
            size='sm'
            className='inline-flex items-center'
          >
            <Plus className='mr-1 h-4 w-4' />
            Add
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
        <p className='text-foreground/60 py-4 text-center'>
          Add apartments to track answers for each one.
        </p>
      )}

      <div className='space-y-3'>
        {apartments.map((apt) => (
          <div
            key={apt.id}
            className={join(
              'flex cursor-pointer items-center gap-3 rounded-xl p-4 transition-all duration-200',
              selectedApartment === apt.id
                ? 'bg-primary/10 ring-primary/20 ring-2'
                : 'bg-background hover:bg-muted/30',
            )}
          >
            <button
              onClick={() => onSelectApartment(apt.id)}
              className='flex-1 text-left'
            >
              <div className='text-foreground/90 font-medium'>{apt.name}</div>
              {apt.address && (
                <div className='text-foreground/60 mt-1 text-sm'>
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

interface AddQuestionFormData {
  category: string;
  question: string;
}

interface AddQuestionFormProps {
  categories: string[];
  onAdd: (question: string, category: string) => void;
}

export function AddQuestionForm({ categories, onAdd }: AddQuestionFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<AddQuestionFormData>({
    category: '',
    question: '',
  });
  const { select, textarea } = FormFactories;

  const handleAdd = () => {
    if (formData.question.trim() && formData.category) {
      onAdd(formData.question.trim(), formData.category);
      setFormData({ category: '', question: '' });
      setIsAdding(false);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setFormData({ category: '', question: '' });
  };

  const isFormValid = formData.question.trim() && formData.category;

  if (!isAdding) {
    return (
      <div className='flex justify-center'>
        <Button
          onClick={() => setIsAdding(true)}
          variant='outline'
          size='sm'
          className='bg-muted/30 hover:bg-muted/50 inline-flex items-center border-0'
        >
          <Plus className='mr-1 h-4 w-4' />
          Add a question
        </Button>
      </div>
    );
  }

  return (
    <div className='bg-muted/30 rounded-2xl p-6'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-foreground/90 text-lg font-semibold'>
            Add A Question
          </h3>
          <Button
            onClick={resetForm}
            variant='outline'
            size='sm'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
        <Form
          form={[
            select({
              name: 'category',
              label: 'Category',
              placeholder: 'Select a category...',
              options: [
                ...categories.map((cat) => ({ value: cat, label: cat })),
                { value: 'Other', label: 'Other' },
              ],
              required: true,
            }),
            textarea({
              name: 'question',
              label: 'Question',
              placeholder: 'Enter your custom question...',
              rows: 3,
              className: 'bg-background/50 focus:bg-background/80 border-0 transition-colors',
              required: true,
            }),
          ]}
          onDataChange={(data: AddQuestionFormData) => {
            setFormData(data);
          }}
        />
        <div className='flex gap-2'>
          <Button
            onClick={handleAdd}
            size='sm'
            disabled={!isFormValid}
          >
            Add Question
          </Button>
          <Button onClick={resetForm} variant='outline' size='sm'>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
