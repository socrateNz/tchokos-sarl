import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { message: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return Response.json(
        { message: "Identifiants incorrects" },
        { status: 401 }
      );
    }
    const isValid = await admin.comparePassword(password);
    if (!isValid) {
      return Response.json(
        { message: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    const token = await signToken({ id: String(admin._id), email: admin.email });

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return Response.json({
      message: "Connexion réussie",
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return Response.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
