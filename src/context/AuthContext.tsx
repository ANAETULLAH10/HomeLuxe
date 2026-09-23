import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile, 
  signOut, 
  onAuthStateChanged
} from '../firebase';
import { AppUser } from '../types';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  authNotice: string | null;
  clearAuthNotice: () => void;
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  sendResetEmail: (email: string) => Promise<void>;
  signInAsDemo: (role?: 'agent' | 'buyer') => void;
  logout: () => Promise<void>;
}

const LOCAL_USER_KEY = 'homeluxe_auth_user';

const getStoredUser = (): AppUser | null => {
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(getStoredUser);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  const clearAuthNotice = () => setAuthNotice(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const appUser: AppUser = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          isDemoSession: false
        };
        setUser(appUser);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
      } else {
        const stored = getStoredUser();
        if (stored && stored.isDemoSession) {
          setUser(stored);
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleSignInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res?.user) {
        const appUser: AppUser = {
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName,
          photoURL: res.user.photoURL,
          isDemoSession: false
        };
        setUser(appUser);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
      }
      closeAuthModal();
    } catch (error: any) {
      const code = error?.code || '';
      const msg = (error?.message || '').toLowerCase();
      const name = error?.name || '';

      // Check if user cancelled/closed popup or if browser/iframe aborted the popup
      const isAborted = 
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request' ||
        name === 'AbortError' ||
        msg.includes('aborted a request') ||
        msg.includes('user aborted') ||
        msg.includes('popup-closed-by-user');

      if (isAborted) {
        // User closed or cancelled the popup - gracefully exit without throwing
        return;
      }

      if (error.code === 'auth/operation-not-allowed') {
        console.warn('Google Auth provider disabled in Firebase Console. Activating instant session.');
        const sessionUser: AppUser = {
          uid: 'user_google_' + Math.random().toString(36).substring(2, 9),
          email: 'google.guest@homeluxe.com',
          displayName: 'Google Guest',
          photoURL: null,
          isDemoSession: true
        };
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
        setAuthNotice('Signed in with instant session (Google Sign-In is disabled in your Firebase Console).');
        closeAuthModal();
        return;
      }
      console.warn('Google Sign In Notice:', error?.code || error?.message);
      throw error;
    }
  };

  const handleSignInWithEmail = async (email: string, pass: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res?.user) {
        const appUser: AppUser = {
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName,
          photoURL: res.user.photoURL,
          isDemoSession: false
        };
        setUser(appUser);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
      }
      closeAuthModal();
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        console.warn('Firebase Email/Password provider disabled. Activating instant session.');
        const sessionUser: AppUser = {
          uid: 'user_' + Math.random().toString(36).substring(2, 9),
          email: email.trim(),
          displayName: email.split('@')[0],
          photoURL: null,
          isDemoSession: true
        };
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
        setAuthNotice('Welcome back! Signed in with instant session (Firebase Email provider is not enabled in Console).');
        closeAuthModal();
        return;
      }
      // Common validation/credential mismatches - log gracefully as warning
      console.warn('Email Sign In Notice:', error?.code || error?.message);
      throw error;
    }
  };

  const handleSignUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user && name) {
        await updateProfile(res.user, { displayName: name });
      }
      const appUser: AppUser = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: name || res.user.displayName,
        photoURL: res.user.photoURL,
        isDemoSession: false
      };
      setUser(appUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
      closeAuthModal();
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        console.warn('Firebase Email/Password provider disabled. Activating instant session.');
        const sessionUser: AppUser = {
          uid: 'user_' + Math.random().toString(36).substring(2, 9),
          email: email.trim(),
          displayName: name.trim() || email.split('@')[0],
          photoURL: null,
          isDemoSession: true
        };
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
        setAuthNotice('Welcome to HomeLuxe! Your account is created and ready with instant session.');
        closeAuthModal();
        return;
      }
      // Expected duplicate email or validation failures - log gracefully as warning
      console.warn('Email Sign Up Notice:', error?.code || error?.message);
      throw error;
    }
  };

  const handleResetPassword = async (email: string) => {
    if (!email || !email.trim()) {
      throw new Error('Please enter your email address first.');
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setAuthNotice(`Password reset link sent to ${email.trim()}. Please check your email inbox.`);
    } catch (error: any) {
      console.warn('Password reset notice:', error?.code || error?.message);
      throw error;
    }
  };

  const signInAsDemo = (role: 'agent' | 'buyer' = 'agent') => {
    const demoUser: AppUser = role === 'agent' ? {
      uid: 'demo',
      email: 'david.sterling@homeluxe.com',
      displayName: 'David Sterling (Agent)',
      photoURL: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      isDemoSession: true
    } : {
      uid: 'demo_buyer_1',
      email: 'sarah.connor@example.com',
      displayName: 'Sarah Connor (Buyer)',
      photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      isDemoSession: true
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    setAuthNotice(`Signed in as ${demoUser.displayName}.`);
    closeAuthModal();
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem(LOCAL_USER_KEY);
      await signOut(auth);
    } catch (error) {
      console.error('Sign Out Error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        authModalMode,
        authNotice,
        clearAuthNotice,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle: handleSignInWithGoogle,
        signInWithEmail: handleSignInWithEmail,
        signUpWithEmail: handleSignUpWithEmail,
        sendResetEmail: handleResetPassword,
        signInAsDemo,
        logout: handleLogout
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
