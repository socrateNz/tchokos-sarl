import connectDB from "./mongodb";
import Product from "@/models/Product";
import Stock from "@/models/Stock";
import { Product as ProductType, StockEntry as StockEntryType } from "@/types";

export async function getFeaturedProducts() {
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
    })) as unknown as ProductType[];
  } catch (error) {
    console.error("Error fetching featured products", error);
    return [];
  }
}

export async function getStockEntries() {
  try {
    await connectDB();
    const stockEntries = await Stock.find({}).lean();
    return stockEntries.map(entry => ({
      ...entry,
      _id: (entry as any)._id.toString()
    })) as unknown as StockEntryType[];
  } catch (error) {
    console.error("Error fetching stock entries", error);
    return [];
  }
}

export async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
  try {
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
    })) as unknown as ProductType[];
  } catch (error) {
    console.error("Error fetching products", error);
    return [];
  }
}
