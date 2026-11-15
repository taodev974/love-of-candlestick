"use client";

import { useEffect, useState } from "react";
import BoutiqueClient from "./BoutiqueClient";

export default function BoutiquePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Erreur lors du chargement des créations :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1B18] py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* En-tête poétique de la boutique */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#B47B38] font-semibold">
            L&apos;Atelier &amp; Ses Œuvres
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1E1B18]">
            Toutes les Créations
          </h1>
          <p className="text-sm md:text-base text-[#6E665F] leading-relaxed">
            Chaque pièce est façonnée à la main avec patience et passion.
            Explorez nos collections uniques pour illuminer et apaiser votre
            intérieur.
          </p>
        </div>

        {/* Affichage du chargement ou de la grille interactive */}
        {loading ? (
          <div className="text-center py-20 text-[#6E665F]">
            Chargement des créations de l&apos;atelier...
          </div>
        ) : (
          <BoutiqueClient initialProducts={products} />
        )}
      </div>
    </div>
  );
}
