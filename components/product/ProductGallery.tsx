"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Hero Image */}
      <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-100 relative">
        <Image
          src={images[selectedImage]}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square rounded-2xl overflow-hidden border transition-all relative ${
              selectedImage === index
                ? "ring-2 ring-neutral-900 border-neutral-900"
                : "border-neutral-100 hover:ring-1 hover:ring-neutral-300"
            }`}
          >
            <Image
              src={img}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="150px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
