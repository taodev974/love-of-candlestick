import Link from "next/link";

export default function AProposPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-20 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* En-tête */}
        <div className="text-center space-y-4 border-b border-[#E8E2D9] pb-10">
          <span className="text-xs uppercase tracking-widest text-[#B47B38] font-semibold">
            L&apos;Histoire &amp; Le Savoir-Faire
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1E1B18]">
            L&apos;Atelier de Sabine
          </h1>
        </div>

        {/* Texte de présentation */}
        <div className="space-y-6 text-[#575049] leading-relaxed font-light text-lg">
          <p>
            Bienvenue dans l&apos;univers de{" "}
            <strong className="font-medium text-[#1E1B18]">
              Love of Candlestick
            </strong>
            , une maison dédiée à l&apos;artisanat d&apos;art, à la lumière
            douce et aux rituels parfumés.
          </p>
          <p>
            Chaque pièce — qu&apos;il s&apos;agisse d&apos;un bougeoir sculpté,
            d&apos;un porte-encens apaisant ou d&apos;un écrin façonné à la main
            — naît d&apos;une recherche d&apos;équilibre entre la matière brute
            et la poésie du quotidien.
          </p>
          <p>
            Travaillées en petites séries ou en pièces uniques, les créations de
            Sabine invitent à ralentir, à allumer une flamme ou un bâton
            d&apos;encens, et à transformer chaque recoin de votre intérieur en
            un refuge chaleureux.
          </p>
        </div>

        {/* Appel à l'action */}
        <div className="pt-6 text-center">
          <Link
            href="/boutique"
            className="inline-block bg-[#1E1B18] text-[#FAF8F5] px-8 py-4 rounded-full font-medium hover:bg-[#B47B38] transition-colors shadow-sm"
          >
            Découvrir les créations
          </Link>
        </div>
      </div>
    </div>
  );
}
