import React, { useState } from 'react';
import {
  Truck,
  RotateCcw,
  Hourglass,
  Ban,
  Calendar,
  ChevronDown,
  TrendingUp,
  Download,
} from 'lucide-react';
import {
  INITIAL_CUSTOMER_ANALYTICS,
  INITIAL_DAILY_TREND,
  INITIAL_SALES_SOURCES,
} from '../data/initialOrders';

export const ReportsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getTimeLabel = () => {
    if (timeRange === 'today') return 'আজ';
    if (timeRange === 'week') return 'এই সপ্তাহ';
    return 'এই মাস';
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Title & Time Filter Header matching 1788858495063.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              রিপোর্ট (Reports)
            </h2>
            <span className="text-sm text-gray-400 font-medium">/ বিস্তারিত এনালিটিক্স</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            কুরিয়ার সাকসেস রেট, সেলস চ্যানেল এবং কাস্টমার লাইফটাইম পারফরম্যান্স
          </p>
        </div>

        {/* Date Filter Dropdown matching [ আজ / এই সপ্তাহ / এই মাস ▾ ] */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141824] hover:bg-[#1d2334] border border-[#22293d] text-gray-200 text-xs font-semibold shadow-sm transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-pink-400" />
            <span>[ {getTimeLabel()} ▾ ]</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-36 bg-[#161a26] border border-[#273046] rounded-xl shadow-xl py-1 z-30 animate-fadeIn">
              <button
                onClick={() => {
                  setTimeRange('today');
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#202638] ${
                  timeRange === 'today' ? 'text-pink-400 font-bold' : 'text-gray-300'
                }`}
              >
                আজ
              </button>
              <button
                onClick={() => {
                  setTimeRange('week');
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#202638] ${
                  timeRange === 'week' ? 'text-pink-400 font-bold' : 'text-gray-300'
                }`}
              >
                এই সপ্তাহ
              </button>
              <button
                onClick={() => {
                  setTimeRange('month');
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#202638] ${
                  timeRange === 'month' ? 'text-pink-400 font-bold' : 'text-gray-300'
                }`}
              >
                এই মাস
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4 Metric Cards matching 1788858495063.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: সামগ্রিক ডেলিভারি রেট */}
        <div className="bg-[#12151f] border border-[#1e2436] rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>সামগ্রিক ডেলিভারি রেট</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-3xl font-black text-white tracking-tight">
              ৯১.২%
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Truck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Metric 2: রিটার্ন রেট */}
        <div className="bg-[#12151f] border border-[#1e2436] rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            <span>রিটার্ন রেট</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-3xl font-black text-white tracking-tight">
              ৫.৮%
            </div>
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <RotateCcw className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Metric 3: গড় প্রসেসিং সময় */}
        <div className="bg-[#12151f] border border-[#1e2436] rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>গড় প্রসেসিং সময়</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-3xl font-black text-white tracking-tight">
              ১.৪ দিন
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Hourglass className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Metric 4: ক্যান্সেলড/রিটার্ন */}
        <div className="bg-[#12151f] border border-[#1e2436] rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>ক্যান্সেলড/রিটার্ন</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-3xl font-black text-white tracking-tight">
              ১২ টি
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Ban className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Dual Charts Row: দৈনিক ট্রেন্ড + সেলস সোর্স */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: দৈনিক অর্ডার ও ডেলিভারি ট্রেন্ড */}
        <div className="lg:col-span-7 bg-[#12151f] border border-[#1e2436] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                দৈনিক অর্ডার ও ডেলিভারি ট্রেন্ড
              </h3>
            </div>
            {/* Legend matching screenshot */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-gray-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" />
                <span>মোট অর্ডার</span>
              </div>
              <div className="flex items-center gap-1.5 text-pink-400">
                <span className="w-3 h-0.5 bg-pink-500" />
                <span>ডেলিভার্ড</span>
              </div>
            </div>
          </div>

          {/* Bar Chart with overlay line */}
          <div className="relative pt-6 pb-2">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-gray-600 pr-2">
              <div className="border-b border-gray-800/80 pb-0.5 flex justify-between"><span>80</span></div>
              <div className="border-b border-gray-800/80 pb-0.5 flex justify-between"><span>60</span></div>
              <div className="border-b border-gray-800/80 pb-0.5 flex justify-between"><span>40</span></div>
              <div className="border-b border-gray-800/80 pb-0.5 flex justify-between"><span>20</span></div>
              <div className="border-b border-gray-800/80 pb-0.5 flex justify-between"><span>0</span></div>
            </div>

            <div className="grid grid-cols-7 gap-3 sm:gap-4 h-56 items-end relative z-10 px-4">
              {INITIAL_DAILY_TREND.map((item, idx) => {
                const heightPercent = Math.min(100, Math.max(12, (item.orders / 80) * 100));
                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-bold text-pink-300 opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-[#1a1f2e] px-1 py-0.5 rounded border border-pink-500/20">
                      {item.orders}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-purple-700 via-purple-500 to-pink-500 group-hover:brightness-110 shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
                    />
                    <span className="text-xs text-gray-400 mt-2 font-medium">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Chart: সেলস সোর্স অনুযায়ী ডেলিভারি */}
        <div className="lg:col-span-5 bg-[#12151f] border border-[#1e2436] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              সেলস সোর্স অনুযায়ী ডেলিভারি
            </h3>

            {/* Custom SVG Donut Chart */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-44 h-44">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#1a2030"
                    strokeWidth="14"
                    fill="transparent"
                  />
                  {/* Facebook Ads Segment (76%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#3b82f6"
                    strokeWidth="14"
                    strokeDasharray={`${76 * 2.387} 300`}
                    strokeDashoffset="0"
                    fill="transparent"
                    className="transition-all duration-1000"
                  />
                  {/* Direct Call Segment (14%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#10b981"
                    strokeWidth="14"
                    strokeDasharray={`${14 * 2.387} 300`}
                    strokeDashoffset={`-${76 * 2.387}`}
                    fill="transparent"
                    className="transition-all duration-1000"
                  />
                  {/* Website Segment (10%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#f59e0b"
                    strokeWidth="14"
                    strokeDasharray={`${10 * 2.387} 300`}
                    strokeDashoffset={`-${90 * 2.387}`}
                    fill="transparent"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-white">108</span>
                  <span className="text-[10px] text-gray-400 font-medium">মোট সাকসেস</span>
                </div>
              </div>
            </div>
          </div>

          {/* Donut Legend matching screenshot */}
          <div className="space-y-2 pt-2 border-t border-[#1c2232] text-xs">
            {INITIAL_SALES_SOURCES.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-gray-300">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>
                    {item.source}: {item.percentage}% ({item.count} টি)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Analytics Table matching 1788858495063.png */}
      <div className="bg-[#12151f] border border-[#1e2436] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            কাস্টমার এনালিটিক্স
          </h3>
          <span className="text-xs text-gray-400">টপ রিপিট কাস্টমার তালিকা</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#1c2232] text-xs text-gray-400 font-semibold">
                <th className="py-2.5 px-4">কাস্টমার নাম<br /><span className="text-[10px] text-gray-600 font-normal">Customer Name</span></th>
                <th className="py-2.5 px-4">মোট অর্ডার<br /><span className="text-[10px] text-gray-600 font-normal">Total Orders</span></th>
                <th className="py-2.5 px-4">গড় অর্ডার মূল্য<br /><span className="text-[10px] text-gray-600 font-normal">Avg. Order Value</span></th>
                <th className="py-2.5 px-4">শেষ অর্ডার<br /><span className="text-[10px] text-gray-600 font-normal">Last Order</span></th>
                <th className="py-2.5 px-4 text-right">স্ট্যাটাস<br /><span className="text-[10px] text-gray-600 font-normal">Status</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171b26]">
              {INITIAL_CUSTOMER_ANALYTICS.map((c, idx) => (
                <tr key={idx} className="hover:bg-[#161a26] transition-colors">
                  <td className="py-3 px-4 font-semibold text-gray-200 text-xs">
                    {c.name}
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-xs">
                    {c.totalOrders}
                  </td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-xs">
                    ৳{c.avgOrderValue}
                  </td>
                  <td className="py-3 px-4 text-gray-400 font-mono text-xs">
                    {c.lastOrder}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
