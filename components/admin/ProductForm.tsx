"use client";

import { useState, useRef } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { X, Upload, Plus, Trash2, Loader2, Image as ImageIcon, Package } from "lucide-react";
import toast from "react-hot-toast";
import axios from "@/lib/axios";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface ProductFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    category: initialData?.category || "homme",
    isFeatured: initialData?.isFeatured || false,
    images: initialData?.images || [],
    stockEntries: initialData?.stockEntries || [],
  });

  const [newSize, setNewSize] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const form = new FormData();
      form.append("file", file);
      try {
        const { data } = await axios.post("/api/upload", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return data.url;
      } catch (error) {
        toast.error(`Erreur upload: ${file.name}`);
        return null;
      }
    });

    const urls = (await Promise.all(uploadPromises)).filter(url => url !== null);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] as any }));
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index),
    }));
  };

  const addSize = () => {

    const size = newSize.trim();
    if (!size) return;
    if (formData.stockEntries.some((s: any) => s.size === size)) {
      toast.error("Cette taille existe déjà");
      return;
    }
    setFormData(prev => ({
      ...prev,
      stockEntries: [...prev.stockEntries, { size, quantity: 0, price: formData.price }]
    }));
    setNewSize("");
  };

  const removeSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      stockEntries: prev.stockEntries.filter((s: any) => s.size !== size),
    }));
  };

  const updateSizeField = (size: string, field: "quantity" | "price", value: number) => {
    setFormData(prev => ({
      ...prev,
      stockEntries: prev.stockEntries.map((s: any) =>
        s.size === size ? { ...s, [field]: value } : s
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      toast.error("Veuillez ajouter au moins une image");
      return;
    }

    if (formData.stockEntries.length > 0 && formData.stockEntries.some((s: any) => s.price <= 0)) {
      toast.error("Veuillez définir un prix pour chaque taille");
      return;
    }

    setLoading(true);

    // Prepare data for API
    const submissionData = {
      ...formData,
      sizes: formData.stockEntries.map((s: any) => s.size),
    };

    try {
      await onSubmit(submissionData);
      toast.success(initialData ? "Produit mis à jour" : "Produit créé");
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - General Info */}
        <div className="space-y-5">
          <Input
            label="Nom du produit"
            placeholder="ex: Sneakers Air Pro"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col justify-center">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Stock Global</label>
              <div className="h-11 px-4 flex items-center bg-gray-100 rounded-xl text-gray-500 font-bold text-sm">
                {formData.stockEntries.reduce((sum: number, s: any) => sum + s.quantity, 0)} unités
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Prix Moyen</label>
              <div className="h-11 px-4 flex items-center bg-gray-100 rounded-xl text-gray-500 font-bold text-sm">
                {formData.stockEntries.length > 0
                  ? formatPrice(formData.stockEntries.reduce((sum: number, s: any) => sum + s.price, 0) / formData.stockEntries.length)
                  : "N/A"
                }
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-sans">
              Catégorie
            </label>
            <select
              className="w-full h-11 px-4 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:border-[#D4AF37] focus:bg-white outline-none transition-all duration-200 text-gray-900 font-sans appearance-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            >
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="enfant">Enfant</option>
              <option value="accessoires">Accessoires</option>
            </select>
          </div>

          <div className="p-5 bg-gray-50 border border-gray-100 rounded-3xl space-y-4">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
              Gestion Stock & Prix par Taille
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Taille (ex: 42, XL...)"
                className="flex-1 h-10 px-4 rounded-xl border-2 border-white bg-white shadow-sm focus:border-[#D4AF37] outline-none text-sm font-bold"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSize())}
              />
              <button
                type="button"
                onClick={addSize}
                className="w-10 h-10 rounded-xl bg-[#D4AF37] text-black flex items-center justify-center hover:bg-[#B8962E] transition-colors shadow-lg shadow-[#D4AF37]/20"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {formData.stockEntries.map((entry: any) => (
                <div key={entry.size} className="flex gap-2 p-2 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-[#D4AF37]/30">
                  <div className="w-12 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center text-xs font-black shrink-0">
                    {entry.size}
                  </div>
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <input
                      type="number"
                      placeholder="Qté"
                      title="Quantité en stock"
                      className="w-full h-10 px-3 bg-gray-50 rounded-xl text-[11px] font-bold outline-none focus:ring-2 ring-[#D4AF37]/20"
                      value={entry.quantity}
                      onChange={(e) => updateSizeField(entry.size, "quantity", Number(e.target.value))}
                      min={0}
                    />
                    <input
                      type="number"
                      placeholder="Prix"
                      title="Prix spécifique"
                      className="w-full h-10 px-3 bg-gray-50 rounded-xl text-[11px] font-bold outline-none focus:ring-2 ring-green-100 text-green-700"
                      value={entry.price}
                      onChange={(e) => updateSizeField(entry.size, "price", Number(e.target.value))}
                      min={0}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSize(entry.size)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {formData.stockEntries.length === 0 && (
                <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                  <Package className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 font-medium font-sans">Ajoutez des tailles pour gérer le stock</p>
                </div>
              )}
            </div>
          </div>


          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <input
              type="checkbox"
              id="isFeatured"
              className="w-5 h-5 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
              Mettre en avant (Vedette)
            </label>
          </div>
        </div>

        {/* Right Column - Description & Images */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-sans">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:border-[#D4AF37] focus:bg-white outline-none transition-all duration-200 text-gray-900 font-sans min-h-[120px]"
              placeholder="Décrivez votre produit..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
              Images du produit
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {formData.images.map((url: string, i: number) => (
                <div key={i} className="aspect-square relative rounded-xl overflow-hidden group shadow-sm ring-1 ring-gray-100">
                  <Image src={url} alt={`Preview ${i}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-200 group"
              >
                {uploading ? (
                  <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin" />
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors">
                      <Upload className="w-4 h-4 text-gray-400 group-hover:text-[#D4AF37]" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#D4AF37] uppercase tracking-wider">Ajouter</span>
                  </>
                )}
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              multiple
              accept="image/*"
              className="hidden"
            />
            <p className="text-[10px] text-gray-400 text-center">Format: JPG, PNG, WEBP (Max 5MB)</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="outline" type="button" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? "Enregistrer" : "Créer le produit"}
        </Button>
      </div>
    </form>
  );
}
