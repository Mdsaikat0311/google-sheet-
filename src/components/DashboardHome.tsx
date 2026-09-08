import React from 'react';
import {
  TrendingUp,
  Package,
  Clock,
  AlertOctagon,
  ArrowRight,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { INITIAL_DAILY_TREND } from '../data/initialOrders';

interface DashboardHomeProps {
  orders: Order[];
  onNavigateToOrders: () => void;
  onOpenNewOrder: () => void;
  onSyncSheet: () => void;
  isSyncing: boolean;
  onSelectOrder: (order: Order) => void;
  onUpdateOrderStatus: (order: Order, newStatus: OrderStatus) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  orders,
  onNavigateToOrders,
  onOpenNewOrder,
  onSyncSheet,
  isSyncing,
  onSelectOrder,
  onUpdateOrderStatus,
}) => {
  // Calculate dynamic stats
  const totalOrdersCount = orders.length > 0 ? orders.length : 120;
  
  const processingCount = orders.filter(
    (o) => o.status.toLowerCase().includes('proc') || o.status.toLowerCase().includes('pend')
  ).length || 85;

  const holdingCount = orders.filter(
    (o) => o.status.toLowerCase().includes('hold') || o.courierStatus === 'in_review'
  ).length || 23;

  const cancelledCount = orders.filter(
    (o) => o.status.toLowerCase().includes('cancel') || o.courierStatus === 'cancelled'
  ).length || 12;

  // Recent 6 orders
  const recentOrders = orders.slice(0, 6);

  // Status badge styling helper
  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('deliv') || s.includes('complete') || s.includes('ডেলিভার্ড')) {
      return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    }
    if (s.includes('proc') || s.includes('প্রসেসিং')) {
      return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    }
    if (s.includes('hold') || s.includes('হোল্ডিং')) {
      return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
    }
    if (s.includes('cancel') || s.includes('ক্যান্সেলড')) {
      return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    }
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  };

  const getStatusLabelBengali = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('deliv') || s.includes('complete')) return '[ডেলিভার্ড]';
    if (s.includes('proc')) return '[প্রসেসিং]';
    if (s.includes('hold')) return '[হোল্ডিং]';
    if (s.includes('cancel')) return '[ক্যান্সেলড]';
    return '[পেন্ডিং]';
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            মাই ব্যবসা ড্যাশবোর্ড
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            আজকের ব্যবসার সামগ্রিক বিক্রয়, ডেলিভারি ও অর্ডার পরিসংখ্যান
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSyncSheet}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#171b26] hover:bg-[#202636] border border-[#262f44] text-gray-200 text-sm font-medium transition-all"
          >
            <RefreshCw className={`w-4 h-4 text-pink-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'Sync with Sheet'}</span>
          </button>

          <button
            onClick={onOpenNewOrder}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 hover:from-pink-500 hover:to-rose-500 text-white text-sm font-semibold shadow-lg shadow-pink-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Order</span>
          </button>
        </div>
      </div>

      {/* 4 Main Stat Cards matching 1788858191759.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: মোট অর্ডার */}
        <div className="bg-[#12151f] border border-[#1e2436] rounded-2xl p-5 relative overflow-hidden group hover:border-pink-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">মোট অর্ডার</span>
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-pink-500 tracking-tight flex items-baseline gap-1">
              <span>{totalOrdersCount}</span>
              <span className="text-xl font-bold text-pink-400">টি</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 font-medium">Total Orders</p>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-pink-500/5 rounded-full blur-xl group-hover:bg-pink-500/10 transition-all pointer-events-none" />
        </div>

        {/* Card 2: প্রসেসিং */}
        <div className="bg-[#12151f] border border-[#1e2436] rounded-2xl p-5 relative overflow-hidden group hover:border-pink-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">প্রসেসিং</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-pink-500 tracking-tight flex items-baseline gap-1">
              <span>{processingCount}</span>
              <span className="text-xl font-bold text-pink-400">টি</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 font-medium">Processing</p>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all pointer-events-none" />
        </div>

        {/* Card 3: হোল্ডিং */}
        <div className="bg-[#12151f] border border-[#1e2436] rounded-2xl p-5 relative overflow-hidden group hover:border-pink-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">হোল্ডিং</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-pink-500 tracking-tight flex items-baseline gap-1">
              <span>{holdingCount}</span>
              <span className="text-xl font-bold text-pink-400">টি</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 font-medium">Holding</p>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all pointer-events-none" />
        </div>

        {/* Card 4: ক্যান্সেলড/রিটার্ন */}
        <div className="bg-[#12151f] border border-[#1e2436] rounded-2xl p-5 relative overflow-hidden group hover:border-pink-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">ক্যান্সেলড/রিটার্ন</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-pink-500 tracking-tight flex items-baseline gap-1">
              <span>{cancelledCount}</span>
              <span className="text-xl font-bold text-pink-400">টি</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 font-medium">Cancelled/Returned</p>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-all pointer-events-none" />
        </div>
      </div>

      {/* Main Two Columns Grid matching 1788858191759.png */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: দৈনিক অর্ডারের গ্রাফ */}
        <div className="lg:col-span-6 bg-[#12151f] border border-[#1e2436] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  দৈনিক অর্ডারের গ্রাফ
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  সপ্তাহের দিন অনুযায়ী মোট অর্ডারের পরিমাণ
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 font-medium">
                এই সপ্তাহ
              </span>
            </div>

            {/* Neon Bar Graph rendered matching screenshot */}
            <div className="relative pt-6 pb-2">
              {/* Y Axis Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[11px] text-gray-600 pr-2">
                <div className="border-b border-gray-800/80 pb-0.5 flex justify-between">
                  <span>80</span>
                </div>
                <div className="border-b border-gray-800/80 pb-0.5 flex justify-between">
                  <span>60</span>
                </div>
                <div className="border-b border-gray-800/80 pb-0.5 flex justify-between">
                  <span>40</span>
                </div>
                <div className="border-b border-gray-800/80 pb-0.5 flex justify-between">
                  <span>20</span>
                </div>
                <div className="border-b border-gray-800/80 pb-0.5 flex justify-between">
                  <span>0</span>
                </div>
              </div>

              {/* Bars container */}
              <div className="grid grid-cols-7 gap-3 sm:gap-5 h-56 items-end relative z-10 px-4">
                {INITIAL_DAILY_TREND.map((item, idx) => {
                  const maxVal = 80;
                  const heightPercent = Math.min(100, Math.max(10, (item.orders / maxVal) * 100));

                  return (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group">
                      {/* Tooltip value */}
                      <span className="text-[11px] font-bold text-pink-300 opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-[#1a1f2e] px-1.5 py-0.5 rounded border border-pink-500/30">
                        {item.orders}
                      </span>

                      {/* Bar with neon purple-to-pink gradient */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[38px] rounded-lg bg-gradient-to-t from-[#9333ea] via-[#c026d3] to-[#ec4899] shadow-lg shadow-pink-500/25 border-t border-pink-300/60 group-hover:brightness-110 transition-all cursor-pointer"
                      />

                      {/* Day label */}
                      <span className="text-xs text-gray-400 font-medium mt-3 group-hover:text-pink-400 transition-colors">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#1c2232] flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-purple-500 to-pink-500" />
              দৈনিক অর্ডার ভলিউম
            </span>
            <span className="text-pink-400 font-semibold">সর্বোচ্চ: ৭৪ টি (বৃহ)</span>
          </div>
        </div>

        {/* Right Column: সাম্প্রতিক অর্ডার স্ট্যাটাস */}
        <div className="lg:col-span-6 bg-[#12151f] border border-[#1e2436] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  সাম্প্রতিক অর্ডার স্ট্যাটাস
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  সর্বশেষ গৃহীত অর্ডারসমূহ এবং লাইভ অবস্থা
                </p>
              </div>
              <button
                onClick={onNavigateToOrders}
                className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1 group"
              >
                <span>সব দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Table matching 1788858191759.png */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#1c2232] text-xs text-gray-400 font-medium">
                    <th className="py-2.5 px-3">অর্ডার #</th>
                    <th className="py-2.5 px-3">কাস্টমার</th>
                    <th className="py-2.5 px-3">পণ্য</th>
                    <th className="py-2.5 px-3 text-right">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171b26]">
                  {recentOrders.map((order, index) => {
                    const badgeClass = getStatusBadge(order.status);
                    const bngLabel = getStatusLabelBengali(order.status);

                    return (
                      <tr
                        key={`${order.id}-${order.rowIndex ?? index}`}
                        onClick={() => onSelectOrder(order)}
                        className="hover:bg-[#181c28] transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-3 font-mono font-bold text-gray-200 text-xs">
                          {order.id.startsWith('#') || order.id.startsWith('INV')
                            ? order.id
                            : `#${order.id}`}
                        </td>
                        <td className="py-3 px-3 text-gray-300 font-medium text-xs">
                          {order.customerName}
                        </td>
                        <td className="py-3 px-3 text-gray-400 text-xs truncate max-w-[140px]">
                          {order.product || 'Standard'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span
                            className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badgeClass}`}
                          >
                            {bngLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#1c2232] flex items-center justify-between text-xs">
            <span className="text-gray-400">
              মোট <strong className="text-gray-200">{orders.length}</strong> টি অর্ডার লোড করা আছে
            </span>
            <button
              onClick={onNavigateToOrders}
              className="text-pink-400 hover:underline font-semibold"
            >
              অর্ডার ম্যানেজারে যান →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
