import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Stock from "@/models/Stock";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    return Response.json({
      orders,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return Response.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { items } = body;

    // 1. Validation & Stock check
    for (const item of items) {
      const stockEntry = await Stock.findOne({ 
        productId: item.productId, 
        size: item.size 
      });

      if (!stockEntry || stockEntry.quantity < item.quantity) {
        return Response.json(
          { message: `Stock insuffisant pour ${item.name} (Taille: ${item.size})` },
          { status: 400 }
        );
      }
    }

    // 2. Decrement Stock
    for (const item of items) {
      await Stock.updateOne(
        { productId: item.productId, size: item.size },
        { $inc: { quantity: -item.quantity } }
      );
    }

    // 3. Create Order
    const totalAmount = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    ) || 0;

    const order = await Order.create({ ...body, totalAmount });
    
    return Response.json(order, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return Response.json({ message: "Erreur lors de la création de la commande" }, { status: 500 });
  }
}

