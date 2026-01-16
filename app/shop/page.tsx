'use client';

import React from 'react';
import Products from '@/components/shopify/products';

export default function ShopPage() {
  return (
    <div>
      <Products title="Shop All" limit={12} showLoadMore={true} />
    </div>
  );
}
