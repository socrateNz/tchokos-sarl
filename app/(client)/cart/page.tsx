"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useCartStore from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="bg-[#FAFAFA] min-h-[calc(100vh-80px)] py-20 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Votre panier est vide</h1>
        <p className="text-gray-500 mb-8 max-w-sm text-center">
          Découvrez nos collections et trouvez votre prochaine paire idéale.
        </p>
        <Link href="/products">
          <Button>Explorer la boutique</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-[calc(100vh-80px)] py-10 md:py-16">
      <div className="container-app">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">
          Mon Panier ({totalItems()})
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 md:gap-6"
              >
                {/* Image */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg bg-gray-50 overflow-hidden shrink-0">
                  <Image
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100px, 150px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Taille: {item.size}</p>
                    <p className="font-bold text-gray-900 mt-2">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-sm text-gray-500">Qte:</span>
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-l-lg"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white p-6 rounded-xl border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Résumé</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="text-[#D4AF37]">À définir</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-semibold text-gray-900">Total estimé</span>
                  <span className="text-2xl font-black text-gray-900">{formatPrice(totalPrice())}</span>
                </div>
              </div>

              <Link href="/checkout" className="block w-full">
                <Button fullWidth size="lg" className="h-14">
                  Passer la commande
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
