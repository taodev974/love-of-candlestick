"use client";

import AddToCartButton from "@/components/AddToCartButton";
import { useState } from "react";
import Link from "next/link";

interface ProductType {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
}

const CATEGORIES = [
  { id: "all", label: "Toutes les pièces" },
  { id: "bougeoir", label: "Bougeoirs" },
  { id: "porte-encens", label: "Porte-encens" },
  { id: "boite-a-mouchoirs", label: "Boîtes à mouchoirs" },
  { id: "boite-a-bijoux", label: "Boîtes à bijoux" },
  { id: "autre", label: "Autres créations" },
];

export default function BoutiqueClient({
  initialProducts,
}: {
  initialProducts: ProductType[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Sécurise pour s'assurer que initialProducts est bien un tableau
  const productsList = Array.isArray(initialProducts) ? initialProducts : [];

  const filteredProducts = productsList.filter((product) => {
    if (selectedCategory === "all") return true;

    // Gère aussi bien 'boite-a-mouchoir' que 'boite-a-mouchoirs' par sécurité
    if (selectedCategory === "boite-a-mouchoir") {
      return (
        product.category === "boite-a-mouchoir" ||
        product.category === "boite-a-mouchoirs"
      );
    }

    return product.category === selectedCategory;
  });
  return (
    <div className="space-y-10">
      {/* Barre de filtres par catégorie */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm transition-all duration-200 ${
                isActive
                  ? "bg-[#1E1B18] text-[#FAF8F5] shadow-sm font-medium"
                  : "bg-white text-[#6E665F] border border-[#E8E2D9] hover:border-[#B47B38] hover:text-[#1E1B18]"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Compteur discret */}
      <div className="text-center text-xs text-[#6E665F]">
        {filteredProducts.length}{" "}
        {filteredProducts.length > 1
          ? "créations affichées"
          : "création affichée"}
      </div>

      {/* Grille des créations */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E2D9] max-w-lg mx-auto px-6">
          <p className="font-serif text-xl text-[#1E1B18] mb-2">
            Aucune pièce dans cette catégorie pour le moment
          </p>
          <p className="text-sm text-[#6E665F]">
            Sabine travaille sans doute sur de nouvelles créations dans son
            atelier. Revenez très vite !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#E8E2D9] hover:border-[#B47B38]/50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col"
            >
              {/* Image de la création */}
              <Link
                href={`/boutique/${product._id}`}
                className="relative aspect-[4/5] bg-[#F3EFEA] overflow-hidden block"
              >
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm italic text-[#6E665F]">
                    Photo à venir
                  </div>
                )}
              </Link>

              {/* Détails de la carte */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-widest text-[#B47B38] font-semibold">
                    {product.category.replace(/-/g, " ")}
                  </span>
                  <Link href={`/boutique/${product._id}`}>
                    <h2 className="font-serif text-xl text-[#1E1B18] group-hover:text-[#B47B38] transition-colors line-clamp-2">
                      {product.name}
                    </h2>
                  </Link>
                  <p className="text-sm text-[#6E665F] line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#FAF8F5] flex items-center justify-between">
                  <span className="font-serif text-lg font-medium text-[#1E1B18]">
                    {product.price.toFixed(2)} €
                  </span>
                  <AddToCartButton product={product} variant="compact" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
