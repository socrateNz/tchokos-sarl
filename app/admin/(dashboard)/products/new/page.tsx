"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "homme",
    sizes: "",
    isFeatured: false,
    images: [] as string[]
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    setUploading(true);
    try {
      const res = await axios.post("/api/upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData(prev => ({ ...prev, images: [...prev.images, res.data.url] }));
      toast.success("Image ajoutée");
    } catch {
      toast.error("Erreur d'upload");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/products", {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        sizes: formData.sizes.split(",").map(s => s.trim()).filter(Boolean),
      });
      
      toast.success("Produit ajouté avec succès");
      router.push("/admin/products");
    } catch {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nouveau produit</h1>
        <p className="text-gray-500 mt-1">Ajouter un article au catalogue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
          <Input
            label="Nom du produit"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#D4AF37] focus:ring-[#D4AF37] resize-none h-32"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Input
              type="number"
              label="Prix (FCFA)"
              min="0"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <Input
              type="number"
              label="Stock disponible"
              min="0"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Catégorie</label>
              <select
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#D4AF37] focus:ring-[#D4AF37] bg-white"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="enfant">Enfant</option>
                <option value="accessoires">Accessoires</option>
              </select>
            </div>
            
            <Input
              label="Tailles (séparées par une virgule)"
              placeholder="Ex: 40, 41, 42, 43"
              value={formData.sizes}
              onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
            />
          </div>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
            />
            <span className="text-sm font-medium text-gray-700">Mettre ce produit en vedette sur l'accueil</span>
          </label>
        </div>

        {/* Images section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Images</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {formData.images.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                <Image src={url} alt={`Preview ${i}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-1 shadow-sm hover:bg-red-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <label className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
              uploading ? "border-gray-300 bg-gray-50" : "border-gray-300 hover:border-[#D4AF37] hover:bg-yellow-50/30"
            }`}>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              <UploadCloud className={`w-8 h-8 mb-2 ${uploading ? "text-gray-400" : "text-[#D4AF37]"}`} />
              <span className="text-xs font-medium text-gray-500 text-center px-2">
                {uploading ? "Upload en cours..." : "Ajouter une image"}
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={() => router.back()}>Annuler</Button>
          <Button type="submit" loading={loading}>Enregistrer le produit</Button>
        </div>
      </form>
    </div>
  );
}
