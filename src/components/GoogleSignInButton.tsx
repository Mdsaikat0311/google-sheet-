import React from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { User } from 'firebase/auth';

interface GoogleSignInButtonProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  loading?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  user,
  onSignIn,
  onSignOut,
  loading = false,
}) => {
  if (user) {
    return (
      <div id="user-auth-badge" className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 py-1.5 px-3 rounded-full border border-stone-200 dark:border-stone-700">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-6 h-6 rounded-full object-cover border border-stone-300"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-semibold">
            {user.displayName?.[0] || 'U'}
          </div>
        )}
        <span className="text-xs font-medium text-stone-700 dark:text-stone-200 max-w-[120px] truncate hidden sm:inline">
          {user.displayName || user.email}
        </span>
        <button
          id="btn-signout"
          onClick={onSignOut}
          title="Sign out"
          className="text-stone-500 hover:text-rose-600 transition-colors ml-1 p-0.5"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      id="btn-google-signin"
      type="button"
      onClick={onSignIn}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2.5 px-4 py-2 bg-white text-stone-700 hover:bg-stone-50 border border-stone-300 rounded-lg shadow-sm text-sm font-medium transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      </svg>
      <span>{loading ? 'Connecting...' : 'Sign in with Google'}</span>
    </button>
  );
};
