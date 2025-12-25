"use client";

import { useState } from "react";
import { Product } from "@/lib/types";

interface ProductDetailsProps {
  product: Product;
  onAddToCart: () => void;
}

export default function ProductDetails({
  product,
  onAddToCart,
}: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.variants?.colors?.[0] || null
  );
  const [selectedStorage, setSelectedStorage] = useState<string | null>(
    product.variants?.storage?.[0] || null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.variants?.sizes?.[0] || null
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        {/* Title */}
        <h1 className="text-4xl tracking-tighter font-semibold text-neutral-900">
          {product.name}
        </h1>

        {/* Price & Rating */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="text-2xl font-medium text-neutral-900">
            {product.currencySymbol}
            {product.price.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Description */}
        <p className="mt-6 text-neutral-600 leading-relaxed font-light">
          {product.description}
        </p>

        {/* Selectors */}
        <div className="mt-10 space-y-6">
          {/* Color Selector */}
          {product.variants?.colors && (
            <div>
              <span className="text-sm font-medium text-neutral-900">
                Color
              </span>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.variants.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-10 px-4 rounded-xl border text-sm font-medium transition-all bg-white shadow-sm ${
                      selectedColor === color
                        ? "border-neutral-900 text-neutral-900 ring-1 ring-neutral-900"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Storage Selector */}
          {product.variants?.storage && (
            <div>
              <span className="text-sm font-medium text-neutral-900">
                Storage
              </span>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.variants.storage.map((storage) => (
                  <button
                    key={storage}
                    onClick={() => setSelectedStorage(storage)}
                    className={`h-10 px-4 rounded-xl border text-sm font-medium transition-all bg-white shadow-sm ${
                      selectedStorage === storage
                        ? "border-neutral-900 text-neutral-900 ring-1 ring-neutral-900"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                    }`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.variants?.sizes && (
            <div>
              <span className="text-sm font-medium text-neutral-900">Size</span>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.variants.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 px-4 rounded-xl border text-sm font-medium transition-all bg-white shadow-sm ${
                      selectedSize === size
                        ? "border-neutral-900 text-neutral-900 ring-1 ring-neutral-900"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 pt-8 border-t border-neutral-100">
        <div className="flex gap-4">
          <button
            onClick={onAddToCart}
            className="flex-1 group relative h-12 rounded-full overflow-hidden bg-neutral-900 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="absolute inset-0 w-full h-full bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left"></div>
            <div className="relative flex items-center justify-center gap-2 group-hover:text-neutral-900 transition-colors duration-300 font-medium">
              <span>Add to Cart</span>
            </div>
          </button>
          <button className="flex-1 group relative h-12 rounded-full overflow-hidden border border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300 transition-all duration-300">
            <div className="absolute inset-0 w-full h-full bg-neutral-100 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom"></div>
            <span className="relative font-medium">Buy Now</span>
          </button>
        </div>

        {/* Meta Info */}
        <div className="mt-6 text-xs text-neutral-500 text-center flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
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
              className="text-emerald-500"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            In Stock
          </span>
          <span className="flex items-center gap-1">
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
            >
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
              <path d="M15 18H9" />
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
              <circle cx="17" cy="18" r="2" />
              <circle cx="7" cy="18" r="2" />
            </svg>
            Free Shipping
          </span>
          <span className="flex items-center gap-1">
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
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            Warranty
          </span>
        </div>
      </div>
    </div>
  );
}
