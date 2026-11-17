"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice } =
    useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
        <h1 className="font-serif text-3xl text-[#1E1B18]">
          Votre panier est vide
        </h1>
        <p className="text-[#6E665F] text-sm max-w-md mx-auto">
          Il semble que vous n'ayez pas encore craqué pour l'une des créations
          uniques de Sabine.
        </p>
        <div className="pt-4">
          <Link
            href="/boutique"
            className="inline-block bg-[#1E1B18] text-[#FAF8F5] px-8 py-3.5 rounded-xl font-medium hover:bg-[#B47B38] transition-colors shadow-sm"
          >
            Découvrir les créations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="border-b border-[#E8E2D9] pb-6">
        <span className="text-xs uppercase tracking-widest text-[#B47B38] font-semibold">
          Votre sélection
        </span>
        <h1 className="font-serif text-3xl text-[#1E1B18] mt-1">Mon Panier</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#E8E2D9] shadow-sm"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl border border-[#E6DFD7]"
                />
              ) : (
                <div className="w-20 h-20 bg-[#FAF8F5] rounded-xl flex items-center justify-center text-xs text-[#6E665F]">
                  Image
                </div>
              )}

              <div className="flex-grow">
                <h3 className="font-serif font-medium text-[#1E1B18]">
                  {item.name}
                </h3>
                <p className="text-sm font-semibold text-[#B47B38] mt-1">
                  {item.price.toFixed(2)} €
                </p>
              </div>

              {/* Gestion des quantités (souvent 1 pour des pièces uniques) */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#6E665F]">
                  Qté : {item.quantity}
                </span>
              </div>

              {/* Supprimer */}
              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                className="text-[#C0392B] hover:text-red-700 p-2 text-sm font-medium"
                title="Retirer l'article"
              >
                ✕
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-[#6E665F] hover:text-[#C0392B] underline"
            >
              Vider le panier
            </button>
            <Link
              href="/boutique"
              className="text-xs text-[#B47B38] font-medium hover:underline"
            >
              ← Continuer mes achats
            </Link>
          </div>
        </div>

        {/* Résumé de la commande */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] space-y-6 h-fit shadow-sm">
          <h2 className="font-serif text-lg text-[#1E1B18] border-b border-[#FAF8F5] pb-3">
            Récapitulatif
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-[#6E665F]">
              <span>Sous-total</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-[#6E665F]">
              <span>Livraison</span>
              <span>Calculée à l&apos;étape de paiement</span>
            </div>
            <div className="border-t border-[#FAF8F5] pt-3 flex justify-between font-bold text-base text-[#1E1B18]">
              <span>Total</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              alert(
                "Bientôt raccordé à Stripe pour un paiement 100% sécurisé !",
              )
            }
            className="w-full bg-[#1E1B18] text-[#FAF8F5] py-4 rounded-xl font-medium hover:bg-[#B47B38] transition-colors shadow-sm text-center block"
          >
            Procéder au paiement
          </button>

          <p className="text-[11px] text-center text-[#8C8275]">
            🔒 Paiement sécurisé par carte bancaire (Stripe)
          </p>
        </div>
      </div>
    </div>
  );
}
