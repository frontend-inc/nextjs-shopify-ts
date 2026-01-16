'use client';

import { useState, useEffect, useCallback } from 'react';
import { shopifyFetch } from '@/services/shopify/client';
import {
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_PRODUCTS_QUERY,
} from '@/graphql/collections';
import type { Product } from './use-shopify-products';

interface CollectionImage {
  url: string;
  altText?: string;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  descriptionHtml?: string;
  image?: CollectionImage;
}

export interface CollectionWithProducts extends Collection {
  products: Product[];
}

interface UseCollectionProductsOptions {
  first?: number;
  sortKey?: 'BEST_SELLING' | 'CREATED' | 'PRICE' | 'TITLE';
  reverse?: boolean;
}

// Fetch all collections
export async function getCollections(first = 50): Promise<Collection[]> {
  const response = await shopifyFetch({
    query: GET_COLLECTIONS_QUERY,
    variables: { first },
  });

  return response.data.collections.edges.map((edge: { node: Collection }) => edge.node);
}

// Fetch products in a collection by handle
export async function getCollectionProducts(
  handle: string,
  { first = 50, sortKey = 'BEST_SELLING', reverse = false }: UseCollectionProductsOptions = {}
): Promise<CollectionWithProducts | null> {
  const response = await shopifyFetch({
    query: GET_COLLECTION_PRODUCTS_QUERY,
    variables: { handle, first, sortKey, reverse },
  });

  const collection = response.data.collection;
  if (!collection) return null;

  return {
    ...collection,
    products: collection.products.edges.map((edge: { node: Product }) => edge.node),
  };
}

// Hook for fetching all collections
export function useCollections(first = 50) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCollections(first);
      setCollections(data);
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError(err instanceof Error ? err.message : 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, [first]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return { collections, loading, error, refetch: fetchCollections };
}

// Hook for fetching products in a collection
export function useCollectionProducts(
  handle: string | null,
  options: UseCollectionProductsOptions = {}
) {
  const [collection, setCollection] = useState<CollectionWithProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollection = useCallback(async () => {
    if (!handle) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getCollectionProducts(handle, options);
      setCollection(data);
      if (!data) {
        setError('Collection not found');
      }
    } catch (err) {
      console.error('Error fetching collection products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load collection');
    } finally {
      setLoading(false);
    }
  }, [handle, options.first, options.sortKey, options.reverse]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  return { collection, loading, error, refetch: fetchCollection };
}
