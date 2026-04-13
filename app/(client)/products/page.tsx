import { Suspense } from "react";
import ProductGrid from "@/components/products/ProductGrid";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// For Next.js 15, searchParams in a page component is a Promise
interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
  await connectDB();
  
  const category = searchParams.category as string;
  const minPrice = searchParams.minPrice as string;
  const maxPrice = searchParams.maxPrice as string;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = {};
  if (category && category !== "all") filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .lean();
    
  return products.map(p => ({
    ...p,
    _id: p._id.toString(),
    createdAt: (p.createdAt as Date).toISOString(),
    updatedAt: (p.updatedAt as Date)?.toISOString(),
  })) as unknown as import("@/types").Product[];
}

const CATEGORIES = [
  { id: "all", label: "Toutes les catégories" },
  { id: "homme", label: "Homme" },
  { id: "femme", label: "Femme" },
  { id: "enfant", label: "Enfant" },
  { id: "accessoires", label: "Accessoires" },
];

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Await the searchParams promise in Next.js 15
  const params = await searchParams;
  const currentCategory = (params.category as string) || "all";
  const products = await getProducts(params);

  return (
    <div className="bg-[#FAFAFA] min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="container-app">
          <div className="flex items-center text-sm mb-4 text-gray-500">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-gray-900">Catalogue</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Notre Catalogue</h1>
        </div>
      </div>

      <div className="container-app py-10 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white p-6 rounded-xl border border-gray-100 sticky top-24">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Catégories</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products${cat.id === "all" ? "" : `?category=${cat.id}`}`}
                    className={`block py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                      currentCategory === cat.id
                        ? "bg-[#D4AF37] text-black"
                        : "text-gray-600 hover:text-black hover:bg-gray-50"
                    }`}
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100">
            <p className="text-sm font-medium text-gray-600">
              <span className="font-bold text-gray-900">{products.length}</span> produit(s) trouvé(s)
            </p>
          </div>
          
          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <ProductGrid products={products} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
