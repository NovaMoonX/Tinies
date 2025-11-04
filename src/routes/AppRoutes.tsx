import { createBrowserRouter } from 'react-router-dom';

import Home from '@screens/Home';
import Layout from '@ui/Layout';
import Loading from '@ui/Loading';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      // Apartment Tour Questions (lazy loaded)
      {
        path: 'apartment-tour-questions',
        HydrateFallback: Loading,
        lazy: async () => {
          const { default: ApartmentTourQuestions } = await import(
            '@tinies/apartment-tour-questions/ApartmentTourQuestions'
          );
          return { Component: ApartmentTourQuestions };
        },
      },
      // Car Maintenance (lazy loaded)
      {
        path: 'car-maintenance',
        HydrateFallback: Loading,
        lazy: async () => {
          const { default: CarMaintenance } = await import('@tinies/car-maintenance/CarMaintenance');
          return { Component: CarMaintenance };
        },
      },
      // Recipe Book (lazy loaded)
      {
        path: 'recipe-book',
        HydrateFallback: Loading,
        lazy: async () => {
          const { default: RecipeBook } = await import(
            '@tinies/recipe-book/RecipeBook'
          );
          return { Component: RecipeBook };
        },
      },
      // Travel Tracker (lazy loaded)
      {
        path: 'travel-tracker',
        HydrateFallback: Loading,
        lazy: async () => {
          const { default: TravelTracker } = await import(
            '@tinies/travel-tracker/TravelTracker'
          );
          return { Component: TravelTracker };
        },
      },
      // Personal CRM (lazy loaded)
      {
        path: 'personal-crm',
        HydrateFallback: Loading,
        lazy: async () => {
          const { default: PersonalCrm } = await import(
            '@tinies/personal-crm/PersonalCrm'
          );
          return { Component: PersonalCrm };
        },
      },
      // Notes (lazy loaded)
      {
        path: 'notes',
        HydrateFallback: Loading,
        lazy: async () => {
          const { default: Notes } = await import('@tinies/notes/Notes');
          return { Component: Notes };
        },
      },
    ],
  },
]);
