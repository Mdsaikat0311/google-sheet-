export type OrderStatus = 
  | 'Delivered'
  | 'Complete'
  | 'Processing'
  | 'Procecing'
  | 'Pending'
  | 'Hold'
  | 'Cancelled'
  | 'Cancel'
  | 'In Review'
  | 'in_review'
  | 'Partial Delivered'
  | 'partial_delivered';

export type CourierStatus = 
  | 'delivered'
  | 'pending'
  | 'partial_delivered'
  | 'cancelled'
  | 'in_review'
  | 'processing';

export interface Order {
  id: string; // Invoice ID / Order # (e.g. INV-1001, #1025)
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  product: string; // e.g. "Rose 599tk", "জ্যাকেট, L"
  source: string; // e.g. "FB Ads", "Website", "Phone", "Direct Call"
  amount: number; // Total amount in BDT
  total: number; // Alias for amount
  quantity: number;
  status: OrderStatus;
  trackingCode?: string; // e.g. 290917655
  courierStatus?: CourierStatus | string;
  steadfastStatus?: string; // 'send to steadfast' or 'Sent (ID: 8821)'
  date: string;
  notes?: string;
  rowIndex?: number; // 1-based row in Google Sheet
  totalSpend?: number;
  items?: OrderItem[];
}

export interface CustomerSummary {
  name: string;
  phone: string;
  address: string;
  totalOrders: number;
  avgOrderValue: number;
  lastOrder: string;
  status: 'Active' | 'Inactive';
}

export interface DailyTrendItem {
  day: string; // 'শনি', 'রবি', 'সোম', etc.
  orders: number;
  delivered: number;
}

export interface SalesSourceItem {
  source: string;
  percentage: number;
  count: number;
  color: string;
}

export interface Product {
  id: string; // SKU or row id
  name: string;
  category: string;
  regularPrice: number;
  salePrice?: number;
  stock: number;
  status: 'publish' | 'draft' | 'out_of_stock';
  description: string;
  image: string;
  featured?: boolean;
  rowIndex: number; // 1-based index in the sheet for pinpoint updates
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SheetMeta {
  spreadsheetId: string;
  title: string;
  productsSheetTitle: string;
  ordersSheetTitle: string;
}
