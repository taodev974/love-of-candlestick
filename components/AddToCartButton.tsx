"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
    stock?: number;
  };
  variant?: "full" | "compact";
}

export default function AddToCartButton({
  product,
  variant = "compact",
}: AddToCartButtonProps) {
  const { cart, addToCart } = useCart();
  const [feedback, setFeedback] = useState<"added" | "max" | null>(null);

  const maxStock = product.stock ?? 1;
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  // Vérifier combien d'exemplaires de ce produit sont déjà dans le panier
  const itemInCart = cart.find((item) => item.id === product._id);
  const currentQtyInCart = itemInCart ? itemInCart.quantity : 0;
  const isMaxReached = currentQtyInCart >= maxStock;

  const handleAdd = () => {
    if (isOutOfStock) return;

    if (isMaxReached) {
      setFeedback("max");
      setTimeout(() => setFeedback(null), 2500);
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      images: product.images,
      stock: maxStock,
    });
    setFeedback("added");
    setTimeout(() => setFeedback(null), 2000);
  };

  // Styles selon la taille demandée (compact pour les cartes, full pour la fiche produit)
  const sizeClasses =
    variant === "compact"
      ? "px-4 py-2 text-xs whitespace-nowrap"
      : "w-fullbloc py-4 px-8 text-sm tracking-wide font-semibold";

  // Texte dynamique du bouton
  let label = "Ajouter au panier";
  if (isOutOfStock) {
    label =
      variant === "compact" ? "Épuisé" : "Victime de son succès (Rupture)";
  } else if (feedback === "added") {
    label = "✓ Ajouté";
  } else if (feedback === "max" || isMaxReached) {
    label = maxStock === 1 ? "Pièce unique au panier" : "Stock max atteint";
  }

  // Couleurs dynamiques
  let colorClasses =
    variant === "compact"
      ? "bg-[#FAF8F5] text-[#1E1B18] border border-[#D6CEC2] hover:bg-[#1E1B18] hover:text-white hover:border-[#1E1B18]"
      : "bg-[#1E1B18] text-[#FAF8F5] hover:bg-[#B47B38]";

  if (isOutOfStock) {
    colorClasses = "bg-[#E8E2D9] text-[#8C8275] cursor-not-allowed";
  } else if (feedback === "added") {
    colorClasses = "bg-emerald-700 text-white border border-emerald-700";
  } else if (feedback === "max" || isMaxReached) {
    colorClasses = "bg-[#F2EDE4] text-[#B47B38] border border-[#B47B38]/40";
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={isOutOfStock}
      className={`rounded-full font-medium transition-colors shadow-sm text-center ${sizeClasses} ${colorClasses}`}
    >
      {label}
    </button>
  );
}
