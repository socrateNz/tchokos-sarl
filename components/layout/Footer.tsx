import Link from "next/link";
import { MessageCircle, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-20 pb-10">
      <div className="container-app py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-sm">T</span>
              </div>
              <span className="text-xl font-black">TCHOKOS SARL</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Votre boutique de chaussures et accessoires de mode premium au Cameroun.
              Style, qualité et élégance à votre portée.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-[#D4AF37] hover:text-black transition-all duration-200"
                aria-label="Instagram"
              >
                <span className="font-bold text-xs uppercase">IG</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-[#D4AF37] hover:text-black transition-all duration-200"
                aria-label="Facebook"
              >
                <span className="font-bold text-xs uppercase">FB</span>
              </a>
              <a
                href="https://wa.me/237600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-[#25D366] transition-all duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-[#D4AF37] mb-4">
              Boutique
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/products", label: "Tous les produits" },
                { href: "/products?category=homme", label: "Homme" },
                { href: "/products?category=femme", label: "Femme" },
                { href: "/products?category=enfant", label: "Enfant" },
                { href: "/products?category=accessoires", label: "Accessoires" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-[#D4AF37] mb-4">
              Informations
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/cart", label: "Mon panier" },
                { href: "/checkout", label: "Commander" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-[#D4AF37] mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 mt-0.5 text-[#D4AF37] shrink-0" />
                Yaoundé, Cameroun
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4 text-[#D4AF37] shrink-0" />
                +237 6XX XXX XXX
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MessageCircle className="h-4 w-4 text-[#25D366] shrink-0" />
                WhatsApp disponible
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Tchokos SARL. Tous droits réservés.
          </p>
          <p className="text-xs text-gray-600">
            design and build by <Link href="https://portfolio-socrate.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-white transition-colors">Etarcos Dev</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
