import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Stock from "@/models/Stock";
import { formatPrice } from "@/lib/utils";
import AddToCartForm from "./AddToCartForm";
import ProductGallery from "@/components/products/ProductGallery";


interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    await connectDB();
    const [product, stockData] = await Promise.all([
      Product.findById(id).lean(),
      Stock.find({ productId: id }).lean()
    ]);

    if (!product) return null;
    
    // Sum up stock for backward compatibility in UI
    const totalStock = stockData.reduce((sum, s) => sum + s.quantity, 0);

    return {
      ...product,
      _id: product._id.toString(),
      stock: totalStock, // Virtual field for UI
      stockEntries: stockData.map(s => ({ 
        size: s.size, 
        quantity: s.quantity,
        price: s.price
      })),
      createdAt: (product.createdAt as Date).toISOString(),
      updatedAt: (product.updatedAt as Date)?.toISOString(),
    } as any;

  } catch (error) {
    console.error("Error fetching product", error);
    return null;
  }
}


export default async function ProductPage({ params }: ProductPageProps) {
  // Await the params promise in Next.js 15
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (

    <div className="bg-[#FAFAFA] min-h-[calc(100vh-80px)] py-8 md:py-12">
      <div className="container-app">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm mb-8 text-gray-500 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors">Accueil</Link>
          <ChevronRight className="h-4 w-4 mx-1 shrink-0" />
          <Link href="/products" className="hover:text-[#D4AF37] transition-colors">Catalogue</Link>
          <ChevronRight className="h-4 w-4 mx-1 shrink-0" />
          <Link href={`/products?category=${product.category}`} className="hover:text-[#D4AF37] transition-colors capitalize">
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4 mx-1 shrink-0" />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {/* Image Section (Interactive Gallery) */}
            <ProductGallery images={product.images || []} productName={product.name} />

            {/* Content Section */}
            <div className="flex flex-col">
              {product.stock <= 0 && (
                <span className="inline-block bg-red-100 text-red-600 text-xs font-bold uppercase px-3 py-1 rounded-full w-fit mb-4">
                  Rupture de stock
                </span>
              )}
              
              <p className="text-sm text-[#D4AF37] font-bold uppercase tracking-widest mb-2">
                {product.category}
              </p>
              
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight mb-4">
                {product.name}
              </h1>
              
              <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
                <p>{product.description || "Aucune description détaillée n'est disponible pour ce produit."}</p>
              </div>


              {/* Add to Cart form (Client Component) */}
              <AddToCartForm product={product} />

              {/* Product details */}
              <div className="mt-10 pt-8 border-t border-gray-100 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Disponibilité :</span>
                  <span className={`font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                    {product.stock > 0 ? `${product.stock} en stock` : "Épuisé"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Expédition :</span>
                  <span className="font-medium text-gray-900">1 à 3 jours ouvrés</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Paiement :</span>
                  <span className="font-medium text-gray-900">A la livraison</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
