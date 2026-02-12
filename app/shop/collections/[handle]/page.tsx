'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import CollectionDetail from '@/components/shopify/collection-detail';
import { useCollectionProducts } from '@/hooks/use-shopify-collections';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function CollectionPage() {
  const params = useParams();
  const handle = params?.handle as string;
  const { collection } = useCollectionProducts(handle);

  // Format title from handle as fallback
  const formattedTitle = handle
    ? handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Collection';

  const title = collection?.title || formattedTitle;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/shop">Shop</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/shop/collections">Collections</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <CollectionDetail />
    </div>
  );
}
