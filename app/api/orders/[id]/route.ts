import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const { id } = await params;
    const order = await Order.findById(id).lean();
    if (!order) {
      return Response.json({ message: "Commande introuvable" }, { status: 404 });
    }
    return Response.json(order);
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return Response.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const { id } = await params;
    const { status } = await request.json();

    if (!["pending", "confirmed", "delivered"].includes(status)) {
      return Response.json({ message: "Statut invalide" }, { status: 400 });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return Response.json({ message: "Commande introuvable" }, { status: 404 });
    }

    return Response.json(order);
  } catch (error) {
    console.error("PUT /api/orders/[id] error:", error);
    return Response.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const { id } = await params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return Response.json({ message: "Commande introuvable" }, { status: 404 });
    }

    return Response.json({ message: "Commande supprimée" });
  } catch (error) {
    console.error("DELETE /api/orders/[id] error:", error);
    return Response.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
