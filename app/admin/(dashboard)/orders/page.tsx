"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";
import { Eye, Trash2, Loader2, ShoppingBag, AlertCircle } from "lucide-react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [deletingOrder, setDeletingOrder] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/orders?limit=100");
      setOrders(data.orders);
    } catch (error) {
      toast.error("Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleOpenDelete = (order: any) => {
    setDeletingOrder(order);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingOrder) return;
    setSubmitting(true);
    try {
      await axios.delete(`/api/orders/${deletingOrder._id}`);
      toast.success("Commande supprimée");
      setIsDeleteOpen(false);
      fetchOrders();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOrderUpdate = () => {
    setIsDetailsOpen(false);
    fetchOrders();
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
          <p className="text-gray-500 mt-1">Suivez et gérez les commandes clients</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
           <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter mr-2">Total</span>
           <span className="text-lg font-black text-gray-900">{orders.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">ID</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Date</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Client</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Montant</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Statut</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#D4AF37] mb-2" />
                    <p className="text-gray-400">Chargement des commandes...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Aucune commande pour le moment.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-mono font-medium text-gray-400 text-xs">
                      #{order._id.substring(order._id.length - 6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900">{order.customerName}</p>
                        <p className="text-[11px] text-gray-400">{order.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={order.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => handleOpenDetails(order)}
                          className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-xl transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenDelete(order)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={`Détails Commande #${selectedOrder?._id.substring(selectedOrder?._id.length - 6).toUpperCase()}`}
      >
        <OrderDetailsModal 
          order={selectedOrder} 
          onUpdate={handleOrderUpdate} 
          onClose={() => setIsDetailsOpen(false)} 
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Supprimer la commande"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
            <AlertCircle className="w-8 h-8 shrink-0" />
            <p className="text-sm leading-relaxed">
              Voulez-vous vraiment supprimer la commande de <strong>{deletingOrder?.customerName}</strong> ? 
              Cette action est définitive.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Annuler
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-200" 
              onClick={handleDelete}
              loading={submitting}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

