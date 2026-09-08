// Fallback and typed config loader for Firebase Auth
export interface AppFirebaseConfig {
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  storageBucket: string;
  messagingSenderId: string;
}

export const getFirebaseConfig = (): AppFirebaseConfig => {
  return {
    projectId: "gen-lang-client-0807662495",
    appId: "1:405588514083:web:969f8f823621f60ce7e896",
    apiKey: "AIzaSyDZZWvZvIHh9eyeaWpf_AYghyjHW8dZ1gA",
    authDomain: "gen-lang-client-0807662495.firebaseapp.com",
    storageBucket: "gen-lang-client-0807662495.firebasestorage.app",
    messagingSenderId: "405588514083",
  };
};
