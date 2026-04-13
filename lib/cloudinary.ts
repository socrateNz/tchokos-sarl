import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a base64 image or URL to Cloudinary
 */
export async function uploadImage(
  file: string,
  folder = "tchokos/products"
): Promise<string> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    transformation: [
      { quality: "auto", fetch_format: "webp" },
      { width: 1200, height: 1200, crop: "limit" },
    ],
  });
  return result.secure_url;
}

/**
 * Delete an image from Cloudinary by URL or public_id
 */
export async function deleteImage(publicIdOrUrl: string): Promise<void> {
  let publicId = publicIdOrUrl;

  // Extract public_id from URL if needed
  if (publicIdOrUrl.startsWith("http")) {
    const parts = publicIdOrUrl.split("/");
    const uploadIdx = parts.indexOf("upload");
    if (uploadIdx !== -1) {
      const pathParts = parts.slice(uploadIdx + 2); // skip version
      publicId = pathParts
        .join("/")
        .replace(/\.[^/.]+$/, ""); // remove extension
    }
  }

  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
