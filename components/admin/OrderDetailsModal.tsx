"use client";

import { useState } from "react";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  Phone,
  MapPin,
  Calendar,
  Package,
  MessageSquare,
  CheckCircle2,
  DollarSign,
  Truck,
  User
} from "lucide-react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

interface OrderDetailsModalProps {
  order: any;
  onUpdate: () => void;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onUpdate, onClose }: OrderDetailsModalProps) {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      await axios.put(`/api/orders/${order._id}`, { status: newStatus });
      
      let message = "Statut mis à jour";
      if (newStatus === 'confirmed') message = "Commande validée";
      if (newStatus === 'delivered') message = "Commande encaissée et livrée";
      
      toast.success(message);
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };


  const whatsappLink = generateWhatsAppLink(
    "+237" + order.phone,
    `Bonjour ${order.customerName}, je vous contacte concernant votre commande #${order._id.substring(order._id.length - 6).toUpperCase()} sur Tchokos.`
  );

  return (
    <div className="space-y-8">
      {/* Customer Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <User className="w-3 h-3" /> Informations Client
          </h3>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{order.customerName}</p>
                <p className="text-xs text-gray-500">Client</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <p className="text-sm font-medium text-gray-700">{order.phone}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{order.address}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Calendar className="w-3 h-3" /> Détails Commande
          </h3>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500 uppercase">Statut actuel</span>
              <Badge status={order.status} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500 uppercase">Date</span>
              <span className="text-sm font-bold text-gray-900">
                {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                  day: '2-digit', month: 'long', year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500 uppercase">Source</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-black uppercase tracking-tighter">
                {order.source}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Package className="w-3 h-3" /> Articles Commandés ({order.items.length})
        </h3>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 font-medium">Article</th>
                <th className="px-4 py-3 font-medium">Taille</th>
                <th className="px-4 py-3 font-medium text-center">Qté</th>
                <th className="px-4 py-3 font-medium text-right">Prix Unit.</th>
                <th className="px-4 py-3 font-medium text-right font-bold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {order.items.map((item: any, i: number) => (
                <tr key={i}>
                  <td className="px-4 py-4 font-bold text-gray-900">{item.name}</td>
                  <td className="px-4 py-4 text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold">{item.size}</span>
                  </td>
                  <td className="px-4 py-4 text-center text-gray-700">{item.quantity}</td>
                  <td className="px-4 py-4 text-right text-gray-500">{formatPrice(item.price)}</td>
                  <td className="px-4 py-4 text-right font-black text-gray-900">{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50/50 border-t border-gray-100">
              <tr>
                <td colSpan={4} className="px-4 py-4 text-right text-gray-500 font-medium">Total de la commande</td>
                <td className="px-4 py-4 text-right text-lg font-black text-[#D4AF37]">{formatPrice(order.totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-gray-100">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-2xl font-bold hover:bg-[#128C7E] transition-all shadow-lg shadow-[#25D366]/20"
        >
          <MessageSquare className="w-5 h-5" />
          Contacter sur WhatsApp
        </a>

        <div className="flex gap-2">
          {order.status === "pending" && (
            <Button
              onClick={() => updateStatus("confirmed")}
              loading={loading}
              className="gap-2 bg-blue-600 hover:bg-blue-700 border-none shadow-lg shadow-blue-200"
            >
              <CheckCircle2 className="w-4 h-4" /> Valider la commande
            </Button>
          )}
          {order.status === "confirmed" && (
            <Button
              onClick={() => updateStatus("delivered")}
              loading={loading}
              className="gap-2 bg-[#D4AF37] hover:bg-[#B8962E] border-none shadow-lg shadow-[#D4AF37]/20 text-black font-bold"
            >
              <DollarSign className="w-4 h-4" /> Encaisser la commande
            </Button>
          )}

          <Button variant="outline" onClick={onClose} disabled={loading}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}
