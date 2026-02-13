'use client';

import React from 'react';
import Link from 'next/link';
import { useShopifyCart } from '@/hooks/use-shopify-cart';
import { RiShoppingCartLine } from '@remixicon/react';

const CartIcon: React.FC = () => {
  const { toggleCart, itemCount } = useShopifyCart();

  return (
    <button
      onClick={toggleCart}
      className="relative p-1 text-black hover:text-gray-600 transition-colors"
    >
      <RiShoppingCartLine size={20} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
};

const Header: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-30 h-14">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" className="text-lg font-bold text-black font-heading">
            Store
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm text-black hover:text-gray-600 font-medium transition-colors"
            >
              Products
            </Link>
            <Link
              href="/collections"
              className="text-sm text-black hover:text-gray-600 font-medium transition-colors"
            >
              Collections
            </Link>

            {/* Cart Icon */}
            <CartIcon />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
