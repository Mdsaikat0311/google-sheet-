import React, { useState } from 'react';
import { X, Plus, Rocket, FileSpreadsheet, Check } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: Order) => Promise<void>;
  isSubmitting: boolean;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [invoiceId, setInvoiceId] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('ঢাকা');
  const [product, setProduct] = useState('Rose 599tk');
  const [source, setSource] = useState('Website');
  const [amount, setAmount] = useState(599);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [sendToSteadfastImmediately, setSendToSteadfastImmediately] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('অনুগ্রহ করে গ্রাহকের নাম লিখুন');
      return;
    }

    const trackingCode = sendToSteadfastImmediately
      ? `29${Math.floor(1000000 + Math.random() * 9000000)}`
      : undefined;

    const newOrder: Order = {
      id: invoiceId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || '01700000000',
      customerAddress: customerAddress.trim() || 'ঢাকা',
      product: product.trim() || 'Rose 599tk',
      source,
      amount: Number(amount) || 599,
      total: Number(amount) || 599,
      quantity: Number(quantity) || 1,
      status: 'Processing',
      trackingCode,
      courierStatus: sendToSteadfastImmediately ? 'pending' : undefined,
      steadfastStatus: sendToSteadfastImmediately ? 'send to steadfast' : undefined,
      date: '08/09/26',
      notes,
    };

    await onSubmit(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#121520] border border-[#22293d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1c2232] flex items-center justify-between bg-[#0e111a]">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
              নতুন অর্ডার তৈরি করুন
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              অর্ডারটি সরাসরি ড্যাশবোর্ড এবং গুগল শিটে যুক্ত হবে
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#1c2232] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                ইনভয়েস / অর্ডার ID
              </label>
              <input
                type="text"
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                required
                className="w-full bg-[#181c29] border border-[#262f44] rounded-xl px-3.5 py-2 text-xs font-mono text-pink-400 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                অর্ডার সোর্স (Channel)
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-[#181c29] border border-[#262f44] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-pink-500"
              >
                <option value="Website">Website</option>
                <option value="FB Ads">FB Ads</option>
                <option value="Phone">Phone</option>
                <option value="Direct Call">Direct Call</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              গ্রাহকের নাম (Customer Name) *
            </label>
            <input
              type="text"
              placeholder="যেমন: সাকিব হাসান"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="w-full bg-[#181c29] border border-[#262f44] rounded-xl px-3.5 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                মোবাইল নম্বর (Phone) *
              </label>
              <input
                type="tel"
                placeholder="017XXXXXXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                className="w-full bg-[#181c29] border border-[#262f44] rounded-xl px-3.5 py-2 text-xs font-mono text-gray-100 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                ডেলিভারি ঠিকানা / জেলা *
              </label>
              <input
                type="text"
                placeholder="যেমন: ঢাকা, ধানমন্ডি"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                required
                className="w-full bg-[#181c29] border border-[#262f44] rounded-xl px-3.5 py-2 text-xs text-gray-100 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              পণ্য বিবরণ (Product) *
            </label>
            <input
              type="text"
              placeholder="যেমন: Rose 599tk বা জ্যাকেট, L"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              required
              className="w-full bg-[#181c29] border border-[#262f44] rounded-xl px-3.5 py-2 text-xs text-gray-100 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                পরিমাণ (Quantity)
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-[#181c29] border border-[#262f44] rounded-xl px-3.5 py-2 text-xs text-gray-100 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                মোট মূল্য (BDT ৳) *
              </label>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full bg-[#181c29] border border-[#262f44] rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-pink-400 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              অর্ডার নোট (Optional)
            </label>
            <input
              type="text"
              placeholder="যেমন: ক্যাশ অন ডেলিভারি, বিকেলে ফোন দিতে হবে"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#181c29] border border-[#262f44] rounded-xl px-3.5 py-2 text-xs text-gray-100 focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Steadfast Checkbox */}
          <div className="p-3.5 rounded-xl bg-purple-950/25 border border-purple-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Rocket className="w-4 h-4 text-pink-400" />
              <div>
                <p className="text-xs font-semibold text-gray-200">
                  Steadfast Courier এ সাথে সাথে পাঠান
                </p>
                <p className="text-[10px] text-gray-400">
                  অটো ট্র্যাকিং আইডি তৈরি হবে এবং কুরিয়ার লিস্টে যুক্ত হবে
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={sendToSteadfastImmediately}
              onChange={(e) => setSendToSteadfastImmediately(e.target.checked)}
              className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#1c2232]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-pink-600/30 transition-all disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'অর্ডার সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
