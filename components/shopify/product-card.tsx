import React from 'react';
import Link from 'next/link';
import { useShopifyCart, addCartLines } from '@/hooks/use-shopify-cart';
import { truncate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProductImage {
  url: string;
  altText?: string;
}

interface ProductPrice {
  amount: string;
  currencyCode: string;
}

interface ProductVariant {
  id: string;
  title: string;
  price: ProductPrice;
  availableForSale: boolean;
}

interface Product {
  id: string;
  title: string;
  description?: string;
  handle: string;
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
  priceRange: {
    minVariantPrice: ProductPrice;
  };
  compareAtPriceRange?: {
    minVariantPrice: ProductPrice;
  };
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { cartId, openCart } = useShopifyCart();

  const firstImage = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const hasDiscount = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  const firstVariant = product.variants.edges[0]?.node;
  const isAvailable = firstVariant?.availableForSale || false;

  const formatPrice = (price: ProductPrice) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currencyCode,
    }).format(parseFloat(price.amount));
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking add to cart
    e.stopPropagation();

    if (!firstVariant || !isAvailable || !cartId) return;

    try {
      await addCartLines(cartId, [{ merchandiseId: firstVariant.id, quantity: 1 }]);
      openCart();

      if (onAddToCart) {
        onAddToCart(product);
      }
    } catch (err) {
      console.error('Failed to add item to cart:', err);
    }
  };

  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 overflow-hidden group py-0 gap-0">
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-gray-100 relative">
        {firstImage ? (
          <Link href={`/shop/products/${product.handle}`}>
            <img
              src={firstImage.url}
              alt={firstImage.altText || product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <i className="ri-image-line text-6xl"></i>
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && compareAtPrice && (
          <Badge variant="destructive" className="absolute top-3 left-3">
            {Math.round(((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) / parseFloat(compareAtPrice.amount)) * 100)}% OFF
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <CardContent className="p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 font-heading">
          {truncate(product.title, 50)}
        </h3>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900">
            ${parseFloat(price.amount).toFixed(2)}
          </span>
        </div>

        {/* View Details Button */}
        <Link href={`/shop/products/${product.handle}`}>
          <Button className="w-full" size="sm">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductCard;