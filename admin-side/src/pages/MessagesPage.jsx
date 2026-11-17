import React, { useState, useMemo, useEffect } from "react";
import {
  Mail,
  Search,
  Trash2,
  Archive,
  Phone,
  MessageSquare,
  ExternalLink,
  ArrowLeft,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Filter,
  CheckCheck,
  Calendar,
  Send,
  X
} from "lucide-react";
import { useMessages } from "../hooks/useMessages";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "read", label: "Read" },
  { id: "replied", label: "Replied" },
  { id: "archived", label: "Archived" }
];

function formatDateTimeIST(val) {
  if (!val) return "Date unavailable";
  let date;
  if (typeof val?.toDate === "function") date = val.toDate();
  else if (typeof val?.toMillis === "function") date = new Date(val.toMillis());
  else date = new Date(val);

  if (isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(date);
}

function formatRelativeTime(val) {
  if (!val) return "";
  let millis;
  if (typeof val?.toMillis === "function") millis = val.toMillis();
  else if (typeof val?.toDate === "function") millis = val.toDate().getTime();
  else millis = new Date(val).getTime();

  if (!millis || isNaN(millis)) return "";

  const now = Date.now();
  const diffSec = Math.floor((now - millis) / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short"
  }).format(new Date(millis));
}

function getWhatsAppUrl(phone, name) {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    digits = "91" + digits;
  }
  if (!digits) return null;
  const greeting = name
    ? `Hi ${name}, thank you for reaching out to Brew & Bloom Café!`
    : "Hi, thank you for reaching out to Brew & Bloom Café!";
  return `https://wa.me/${digits}?text=${encodeURIComponent(greeting)}`;
}

