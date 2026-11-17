import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';

// Lazy-loaded public pages for performance and code-splitting
const HomePage = lazy(() => import('../pages/HomePage'));
const MenuPage = lazy(() => import('../pages/MenuPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const GalleryPage = lazy(() => import('../pages/GalleryPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

/**
 * Route loading fallback component
 */
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-cream-50">
      <div className="w-12 h-12 rounded-full border-4 border-espresso-200 border-t-terracotta-500 animate-spin" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-espresso-600">
        Brewing page...
      </p>
    </div>
  );
}

/**
 * APPLICATION ROUTES
 *
 * NOTE FOR FUTURE PHASE (FIREBASE & ADMIN INTEGRATION):
 * When adding Firebase and the Admin Panel:
 * 1. Create an `<AdminLayout />` and `<ProtectedRoute />` component in src/components/layout/
 * 2. Add an `/admin` route group here:
 *    {
 *      path: '/admin',
 *      element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
 *      children: [
 *        { index: true, element: <AdminDashboard /> },
 *        { path: 'menu', element: <AdminMenuEditor /> },
 *        { path: 'gallery', element: <AdminGalleryManager /> },
 *        { path: 'hours', element: <AdminHoursEditor /> },
 *      ]
 *    }
 * 3. Add `/admin/login` for Firebase Auth (Google / Email+Password).
 */

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'menu',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MenuPage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: 'gallery',
        element: (
          <Suspense fallback={<PageLoader />}>
            <GalleryPage />
          </Suspense>
        ),
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContactPage />
          </Suspense>
        ),
      },
      {
        path: '404',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);
