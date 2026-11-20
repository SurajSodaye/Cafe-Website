import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  ArrowRight,
  ExternalLink,
  UtensilsCrossed,
  Truck,
  AlertCircle,
  Coffee,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { orderService } from '../services/orderService';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/layout/SEO';
import { formatCurrency } from '../utils/currency';
import { PRIMARY_FALLBACK_IMAGE, SVG_FALLBACK_IMAGE } from '../utils/imageFallback';

export default function MyOrdersPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useCustomerAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login?redirect=/my-orders', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch customer orders from Firestore `orderRequests`
  useEffect(() => {
    let isMounted = true;
    async function loadOrders() {
      if (!user?.uid) return;
      try {
        setLoading(true);
        setError('');
        const userOrders = await orderService.getCustomerOrders(user.uid);
        if (isMounted) {
          setOrders(userOrders);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load customer orders:', err);
          setError('Unable to load your orders. Please check your connection.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (user?.uid) {
      loadOrders();
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  if (authLoading || (loading && !orders.length)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-cream-50">
        <div className="w-12 h-12 rounded-full border-4 border-espresso-200 border-t-terracotta-500 animate-spin" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-espresso-600">
          Loading your orders...
        </p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="My Orders"
        description="View your Brew & Bloom café order history and live order status."
      />

      <div className="min-h-screen bg-cream-50 py-8 sm:py-12 border-b border-espresso-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900 tracking-tight">
                My Orders
              </h1>
              <p className="mt-1 text-sm text-espresso-600">
                Track your order requests and review past café visits
              </p>
            </div>
            <Link to="/menu">
              <Button className="bg-espresso-900 text-cream-50 hover:bg-espresso-950 flex items-center gap-1.5 self-start">
                <Coffee className="w-4 h-4" />
                <span>Order Again</span>
              </Button>
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-terracotta-50 border border-terracotta-200 text-terracotta-900 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-terracotta-600 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && orders.length === 0 && (
            <div className="bg-cream-100/70 border border-espresso-100 rounded-3xl p-10 text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-espresso-100 text-espresso-600 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-espresso-900 mb-2">
                No Orders Placed Yet
              </h3>
              <p className="text-sm text-espresso-600 max-w-sm mx-auto mb-6">
                You haven't placed any orders with Brew & Bloom yet. Browse our freshly roasted brews and treats!
              </p>
              <Link to="/menu">
                <Button className="bg-terracotta-600 hover:bg-terracotta-700 text-white">
                  Explore Menu
                </Button>
              </Link>
            </div>
          )}

          {/* Orders List */}
          <div className="space-y-6">
            {orders.map((order) => {
              const formattedDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Just now';

              const isVerified = order.priceVerificationStatus === 'verified';
              const displayTotal = isVerified && order.adminVerifiedTotal !== null
                ? order.adminVerifiedTotal
                : (order.customerQuotedTotal || order.total || order.subtotal || 0);

              return (
                <div
                  key={order.orderId || order.id}
                  className="bg-cream-100/80 border border-espresso-100 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-espresso-300 transition-all"
                >
                  {/* Top Bar: Order ID, Date & Status Pills */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-espresso-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-espresso-900">
                          {order.orderId || order.id}
                        </span>
                        <span className="text-xs text-espresso-400">&bull;</span>
                        <span className="text-xs text-espresso-500">{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-espresso-600 capitalize">
                          {order.fulfillmentType === 'dinein' && (
                            <UtensilsCrossed className="w-3.5 h-3.5 text-espresso-500" />
                          )}
                          {order.fulfillmentType === 'takeaway' && (
                            <ShoppingBag className="w-3.5 h-3.5 text-espresso-500" />
                          )}
                          {order.fulfillmentType === 'delivery' && (
                            <Truck className="w-3.5 h-3.5 text-espresso-500" />
                          )}
                          <span>{order.fulfillmentType}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                      {/* Price Verification Status Badge */}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isVerified
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {isVerified ? 'Price Verified' : 'Quote Unverified'}
                      </span>

                      {/* Order Status Badge */}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          order.orderStatus === 'completed'
                            ? 'bg-sage-100 text-sage-800'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-terracotta-100 text-terracotta-800'
                            : 'bg-espresso-200/80 text-espresso-800'
                        }`}
                      >
                        {order.orderStatus || 'Received'}
                      </span>

                      {/* Payment Status Badge */}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          order.paymentStatus === 'paid'
                            ? 'bg-sage-100 text-sage-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.paymentStatus === 'paid' ? 'Paid' : 'Cash Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="py-4 space-y-2">
                    {Array.isArray(order.items) &&
                      order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-espresso-800">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-bold text-espresso-900 w-5">
                              {item.quantity}x
                            </span>
                            <span className="truncate">{item.name}</span>
                            {item.size && (
                              <span className="text-[10px] bg-espresso-100 text-espresso-600 px-1 rounded">
                                {item.size.name}
                              </span>
                            )}
                          </div>
                          <span className="font-medium whitespace-nowrap ml-2">
                            {formatCurrency(
                              item.customerDisplayedLineTotal ??
                                item.itemTotal ??
                                ((item.unitPrice || 0) * (item.quantity || 1))
                            )}
                          </span>
                        </div>
                      ))}
                  </div>

                  {/* Bottom Bar: Total & Action Link */}
                  <div className="pt-4 border-t border-espresso-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-500 block">
                        {isVerified ? 'Confirmed Amount' : 'Customer Quote'}
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif text-lg font-bold text-espresso-900">
                          {formatCurrency(displayTotal)}
                        </span>
                        {!isVerified && (
                          <span className="text-[10px] text-amber-700 font-medium">
                            (Awaiting verification)
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/order-confirmation/${order.orderId || order.id}`}
                      state={{ order }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta-700 hover:text-terracotta-800 transition-colors"
                    >
                      <span>View Receipt &amp; Status</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
