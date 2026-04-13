"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ProductForm from "@/components/admin/ProductForm";
import { Plus, Edit, Trash2, Loader2, AlertCircle, ImageIcon } from "lucide-react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deletingProduct, setDeletingProduct] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products?limit=100");
      setProducts(data.products);
    } catch (error) {
      toast.error("Erreur de chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (product: any) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, formData);
      } else {
        await axios.post("/api/products", formData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      throw error;
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    setSubmitting(true);
    try {
      await axios.delete(`/api/products/${deletingProduct._id}`);
      toast.success("Produit supprimé");
      setIsDeleteModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-gray-500 mt-1">Gérez votre catalogue d'articles</p>
        </div>
        <Button onClick={handleOpenCreate} className="shrink-0 gap-2">
          <Plus className="w-4 h-4" /> Ajouter un produit
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Produit</th>
                <th className="px-6 py-4 font-medium">Prix</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Catégorie</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#D4AF37] mb-2" />
                    <p className="text-gray-400">Chargement du catalogue...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Aucun produit dans le catalogue.</p>
                    <button onClick={handleOpenCreate} className="text-[#D4AF37] mt-2 font-medium hover:underline">
                      Créer votre premier article
                    </button>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative shrink-0">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {product.isFeatured && (
                              <span className="text-[9px] bg-[#D4AF37] text-white font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">Vedette</span>
                            )}
                            <span className="text-[10px] text-gray-400 font-medium">ID: #{product._id.substring(18)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-bold">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${product.stock > 10 ? "bg-green-100 text-green-700" :
                            product.stock > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                          }`}>
                          {product.stock} en stock
                        </span>
                        {product.stock === 0 && <span className="text-[9px] text-red-500 font-bold ml-1">Rupture</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[11px] font-bold uppercase tracking-tight">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-xl transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(product)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Modifier le produit" : "Ajouter un produit"}
      >
        <ProductForm
          initialData={editingProduct}
          onCancel={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmer la suppression"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
            <AlertCircle className="w-8 h-8 shrink-0" />
            <p className="text-sm">
              Êtes-vous sûr de vouloir supprimer <strong>{deletingProduct?.name}</strong> ?
              Cette action est irréversible et supprimera également les images de Cloudinary.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-200"
              onClick={handleDeleteProduct}
              loading={submitting}
            >
              Supprimer définitivement
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

