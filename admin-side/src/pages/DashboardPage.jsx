import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Coffee,
  CheckCircle,
  XCircle,
  Sparkles,
  Tags,
  Plus,
  Clock,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Mail,
  MessageSquare,
  ShoppingBag
} from "lucide-react";
import { useMenuItems } from "../hooks/useMenuItems";
import { useCategories } from "../hooks/useCategories";
import { useSettings } from "../hooks/useSettings";
import { useMessages } from "../hooks/useMessages";
import { useOrders } from "../hooks/useOrders";
import { Badge, VegIndicator } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { CardSkeleton } from "../components/ui/SkeletonLoader";
import { SVG_FALLBACK_IMAGE, PRIMARY_FALLBACK_IMAGE } from "../utils/imageFallback";

function formatRelativeTime(val) {
  if (!val) return "";
  let millis;
  if (typeof val?.toMillis === "function") millis = val.toMillis();
  else if (typeof val?.toDate === "function") millis = val.toDate().getTime();
  else millis = new Date(val).getTime();

  if (!millis || isNaN(millis)) return "";

  const diffSec = Math.floor((Date.now() - millis) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { items, loading: itemsLoading, error: itemsError } = useMenuItems();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { settings, loading: settingsLoading, error: settingsError } = useSettings();
  const { messages, newCount, loading: messagesLoading, error: messagesError } = useMessages();
  const { orders, newCount: newOrdersCount } = useOrders();

  const errorMessage = itemsError || categoriesError || settingsError || messagesError;

  const stats = useMemo(() => {
    const total = items.length;
    const available = items.filter((i) => i.available).length;
    const soldOut = total - available;
    const popular = items.filter((i) => i.isPopular).length;
    const catCount = categories.length;

    return { total, available, soldOut, popular, catCount, newMessages: newCount, newOrders: newOrdersCount, totalOrders: orders.length };
  }, [items, categories, newCount, newOrdersCount, orders.length]);

  // Sort by updatedAt descending (safely handles Firestore Timestamps or strings)
  const recentItems = useMemo(() => {
    const parseTime = (val) => {
      if (!val) return 0;
      if (typeof val?.toMillis === "function") return val.toMillis();
      if (typeof val?.toDate === "function") return val.toDate().getTime();
      return new Date(val).getTime() || 0;
    };

    return [...items]
      .sort((a, b) => parseTime(b.updatedAt) - parseTime(a.updatedAt))
      .slice(0, 5);
  }, [items]);

  // Latest 5 customer inquiries
  const latestMessages = useMemo(() => {
    return messages.slice(0, 5);
  }, [messages]);

  // Determine today's hours from settings
  const todayStatus = useMemo(() => {
    if (!settings?.weeklySchedule) return { isOpen: false, text: "Hours unavailable" };
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    const todayName = dayNames[new Date().getDay()];
    const todaySched = settings.weeklySchedule.find((s) => s.day === todayName);

    if (!todaySched || todaySched.isClosed) {
      return { isOpen: false, text: `Closed today (${todayName})` };
    }

    return {
      isOpen: true,
      text: `${todayName}: ${todaySched.openTime} – ${todaySched.closeTime}`
    };
  }, [settings]);

  const isLoading = itemsLoading || categoriesLoading || settingsLoading;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-espresso/10">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso tracking-tight">
            Overview Dashboard
          </h1>
          <p className="text-sm text-espresso/60 mt-1">
            Real-time status of your cafe catalog, customer inquiries, and operating schedule.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/settings")}
            icon={Clock}
          >
            Hours & Info
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/menu-items?action=new")}
            icon={Plus}
          >
            Add Menu Item
          </Button>
        </div>
      </div>

      {/* Database Error Banner if Firestore is unreachable */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Database Sync Notice</h4>
            <p className="text-xs text-red-700 mt-0.5">
              {errorMessage.includes("permission-denied")
                ? "Permission denied: Ensure your account UID is registered in the Firestore 'admins' collection."
                : errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* Today's Schedule Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-cream-light border border-espresso/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${
              todayStatus.isOpen
                ? "bg-emerald-500 ring-4 ring-emerald-100"
                : "bg-red-500 ring-4 ring-red-100"
            }`}
          />
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-espresso/60">
              Today's Operating Schedule
            </span>
            <span className="text-sm font-semibold text-espresso">
              {todayStatus.text}
            </span>
          </div>
        </div>
        <Link
          to="/settings"
          className="text-xs font-semibold text-terracotta hover:text-terracotta-dark flex items-center gap-1"
        >
          Manage All Schedules <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Key Metric Stats Cards (6 metrics) */}
      {isLoading ? (
        <CardSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {/* Active Orders */}
          <Link
            to="/orders"
            className="bg-white/80 hover:bg-white p-4 sm:p-5 rounded-2xl border border-espresso/10 hover:border-amber-400 shadow-warm flex flex-col justify-between transition-all group"
          >
            <div className="flex items-center justify-between text-espresso/50 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-amber-800 transition-colors">
                Live Orders
              </span>
              <ShoppingBag className="w-5 h-5 text-amber-600 flex-shrink-0" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-espresso">
                  {stats.newOrders}
                </span>
                <span className="text-[11px] font-bold text-amber-800 uppercase bg-amber-100 px-1.5 py-0.5 rounded">
                  New
                </span>
              </div>
              <p className="text-[11px] text-espresso/50 mt-1">
                {stats.totalOrders} total registered
              </p>
            </div>
          </Link>

          {/* New Messages */}
          <Link
            to="/messages"
            className="bg-white/80 hover:bg-white p-4 sm:p-5 rounded-2xl border border-espresso/10 hover:border-terracotta/40 shadow-warm flex flex-col justify-between transition-all group"
          >
            <div className="flex items-center justify-between text-espresso/50 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-terracotta transition-colors">
                New Inquiries
              </span>
              <Mail className="w-5 h-5 text-terracotta flex-shrink-0" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-terracotta">
                {stats.newMessages}
              </span>
              <p className="text-[11px] text-espresso/50 mt-1">
                {stats.newMessages === 1 ? "1 unread inquiry" : `${stats.newMessages} unread inquiries`}
              </p>
            </div>
          </Link>

          {/* Total Menu Items */}
          <div className="bg-white/80 p-4 sm:p-5 rounded-2xl border border-espresso/10 shadow-warm flex flex-col justify-between">
            <div className="flex items-center justify-between text-espresso/50 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Items
              </span>
              <Coffee className="w-5 h-5 text-espresso/60" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-espresso">
                {stats.total}
              </span>
              <p className="text-[11px] text-espresso/50 mt-1">Across all categories</p>
            </div>
          </div>

          {/* Available Items */}
          <div className="bg-white/80 p-4 sm:p-5 rounded-2xl border border-espresso/10 shadow-warm flex flex-col justify-between">
            <div className="flex items-center justify-between text-espresso/50 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Active & In Stock
              </span>
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700">
                {stats.available}
              </span>
              <p className="text-[11px] text-espresso/50 mt-1">Available for order</p>
            </div>
          </div>

          {/* Sold Out Items */}
          <div className="bg-white/80 p-4 sm:p-5 rounded-2xl border border-espresso/10 shadow-warm flex flex-col justify-between">
            <div className="flex items-center justify-between text-espresso/50 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Sold Out
              </span>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-red-600">
                {stats.soldOut}
              </span>
              <p className="text-[11px] text-espresso/50 mt-1">Hidden from order</p>
            </div>
          </div>

          {/* Popular Items */}
          <div className="bg-white/80 p-4 sm:p-5 rounded-2xl border border-espresso/10 shadow-warm flex flex-col justify-between">
            <div className="flex items-center justify-between text-espresso/50 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Popular
              </span>
              <Sparkles className="w-5 h-5 text-terracotta" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-terracotta">
                {stats.popular}
              </span>
              <p className="text-[11px] text-espresso/50 mt-1">Featured on homepage</p>
            </div>
          </div>

          {/* Categories Count */}
          <div className="bg-white/80 p-4 sm:p-5 rounded-2xl border border-espresso/10 shadow-warm flex flex-col justify-between">
            <div className="flex items-center justify-between text-espresso/50 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Categories
              </span>
              <Tags className="w-5 h-5 text-sage-dark" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-espresso">
                {stats.catCount}
              </span>
              <p className="text-[11px] text-espresso/50 mt-1">Menu sections</p>
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Content Grid: Latest Messages & Recently Updated Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LATEST MESSAGES LIST (Last 5) */}
        <div className="bg-white/80 rounded-2xl border border-espresso/10 shadow-warm p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-espresso/10">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-lg font-bold text-espresso">
                    Latest Inquiries
                  </h2>
                  {newCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-terracotta text-cream">
                      {newCount} New
                    </span>
                  )}
                </div>
                <p className="text-xs text-espresso/60">
                  Customer notes submitted from website
                </p>
              </div>
              <Link
                to="/messages"
                className="text-xs font-semibold text-terracotta hover:text-terracotta-dark flex items-center gap-1"
              >
                View Inbox <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {messagesLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-espresso/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : latestMessages.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <Mail className="w-8 h-8 text-espresso/30 mx-auto" />
                <p className="text-sm font-semibold text-espresso/70">No inquiries yet</p>
                <p className="text-xs text-espresso/50 max-w-xs mx-auto">
                  Messages submitted on the contact page will automatically show up here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-espresso/5 pt-1">
                {latestMessages.map((msg) => {
                  const isNew = msg.status === "new";
                  return (
                    <Link
                      key={msg.id}
                      to="/messages"
                      className="py-3 px-2 rounded-xl flex items-start justify-between gap-3 hover:bg-cream-light/50 transition-colors group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm ${
                              isNew
                                ? "font-bold text-espresso"
                                : "font-semibold text-espresso/80"
                            }`}
                          >
                            {msg.name}
                          </span>
                          {isNew && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider bg-terracotta text-cream">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-espresso/60 line-clamp-1 mt-0.5">
                          {msg.message}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-[11px] text-espresso/45 block">
                          {formatRelativeTime(msg.createdAt)}
                        </span>
                        <span className="text-[10px] text-espresso/60 capitalize">
                          {msg.status}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-espresso/10">
            <Link
              to="/messages"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cream-light hover:bg-cream text-espresso text-xs font-semibold transition-colors border border-espresso/10"
            >
              <MessageSquare className="w-3.5 h-3.5 text-terracotta" />
              <span>Open Message Center</span>
            </Link>
          </div>
        </div>

        {/* RECENTLY UPDATED MENU ITEMS (Last 5) */}
        <div className="bg-white/80 rounded-2xl border border-espresso/10 shadow-warm p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-espresso/10">
              <div>
                <h2 className="font-serif text-lg font-bold text-espresso">
                  Recently Updated Menu Items
                </h2>
                <p className="text-xs text-espresso/60">
                  Latest changes made to your offerings
                </p>
              </div>
              <Link
                to="/menu-items"
                className="text-xs font-semibold text-terracotta hover:text-terracotta-dark flex items-center gap-1"
              >
                View Full Menu <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentItems.length === 0 ? (
              <p className="text-sm text-espresso/50 py-10 text-center">
                No menu items available yet.
              </p>
            ) : (
              <div className="divide-y divide-espresso/5 pt-1">
                {recentItems.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-cream-light/40 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.imageUrl || PRIMARY_FALLBACK_IMAGE}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          if (e.currentTarget.src !== PRIMARY_FALLBACK_IMAGE && e.currentTarget.src !== SVG_FALLBACK_IMAGE) {
                            e.currentTarget.src = PRIMARY_FALLBACK_IMAGE;
                          } else if (e.currentTarget.src !== SVG_FALLBACK_IMAGE) {
                            e.currentTarget.src = SVG_FALLBACK_IMAGE;
                          }
                        }}
                        className="w-10 h-10 rounded-xl object-cover border border-espresso/10 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <VegIndicator isVeg={item.isVeg} size="sm" />
                          <h4 className="text-sm font-semibold text-espresso truncate">
                            {item.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-espresso/60">
                          <span className="capitalize">{item.category}</span>
                          <span>•</span>
                          <span className="font-semibold text-terracotta">
                            ₹{item.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.isPopular && (
                        <Badge variant="popular" size="sm">
                          Popular
                        </Badge>
                      )}
                      <Badge
                        variant={item.available ? "success" : "danger"}
                        size="sm"
                      >
                        {item.available ? "Available" : "Sold Out"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-espresso/10">
            <Link
              to="/menu-items"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cream-light hover:bg-cream text-espresso text-xs font-semibold transition-colors border border-espresso/10"
            >
              <Coffee className="w-3.5 h-3.5 text-terracotta" />
              <span>Manage Menu Catalog</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Management Shortcuts & Sync Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 rounded-2xl border border-espresso/10 shadow-warm p-5 space-y-3.5">
          <h3 className="font-serif text-base font-bold text-espresso">
            Quick Shortcuts
          </h3>
          <p className="text-xs text-espresso/60">
            Jump straight into common cafe administration tasks:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <Link
              to="/messages"
              className="flex items-center justify-between p-3 rounded-xl bg-cream-light/60 hover:bg-cream-light text-espresso text-xs font-semibold transition-colors border border-espresso/5"
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-terracotta" />
                <span>Customer Messages ({newCount} New)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-espresso/40" />
            </Link>

            <Link
              to="/menu-items?action=new"
              className="flex items-center justify-between p-3 rounded-xl bg-cream-light/60 hover:bg-cream-light text-espresso text-xs font-semibold transition-colors border border-espresso/5"
            >
              <div className="flex items-center gap-2.5">
                <Coffee className="w-4 h-4 text-terracotta" />
                <span>Add New Menu Item</span>
              </div>
              <ChevronRight className="w-4 h-4 text-espresso/40" />
            </Link>

            <Link
              to="/categories"
              className="flex items-center justify-between p-3 rounded-xl bg-cream-light/60 hover:bg-cream-light text-espresso text-xs font-semibold transition-colors border border-espresso/5"
            >
              <div className="flex items-center gap-2.5">
                <Tags className="w-4 h-4 text-sage-dark" />
                <span>Reorder Categories</span>
              </div>
              <ChevronRight className="w-4 h-4 text-espresso/40" />
            </Link>

            <Link
              to="/settings"
              className="flex items-center justify-between p-3 rounded-xl bg-cream-light/60 hover:bg-cream-light text-espresso text-xs font-semibold transition-colors border border-espresso/5"
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-espresso/70" />
                <span>Update Contact & Hours</span>
              </div>
              <ChevronRight className="w-4 h-4 text-espresso/40" />
            </Link>
          </div>
        </div>

        {/* Sync Notice Card */}
        <div className="p-5 rounded-2xl bg-espresso text-cream space-y-2.5 shadow-warm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-terracotta font-serif font-bold text-sm">
              <TrendingUp className="w-4 h-4" /> Cloud Firestore Live
            </div>
            <p className="text-xs text-cream/70 leading-relaxed">
              Customer inquiries and catalog edits sync directly through Google Cloud Firestore in real time.
            </p>
          </div>
          <p className="text-[11px] text-cream/40">
            Brew & Bloom Café Admin Portal • Pune
          </p>
        </div>
      </div>
    </div>
  );
};
