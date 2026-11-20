import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { CartProvider } from './context/CartContext';
import { router } from './routes';

export default function App() {
  return (
    <HelmetProvider>
      <CustomerAuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </CustomerAuthProvider>
    </HelmetProvider>
  );
}
