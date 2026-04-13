export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price); // Fallback text formatting in case symbol fails
}

export function generateWhatsAppLink(
  phoneNumber: string,
  message: string
): string {
  // Strip any non-digit chars from number and prefix with +
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
