import React, { useState } from 'react';
import { Product } from '../types';
import { Edit3, Plus, ExternalLink, RefreshCw, Layers, DollarSign, PackageCheck, AlertCircle } from 'lucide-react';

interface SheetManagerProps {
  products: Product[];
  tabName: string;
  spreadsheetId: string;
  onQuickEdit: (product: Product) => void;
  onOpenAddModal: () => void;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
  onSeedSample: () => Promise<void>;
  isSeeding: boolean;
}

export const SheetManager: React.FC<SheetManagerProps> = ({
  products,
  tabName,
  spreadsheetId,
  onQuickEdit,
  onOpenAddModal,
  onRefresh,
  isRefreshing,
  onSeedSample,
  isSeeding,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.rowIndex).includes(searchTerm);
    return matchCat && matchSearch;
  });

  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const outOfStockCount = products.filter(p => p.stock <= 0).length;
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  return (
    <div id="sheet-manager-panel" className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Top Banner with Sheet info */}
      <div className="p-5 border-b border-stone-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-stone-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-900">
              WooCommerce Sheet Inventory & Live Editor
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              Tab: {tabName}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Edit any product directly below. Every change syncs in real time with Google Sheet row.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync from Sheet</span>
          </button>

          <a
            href={sheetUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-xs transition-colors"
          >
            <span>Open Google Sheet</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 divide-x divide-stone-100 border-b border-stone-100 bg-white">
        <div className="p-4 text-center sm:text-left">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Total Products</span>
          <p className="text-xl font-bold text-stone-900 mt-0.5">{products.length}</p>
        </div>
        <div className="p-4 text-center sm:text-left">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Units in Stock</span>
          <p className="text-xl font-bold text-emerald-700 mt-0.5">{totalStock}</p>
        </div>
        <div className="p-4 text-center sm:text-left">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Out of Stock</span>
          <p className="text-xl font-bold text-rose-600 mt-0.5">{outOfStockCount}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by name, SKU or row..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-stone-400 shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white font-medium'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table of products */}
      {products.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-stone-600 font-medium">No products detected in Google Sheet</p>
          <p className="text-stone-400 text-xs mt-1 mb-4">
            You can populate the sheet with WooCommerce starter products or add custom items.
          </p>
          <button
            onClick={onSeedSample}
            disabled={isSeeding}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            <PackageCheck className="w-4 h-4" />
            <span>{isSeeding ? 'Writing to Sheet...' : 'Load Sample WooCommerce Data to Sheet'}</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Row #</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (৳)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((product) => {
                const isOutOfStock = product.stock <= 0;
                return (
                  <tr key={product.id} className="hover:bg-stone-50/70 transition-colors group">
                    <td className="py-3 px-4 font-mono text-stone-400 font-medium">
                      #{product.rowIndex}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-md object-cover bg-stone-100 border border-stone-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-900 truncate max-w-xs">{product.name}</p>
                          <span className="text-[10px] text-stone-400 font-mono">SKU: {product.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[11px]">
                        {product.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {product.salePrice ? (
                        <div className="flex flex-col">
                          <span className="text-rose-600 font-bold">৳{product.salePrice.toLocaleString()}</span>
                          <span className="text-stone-400 line-through text-[10px]">৳{product.regularPrice.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span>৳{product.regularPrice.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        isOutOfStock
                          ? 'bg-rose-50 text-rose-700'
                          : product.stock < 5
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {product.stock} pcs
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`capitalize text-[11px] font-semibold ${
                        product.status === 'publish'
                          ? 'text-emerald-700'
                          : product.status === 'draft'
                          ? 'text-amber-600'
                          : 'text-stone-400'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onQuickEdit(product)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-700 rounded text-xs font-medium transition-colors border border-stone-200"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Row</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
