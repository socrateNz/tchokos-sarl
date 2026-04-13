import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { startOfDay, subDays, endOfDay, format } from "date-fns";


export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = request.nextUrl;
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    let dateFilter: any = {};
    if (fromParam && toParam) {
      dateFilter = {
        createdAt: {
          $gte: startOfDay(new Date(fromParam)),
          $lte: endOfDay(new Date(toParam))
        }
      };
    } else {
      // Default to last 30 days if no range provided
      dateFilter = {
        createdAt: { $gte: startOfDay(subDays(new Date(), 29)) }
      };
    }

    // 1. Overall Stats (Revenue only for delivered/cashed orders)
    const [totalProducts, totalOrders, revenueData, pendingRevenueData] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(dateFilter),
      Order.aggregate([
        { $match: { ...dateFilter, status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Order.aggregate([
        { $match: { ...dateFilter, status: "confirmed" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ])
    ]);

    const totalRevenue = revenueData[0]?.total || 0;
    const pendingRevenue = pendingRevenueData[0]?.total || 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // 2. Revenue History (Filtered by date range and status: delivered)
    const revenueHistoryRaw = await Order.aggregate([
      {
        $match: {
          ...dateFilter,
          status: "delivered"
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format revenue history for the chart
    // If a range is provided, we should ideally fill gaps between from and to.
    // For simplicity, we'll return the raw grouped data if it's a custom range, 
    // or fill 30 days if it's the default.
    let revenueHistory = [];
    if (fromParam && toParam) {
       revenueHistory = revenueHistoryRaw.map(item => ({
         date: format(new Date(item._id), "dd/MM"),
         revenue: item.revenue,
         orders: item.orders
       }));
    } else {
      for (let i = 0; i < 30; i++) {
        const date = format(subDays(new Date(), 29 - i), "yyyy-MM-dd");
        const found = revenueHistoryRaw.find(item => item._id === date);
        revenueHistory.push({
          date: format(subDays(new Date(), 29 - i), "dd/MM"),
          revenue: found ? found.revenue : 0,
          orders: found ? found.orders : 0
        });
      }
    }

    // 4. Top Products (Quantity) - Only for delivered orders
    const topProducts = await Order.aggregate([
      { $match: { ...dateFilter, status: "delivered" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 }
    ]);

    return Response.json({
      overall: {
        totalRevenue,
        pendingRevenue,
        totalOrders,
        avgOrderValue,
        totalProducts
      },
      revenueHistory,
      topProducts: topProducts.map(p => ({
        name: p._id,
        quantity: p.quantity,
        revenue: p.revenue
      }))
    });


  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return Response.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
