"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/login", { email, password });
      toast.success("Connexion réussie");
      router.push("/admin");
    } catch {
      toast.error("Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <span className="text-black font-black text-lg">T</span>
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight">TCHOKOS</span>
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 text-center mb-2">
            Espace Administrateur
          </h1>
          <p className="text-gray-500 text-sm text-center mb-8">
            Connectez-vous pour gérer votre boutique
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              id="email"
              type="email"
              label="Adresse Email"
              placeholder="admin@tchokos.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              type="password"
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="pt-2">
              <Button type="submit" fullWidth size="lg" loading={loading}>
                Se connecter
              </Button>
            </div>
          </form>
        </div>
        <div className="bg-gray-50 p-4 border-t border-gray-100 text-center text-xs text-gray-500">
          Accès restreint au personnel autorisé
        </div>
      </div>
    </div>
  );
}
