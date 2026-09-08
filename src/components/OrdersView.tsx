import React, { useState } from 'react';
import {
  Search,
  Plus,
  RefreshCw,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ExternalLink,
  ChevronDown,
  Phone,
  MapPin,
  FileSpreadsheet,
  Rocket,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrdersViewProps {
  orders: Order[];
  onOpenNewOrder: () => void;
  onSyncSheet: () => void;
  isSyncing: boolean;
  onSelectOrder: (order: Order) => void;
  onUpdateOrderStatus: (order: Order, newStatus: OrderStatus) => void;
  onSendToSteadfast: (order: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onOpenNewOrder,
  onSyncSheet,
  isSyncing,
  onSelectOrder,
  onUpdateOrderStatus,
  onSendToSteadfast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'processing' | 'steadfast' | 'delivered' | 'cancelled'>('all');
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState<string | null>(null);

  // Filtering
  const filteredOrders = orders.filter((order) => {
    // Search query filter
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.toLowerCase().includes(q);
      const matchId = order.id.toLowerCase().includes(q);
      const matchProd = (order.product || '').toLowerCase().includes(q);
      const matchAddr = (order.customerAddress || '').toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchId && !matchProd && !matchAddr) {
        return false;
      }
    }

    // Tab filter
    const status = order.status.toLowerCase();
    if (activeFilter === 'pending') {
      return status.includes('pend') || order.courierStatus === 'pending';
    }
    if (activeFilter === 'processing') {
      return status.includes('proc') || status.includes('conf') || order.courierStatus === 'processing';
    }
    if (activeFilter === 'steadfast') {
      return (
        (order.steadfastStatus && order.steadfastStatus.toLowerCase().includes('sent')) ||
        Boolean(order.trackingCode)
      );
    }
    if (activeFilter === 'delivered') {
      return status.includes('deliv') || status.includes('comp') || order.courierStatus === 'delivered';
    }
    if (activeFilter === 'cancelled') {
      return status.includes('cancel') || order.courierStatus === 'cancelled';
    }

    return true;
  });

  // Helper for Status Badge styling
  const getStatusBadgeStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('deliv') || s.includes('comp')) {
      return {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-400',
        label: 'Delivered',
      };
    }
    if (s.includes('proc')) {
      return {
        bg: 'bg-blue-500/15',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        dot: 'bg-blue-400',
        label: 'Processing',
      };
    }
    if (s.includes('hold')) {
      return {
        bg: 'bg-amber-700/20',
        text: 'text-amber-400',
        border: 'border-amber-600/30',
        dot: 'bg-amber-500',
        label: 'Hold',
      };
    }
    if (s.includes('cancel')) {
      return {
        bg: 'bg-rose-500/15',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        dot: 'bg-rose-400',
        label: 'Cancelled',
      };
    }
    return {
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      dot: 'bg-amber-400',
      label: 'Pending',
    };
  };

  const statusOptions: OrderStatus[] = [
    'Delivered',
    'Pending',
    'Processing',
    'Hold',
    'Cancelled',
  ];

  return (
    <div className="space-y-5 animate-fadeIn pb-16">
      {/* Top Header matching 1788858680349.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            মাই ব্যবসা ড্যাশবোর্ড - <span className="text-pink-400">অর্ডার</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            গুগল শিটের সাথে সংযুক্ত লাইভ অর্ডার তালিকা ও কুরিয়ার বুকিং
          </p>
        </div>

        {/* Top Search bar with avatar matching screenshot */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12151f] border border-[#22293d] rounded-xl pl-9 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141824] border border-[#22293d] text-xs text-gray-300 font-medium">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 text-[10px] text-white font-bold flex items-center justify-center">
              A
            </div>
            <span>[Admin]</span>
          </div>
        </div>
      </div>

      {/* Action Bar matching screenshot: + New Order, Sync with Sheet */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewOrder}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 hover:from-pink-500 hover:to-rose-500 text-white text-sm font-semibold shadow-lg shadow-pink-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Order</span>
          </button>

          <button
            onClick={onSyncSheet}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141824] hover:bg-[#1d2334] border border-[#262f46] text-gray-200 text-sm font-medium transition-all"
          >
            <RefreshCw className={`w-4 h-4 text-pink-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'Sync with Sheet'}</span>
          </button>
        </div>

        <div className="text-xs text-gray-400">
          মোট অর্ডার: <strong className="text-pink-400 font-bold">{filteredOrders.length}</strong> টি
        </div>
      </div>

      {/* Filter Tabs matching screenshot: সব, পেন্ডিং, কনফার্মড, স্টেডফাস্টে পাঠানো... */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm border-b border-[#1c2232]">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-1.5 rounded-xl font-medium transition-all text-xs whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-[#22293d] text-pink-400 border border-pink-500/40 font-bold'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#141824]'
          }`}
        >
          সব
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-4 py-1.5 rounded-xl font-medium transition-all text-xs whitespace-nowrap ${
            activeFilter === 'pending'
              ? 'bg-[#22293d] text-amber-400 border border-amber-500/40 font-bold'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#141824]'
          }`}
        >
          পেন্ডিং
        </button>
        <button
          onClick={() => setActiveFilter('processing')}
          className={`px-4 py-1.5 rounded-xl font-medium transition-all text-xs whitespace-nowrap ${
            activeFilter === 'processing'
              ? 'bg-[#22293d] text-blue-400 border border-blue-500/40 font-bold'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#141824]'
          }`}
        >
          কনফার্মড
        </button>
        <button
          onClick={() => setActiveFilter('steadfast')}
          className={`px-4 py-1.5 rounded-xl font-medium transition-all text-xs whitespace-nowrap ${
            activeFilter === 'steadfast'
              ? 'bg-[#22293d] text-pink-400 border border-pink-500/40 font-bold'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#141824]'
          }`}
        >
          স্টেডফাস্টে পাঠানো
        </button>
        <button
          onClick={() => setActiveFilter('delivered')}
          className={`px-4 py-1.5 rounded-xl font-medium transition-all text-xs whitespace-nowrap ${
            activeFilter === 'delivered'
              ? 'bg-[#22293d] text-emerald-400 border border-emerald-500/40 font-bold'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#141824]'
          }`}
        >
          ডেলিভার্ড
        </button>
        <button
          onClick={() => setActiveFilter('cancelled')}
          className={`px-4 py-1.5 rounded-xl font-medium transition-all text-xs whitespace-nowrap ${
            activeFilter === 'cancelled'
              ? 'bg-[#22293d] text-rose-400 border border-rose-500/40 font-bold'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#141824]'
          }`}
        >
          ক্যান্সেলড
        </button>
      </div>

      {/* Orders Table Container matching 1788858680349.png */}
      <div className="bg-[#12151f] border border-[#1e2436] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#1c2232] bg-[#0e111a] text-xs text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 w-16">ID</th>
                <th className="py-3 px-4 min-w-[180px]">গ্রাহক ও ঠিকানা</th>
                <th className="py-3 px-4 min-w-[140px]">প্রোডাক্ট</th>
                <th className="py-3 px-4 min-w-[90px]">সোর্স</th>
                <th className="py-3 px-4 min-w-[90px]">টোটাল</th>
                <th className="py-3 px-4 min-w-[140px]">স্ট্যাটাস</th>
                <th className="py-3 px-4 min-w-[160px] text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171b26]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    কোনো অর্ডার পাওয়া যায়নি। ফিল্টার পরিবর্তন করুন বা নতুন অর্ডার যোগ করুন।
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => {
                  const badge = getStatusBadgeStyle(order.status);
                  const isSentToSteadfast =
                    Boolean(order.trackingCode) ||
                    (order.steadfastStatus && order.steadfastStatus.toLowerCase().includes('sent'));

                  const uniqueKey = `${order.id}-${order.rowIndex ?? idx}`;
                  const isDropdownOpen = openStatusDropdownId === uniqueKey;

                  return (
                    <tr
                      key={uniqueKey}
                      className="hover:bg-[#161a26] transition-colors group"
                    >
                      {/* ID Column */}
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-300 text-xs whitespace-nowrap">
                        {order.id}
                      </td>

                      {/* Customer & Address Column with avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 text-gray-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {order.customerName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-200 text-xs">
                              {order.customerName}
                            </div>
                            <div className="text-[11px] text-gray-400 leading-tight">
                              {order.customerAddress || 'ঢাকা'}
                            </div>
                            <div className="text-[11px] text-gray-500 font-mono">
                              {order.customerPhone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Product Column */}
                      <td className="py-3.5 px-4 text-xs text-gray-300 font-medium">
                        <div>{order.product || 'Rose 599tk'}</div>
                        {order.quantity > 1 && (
                          <span className="text-[10px] text-gray-500">পরিমাণ: {order.quantity}</span>
                        )}
                      </td>

                      {/* Source Column */}
                      <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#1a1f2e] text-gray-300 border border-[#272f44]">
                          [{order.source || 'Website'}]
                        </span>
                      </td>

                      {/* Total Amount Column */}
                      <td className="py-3.5 px-4 text-xs font-bold text-gray-100 whitespace-nowrap">
                        ৳{order.total || order.amount || 599}
                      </td>

                      {/* Status Column: Interactive Dropdown */}
                      <td className="py-3.5 px-4 relative">
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              setOpenStatusDropdownId(isDropdownOpen ? null : uniqueKey)
                            }
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${badge.bg} ${badge.text} ${badge.border}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            <span>{order.status || badge.label}</span>
                            <ChevronDown className="w-3 h-3 opacity-70" />
                          </button>

                          {/* Dropdown menu */}
                          {isDropdownOpen && (
                            <div className="absolute left-0 mt-1.5 w-36 bg-[#161a26] border border-[#2a344c] rounded-xl shadow-2xl py-1 z-30 animate-fadeIn">
                              {statusOptions.map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => {
                                    onUpdateOrderStatus(order, opt);
                                    setOpenStatusDropdownId(null);
                                  }}
                                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#202638] flex items-center justify-between ${
                                    order.status.toLowerCase() === opt.toLowerCase()
                                      ? 'text-pink-400 font-bold'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {order.status.toLowerCase() === opt.toLowerCase() && (
                                    <CheckCircle2 className="w-3 h-3 text-pink-400" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions Column: Send to Steadfast or Sent badge + View */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Steadfast Courier Button */}
                          {isSentToSteadfast ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-950/60 text-purple-300 border border-purple-800/50">
                              <span>Sent (ID: {order.trackingCode?.slice(-4) || '8821'})</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => onSendToSteadfast(order)}
                              title="Send order to Steadfast Courier"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-md shadow-pink-600/20 transition-all active:scale-95"
                            >
                              <Rocket className="w-3 h-3" />
                              <span>Send to Steadfast</span>
                            </button>
                          )}

                          {/* View Button */}
                          <button
                            onClick={() => onSelectOrder(order)}
                            title="অর্ডার ভিউ ও প্রিন্ট"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#171c28] hover:bg-[#22293d] text-pink-300 border border-pink-500/30 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
