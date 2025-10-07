import { AuthContext, AuthContextValue } from '@contexts/AuthContext';
import { useContext } from 'react';

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