export const MessagesPage = () => {
  const { messages, loading, error, updateStatus, deleteMessage } = useMessages();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts = { all: messages.length, new: 0, read: 0, replied: 0, archived: 0 };
    messages.forEach((m) => {
      if (counts[m.status] !== undefined) {
        counts[m.status]++;
      }
    });
    return counts;
  }, [messages]);

  // Filtered list
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      // Tab filter
      if (activeTab !== "all" && m.status !== activeTab) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = m.name?.toLowerCase().includes(q);
        const matchesEmail = m.email?.toLowerCase().includes(q);
        const matchesPhone = m.phone?.toLowerCase().includes(q);
        const matchesMsg = m.message?.toLowerCase().includes(q);
        return matchesName || matchesEmail || matchesPhone || matchesMsg;
      }
      return true;
    });
  }, [messages, activeTab, searchQuery]);

  // Active selected message object
  const selectedMessage = useMemo(() => {
    if (!selectedId) return null;
    return messages.find((m) => m.id === selectedId) || null;
  }, [messages, selectedId]);

  // Automatically select first message on desktop if none selected
  useEffect(() => {
    if (!selectedId && filteredMessages.length > 0 && window.innerWidth >= 1024) {
      setSelectedId(filteredMessages[0].id);
    }
  }, [filteredMessages, selectedId]);

  // Auto-mark as read when opened
  useEffect(() => {
    if (selectedMessage && selectedMessage.status === "new") {
      updateStatus(selectedMessage.id, "read", { silent: true });
    }
  }, [selectedMessage?.id, selectedMessage?.status, updateStatus]);

  const handleSelectMessage = (msg) => {
    setSelectedId(msg.id);
    if (msg.status === "new") {
      updateStatus(msg.id, "read", { silent: true });
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedMessage) return;
    await updateStatus(selectedMessage.id, newStatus);
  };

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) return;
    try {
      setIsDeleting(true);
      await deleteMessage(messageToDelete.id);
      if (selectedId === messageToDelete.id) {
        setSelectedId(null);
      }
      setMessageToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-espresso/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso tracking-tight">
              Customer Inquiries
            </h1>
            {tabCounts.new > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-terracotta text-cream shadow-xs">
                {tabCounts.new} New
              </span>
            )}
          </div>
          <p className="text-sm text-espresso/60 mt-1">
            Real-time messages submitted via the public website contact form.
          </p>
        </div>
      </div>

      {/* Global Error Notice if Firestore read fails */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Failed to sync messages</h4>
            <p className="text-xs text-red-700 mt-0.5">
              {error.includes("permission-denied")
                ? "Permission denied: Ensure your account is authorized in the 'admins' collection and firestore.rules are published."
                : error}
            </p>
          </div>
        </div>
      )}

      {/* Main Inbox Container */}
      <div className="bg-white/90 rounded-2xl border border-espresso/10 shadow-warm overflow-hidden flex flex-col min-h-[640px]">
        {/* Top Controls: Filter Tabs & Search */}
        <div className="p-4 sm:p-5 border-b border-espresso/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-cream-light/30">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {STATUS_TABS.map((tab) => {
              const count = tabCounts[tab.id];
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-terracotta ${
                    isActive
                      ? "bg-espresso text-cream shadow-xs"
                      : "bg-white text-espresso/70 hover:bg-cream hover:text-espresso border border-espresso/10"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive
                        ? "bg-cream/20 text-cream"
                        : "bg-espresso/10 text-espresso/70"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, phone..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-espresso/15 text-xs text-espresso placeholder:text-espresso/40 focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-terracotta"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Master / Detail Split Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* LEFT: Messages List */}
          <div
            className={`w-full lg:w-96 lg:border-r border-espresso/10 flex flex-col flex-shrink-0 bg-white ${
              selectedMessage ? "hidden lg:flex" : "flex"
            }`}
          >
            {loading ? (
              /* Skeletons */
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-espresso/5 space-y-2 animate-pulse bg-espresso/5"
                  >
                    <div className="flex justify-between">
                      <div className="h-4 w-28 bg-espresso/10 rounded" />
                      <div className="h-3 w-14 bg-espresso/10 rounded" />
                    </div>
                    <div className="h-3 w-48 bg-espresso/10 rounded" />
                    <div className="h-3 w-36 bg-espresso/10 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex-1 p-8 flex items-center justify-center">
                <EmptyState
                  icon={Mail}
                  title="No messages found"
                  description={
                    searchQuery
                      ? "No inquiries matched your search criteria."
                      : activeTab !== "all"
                      ? `No messages currently under the "${activeTab}" filter.`
                      : "Your inbox is empty. Inquiries sent via the website form will appear here."
                  }
                />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y divide-espresso/5 max-h-[600px] lg:max-h-[680px]">
                {filteredMessages.map((msg) => {
                  const isSelected = selectedId === msg.id;
                  const isNew = msg.status === "new";

                  return (
                    <button
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`w-full text-left p-4 transition-all relative flex flex-col gap-1.5 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-terracotta ${
                        isSelected
                          ? "bg-terracotta/8 border-l-4 border-terracotta"
                          : "hover:bg-cream-light/50 border-l-4 border-transparent"
                      }`}
                    >
                      {/* Row Header: Name & Time */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`truncate text-sm ${
                            isNew
                              ? "font-bold text-espresso"
                              : "font-semibold text-espresso/90"
                          }`}
                        >
                          {msg.name}
                        </span>
                        <span className="text-[11px] text-espresso/50 flex-shrink-0">
                          {formatRelativeTime(msg.createdAt)}
                        </span>
                      </div>

                      {/* Snippet */}
                      <p
                        className={`text-xs line-clamp-2 leading-relaxed ${
                          isNew ? "text-espresso font-medium" : "text-espresso/65"
                        }`}
                      >
                        {msg.message}
                      </p>

                      {/* Badges / Meta Footer */}
                      <div className="flex items-center justify-between gap-2 mt-1 pt-1">
                        <span className="text-[11px] text-espresso/45 truncate">
                          {msg.email}
                        </span>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {isNew ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-terracotta text-cream shadow-2xs">
                              New
                            </span>
                          ) : msg.status === "replied" ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                              Replied
                            </span>
                          ) : msg.status === "archived" ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-espresso/10 text-espresso/60">
                              Archived
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cream text-espresso/70 border border-espresso/10">
                              Read
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Detail View */}
          <div
            className={`flex-1 flex flex-col bg-white/60 ${
              selectedMessage ? "flex" : "hidden lg:flex"
            }`}
          >
            {selectedMessage ? (
              <div className="flex-1 flex flex-col overflow-y-auto p-5 sm:p-7 space-y-6">
                {/* Mobile Back Button */}
                <div className="lg:hidden pb-3 border-b border-espresso/10 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={ArrowLeft}
                    onClick={() => setSelectedId(null)}
                  >
                    Back to all messages
                  </Button>
                </div>

                {/* Detail Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-espresso/10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-espresso text-cream flex items-center justify-center font-serif font-bold text-xl flex-shrink-0 shadow-xs">
                      {selectedMessage.name?.charAt(0)?.toUpperCase() || "C"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-espresso">
                          {selectedMessage.name}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cream-dark/60 text-espresso border border-espresso/10 capitalize">
                          {selectedMessage.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-espresso/60 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-terracotta" />
                          {formatDateTimeIST(selectedMessage.createdAt)} (IST)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-espresso/40" />
                          {formatRelativeTime(selectedMessage.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown Selector */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <label htmlFor="msg-status-select" className="text-xs font-semibold text-espresso/60">
                      Status:
                    </label>
                    <select
                      id="msg-status-select"
                      value={selectedMessage.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-espresso/20 bg-white text-xs font-semibold text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Contact Information Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-cream-light/40 border border-espresso/10">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Mail className="w-4 h-4 text-terracotta flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-espresso/50">
                        Email Address
                      </span>
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re:%20Brew%20%26%20Bloom%20Caf%C3%A9%20Inquiry`}
                        className="text-xs sm:text-sm font-semibold text-espresso hover:text-terracotta truncate block"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 min-w-0">
                    <Phone className="w-4 h-4 text-sage-dark flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-espresso/50">
                        Phone Number
                      </span>
                      {selectedMessage.phone ? (
                        <a
                          href={`tel:${selectedMessage.phone}`}
                          className="text-xs sm:text-sm font-semibold text-espresso hover:text-terracotta truncate block"
                        >
                          {selectedMessage.phone}
                        </a>
                      ) : (
                        <span className="text-xs text-espresso/40 italic">
                          Not provided
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-espresso/50">
                    Message Content
                  </h3>
                  <div className="p-5 sm:p-6 rounded-2xl bg-white border border-espresso/10 shadow-xs text-espresso text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-2 border-t border-espresso/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Reply by email */}
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re:%20Brew%20%26%20Bloom%20Caf%C3%A9%20Inquiry`}
                      onClick={() => handleStatusChange("replied")}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-dark text-cream text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply by Email</span>
                    </a>

                    {/* WhatsApp */}
                    {selectedMessage.phone && getWhatsAppUrl(selectedMessage.phone, selectedMessage.name) && (
                      <a
                        href={getWhatsAppUrl(selectedMessage.phone, selectedMessage.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleStatusChange("replied")}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    {/* Call */}
                    {selectedMessage.phone && (
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-cream border border-espresso/15 text-espresso text-xs font-semibold transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-sage-dark" />
                        <span>Call</span>
                      </a>
                    )}
                  </div>

                  {/* Secondary Actions: Archive & Delete */}
                  <div className="flex items-center gap-2">
                    {selectedMessage.status !== "archived" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Archive}
                        onClick={() => handleStatusChange("archived")}
                      >
                        Archive
                      </Button>
                    )}

                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => setMessageToDelete(selectedMessage)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* No selection placeholder on desktop */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-3xl bg-cream-dark/40 text-espresso/40 flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-espresso mb-1">
                  Select an inquiry
                </h3>
                <p className="text-xs sm:text-sm text-espresso/60 max-w-sm">
                  Choose a message from the list on the left to read the full note and reply to the customer.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(messageToDelete)}
        onClose={() => setMessageToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer Message"
        message={`Are you sure you want to permanently delete the message from "${messageToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Message"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
