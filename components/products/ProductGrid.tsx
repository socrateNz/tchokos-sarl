"use client";

import { Product, StockEntry } from "@/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  stockEntries: StockEntry[];
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  emptyMessage = "Aucun produit trouvé.",
  stockEntries,
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} stock={stockEntries} />
      ))}
    </div>
  );
}
