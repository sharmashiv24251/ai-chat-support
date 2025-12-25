"use client";

import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/lib/constants/products";

interface ProductMiniCardProps {
  slug: string;
}

export default function ProductMiniCard({ slug }: ProductMiniCardProps) {
  const product = getProductBySlug(slug);

  if (!product) {
    return null;
  }

  return (
    <Link
      href={`/products/${slug}`}
      className="inline-flex items-center gap-3 p-2 pr-4 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100 transition-all duration-200 shadow-sm hover:shadow group my-2"
    >
      <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-white">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="48px"
        />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-neutral-900 truncate">
          {product.name}
        </span>
        <span className="text-xs text-neutral-500">
          {product.currencySymbol}
          {product.price.toLocaleString()}
        </span>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-neutral-400 group-hover:text-neutral-600 transition-colors ml-1"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Link>
  );
}
