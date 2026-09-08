import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  Rocket,
  Phone,
  MapPin,
  FileSpreadsheet,
  Package,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface ViewOrderModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (order: Order, newStatus: OrderStatus) => void;
  onSendToSteadfast: (order: Order) => void;
}

export const ViewOrderModal: React.FC<ViewOrderModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onSendToSteadfast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#121520] border border-[#22293d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#1c2232] flex items-center justify-between bg-[#0e111a]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
            <h3 className="text-base font-bold text-white font-mono">
              ইনভয়েস {order.id}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-pink-500/15 text-pink-400 border border-pink-500/30">
              {order.source || 'Website'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="প্রিন্ট ইনভয়েস"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1c2232] transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1c2232] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Customer Card */}
          <div className="p-4 rounded-xl bg-[#161a26] border border-[#232b3e] space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-gray-100 text-sm">{order.customerName}</h4>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-pink-400" />
                  {order.customerAddress || 'ঢাকা'}
                </p>
              </div>

              <a
                href={`tel:${order.customerPhone}`}
                className="flex items-center gap-1 text-xs text-pink-400 hover:underline font-mono bg-pink-500/10 px-2.5 py-1 rounded-lg border border-pink-500/20"
              >
                <Phone className="w-3 h-3" />
                <span>{order.customerPhone}</span>
              </a>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#202738] text-[11px] text-gray-400">
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3 h-3 text-gray-500" />
                তারিখ: {order.date || '08/09/26'}
              </span>
              {order.rowIndex && (
                <span className="text-gray-500 font-mono">
                  গুগল শিট সারি: #{order.rowIndex}
                </span>
              )}
            </div>
          </div>

          {/* Product & Pricing Table */}
          <div className="border border-[#202738] rounded-xl overflow-hidden">
            <div className="bg-[#0e111a] p-3 text-xs font-semibold text-gray-400 flex justify-between border-b border-[#202738]">
              <span>পণ্য বিবরণ</span>
              <span>মোট</span>
            </div>
            <div className="p-3.5 flex items-center justify-between text-xs bg-[#141824]">
              <div>
                <p className="font-semibold text-gray-200">{order.product || 'Standard Product'}</p>
                <p className="text-[11px] text-gray-400">পরিমাণ: {order.quantity || 1} টি</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-pink-400 text-sm">
                  ৳{order.total || order.amount || 599}
                </p>
                <span className="text-[10px] text-gray-500">ক্যাশ অন ডেলিভারি</span>
              </div>
            </div>
          </div>

          {/* Steadfast Courier Tracking Status */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Rocket className="w-4 h-4 text-pink-400" />
                Steadfast কুরিয়ার ট্র্যাকিং
              </span>
              <span className="text-[11px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                {order.courierStatus || 'Pending'}
              </span>
            </div>

            {order.trackingCode ? (
              <div className="flex items-center justify-between bg-[#111420] p-2.5 rounded-lg border border-purple-800/30">
                <span className="text-xs font-mono text-gray-200">
                  ট্র্যাকিং কোড: <strong className="text-pink-400">{order.trackingCode}</strong>
                </span>
                <button
                  onClick={() => handleCopy(order.trackingCode!)}
                  className="p-1 text-gray-400 hover:text-white"
                  title="কপি করুন"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">কুরিয়ারে এখনো পাঠানো হয়নি</p>
                <button
                  onClick={() => onSendToSteadfast(order)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold shadow-md transition-all"
                >
                  স্টেডফাস্টে পাঠান
                </button>
              </div>
            )}
          </div>

          {/* Status Changer */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              অর্ডার স্ট্যাটাস আপডেট করুন (গুগল শিটে সেভ হবে)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Delivered', 'Processing', 'Pending', 'Hold', 'Cancelled'] as OrderStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(order, st)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    order.status.toLowerCase() === st.toLowerCase()
                      ? 'bg-pink-600 text-white border-pink-500 shadow-lg shadow-pink-600/30'
                      : 'bg-[#181c28] text-gray-400 border-[#262f44] hover:bg-[#202738] hover:text-gray-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {order.notes && (
            <div className="p-3 bg-[#161a26] border border-[#232b3e] rounded-xl text-xs text-gray-300">
              <span className="text-gray-500 font-semibold block mb-1">নোট:</span>
              {order.notes}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1c2232] bg-[#0e111a] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1d2334] text-gray-200 text-xs font-semibold hover:bg-[#283149] transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
