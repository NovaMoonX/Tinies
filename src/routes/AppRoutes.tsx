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
      // About page (lazy loaded)
      {
        path: 'about',
        HydrateFallback: Loading,
        lazy: async () => {
          const { default: About } = await import('@screens/About');
          return { Component: About };
        },
      },
      // Apartment Tour Questions (lazy loaded)
      {
        path: 'apartment-tour-questions',
        HydrateFallback: Loading,
        lazy: async () => {
          const { default: ApartmentTourQuestions } = await import('@tinies/apartment-tour-questions/ApartmentTourQuestions');
          return { Component: ApartmentTourQuestions };
        },
      },
      // Recipe Book (lazy loaded)
      {
        path: 'recipe-book',
        HydrateFallback: Loading,
        lazy: async () => {
          const { default: RecipeBook } = await import('@tinies/recipe-book/RecipeBook');
          return { Component: RecipeBook };
        },
      },
    ],
  },
]);
