export interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  sizes: string[];

  stockEntries?: { size: string; quantity: number; price: number }[];

  category: "homme" | "femme" | "enfant" | "accessoires";

  isFeatured: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  size: string;
  price: number;
  image?: string;
}

export interface Order {
  _id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "delivered";
  source: "whatsapp" | "direct";
  createdAt: string;
}

export interface CartItem extends OrderItem {
  image?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}
