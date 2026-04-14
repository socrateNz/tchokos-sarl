export const dynamic = "force-dynamic";

import connectDB from "@/lib/mongodb";

import Order from "@/models/Order";
import Product from "@/models/Product";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, TrendingUp, DollarSign } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

async function getDashboardStats() {
  await connectDB();

  const [totalProducts, totalOrders, pendingOrders, revenueData] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: "pending" }),
    Order.aggregate([
      { $match: { status: { $ne: "pending" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ])
  ]);

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return {
    totalProducts,
    totalOrders,
    pendingOrders,
    totalRevenue: revenueData[0]?.total || 0,
    recentOrders: recentOrders.map(o => ({
      ...o,
      _id: o._id.toString(),
      createdAt: (o.createdAt as Date).toISOString()
    })) as unknown as import("@/types").Order[],
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { title: "Revenus (Confirmés)", value: formatPrice(stats.totalRevenue), icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
    { title: "Commandes au total", value: stats.totalOrders.toString(), icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Commandes en attente", value: stats.pendingOrders.toString(), icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Produits en catalogue", value: stats.totalProducts.toString(), icon: Package, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Aperçu de l'activité de votre boutique</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-2xl font-black text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Dernières commandes</h2>
          <Link href="/admin/orders" className="text-[#D4AF37] text-sm font-medium hover:underline">
            Voir tout
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Montant</th>
                <th className="px-6 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Aucune commande trouvée.
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium font-mono text-xs text-gray-500">
                      #{order._id.substring(order._id.length - 6)}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-bold">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={order.status} size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
