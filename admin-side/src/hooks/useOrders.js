import { useState, useEffect, useMemo, useCallback } from 'react';
import { orderService } from '../services/orderService';
import { useToast } from '../context/ToastContext';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = orderService.subscribe(
      (data) => {
        setOrders(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('useOrders subscription error:', err);
        setError(err?.message || 'Could not connect to orders stream.');
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Number of new unhandled orders
  const newCount = useMemo(() => {
    return orders.filter((o) => o.orderStatus === 'received').length;
  }, [orders]);

  // Operational status updater
  const updateStatus = useCallback(
    async (id, newStatus, { silent = false } = {}) => {
      try {
        await orderService.updateStatus(id, newStatus);
        setOrders((prev) =>
          prev.map((ord) => (ord.id === id || ord.orderId === id ? { ...ord, orderStatus: newStatus } : ord))
        );
        if (!silent) {
          const capitalized = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
          showToast(`Order status updated to "${capitalized}"`, 'success');
        }
      } catch (err) {
        showToast(err.message || 'Failed to update order status', 'error');
        throw err;
      }
    },
    [showToast]
  );

  // Price verification and order confirmation
  const verifyOrder = useCallback(
    async (id, verifiedTotal) => {
      try {
        await orderService.verifyOrder(id, verifiedTotal);
        setOrders((prev) =>
          prev.map((ord) =>
            ord.id === id || ord.orderId === id
              ? {
                  ...ord,
                  priceVerificationStatus: 'verified',
                  adminVerifiedTotal: Number(verifiedTotal),
                  adminVerifiedSubtotal: Number(verifiedTotal),
                  orderStatus: 'confirmed'
                }
              : ord
          )
        );
        showToast(`Price verified (₹${Number(verifiedTotal).toFixed(2)}) and order confirmed!`, 'success');
      } catch (err) {
        showToast(err.message || 'Failed to verify order price', 'error');
        throw err;
      }
    },
    [showToast]
  );

  // Payment status updater
  const updatePaymentStatus = useCallback(
    async (id, paymentStatus) => {
      try {
        await orderService.updatePaymentStatus(id, paymentStatus);
        setOrders((prev) =>
          prev.map((ord) => (ord.id === id || ord.orderId === id ? { ...ord, paymentStatus } : ord))
        );
        showToast(`Payment marked as "${paymentStatus.toUpperCase()}"`, 'success');
      } catch (err) {
        showToast(err.message || 'Failed to update payment status', 'error');
        throw err;
      }
    },
    [showToast]
  );

  // Order cancellation
  const cancelOrder = useCallback(
    async (id, reason) => {
      try {
        await orderService.cancel(id, reason);
        setOrders((prev) =>
          prev.map((ord) =>
            ord.id === id || ord.orderId === id
              ? { ...ord, orderStatus: 'cancelled', cancellationReason: reason }
              : ord
          )
        );
        showToast('Order cancelled', 'info');
      } catch (err) {
        showToast(err.message || 'Failed to cancel order', 'error');
        throw err;
      }
    },
    [showToast]
  );

  return {
    orders,
    loading,
    error,
    newCount,
    verifyOrder,
    updateStatus,
    updatePaymentStatus,
    cancelOrder
  };
};
