// Main Shopify API service that combines all functionality
export { shopifyFetch, SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_API_URL } from './client.js';

// GraphQL Queries
export {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_QUERY,
  QUERY_PRODUCT_RECOMMENDATIONS,
  ProductFragment
} from '../../graphql/products.js';

export {
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_PRODUCTS_QUERY
} from '../../graphql/collections.js';

export {
  CREATE_CART_MUTATION,
  ADD_CART_LINES_MUTATION,
  UPDATE_CART_LINES_MUTATION,
  REMOVE_CART_LINES_MUTATION,
  GET_CART_QUERY
} from '../../graphql/cart.js';

// Product functions (re-exported from hooks for backwards compatibility)
export {
  getProducts,
  getProduct,
  getProductRecommendations,
} from '../../hooks/use-shopify-products';

// Collection functions (re-exported from hooks for backwards compatibility)
export {
  getCollections,
  getCollectionProducts,
} from '../../hooks/use-shopify-collections';

// Cart functions (re-exported from hooks for backwards compatibility)
export {
  createCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
  getCart,
  redirectToCheckout,
} from '../../hooks/use-shopify-cart';
