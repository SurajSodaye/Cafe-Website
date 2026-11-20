import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  UtensilsCrossed,
  Truck,
  Phone,
  User,
  Mail,
  Copy,
  Check,
  ChevronRight,
  AlertCircle,
  XCircle,
  Banknote,
  DollarSign,
  Flame,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useOrders } from '../hooks/useOrders';

const STATUS_CONFIG = {
  received: { label: 'Received', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  preparing: { label: 'Preparing', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  ready: { label: 'Ready', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  completed: { label: 'Completed', color: 'bg-cream-200 text-espresso-700 border-espresso-300' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-300' }
};

export const OrdersPage = () => {
  const {
    orders,
    loading,
    error,
    verifyOrder,
    updateStatus,
    updatePaymentStatus,
    cancelOrder
  } = useOrders();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFulfillment, setSelectedFulfillment] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  // Price verification state map per order: { [orderId]: string }
  const [priceOverrides, setPriceOverrides] = useState({});
  const [verifyingId, setVerifyingId] = useState(null);

  // Cancellation modal state
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = orders.length;
    const received = orders.filter((o) => o.orderStatus === 'received').length;
    const unverified = orders.filter((o) => o.priceVerificationStatus !== 'verified' && o.orderStatus !== 'cancelled').length;
    const preparing = orders.filter((o) => o.orderStatus === 'preparing' || o.orderStatus === 'confirmed').length;
    const ready = orders.filter((o) => o.orderStatus === 'ready').length;
    const completed = orders.filter((o) => o.orderStatus === 'completed').length;
    const revenue = orders
      .filter((o) => o.orderStatus === 'completed' || o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (Number(o.adminVerifiedTotal || o.customerQuotedTotal || o.total) || 0), 0);

    return { total, received, unverified, preparing, ready, completed, revenue };
  }, [orders]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Status Filter
      if (selectedStatus !== 'all' && order.orderStatus !== selectedStatus) {
        return false;
      }

      // 2. Fulfillment Filter
      if (selectedFulfillment !== 'all' && order.fulfillmentType !== selectedFulfillment) {
        return false;
      }

      // 3. Search query (Order ID, Customer Name, Customer Phone)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const idMatch = (order.orderId || order.id || '').toLowerCase().includes(q);
        const nameMatch = (order.customerName || '').toLowerCase().includes(q);
        const phoneMatch = (order.customerPhone || '').toLowerCase().includes(q);
        if (!idMatch && !nameMatch && !phoneMatch) {
          return false;
        }
      }

      return true;
    });
  }, [orders, selectedStatus, selectedFulfillment, searchQuery]);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVerifyPrice = async (order) => {
    const orderId = order.orderId || order.id;
    const defaultTotal = order.customerQuotedTotal ?? order.total ?? order.subtotal ?? 0;
    const enteredTotal = priceOverrides[orderId] !== undefined ? priceOverrides[orderId] : defaultTotal;
    const verifiedAmount = parseFloat(enteredTotal);

    if (isNaN(verifiedAmount) || verifiedAmount < 0) {
      alert('Please enter a valid non-negative verified total amount.');
      return;
    }

    setVerifyingId(orderId);
    try {
      await verifyOrder(orderId, verifiedAmount);
    } catch (err) {
      console.error('Verify price error:', err);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancellingOrderId) return;
    setIsCancelling(true);
    try {
      await cancelOrder(cancellingOrderId, cancellationReason || 'Customer / Kitchen cancellation');
      setCancellingOrderId(null);
      setCancellationReason('');
    } catch (err) {
      console.error('Cancel order error:', err);
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    document.title = 'Order Requests Dashboard | Brew & Bloom Admin';
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-cream/20">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-dark tracking-tight">
                Order Requests Dashboard
              </h1>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sage-50 text-sage-800 border border-sage-200">
                <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
                Live Firestore Stream
              </span>
            </div>
            <p className="text-xs text-espresso/70 mt-1">
              Direct customer requests, price verification, and Cash on Delivery order fulfillment
            </p>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total Orders */}
          <div className="p-4 rounded-xl bg-cream-light border border-cream/40 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-espresso/60 block">
              Total Requests
            </span>
            <span className="font-serif text-2xl font-bold text-espresso-dark block mt-1">
              {metrics.total}
            </span>
          </div>

          {/* New Received */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 block">
                Received
              </span>
              {metrics.received > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </div>
            <span className="font-serif text-2xl font-bold text-amber-900 block mt-1">
              {metrics.received}
            </span>
          </div>

          {/* Unverified Price */}
          <div className="p-4 rounded-xl bg-amber-100/50 border border-amber-300 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 block">
              Needs Verification
            </span>
            <span className="font-serif text-2xl font-bold text-amber-950 block mt-1">
              {metrics.unverified}
            </span>
          </div>

          {/* In Kitchen / Preparing */}
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-800 block">
              In Kitchen
            </span>
            <span className="font-serif text-2xl font-bold text-purple-900 block mt-1">
              {metrics.preparing}
            </span>
          </div>

          {/* Ready for Service */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
              Ready
            </span>
            <span className="font-serif text-2xl font-bold text-emerald-900 block mt-1">
              {metrics.ready}
            </span>
          </div>

          {/* Settled Revenue */}
          <div className="p-4 rounded-xl bg-terracotta/10 border border-terracotta/20 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta-dark block">
              Settled Revenue
            </span>
            <span className="font-serif text-2xl font-bold text-terracotta-dark block mt-1">
              ₹{metrics.revenue.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-xl bg-cream-light border border-cream/40 space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-espresso/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Order ID, Name, Phone..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-cream/60 text-espresso-dark placeholder:text-espresso/40 focus:outline-none focus:ring-1 focus:ring-terracotta"
              />
            </div>

            {/* Fulfillment Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-espresso/70 font-semibold whitespace-nowrap">
                Fulfillment:
              </span>
              <select
                value={selectedFulfillment}
                onChange={(e) => setSelectedFulfillment(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white rounded-lg border border-cream/60 text-espresso-dark focus:outline-none focus:ring-1 focus:ring-terracotta"
              >
                <option value="all">All Types</option>
                <option value="dinein">Dine-In</option>
                <option value="takeaway">Takeaway</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-cream/20">
            {[
              { id: 'all', label: 'All Orders', count: orders.length },
              { id: 'received', label: 'Received', count: metrics.received },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'preparing', label: 'Preparing', count: metrics.preparing },
              { id: 'ready', label: 'Ready', count: metrics.ready },
              { id: 'completed', label: 'Completed', count: metrics.completed },
              { id: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedStatus === tab.id
                    ? 'bg-terracotta text-cream shadow-xs'
                    : 'bg-white text-espresso/80 hover:bg-cream/40 border border-cream/40'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                      selectedStatus === tab.id
                        ? 'bg-cream/20 text-cream'
                        : 'bg-espresso/10 text-espresso-dark'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading / Error / Empty States */}
        {loading && (
          <div className="p-12 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-espresso/60 mt-3 font-medium">Connecting to order requests stream...</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
            {error}
          </div>
        )}

        {!loading && filteredOrders.length === 0 && (
          <div className="p-12 rounded-2xl bg-cream-light border border-cream/40 text-center">
            <ShoppingBag className="w-10 h-10 text-espresso/40 mx-auto mb-3" />
            <h3 className="font-serif text-base font-bold text-espresso-dark">No orders found</h3>
            <p className="text-xs text-espresso/60 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedStatus !== 'all' || selectedFulfillment !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'No customer order requests have been submitted yet. New orders will appear here automatically.'}
            </p>
          </div>
        )}

        {/* Orders Feed Cards */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const orderId = order.orderId || order.id;
            const formattedDate = order.createdAt
              ? new Date(
                  typeof order.createdAt.toDate === 'function'
                    ? order.createdAt.toDate()
                    : order.createdAt
                ).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Just now';

            const statusObj = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.received;
            const isVerified = order.priceVerificationStatus === 'verified';
            const customerQuoted = Number(order.customerQuotedTotal ?? order.total ?? order.subtotal ?? 0);
            const verifiedAmount = isVerified && order.adminVerifiedTotal !== null ? Number(order.adminVerifiedTotal) : customerQuoted;
            const currentOverride = priceOverrides[orderId] !== undefined ? priceOverrides[orderId] : customerQuoted;

            return (
              <div
                key={orderId}
                className="bg-white rounded-2xl border border-cream/60 shadow-xs hover:border-terracotta/40 transition-all overflow-hidden"
              >
                {/* Order Top Ribbon */}
                <div className="px-5 py-3.5 bg-cream-light/60 border-b border-cream/40 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-espresso-dark">
                      {orderId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(orderId)}
                      className="text-espresso/40 hover:text-terracotta transition-colors p-1"
                      title="Copy Order ID"
                    >
                      {copiedId === orderId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="text-xs text-espresso/40">&bull;</span>
                    <span className="text-xs text-espresso/70 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formattedDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Price Verification Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
                        isVerified
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {isVerified ? '✓ Price Verified' : '⚠ Quote Unverified'}
                    </span>

                    {/* Fulfillment Badge */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cream border border-cream/80 text-espresso-dark capitalize">
                      {order.fulfillmentType === 'dinein' && (
                        <UtensilsCrossed className="w-3.5 h-3.5 text-terracotta" />
                      )}
                      {order.fulfillmentType === 'takeaway' && (
                        <ShoppingBag className="w-3.5 h-3.5 text-terracotta" />
                      )}
                      {order.fulfillmentType === 'delivery' && (
                        <Truck className="w-3.5 h-3.5 text-terracotta" />
                      )}
                      <span>{order.fulfillmentType}</span>
                    </span>

                    {/* Operational Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${statusObj.color}`}
                    >
                      {statusObj.label}
                    </span>
                  </div>
                </div>

                {/* Main Order Content */}
                <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Customer & Fulfillment Details (4 cols) */}
                  <div className="lg:col-span-4 space-y-3.5 text-xs text-espresso/80 border-b lg:border-b-0 lg:border-r border-cream/40 pb-4 lg:pb-0 lg:pr-6">
                    {/* Customer Info */}
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-espresso/50 block mb-1">
                        Customer Contact
                      </span>
                      <p className="font-bold text-sm text-espresso-dark flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-espresso/50" />
                        {order.customerName}
                      </p>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="text-terracotta hover:underline font-semibold flex items-center gap-1.5 mt-0.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {order.customerPhone}
                      </a>
                      {order.customerEmail && (
                        <p className="text-espresso/60 flex items-center gap-1.5 mt-0.5 truncate">
                          <Mail className="w-3.5 h-3.5" />
                          {order.customerEmail}
                        </p>
                      )}
                    </div>

                    {/* Fulfillment Details */}
                    <div className="pt-2 border-t border-cream/30">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-espresso/50 block mb-1">
                        Fulfillment Specifics
                      </span>
                      {order.fulfillmentType === 'dinein' && (
                        <div className="space-y-0.5">
                          <p className="font-semibold text-espresso-dark">
                            Table: {order.fulfillmentDetails?.tableNumber}
                          </p>
                          <p>Guests: {order.fulfillmentDetails?.guestCount || 1}</p>
                          {order.fulfillmentDetails?.diningNotes && (
                            <p className="italic text-espresso/60 mt-1">
                              Note: "{order.fulfillmentDetails.diningNotes}"
                            </p>
                          )}
                        </div>
                      )}

                      {order.fulfillmentType === 'takeaway' && (
                        <div className="space-y-0.5">
                          <p className="font-semibold text-espresso-dark">
                            Pickup Window: {order.fulfillmentDetails?.pickupTime}
                          </p>
                          {order.fulfillmentDetails?.takeawayNotes && (
                            <p className="italic text-espresso/60 mt-1">
                              Note: "{order.fulfillmentDetails.takeawayNotes}"
                            </p>
                          )}
                        </div>
                      )}

                      {order.fulfillmentType === 'delivery' && (
                        <div className="space-y-0.5">
                          <p className="font-semibold text-espresso-dark leading-snug">
                            {order.fulfillmentDetails?.address}
                          </p>
                          {order.fulfillmentDetails?.landmark && (
                            <p>Landmark: {order.fulfillmentDetails.landmark}</p>
                          )}
                          <p>PIN: {order.fulfillmentDetails?.pincode}</p>
                          {order.fulfillmentDetails?.deliveryNotes && (
                            <p className="italic text-espresso/60 mt-1">
                              Note: "{order.fulfillmentDetails.deliveryNotes}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Payment Info */}
                    <div className="pt-2 border-t border-cream/30">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-espresso/50">
                          Payment Settlement
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.paymentStatus === 'paid' ? 'Paid' : 'Cash Pending'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-espresso-dark mt-1 flex items-center gap-1.5">
                        <Banknote className="w-3.5 h-3.5 text-espresso/50" />
                        Cash on Delivery / Table
                      </p>
                      {order.paymentStatus !== 'paid' && (
                        <button
                          type="button"
                          onClick={() => updatePaymentStatus(orderId, 'paid')}
                          className="mt-2 w-full py-1.5 px-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Mark Cash Collected (Paid)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Middle: Ordered Items List & Quoted vs Verified Totals (5 cols) */}
                  <div className="lg:col-span-5 space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-espresso/50 block mb-2">
                      Customer Items ({order.items?.length || 0})
                    </span>
                    <div className="divide-y divide-cream/30 max-h-56 overflow-y-auto pr-1">
                      {Array.isArray(order.items) &&
                        order.items.map((item, idx) => (
                          <div key={idx} className="py-2 flex items-start justify-between gap-3 text-xs">
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-espresso-dark">
                                <span className="w-5 text-terracotta">{item.quantity}x</span>
                                <span>{item.name}</span>
                              </div>
                              {/* Customization Details */}
                              <div className="flex flex-wrap gap-1 mt-1 pl-6">
                                {item.size && (
                                  <span className="text-[10px] bg-cream px-1.5 py-0.2 rounded border border-cream/60 text-espresso/80 font-medium">
                                    {item.size.name}
                                  </span>
                                )}
                                {item.milk && (
                                  <span className="text-[10px] bg-cream px-1.5 py-0.2 rounded border border-cream/60 text-espresso/80 font-medium">
                                    {item.milk.name}
                                  </span>
                                )}
                                {Array.isArray(item.addOns) &&
                                  item.addOns.map((add, aIdx) => (
                                    <span
                                      key={aIdx}
                                      className="text-[10px] bg-terracotta/10 text-terracotta-dark px-1.5 py-0.2 rounded font-medium"
                                    >
                                      +{add.name}
                                    </span>
                                  ))}
                              </div>
                              {item.specialInstructions && (
                                <p className="text-[11px] text-espresso/70 italic mt-0.5 pl-6">
                                  "{item.specialInstructions}"
                                </p>
                              )}
                            </div>
                            <span className="font-semibold text-espresso-dark whitespace-nowrap">
                              ₹{Number(item.customerDisplayedLineTotal ?? item.itemTotal ?? (item.unitPrice * item.quantity)).toFixed(2)}
                            </span>
                          </div>
                        ))}
                    </div>

                    {/* Pricing comparison */}
                    <div className="pt-3 border-t border-cream/40 space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-espresso/70">
                        <span>Customer Quoted Amount:</span>
                        <span className="font-semibold text-espresso-dark">
                          ₹{customerQuoted.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-espresso-dark">
                        <span>{isVerified ? 'Admin Verified Amount:' : 'Effective Total:'}</span>
                        <span className={`font-serif text-base ${isVerified ? 'text-emerald-700' : 'text-amber-800'}`}>
                          ₹{verifiedAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Operational Actions & Price Verification Stepper (3 cols) */}
                  <div className="lg:col-span-3 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-cream/40 pt-4 lg:pt-0 lg:pl-6 space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-espresso/50 block mb-2">
                        Operational Controls
                      </span>

                      {/* State 1: Received & Unverified -> Enforce Price Verification before Confirming */}
                      {order.orderStatus === 'received' && !isVerified && (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Verify Price &amp; Stock</span>
                          </div>
                          <p className="text-[11px] text-amber-800 leading-tight">
                            Check items and confirm the final payable total:
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-amber-900">₹</span>
                            <input
                              type="number"
                              step="0.01"
                              value={currentOverride}
                              onChange={(e) =>
                                setPriceOverrides({
                                  ...priceOverrides,
                                  [orderId]: e.target.value
                                })
                              }
                              className="w-full px-2 py-1 text-xs font-bold bg-white border border-amber-300 rounded text-espresso-dark focus:outline-none focus:ring-1 focus:ring-terracotta"
                            />
                          </div>
                          <button
                            type="button"
                            disabled={verifyingId === orderId}
                            onClick={() => handleVerifyPrice(order)}
                            className="w-full py-2 px-3 bg-terracotta hover:bg-terracotta-dark text-cream rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{verifyingId === orderId ? 'Verifying...' : 'Verify & Confirm'}</span>
                          </button>
                        </div>
                      )}

                      {/* State 2: Received & Already Verified (or confirmed status) */}
                      {order.orderStatus === 'received' && isVerified && (
                        <button
                          type="button"
                          onClick={() => updateStatus(orderId, 'confirmed')}
                          className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Advance to Confirmed
                        </button>
                      )}

                      {order.orderStatus === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(orderId, 'preparing')}
                          className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Flame className="w-3.5 h-3.5" />
                          Send to Kitchen (Preparing)
                        </button>
                      )}

                      {order.orderStatus === 'preparing' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(orderId, 'ready')}
                          className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark Ready for Service
                        </button>
                      )}

                      {order.orderStatus === 'ready' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(orderId, 'completed')}
                          className="w-full py-2 px-3 bg-espresso hover:bg-espresso-dark text-cream rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Complete Order
                        </button>
                      )}

                      {order.orderStatus === 'completed' && (
                        <div className="p-2.5 rounded-xl bg-cream text-center text-xs text-espresso/70 font-semibold">
                          ✓ Order Completed
                        </div>
                      )}

                      {order.orderStatus === 'cancelled' && (
                        <div className="p-2.5 rounded-xl bg-red-50 text-center text-xs text-red-700 font-semibold">
                          ✕ Order Cancelled
                          {order.cancellationReason && (
                            <p className="font-normal text-[10px] mt-0.5">
                              Reason: "{order.cancellationReason}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Cancellation Trigger */}
                    {order.orderStatus !== 'completed' && order.orderStatus !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => {
                          setCancellingOrderId(orderId);
                          setCancellationReason('');
                        }}
                        className="w-full text-center text-[11px] font-semibold text-red-600 hover:text-red-700 py-1 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cancellation Modal */}
        {cancellingOrderId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-dark/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg border border-cream/40 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 text-red-600">
                <XCircle className="w-6 h-6" />
                <h3 className="font-serif text-lg font-bold text-espresso-dark">Cancel Order</h3>
              </div>
              <p className="text-xs text-espresso/70">
                Are you sure you want to cancel order <span className="font-mono font-bold">{cancellingOrderId}</span>? Please provide a brief cancellation reason.
              </p>
              <textarea
                rows={2}
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="e.g., Customer requested cancellation / ingredient unavailable"
                className="w-full p-2.5 text-xs bg-cream-light rounded-xl border border-cream/80 text-espresso-dark focus:outline-none focus:ring-1 focus:ring-terracotta"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingOrderId(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-espresso/80 hover:bg-cream-light"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={isCancelling}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs"
                >
                  {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
