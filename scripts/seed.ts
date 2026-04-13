import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables directly from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

// Have to import schemas manually since this runs outside Next.js environment
import Product from "../models/Product";
import Admin from "../models/Admin";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

async function seed() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(MONGODB_URI as string, { dbName: "tchokos" });
    console.log("Connected.");

    // ======== 1. ADMIN SEED ========
    console.log("Seeding Admin account...");
    const existingAdmin = await Admin.findOne({ email: "admin@tchokos.com" });
    if (!existingAdmin) {
      await Admin.create({
        email: "admin@tchokos.com",
        password: "password123",
      });
      console.log("Admin account created (admin@tchokos.com / password123)");
    } else {
      console.log("Admin account already exists.");
    }

    // ======== 2. PRODUCT SEED ========
    console.log("Seeding Demo Products...");
    const existingProductsCount = await Product.countDocuments();

    if (existingProductsCount === 0) {
      const demoProducts = [
        {
          name: "Sneakers Air Premium Noir",
          description: "Des sneakers confortables et élégantes idéales pour le quotidien et les sorties.",
          price: 35000,
          images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"],
          sizes: ["40", "41", "42", "43", "44"],
          stock: 15,
          category: "homme",
          isFeatured: true,
        },
        {
          name: "Mocassins Cuir Véritable Classique",
          description: "Mocassins en cuir véritable pour des occasions formelles ou professionnelles.",
          price: 45000,
          images: ["https://images.unsplash.com/photo-1614252339460-e1f13bce44bf?w=800&q=80"],
          sizes: ["41", "42", "43"],
          stock: 8,
          category: "homme",
          isFeatured: false,
        },
        {
          name: "Escarpins Dorés Soirée",
          description: "L'élégance à l'état pur. Parfaits pour vos galas et cérémonies.",
          price: 28000,
          images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"],
          sizes: ["37", "38", "39", "40"],
          stock: 12,
          category: "femme",
          isFeatured: true,
        },
        {
          name: "Baskets Enfant Flash",
          description: "Robustes et légères, conçues pour les enfants actifs.",
          price: 18000,
          images: ["https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80"],
          sizes: ["28", "29", "30", "31", "32"],
          stock: 20,
          category: "enfant",
          isFeatured: false,
        },
        {
          name: "Sac à Main Luxe Noir",
          description: "Un sac à main élégant pour sublimer toutes vos tenues chic.",
          price: 32000,
          images: ["https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80"],
          sizes: ["Standard"],
          stock: 5,
          category: "accessoires",
          isFeatured: true,
        }
      ];

      await Product.insertMany(demoProducts);
      console.log(`${demoProducts.length} demo products inserted.`);
    } else {
      console.log(`Database already has ${existingProductsCount} products. Skipping.`);
    }

    console.log("Database seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

seed();
