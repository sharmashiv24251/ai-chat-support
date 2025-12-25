"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductSummary } from "@/lib/types";

interface ProductCardProps {
  product: ProductSummary;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group cursor-pointer block"
    >
      <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden rounded-3xl bg-neutral-100 mb-5">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

        {/* Quick Action */}
        <button className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-neutral-900 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-sm hover:scale-110">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
          </svg>
        </button>
      </div>
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-neutral-900 tracking-tight">
              {product.name}
            </h3>
            <p className="text-sm text-neutral-500 mt-1">{product.category}</p>
          </div>
          <span className="text-sm font-medium text-neutral-900">
            {product.currencySymbol}
            {product.price.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
