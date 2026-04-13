"use client";

import { MessageCircle } from "lucide-react";
import Button from "../ui/Button";
import { generateWhatsAppLink, formatPrice } from "@/lib/utils";
import { CartItem, CustomerInfo } from "@/types";

interface WhatsAppButtonProps {
  items: CartItem[];
  total: number;
  customerInfo: CustomerInfo;
  disabled?: boolean;
}

export default function WhatsAppButton({
  items,
  total,
  customerInfo,
  disabled
}: WhatsAppButtonProps) {
  const handleWhatsAppOrder = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "237600000000";

    const itemsText = items
      .map(
        (item) =>
          `- ${item.quantity}x ${item.name} (Taille: ${item.size}) - ${formatPrice(item.price * item.quantity)}`
      )
      .join("\n");

    const message = `*NOUVELLE COMMANDE* 🛍️\n\n*Client:* ${customerInfo.name}\n*Téléphone:* ${customerInfo.phone}\n*Adresse:* ${customerInfo.address}\n\n*Articles:*\n${itemsText}\n\n*TOTAL: ${formatPrice(total)}*\n\n_Commande générée depuis le site web._`;

    const link = generateWhatsAppLink(phoneNumber, message);
    window.open(link, "_blank");
  };

  return (
    <Button
      fullWidth
      variant="primary"
      size="lg"
      className="!bg-[#25D366] !text-white hover:!bg-[#20bd5a] mt-4"
      onClick={handleWhatsAppOrder}
      disabled={disabled}
    >
      <MessageCircle className="w-5 h-5" />
      Commander via WhatsApp
    </Button>
  );
}
