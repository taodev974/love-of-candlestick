"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D9]">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo / Nom de la marque */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-3.5 py-2 group"
        >
          <img
            src="/images/logo-maison.png"
            alt="Monogramme Love of Candlestick"
            className="h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-serif text-lg md:text-2xl tracking-wide text-[#1E1B18] transition-colors duration-300 group-hover:text-amber-700 leading-none">
              Love of Candlestick
            </span>
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#B47B38] font-medium mt-1.5">
              Maison de l&apos;Artisanat de l&apos;Encens
            </span>
          </div>
        </Link>

        {/* Liens de navigation (Desktop) */}
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

        {/* Bouton Panier + Bouton Burger (Mobile) */}
        <div className="flex items-center gap-3">
          <Link
            href="/panier"
            onClick={closeMenu}
            className="px-3.5 py-2 rounded-full border border-[#D6CEC2] text-sm font-medium text-[#1E1B18] hover:border-[#B47B38] hover:text-[#B47B38] transition-colors duration-200 flex items-center gap-2"
          >
            <span>Panier</span>
            <span className="bg-[#B47B38] text-white text-xs px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          </Link>

          {/* Bouton Menu Burger pour Mobile/Tablette */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-[#575049] hover:text-[#B47B38] focus:outline-none transition-colors"
            aria-label="Menu"
          >
            {isOpen ? (
              // Icône Croix (Fermer)
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Icône Burger (Ouvrir)
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu Déroulant Mobile (S'affiche sous le header si isOpen est true) */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#FAF8F5] border-b border-[#E8E2D9] shadow-lg py-6 px-6 flex flex-col gap-4 transition-all">
          <Link
            href="/"
            onClick={closeMenu}
            className="text-base font-medium text-[#575049] hover:text-[#B47B38] py-2 border-b border-[#E8E2D9]/50"
          >
            Accueil
          </Link>
          <Link
            href="/boutique"
            onClick={closeMenu}
            className="text-base font-medium text-[#575049] hover:text-[#B47B38] py-2 border-b border-[#E8E2D9]/50"
          >
            Créations
          </Link>
          <Link
            href="/a-propos"
            onClick={closeMenu}
            className="text-base font-medium text-[#575049] hover:text-[#B47B38] py-2"
          >
            L&apos;Atelier
          </Link>
        </div>
      )}
    </header>
  );
}
