'use client';

import React from 'react';
import { useShopifyCart, redirectToCheckout } from '@/hooks/use-shopify-cart';
import { Button } from '@/components/ui/button';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  RiCloseLine,
  RiImageLine,
  RiSubtractLine,
  RiAddLine,
} from '@remixicon/react';

const CartDrawer: React.FC = () => {
  const { isOpen, closeCart, items, itemCount, totalAmount, checkoutUrl, loading, removeItem, updateItemQuantity } = useShopifyCart();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCheckout = () => {
    if (checkoutUrl) {
      redirectToCheckout(checkoutUrl);
    }
  };

  const getItemImage = (item: typeof items[0]) => {
    return item.merchandise.image?.url;
  };

  const getSelectedOptions = (item: typeof items[0]) => {
    return item.merchandise.selectedOptions ?? [];
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
          <SheetContent className="w-full max-w-md" side="right" showCloseButton={false}>
            {/* Header */}
            <SheetHeader className="h-14 min-h-0 px-4 py-3 flex items-center">
              <div className="flex items-center justify-between w-full">
                <SheetTitle className="text-base">
                  Shopping Cart ({itemCount})
                </SheetTitle>
                <Button
                  onClick={closeCart}
                  variant="ghost"
                  size="icon-sm"
                >
                  <RiCloseLine size={20} />
                </Button>
              </div>
            </SheetHeader>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading && items.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : items.length === 0 ? (
                <Empty className="py-12">
                  <EmptyHeader>
                    <EmptyTitle>Your cart is empty</EmptyTitle>
                    <EmptyDescription>Add some products to get started!</EmptyDescription>
                  </EmptyHeader>
                  <Button onClick={closeCart}>
                    Continue Shopping
                  </Button>
                </Empty>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => {
                    const image = getItemImage(item);
                    const selectedOptions = getSelectedOptions(item);

                    return (
                      <div key={item.id} className="flex items-start space-x-4 pb-6 border-b border-gray-200 last:border-b-0">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {image ? (
                            <img
                              src={image}
                              alt={item.merchandise.product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <RiImageLine size={24} />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                            {item.merchandise.product.title}
                          </h4>

                          {/* Variant Info */}
                          {selectedOptions.length > 0 && (
                            <div className="text-sm text-gray-500 mb-2">
                              {selectedOptions.map((option, index) => (
                                <span key={option.name}>
                                  {option.value}
                                  {index < selectedOptions.length - 1 ? ' / ' : ''}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Quantity Controls */}
                          <div className="flex items-center mt-3">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <Button
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                variant="ghost"
                                size="icon-sm"
                                disabled={item.quantity <= 1 || loading}
                                className="h-7 w-7"
                              >
                                <RiSubtractLine size={14} />
                              </Button>
                              <span className="px-2 py-1 font-semibold min-w-[30px] text-center text-sm">
                                {item.quantity}
                              </span>
                              <Button
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                variant="ghost"
                                size="icon-sm"
                                disabled={loading}
                                className="h-7 w-7"
                              >
                                <RiAddLine size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex-shrink-0">
                          <span className="text-sm font-semibold text-gray-900">
                            ${parseFloat(item.merchandise.price.amount).toFixed(2)}
                          </span>
                        </div>

                        {/* Remove Button */}
                        <div className="flex-shrink-0">
                          <Button
                            onClick={() => removeItem(item.id)}
                            variant="ghost"
                            size="icon-sm"
                            disabled={loading}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <RiCloseLine size={18} />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer - Checkout Section */}
            {items.length > 0 && (
              <div className="border-t border-border p-6">
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-semibold">Subtotal</span>
                  <span className="text-lg font-bold">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  Shipping and taxes calculated at checkout
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleCheckout}
                    disabled={loading || !checkoutUrl}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center space-x-2">
                        <Spinner size="sm" />
                        <span>Processing...</span>
                      </span>
                    ) : (
                      'Checkout'
                    )}
                  </Button>

                  <Button
                    onClick={closeCart}
                    variant="link"
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
