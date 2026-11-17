"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D9]">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo / Nom de la marque */}
        <Link href="/" className="flex items-center gap-3.5 py-2 group">
          <img
            src="/images/logo-maison.png"
            alt="Monogramme Love of Candlestick"
            className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-serif text-xl md:text-2xl tracking-wide text-[#1E1B18] transition-colors duration-300 group-hover:text-amber-700 leading-none">
              Love of Candlestick
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#B47B38] font-medium mt-1.5">
              Maison de l&apos;Artisanat de l&apos;Encens
            </span>
          </div>
        </Link>

        {/* Liens de navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className="text-[#575049] hover:text-[#B47B38] transition-colors duration-200"
          >
            Accueil
          </Link>
          <Link
            href="/boutique"
            className="text-[#575049] hover:text-[#B47B38] transition-colors duration-200"
          >
            Créations
          </Link>
          <Link
            href="/a-propos"
            className="text-[#575049] hover:text-[#B47B38] transition-colors duration-200"
          >
            L&apos;Atelier
          </Link>
        </nav>

        {/* Bouton Panier dynamique */}
        <div className="flex items-center gap-4">
          <Link
            href="/panier"
            className="px-4 py-2 rounded-full border border-[#D6CEC2] text-sm font-medium text-[#1E1B18] hover:border-[#B47B38] hover:text-[#B47B38] transition-colors duration-200 flex items-center gap-2"
          >
            <span>Panier</span>
            <span className="bg-[#B47B38] text-white text-xs px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
