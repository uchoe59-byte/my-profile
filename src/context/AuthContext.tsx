import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: (name?: string) => void;
  logout: () => Promise<void>;
  isFirebaseMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || '사용자',
            photoURL: user.photoURL,
          });
        } else {
          // Check local guest session
          const savedLocal = localStorage.getItem('profile_user_session');
          if (savedLocal) {
            try {
              setCurrentUser(JSON.parse(savedLocal));
            } catch {
              setCurrentUser(null);
            }
          } else {
            setCurrentUser(null);
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Local storage fallback mode
      const savedUser = localStorage.getItem('profile_user_session');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      // Local Mock Login
      const user: UserProfile = {
        uid: 'user_' + Date.now(),
        email,
        displayName: email.split('@')[0],
      };
      localStorage.setItem('profile_user_session', JSON.stringify(user));
      setCurrentUser(user);
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    if (isFirebaseConfigured && auth) {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName: name });
      setCurrentUser({
        uid: res.user.uid,
        email: res.user.email,
        displayName: name,
      });
    } else {
      // Local Mock Signup
      const user: UserProfile = {
        uid: 'user_' + Date.now(),
        email,
        displayName: name || email.split('@')[0],
      };
      localStorage.setItem('profile_user_session', JSON.stringify(user));
      setCurrentUser(user);
    }
  };

  const loginWithGoogle = async () => {
    if (isFirebaseConfigured && auth && googleProvider) {
      await signInWithPopup(auth, googleProvider);
    } else {
      // Local Mock Google Login
      const user: UserProfile = {
        uid: 'google_' + Date.now(),
        email: 'google_user@example.com',
        displayName: '구글 간편 사용자',
      };
      localStorage.setItem('profile_user_session', JSON.stringify(user));
      setCurrentUser(user);
    }
  };

  const loginAsGuest = (name: string = '방문 게스트') => {
    const user: UserProfile = {
      uid: 'guest_' + Math.random().toString(36).substring(2, 9),
      email: null,
      displayName: name,
      isGuest: true,
    };
    localStorage.setItem('profile_user_session', JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await fbSignOut(auth);
    }
    localStorage.removeItem('profile_user_session');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        loginAsGuest,
        logout,
        isFirebaseMode: isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
