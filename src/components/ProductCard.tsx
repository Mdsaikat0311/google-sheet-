import React from 'react';
import { ShoppingBag, Eye, Check, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickEdit?: (product: Product) => void;
  canEdit?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickEdit,
  canEdit = false,
}) => {
  const isOutOfStock = product.stock <= 0 || product.status === 'out_of_stock';
  const hasDiscount = product.salePrice && product.salePrice < product.regularPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.regularPrice - product.salePrice!) / product.regularPrice) * 100)
    : 0;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-white rounded-xl border border-stone-200 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between"
    >
      <div>
        {/* Product Image & Badges */}
        <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback placeholder image on broken url
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
            }}
          />

          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {hasDiscount && (
              <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm tracking-wide">
                -{discountPercent}%
              </span>
            )}
            {product.status === 'draft' && (
              <span className="bg-amber-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                Draft
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-stone-800 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                Stock Out
              </span>
            )}
          </div>

          {canEdit && onQuickEdit && (
            <button
              id={`btn-edit-badge-${product.id}`}
              onClick={() => onQuickEdit(product)}
              className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-stone-700 hover:text-emerald-700 hover:bg-white text-xs font-medium px-2.5 py-1 rounded-md shadow-sm border border-stone-200 flex items-center gap-1 transition-all"
            >
              Sheet Row #{product.rowIndex}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              {product.category || 'General'}
            </span>
            <span className="text-stone-400 text-[11px]">
              ID: {product.id}
            </span>
          </div>

          <h3 className="font-semibold text-stone-900 text-base leading-snug line-clamp-2 hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Pricing */}
          <div className="pt-2 flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-rose-600">
                  ৳{product.salePrice?.toLocaleString()}
                </span>
                <span className="text-xs text-stone-400 line-through">
                  ৳{product.regularPrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-stone-900">
                ৳{product.regularPrice.toLocaleString()}
              </span>
            )}

            <span className="ml-auto text-[11px] text-stone-500 flex items-center gap-1">
              {product.stock > 0 ? (
                <span className="text-emerald-600 font-medium">
                  {product.stock} in stock
                </span>
              ) : (
                <span className="text-rose-500 font-medium">Out of stock</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0">
        <div className="flex gap-2">
          <button
            id={`btn-add-cart-${product.id}`}
            type="button"
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white font-medium text-sm py-2.5 px-3 rounded-lg transition-colors active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </button>

          {canEdit && onQuickEdit && (
            <button
              id={`btn-quick-edit-${product.id}`}
              type="button"
              onClick={() => onQuickEdit(product)}
              title="Edit in Google Sheet"
              className="px-3 py-2.5 border border-stone-200 hover:border-stone-400 rounded-lg text-stone-600 hover:text-stone-900 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
