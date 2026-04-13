"use client";

import NextImage from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80";

  return (
    <Link href={`/products/${product._id}`} className="group card-hover block bg-white rounded-xl overflow-hidden border border-gray-100">
      {/* Image container */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
        {product.isFeatured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              Vedette
            </span>
          </div>
        )}
        <NextImage
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col h-full">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5 break-words">
          {product.category}
        </p>
        <h3 className="font-semibold text-gray-900 group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug mb-2 flex-grow">
          {product.name}
        </h3>

        <div className="flex items-end justify-between mt-auto pt-2">
          <div className="flex flex-col">
            <p className="font-bold text-lg text-gray-900 tracking-tight">
              {(product as any).minPrice > 0
                ? (product as any).minPrice === (product as any).maxPrice
                  ? formatPrice((product as any).minPrice)
                  : `À partir de ${formatPrice((product as any).minPrice)}`
                : "Prix sur demande"}
            </p>
          </div>
          <button className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center transition-colors group-hover:bg-[#0a0a0a] group-hover:text-white" aria-label="Voir le produit">
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>


      </div>
    </Link>
  );
}
