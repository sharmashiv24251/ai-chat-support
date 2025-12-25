"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { ProductSummary } from "@/lib/types";

export default function ProductGrid() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div
      id="products"
      className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-16 border-t border-neutral-100"
    >
      <div className="flex items-end justify-between mb-10">
        <h2 className="text-2xl tracking-tight font-medium text-neutral-900">
          Products
        </h2>
        <a
          href="#"
          className="hidden sm:block text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          View all
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square rounded-3xl bg-neutral-200 mb-5" />
              <div className="h-5 bg-neutral-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-neutral-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
