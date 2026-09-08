import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { X, Trash2, ShoppingBag, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    notes?: string;
  }) => Promise<void>;
  isSyncingOrder: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  isSyncingOrder,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, curr) => {
    const price = curr.product.salePrice ?? curr.product.regularPrice;
    return acc + price * curr.quantity;
  }, 0);

  const deliveryFee = items.length > 0 ? 80 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('Please fill in your name, phone number, and address');
      return;
    }
    setError(null);
    try {
      await onPlaceOrder({
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        notes,
      });
      setCheckoutStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to submit order to Google Sheet');
    }
  };

  const resetAndClose = () => {
    if (checkoutStep === 'success') {
      onClearCart();
      setCheckoutStep('cart');
      setName('');
      setPhone('');
      setAddress('');
      setNotes('');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <h2 className="font-bold text-stone-900 text-base">
              {checkoutStep === 'cart' && `Shopping Cart (${items.length})`}
              {checkoutStep === 'checkout' && 'WooCommerce Checkout'}
              {checkoutStep === 'success' && 'Order Placed!'}
            </h2>
          </div>
          <button
            onClick={resetAndClose}
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {checkoutStep === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-stone-600 font-medium">Your cart is empty</p>
                  <p className="text-stone-400 text-xs mt-1">Browse products and add items to your bag.</p>
                </div>
              ) : (
                <div className="space-y-4 divide-y divide-stone-100">
                  {items.map(({ product, quantity }) => {
                    const price = product.salePrice ?? product.regularPrice;
                    return (
                      <div key={product.id} className="pt-4 first:pt-0 flex gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs text-stone-800 truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-stone-500 mt-0.5">
                            ৳{price.toLocaleString()} × {quantity} = <span className="font-semibold text-stone-900">৳{(price * quantity).toLocaleString()}</span>
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                              <button
                                onClick={() => onUpdateQuantity(product.id, Math.max(1, quantity - 1))}
                                className="w-6 h-6 text-stone-600 hover:bg-stone-200 flex items-center justify-center text-xs"
                              >
                                -
                              </button>
                              <span className="w-7 text-center text-xs font-semibold">
                                {quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(product.id, Math.min(product.stock, quantity + 1))}
                                className="w-6 h-6 text-stone-600 hover:bg-stone-200 flex items-center justify-center text-xs"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(product.id)}
                              className="text-stone-400 hover:text-rose-600 p-1 text-xs"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {checkoutStep === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name (আপনার নাম) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Md Saikat"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phone Number (মোবাইল নম্বর) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Delivery Address (ঠিকানা) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, Road, City, Police Station"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Order Notes (ঐচ্ছিক নোট)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Delivery time, color preference"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-1">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-stone-800">Cash on Delivery (ক্যাশ অন ডেলিভারি)</span>
                </div>
                <div className="flex justify-between">
                  <span>Google Sheet Sync:</span>
                  <span className="text-emerald-700 font-medium">Auto-appends to 'Orders' sheet tab</span>
                </div>
              </div>
            </form>
          )}

          {checkoutStep === 'success' && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                Order Recorded Successfully!
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed max-w-xs">
                Your order has been directly saved into the <span className="font-semibold text-emerald-700">Orders</span> tab of your Google Sheet.
              </p>
              <button
                onClick={resetAndClose}
                className="mt-4 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm rounded-lg"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {checkoutStep !== 'success' && items.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>৳{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
                <span>Total Amount</span>
                <span className="text-emerald-700">৳{total.toLocaleString()}</span>
              </div>
            </div>

            {checkoutStep === 'cart' ? (
              <button
                id="btn-proceed-checkout"
                onClick={() => setCheckoutStep('checkout')}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm active:scale-[0.98]"
              >
                Proceed to Checkout (অর্ডার সম্পন্ন করুন)
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSyncingOrder}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSyncingOrder ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Syncing to Google Sheet...</span>
                    </>
                  ) : (
                    <span>Confirm Order (৳{total.toLocaleString()})</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
