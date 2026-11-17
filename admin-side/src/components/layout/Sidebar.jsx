import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Coffee,
  Tags,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  X,
  Sparkles,
  Mail
} from "lucide-react";
import { useMessages } from "../../hooks/useMessages";

const NAV_ITEMS = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Messages", path: "/messages", icon: Mail, badgeKey: "messages" },
  { name: "Menu Items", path: "/menu-items", icon: Coffee },
  { name: "Categories", path: "/categories", icon: Tags },
  { name: "Gallery", path: "/gallery", icon: ImageIcon },
  { name: "Cafe Settings", path: "/settings", icon: Settings }
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { newCount } = useMessages();
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-espresso-dark/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-espresso text-cream flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream/10">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-terracotta rounded-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-terracotta flex items-center justify-center text-cream font-serif font-bold text-lg shadow-sm">
              B
            </div>
            <div>
              <span className="block font-serif text-base font-bold tracking-tight text-cream leading-tight">
                Brew & Bloom
              </span>
              <span className="block text-[11px] font-sans uppercase tracking-wider text-sage font-medium">
                Admin Portal
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-cream/70 hover:text-cream p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-terracotta"
            aria-label="Close navigation sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-cream/40">
            Management
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-terracotta text-cream shadow-sm font-semibold"
                      : "text-cream/80 hover:bg-white/10 hover:text-cream"
                  }`
                }
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badgeKey === "messages" && newCount > 0 && (
                  <span
                    title={`${newCount} unread message${newCount > 1 ? "s" : ""}`}
                    className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold bg-white text-espresso shadow-xs"
                  >
                    {newCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Area: Public Site Link & Info */}
        <div className="p-4 border-t border-cream/10 bg-black/10">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-cream/80 hover:bg-white/10 hover:text-cream transition-colors border border-cream/10"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-terracotta" />
              <span>View Public Site</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-cream/50" />
          </a>
          <p className="mt-3 text-[11px] text-center text-cream/40">
            Phase 2 • Cloud Firestore
          </p>
        </div>
      </aside>
    </>
  );
};
