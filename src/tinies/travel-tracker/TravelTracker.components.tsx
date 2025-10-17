import {
  Button,
  Calendar,
  Input,
  Label,
  Modal,
  Popover,
  Select,
  Textarea,
} from '@moondreamsdev/dreamer-ui/components';
import { Plus, X } from '@moondreamsdev/dreamer-ui/symbols';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { useState } from 'react';
import { US_STATES, COUNTRIES } from './TravelTracker.data';
import { Destination, DestinationType } from './TravelTracker.types';

interface AddDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: DestinationType, name: string, country: string | null) => void;
  existingDestinations: Destination[];
}

export function AddDestinationModal({
  isOpen,
  onClose,
  onAdd,
  existingDestinations,
}: AddDestinationModalProps) {
  const [type, setType] = useState<DestinationType>('us-state');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [cityName, setCityName] = useState<string>('');

  const handleAdd = () => {
    if (type === 'us-state' && selectedState) {
      onAdd(type, selectedState, null);
      setSelectedState('');
      onClose();
    } else if (type === 'international-city' && cityName && selectedCountry) {
      onAdd(type, cityName, selectedCountry);
      setCityName('');
      setSelectedCountry('');
      onClose();
    }
  };

  const isStateVisited = (state: string) => {
    const result = existingDestinations.some(
      (d) => d.type === 'us-state' && d.name === state
    );
    return result;
  };

  const availableStates = US_STATES.filter((state) => !isStateVisited(state));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Destination">
      <div className="space-y-4">
        <div>
          <Label htmlFor="destination-type">Destination Type</Label>
          <Select
            id="destination-type"
            value={type}
            onChange={(value: string) => setType(value as DestinationType)}
            options={[
              { text: 'US State', value: 'us-state' },
              { text: 'International City', value: 'international-city' },
            ]}
          />
        </div>

        {type === 'us-state' ? (
          <div>
            <Label htmlFor="state">State</Label>
            <Select
              id="state"
              value={selectedState}
              onChange={setSelectedState}
              options={availableStates.map((state) => ({
                text: state,
                value: state,
              }))}
              placeholder="Select a state..."
            />
          </div>
        ) : (
          <>
            <div>
              <Label htmlFor="country">Country</Label>
              <Select
                id="country"
                value={selectedCountry}
                onChange={setSelectedCountry}
                options={COUNTRIES.map((country) => ({
                  text: country,
                  value: country,
                }))}
                placeholder="Select a country..."
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="Enter city name..."
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={
              (type === 'us-state' && !selectedState) ||
              (type === 'international-city' && (!cityName || !selectedCountry))
            }
          >
            <Plus className="h-4 w-4" />
            Add Destination
          </Button>
        </div>
      </div>
    </Modal>
  );
}

interface DestinationSelectorProps {
  destinations: Destination[];
  selectedDestination: string | null;
  onSelectDestination: (id: string | null) => void;
  onAddDestination: () => void;
  onDeleteDestination: (id: string) => void;
}

export function DestinationSelector({
  destinations,
  selectedDestination,
  onSelectDestination,
  onAddDestination,
  onDeleteDestination,
}: DestinationSelectorProps) {
  const usStates = destinations.filter((d) => d.type === 'us-state');
  const internationalCities = destinations.filter((d) => d.type === 'international-city');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Destinations</h2>
        <Button onClick={onAddDestination} size="sm" variant="outline">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {destinations.length === 0 ? (
        <div className="border border-dashed border-foreground/20 rounded-lg p-8 text-center">
          <p className="text-foreground/50 text-sm">
            No destinations yet. Click "Add" to start tracking your travels!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* US States Section */}
          {usStates.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground/70">US States</h3>
                <span className="text-xs text-foreground/50">
                  {usStates.length} / {US_STATES.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {usStates.map((dest) => (
                  <button
                    key={dest.id}
                    onClick={() => onSelectDestination(dest.id)}
                    className={join(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-all group relative',
                      selectedDestination === dest.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    )}
                  >
                    {dest.name}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDestination(dest.id);
                      }}
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      ×
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* International Cities Section */}
          {internationalCities.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground/70">International</h3>
                <span className="text-xs text-foreground/50">
                  {internationalCities.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {internationalCities.map((dest) => (
                  <button
                    key={dest.id}
                    onClick={() => onSelectDestination(dest.id)}
                    className={join(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-all group relative',
                      selectedDestination === dest.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    )}
                  >
                    <span>{dest.name}</span>
                    <span className="text-xs ml-1 opacity-70">{dest.country}</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDestination(dest.id);
                      }}
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      ×
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface DestinationDetailsProps {
  destination: Destination;
  onUpdateDescription: (description: string) => void;
  onUpdateVisitDate: (visitDate: string) => void;
  onAddPhoto: (url: string, caption: string) => void;
  onDeletePhoto: (photoId: string) => void;
  onUpdatePhotoCaption: (photoId: string, caption: string) => void;
}

export function DestinationDetails({
  destination,
  onUpdateDescription,
  onUpdateVisitDate,
  onAddPhoto,
  onDeletePhoto,
  onUpdatePhotoCaption,
}: DestinationDetailsProps) {
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [editingCaption, setEditingCaption] = useState<string | null>(null);

  const handleAddPhoto = () => {
    if (newPhotoUrl) {
      onAddPhoto(newPhotoUrl, newPhotoCaption);
      setNewPhotoUrl('');
      setNewPhotoCaption('');
      setShowAddPhotoModal(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    const isoDate = date.toISOString().split('T')[0];
    onUpdateVisitDate(isoDate);
    setShowCalendar(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const result = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return result;
  };

  return (
    <div className="space-y-4">
      {/* Simplified destination header */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-bold">
            {destination.name}
          </h2>
          {destination.country && (
            <span className="text-foreground/50 text-base">
              {destination.country}
            </span>
          )}
        </div>
        
        {/* Visit date with calendar popover */}
        <Popover
          isOpen={showCalendar}
          onOpenChange={setShowCalendar}
          trigger={
            <Button
              variant="outline"
              size="sm"
            >
              📅 {formatDate(destination.visitDate)}
            </Button>
          }
        >
          <Calendar
            mode="single"
            initialDate={new Date(destination.visitDate)}
            onDateSelect={handleDateSelect}
          />
        </Popover>
      </div>

      {/* Description */}
      <div>
        <Textarea
          placeholder="Add notes about your visit..."
          rows={3}
          value={destination.description}
          onChange={(e) => onUpdateDescription(e.target.value)}
          variant="outline"
        />
      </div>

      {/* Photos section with cleaner layout */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Photos</h3>
          <Button onClick={() => setShowAddPhotoModal(true)} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        {destination.photos.length === 0 ? (
          <div className="border border-dashed border-foreground/20 rounded-lg p-8 text-center">
            <p className="text-foreground/50 text-sm">
              No photos yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {destination.photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.url}
                  alt={photo.caption || 'Travel photo'}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeletePhoto(photo.id)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <X className="h-3 w-3" />
                </Button>
                {editingCaption === photo.id ? (
                  <Input
                    value={photo.caption}
                    onChange={(e) => onUpdatePhotoCaption(photo.id, e.target.value)}
                    placeholder="Caption..."
                    autoFocus
                    onBlur={() => setEditingCaption(null)}
                    className="mt-1 text-xs"
                  />
                ) : (
                  <p
                    className="text-xs text-foreground/60 mt-1 cursor-pointer hover:text-foreground line-clamp-2"
                    onClick={() => setEditingCaption(photo.id)}
                  >
                    {photo.caption || 'Add caption...'}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add photo modal */}
      <Modal
        isOpen={showAddPhotoModal}
        onClose={() => setShowAddPhotoModal(false)}
        title="Add Photo"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="photo-url">Photo URL</Label>
            <Input
              id="photo-url"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          <div>
            <Label htmlFor="photo-caption">Caption (optional)</Label>
            <Input
              id="photo-caption"
              value={newPhotoCaption}
              onChange={(e) => setNewPhotoCaption(e.target.value)}
              placeholder="Add a caption..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddPhotoModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPhoto} disabled={!newPhotoUrl}>
              <Plus className="h-4 w-4" />
              Add Photo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
