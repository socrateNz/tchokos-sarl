"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useCartStore from "@/store/cartStore";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/products", label: "Catalogue" },
  { href: "/products?category=homme", label: "Homme" },
  { href: "/products?category=femme", label: "Femme" },
  { href: "/products?category=enfant", label: "Enfant" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-black"
          }`}
      >
        <nav className="container-app flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-sm">T</span>
            </div>
            <span
              className={`text-xl font-black tracking-tight transition-colors ${isScrolled ? "text-[#0a0a0a]" : "text-white"
                }`}
            >
              TCHOKOS
            </span>
            <span className="text-[#D4AF37] font-light text-sm mt-1 hidden sm:block">
              SARL
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors relative group ${isScrolled ? "text-gray-700 hover:text-[#D4AF37]" : "text-white/90 hover:text-white"
                      } ${isActive ? "text-[#D4AF37]" : ""}`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-[#D4AF37] transition-all duration-200 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <Link
              href="/products"
              className={`p-2 rounded-lg transition-colors ${isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                }`}
              aria-label="Rechercher"
            >
              <Search className="h-5 w-5" />
            </Link>

            <Link
              href="/cart"
              className={`relative p-2 rounded-lg transition-colors ${isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                }`}
              aria-label="Panier"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center"
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </motion.span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                }`}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#0a0a0a] pt-20 px-6 md:hidden"
          >
            <ul className="flex flex-col gap-2 mt-4">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center py-4 text-xl font-semibold text-white hover:text-[#D4AF37] border-b border-white/10 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
