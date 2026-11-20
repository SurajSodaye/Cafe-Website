import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomBar } from './MobileBottomBar';
import { CartDrawer } from '../cart/CartDrawer';
import { useCafeInfo } from '../../hooks/useCafeInfo';

export function Layout() {
  const { data: cafeInfo } = useCafeInfo();

  return (
    <div className="flex flex-col min-h-screen bg-cream-100 text-espresso-800">
      <Header />
      <main id="main-content" className="flex-grow focus:outline-none">
        <Outlet />
      </main>
      <Footer cafeInfo={cafeInfo} />
      <MobileBottomBar cafeInfo={cafeInfo} />
      <CartDrawer />
      {/* Scroll restoration for smooth page transitions */}
      <ScrollRestoration />
    </div>
  );
}
