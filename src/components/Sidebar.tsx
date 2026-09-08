import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  ShoppingBag,
  Users,
  Settings,
  Store,
  FileSpreadsheet,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface SidebarProps {
  activeTab: 'home' | 'orders' | 'reports' | 'customers' | 'store' | 'sheet';
  setActiveTab: (tab: 'home' | 'orders' | 'reports' | 'customers' | 'store' | 'sheet') => void;
  user: User | null;
  onOpenSettings: () => void;
  onLogout?: () => void;
  ordersCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenSettings,
  onLogout,
  ordersCount = 0,
}) => {
  const navItems = [
    {
      id: 'home' as const,
      label: 'হোম',
      sublabel: 'Home',
      icon: LayoutDashboard,
    },
    {
      id: 'orders' as const,
      label: 'অর্ডার',
      sublabel: 'Orders',
      icon: ShoppingBag,
      badge: ordersCount > 0 ? ordersCount : undefined,
    },
    {
      id: 'reports' as const,
      label: 'রিপোর্ট',
      sublabel: 'Reports',
      icon: BarChart3,
    },
    {
      id: 'customers' as const,
      label: 'গ্রাহক',
      sublabel: 'Customers',
      icon: Users,
    },
    {
      id: 'store' as const,
      label: 'স্টোরফ্রন্ট',
      sublabel: 'Website Store',
      icon: Store,
    },
    {
      id: 'sheet' as const,
      label: 'শিট সিঙ্ক',
      sublabel: 'Google Sheet',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <aside className="w-64 bg-[#0f121a] border-r border-[#1c2230] flex flex-col h-screen shrink-0 sticky top-0">
      {/* Brand Header matching screenshot */}
      <div className="p-5 border-b border-[#1c2230] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
            <div className="grid grid-cols-2 gap-1 p-1">
              <span className="w-2 h-2 rounded-sm bg-white" />
              <span className="w-2 h-2 rounded-sm bg-white/70" />
              <span className="w-2 h-2 rounded-sm bg-white/70" />
              <span className="w-2 h-2 rounded-sm bg-white" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              মাই ব্যবসা <span className="text-xs px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30">PRO</span>
            </h1>
            <p className="text-xs text-gray-400">অর্ডার ও কুরিয়ার ড্যাশবোর্ড</p>
          </div>
        </div>
      </div>

      {/* Navigation Links matching screenshot */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium transition-all text-sm group ${
                isActive
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30 font-semibold'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-[#171b26]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-pink-400'
                  }`}
                />
                <div className="text-left">
                  <div className="leading-tight">{item.label}</div>
                  <div className={`text-[10px] ${isActive ? 'text-pink-100/80' : 'text-gray-500'}`}>
                    {item.sublabel}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white text-pink-600'
                      : 'bg-[#1c2230] text-pink-400 border border-pink-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Steadfast Courier Integration Badge */}
      <div className="p-3 mx-3 mb-3 rounded-xl bg-gradient-to-b from-[#161a25] to-[#12151e] border border-[#232a3d] p-3 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold text-gray-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Steadfast Courier
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
            Connected
          </span>
        </div>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          অর্ডার এক ক্লিকে স্টেডফাস্ট কুরিয়ারে বুকিং ও ট্র্যাক করুন
        </p>
      </div>

      {/* User Profile & Settings */}
      <div className="p-3 border-t border-[#1c2230] bg-[#0c0e15] flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Admin"
              className="w-9 h-9 rounded-full border border-pink-500/40 object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm">
              {user?.displayName ? user.displayName.charAt(0) : 'A'}
            </div>
          )}
          <div className="truncate">
            <p className="text-xs font-semibold text-gray-200 truncate">
              {user?.displayName || 'অ্যাডমিন'}
            </p>
            <p className="text-[10px] text-pink-400 font-mono truncate">
              {user ? 'Google Connected' : 'Admin [Local Mode]'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          title="শিট ও ড্যাশবোর্ড সেটিংস"
          className="p-2 text-gray-400 hover:text-pink-400 hover:bg-[#181c28] rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
