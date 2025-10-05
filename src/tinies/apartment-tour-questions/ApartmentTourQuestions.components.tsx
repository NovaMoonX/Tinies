import {
  Button,
  Form,
  FormFactories,
  Textarea,
  Checkbox,
  Input,
} from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { DotsVertical, Plus, Trash, X } from '@moondreamsdev/dreamer-ui/symbols';
import { useState } from 'react';
import { Apartment, FollowUpItem, Question } from './ApartmentTourQuestions.types';

interface ApartmentSelectorProps {
  apartments: Apartment[];
  selectedApartment: string | null;
  onSelectApartment: (id: string) => void;
  onAddApartment: (name: string) => void;
  onDeleteApartment: (id: string) => void;
}

export function ApartmentSelector({
  apartments,
  selectedApartment,
  onSelectApartment,
  onAddApartment,
  onDeleteApartment,
}: ApartmentSelectorProps) {
  const [newApartmentName, setNewApartmentName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddApartment = () => {
    if (newApartmentName.trim()) {
      onAddApartment(newApartmentName.trim());
      setNewApartmentName('');
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newApartmentName.trim()) {
      handleAddApartment();
    }
  };

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
          <div className='space-y-3'>
            <Input
              placeholder='e.g., "Sunset Gardens Apt 3B"'
              variant='outline'
              value={newApartmentName}
              onChange={({ target: { value } }) => setNewApartmentName(value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            <div className='flex gap-2'>
              <Button
                onClick={handleAddApartment}
                size='sm'
                disabled={!newApartmentName.trim()}
              >
                Add Apartment
              </Button>
              <Button
                onClick={() => {
                  setIsAdding(false);
                  setNewApartmentName('');
                }}
                variant='outline'
                size='sm'
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
  associatedApartments: string[];
}

interface AddQuestionFormProps {
  categories: string[];
  apartments: Apartment[];
  onAdd: (question: string, category: string, associatedApartments?: string[]) => void;
}

const questionFormInitialState: AddQuestionFormData = {
  category: '',
  question: '',
  associatedApartments: [],
};
export function AddQuestionForm({ categories, apartments, onAdd }: AddQuestionFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<AddQuestionFormData>(questionFormInitialState);
  const { select, textarea, checkboxGroup } = FormFactories;

  const handleAdd = () => {
    if (formData.question.trim() && formData.category && formData.associatedApartments.length > 0) {
      // If all apartments are selected, pass undefined (shows for all apartments)
      const associatedApartments = formData.associatedApartments.length === apartments.length
        ? undefined
        : formData.associatedApartments;
      
      onAdd(formData.question.trim(), formData.category, associatedApartments);
      setFormData({ category: '', question: '', associatedApartments: [] });
      setIsAdding(false);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setFormData({ category: '', question: '', associatedApartments: [] });
  };

  const isFormValid = formData.question.trim() && formData.category && formData.associatedApartments.length > 0;

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
          initialData={questionFormInitialState}
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
            ...(apartments.length > 0 ? [
              checkboxGroup({
                name: 'associatedApartments',
                label: 'Associate with apartments',
                description: 'Will only show this question for the selected apartments.',
                required: true,
                selectAll: true,
                options: apartments.map(apartment => ({
                  value: apartment.id,
                  label: apartment.name,
                })),
              })
            ] : []),
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

interface NoteSectionProps {
  apartmentName: string;
  note: string;
  onUpdateNote: (note: string) => void;
}

export function NoteSection({ apartmentName, note, onUpdateNote }: NoteSectionProps) {
  return (
    <div className='bg-muted/30 rounded-2xl p-6'>
      <div className='space-y-4'>
        <h2 className='text-foreground/90 text-xl font-semibold'>
          Notes for {apartmentName}
        </h2>
        <Textarea
          placeholder='Add any additional notes, observations, or reminders about this apartment...'
          rows={8}
          variant='solid'
          rounded='md'
          value={note}
          onChange={({ target: { value } }) => onUpdateNote(value)}
        />
      </div>
    </div>
  );
}

interface FollowUpSectionProps {
  apartmentName: string;
  followUps: FollowUpItem[];
  onAddFollowUp: (text: string) => void;
  onToggleFollowUp: (id: string) => void;
  onDeleteFollowUp: (id: string) => void;
}

export function FollowUpSection({
  apartmentName,
  followUps,
  onAddFollowUp,
  onToggleFollowUp,
  onDeleteFollowUp,
}: FollowUpSectionProps) {
  const [newFollowUpText, setNewFollowUpText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newFollowUpText.trim()) {
      onAddFollowUp(newFollowUpText.trim());
      setNewFollowUpText('');
      setIsAdding(false);
    }
  };

  return (
    <div className='bg-muted/30 rounded-2xl p-6'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-foreground/90 text-xl font-semibold'>
            Follow-ups for {apartmentName}
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
            <div className='space-y-3'>
              <Textarea
                placeholder='Enter follow-up item (e.g., "Call landlord about parking")'
                rows={2}
                variant='outline'
                rounded='md'
                value={newFollowUpText}
                onChange={({ target: { value } }) => setNewFollowUpText(value)}
              />
              <div className='flex gap-2'>
                <Button
                  onClick={handleAdd}
                  size='sm'
                  disabled={!newFollowUpText.trim()}
                >
                  Add Follow-up
                </Button>
                <Button
                  onClick={() => {
                    setIsAdding(false);
                    setNewFollowUpText('');
                  }}
                  variant='outline'
                  size='sm'
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {followUps.length === 0 && !isAdding ? (
          <p className='text-foreground/60 py-4 text-center text-sm'>
            No follow-ups yet. Add items you need to follow up on for this apartment.
          </p>
        ) : (
          <div className='space-y-2'>
            {followUps.map((followUp) => (
              <div
                key={followUp.id}
                className={join(
                  'flex items-center gap-3 rounded-xl p-3 transition-all duration-200',
                  followUp.completed
                    ? 'bg-success/50'
                    : 'bg-background hover:bg-muted/30',
                )}
              >
                <Checkbox
                  checked={followUp.completed}
                  onCheckedChange={() => onToggleFollowUp(followUp.id)}
                  size={18}
                />
                <span
                  className={join(
                    'flex-1 text-sm inline-block',
                    followUp.completed
                      ? 'text-foreground/50 line-through'
                      : 'text-foreground/90',
                  )}
                >
                  {followUp.text}
                </span>
                <Button
                  onClick={() => onDeleteFollowUp(followUp.id)}
                  variant='destructive'
                  size='sm'
                >
                  <Trash className='h-4 w-4' />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ApartmentDetailsSectionProps {
  apartment: Apartment;
  onUpdateDetails: (updates: Partial<Apartment>) => void;
  onAddCustomLink: (label: string, url: string) => void;
  onDeleteCustomLink: (linkId: string) => void;
}

export function ApartmentDetailsSection({
  apartment,
  onUpdateDetails,
  onAddCustomLink,
  onDeleteCustomLink,
}: ApartmentDetailsSectionProps) {
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const handleAddLink = () => {
    if (newLinkLabel.trim() && newLinkUrl.trim()) {
      onAddCustomLink(newLinkLabel.trim(), newLinkUrl.trim());
      setNewLinkLabel('');
      setNewLinkUrl('');
      setIsAddingLink(false);
    }
  };

  return (
    <div className='bg-muted/30 rounded-2xl p-6'>
      <div className='space-y-6'>
        <h2 className='text-foreground/90 text-xl font-semibold'>
          Apartment Details
        </h2>

        <div className='space-y-4'>
          {/* Name */}
          <div>
            <label className='text-foreground/70 mb-2 block text-sm font-medium'>
              Name
            </label>
            <Input
              placeholder='Apartment name'
              variant='outline'
              value={apartment.name}
              onChange={({ target: { value } }) =>
                onUpdateDetails({ name: value })
              }
            />
          </div>

          {/* Address */}
          <div>
            <label className='text-foreground/70 mb-2 block text-sm font-medium'>
              Address
            </label>
            <Input
              placeholder='Full address (optional)'
              variant='outline'
              value={apartment.address || ''}
              onChange={({ target: { value } }) =>
                onUpdateDetails({ address: value })
              }
            />
          </div>

          {/* Website */}
          <div>
            <label className='text-foreground/70 mb-2 block text-sm font-medium'>
              Website
            </label>
            <Input
              placeholder='https://example.com (optional)'
              variant='outline'
              value={apartment.website || ''}
              onChange={({ target: { value } }) =>
                onUpdateDetails({ website: value })
              }
            />
          </div>

          {/* Custom Links */}
          <div>
            <div className='mb-2 flex items-center justify-between'>
              <label className='text-foreground/70 text-sm font-medium'>
                Custom Links
              </label>
              {!isAddingLink && (
                <Button
                  onClick={() => setIsAddingLink(true)}
                  variant='outline'
                  size='sm'
                  className='inline-flex items-center'
                >
                  <Plus className='mr-1 h-3 w-3' />
                  Add Link
                </Button>
              )}
            </div>

            {isAddingLink && (
              <div className='bg-background mb-3 rounded-xl p-4'>
                <div className='space-y-3'>
                  <Input
                    placeholder='Link label (e.g., "Apartments.com")'
                    variant='outline'
                    value={newLinkLabel}
                    onChange={({ target: { value } }) => setNewLinkLabel(value)}
                  />
                  <Input
                    placeholder='URL (e.g., "https://apartments.com/...")'
                    variant='outline'
                    value={newLinkUrl}
                    onChange={({ target: { value } }) => setNewLinkUrl(value)}
                  />
                  <div className='flex gap-2'>
                    <Button
                      onClick={handleAddLink}
                      size='sm'
                      disabled={!newLinkLabel.trim() || !newLinkUrl.trim()}
                    >
                      Add Link
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingLink(false);
                        setNewLinkLabel('');
                        setNewLinkUrl('');
                      }}
                      variant='outline'
                      size='sm'
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {apartment.customLinks && apartment.customLinks.length > 0 ? (
              <div className='space-y-2'>
                {apartment.customLinks.map((link) => (
                  <div
                    key={link.id}
                    className='bg-background flex items-center justify-between rounded-xl p-3'
                  >
                    <div className='flex-1'>
                      <div className='text-foreground/90 text-sm font-medium'>
                        {link.label}
                      </div>
                      <a
                        href={link.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary hover:text-primary/80 mt-1 block text-xs underline'
                      >
                        {link.url}
                      </a>
                    </div>
                    <Button
                      onClick={() => onDeleteCustomLink(link.id)}
                      variant='destructive'
                      size='sm'
                    >
                      <Trash className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            ) : !isAddingLink ? (
              <p className='text-foreground/60 py-4 text-center text-sm'>
                No custom links yet. Add links to listing sites, photos, or other resources.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuestionAssociationButtonProps {
  question: Question;
  apartments: Apartment[];
  onUpdateAssociations: (questionId: string, associatedApartments?: string[]) => void;
}

export function QuestionAssociationButton({ 
  question, 
  apartments, 
  onUpdateAssociations 
}: QuestionAssociationButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ 
    associatedApartments: question.associatedApartments || [] 
  });
  const { checkboxGroup } = FormFactories;

  const handleSave = () => {
    // If no apartments are selected, delete the question
    if (formData.associatedApartments.length === 0) {
      // We need to signal deletion - we'll pass a special value
      onUpdateAssociations(question.id, []);
      setIsEditing(false);
      return;
    }
    
    // If all apartments are selected, pass undefined (shows for all apartments)
    const associations = formData.associatedApartments.length === apartments.length
      ? undefined
      : formData.associatedApartments;
    
    onUpdateAssociations(question.id, associations);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ associatedApartments: question.associatedApartments || [] });
    setIsEditing(false);
  };

  if (apartments.length === 0) {
    return null;
  }

  if (!isEditing) {
    return (
      <Button
        onClick={() => setIsEditing(true)}
        variant='outline'
        size='sm'
        title='Edit apartment associations'
        className='px-1!'
      >
        <DotsVertical className='size-4' />
      </Button>
    );
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-background w-full max-w-md rounded-2xl p-6 shadow-xl'>
        <div className='space-y-4'>
          <h3 className='text-foreground/90 text-lg font-semibold'>
            Edit Apartment Associations
          </h3>
          <p className='text-foreground/60 text-sm'>
            Select which apartments this question should appear for.
          </p>
          
          <Form
            initialData={formData}
            form={[
              checkboxGroup({
                name: 'associatedApartments',
                label: 'Associate...',
                description: 'If no apartments are selected, this question will be deleted.',
                selectAll: true,
                options: apartments.map(apartment => ({
                  value: apartment.id,
                  label: apartment.name,
                })),
              })
            ]}
            onDataChange={(data) => {
              setFormData(data);
            }}
          />

          <div className='flex gap-2 pt-2'>
            <Button onClick={handleSave} size='sm'>
              Save
            </Button>
            <Button onClick={handleCancel} variant='outline' size='sm'>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
