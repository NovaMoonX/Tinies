import {
  Badge,
  Button,
  Card,
  Input,
  Label,
  Modal,
  Select,
  Textarea,
} from '@moondreamsdev/dreamer-ui/components';
import { CheckCircled, Plus, Trash, X } from '@moondreamsdev/dreamer-ui/symbols';
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Your Destinations</h2>
        <Button onClick={onAddDestination} size="sm">
          <Plus className="h-4 w-4" />
          Add Destination
        </Button>
      </div>

      {destinations.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-foreground/60">
            No destinations added yet. Click "Add Destination" to get started!
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* US States Section */}
          {usStates.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">US States</h3>
                <Badge variant="secondary" size="sm">
                  {usStates.length} / {US_STATES.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {usStates.map((dest) => (
                  <div
                    key={dest.id}
                    className={join(
                      'cursor-pointer transition-all group',
                    )}
                    onClick={() => onSelectDestination(dest.id)}
                  >
                    <Card
                      className={join(
                        'p-3',
                        selectedDestination === dest.id
                          ? 'ring-2 ring-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircled className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">{dest.name}</span>
                        </div>
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDestination(dest.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* International Cities Section */}
          {internationalCities.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">International Cities</h3>
                <Badge variant="secondary" size="sm">
                  {internationalCities.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {internationalCities.map((dest) => (
                  <div
                    key={dest.id}
                    className={join(
                      'cursor-pointer transition-all group',
                    )}
                    onClick={() => onSelectDestination(dest.id)}
                  >
                    <Card
                      className={join(
                        'p-3',
                        selectedDestination === dest.id
                          ? 'ring-2 ring-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CheckCircled className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">{dest.name}</span>
                          </div>
                          <p className="text-xs text-foreground/60 ml-6">{dest.country}</p>
                        </div>
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDestination(dest.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  </div>
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

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {destination.name}
              {destination.country && (
                <span className="text-foreground/60 text-lg ml-2">
                  • {destination.country}
                </span>
              )}
            </h2>
            <Badge variant={destination.type === 'us-state' ? 'primary' : 'secondary'}>
              {destination.type === 'us-state' ? 'US State' : 'International City'}
            </Badge>
          </div>

          <div>
            <Label htmlFor="visit-date">Visit Date</Label>
            <Input
              id="visit-date"
              type="date"
              value={destination.visitDate}
              onChange={(e) => onUpdateVisitDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add notes about your visit..."
              rows={4}
              value={destination.description}
              onChange={(e) => onUpdateDescription(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Photos</h3>
          <Button onClick={() => setShowAddPhotoModal(true)} size="sm">
            <Plus className="h-4 w-4" />
            Add Photo
          </Button>
        </div>

        {destination.photos.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-foreground/60">
              No photos added yet. Click "Add Photo" to upload your memories!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {destination.photos.map((photo) => (
              <Card key={photo.id} className="p-3 space-y-2">
                <div className="relative group">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Travel photo'}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeletePhoto(photo.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {editingCaption === photo.id ? (
                  <div className="space-y-2">
                    <Input
                      value={photo.caption}
                      onChange={(e) => onUpdatePhotoCaption(photo.id, e.target.value)}
                      placeholder="Add a caption..."
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => setEditingCaption(null)}
                      className="w-full"
                    >
                      Done
                    </Button>
                  </div>
                ) : (
                  <p
                    className="text-sm text-foreground/70 cursor-pointer hover:text-foreground"
                    onClick={() => setEditingCaption(photo.id)}
                  >
                    {photo.caption || 'Click to add caption...'}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

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
