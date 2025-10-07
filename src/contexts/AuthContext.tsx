import { AuthContext } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
import { type User } from 'firebase/auth';
import { useEffect, useState } from 'react';

export interface AuthContextValue {
  user: User | null;
}
interface AuthProviderProps {
  children: React.ReactNode;
}

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
}
