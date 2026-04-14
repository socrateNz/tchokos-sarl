import Link from "next/link";
import Image from "next/image";
import ProductGrid from "@/components/products/ProductGrid";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Button from "@/components/ui/Button";
import { ArrowRight, Truck, ShieldCheck, Headphones, Sparkles, Star } from "lucide-react";

async function getFeaturedProducts() {
  try {
    await connectDB();
    const products = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    return products.map(p => ({
      ...p,
      _id: p._id.toString(),
      createdAt: (p.createdAt as Date).toISOString(),
      updatedAt: (p.updatedAt as Date)?.toISOString(),
    })) as unknown as import("@/types").Product[];
  } catch (error) {
    console.error("Error fetching featured products", error);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
          <Image
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop"
            alt="Collection de chaussures de luxe"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>

        <div className="container-app relative z-20 px-6 lg:px-8">
          <div className="flex flex-col gap-4 max-w-4xl mx-auto lg:mx-0 text-center lg:text-left">

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.1] mb-8 tracking-tight">
              L'Élégance à{" "}
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                Chaque Pas
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Tchokos SARL est né d’une vision simple : offrir du style au Cameroun. <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent uppercase font-bold">« C’est difficile mais c’est possible »</span> est devenu la force qui a transformé cette idée en réalité.
            </p>

            <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
              <Link href="/products">
                <Button size="lg" className="text-base px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  Explorer la collection
                  <ArrowRight className="ml-2 w-5 h-5 inline-block group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="text-base px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                  Notre histoire
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 sm:gap-12 max-w-xl mx-auto lg:mx-0 mt-16 pt-10 border-t border-white/20">
              <div className="text-center lg:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">5000+</div>
                <div className="text-sm text-gray-300 font-medium">Clients satisfaits</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">48h</div>
                <div className="text-sm text-gray-300 font-medium">Livraison express</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-sm text-gray-300 font-medium">Authentique</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
          <div className="w-7 h-12 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="container-app px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Truck,
                title: "Livraison Rapide",
                description: "Partout au Cameroun en 48-72h",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: ShieldCheck,
                title: "Qualité Premium",
                description: "100% authentique et certifié",
                color: "from-green-500 to-green-600"
              },
              {
                icon: Headphones,
                title: "Support Dédié",
                description: "Service client 7j/7 sur WhatsApp",
                color: "from-purple-500 to-purple-600"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-app px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-100 rounded-full px-4 py-1.5 mb-5">
              <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
              <span className="text-xs font-bold text-yellow-700 uppercase tracking-wider">Top ventes</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Produits <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">Vedettes</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Les incontournables de la saison
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <>
              <ProductGrid products={featuredProducts} />
              <div className="mt-12 text-center">
                <Link href="/products">
                  <Button variant="outline" size="lg" className="px-8 py-3">
                    Voir toute la collection
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">Aucun produit vedette disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white">
        <div className="container-app px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">Collections</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Des styles uniques pour chaque occasion, pensés pour révéler votre personnalité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                name: "Homme",
                href: "/products?category=homme",
                image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop",
                color: "from-blue-900/80 to-blue-900/40",
                items: "45+ modèles",
                description: "Élégance et confort"
              },
              {
                name: "Femme",
                href: "/products?category=femme",
                image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800",
                color: "from-pink-900/80 to-pink-900/40",
                items: "52+ modèles",
                description: "Style et tendance"
              },
              {
                name: "Enfant",
                href: "/products?category=enfant",
                image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800",
                color: "from-teal-900/80 to-teal-900/40",
                items: "28+ modèles",
                description: "Confort et durabilité"
              }
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <Image
                  src={category.image}
                  alt={`Collection ${category.name}`}
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} to-transparent`} />

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-0 group-hover:-translate-y-3 transition-transform duration-300">
                  <h3 className="text-4xl font-black text-white mb-2">{category.name}</h3>
                  <p className="text-white/90 text-sm mb-1">{category.description}</p>
                  <p className="text-yellow-300 text-sm font-semibold mb-4">{category.items}</p>
                  <span className="inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
                    Découvrir
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Bannière promotionnelle */}
          <div className="mt-20 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 rounded-2xl p-10 text-center text-white shadow-xl">
            <h3 className="text-3xl sm:text-4xl font-bold mb-3">Livraison Offerte</h3>
            <p className="text-yellow-100 text-lg mb-6">Pour toute commande supérieure à 50 000 FCFA</p>
            <Link href="/products">
              <Button className="bg-white text-yellow-600 hover:bg-gray-100 px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl">
                Profiter de l'offre
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}