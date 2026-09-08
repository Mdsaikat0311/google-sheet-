import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  ExternalLink,
  Check,
  RefreshCw,
  ShieldCheck,
  Key,
  LogOut,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { GoogleSignInButton } from './GoogleSignInButton';

interface SheetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  spreadsheetId: string;
  onUpdateSpreadsheetId: (id: string) => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isAuthLoading: boolean;
  onSyncNow: () => void;
  isSyncing: boolean;
}

export const SheetSettingsModal: React.FC<SheetSettingsModalProps> = ({
  isOpen,
  onClose,
  spreadsheetId,
  onUpdateSpreadsheetId,
  user,
  onSignIn,
  onSignOut,
  isAuthLoading,
  onSyncNow,
  isSyncing,
}) => {
  const [inputVal, setInputVal] = useState(spreadsheetId);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSpreadsheetId(inputVal.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#121520] border border-[#22293d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#1c2232] flex items-center justify-between bg-[#0e111a]">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              গুগল শিট কানেকশন ও সেটিংস
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1c2232] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Account Status */}
          <div className="p-4 rounded-xl bg-[#161a26] border border-[#232b3e] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-300">গুগল অ্যাকাউন্ট স্ট্যাটাস</span>
              {user ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  সংযুক্ত (Connected)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                  Local Preview Mode
                </span>
              )}
            </div>

            {user ? (
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-gray-200 font-semibold">{user.displayName || 'Google User'}</p>
                  <p className="text-gray-500 text-[11px]">{user.email}</p>
                </div>
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors text-[11px] font-semibold"
                >
                  <LogOut className="w-3 h-3" />
                  লগআউট
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 mb-2 leading-relaxed">
                  গুগল শিটে সরাসরি অর্ডার পড়া ও আপডেট করতে গুগল সাইন-ইন করুন:
                </p>
                <GoogleSignInButton
                  onSignIn={onSignIn}
                  isLoading={isAuthLoading}
                />
              </div>
            )}
          </div>

          {/* Spreadsheet ID Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Google Spreadsheet ID
            </label>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="গুগল শিট আইডি বা লিংক..."
              className="w-full bg-[#181c29] border border-[#262f44] rounded-xl px-3.5 py-2 text-xs font-mono text-pink-400 focus:outline-none focus:border-pink-500"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              ডিফল্ট শিট: 1aHUCGINJ8rB29rXXckH7uMTwrk163v6aQFTfQ6ptr6M
            </p>
          </div>

          {/* Link to Open in Google Sheets */}
          <a
            href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#1a2030] hover:bg-[#232b40] border border-[#2d3752] text-gray-200 font-semibold transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-emerald-400" />
            <span>গুগল শিট ব্রাউজারে খুলুন</span>
          </a>

          {/* Sync Trigger */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1c2232]">
            <button
              onClick={onSyncNow}
              disabled={isSyncing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1b202e] hover:bg-[#252c3f] border border-[#29334a] text-gray-300 font-medium transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-pink-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'এখনই শিট রিফ্রেশ করুন'}</span>
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold transition-colors"
            >
              সংরক্ষণ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
