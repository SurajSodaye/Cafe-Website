import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "../components/layout/AdminLayout";
import { ProtectedRoute, PublicOnlyRoute } from "../components/layout/ProtectedRoute";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { OrdersPage } from "../pages/OrdersPage";
import { MessagesPage } from "../pages/MessagesPage";
import { MenuItemsPage } from "../pages/MenuItemsPage";
import { CategoriesPage } from "../pages/CategoriesPage";
import { GalleryPage } from "../pages/GalleryPage";
import { SettingsPage } from "../pages/SettingsPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Login Route (redirects to dashboard if already authenticated) */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      {/* Redirect root / to /dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected Admin Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/menu-items" element={<MenuItemsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
