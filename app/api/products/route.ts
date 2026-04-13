import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Stock from "@/models/Stock";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = request.nextUrl;

    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const size = searchParams.get("size");
    const featured = searchParams.get("featured");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (category) filter.category = category;
    if (featured === "true") filter.isFeatured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (size) filter.sizes = { $in: [size] };

    const skip = (page - 1) * limit;
    const [productsRaw, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    // Aggregate stock and price info for each product
    const products = await Promise.all(productsRaw.map(async (p: any) => {
      const stockEntries = await Stock.find({ productId: p._id }).lean();
      
      const totalStock = stockEntries.reduce((sum, s) => sum + s.quantity, 0);
      
      // Calculate price range
      const prices = stockEntries.length > 0 
        ? stockEntries.map(s => s.price) 
        : [p.price];
      
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      return {
        ...p,
        stock: totalStock,
        minPrice,
        maxPrice,
        stockEntries: stockEntries.map(s => ({ 
          size: s.size, 
          quantity: s.quantity,
          price: s.price 
        }))
      };
    }));

    return Response.json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return Response.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { stockEntries, ...productData } = await request.json();
    
    // 1. Create Product
    const product = await Product.create(productData);
    
    // 2. Create Stock Entries with individual prices
    if (stockEntries && Array.isArray(stockEntries)) {
      const stockData = stockEntries.map((entry: any) => ({
        productId: product._id,
        size: entry.size,
        quantity: entry.quantity || 0,
        price: entry.price || 0,
      }));
      await Stock.insertMany(stockData);
    }
    
    return Response.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return Response.json({ message: "Erreur lors de la création" }, { status: 500 });
  }
}


