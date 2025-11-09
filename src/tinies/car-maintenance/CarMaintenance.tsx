import { useMemo, useState } from 'react';
import { Tabs, TabsContent } from '@moondreamsdev/dreamer-ui/components';
import {
  CarSelector,
  CarDetailsSection,
  AddServiceEntryForm,
  EditServiceEntryForm,
  ServiceEntryCard,
  AddIssueForm,
  EditIssueForm,
  IssueCard,
} from './CarMaintenance.components';
import { useCarMaintenance } from './CarMaintenance.hooks';
import { getServiceSummary } from './CarMaintenance.utils';
import { Issue, ServiceEntry } from './CarMaintenance.types';
import TinyPage from '@ui/layout/TinyPage';

export function CarMaintenance() {
  const {
    cars,
    selectedCar,
    serviceLocations,
    allCarParts,
    addCar,
    deleteCar,
    updateCar,
    getCar,
    setSelectedCar,
    addServiceEntry,
    deleteServiceEntry,
    updateServiceEntry,
    getServiceEntriesForCar,
    addServiceLocation,
    addIssue,
    deleteIssue,
    updateIssue,
    getIssuesForCar,
    assignIssueToServiceEntry,
    unassignIssueFromServiceEntry,
  } = useCarMaintenance();

  const [editingEntry, setEditingEntry] = useState<ServiceEntry | null>(null);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  const currentCar = selectedCar ? getCar(selectedCar) : null;
  const serviceEntries = useMemo(
    () => (selectedCar ? getServiceEntriesForCar(selectedCar) : []),
    [selectedCar, getServiceEntriesForCar],
  );
  
  const carIssues = useMemo(
    () => (selectedCar ? getIssuesForCar(selectedCar) : []),
    [selectedCar, getIssuesForCar],
  );

  const serviceSummary = useMemo(() => {
    if (!selectedCar || serviceEntries.length === 0) {
      return null;
    }

    const totalCost = serviceEntries.reduce(
      (sum, entry) => sum + (entry.cost || 0),
      0,
    );

    const result = getServiceSummary(serviceEntries.length, totalCost);
    return result;
  }, [selectedCar, serviceEntries]);

  const handleUpdateService = (
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
  ) => {
    updateServiceEntry(entryId, updates);
    setEditingEntry(null);
  };

  const handleUpdateIssue = (
    issueId: string,
    title: string,
    description: string,
    carParts: string[],
    notes: string,
  ) => {
    updateIssue(issueId, { title, description, carParts, notes });
    setEditingIssue(null);
  };

  const handleUpdateIssueStatus = (issueId: string, status: 'open' | 'resolved') => {
    updateIssue(issueId, { status });
  };

  return (
    <TinyPage
      title='Car Maintenance Tracker'
      description='Keep track of maintenance and service records for all your vehicles. Auto-detect affected parts and manage service locations.'
      maxWidth='max-w-6xl'
    >
      {/* Car Selector */}
      <CarSelector
          cars={cars}
          selectedCar={selectedCar}
          onSelectCar={setSelectedCar}
          onAddCar={addCar}
          onDeleteCar={deleteCar}
          onUpdateCar={(carId, name) => updateCar(carId, { name })}
        />

        {/* Summary Card */}
        {selectedCar && serviceSummary && (
          <div className='rounded-2xl bg-muted/30 p-6'>
            <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
              <div className='text-center sm:text-left'>
                <div className='mb-1 text-3xl font-bold'>
                  {cars.find((c) => c.id === selectedCar)?.name}
                </div>
                <div className='text-sm text-foreground/60'>{serviceSummary}</div>
              </div>
              {currentCar?.mileage !== null && currentCar?.mileage !== undefined && (
                <div className='rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary'>
                  {currentCar.mileage.toLocaleString()} mi
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        {selectedCar && currentCar ? (
          <Tabs
            defaultValue='services'
            variant='underline'
            tabsList={[
              { value: 'services', label: '🔧 Services' },
              { value: 'issues', label: '⚠️ Issues' },
              { value: 'details', label: '🚗 Details' },
            ]}
          >
            <TabsContent value='services'>
              <div className='space-y-6 pt-6'>
                {!editingEntry ? (
                  <AddServiceEntryForm
                    carId={selectedCar}
                    serviceLocations={serviceLocations}
                    allCarParts={allCarParts}
                    onAdd={addServiceEntry}
                    onAddLocation={addServiceLocation}
                  />
                ) : (
                  <EditServiceEntryForm
                    entry={editingEntry}
                    serviceLocations={serviceLocations}
                    allCarParts={allCarParts}
                    onUpdate={handleUpdateService}
                    onCancel={() => setEditingEntry(null)}
                    onAddLocation={addServiceLocation}
                  />
                )}

                {serviceEntries.length > 0 ? (
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>Service History</h3>
                    <div className='space-y-3'>
                      {serviceEntries.map((entry) => {
                        const location = serviceLocations.find(
                          (loc) => loc.id === entry.locationId,
                        );
                        return (
                          <ServiceEntryCard
                            key={entry.id}
                            entry={entry}
                            location={location}
                            allCarParts={allCarParts}
                            issues={carIssues}
                            onDelete={deleteServiceEntry}
                            onEdit={setEditingEntry}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className='rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center'>
                    <div className='space-y-2 text-foreground/60'>
                      <p className='text-lg font-medium'>No service entries yet</p>
                      <p className='text-sm'>
                        Add your first service entry to start tracking maintenance
                        for this vehicle.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value='issues'>
              <div className='space-y-6 pt-6'>
                {!editingIssue ? (
                  <AddIssueForm
                    carId={selectedCar}
                    allCarParts={allCarParts}
                    onAdd={addIssue}
                  />
                ) : (
                  <EditIssueForm
                    issue={editingIssue}
                    allCarParts={allCarParts}
                    onUpdate={handleUpdateIssue}
                    onCancel={() => setEditingIssue(null)}
                  />
                )}

                {carIssues.length > 0 ? (
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>Reported Issues</h3>
                    <div className='space-y-3'>
                      {carIssues.map((issue) => (
                        <IssueCard
                          key={issue.id}
                          issue={issue}
                          allCarParts={allCarParts}
                          serviceEntries={serviceEntries}
                          onDelete={deleteIssue}
                          onUpdateStatus={handleUpdateIssueStatus}
                          onEdit={setEditingIssue}
                          onAssignToServiceEntry={assignIssueToServiceEntry}
                          onUnassignFromServiceEntry={unassignIssueFromServiceEntry}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className='rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center'>
                    <div className='space-y-2 text-foreground/60'>
                      <p className='text-lg font-medium'>No issues reported yet</p>
                      <p className='text-sm'>
                        Report any issues you notice with your vehicle, and assign them to service entries when they're addressed.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value='details'>
              <div className='pt-6'>
                <CarDetailsSection
                  car={currentCar}
                  onUpdate={(updates) => updateCar(selectedCar, updates)}
                />
              </div>
            </TabsContent>
          </Tabs>
        ) : cars.length > 0 ? (
          <div className='rounded-2xl bg-muted/30 p-12 text-center'>
            <div className='space-y-2 text-foreground/60'>
              <p className='text-lg font-medium'>Select a vehicle to continue</p>
              <p className='text-sm'>
                Choose a vehicle above to view and manage its service records.
              </p>
            </div>
          </div>
        ) : (
          <div className='rounded-2xl bg-muted/30 p-12 text-center'>
            <div className='space-y-2 text-foreground/60'>
              <p className='text-lg font-medium'>
                Ready to track your car maintenance?
              </p>
              <p className='text-sm'>
                Add a vehicle above to start tracking service records.
              </p>
            </div>
          </div>
        )}
    </TinyPage>
  );
}

export default CarMaintenance;
