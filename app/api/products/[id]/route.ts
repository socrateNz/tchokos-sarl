import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Stock from "@/models/Stock";
import { deleteImage } from "@/lib/cloudinary";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const { id } = await params;
    
    const [product, stockEntries] = await Promise.all([
      Product.findById(id).lean(),
      Stock.find({ productId: id }).lean()
    ]);

    if (!product) {
      return Response.json({ message: "Produit introuvable" }, { status: 404 });
    }

    return Response.json({
      ...product,
      stockEntries: stockEntries.map(s => ({ 
        size: s.size, 
        quantity: s.quantity,
        price: s.price
      }))
    });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return Response.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const { id } = await params;
    const { stockEntries, ...productData } = await request.json();

    // 1. Update Product
    const product = await Product.findByIdAndUpdate(id, productData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return Response.json({ message: "Produit introuvable" }, { status: 404 });
    }

    // 2. Sync Stock Entries (Clear and Re-insert)
    if (stockEntries && Array.isArray(stockEntries)) {
      await Stock.deleteMany({ productId: id });
      const stockData = stockEntries.map((entry: any) => ({
        productId: id,
        size: entry.size,
        quantity: entry.quantity || 0,
        price: entry.price || 0
      }));
      await Stock.insertMany(stockData);
    }



    return Response.json(product);
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return Response.json({ message: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const { id } = await params;

    // 1. Find and delete product
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return Response.json({ message: "Produit introuvable" }, { status: 404 });
    }

    // 2. Delete associated stock entries
    await Stock.deleteMany({ productId: id });

    // 3. Delete images from Cloudinary
    await Promise.allSettled(
      (product.images || []).map((url: string) => deleteImage(url))
    );

    return Response.json({ message: "Produit supprimé" });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return Response.json({ message: "Erreur lors de la suppression" }, { status: 500 });
  }
}

