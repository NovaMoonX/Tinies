import { useState } from 'react';
import {
  AddDestinationModal,
  DestinationDetails,
  DestinationSelector,
} from './TravelTracker.components';
import { useTravelTracker } from './TravelTracker.hooks';
import TinyPage from '@ui/layout/TinyPage';

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
    <TinyPage
      title='Travel Tracker'
      description="Keep track of all the places you've visited across the US and around the world. Add descriptions and photos to remember your adventures."
      maxWidth='max-w-6xl'
    >
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
    </TinyPage>
  );
}

export default TravelTracker;
