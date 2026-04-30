"use client";

import { MouseEvent } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { Product, StockEntry } from "@/types";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import useCartStore from "@/store/cartStore";
import toast from "react-hot-toast";
import Button from "../ui/Button";

interface ProductCardProps {
  product: Product;
  stock: StockEntry[]
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80";
  const addItem = useCartStore((s) => s.addItem);

  const stockEntries = product.stockEntries || [];
  const hasStock = stockEntries.some((entry) => entry.quantity > 0);
  const minPrice = stockEntries.length
    ? Math.min(...stockEntries.map((entry) => entry.price))
    : 0;
  const maxPrice = stockEntries.length
    ? Math.max(...stockEntries.map((entry) => entry.price))
    : minPrice;

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const firstAvailableEntry = stockEntries.find((entry) => entry.quantity > 0);
    const fallbackSize = product.sizes[0] || "Unique";
    const selectedSize = firstAvailableEntry?.size || fallbackSize;
    const selectedPrice = firstAvailableEntry?.price || minPrice;

    if (!hasStock) {
      toast.error("Produit en rupture de stock");
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      price: selectedPrice,
      size: selectedSize,
      quantity: 1,
      image: mainImage,
    });

    toast.success("Produit ajouté au panier");
  };

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
      <div className="p-4 sm:p-5 flex flex-col">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5 break-words">
          {product.category}
        </p>
        <p className="font-semibold text-gray-900 group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug mb-2 min-h-[2.75rem]">
          {product.name}
        </p>

        <div className="flex flex-col items-end justify-between mt-auto pt-2">
          <div className="flex flex-col">
            <p className="font-bold text-lg text-gray-900 tracking-tight">
              {minPrice > 0
                ? minPrice === maxPrice
                  ? formatPrice(minPrice)
                  : `À partir de ${formatPrice(minPrice)}`
                : "Prix sur demande"}
            </p>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!hasStock}
            className="w-full h-9 px-3 rounded-full bg-gray-100 border border-black text-gray-700 text-xs font-semibold flex items-center gap-1.5 justify-center transition-colors group-hover:bg-[#0a0a0a] group-hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Ajouter au panier"
          >
            <ShoppingBag className="h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>
    </Link>
  );
}
