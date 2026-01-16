import React from 'react';
import type { Metadata } from 'next';
import { ShopifyProvider } from '@/contexts/cart-context';
import ShopifyCart from '@/components/shopify/cart-drawer';
import ShopHeader from '@/components/shopify/shop-header';
import ShopFooter from '@/components/shopify/shop-footer';

export const metadata: Metadata = {
  title: 'Shop | Frontend',
  description: 'Browse our products',
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShopifyProvider>
      <ShopHeader />
      <main className="min-h-screen">
        {children}
      </main>
      <ShopFooter />
      <ShopifyCart />
    </ShopifyProvider>
  );
}
