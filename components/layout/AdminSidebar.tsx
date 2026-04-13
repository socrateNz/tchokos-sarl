"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/stats", label: "Statistiques", icon: BarChart3 },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingCart },
];


export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/admin/login");
    } catch {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <aside className="w-64 shrink-0 bg-[#0a0a0a] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-sm">T</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">TCHOKOS</p>
            <p className="text-[#D4AF37] text-[10px] uppercase tracking-widest">
              Admin
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-[#D4AF37] text-black"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
              {isActive && (
                <motion.div layoutId="admin-nav-indicator" className="ml-auto">
                  <ChevronRight className="h-3.5 w-3.5" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-white transition-colors mb-1"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Voir le site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
