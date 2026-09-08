import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
  Auth,
} from 'firebase/auth';
import { getFirebaseConfig } from './firebaseConfig';

let app: FirebaseApp | null = null;
export let auth: Auth | null = null;

try {
  const firebaseConfig = getFirebaseConfig();
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
} catch (error) {
  console.warn('Firebase initialization bypassed:', error);
}

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.setCustomParameters({
  prompt: 'select_account',
});

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export class AuthDomainError extends Error {
  code: string;
  domain: string;
  constructor(domain: string, code: string = 'auth/unauthorized-domain') {
    super(`ডোমেইন ${domain} Firebase-এ অনুমোদিত নয়।`);
    this.name = 'AuthDomainError';
    this.code = code;
    this.domain = domain;
  }
}

const STORAGE_KEY = 'custom_google_access_token';

export const getSavedManualToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
};

export const saveManualToken = (token: string) => {
  cachedAccessToken = token;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, token);
  }
};

export const clearManualToken = () => {
  cachedAccessToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  const savedToken = getSavedManualToken();
  if (savedToken) {
    cachedAccessToken = savedToken;
  }

  if (!auth) {
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const activeToken = cachedAccessToken || savedToken;
      if (activeToken) {
        if (onAuthSuccess) onAuthSuccess(user, activeToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      if (!savedToken) {
        cachedAccessToken = null;
      }
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  if (!auth) {
    throw new Error('Firebase Auth is not available in this environment');
  }
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Google Auth');
    }

    cachedAccessToken = credential.accessToken;
    saveManualToken(cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'domain';
    
    // Check if error is unauthorized domain or closed popup caused by domain restriction
    if (
      error?.code === 'auth/unauthorized-domain' ||
      (error?.message && error.message.includes('unauthorized-domain')) ||
      (error?.code === 'auth/popup-closed-by-user' && !currentDomain.includes('localhost') && !currentDomain.includes('run.app'))
    ) {
      throw new AuthDomainError(currentDomain, error?.code || 'auth/unauthorized-domain');
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken || getSavedManualToken();
};

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
  if (token) {
    saveManualToken(token);
  } else {
    clearManualToken();
  }
};

export const logout = async () => {
  if (auth) {
    await signOut(auth);
  }
  clearManualToken();
};
