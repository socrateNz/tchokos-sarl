"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const mainImage = images && images.length > 0 
    ? images[activeIdx] 
    : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80";

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm transition-all duration-500">
        <Image
          src={mainImage}
          alt={productName}
          fill
          className="object-cover object-center transition-transform duration-700 hover:scale-110"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      
      {/* Thumbnails */}
      {images && images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-square rounded-xl overflow-hidden bg-gray-50 border-2 transition-all duration-200 group ${
                activeIdx === idx 
                  ? "border-[#D4AF37] ring-4 ring-[#D4AF37]/10" 
                  : "border-gray-100 hover:border-gray-300"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} - Vue ${idx + 1}`}
                fill
                className={`object-cover object-center transition-opacity duration-300 ${
                  activeIdx === idx ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                }`}
              />
              {activeIdx === idx && (
                <div className="absolute inset-0 bg-[#D4AF37]/5 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
