"use client";

import { useState } from "react";

import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import useCartStore from "@/store/cartStore";
import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";

interface AddToCartFormProps {
  product: Product;
}

export default function AddToCartForm({ product }: AddToCartFormProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  // Calculate min price for display when no size is selected
  const prices = product.stockEntries?.map(s => s.price) || [];
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  // Find stock and price for selected size
  const selectedSizeInfo = product.stockEntries?.find((s) => s.size === selectedSize);
  const selectedSizeStock = selectedSizeInfo?.quantity || 0;
  const currentPrice = selectedSizeInfo?.price || minPrice;


  const isOutOfStock = (product.stockEntries?.reduce((sum, s) => sum + s.quantity, 0) || 0) <= 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Veuillez sélectionner une taille");
      return;
    }

    if (quantity > selectedSizeStock) {
      toast.error(`Désolé, seulement ${selectedSizeStock} unités disponibles pour cette taille.`);
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      price: currentPrice, // Use the price of the specific size
      size: selectedSize,
      quantity,
      image: product.images?.[0] || "",
    });

    toast.success("Ajouté au panier !");
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Price Display */}
      <div className="mb-6 border-b border-gray-100 pb-6">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-black text-gray-900 tracking-tighter transition-all duration-300">
            {!selectedSize && prices.length > 1 ? "À partir de " : ""}{formatPrice(currentPrice * quantity)}
          </span>
          {quantity > 1 && (
            <span className="text-sm text-gray-400 font-medium">
              ({formatPrice(currentPrice)} / unité)
            </span>
          )}
        </div>
      </div>


      {/* Sizes Section */}

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Tailles disponibles</h3>
          {selectedSize && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedSizeStock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {selectedSizeStock > 0 ? `${selectedSizeStock} en stock` : "Rupture de stock"}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {product.sizes.map((size) => {
            const sizeStock = product.stockEntries?.find((s) => s.size === size)?.quantity || 0;
            const isSizeAvailable = sizeStock > 0;

            return (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setSelectedSize(size);
                  setQuantity(1); // Reset quantity when size changes
                }}
                className={`relative min-w-[3.5rem] px-3 h-14 flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-300 ${selectedSize === size
                  ? "border-[#D4AF37] bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20"
                  : isSizeAvailable
                    ? "border-gray-100 bg-white text-gray-700 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                    : "border-gray-50 bg-gray-50 text-gray-300 cursor-not-allowed opacity-60"
                  }`}
              >
                <span className={`text-sm font-bold ${!isSizeAvailable ? "line-through decoration-gray-400 decoration-2" : ""}`}>
                  {size}
                </span>
                {isSizeAvailable && (
                  <span className={`text-[9px] mt-0.5 font-medium opacity-70 ${selectedSize === size ? "text-gray-900" : "text-gray-500"}`}>
                    {formatPrice(product.stockEntries?.find(s => s.size === size)?.price || minPrice)}
                  </span>
                )}

                {!isSizeAvailable && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-400" />
                )}
              </button>
            );

          })}
        </div>
      </div>


      {/* Quantity & Add Action */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100 h-12">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={!selectedSize || quantity <= 1}
            className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all disabled:opacity-30"
          >
            -
          </button>
          <span className="w-12 text-center text-sm font-black text-gray-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            disabled={!selectedSize || quantity >= selectedSizeStock}
            className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all disabled:opacity-30"
          >
            +
          </button>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || (selectedSize !== "" && selectedSizeStock <= 0)}
          className={`flex-1 h-12 text-sm font-black uppercase tracking-widest shadow-xl transition-all ${isOutOfStock ? "bg-gray-200 border-none text-gray-400" : ""
            }`}
        >
          <ShoppingBag className="w-5 h-5 mr-3" />
          {isOutOfStock ? "Rupture de stock" : "Ajouter au panier"}
        </Button>
      </div>
    </div>
  );
}

