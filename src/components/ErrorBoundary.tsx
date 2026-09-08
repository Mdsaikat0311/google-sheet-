import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('UI Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0c13] text-gray-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#141824] border border-[#232a3d] rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              !
            </div>
            <h1 className="text-xl font-bold mb-2">পেজ লোড হতে সমস্যা হচ্ছে</h1>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              অ্যাপ্লিকেশনটি লোড করার সময় একটি ত্রুটি ঘটেছে:
            </p>
            <div className="p-3 bg-[#0a0c13] rounded-xl text-xs font-mono text-rose-300 text-left overflow-x-auto mb-5 border border-rose-900/30">
              {this.state.error?.message || 'Unknown runtime error'}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2.5 px-4 bg-pink-600 hover:bg-pink-500 text-white font-medium rounded-xl text-sm transition-colors cursor-pointer"
            >
              পেজ রিফ্রেশ করুন
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
