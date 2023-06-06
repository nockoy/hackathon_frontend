
import { createContext, useState, useContext, useEffect } from 'react';
import { fireAuth } from './../firebase';
import { User } from 'firebase/auth';


const AuthContext = createContext<{ user: User | null; loading: boolean; }>({ user: null, loading: true });

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const value : {
    user: User | null,
    loading: boolean,
  } = {user, loading};

  useEffect(() => {
    const unsubscribed = fireAuth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => {
      unsubscribed();
    };
  }, []);

  if (loading) {
    return <p>loading...</p>;
  } else {
    return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    );
  }
}
