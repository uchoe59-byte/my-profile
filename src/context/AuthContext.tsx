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

export const ADMIN_EMAIL = 'uchoe59@gmail.com';

interface AuthContextType {
  currentUser: UserProfile | null;
  isOwner: boolean;
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
      const cleanEmail = email.trim().toLowerCase();

      // 최우혁 본인 계정 보안 인증 검증
      if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
        const customPass = localStorage.getItem('profile_owner_pass');
        const validPasswords = customPass ? [customPass] : ['8966', '01052818966', 'uchoe59', 'choi8966!'];
        
        if (!validPasswords.includes(pass.trim())) {
          throw new Error('비밀번호가 일치하지 않습니다. 본인만 아는 비밀번호를 입력해주세요.');
        }

        const user: UserProfile = {
          uid: 'owner_uchoe59',
          email: ADMIN_EMAIL,
          displayName: '최우혁 (본인 인증)',
        };
        localStorage.setItem('profile_user_session', JSON.stringify(user));
        setCurrentUser(user);
        return;
      }

      // 일반 방문자 로그인
      const usersData = JSON.parse(localStorage.getItem('profile_registered_users') || '{}');
      if (usersData[cleanEmail]) {
        if (usersData[cleanEmail].password !== pass) {
          throw new Error('비밀번호가 일치하지 않습니다.');
        }
        const user: UserProfile = {
          uid: usersData[cleanEmail].uid,
          email: cleanEmail,
          displayName: usersData[cleanEmail].name || cleanEmail.split('@')[0],
        };
        localStorage.setItem('profile_user_session', JSON.stringify(user));
        setCurrentUser(user);
        return;
      }

      throw new Error('등록되지 않은 계정입니다. 계정이 없으시면 회원가입을 이용해주세요.');
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // 관리자 계정 이메일 임의 가입 방지 (보안 조치)
    if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
      throw new Error('해당 이메일은 최우혁 본인 전용 계정입니다. 로그인을 진행해주세요.');
    }

    if (isFirebaseConfigured && auth) {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName: name });
      setCurrentUser({
        uid: res.user.uid,
        email: res.user.email,
        displayName: name,
      });
    } else {
      const usersData = JSON.parse(localStorage.getItem('profile_registered_users') || '{}');
      if (usersData[cleanEmail]) {
        throw new Error('이미 등록된 이메일입니다. 로그인을 진행해주세요.');
      }

      const newUser = {
        uid: 'user_' + Date.now(),
        email: cleanEmail,
        password: pass,
        name: name || cleanEmail.split('@')[0],
      };
      usersData[cleanEmail] = newUser;
      localStorage.setItem('profile_registered_users', JSON.stringify(usersData));

      const sessionUser: UserProfile = {
        uid: newUser.uid,
        email: cleanEmail,
        displayName: newUser.name,
      };
      localStorage.setItem('profile_user_session', JSON.stringify(sessionUser));
      setCurrentUser(sessionUser);
    }
  };

  const loginWithGoogle = async () => {
    if (isFirebaseConfigured && auth && googleProvider) {
      await signInWithPopup(auth, googleProvider);
    } else {
      throw new Error('Google OAuth 연동이 설정되지 않았습니다. 이메일 및 비밀번호로 로그인해주세요.');
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

  const isOwner = Boolean(
    currentUser?.email && currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isOwner,
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
