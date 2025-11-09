import { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  Badge,
  Modal,
  Disclosure,
  RadioGroup,
  ScrollArea,
  Checkbox,
} from '@moondreamsdev/dreamer-ui/components';
import { Plus, Trash } from '@moondreamsdev/dreamer-ui/symbols';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import {
  Car,
  ServiceEntry,
  ServiceLocation,
  CarPart,
} from './CarMaintenance.types';
import { ROUTINE_SERVICE_TYPES } from './CarMaintenance.data';
import { formatDate, formatCurrency, formatMileage, autoDetectCarParts } from './CarMaintenance.utils';

/* ===== Car Selector Component ===== */
interface CarSelectorProps {
  cars: Car[];
  selectedCar: string | null;
  onSelectCar: (carId: string | null) => void;
  onAddCar: (name: string) => void;
  onDeleteCar: (carId: string) => void;
  onUpdateCar: (carId: string, name: string) => void;
}

export function CarSelector({
  cars,
  selectedCar,
  onSelectCar,
  onAddCar,
  onDeleteCar,
  onUpdateCar,
}: CarSelectorProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCarName, setNewCarName] = useState('');
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [editingCarName, setEditingCarName] = useState('');

  const handleAdd = () => {
    if (newCarName.trim()) {
      onAddCar(newCarName.trim());
      setNewCarName('');
      setShowAddModal(false);
    }
  };

  const handleEdit = (carId: string, currentName: string) => {
    setEditingCarId(carId);
    setEditingCarName(currentName);
  };

  const handleSaveEdit = (carId: string) => {
    if (editingCarName.trim()) {
      onUpdateCar(carId, editingCarName.trim());
    }
    setEditingCarId(null);
    setEditingCarName('');
  };

  const handleCancelEdit = () => {
    setEditingCarId(null);
    setEditingCarName('');
  };

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-foreground/90'>Your Vehicles</h2>
        <Button onClick={() => setShowAddModal(true)} size='sm'>
          <Plus className='h-4 w-4' />
          Add Vehicle
        </Button>
      </div>

      {cars.length > 0 ? (
        <div className='flex flex-wrap gap-2'>
          {cars.map((car) => {
            const isSelected = selectedCar === car.id;
            const isEditing = editingCarId === car.id;
            
            return (
              <div
                key={car.id}
                className={join(
                  'flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors',
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background hover:bg-muted/30',
                )}
              >
                {isEditing ? (
                  <>
                    <Input
                      value={editingCarName}
                      onChange={(e) => setEditingCarName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveEdit(car.id);
                        } else if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                      className='h-8 w-32'
                      autoFocus
                    />
                    <Button
                      onClick={() => handleSaveEdit(car.id)}
                      variant='secondary'
                      size='sm'
                      className='h-6 w-6 p-0'
                    >
                      ✓
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant='outline'
                      size='sm'
                      className='h-6 w-6 p-0'
                    >
                      ✕
                    </Button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onSelectCar(car.id)}
                      className='flex items-center gap-2'
                    >
                      <span className='font-medium'>{car.name}</span>
                    </button>
                    <Button
                      onClick={() => handleEdit(car.id, car.name)}
                      variant='secondary'
                      size='sm'
                      className='h-6 w-6 p-0'
                    >
                      ✏️
                    </Button>
                    <Button
                      onClick={() => onDeleteCar(car.id)}
                      variant='destructive'
                      size='sm'
                      className='h-7 w-7 p-0'
                    >
                      <Trash className='h-4 w-4' />
                    </Button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className='rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center'>
          <p className='text-sm text-foreground/60'>
            No vehicles added yet. Click "Add Vehicle" to get started.
          </p>
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title='Add Vehicle'
      >
        <div className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium'>Vehicle Name</label>
            <Input
              name="newCarName"
              placeholder='e.g., My Honda Civic'
              value={newCarName}
              onChange={(e) => setNewCarName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div className='flex gap-2'>
            <Button onClick={handleAdd} className='flex-1'>
              Add
            </Button>
            <Button
              onClick={() => setShowAddModal(false)}
              variant='outline'
              className='flex-1'
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ===== Car Details Section ===== */
interface CarDetailsSectionProps {
  car: Car;
  onUpdate: (updates: Partial<Omit<Car, 'id'>>) => void;
}

export function CarDetailsSection({ car, onUpdate }: CarDetailsSectionProps) {
  return (
    <div className='space-y-4 rounded-lg border border-border bg-background p-6'>
      <h3 className='text-lg font-semibold'>Vehicle Details</h3>
      <div className='grid gap-4 md:grid-cols-2'>
        <div>
          <label className='mb-2 block text-sm font-medium'>Make</label>
          <Input
            name="make"
            placeholder='e.g., Honda'
            value={car.make}
            onChange={(e) => onUpdate({ make: e.target.value })}
          />
        </div>
        <div>
          <label className='mb-2 block text-sm font-medium'>Model</label>
          <Input
            name="model"
            placeholder='e.g., Civic'
            value={car.model}
            onChange={(e) => onUpdate({ model: e.target.value })}
          />
        </div>
        <div>
          <label className='mb-2 block text-sm font-medium'>Year</label>
          <Input
            name="year"
            type='number'
            placeholder='e.g., 2020'
            value={car.year?.toString() || ''}
            onChange={(e) =>
              onUpdate({ year: e.target.value ? parseInt(e.target.value) : null })
            }
          />
        </div>
        <div>
          <label className='mb-2 block text-sm font-medium'>Current Mileage</label>
          <Input
            name="mileage"
            type='number'
            placeholder='e.g., 45000'
            value={car.mileage?.toString() || ''}
            onChange={(e) =>
              onUpdate({
                mileage: e.target.value ? parseInt(e.target.value) : null,
              })
            }
          />
        </div>
        <div>
          <label className='mb-2 block text-sm font-medium'>VIN</label>
          <Input
            name="vin"
            placeholder='Vehicle Identification Number'
            value={car.vin}
            onChange={(e) => onUpdate({ vin: e.target.value })}
          />
        </div>
        <div>
          <label className='mb-2 block text-sm font-medium'>License Plate</label>
          <Input
            name="licensePlate"
            placeholder='e.g., ABC-1234'
            value={car.licensePlate}
            onChange={(e) => onUpdate({ licensePlate: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className='mb-2 block text-sm font-medium'>Notes</label>
        <Textarea
          name="notes"
          placeholder='Additional notes about this vehicle...'
          rows={3}
          value={car.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
        />
      </div>
    </div>
  );
}

/* ===== Car Parts Selector Component ===== */
interface CarPartsSelectorProps {
  allCarParts: CarPart[];
  selectedParts: string[];
  onTogglePart: (partId: string) => void;
}

export function CarPartsSelector({
  allCarParts,
  selectedParts,
  onTogglePart,
}: CarPartsSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInternalParts = allCarParts.filter(
    (part) =>
      part.category === 'internal' &&
      part.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredExternalParts = allCarParts.filter(
    (part) =>
      part.category === 'external' &&
      part.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      <label className='mb-2 block text-sm font-medium'>
        Affected Car Parts (Optional - will auto-detect)
      </label>
      <Disclosure label='Select parts manually' buttonClassName='text-sm'>
        <div className='mt-2 space-y-3'>
          <Input
            placeholder='Search car parts...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full'
          />
          
          <div className='space-y-3'>
            <div>
              <h4 className='mb-2 text-sm font-semibold text-foreground/80'>
                Internal Parts ({filteredInternalParts.length})
              </h4>
              <ScrollArea className='h-40'>
                <div className='space-y-2 pr-4'>
                  {filteredInternalParts.map((part) => (
                    <label key={part.id} className='flex items-center gap-2 cursor-pointer'>
                      <Checkbox
                        checked={selectedParts.includes(part.id)}
                        onCheckedChange={() => onTogglePart(part.id)}
                      />
                      <span className='text-sm'>{part.name}</span>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div>
              <h4 className='mb-2 text-sm font-semibold text-foreground/80'>
                External Parts ({filteredExternalParts.length})
              </h4>
              <ScrollArea className='h-40'>
                <div className='space-y-2 pr-4'>
                  {filteredExternalParts.map((part) => (
                    <label key={part.id} className='flex items-center gap-2 cursor-pointer'>
                      <Checkbox
                        checked={selectedParts.includes(part.id)}
                        onCheckedChange={() => onTogglePart(part.id)}
                      />
                      <span className='text-sm'>{part.name}</span>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </Disclosure>
    </div>
  );
}

/* ===== Add Service Entry Form ===== */
interface AddServiceEntryFormProps {
  carId: string;
  serviceLocations: ServiceLocation[];
  allCarParts: CarPart[];
  onAdd: (
    carId: string,
    serviceType: string,
    isRoutine: boolean,
    title: string,
    description: string,
    date: string,
    time: string,
    locationId: string | null,
    mileage: number | null,
    cost: number | null,
    notes: string,
    attachments: never[],
    carParts: string[],
  ) => void;
  onAddLocation: (
    name: string,
    address: string,
    phoneNumber: string,
    website: string,
    email: string,
    notes: string,
  ) => string;
}

export function AddServiceEntryForm({
  carId,
  serviceLocations,
  allCarParts,
  onAdd,
  onAddLocation,
}: AddServiceEntryFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [isRoutine, setIsRoutine] = useState(true);
  const [serviceType, setServiceType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [locationId, setLocationId] = useState<string>('');
  const [mileage, setMileage] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationAddress, setNewLocationAddress] = useState('');
  const [newLocationPhone, setNewLocationPhone] = useState('');
  const [newLocationWebsite, setNewLocationWebsite] = useState('');
  const [newLocationEmail, setNewLocationEmail] = useState('');
  const [newLocationNotes, setNewLocationNotes] = useState('');

  const autoDetectParts = () => {
    // Auto-detect using imported function
    const detectedPartIds = autoDetectCarParts(
      title,
      description,
      notes,
      allCarParts,
    );
    // Merge with manually selected parts
    const allPartIds = Array.from(
      new Set([...selectedParts, ...detectedPartIds]),
    );
    setSelectedParts(allPartIds);
  };

  const handleFieldBlur = () => {
    autoDetectParts();
  };

  const handleAddLocation = () => {
    if (newLocationName.trim()) {
      const newId = onAddLocation(
        newLocationName.trim(),
        newLocationAddress.trim(),
        newLocationPhone.trim(),
        newLocationWebsite.trim(),
        newLocationEmail.trim(),
        newLocationNotes.trim(),
      );
      setLocationId(newId);
      setNewLocationName('');
      setNewLocationAddress('');
      setNewLocationPhone('');
      setNewLocationWebsite('');
      setNewLocationEmail('');
      setNewLocationNotes('');
      setShowAddLocation(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    onAdd(
      carId,
      isRoutine ? serviceType : 'Custom',
      isRoutine,
      title.trim(),
      description.trim(),
      date,
      time,
      locationId || null,
      mileage ? parseInt(mileage) : null,
      cost ? parseFloat(cost) : null,
      notes.trim(),
      [],
      selectedParts,
    );

    // Reset form
    setIsRoutine(true);
    setServiceType('');
    setTitle('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('');
    setLocationId('');
    setMileage('');
    setCost('');
    setNotes('');
    setSelectedParts([]);
    setShowForm(false);
  };

  const togglePart = (partId: string) => {
    setSelectedParts((prev) =>
      prev.includes(partId)
        ? prev.filter((id) => id !== partId)
        : [...prev, partId],
    );
  };

  return (
    <div className='space-y-4'>
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className='w-full'>
          <Plus className='h-4 w-4' />
          Add Service Entry
        </Button>
      ) : (
        <div className='space-y-4 rounded-lg border border-border bg-background p-6'>
          <h3 className='text-lg font-semibold'>New Service Entry</h3>

          <div>
            <label className='mb-2 block text-sm font-medium'>Service Type</label>
            <RadioGroup
              value={isRoutine ? 'routine' : 'custom'}
              onChange={(value: string) => setIsRoutine(value === 'routine')}
              options={[
                { value: 'routine', label: 'Routine Service' },
                { value: 'custom', label: 'Custom Service' },
              ]}
            />
          </div>

          {isRoutine && (
            <div>
              <label className='mb-2 block text-sm font-medium'>Service Type</label>
              <select
                className='w-full rounded-md border border-border bg-background px-3 py-2'
                value={serviceType}
                onChange={(e) => {
                  const selectedType = e.target.value;
                  setServiceType(selectedType);
                  if (selectedType) {
                    // Format: "Service Type (MM/DD/YYYY)"
                    const formattedDate = new Date(date).toLocaleDateString('en-US');
                    setTitle(`${selectedType} (${formattedDate})`);
                    // Auto-detect parts when service type changes
                    setTimeout(() => {
                      // Auto-detect using imported function
                      const detectedPartIds = autoDetectCarParts(
                        `${selectedType} (${formattedDate})`,
                        description,
                        notes,
                        allCarParts,
                      );
                      setSelectedParts(detectedPartIds);
                    }, 0);
                  }
                }}
              >
                <option value=''>Select a service type...</option>
                {ROUTINE_SERVICE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className='mb-2 block text-sm font-medium'>Title</label>
            <Input
              name="title"
              placeholder='e.g., Oil Change'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleFieldBlur}
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>Description</label>
            <Textarea
              name="description"
              placeholder='Describe the service performed...'
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleFieldBlur}
            />
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-2 block text-sm font-medium'>Date</label>
              <Input
                name="date"
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium'>Time</label>
              <Input
                name="time"
                type='time'
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>
              Service Location
            </label>
            <div className='flex gap-2'>
              <select
                className='flex-1 rounded-md border border-border bg-background px-3 py-2'
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
              >
                <option value=''>Select a location...</option>
                {serviceLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={() => setShowAddLocation(true)}
                variant='outline'
                size='sm'
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {showAddLocation && (
            <div className='space-y-3 rounded-lg border border-border bg-muted/30 p-4'>
              <h4 className='font-medium'>Add Service Location</h4>
              <div>
                <label className='mb-2 block text-sm font-medium'>Name</label>
                <Input
                  name="newLocationName"
                  placeholder='e.g., Jiffy Lube'
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium'>Address</label>
                <Input
                  name="newLocationAddress"
                  placeholder='Street address'
                  value={newLocationAddress}
                  onChange={(e) => setNewLocationAddress(e.target.value)}
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium'>Phone</label>
                <Input
                  name="newLocationPhone"
                  placeholder='Phone number'
                  value={newLocationPhone}
                  onChange={(e) => setNewLocationPhone(e.target.value)}
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium'>Website</label>
                <Input
                  name="newLocationWebsite"
                  placeholder='https://...'
                  value={newLocationWebsite}
                  onChange={(e) => setNewLocationWebsite(e.target.value)}
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium'>Email</label>
                <Input
                  name="newLocationEmail"
                  type='email'
                  placeholder='email@example.com'
                  value={newLocationEmail}
                  onChange={(e) => setNewLocationEmail(e.target.value)}
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium'>Notes</label>
                <Textarea
                  name="newLocationNotes"
                  rows={2}
                  value={newLocationNotes}
                  onChange={(e) => setNewLocationNotes(e.target.value)}
                />
              </div>
              <div className='flex gap-2'>
                <Button onClick={handleAddLocation} size='sm'>
                  Add
                </Button>
                <Button
                  onClick={() => setShowAddLocation(false)}
                  variant='outline'
                  size='sm'
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-2 block text-sm font-medium'>Mileage</label>
              <div className='relative'>
                <Input
                  name="mileage"
                  type='number'
                  placeholder='e.g., 45000'
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className='pr-14'
                />
                {mileage && (
                  <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-foreground/60'>
                    miles
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium'>Cost</label>
              <div className='relative'>
                <Input
                  name="cost"
                  type='number'
                  step='0.01'
                  placeholder='e.g., 49.99'
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className='pl-7'
                />
                {cost && (
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-foreground/60'>
                    $
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>Notes</label>
            <Textarea
              name="notes"
              placeholder='Additional notes...'
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleFieldBlur}
            />
          </div>

          <CarPartsSelector
            allCarParts={allCarParts}
            selectedParts={selectedParts}
            onTogglePart={togglePart}
          />

          <div className='flex gap-2'>
            <Button onClick={handleSubmit} className='flex-1'>
              Add Service
            </Button>
            <Button
              onClick={() => setShowForm(false)}
              variant='outline'
              className='flex-1'
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Edit Service Entry Form ===== */
interface EditServiceEntryFormProps {
  entry: ServiceEntry;
  serviceLocations: ServiceLocation[];
  allCarParts: CarPart[];
  onUpdate: (
    entryId: string,
    updates: {
      serviceType: string;
      isRoutine: boolean;
      title: string;
      description: string;
      date: string;
      time: string;
      locationId: string | null;
      mileage: number | null;
      cost: number | null;
      notes: string;
      carParts: string[];
    },
  ) => void;
  onCancel: () => void;
  onAddLocation: (
    name: string,
    address: string,
    phoneNumber: string,
    website: string,
    email: string,
    notes: string,
  ) => string;
}

export function EditServiceEntryForm({
  entry,
  serviceLocations,
  allCarParts,
  onUpdate,
  onCancel,
  onAddLocation,
}: EditServiceEntryFormProps) {
  const [isRoutine, setIsRoutine] = useState(entry.isRoutine);
  const [serviceType, setServiceType] = useState(entry.serviceType);
  const [title, setTitle] = useState(entry.title);
  const [description, setDescription] = useState(entry.description);
  const [date, setDate] = useState(entry.date);
  const [time, setTime] = useState(entry.time);
  const [locationId, setLocationId] = useState<string>(entry.locationId || '');
  const [mileage, setMileage] = useState(entry.mileage?.toString() || '');
  const [cost, setCost] = useState(entry.cost?.toString() || '');
  const [notes, setNotes] = useState(entry.notes);
  const [selectedParts, setSelectedParts] = useState<string[]>(entry.carParts);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationAddress, setNewLocationAddress] = useState('');
  const [newLocationPhone, setNewLocationPhone] = useState('');
  const [newLocationWebsite, setNewLocationWebsite] = useState('');
  const [newLocationEmail, setNewLocationEmail] = useState('');
  const [newLocationNotes, setNewLocationNotes] = useState('');

  const autoDetectParts = () => {
    // Auto-detect using imported function
    const detectedPartIds = autoDetectCarParts(
      title,
      description,
      notes,
      allCarParts,
    );
    // Merge with manually selected parts
    const allPartIds = Array.from(
      new Set([...selectedParts, ...detectedPartIds]),
    );
    setSelectedParts(allPartIds);
  };

  const handleFieldBlur = () => {
    autoDetectParts();
  };

  const handleAddLocation = () => {
    if (newLocationName.trim()) {
      const newId = onAddLocation(
        newLocationName.trim(),
        newLocationAddress.trim(),
        newLocationPhone.trim(),
        newLocationWebsite.trim(),
        newLocationEmail.trim(),
        newLocationNotes.trim(),
      );
      setLocationId(newId);
      setNewLocationName('');
      setNewLocationAddress('');
      setNewLocationPhone('');
      setNewLocationWebsite('');
      setNewLocationEmail('');
      setNewLocationNotes('');
      setShowAddLocation(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    onUpdate(entry.id, {
      serviceType: isRoutine ? serviceType : 'Custom',
      isRoutine,
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      locationId: locationId || null,
      mileage: mileage ? parseInt(mileage) : null,
      cost: cost ? parseFloat(cost) : null,
      notes: notes.trim(),
      carParts: selectedParts,
    });
  };

  const togglePart = (partId: string) => {
    setSelectedParts((prev) =>
      prev.includes(partId)
        ? prev.filter((id) => id !== partId)
        : [...prev, partId],
    );
  };

  return (
    <div className='space-y-4 rounded-lg border border-border bg-background p-6'>
      <h3 className='text-lg font-semibold'>Edit Service Entry</h3>

      <div>
        <label className='mb-2 block text-sm font-medium'>Service Type</label>
        <RadioGroup
          value={isRoutine ? 'routine' : 'custom'}
          onChange={(value: string) => setIsRoutine(value === 'routine')}
          options={[
            { value: 'routine', label: 'Routine Service' },
            { value: 'custom', label: 'Custom Service' },
          ]}
        />
      </div>

      {isRoutine && (
        <div>
          <label className='mb-2 block text-sm font-medium'>Service Type</label>
          <select
            className='w-full rounded-md border border-border bg-background px-3 py-2'
            value={serviceType}
            onChange={(e) => {
              const selectedType = e.target.value;
              setServiceType(selectedType);
              if (selectedType) {
                // Format: "Service Type (MM/DD/YYYY)"
                const formattedDate = new Date(date).toLocaleDateString('en-US');
                setTitle(`${selectedType} (${formattedDate})`);
                // Auto-detect parts when service type changes
                setTimeout(() => {
                  // Auto-detect using imported function
                  const detectedPartIds = autoDetectCarParts(
                    `${selectedType} (${formattedDate})`,
                    description,
                    notes,
                    allCarParts,
                  );
                  setSelectedParts(detectedPartIds);
                }, 0);
              }
            }}
          >
            <option value=''>Select a service type...</option>
            {ROUTINE_SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className='mb-2 block text-sm font-medium'>Title</label>
        <Input
          name="editTitle"
          placeholder='e.g., Oil Change'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleFieldBlur}
        />
      </div>

      <div>
        <label className='mb-2 block text-sm font-medium'>Description</label>
        <Textarea
          name="editDescription"
          placeholder='Describe the service performed...'
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleFieldBlur}
        />
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <div>
          <label className='mb-2 block text-sm font-medium'>Date</label>
          <Input
            name="editDate"
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className='mb-2 block text-sm font-medium'>Time</label>
          <Input
            name="editTime"
            type='time'
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className='mb-2 block text-sm font-medium'>
          Service Location
        </label>
        <div className='flex gap-2'>
          <select
            className='flex-1 rounded-md border border-border bg-background px-3 py-2'
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
          >
            <option value=''>Select a location...</option>
            {serviceLocations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
          <Button
            onClick={() => setShowAddLocation(true)}
            variant='outline'
            size='sm'
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {showAddLocation && (
        <div className='space-y-3 rounded-lg border border-border bg-muted/30 p-4'>
          <h4 className='font-medium'>Add Service Location</h4>
          <div>
            <label className='mb-2 block text-sm font-medium'>Name</label>
            <Input
              name="editNewLocationName"
              placeholder='e.g., Jiffy Lube'
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
            />
          </div>
          <div>
            <label className='mb-2 block text-sm font-medium'>Address</label>
            <Input
              name="editNewLocationAddress"
              placeholder='Street address'
              value={newLocationAddress}
              onChange={(e) => setNewLocationAddress(e.target.value)}
            />
          </div>
          <div>
            <label className='mb-2 block text-sm font-medium'>Phone</label>
            <Input
              name="editNewLocationPhone"
              placeholder='Phone number'
              value={newLocationPhone}
              onChange={(e) => setNewLocationPhone(e.target.value)}
            />
          </div>
          <div>
            <label className='mb-2 block text-sm font-medium'>Website</label>
            <Input
              name="editNewLocationWebsite"
              placeholder='https://...'
              value={newLocationWebsite}
              onChange={(e) => setNewLocationWebsite(e.target.value)}
            />
          </div>
          <div>
            <label className='mb-2 block text-sm font-medium'>Email</label>
            <Input
              name="editNewLocationEmail"
              type='email'
              placeholder='email@example.com'
              value={newLocationEmail}
              onChange={(e) => setNewLocationEmail(e.target.value)}
            />
          </div>
          <div>
            <label className='mb-2 block text-sm font-medium'>Notes</label>
            <Textarea
              name="editNewLocationNotes"
              rows={2}
              value={newLocationNotes}
              onChange={(e) => setNewLocationNotes(e.target.value)}
            />
          </div>
          <div className='flex gap-2'>
            <Button onClick={handleAddLocation} size='sm'>
              Add
            </Button>
            <Button
              onClick={() => setShowAddLocation(false)}
              variant='outline'
              size='sm'
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className='grid gap-4 md:grid-cols-2'>
        <div>
          <label className='mb-2 block text-sm font-medium'>Mileage</label>
          <div className='relative'>
            <Input
              name="editMileage"
              type='number'
              placeholder='e.g., 45000'
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              className='pr-14'
            />
            {mileage && (
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-foreground/60'>
                miles
              </div>
            )}
          </div>
        </div>
        <div>
          <label className='mb-2 block text-sm font-medium'>Cost</label>
          <div className='relative'>
            <Input
              name="editCost"
              type='number'
              step='0.01'
              placeholder='e.g., 49.99'
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className='pl-7'
            />
            {cost && (
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-foreground/60'>
                $
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className='mb-2 block text-sm font-medium'>Notes</label>
        <Textarea
          name="editNotes"
          placeholder='Additional notes...'
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleFieldBlur}
        />
      </div>

      <CarPartsSelector
        allCarParts={allCarParts}
        selectedParts={selectedParts}
        onTogglePart={togglePart}
      />

      <div className='flex gap-2'>
        <Button onClick={handleSubmit} className='flex-1'>
          Save Changes
        </Button>
        <Button onClick={onCancel} variant='outline' className='flex-1'>
          Cancel
        </Button>
      </div>
    </div>
  );
}

/* ===== Service Entry Card ===== */
interface ServiceEntryCardProps {
  entry: ServiceEntry;
  location: ServiceLocation | undefined;
  allCarParts: CarPart[];
  issues?: Issue[];
  onDelete: (entryId: string) => void;
  onEdit: (entry: ServiceEntry) => void;
}

export function ServiceEntryCard({
  entry,
  location,
  allCarParts,
  issues = [],
  onDelete,
  onEdit,
}: ServiceEntryCardProps) {
  const affectedParts = allCarParts.filter((part) =>
    entry.carParts.includes(part.id),
  );

  const assignedIssues = issues.filter((issue) =>
    entry.issueIds.includes(issue.id),
  );

  return (
    <div className='space-y-3 rounded-lg border border-border bg-background p-4 transition-shadow hover:shadow-md'>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <div className='flex items-center gap-2'>
            <h4 className='font-semibold text-foreground'>{entry.title}</h4>
            {entry.isRoutine && (
              <Badge variant='secondary' size='sm'>
                Routine
              </Badge>
            )}
          </div>
          <p className='mt-1 text-sm text-foreground/70'>
            {formatDate(entry.date)}
            {entry.time && ` at ${entry.time}`}
          </p>
        </div>
        <div className='flex gap-1'>
          <Button
            onClick={() => onEdit(entry)}
            variant='secondary'
            size='sm'
          >
            ✏️
          </Button>
          <Button
            onClick={() => onDelete(entry.id)}
            variant='destructive'
            size='sm'
            className='text-destructive'
          >
            <Trash className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {entry.description && (
        <p className='text-sm text-foreground/80'>{entry.description}</p>
      )}

      <div className='flex flex-wrap gap-4 text-sm text-foreground/70'>
        {entry.mileage !== null && (
          <span>📍 {formatMileage(entry.mileage)}</span>
        )}
        {entry.cost !== null && <span>💰 {formatCurrency(entry.cost)}</span>}
        {location && <span>🏢 {location.name}</span>}
      </div>

      {affectedParts.length > 0 && (
        <div className='flex flex-wrap gap-1'>
          {affectedParts.map((part) => (
            <Badge
              key={part.id}
              variant={part.isCustom ? 'primary' : 'secondary'}
              size='xs'
            >
              {part.name}
            </Badge>
          ))}
        </div>
      )}

      {assignedIssues.length > 0 && (
        <div className='rounded-lg bg-muted/30 p-3'>
          <div className='mb-2 text-xs font-semibold text-foreground/70'>
            Assigned Issues:
          </div>
          <div className='space-y-2'>
            {assignedIssues.map((issue) => (
              <div
                key={issue.id}
                className='flex items-center justify-between text-sm'
              >
                <span className='text-foreground/80'>{issue.title}</span>
                <Badge
                  variant={issue.status === 'open' ? 'destructive' : 'success'}
                  size='xs'
                >
                  {issue.status === 'open' ? 'Open' : 'Resolved'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {entry.notes && (
        <Disclosure label='Notes' buttonClassName='text-sm'>
          <p className='mt-2 text-sm text-foreground/70'>{entry.notes}</p>
        </Disclosure>
      )}
    </div>
  );
}

/* ===== Issue Components ===== */

import { Issue } from './CarMaintenance.types';

interface AddIssueFormProps {
  carId: string;
  allCarParts: CarPart[];
  onAdd: (
    carId: string,
    title: string,
    description: string,
    carParts: string[],
    notes: string,
  ) => string;
}

export function AddIssueForm({ carId, allCarParts, onAdd }: AddIssueFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [showCarPartsModal, setShowCarPartsModal] = useState(false);
  const [selectedCarParts, setSelectedCarParts] = useState<string[]>([]);

  const handleAdd = () => {
    if (title.trim() && description.trim()) {
      onAdd(carId, title.trim(), description.trim(), selectedCarParts, notes.trim());
      setTitle('');
      setDescription('');
      setNotes('');
      setSelectedCarParts([]);
    }
  };

  const handleToggleCarPart = (partId: string) => {
    setSelectedCarParts((prev) =>
      prev.includes(partId)
        ? prev.filter((id) => id !== partId)
        : [...prev, partId],
    );
  };

  const internalParts = allCarParts.filter((p) => p.category === 'internal');
  const externalParts = allCarParts.filter((p) => p.category === 'external');

  return (
    <div className='rounded-2xl border border-border bg-card p-6'>
      <h3 className='mb-4 text-lg font-semibold'>Report New Issue</h3>
      
      <div className='space-y-4'>
        <Input
          name='title'
          placeholder='Issue title (e.g., "Strange noise when braking")'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <Textarea
          name='description'
          placeholder='Describe the issue in detail...'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div>
          <Button
            onClick={() => setShowCarPartsModal(true)}
            variant='outline'
            size='sm'
          >
            <Plus className='h-4 w-4' />
            Specify Affected Parts ({selectedCarParts.length})
          </Button>
          
          {selectedCarParts.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {selectedCarParts.map((partId) => {
                const part = allCarParts.find((p) => p.id === partId);
                return part ? (
                  <Badge
                    key={part.id}
                    variant={part.isCustom ? 'primary' : 'secondary'}
                    size='xs'
                  >
                    {part.name}
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>
        
        <Disclosure label='Additional Notes' buttonClassName='text-sm'>
          <div className='mt-2'>
            <Textarea
              name='notes'
              placeholder='Any additional notes about this issue...'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </Disclosure>
        
        <Button
          onClick={handleAdd}
          disabled={!title.trim() || !description.trim()}
          className='w-full'
        >
          Report Issue
        </Button>
      </div>

      {/* Car Parts Selection Modal */}
      <Modal
        isOpen={showCarPartsModal}
        onClose={() => setShowCarPartsModal(false)}
        title='Select Affected Parts'
      >
        <ScrollArea className='max-h-[60vh]'>
          <div className='space-y-6 p-4'>
            <div>
              <h4 className='mb-3 text-sm font-semibold text-foreground/80'>
                Internal Parts
              </h4>
              <div className='space-y-2'>
                {internalParts.map((part) => (
                  <div key={part.id} className='flex items-center gap-2'>
                    <Checkbox
                      checked={selectedCarParts.includes(part.id)}
                      onCheckedChange={() => handleToggleCarPart(part.id)}
                    />
                    <span className='text-sm'>{part.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className='mb-3 text-sm font-semibold text-foreground/80'>
                External Parts
              </h4>
              <div className='space-y-2'>
                {externalParts.map((part) => (
                  <div key={part.id} className='flex items-center gap-2'>
                    <Checkbox
                      checked={selectedCarParts.includes(part.id)}
                      onCheckedChange={() => handleToggleCarPart(part.id)}
                    />
                    <span className='text-sm'>{part.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <div className='mt-4 flex justify-end'>
          <Button onClick={() => setShowCarPartsModal(false)}>Done</Button>
        </div>
      </Modal>
    </div>
  );
}

interface IssueCardProps {
  issue: Issue;
  allCarParts: CarPart[];
  serviceEntries: ServiceEntry[];
  onDelete: (issueId: string) => void;
  onUpdateStatus: (issueId: string, status: 'open' | 'resolved') => void;
  onEdit: (issue: Issue) => void;
  onAssignToServiceEntry: (issueId: string, entryId: string) => void;
  onUnassignFromServiceEntry: (issueId: string, entryId: string) => void;
}

export function IssueCard({
  issue,
  allCarParts,
  serviceEntries,
  onDelete,
  onUpdateStatus,
  onEdit,
  onAssignToServiceEntry,
  onUnassignFromServiceEntry,
}: IssueCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const affectedParts = allCarParts.filter((part) =>
    issue.carParts.includes(part.id),
  );

  const assignedEntries = serviceEntries.filter((entry) =>
    entry.issueIds.includes(issue.id),
  );

  const availableEntries = serviceEntries.filter(
    (entry) => !entry.issueIds.includes(issue.id) && entry.carId === issue.carId,
  );

  return (
    <>
      <div
        className={join(
          'rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted/30',
          issue.status === 'resolved' && 'opacity-60',
        )}
      >
        <div className='mb-2 flex items-start justify-between gap-3'>
          <div className='flex-1'>
            <div className='mb-1 flex items-center gap-2'>
              <h4 className='font-semibold'>{issue.title}</h4>
              <Badge
                variant={issue.status === 'open' ? 'destructive' : 'success'}
                size='xs'
              >
                {issue.status === 'open' ? '🔴 Open' : '✅ Resolved'}
              </Badge>
            </div>
            <p className='text-sm text-foreground/60'>
              {new Date(issue.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button
            onClick={() => setShowDetailsModal(true)}
            variant='outline'
            size='sm'
          >
            View Details
          </Button>
        </div>

        <p className='mb-3 text-sm text-foreground/80'>{issue.description}</p>

        {affectedParts.length > 0 && (
          <div className='mb-3 flex flex-wrap gap-1'>
            {affectedParts.map((part) => (
              <Badge
                key={part.id}
                variant={part.isCustom ? 'primary' : 'secondary'}
                size='xs'
              >
                {part.name}
              </Badge>
            ))}
          </div>
        )}

        {assignedEntries.length > 0 && (
          <div className='text-xs text-foreground/60'>
            📋 Assigned to {assignedEntries.length} service{' '}
            {assignedEntries.length === 1 ? 'entry' : 'entries'}
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={issue.title}
      >
        <div className='space-y-4'>
          <div>
            <div className='mb-2 flex items-center gap-2'>
              <Badge
                variant={issue.status === 'open' ? 'destructive' : 'success'}
                size='sm'
              >
                {issue.status === 'open' ? '🔴 Open' : '✅ Resolved'}
              </Badge>
              <span className='text-sm text-foreground/60'>
                Reported: {new Date(issue.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div>
            <h4 className='mb-2 text-sm font-semibold'>Description</h4>
            <p className='text-sm text-foreground/80'>{issue.description}</p>
          </div>

          {affectedParts.length > 0 && (
            <div>
              <h4 className='mb-2 text-sm font-semibold'>Affected Parts</h4>
              <div className='flex flex-wrap gap-1'>
                {affectedParts.map((part) => (
                  <Badge
                    key={part.id}
                    variant={part.isCustom ? 'primary' : 'secondary'}
                    size='xs'
                  >
                    {part.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {issue.notes && (
            <div>
              <h4 className='mb-2 text-sm font-semibold'>Additional Notes</h4>
              <p className='text-sm text-foreground/70'>{issue.notes}</p>
            </div>
          )}

          {assignedEntries.length > 0 && (
            <div>
              <h4 className='mb-2 text-sm font-semibold'>
                Assigned to Service Entries
              </h4>
              <div className='space-y-2'>
                {assignedEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className='flex items-center justify-between rounded-lg bg-muted/30 p-2 text-sm'
                  >
                    <div>
                      <div className='font-medium'>{entry.title}</div>
                      <div className='text-xs text-foreground/60'>
                        {formatDate(entry.date)}
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        onUnassignFromServiceEntry(issue.id, entry.id);
                      }}
                      variant='secondary'
                      size='sm'
                    >
                      Unassign
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='flex gap-2'>
            <Button
              onClick={() => setShowAssignModal(true)}
              variant='outline'
              className='flex-1'
              disabled={availableEntries.length === 0}
            >
              Assign to Service Entry
            </Button>
            <Button
              onClick={() => {
                onUpdateStatus(
                  issue.id,
                  issue.status === 'open' ? 'resolved' : 'open',
                );
                setShowDetailsModal(false);
              }}
              variant={issue.status === 'open' ? 'primary' : 'outline'}
              className='flex-1'
            >
              {issue.status === 'open' ? 'Mark Resolved' : 'Reopen'}
            </Button>
          </div>

          <div className='flex gap-2'>
            <Button
              onClick={() => {
                onEdit(issue);
                setShowDetailsModal(false);
              }}
              variant='secondary'
              className='flex-1'
            >
              Edit Issue
            </Button>
            <Button
              onClick={() => {
                onDelete(issue.id);
                setShowDetailsModal(false);
              }}
              variant='destructive'
              className='flex-1'
            >
              Delete Issue
            </Button>
          </div>
        </div>
      </Modal>

      {/* Assign to Service Entry Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title='Assign to Service Entry'
      >
        <div className='space-y-3'>
          {availableEntries.length > 0 ? (
            <>
              <p className='text-sm text-foreground/70'>
                Select a service entry to assign this issue. The affected car
                parts will be automatically added to the service entry.
              </p>
              <ScrollArea className='max-h-[400px]'>
                <div className='space-y-2'>
                  {availableEntries.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => {
                        onAssignToServiceEntry(issue.id, entry.id);
                        setShowAssignModal(false);
                        setShowDetailsModal(false);
                      }}
                      className='w-full rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-muted/30'
                    >
                      <div className='font-medium'>{entry.title}</div>
                      <div className='text-xs text-foreground/60'>
                        {formatDate(entry.date)} • {entry.serviceType}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <p className='text-center text-sm text-foreground/60'>
              No available service entries to assign this issue to.
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}

interface EditIssueFormProps {
  issue: Issue;
  allCarParts: CarPart[];
  onUpdate: (
    issueId: string,
    title: string,
    description: string,
    carParts: string[],
    notes: string,
  ) => void;
  onCancel: () => void;
}

export function EditIssueForm({
  issue,
  allCarParts,
  onUpdate,
  onCancel,
}: EditIssueFormProps) {
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description);
  const [notes, setNotes] = useState(issue.notes);
  const [showCarPartsModal, setShowCarPartsModal] = useState(false);
  const [selectedCarParts, setSelectedCarParts] = useState<string[]>(
    issue.carParts,
  );

  const handleUpdate = () => {
    if (title.trim() && description.trim()) {
      onUpdate(issue.id, title.trim(), description.trim(), selectedCarParts, notes.trim());
    }
  };

  const handleToggleCarPart = (partId: string) => {
    setSelectedCarParts((prev) =>
      prev.includes(partId)
        ? prev.filter((id) => id !== partId)
        : [...prev, partId],
    );
  };

  const internalParts = allCarParts.filter((p) => p.category === 'internal');
  const externalParts = allCarParts.filter((p) => p.category === 'external');

  return (
    <div className='rounded-2xl border border-border bg-card p-6'>
      <h3 className='mb-4 text-lg font-semibold'>Edit Issue</h3>
      
      <div className='space-y-4'>
        <Input
          name='title'
          placeholder='Issue title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <Textarea
          name='description'
          placeholder='Describe the issue in detail...'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div>
          <Button
            onClick={() => setShowCarPartsModal(true)}
            variant='outline'
            size='sm'
          >
            <Plus className='h-4 w-4' />
            Specify Affected Parts ({selectedCarParts.length})
          </Button>
          
          {selectedCarParts.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {selectedCarParts.map((partId) => {
                const part = allCarParts.find((p) => p.id === partId);
                return part ? (
                  <Badge
                    key={part.id}
                    variant={part.isCustom ? 'primary' : 'secondary'}
                    size='xs'
                  >
                    {part.name}
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>
        
        <Disclosure label='Additional Notes' buttonClassName='text-sm'>
          <div className='mt-2'>
            <Textarea
              name='notes'
              placeholder='Any additional notes about this issue...'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </Disclosure>
        
        <div className='flex gap-2'>
          <Button
            onClick={handleUpdate}
            disabled={!title.trim() || !description.trim()}
            className='flex-1'
          >
            Update Issue
          </Button>
          <Button onClick={onCancel} variant='outline' className='flex-1'>
            Cancel
          </Button>
        </div>
      </div>

      {/* Car Parts Selection Modal */}
      <Modal
        isOpen={showCarPartsModal}
        onClose={() => setShowCarPartsModal(false)}
        title='Select Affected Parts'
      >
        <ScrollArea className='max-h-[60vh]'>
          <div className='space-y-6 p-4'>
            <div>
              <h4 className='mb-3 text-sm font-semibold text-foreground/80'>
                Internal Parts
              </h4>
              <div className='space-y-2'>
                {internalParts.map((part) => (
                  <div key={part.id} className='flex items-center gap-2'>
                    <Checkbox
                      checked={selectedCarParts.includes(part.id)}
                      onCheckedChange={() => handleToggleCarPart(part.id)}
                    />
                    <span className='text-sm'>{part.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className='mb-3 text-sm font-semibold text-foreground/80'>
                External Parts
              </h4>
              <div className='space-y-2'>
                {externalParts.map((part) => (
                  <div key={part.id} className='flex items-center gap-2'>
                    <Checkbox
                      checked={selectedCarParts.includes(part.id)}
                      onCheckedChange={() => handleToggleCarPart(part.id)}
                    />
                    <span className='text-sm'>{part.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <div className='mt-4 flex justify-end'>
          <Button onClick={() => setShowCarPartsModal(false)}>Done</Button>
        </div>
      </Modal>
    </div>
  );
}
