"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/axios";
import { formatPrice } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Loader2, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar as CalendarIcon,
  Clock
} from "lucide-react";
import toast from "react-hot-toast";
import { subDays, format, startOfMonth, endOfMonth } from "date-fns";

const PRESETS = [
  { label: "7 derniers jours", getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
  { label: "30 derniers jours", getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
  { label: "Ce mois", getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
];

export default function AdministrativeStatsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState({
    from: subDays(new Date(), 29),
    to: new Date()
  });
  const [activePreset, setActivePreset] = useState("30 derniers jours");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/stats", {
        params: {
          from: format(range.from, "yyyy-MM-dd"),
          to: format(range.to, "yyyy-MM-dd")
        }
      });
      setData(data);
    } catch (error) {
      toast.error("Erreur de chargement des statistiques");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handlePresetChange = (preset: any) => {
    const newRange = preset.getValue();
    setRange(newRange);
    setActivePreset(preset.label);
  };

  const handleCustomDateChange = (field: "from" | "to", value: string) => {
    setRange(prev => ({ ...prev, [field]: new Date(value) }));
    setActivePreset("Personnalisé");
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37] mb-4" />
        <p className="text-gray-500 font-medium tracking-tight">Analyse financière en cours...</p>
      </div>
    );
  }

  const kpis = data ? [
    { 
      title: "Chiffre d'Affaires (Encaissé)", 
      value: formatPrice(data.overall.totalRevenue), 
      icon: DollarSign, 
      color: "text-green-600", 
      bg: "bg-green-100",
      trend: "+12.5%",
      isPositive: true
    },
    { 
      title: "Chiffre d'Affaires Latent", 
      value: formatPrice(data.overall.pendingRevenue), 
      icon: Clock, 
      color: "text-blue-600", 
      bg: "bg-blue-100",
      trend: "En attente",
      isPositive: true
    },
    { 
      title: "Panier Moyen", 
      value: formatPrice(Math.round(data.overall.avgOrderValue)), 
      icon: TrendingUp, 
      color: "text-purple-600", 
      bg: "bg-purple-100",
      trend: "+5.1%",
      isPositive: true
    },
    { 
      title: "Commandes sur la période", 
      value: data.overall.totalOrders, 
      icon: ShoppingBag, 
      color: "text-amber-600", 
      bg: "bg-amber-100",
      trend: "Total",
      isPositive: true
    },
  ] : [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header & Filters */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tableau de Bord Financier</h1>
          <p className="text-gray-500 mt-1">Données basées sur les commandes traitées et encaissées.</p>
        </div>

        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 border-r border-gray-100 hidden sm:flex">
               <CalendarIcon className="w-4 h-4 text-[#D4AF37]" />
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Période</span>
            </div>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => handlePresetChange(p)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activePreset === p.label 
                  ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20" 
                  : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {p.label}
              </button>
            ))}
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-xl border border-gray-100">
               <input 
                 type="date" 
                 className="bg-transparent text-[10px] font-bold outline-none uppercase" 
                 value={format(range.from, "yyyy-MM-dd")}
                 onChange={(e) => handleCustomDateChange("from", e.target.value)}
               />
               <span className="text-gray-300">/</span>
               <input 
                 type="date" 
                 className="bg-transparent text-[10px] font-bold outline-none uppercase" 
                 value={format(range.to, "yyyy-MM-dd")}
                 onChange={(e) => handleCustomDateChange("to", e.target.value)}
               />
            </div>
        </div>
      </div>

      {!data ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-white rounded-3xl border border-gray-100">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4 opacity-20" />
          <h2 className="text-xl font-bold text-gray-900">Aucune donnée pour cette période</h2>
          <p className="text-gray-500 mt-2">Essayez d'élargir la plage de dates sélectionnée.</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:border-[#D4AF37]/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${kpi.bg}`}>
                    <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                  <div className={`flex items-center gap-0.5 text-[10px] font-black uppercase px-2 py-1 rounded-full ${kpi.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.trend}
                  </div>
                </div>
                <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{kpi.title}</h3>
                <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Chart */}
            <div className={`lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-opacity duration-300 ${loading ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Courbe de Croissance</h2>
                  <p className="text-sm text-gray-500">Données basées sur l'encaissement effectif</p>
                </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.revenueHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }}
                      tickFormatter={(val) => `${val/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                      formatter={(val: any) => [formatPrice(val), "Encaissement"]}
                    />

                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#D4AF37" 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: "#fff", stroke: "#D4AF37", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products */}
            <div className={`bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-opacity duration-300 ${loading ? 'opacity-50' : ''}`}>
               <h2 className="text-xl font-bold text-gray-900 mb-1">Top Ventes</h2>
               <p className="text-sm text-gray-500 mb-8">Produits les plus encaissés</p>
               
               <div className="space-y-6">
                  {data.topProducts.map((product: any, i: number) => (
                    <div key={i} className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-black text-gray-400 text-lg">
                          0{i + 1}
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[#D4AF37] rounded-full" 
                                  style={{ width: `${(product.quantity / (data.topProducts[0]?.quantity || 1)) * 100}%` }}
                                />
                             </div>
                             <span className="text-[10px] font-black text-gray-500">{product.quantity} units</span>
                          </div>
                       </div>
                    </div>
                  ))}

                  {data.topProducts.length === 0 && (
                    <p className="text-gray-400 italic text-sm text-center py-10 underline decoration-dotted">Aucune vente encaissée</p>
                  )}
               </div>

               <div className="mt-10 p-5 bg-[#0a0a0a] rounded-3xl text-white relative overflow-hidden group">
                  <Package className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Articles totaux sur période</p>
                  <p className="text-2xl font-black text-[#D4AF37]">
                    {data.topProducts.reduce((sum: number, p: any) => sum + p.quantity, 0)} <span className="text-sm text-gray-500 uppercase">Unités</span>
                  </p>
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

