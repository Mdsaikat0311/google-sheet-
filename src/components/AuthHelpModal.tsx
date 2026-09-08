import React, { useState } from 'react';
import {
  AlertTriangle,
  Copy,
  Check,
  X,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  KeyRound,
  FileSpreadsheet,
} from 'lucide-react';

interface AuthHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain?: string;
  errorMessage?: string;
  onUsePublicMode: () => void;
  onSaveManualToken: (token: string) => void;
}

export const AuthHelpModal: React.FC<AuthHelpModalProps> = ({
  isOpen,
  onClose,
  domain = typeof window !== 'undefined' ? window.location.hostname : '',
  errorMessage,
  onUsePublicMode,
  onSaveManualToken,
}) => {
  const [copied, setCopied] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  if (!isOpen) return null;

  const currentDomain = domain || (typeof window !== 'undefined' ? window.location.hostname : 'localhost');

  const handleCopyDomain = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentDomain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSaveToken = () => {
    if (manualToken.trim()) {
      onSaveManualToken(manualToken.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#111420] border border-[#232a3d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#1c2232] flex items-center justify-between bg-[#0d101a]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                গুগল সাইন-ইন সমস্যা ও সমাধান
              </h3>
              <p className="text-[11px] text-gray-400">
                লগইন পপ-আপ স্বয়ংক্রিয়ভাবে বন্ধ হওয়ার কারণ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1c2232] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-300 leading-relaxed">
          {/* Diagnostic Note */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200/90 space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300 text-xs">
                  পপ-আপ কেন হালকা এসে আবার চলে যাচ্ছে?
                </p>
                <p className="text-[11px] text-amber-200/80 mt-1">
                  গুগল এবং Firebase-এর কড়া নিরাপত্তা নিয়মের কারণে, কোনো নতুন ওয়েবসাইট (যেমন আপনার GitHub Pages) থেকে লগইন করার আগে সেই ডোমেইনটিকে Firebase Console-এ <strong>Authorized Domain</strong> হিসেবে যুক্ত করতে হয়। অন্যথায় গুগল নিরাপত্তার স্বার্থে পপ-আপ উইন্ডোটি তৎক্ষণাৎ বন্ধ করে দেয়।
                </p>
              </div>
            </div>
          </div>

          {/* Current Domain Box */}
          <div className="p-3.5 rounded-xl bg-[#161a27] border border-[#232a3d] space-y-2">
            <span className="text-[11px] font-semibold text-gray-400">
              আপনার বর্তমান ওয়েবসাইট ডোমেইন:
            </span>
            <div className="flex items-center justify-between gap-2 bg-[#0c0e17] px-3.5 py-2 rounded-lg border border-[#2b354e]">
              <code className="text-pink-400 font-mono text-xs select-all">
                {currentDomain}
              </code>
              <button
                onClick={handleCopyDomain}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-pink-600/20 text-pink-300 border border-pink-500/30 hover:bg-pink-600/30 transition-colors font-medium text-[11px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
              </button>
            </div>
          </div>

          {/* Quick Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
              আপনার জন্য তাৎক্ষণিক সমাধানসমূহ:
            </h4>

            {/* Option 1: Public Mode (Recommended) */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-[#141926] border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  বিকল্প ১: সবচেয়ে সহজ (১ ক্লিকে চালু)
                </span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-xs">
                  পাবলিক গুগল শিট মোড (সাইন-ইন ছাড়াই লাইভ ডাটা)
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  আপনার গুগল শিটটি 'Anyone with link can view' করা থাকলে আপনি কোনো লগইন বা ডোমেইন ভেরিফিকেশন ছাড়াই সরাসরি সব লাইভ অর্ডার দেখতে ও সিঙ্ক করতে পারবেন।
                </p>
              </div>
              <button
                onClick={() => {
                  onUsePublicMode();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-950/50"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>সাইন-ইন ছাড়াই লাইভ শিট সিঙ্ক করুন</span>
              </button>
            </div>

            {/* Option 2: Add Domain in Firebase */}
            <div className="p-3.5 rounded-xl bg-[#161a27] border border-[#232a3d] space-y-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold">
                বিকল্প ২: ফায়ারবেসে ডোমেইন যুক্ত করুন (স্থায়ী সাইন-ইন)
              </span>
              <p className="text-[11px] text-gray-400">
                ১. Firebase Console এ যান: <strong>Authentication &gt; Settings &gt; Authorized domains</strong><br />
                ২. <strong>Add domain</strong> এ ক্লিক করে <code>{currentDomain}</code> পেস্ট করে Save করুন।<br />
                ৩. এরপর পেজটি রিফ্রেশ করে সাইন-ইন বাটনে ক্লিক করলেই গুগল লগইন সফল হবে!
              </p>
            </div>

            {/* Option 3: Manual Access Token */}
            <div className="p-3.5 rounded-xl bg-[#161a27] border border-[#232a3d] space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-bold">
                  বিকল্প ৩: ম্যানুয়াল এক্সেস টোকেন
                </span>
                <button
                  onClick={() => setShowManualInput(!showManualInput)}
                  className="text-purple-400 hover:text-purple-300 text-[11px] font-medium"
                >
                  {showManualInput ? 'লুকান' : 'টোকেন বসান'}
                </button>
              </div>

              {showManualInput && (
                <div className="space-y-2 pt-1">
                  <input
                    type="password"
                    placeholder="OAuth Access Token (ya29...)"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    className="w-full bg-[#0d101a] border border-[#2b354e] rounded-lg px-3 py-2 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={handleSaveToken}
                    disabled={!manualToken.trim()}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold transition-colors text-[11px]"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>টোকেন সংরক্ষণ করুন</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1c2232] flex items-center justify-end bg-[#0d101a]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1b202e] hover:bg-[#252c3f] border border-[#283247] text-gray-300 font-semibold transition-colors"
          >
            বুঝেছি, বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
