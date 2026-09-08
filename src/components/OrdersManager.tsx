import React, { useState } from 'react';
import { Order } from '../types';
import { RefreshCw, ExternalLink, Package, Clock, CheckCircle, XCircle } from 'lucide-react';

interface OrdersManagerProps {
  orders: Order[];
  spreadsheetId: string;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

export const OrdersManager: React.FC<OrdersManagerProps> = ({
  orders,
  spreadsheetId,
  onRefresh,
  isRefreshing,
}) => {
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  return (
    <div id="orders-manager-panel" className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-900">
              Orders Log (Synced with 'Orders' Sheet Tab)
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              {orders.length} Orders
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Every customer checkout appends a new row to your Google Sheet with customer details and items.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Orders</span>
          </button>
          <a
            href={sheetUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-xs transition-colors"
          >
            <span>Open in Sheet</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-stone-600 font-medium">No orders recorded in Google Sheet yet</p>
          <p className="text-stone-400 text-xs mt-1">
            Place an order from the store catalog to test the automated Sheet write feature!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Items / Details</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((order, idx) => (
                <tr key={`${order.id}-${order.rowIndex ?? idx}`} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-stone-800">
                    {order.id}
                  </td>
                  <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-900">
                    {order.customerName}
                  </td>
                  <td className="py-3 px-4 text-stone-600 font-mono">
                    {order.customerPhone}
                  </td>
                  <td className="py-3 px-4 text-stone-500 max-w-xs truncate" title={order.customerAddress}>
                    {order.customerAddress}
                  </td>
                  <td className="py-3 px-4 text-stone-600 max-w-sm truncate" title={order.items?.[0]?.productName}>
                    {order.items?.[0]?.productName || 'Order Items'}
                  </td>
                  <td className="py-3 px-4 font-bold text-stone-900 whitespace-nowrap">
                    ৳{order.total?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3 h-3" />
                      <span>{order.status || 'Pending'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
