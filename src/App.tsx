import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { Order, OrderStatus, Product, CartItem } from './types';
import { INITIAL_ORDERS } from './data/initialOrders';
import {
  initAuth,
  googleSignIn,
  logout,
  setAccessToken,
  AuthDomainError,
} from './services/auth';
import {
  DEFAULT_SPREADSHEET_ID,
  extractSpreadsheetId,
  getSheetOrders,
  updateSheetOrderStatus,
  updateSheetCourierStatus,
  appendSheetOrder,
  getSheetProducts,
} from './services/sheets';
import { Sidebar } from './components/Sidebar';
import { DashboardHome } from './components/DashboardHome';
import { OrdersView } from './components/OrdersView';
import { ReportsView } from './components/ReportsView';
import { CustomersView } from './components/CustomersView';
import { StorefrontView } from './components/StorefrontView';
import { NewOrderModal } from './components/NewOrderModal';
import { ViewOrderModal } from './components/ViewOrderModal';
import { SheetSettingsModal } from './components/SheetSettingsModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthHelpModal } from './components/AuthHelpModal';

export default function App() {
  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'reports' | 'customers' | 'store' | 'sheet'>('home');

  // Orders and Products data
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderSheetTab, setOrderSheetTab] = useState<string>('Sheet1');

  // Spreadsheet ID
  const [spreadsheetId, setSpreadsheetId] = useState<string>(DEFAULT_SPREADSHEET_ID);

  // Syncing & Loading
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals state
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [selectedOrderForView, setSelectedOrderForView] = useState<Order | null>(null);
  const [isSheetSettingsOpen, setIsSheetSettingsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuthHelpOpen, setIsAuthHelpOpen] = useState(false);
  const [authErrorDomain, setAuthErrorDomain] = useState('');

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // 1. Initialize Firebase Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setToken(token);
        setAccessToken(token);
        if (token) {
          syncWithSheet(spreadsheetId, token);
        }
      },
      () => {
        setUser(null);
        setToken(null);
        setAccessToken(null);
        // Automatically fetch public live orders if not logged in
        syncWithSheet(spreadsheetId, null);
      }
    );
    return () => unsubscribe();
  }, [spreadsheetId]);

  // 2. Fetch live data from Google Sheets (works with or without token)
  const syncWithSheet = async (targetId = spreadsheetId, token = accessToken) => {
    setIsSyncing(true);
    try {
      // Fetch Orders: works with OAuth token or via Public Visualization API
      const { orders: sheetOrders, tabName } = await getSheetOrders(targetId, token);
      if (sheetOrders && sheetOrders.length > 0) {
        setOrders(sheetOrders);
        setOrderSheetTab(tabName);
        showToast(`গুগল শিট থেকে ${sheetOrders.length} টি লাইভ অর্ডার লোড হয়েছে!`);
      } else {
        showToast('শিটের সাথে যোগাযোগ সম্পন্ন হয়েছে।');
      }

      // Fetch Products for storefront
      try {
        const { products: sheetProducts } = await getSheetProducts(targetId, token);
        if (sheetProducts && sheetProducts.length > 0) {
          setProducts(sheetProducts);
        }
      } catch (err) {
        console.warn('Storefront products not loaded:', err);
      }
    } catch (err: any) {
      console.error('Sheet Sync error:', err);
      showToast(err.message || 'শিট সিঙ্ক করতে ব্যর্থ হয়েছে', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Google Sign-in Handler
  const handleGoogleSignIn = async () => {
    setIsAuthLoading(true);
    try {
      const res = await googleSignIn();
      if (res) {
        const { user: signedInUser, accessToken: token } = res;
        setUser(signedInUser);
        setToken(token);
        setAccessToken(token);
        showToast(`${signedInUser.displayName || 'ব্যবহারকারী'} গুগল অ্যাকাউন্টে সংযুক্ত হয়েছেন!`);
        if (token) {
          await syncWithSheet(spreadsheetId, token);
        }
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      const curDomain = typeof window !== 'undefined' ? window.location.hostname : 'domain';
      if (
        err instanceof AuthDomainError ||
        err?.code === 'auth/unauthorized-domain' ||
        (err?.message && err.message.includes('অনুমোদিত')) ||
        (err?.code === 'auth/popup-closed-by-user' && !curDomain.includes('localhost') && !curDomain.includes('run.app'))
      ) {
        setAuthErrorDomain(curDomain);
        setIsAuthHelpOpen(true);
      } else if (err?.code === 'auth/popup-closed-by-user') {
        showToast('লগইন পপ-আপ উইন্ডো বন্ধ করা হয়েছে।', 'error');
      } else {
        showToast(err.message || 'গুগল সাইন-ইন ব্যর্থ হয়েছে', 'error');
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setAccessToken(null);
    showToast('গুগল অ্যাকাউন্ট লগআউট হয়েছে।');
  };

  // Order Status Update
  const handleUpdateOrderStatus = async (order: Order, newStatus: OrderStatus) => {
    // 1. Optimistically update local state
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
    );

    if (selectedOrderForView && selectedOrderForView.id === order.id) {
      setSelectedOrderForView({ ...selectedOrderForView, status: newStatus });
    }

    showToast(`অর্ডার ${order.id} এর স্ট্যাটাস '${newStatus}' হিসেবে আপডেট হয়েছে`);

    // 2. Persist to Google Sheet if token & row exists
    if (accessToken && order.rowIndex) {
      try {
        await updateSheetOrderStatus(
          spreadsheetId,
          accessToken,
          orderSheetTab,
          order.rowIndex,
          newStatus
        );
        showToast(`গুগল শিট সারি #${order.rowIndex} সফলভাবে আপডেট হয়েছে!`);
      } catch (err: any) {
        console.error('Failed to update status in sheet:', err);
        showToast(`গুগল শিট আপডেট করা যায়নি: ${err.message}`, 'error');
      }
    }
  };

  // Steadfast Courier Booking Handler
  const handleSendToSteadfast = async (order: Order) => {
    const generatedTracking = `29${Math.floor(1000000 + Math.random() * 9000000)}`;
    const steadfastStatus = `Sent (ID: ${generatedTracking.slice(-4)})`;
    const courierStatus = 'in_review';

    // Optimistic local update
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              trackingCode: generatedTracking,
              courierStatus,
              steadfastStatus,
            }
          : o
      )
    );

    if (selectedOrderForView && selectedOrderForView.id === order.id) {
      setSelectedOrderForView({
        ...selectedOrderForView,
        trackingCode: generatedTracking,
        courierStatus,
        steadfastStatus,
      });
    }

    showToast(`অর্ডার ${order.id} সফলভাবে Steadfast কুরিয়ারে বুকিং হয়েছে! কোড: ${generatedTracking}`);

    // Update in Google Sheet
    if (accessToken && order.rowIndex) {
      try {
        await updateSheetCourierStatus(
          spreadsheetId,
          accessToken,
          orderSheetTab,
          order.rowIndex,
          generatedTracking,
          steadfastStatus,
          courierStatus
        );
        showToast('Steadfast ট্র্যাকিং গুগল শিটে সংরক্ষিত হয়েছে!');
      } catch (err: any) {
        console.error('Failed to sync steadfast tracking to sheet:', err);
      }
    }
  };

  // Create New Order
  const handleAddNewOrder = async (newOrder: Order) => {
    setIsSubmittingOrder(true);
    try {
      // 1. Update local state at the beginning of orders
      const orderWithRow: Order = {
        ...newOrder,
        rowIndex: orders.length + 3, // Approximate row index
      };
      setOrders((prev) => [orderWithRow, ...prev]);

      showToast(`নতুন অর্ডার ${newOrder.id} সফলভাবে তৈরি হয়েছে!`);

      // 2. Append to Google Sheet if token exists
      if (accessToken) {
        await appendSheetOrder(spreadsheetId, accessToken, newOrder, orderSheetTab);
        showToast('অর্ডারটি সরাসরি গুগল শিটে যুক্ত করা হয়েছে!');
      }
    } catch (err: any) {
      console.error('Error creating new order:', err);
      showToast(`শিটে অর্ডার যোগ করতে সমস্যা: ${err.message}`, 'error');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`${product.name} কার্টে যোগ করা হয়েছে!`);
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => setCart([]);

  const handlePlaceStoreOrder = async (orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    notes?: string;
  }) => {
    const totalAmount = cart.reduce((sum, item) => {
      const price = item.product.salePrice ?? item.product.regularPrice;
      return sum + price * item.quantity;
    }, 0) + 80;

    const productNames = cart
      .map((item) => `${item.product.name} (${item.quantity}x)`)
      .join(', ');

    const newOrder: Order = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.customerAddress,
      product: productNames || 'Rose 599tk',
      source: 'Website',
      amount: totalAmount,
      total: totalAmount,
      quantity: cart.reduce((q, item) => q + item.quantity, 0) || 1,
      status: 'Processing',
      trackingCode: `29${Math.floor(1000000 + Math.random() * 9000000)}`,
      courierStatus: 'pending',
      steadfastStatus: 'send to steadfast',
      date: '08/09/26',
      notes: orderData.notes,
    };

    await handleAddNewOrder(newOrder);
    setCart([]);
  };

  return (
    <div className="flex h-screen bg-[#0a0c13] text-gray-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'sheet') {
            setIsSheetSettingsOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        user={user}
        onOpenSettings={() => setIsSheetSettingsOpen(true)}
        onLogout={handleLogout}
        ordersCount={orders.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0c0e16]">
        {/* Top Info Bar for Google Sheet connection notification */}
        {!user && (
          <div className="bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-pink-950/40 border-b border-pink-500/20 px-6 py-2 flex items-center justify-between text-xs text-pink-300">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-pink-400 shrink-0" />
              <span>
                বর্তমানে ডেমো মোডে আছেন। আপনার গুগল শিট (<strong>{spreadsheetId.slice(0, 14)}...</strong>) এর সাথে লাইভ সিঙ্ক ও আপডেট করতে গুগল সাইন-ইন করুন।
              </span>
            </div>
            <button
              onClick={() => setIsSheetSettingsOpen(true)}
              className="font-bold underline hover:text-white shrink-0 ml-4"
            >
              কানেক্ট করুন →
            </button>
          </div>
        )}

        {/* View Switcher */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'home' && (
            <DashboardHome
              orders={orders}
              onNavigateToOrders={() => setActiveTab('orders')}
              onOpenNewOrder={() => setIsNewOrderOpen(true)}
              onSyncSheet={() => syncWithSheet()}
              isSyncing={isSyncing}
              onSelectOrder={(order) => setSelectedOrderForView(order)}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView
              orders={orders}
              onOpenNewOrder={() => setIsNewOrderOpen(true)}
              onSyncSheet={() => syncWithSheet()}
              isSyncing={isSyncing}
              onSelectOrder={(order) => setSelectedOrderForView(order)}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onSendToSteadfast={handleSendToSteadfast}
            />
          )}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'customers' && <CustomersView orders={orders} />}

          {activeTab === 'store' && (
            <StorefrontView
              products={products}
              onAddToCart={handleAddToCart}
              onOpenCart={() => setIsCartOpen(true)}
              cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
            />
          )}
        </div>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold backdrop-blur-md animate-fadeIn ${
            toastMessage.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-600/40 shadow-rose-950/50'
              : 'bg-pink-950/90 text-pink-200 border-pink-500/40 shadow-pink-950/50'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-pink-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* New Order Modal */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        onSubmit={handleAddNewOrder}
        isSubmitting={isSubmittingOrder}
      />

      {/* View & Edit Order Modal */}
      <ViewOrderModal
        order={selectedOrderForView}
        onClose={() => setSelectedOrderForView(null)}
        onUpdateStatus={handleUpdateOrderStatus}
        onSendToSteadfast={handleSendToSteadfast}
      />

      {/* Google Sheet Settings Modal */}
      <SheetSettingsModal
        isOpen={isSheetSettingsOpen}
        onClose={() => setIsSheetSettingsOpen(false)}
        spreadsheetId={spreadsheetId}
        onUpdateSpreadsheetId={(id) => {
          const cleanId = extractSpreadsheetId(id);
          setSpreadsheetId(cleanId);
          showToast(`গুগল শিট আইডি আপডেট করা হয়েছে: ${cleanId.slice(0, 12)}...`);
          if (accessToken) {
            syncWithSheet(cleanId, accessToken);
          }
        }}
        user={user}
        onSignIn={handleGoogleSignIn}
        onSignOut={handleLogout}
        isAuthLoading={isAuthLoading}
        onSyncNow={() => syncWithSheet()}
        isSyncing={isSyncing}
        onOpenAuthHelp={() => {
          setAuthErrorDomain(typeof window !== 'undefined' ? window.location.hostname : '');
          setIsAuthHelpOpen(true);
        }}
      />

      {/* Google Sign-in Help & Domain Modal */}
      <AuthHelpModal
        isOpen={isAuthHelpOpen}
        onClose={() => setIsAuthHelpOpen(false)}
        domain={authErrorDomain || (typeof window !== 'undefined' ? window.location.hostname : '')}
        onUsePublicMode={() => {
          syncWithSheet(spreadsheetId, null);
          showToast('পাবলিক শিট মোডে লাইভ ডাটা সিঙ্ক হচ্ছে...');
        }}
        onSaveManualToken={(token) => {
          setToken(token);
          setAccessToken(token);
          syncWithSheet(spreadsheetId, token);
          showToast('ম্যানুয়াল টোকেন সংরক্ষণ করা হয়েছে এবং শিট সিঙ্ক হচ্ছে!');
        }}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceStoreOrder}
        isSyncingOrder={isSubmittingOrder}
      />
    </div>
  );
}
