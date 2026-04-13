import { NextRequest } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ message: "Fichier manquant" }, { status: 400 });
    }

    // Convert File to base64 data URL
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const url = await uploadImage(base64);
    return Response.json({ url });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return Response.json({ message: "Erreur upload" }, { status: 500 });
  }
}
