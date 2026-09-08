import React, { useState } from 'react';
import { ShoppingBag, Search, Filter, Plus, Check } from 'lucide-react';
import { Product } from '../types';

interface StorefrontViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onOpenCart: () => void;
  cartCount: number;
}

export const StorefrontView: React.FC<StorefrontViewProps> = ({
  products,
  onAddToCart,
  onOpenCart,
  cartCount,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category || 'General')))];

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            অনলাইন স্টোরফ্রন্ট (Website Store)
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            ওয়েবসাইটের ক্যাটালগ ও পণ্যসমূহ (অর্ডার সরাসরি ড্যাশবোর্ড ও গুগল শিটে জমা হবে)
          </p>
        </div>

        <button
          onClick={onOpenCart}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-lg shadow-pink-600/30 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>কার্ট ({cartCount})</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="পণ্য খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#12151f] border border-[#22293d] rounded-xl pl-9 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-pink-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                  : 'bg-[#141824] text-gray-400 hover:text-white border border-[#22293d]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((prod) => (
          <div
            key={prod.id}
            className="bg-[#12151f] border border-[#1e2436] rounded-2xl overflow-hidden hover:border-pink-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-square overflow-hidden bg-[#181c29]">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-pink-400 border border-pink-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {prod.category}
                </span>
              </div>

              <div className="p-4 space-y-1.5">
                <p className="text-[11px] font-mono text-gray-400">{prod.id}</p>
                <h3 className="font-bold text-gray-100 text-sm line-clamp-1">{prod.name}</h3>
                <p className="text-xs text-gray-400 line-clamp-2">{prod.description || 'প্রিমিয়াম কোয়ালিটি ফ্যাশন প্রোডাক্ট'}</p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-[#1a2030] mt-3 flex items-center justify-between">
              <div>
                <span className="text-lg font-black text-pink-500">
                  ৳{prod.salePrice || prod.regularPrice}
                </span>
                {prod.salePrice && (
                  <span className="text-xs text-gray-500 line-through ml-1.5 font-mono">
                    ৳{prod.regularPrice}
                  </span>
                )}
              </div>

              <button
                onClick={() => onAddToCart(prod)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1d2334] hover:bg-pink-600 text-pink-300 hover:text-white text-xs font-bold transition-all border border-pink-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>কার্ট</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
