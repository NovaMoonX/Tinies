import { Button } from '@moondreamsdev/dreamer-ui/components';
import { useState } from 'react';
import {
  AddDestinationModal,
  DestinationDetails,
  DestinationSelector,
} from './TravelTracker.components';
import { useTravelTracker } from './TravelTracker.hooks';

export function TravelTracker() {
  const {
    destinations,
    selectedDestination,
    setSelectedDestination,
    addDestination,
    deleteDestination,
    updateDescription,
    updateVisitDate,
    addPhoto,
    deletePhoto,
    updatePhotoCaption,
    getDestination,
  } = useTravelTracker();

  const [showAddModal, setShowAddModal] = useState(false);

  const selectedDestinationData = selectedDestination
    ? getDestination(selectedDestination)
    : null;

  return (
    <div className="tiny-page">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold md:text-4xl">Travel Tracker</h1>
          <p className="text-foreground/70 mx-auto max-w-2xl text-sm md:text-base">
            Keep track of all the places you've visited across the US and around
            the world. Add descriptions and photos to remember your adventures.
          </p>
        </div>

        {/* Destination Selector */}
        <DestinationSelector
          destinations={destinations}
          selectedDestination={selectedDestination}
          onSelectDestination={setSelectedDestination}
          onAddDestination={() => setShowAddModal(true)}
        />

        {/* Destination Details */}
        {selectedDestinationData && (
          <DestinationDetails
            destination={selectedDestinationData}
            onUpdateDescription={(description) =>
              updateDescription(selectedDestinationData.id, description)
            }
            onUpdateVisitDate={(visitDate) =>
              updateVisitDate(selectedDestinationData.id, visitDate)
            }
            onAddPhoto={(url, caption) =>
              addPhoto(selectedDestinationData.id, url, caption)
            }
            onDeletePhoto={(photoId) =>
              deletePhoto(selectedDestinationData.id, photoId)
            }
            onUpdatePhotoCaption={(photoId, caption) =>
              updatePhotoCaption(selectedDestinationData.id, photoId, caption)
            }
            onDeleteDestination={() =>
              deleteDestination(selectedDestinationData.id)
            }
          />
        )}

        {/* Add Destination Modal */}
        <AddDestinationModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={addDestination}
          existingDestinations={destinations}
        />

        {/* Footer */}
        <div className="pt-4 pb-8 text-center">
          <Button href="/" variant="outline">
            ← Back to Gallery
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TravelTracker;
