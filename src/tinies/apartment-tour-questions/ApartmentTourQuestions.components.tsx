import { Button, Input, Card, Textarea, Select } from '@moondreamsdev/dreamer-ui/components';
import { Plus, Trash, X } from '@moondreamsdev/dreamer-ui/symbols';
import { useState } from 'react';
import { Apartment } from './ApartmentTourQuestions.types';

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
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const handleAdd = () => {
    if (newName.trim()) {
      onAddApartment(newName.trim(), newAddress.trim() || undefined);
      setNewName('');
      setNewAddress('');
      setIsAdding(false);
    }
  };

  return (
    <Card>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Apartments</h2>
          {!isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              variant='outline'
              size='sm'
              className='inline-flex items-center'
            >
              <Plus className='mr-1 h-4 w-4' />
              Add Apartment
            </Button>
          )}
        </div>

        {isAdding && (
          <div className='space-y-3 rounded-lg border border-border p-3'>
            <Input
              placeholder='Apartment name (e.g., "123 Main St #4B")'
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAdd();
                }
              }}
            />
            <Input
              placeholder='Address (optional)'
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAdd();
                }
              }}
            />
            <div className='flex gap-2'>
              <Button onClick={handleAdd} size='sm' disabled={!newName.trim()}>
                Add
              </Button>
              <Button
                onClick={() => {
                  setIsAdding(false);
                  setNewName('');
                  setNewAddress('');
                }}
                variant='outline'
                size='sm'
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {apartments.length === 0 && !isAdding && (
          <p className='text-foreground/60 text-sm'>
            Add apartments to track answers for each one.
          </p>
        )}

        <div className='space-y-2'>
          {apartments.map((apt) => (
            <div
              key={apt.id}
              className={`flex items-center gap-2 rounded-lg border p-3 transition-colors ${
                selectedApartment === apt.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-muted/50'
              }`}
            >
              <button
                onClick={() => onSelectApartment(apt.id)}
                className='flex-1 text-left'
              >
                <div className='font-medium'>{apt.name}</div>
                {apt.address && (
                  <div className='text-foreground/60 text-sm'>{apt.address}</div>
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
    </Card>
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
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <Button onClick={() => setIsAdding(true)} variant='outline' size='sm' className='inline-flex items-center'>
        <Plus className='mr-1 h-4 w-4' />
        Add Custom Question
      </Button>
    );
  }

  return (
    <Card>
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold'>Add Custom Question</h3>
          <Button
            onClick={() => {
              setIsAdding(false);
              setNewQuestion('');
              setSelectedCategory('');
            }}
            variant='outline'
            size='sm'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
        <div className='space-y-3'>
          <div>
            <label className='text-foreground/80 mb-1 block text-sm font-medium'>
              Category
            </label>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Select a category..."
              options={[
                ...categories.map((cat) => ({ value: cat, text: cat })),
                { value: 'Custom', text: 'Custom' }
              ]}
            />
          </div>
          <div>
            <label className='text-foreground/80 mb-1 block text-sm font-medium'>
              Question
            </label>
            <Textarea
              placeholder='Enter your question...'
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              rows={2}
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
              onClick={() => {
                setIsAdding(false);
                setNewQuestion('');
                setSelectedCategory('');
              }}
              variant='outline'
              size='sm'
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function AnswerInput({
  value,
  onChange,
}: AnswerInputProps) {
  return (
    <Textarea
      placeholder='Enter answer...'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={2}
      className='text-sm'
    />
  );
}
