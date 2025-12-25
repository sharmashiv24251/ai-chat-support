"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductDetails from "@/components/product/ProductDetails";
import ProductTabs from "@/components/product/ProductTabs";
import ChatWidget from "@/components/chat/ChatWidget";
import { Product } from "@/lib/types";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) {
          throw new Error("Product not found");
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      // In a real app, this would update cart state
      console.log(`Added ${product.name} to cart`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col relative">
        <Header />
        <main className="flex-1 relative z-10">
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-10">
            <div className="animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-48 mb-8" />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                <div className="lg:col-span-7">
                  <div className="aspect-[4/3] rounded-3xl bg-neutral-200" />
                </div>
                <div className="lg:col-span-5 space-y-4">
                  <div className="h-8 bg-neutral-200 rounded w-3/4" />
                  <div className="h-6 bg-neutral-200 rounded w-1/2" />
                  <div className="h-24 bg-neutral-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col relative">
        <Header />
        <main className="flex-1 relative z-10 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-neutral-900 mb-4">
              Product Not Found
            </h1>
            <p className="text-neutral-500 mb-8">
              {error || "The product you are looking for does not exist."}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Decorative Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-neutral-200/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-neutral-200/40 rounded-full blur-[120px]"></div>
      </div>

      <Header />

      <main className="flex-1 relative z-10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-10">
          {/* Breadcrumb */}
          <nav className="text-xs font-medium flex items-center gap-2 text-neutral-400 mb-8">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-900">{product.name}</span>
          </nav>

          {/* Product Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <ProductGallery
                images={product.images}
                productName={product.name}
              />
            </div>

            {/* Details */}
            <div className="lg:col-span-5">
              <ProductDetails product={product} onAddToCart={handleAddToCart} />
            </div>
          </div>

          {/* Tabs */}
          <ProductTabs tabs={product.tabs} />
        </div>
      </main>

      <Footer />

      {/* Floating AI Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <ChatWidget
          isOpen={chatOpen}
          onClose={() => setChatOpen(!chatOpen)}
          productName={product.name}
          productSlug={product.slug}
          productChips={product.predefinedQuestions}
        />
      </div>
    </div>
  );
}
