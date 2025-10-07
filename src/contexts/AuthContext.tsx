import { createContext, useState, useEffect } from 'react';
import { type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface AuthContextValue {
  user: User | null;
}

// Create the context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Export the context for use in hooks
export { AuthContext };

// Auth provider props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user: currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

