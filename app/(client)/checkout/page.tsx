"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useCartStore from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import WhatsAppButton from "@/components/checkout/WhatsAppButton";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  if (!mounted || items.length === 0) return null;

  const validateForm = () => {
    const newErrors = { name: "", phone: "", address: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
      isValid = false;
    }
    if (!formData.address.trim()) {
      newErrors.address = "L'adresse est requise";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post("/api/orders", {
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        items: items.map(i => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
          size: i.size,
          price: i.price
        })),
        source: "direct",
      });

      toast.success("Commande enregistrée avec succès !");
      clearCart();
      router.push("/");
    } catch {
      toast.error("Erreur lors de l'enregistrement de la commande");
    } finally {
      setLoading(false);
    }
  };

  const isFormValidForWhatsApp = formData.name.trim() && formData.phone.trim() && formData.address.trim();

  return (
    <div className="bg-[#FAFAFA] min-h-[calc(100vh-80px)] py-10 md:py-16">
      <div className="container-app">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">
          Passer la commande
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Form */}
          <div className="flex-1 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Informations de livraison</h2>
            <div className="space-y-5">
              <Input
                id="name"
                label="Nom complet"
                placeholder="Ex: Jean Dupont"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                error={errors.name}
              />
              <Input
                id="phone"
                label="Numéro de téléphone"
                placeholder="Ex: 6XXXXXXXX"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
                error={errors.phone}
              />
              <Input
                id="address"
                label="Adresse de livraison complète"
                placeholder="Ex: Quartier, Repère, Ville"
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  if (errors.address) setErrors({ ...errors, address: "" });
                }}
                error={errors.address}
              />
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100 flex items-start gap-3">
               <div>
                  <strong>Information de paiement :</strong> Le paiement s'effectue exclusivement à la livraison de vos articles en espèces ou par Mobile Money.
               </div>
            </div>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-[400px] shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Résumé</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded overflow-hidden shrink-0 bg-gray-50">
                      <Image src={item.image || "/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Taille: {item.size} | Qte: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-semibold text-gray-900">Total à payer</span>
                  <span className="text-2xl font-black text-[#D4AF37]">{formatPrice(totalPrice())}</span>
                </div>
              </div>

              <div className="space-y-3">
                <WhatsAppButton 
                   items={items} 
                   total={totalPrice()} 
                   customerInfo={formData} 
                   disabled={!isFormValidForWhatsApp} 
                />
                
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OU</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <Button 
                   fullWidth 
                   variant="outline"
                   onClick={handleSaveOrder}
                   loading={loading}
                >
                   Enregistrer sans WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
