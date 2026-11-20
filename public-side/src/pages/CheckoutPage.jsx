import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  ShoppingBag,
  Truck,
  Clock,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  AlertCircle,
  Banknote,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Info,
  Sparkles,
  Lock,
  Calendar
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { orderService } from '../services/orderService';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/layout/SEO';
import { DietaryBadge } from '../components/ui/Badge';
import { formatCurrency } from '../utils/currency';
import { PRIMARY_FALLBACK_IMAGE, SVG_FALLBACK_IMAGE } from '../utils/imageFallback';

export default function CheckoutPage() {
  const {
    items,
    totalItems,
    subtotal,
    clearCart,
    hasInvalidPriceItems,
    invalidPriceItems
  } = useCart();

  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    customerProfile,
    profileLoading,
    updateCustomerProfile
  } = useCustomerAuth();

  const navigate = useNavigate();

  // Stable idempotency key per checkout session
  const idempotencyKeyRef = useRef(
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  );

  // Redirect to customer login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login?redirect=/checkout', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // If cart is empty, redirect to menu
  useEffect(() => {
    if (items.length === 0 && !authLoading) {
      navigate('/menu', { replace: true });
    }
  }, [items, authLoading, navigate]);

  // Fulfillment method state: 'takeaway' | 'dinein' | 'delivery'
  const [fulfillmentMethod, setFulfillmentMethod] = useState('takeaway');

  // Contact details states
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [saveProfileDetails, setSaveProfileDetails] = useState(false);
  const [hasUserEditedName, setHasUserEditedName] = useState(false);
  const [hasUserEditedPhone, setHasUserEditedPhone] = useState(false);

  // Dine-in fields
  const [tableNumber, setTableNumber] = useState('');
  const [guestCount, setGuestCount] = useState('1');
  const [diningNotes, setDiningNotes] = useState('');

  // Takeaway fields
  const [pickupTime, setPickupTime] = useState('ASAP (~15-20 mins)');
  const [takeawayNotes, setTakeawayNotes] = useState('');

  // Delivery fields
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pinCode, setPinCode] = useState('411001');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Validation & Submission states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Auto-fill customer profile details on mount or profile load
  useEffect(() => {
    if (!hasUserEditedName) {
      const initialName = customerProfile?.name || user?.displayName || '';
      if (initialName) setContactName(initialName);
    }
    if (!hasUserEditedPhone) {
      const initialPhone = customerProfile?.phone || user?.phoneNumber || '';
      if (initialPhone) setContactPhone(initialPhone);
    }
    // Auto-fill delivery address if saved in customerProfile
    if (customerProfile?.address && !streetAddress) {
      setStreetAddress(customerProfile.address);
    }
    if (customerProfile?.pincode && !pinCode) {
      setPinCode(customerProfile.pincode);
    }
  }, [customerProfile, user, hasUserEditedName, hasUserEditedPhone]);

  // Loading state while checking authentication or cart
  if (authLoading || profileLoading || !isAuthenticated || items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-cream-50">
        <div className="w-12 h-12 rounded-full border-4 border-espresso-200 border-t-terracotta-500 animate-spin" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-espresso-600">
          Preparing checkout tray...
        </p>
      </div>
    );
  }

  const validate = () => {
    const errs = {};

    if (!contactName.trim()) {
      errs.contactName = 'Customer full name is required.';
    }

    if (!contactPhone.trim()) {
      errs.contactPhone = 'Contact phone number is required.';
    } else {
      const digitsOnly = contactPhone.replace(/\D/g, '');
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        errs.contactPhone = 'Please provide a valid phone number (at least 7 digits).';
      }
    }

    if (fulfillmentMethod === 'dinein') {
      if (!tableNumber.trim()) {
        errs.tableNumber = 'Please specify your table number.';
      }
    }

    if (fulfillmentMethod === 'takeaway') {
      if (!pickupTime.trim()) {
        errs.pickupTime = 'Please select an estimated pickup window.';
      }
    }

    if (fulfillmentMethod === 'delivery') {
      if (!streetAddress.trim()) {
        errs.streetAddress = 'Complete street address is required for delivery.';
      }
      if (!pinCode.trim() || pinCode.trim().length < 4) {
        errs.pinCode = 'A valid PIN / Postal code is required.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOrderSubmission = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (hasInvalidPriceItems) {
      setSubmitError(
        'One or more items in your tray has an unverified price. Please remove them before proceeding.'
      );
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    if (!validate()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Build fulfillment details
      let fulfillmentDetails = {};
      if (fulfillmentMethod === 'dinein') {
        fulfillmentDetails = {
          tableNumber: tableNumber.trim(),
          guestCount: parseInt(guestCount, 10) || 1,
          diningNotes: diningNotes.trim()
        };
      } else if (fulfillmentMethod === 'takeaway') {
        fulfillmentDetails = {
          pickupTime: pickupTime.trim(),
          takeawayNotes: takeawayNotes.trim()
        };
      } else if (fulfillmentMethod === 'delivery') {
        fulfillmentDetails = {
          address: streetAddress.trim(),
          landmark: landmark.trim(),
          pincode: pinCode.trim(),
          deliveryNotes: deliveryNotes.trim()
        };
      }

      // 2. Build verified items payload matching direct Firestore schema
      const orderItems = items.map((cartItem) => {
        const sizeObj = cartItem.selectedSize || cartItem.customizations?.size || null;
        const milkObj = cartItem.selectedMilk || cartItem.customizations?.milk || null;
        const addOnsList = Array.isArray(cartItem.selectedAddOns)
          ? cartItem.selectedAddOns
          : Array.isArray(cartItem.customizations?.addOns)
          ? cartItem.customizations.addOns
          : [];
        const notesStr = String(
          cartItem.specialNotes || cartItem.customizations?.notes || ''
        ).trim();

        const selectedCustomizations = [];
        if (sizeObj?.name) selectedCustomizations.push(`Size: ${sizeObj.name}`);
        if (milkObj?.name) selectedCustomizations.push(`Milk: ${milkObj.name}`);
        addOnsList.forEach((a) => selectedCustomizations.push(`+${a.name}`));

        const unitPrice = Number(cartItem.unitPrice || 0);
        const lineTotal = Number(
          cartItem.totalPrice ?? (unitPrice * (cartItem.quantity || 1))
        );

        return {
          menuItemId: cartItem.id,
          name: cartItem.name,
          quantity: cartItem.quantity,
          customerDisplayedUnitPrice: unitPrice,
          customerDisplayedLineTotal: lineTotal,
          selectedCustomizations,
          size: sizeObj,
          milk: milkObj,
          addOns: addOnsList,
          specialInstructions: notesStr,
          image: cartItem.image || cartItem.imageUrl || '',
          isVeg: Boolean(cartItem.isVeg)
        };
      });

      // 3. Assemble submission payload for direct Firestore order request
      const orderPayload = {
        customerName: contactName.trim(),
        customerPhone: contactPhone.trim(),
        customerEmail: user.email || '',
        fulfillmentType: fulfillmentMethod,
        fulfillmentDetails,
        items: orderItems,
        customerQuotedSubtotal: subtotal,
        customerQuotedTotal: subtotal,
        idempotencyKey: idempotencyKeyRef.current
      };

      // 4. Submit order request directly to Cloud Firestore
      const response = await orderService.submitOrderRequest(orderPayload);

      // 5. Update customer profile in background if requested
      if (saveProfileDetails) {
        try {
          const profileUpdates = {
            name: contactName.trim(),
            phone: contactPhone.trim()
          };
          if (fulfillmentMethod === 'delivery') {
            profileUpdates.address = streetAddress.trim();
            profileUpdates.pincode = pinCode.trim();
          }
          await updateCustomerProfile(profileUpdates);
        } catch (profileErr) {
          console.warn('Non-fatal: Failed to update customer profile preference:', profileErr);
        }
      }

      // 6. Clear shopping cart ONLY upon confirmed backend response
      clearCart();

      // 7. Redirect to genuine order confirmation page
      navigate(`/order-confirmation/${response.orderId}`, {
        state: { order: response.order },
        replace: true
      });
    } catch (err) {
      console.error('Order submission error:', err);
      // Cart is strictly preserved on error so user doesn't lose items
      setSubmitError(
        err.message || 'Unable to place order. Please review your details and try again.'
      );
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Checkout — Brew & Bloom Café"
        description="Complete your Brew & Bloom order with Cash on Delivery / Pay at Counter fulfillment."
      />

      <div className="min-h-screen bg-cream-50 py-8 sm:py-12 border-b border-espresso-100">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso-600 hover:text-terracotta-600 transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Menu
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900 tracking-tight">
                  Checkout
                </h1>
                <p className="mt-1 text-sm text-espresso-600">
                  Cash on Delivery &bull; Direct Order Placement
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto bg-sage-50 text-sage-800 border border-sage-200 px-3 py-1.5 rounded-full text-xs font-medium">
                <ShieldCheck className="w-4 h-4 text-sage-600" />
                <span>Verified Customer Session</span>
              </div>
            </div>
          </div>

          {/* Missing Price Warning Banner */}
          {hasInvalidPriceItems && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 animate-in fade-in duration-200 shadow-xs">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold block">Missing or Invalid Item Pricing</span>
                <p className="mt-0.5 text-amber-800 text-xs">
                  The following items have unverified prices:{' '}
                  <span className="font-semibold">
                    {invalidPriceItems.map((i) => i.name).join(', ')}
                  </span>
                  . Please return to the menu or remove them from your tray before submitting.
                </p>
              </div>
            </div>
          )}

          {/* Submission Error Banner */}
          {submitError && (
            <div className="mb-6 p-4 rounded-2xl bg-terracotta-50 border border-terracotta-300 text-terracotta-900 flex items-start gap-3 animate-in fade-in duration-200 shadow-xs">
              <AlertCircle className="w-5 h-5 text-terracotta-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm flex-1">
                <span className="font-semibold block">Order Submission Notice</span>
                <p className="mt-0.5 text-terracotta-800 text-xs leading-relaxed">{submitError}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Form Details (7 cols) */}
            <form onSubmit={handleOrderSubmission} className="lg:col-span-7 space-y-8">
              {/* Step 1: Customer Contact Auto-fill */}
              <div className="bg-cream-100/70 border border-espresso-100 rounded-2xl p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-terracotta-100 text-terracotta-700 font-bold text-sm flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-espresso-900">
                      Customer Contact Details
                    </h2>
                    <p className="text-xs text-espresso-600">
                      Auto-populated from your profile. You may modify these for this order.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-terracotta-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-espresso-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => {
                          setContactName(e.target.value);
                          setHasUserEditedName(true);
                          if (errors.contactName) setErrors({ ...errors, contactName: null });
                        }}
                        placeholder="Your full name"
                        className={`w-full pl-10 pr-4 py-2.5 bg-cream-50 rounded-xl border text-sm text-espresso-900 focus:outline-none focus:ring-2 focus:ring-terracotta-400 transition-all ${
                          errors.contactName ? 'border-terracotta-500' : 'border-espresso-200'
                        }`}
                      />
                    </div>
                    {errors.contactName && (
                      <p className="mt-1 text-xs text-terracotta-600 font-medium">
                        {errors.contactName}
                      </p>
                    )}
                  </div>

                  {/* Customer Email (Read-only from authenticated account) */}
                  <div>
                    <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-1.5">
                      Account Email
                    </label>
                    <input
                      type="email"
                      value={user.email || ''}
                      readOnly
                      disabled
                      className="w-full px-3.5 py-2.5 bg-espresso-100/40 rounded-xl border border-espresso-200 text-sm text-espresso-700 cursor-not-allowed select-none"
                    />
                    <p className="mt-1 text-[11px] text-espresso-500">
                      Tied to your authenticated account.
                    </p>
                  </div>

                  {/* Customer Phone */}
                  <div>
                    <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-terracotta-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-espresso-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => {
                          setContactPhone(e.target.value);
                          setHasUserEditedPhone(true);
                          if (errors.contactPhone) setErrors({ ...errors, contactPhone: null });
                        }}
                        placeholder="+91 98765 43210"
                        className={`w-full pl-10 pr-4 py-2.5 bg-cream-50 rounded-xl border text-sm text-espresso-900 focus:outline-none focus:ring-2 focus:ring-terracotta-400 transition-all ${
                          errors.contactPhone ? 'border-terracotta-500' : 'border-espresso-200'
                        }`}
                      />
                    </div>
                    {errors.contactPhone && (
                      <p className="mt-1 text-xs text-terracotta-600 font-medium">
                        {errors.contactPhone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Optional Save Details to Profile */}
                <div className="mt-4 pt-3 border-t border-espresso-100/60">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={saveProfileDetails}
                      onChange={(e) => setSaveProfileDetails(e.target.checked)}
                      className="rounded border-espresso-300 text-terracotta-600 focus:ring-terracotta-400 w-4 h-4"
                    />
                    <span className="text-xs text-espresso-700">
                      Save updated contact information to my customer profile for future orders
                    </span>
                  </label>
                </div>
              </div>

              {/* Step 2: Fulfillment Method */}
              <div className="bg-cream-100/70 border border-espresso-100 rounded-2xl p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-terracotta-100 text-terracotta-700 font-bold text-sm flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-espresso-900">
                      Fulfillment Method
                    </h2>
                    <p className="text-xs text-espresso-600">
                      Select how you would like to receive your order
                    </p>
                  </div>
                </div>

                {/* Fulfillment Tabs */}
                <div className="grid grid-cols-3 gap-2.5 mb-6">
                  {/* Takeaway Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setFulfillmentMethod('takeaway');
                      setErrors({});
                    }}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                      fulfillmentMethod === 'takeaway'
                        ? 'bg-espresso-900 text-cream-50 border-espresso-900 shadow-sm'
                        : 'bg-cream-50 text-espresso-800 border-espresso-200 hover:border-espresso-400'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Takeaway</span>
                    <span className="text-[11px] opacity-80 mt-0.5">Pick up at café</span>
                  </button>

                  {/* Dine-in Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setFulfillmentMethod('dinein');
                      setErrors({});
                    }}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                      fulfillmentMethod === 'dinein'
                        ? 'bg-espresso-900 text-cream-50 border-espresso-900 shadow-sm'
                        : 'bg-cream-50 text-espresso-800 border-espresso-200 hover:border-espresso-400'
                    }`}
                  >
                    <UtensilsCrossed className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Dine-In</span>
                    <span className="text-[11px] opacity-80 mt-0.5">Table service</span>
                  </button>

                  {/* Delivery Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setFulfillmentMethod('delivery');
                      setErrors({});
                    }}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                      fulfillmentMethod === 'delivery'
                        ? 'bg-espresso-900 text-cream-50 border-espresso-900 shadow-sm'
                        : 'bg-cream-50 text-espresso-800 border-espresso-200 hover:border-espresso-400'
                    }`}
                  >
                    <Truck className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Delivery</span>
                    <span className="text-[11px] opacity-80 mt-0.5">To your door</span>
                  </button>
                </div>

                {/* Sub-form: Dine-in Fields */}
                {fulfillmentMethod === 'dinein' && (
                  <div className="space-y-4 animate-in fade-in duration-200 pt-2 border-t border-espresso-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-1.5">
                          Table Number <span className="text-terracotta-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={tableNumber}
                          onChange={(e) => {
                            setTableNumber(e.target.value);
                            if (errors.tableNumber) setErrors({ ...errors, tableNumber: null });
                          }}
                          placeholder="e.g. Table 4 or Patio 2"
                          className={`w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border text-sm text-espresso-900 focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                            errors.tableNumber ? 'border-terracotta-500' : 'border-espresso-200'
                          }`}
                        />
                        {errors.tableNumber && (
                          <p className="mt-1 text-xs text-terracotta-600 font-medium">
                            {errors.tableNumber}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-1.5">
                          Number of Guests
                        </label>
                        <select
                          value={guestCount}
                          onChange={(e) => setGuestCount(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-espresso-200 text-sm text-espresso-900 focus:outline-none focus:ring-2 focus:ring-terracotta-400"
                        >
                          <option value="1">1 Guest</option>
                          <option value="2">2 Guests</option>
                          <option value="3">3 Guests</option>
                          <option value="4">4 Guests</option>
                          <option value="5">5+ Guests</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-1.5">
                        Dining Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={diningNotes}
                        onChange={(e) => setDiningNotes(e.target.value)}
                        placeholder="e.g., Celebrating an occasion, extra glasses requested"
                        className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-espresso-200 text-sm text-espresso-900 focus:outline-none focus:ring-2 focus:ring-terracotta-400"
                      />
                    </div>
                  </div>
                )}

                {/* Sub-form: Takeaway Fields */}
                {fulfillmentMethod === 'takeaway' && (
                  <div className="space-y-4 animate-in fade-in duration-200 pt-2 border-t border-espresso-100">
                    <div>
                      <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-1.5">
                        Estimated Pickup Window <span className="text-terracotta-600">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          'ASAP (~15-20 mins)',
                          'In 30 mins',
                          'In 45 mins',
                          'In 1 hour'
                        ].map((timeOption) => (
                          <button
                            key={timeOption}
                            type="button"
                            onClick={() => setPickupTime(timeOption)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium border text-center transition-all ${
                              pickupTime === timeOption
                                ? 'bg-terracotta-600 text-white border-terracotta-600 shadow-xs'
                                : 'bg-cream-50 text-espresso-800 border-espresso-200 hover:border-espresso-300'
                            }`}
                          >
                            {timeOption}
                          </button>
                        ))}
                      </div>
                      {errors.pickupTime && (
                        <p className="mt-1 text-xs text-terracotta-600 font-medium">
                          {errors.pickupTime}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-1.5">
                        Takeaway Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        value={takeawayNotes}
                        onChange={(e) => setTakeawayNotes(e.target.value)}
                        placeholder="e.g., Call upon packing, double cup hot drinks"
                        className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-espresso-200 text-sm text-espresso-900 focus:outline-none focus:ring-2 focus:ring-terracotta-400"
                      />
                    </div>
                  </div>
                )}

                {/* Sub-form: Delivery Fields */}
                {fulfillmentMethod === 'delivery' && (
                  <div className="space-y-4 animate-in fade-in duration-200 pt-2 border-t border-espresso-100">
                    <div>
                      <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-1.5">
                        Complete Delivery Address <span className="text-terracotta-600">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={streetAddress}
                        onChange={(e) => {
                          setStreetAddress(e.target.value);
                          if (errors.streetAddress) setErrors({ ...errors, streetAddress: null });
                        }}
                        placeholder="Flat / House No., Building Name, Street / Road"
                        className={`w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border text-sm text-espresso-900 focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                          errors.streetAddress ? 'border-terracotta-500' : 'border-espresso-200'
                        }`}
                      />
                      {errors.streetAddress && (
                        <p className="mt-1 text-xs text-terracotta-600 font-medium">
                          {errors.streetAddress}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-1.5">
                          Nearby Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="e.g. Opposite Jogger's Park"
                          className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-espresso-200 text-sm text-espresso-900 focus:outline-none focus:ring-2 focus:ring-terracotta-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-1.5">
                          PIN / Postal Code <span className="text-terracotta-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={pinCode}
                          onChange={(e) => {
                            setPinCode(e.target.value);
                            if (errors.pinCode) setErrors({ ...errors, pinCode: null });
                          }}
                          placeholder="411001"
                          maxLength={8}
                          className={`w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border text-sm text-espresso-900 focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                            errors.pinCode ? 'border-terracotta-500' : 'border-espresso-200'
                          }`}
                        />
                        {errors.pinCode && (
                          <p className="mt-1 text-xs text-terracotta-600 font-medium">
                            {errors.pinCode}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-1.5">
                        Delivery Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        placeholder="e.g., Leave with security or ring the doorbell twice"
                        className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-espresso-200 text-sm text-espresso-900 focus:outline-none focus:ring-2 focus:ring-terracotta-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Cash Payment Method Only */}
              <div className="bg-cream-100/70 border border-espresso-100 rounded-2xl p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-terracotta-100 text-terracotta-700 font-bold text-sm flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-espresso-900">
                      Payment Choice
                    </h2>
                    <p className="text-xs text-espresso-600">
                      Cash on Delivery &bull; Pay in Person
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border-2 border-terracotta-500/80 bg-cream-50/80 shadow-xs">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-terracotta-500 text-cream-50 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                      <Banknote className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-espresso-900">
                          {fulfillmentMethod === 'dinein'
                            ? 'Pay at Table / Counter (Cash)'
                            : fulfillmentMethod === 'takeaway'
                            ? 'Pay at Counter on Pickup (Cash)'
                            : 'Cash on Delivery (COD)'}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          Pending on delivery
                        </span>
                      </div>
                      <p className="text-xs text-espresso-600 mt-1 leading-relaxed">
                        {fulfillmentMethod === 'dinein' &&
                          'Pay in cash directly to your server or at the café billing desk after dining.'}
                        {fulfillmentMethod === 'takeaway' &&
                          'Pay with cash at the collection counter when you pick up your order.'}
                        {fulfillmentMethod === 'delivery' &&
                          'Pay exact cash to our delivery driver upon delivery at your doorstep.'}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-espresso-500 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-espresso-400" />
                  Online card/UPI payments are disabled during this phase. All orders are settled in cash.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || hasInvalidPriceItems}
                  className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-terracotta-600 hover:from-terracotta-700 hover:via-terracotta-600 hover:to-terracotta-700 text-white p-1 shadow-warm-md hover:shadow-warm-lg active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  <div className="w-full py-3.5 px-4 sm:px-6 rounded-xl flex items-center justify-between gap-3 bg-white/5 border border-white/15">
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3 w-full py-1">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="font-semibold text-sm sm:text-base tracking-wide text-white">
                          Submitting Order to Kitchen...
                        </span>
                      </div>
                    ) : (
                      <>
                        {/* Left: Icon & Action Title */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-xs border border-white/20">
                            <Banknote className="w-5 h-5" />
                          </div>
                          <div className="text-left min-w-0">
                            <span className="block font-bold text-sm sm:text-base text-white tracking-tight leading-tight truncate">
                              Confirm &amp; Place Cash Order
                            </span>
                            <span className="block text-[11px] text-cream-100/90 font-medium tracking-normal mt-0.5">
                              Pay in Cash upon fulfillment
                            </span>
                          </div>
                        </div>

                        {/* Right: Price Pill & Arrow */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-xs border border-white/25 font-bold font-mono text-sm sm:text-base text-white shadow-xs tracking-tight">
                            {formatCurrency(subtotal)}
                          </span>
                          <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-white group-hover:bg-white/25 transition-colors">
                            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform duration-200" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </button>

                <div className="flex items-center justify-center gap-1.5 text-center text-xs text-espresso-600 mt-2.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-sage-600 shrink-0" />
                  <span>Order sent directly to café kitchen &bull; Settled in cash upon receipt</span>
                </div>
              </div>
            </form>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-cream-100/90 border border-espresso-100 rounded-2xl p-6 sm:p-7 shadow-xs sticky top-24">
                <div className="flex items-center justify-between pb-4 border-b border-espresso-100">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-espresso-700" />
                    <h2 className="font-serif text-lg font-bold text-espresso-900">
                      Order Tray Summary
                    </h2>
                  </div>
                  <span className="text-xs font-semibold bg-espresso-200/60 text-espresso-800 px-2.5 py-0.5 rounded-full">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Items List */}
                <div className="divide-y divide-espresso-100/80 max-h-80 overflow-y-auto py-2">
                  {items.map((item) => {
                    const lineTotal =
                      item.totalPrice !== null && item.totalPrice !== undefined
                        ? item.totalPrice
                        : typeof item.unitPrice === 'number'
                        ? item.unitPrice * (item.quantity || 1)
                        : null;

                    const sizeObj = item.selectedSize || item.customizations?.size;
                    const milkObj = item.selectedMilk || item.customizations?.milk;
                    const addOnsList = Array.isArray(item.selectedAddOns)
                      ? item.selectedAddOns
                      : Array.isArray(item.customizations?.addOns)
                      ? item.customizations.addOns
                      : [];
                    const notesStr = item.specialNotes || item.customizations?.notes;

                    return (
                      <div key={item.cartItemId} className="py-3 flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-espresso-100 flex-shrink-0 border border-espresso-100 relative">
                          <img
                            src={item.image || item.imageUrl || PRIMARY_FALLBACK_IMAGE}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = SVG_FALLBACK_IMAGE;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-espresso-900 truncate">
                              {item.name}
                            </h4>
                            <span className="text-xs font-bold text-espresso-900 whitespace-nowrap">
                              {item.hasValidPrice ? (
                                formatCurrency(lineTotal)
                              ) : (
                                <span className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-semibold">
                                  Missing Price
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="text-[11px] text-espresso-600 mt-0.5">
                            <span>Qty: {item.quantity}</span>
                            <span className="mx-1">&bull;</span>
                            <span>
                              {item.hasValidPrice
                                ? `${formatCurrency(item.unitPrice)} each`
                                : 'Price unverified'}
                            </span>
                          </div>

                          {/* Customization Details */}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {sizeObj && (
                              <span className="text-[10px] bg-espresso-100 text-espresso-700 px-1.5 py-0.2 rounded font-medium">
                                {sizeObj.name}
                              </span>
                            )}
                            {milkObj && (
                              <span className="text-[10px] bg-espresso-100 text-espresso-700 px-1.5 py-0.2 rounded font-medium">
                                {milkObj.name}
                              </span>
                            )}
                            {addOnsList.map((addon, aIdx) => (
                              <span
                                key={addon.id || aIdx}
                                className="text-[10px] bg-terracotta-50 text-terracotta-700 px-1.5 py-0.2 rounded font-medium"
                              >
                                +{addon.name}
                              </span>
                            ))}
                          </div>

                          {notesStr && (
                            <p className="text-[10px] text-espresso-500 italic mt-1 line-clamp-1">
                              Note: "{notesStr}"
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal & Verified Total */}
                <div className="border-t border-espresso-200/80 pt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-espresso-700">
                    <span>Subtotal</span>
                    <span className="font-semibold text-espresso-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-espresso-700">
                    <span>Delivery / Table Fees</span>
                    <span className="text-sage-700 font-semibold">₹0.00 (Included)</span>
                  </div>
                  <div className="border-t border-dashed border-espresso-200 pt-3 flex items-center justify-between">
                    <div>
                      <span className="font-serif text-base font-bold text-espresso-900 block">
                        Total Amount
                      </span>
                      <span className="text-[11px] text-espresso-500 block">
                        Payable via Cash ({fulfillmentMethod.toUpperCase()})
                      </span>
                    </div>
                    <span className="font-serif text-2xl font-bold text-terracotta-700">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                </div>

                {/* Guarantee notice */}
                <div className="mt-5 pt-4 border-t border-espresso-100 flex items-start gap-2 text-[11px] text-espresso-600">
                  <CheckCircle2 className="w-4 h-4 text-sage-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Your order will be verified and prepared fresh upon submission. No upfront online charge.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
