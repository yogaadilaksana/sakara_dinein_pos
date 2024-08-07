'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
    } else {
      setUser(session?.user ?? null);
      setLoading(false);
    }
  }, [session, status]);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
