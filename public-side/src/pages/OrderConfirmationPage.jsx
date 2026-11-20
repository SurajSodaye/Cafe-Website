import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  MapPin,
  UtensilsCrossed,
  ShoppingBag,
  Truck,
  Phone,
  User,
  Mail,
  Copy,
  Check,
  ArrowRight,
  Coffee,
  AlertCircle,
  Banknote,
  Receipt,
  Sparkles
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/layout/SEO';
import { formatCurrency } from '../utils/currency';
import { PRIMARY_FALLBACK_IMAGE, SVG_FALLBACK_IMAGE } from '../utils/imageFallback';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useCustomerAuth();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Fetch verified order details from Firestore `orderRequests`
  useEffect(() => {
    let isMounted = true;
    async function fetchOrder() {
      if (!orderId) return;
      try {
        const data = await orderService.getOrderById(orderId);
        if (isMounted) {
          if (data) {
            setOrder(data);
          } else {
            setError('The requested order could not be found.');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Fetch order error:', err);
          setError('Unable to load order details. Please verify your connection.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (!order && orderId) {
      fetchOrder();
    }
    return () => {
      isMounted = false;
    };
  }, [orderId, order]);

  const handleCopyOrderId = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-cream-50">
        <div className="w-12 h-12 rounded-full border-4 border-espresso-200 border-t-terracotta-500 animate-spin" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-espresso-600">
          Loading order details...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-cream-50 text-center">
        <div className="w-16 h-16 rounded-full bg-terracotta-100 text-terracotta-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-2">
          Order Not Found
        </h2>
        <p className="text-sm text-espresso-600 max-w-md mb-6">
          {error || "We couldn't retrieve the details for this order."}
        </p>
        <div className="flex gap-4">
          <Link to="/my-orders">
            <Button variant="outline">View My Orders</Button>
          </Link>
          <Link to="/menu">
            <Button className="bg-espresso-900 text-cream-50 hover:bg-espresso-950">Back to Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  const {
    customerName,
    customerEmail,
    customerPhone,
    fulfillmentType,
    fulfillmentDetails = {},
    items = [],
    customerQuotedSubtotal,
    customerQuotedTotal,
    adminVerifiedSubtotal,
    adminVerifiedTotal,
    priceVerificationStatus = 'unverified',
    subtotal = customerQuotedSubtotal || 0,
    total = customerQuotedTotal || subtotal || 0,
    paymentMethod = 'cash',
    paymentStatus = 'pending',
    orderStatus = 'received',
    createdAt
  } = order;

  const isVerified = priceVerificationStatus === 'verified';
  const effectiveTotal = isVerified && adminVerifiedTotal !== null ? adminVerifiedTotal : (customerQuotedTotal || total);

  return (
    <>
      <SEO
        title={`Order Confirmed: ${orderId} — Brew & Bloom Café`}
        description="Your Brew & Bloom order request has been received and confirmed."
      />

      <div className="min-h-screen bg-cream-50 py-8 sm:py-12 border-b border-espresso-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Success Banner */}
          <div className="bg-cream-100/90 border border-espresso-100 rounded-3xl p-6 sm:p-10 text-center shadow-xs mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sage-100 text-sage-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-widest text-sage-700 bg-sage-50 border border-sage-200 px-3 py-1 rounded-full">
              Order Request Registered in Café
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900 tracking-tight mt-3">
              Thank You, {customerName || 'Customer'}!
            </h1>

            <p className="mt-2 text-sm text-espresso-600 max-w-lg mx-auto leading-relaxed">
              Your order has been recorded directly in our café management queue. Pay with cash upon delivery or table service.
            </p>

            {/* Order ID Pill */}
            <div className="mt-6 inline-flex items-center gap-2 bg-espresso-100/80 border border-espresso-200 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono text-espresso-900 shadow-xs">
              <span className="font-sans text-xs text-espresso-600 uppercase tracking-wider font-semibold">
                Order ID:
              </span>
              <span className="font-bold">{orderId}</span>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="ml-1 text-espresso-500 hover:text-terracotta-600 transition-colors p-1"
                title="Copy Order ID"
                aria-label="Copy Order ID"
              >
                {copied ? <Check className="w-4 h-4 text-sage-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Pricing Verification Notice */}
          <div
            className={`mb-6 p-4 rounded-2xl border flex items-start gap-3 shadow-xs ${
              isVerified
                ? 'bg-sage-50 border-sage-200 text-sage-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            {isVerified ? (
              <CheckCircle2 className="w-5 h-5 text-sage-600 shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <span className="font-bold block uppercase tracking-wide">
                {isVerified ? 'Price Verified by Café' : 'Customer Quoted Price (Verification Pending)'}
              </span>
              <p className="mt-0.5 leading-relaxed">
                {isVerified
                  ? `Our café manager has verified your items. Your final confirmed amount is ${formatCurrency(adminVerifiedTotal)}.`
                  : 'Your submitted order total is an unverified quote. Our café manager verifies all item prices and availability before preparing your order.'}
              </p>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-cream-100/90 border border-espresso-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            {/* Status & Payment Headers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-espresso-100 text-center sm:text-left">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-espresso-500">
                  Order Status
                </span>
                <span className="inline-block mt-1 text-xs font-bold uppercase tracking-wider bg-sage-100 text-sage-800 px-2.5 py-0.5 rounded-full">
                  {orderStatus}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-espresso-500">
                  Payment Method
                </span>
                <span className="block mt-1 text-xs font-semibold text-espresso-900">
                  Cash ({paymentMethod.toUpperCase()})
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-espresso-500">
                  Payment Status
                </span>
                <span className="inline-block mt-1 text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                  {paymentStatus}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-espresso-500">
                  Fulfillment
                </span>
                <span className="block mt-1 text-xs font-semibold text-espresso-900 capitalize">
                  {fulfillmentType}
                </span>
              </div>
            </div>

            {/* Customer & Fulfillment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-espresso-100 text-sm">
              <div>
                <h3 className="font-serif text-sm font-bold text-espresso-900 mb-2 uppercase tracking-wider">
                  Contact Information
                </h3>
                <div className="space-y-1.5 text-xs text-espresso-700">
                  <p className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-espresso-400" />
                    <span>{customerName}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-espresso-400" />
                    <span>{customerPhone}</span>
                  </p>
                  {customerEmail && (
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-espresso-400" />
                      <span>{customerEmail}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-serif text-sm font-bold text-espresso-900 mb-2 uppercase tracking-wider">
                  Fulfillment Details
                </h3>
                <div className="space-y-1.5 text-xs text-espresso-700">
                  {fulfillmentType === 'dinein' && (
                    <>
                      <p className="font-semibold text-espresso-900">
                        Table: {fulfillmentDetails.tableNumber}
                      </p>
                      <p>Guests: {fulfillmentDetails.guestCount || 1}</p>
                      {fulfillmentDetails.diningNotes && (
                        <p className="italic text-espresso-500">"{fulfillmentDetails.diningNotes}"</p>
                      )}
                    </>
                  )}

                  {fulfillmentType === 'takeaway' && (
                    <>
                      <p className="font-semibold text-espresso-900">
                        Pickup Window: {fulfillmentDetails.pickupTime}
                      </p>
                      <p className="text-espresso-500">Pickup Counter: Brew & Bloom Café Main Bar</p>
                      {fulfillmentDetails.takeawayNotes && (
                        <p className="italic text-espresso-500">"{fulfillmentDetails.takeawayNotes}"</p>
                      )}
                    </>
                  )}

                  {fulfillmentType === 'delivery' && (
                    <>
                      <p className="font-semibold text-espresso-900">
                        {fulfillmentDetails.address}
                      </p>
                      {fulfillmentDetails.landmark && (
                        <p>Landmark: {fulfillmentDetails.landmark}</p>
                      )}
                      <p>PIN Code: {fulfillmentDetails.pincode}</p>
                      {fulfillmentDetails.deliveryNotes && (
                        <p className="italic text-espresso-500">"{fulfillmentDetails.deliveryNotes}"</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Itemized Snapshot */}
            <div>
              <h3 className="font-serif text-base font-bold text-espresso-900 mb-4">
                Ordered Items
              </h3>
              <div className="divide-y divide-espresso-100">
                {items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-espresso-100 flex-shrink-0 border border-espresso-100 relative">
                        <img
                          src={item.image || PRIMARY_FALLBACK_IMAGE}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = SVG_FALLBACK_IMAGE;
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-espresso-900">{item.name}</h4>
                        <div className="text-[11px] text-espresso-600 mt-0.5">
                          <span>Qty: {item.quantity}</span>
                          <span className="mx-1">&bull;</span>
                          <span>
                            {formatCurrency(
                              item.customerDisplayedUnitPrice ?? item.unitPrice ?? 0
                            )}{' '}
                            each
                          </span>
                        </div>
                        {/* Customization Details */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.size && (
                            <span className="text-[10px] bg-espresso-100 text-espresso-700 px-1.5 py-0.2 rounded font-medium">
                              {item.size.name}
                            </span>
                          )}
                          {item.milk && (
                            <span className="text-[10px] bg-espresso-100 text-espresso-700 px-1.5 py-0.2 rounded font-medium">
                              {item.milk.name}
                            </span>
                          )}
                          {Array.isArray(item.addOns) &&
                            item.addOns.map((addon, aIdx) => (
                              <span
                                key={aIdx}
                                className="text-[10px] bg-terracotta-50 text-terracotta-700 px-1.5 py-0.2 rounded font-medium"
                              >
                                +{addon.name}
                              </span>
                            ))}
                        </div>
                        {item.specialInstructions && (
                          <p className="text-[10px] text-espresso-500 italic mt-0.5">
                            "{item.specialInstructions}"
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-espresso-900 whitespace-nowrap">
                      {formatCurrency(
                        item.customerDisplayedLineTotal ??
                          item.itemTotal ??
                          ((item.unitPrice || 0) * (item.quantity || 1))
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Pricing Summary */}
            <div className="border-t border-espresso-200 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-espresso-700">
                <span>Customer Quoted Subtotal</span>
                <span>{formatCurrency(customerQuotedSubtotal || subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-espresso-700">
                <span>Delivery & Service Fee</span>
                <span className="text-sage-700 font-medium">₹0.00 (Included)</span>
              </div>
              <div className="border-t border-dashed border-espresso-200 pt-3 flex justify-between items-center">
                <div>
                  <span className="font-serif text-base font-bold text-espresso-900 block">
                    {isVerified ? 'Confirmed Final Total' : 'Submitted Total Quote'}
                  </span>
                  <span className="text-[11px] text-espresso-500">
                    Pay in Cash upon delivery / table service
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-serif text-2xl font-bold text-terracotta-700">
                    {formatCurrency(effectiveTotal)}
                  </span>
                  {!isVerified && (
                    <span className="block text-[10px] text-amber-700 font-medium">
                      (Subject to café review)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-espresso-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link to="/my-orders" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-espresso-300 text-espresso-800 hover:bg-espresso-100"
                >
                  View My Orders
                </Button>
              </Link>
              <Link to="/menu" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-espresso-900 text-cream-50 hover:bg-espresso-950 flex items-center justify-center gap-1.5">
                  <span>Continue Browsing Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
