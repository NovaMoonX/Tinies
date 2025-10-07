import { DreamerUIProvider } from '@moondreamsdev/dreamer-ui/providers';
import { RouterProvider } from 'react-router-dom';
import { router } from '@routes/AppRoutes';
import { AuthProvider } from '@contexts/AuthContext';

function App() {
  return (
    <DreamerUIProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </DreamerUIProvider>
  );
}

export default App;
