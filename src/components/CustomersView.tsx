import React, { useState } from 'react';
import { Search, UserCheck, Phone, MapPin, ShoppingBag, DollarSign } from 'lucide-react';
import { Order } from '../types';
import { INITIAL_CUSTOMER_ANALYTICS } from '../data/initialOrders';

interface CustomersViewProps {
  orders: Order[];
}

export const CustomersView: React.FC<CustomersViewProps> = ({ orders }) => {
  const [search, setSearch] = useState('');

  // Combine customers from orders + initial analytics
  const customerMap = new Map<string, {
    name: string;
    phone: string;
    address: string;
    totalOrders: number;
    totalSpend: number;
    lastOrder: string;
    status: 'Active' | 'Inactive';
  }>();

  // Add initial customer records
  INITIAL_CUSTOMER_ANALYTICS.forEach((c) => {
    customerMap.set(c.phone || c.name, {
      name: c.name,
      phone: c.phone,
      address: c.address,
      totalOrders: c.totalOrders,
      totalSpend: c.totalOrders * c.avgOrderValue,
      lastOrder: c.lastOrder,
      status: c.status,
    });
  });

  // Add/Merge from orders
  orders.forEach((o) => {
    const key = o.customerPhone || o.customerName;
    const existing = customerMap.get(key);
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpend += o.total || o.amount || 0;
      existing.lastOrder = o.date || existing.lastOrder;
    } else {
      customerMap.set(key, {
        name: o.customerName,
        phone: o.customerPhone,
        address: o.customerAddress,
        totalOrders: 1,
        totalSpend: o.total || o.amount || 0,
        lastOrder: o.date || '08/09/26',
        status: 'Active',
      });
    }
  });

  const customerList = Array.from(customerMap.values()).filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            গ্রাহক তালিকা (Customers)
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            নিয়মিত কাস্টমার, ফোন নম্বর ও লাইফটাইম অর্ডারের হিসাব
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="নাম বা মোবাইল নম্বর..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#12151f] border border-[#22293d] rounded-xl pl-9 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-[#12151f] border border-[#1e2436] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#1c2232] bg-[#0e111a] text-xs text-gray-400 font-semibold uppercase">
                <th className="py-3 px-4">কাস্টমার নাম ও মোবাইল</th>
                <th className="py-3 px-4">ঠিকানা</th>
                <th className="py-3 px-4">মোট অর্ডার</th>
                <th className="py-3 px-4">মোট খরচ (BDT)</th>
                <th className="py-3 px-4">শেষ অর্ডার</th>
                <th className="py-3 px-4 text-right">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171b26]">
              {customerList.map((customer, idx) => (
                <tr key={idx} className="hover:bg-[#161a26] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-bold text-xs flex items-center justify-center">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-200 text-xs">
                          {customer.name}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 text-pink-400" />
                          {customer.phone}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-gray-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-500 shrink-0" />
                      {customer.address || 'ঢাকা'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-gray-200 font-bold">
                    {customer.totalOrders} টি
                  </td>

                  <td className="py-3.5 px-4 text-xs font-mono font-bold text-pink-400">
                    ৳{customer.totalSpend.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-xs text-gray-400 font-mono">
                    {customer.lastOrder}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Active
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
