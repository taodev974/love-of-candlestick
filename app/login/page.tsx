"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Force le rechargement complet avec le nouveau cookie
        window.location.href = "/admin";
      } else {
        setError("Mot de passe incorrect.");
      }
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[75vh] bg-[#FAF8F5] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#B47B38] font-semibold">
            Accès Réservé
          </span>
          <h1 className="font-serif text-3xl text-[#1E1B18]">Espace Atelier</h1>
          <p className="text-sm text-[#6E665F]">
            Veuillez saisir votre mot de passe pour gérer le catalogue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe de l'atelier"
              required
              className="w-full px-4 py-3 rounded-xl border border-[#D6CEC2] focus:outline-none focus:border-[#B47B38] text-[#1E1B18]"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E1B18] text-[#FAF8F5] py-3.5 rounded-full font-medium hover:bg-[#B47B38] transition-colors disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Entrer dans l'atelier"}
          </button>
        </form>
      </div>
    </div>
  );
}
