import Link from "next/link";
import { connection } from "next/server";
import connectDB from "../lib/mongodb";
import Product from "../models/Product";
import FeaturedProducts from "@/components/FeaturedProducts";

export const instant = false;

// Fonction pour récupérer les produits phares depuis MongoDB
async function getFeaturedProducts() {
  await connection();
  try {
    await connectDB();
    const products = await Product.find({ isFeatured: true }).lean().exec();
    // Convertit proprement les objets Mongoose en objets JSON simples
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Erreur lors du chargement des produits:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <div className="space-y-20 pb-20">
      {/* Section Hero / En-tête de bienvenue */}
      <section className="relative bg-[#F2EDE4] py-24 px-6 text-center border-b border-[#E8E2D9]">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#B47B38] font-semibold">
            Artisanat d&apos;art & Fait main
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-[#1E1B18] leading-tight">
            La douceur de la lumière, façonnée à la main
          </h1>
          <p className="text-lg text-[#575049] max-w-xl mx-auto font-light">
            Découvrez l&apos;univers poétique et chaleureux de Sabine : des
            bougeoirs, supports et créations uniques pour illuminer votre
            intérieur.
          </p>
          <div className="pt-4">
            <Link
              href="/boutique"
              className="inline-block bg-[#1E1B18] text-[#FAF8F5] px-8 py-4 rounded-full font-medium hover:bg-[#B47B38] transition-colors shadow-sm"
            >
              Découvrir les créations
            </Link>
          </div>
        </div>
      </section>

      {/* Section des produits phares */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-serif text-3xl text-[#1E1B18]">
              Les Pièces Phares
            </h2>
            <p className="text-sm text-[#6E665F] mt-1">
              Nos créations du moment, façonnées avec soin dans l&apos;atelier.
            </p>
          </div>
          <Link
            href="/boutique"
            className="text-sm font-medium text-[#B47B38] hover:underline"
          >
            Voir tout le catalogue →
          </Link>
        </div>

        {/* Grille des produits interactive */}
        <FeaturedProducts products={products} />
      </section>
    </div>
  );
}
