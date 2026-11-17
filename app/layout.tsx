import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Love of Candlestick | Créations Artisanales & Bougeoirs",
  description:
    "Découvrez les créations uniques faites main par Sabine : bougeoirs, centres de table, porte-encens et objets décoratifs empreints de douceur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E1B18] font-sans antialiased selection:bg-[#B47B38]/20">
        {/* Barre de navigation */}
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
                className="text-[#575049] hover:text-[#B47B38] transition-colors duration-200 "
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

            {/* Bouton Panier */}
            <div className="flex items-center gap-4">
              <Link
                href="/panier"
                className="px-4 py-2 rounded-full border border-[#D6CEC2] text-sm font-medium text-[#1E1B18] hover:border-[#B47B38] hover:text-[#B47B38] transition-colors duration-200"
              >
                Panier (0)
              </Link>
            </div>
          </div>
        </header>
        {/* Contenu principal des pages */}
        <main className="flex-grow">{children}</main>

        {/* Pied de page */}
        <footer className="bg-[#F2EDE4] border-t border-[#E8E2D9] mt-20">
          <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#6E665F]">
            <div>
              <p className="font-serif text-lg text-[#1E1B18]">
                Love of Candlestick
              </p>
              <p className="mt-1">
                Créations artisanales façonnées avec passion par Sabine.
              </p>
            </div>
            <p>© 2026 Love of Candlestick. Tous droits réservés.</p>
            <Link
              href="/admin"
              className="text-xs text-[#8C8275] hover:text-[#B47B38] transition-colors"
            >
              Espace Atelier
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
