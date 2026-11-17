import Link from "next/link";
import { connection } from "next/server";
import connectDB from "../lib/mongodb";
import Product from "../models/Product";

export const instant = false;
// Fonction pour récupérer les produits phares depuis MongoDB
async function getFeaturedProducts() {
  await connection(); // Indique à Next.js 16 de charger les produits dynamiquement à chaque visite
  try {
    await connectDB();
    // On force TypeScript à accepter le résultat brut de la base de données
    const products = await Product.find({ isFeatured: true }).lean().exec();
    return products;
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
              Nos créations du moment, façonnées avec soin dans l&aposatelier.
            </p>
          </div>
          <Link
            href="/boutique"
            className="text-sm font-medium text-[#B47B38] hover:underline"
          >
            Voir tout le catalogue →
          </Link>
        </div>

        {/* Grille des produits */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-[#F9F6F0] rounded-2xl border border-[#E8E2D9]">
            <p className="text-[#6E665F]">
              Aucun produit n&apos;est encore affiché en page d&apos;accueil.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product._id.toString()}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E8E2D9] hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Zone Image cliquable */}
                <Link
                  href={`/boutique/${product._id.toString()}`}
                  className="aspect-square bg-[#F2EDE4] relative flex items-center justify-center text-[#A3998E] overflow-hidden block"
                >
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-sm italic">Photo à venir</span>
                  )}
                </Link>

                {/* Infos Produit */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#B47B38] font-medium">
                      {product.category}
                    </span>
                    <Link href={`/boutique/${product._id.toString()}`}>
                      <h3 className="font-serif text-xl text-[#1E1B18] mt-1 group-hover:text-[#B47B38] transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-[#6E665F] mt-2 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#F2EDE4]">
                    <span className="font-serif text-lg font-semibold text-[#1E1B18]">
                      {product.price.toFixed(2)} €
                    </span>
                    <button className="px-4 py-2 bg-[#FAF8F5] border border-[#D6CEC2] text-xs font-medium rounded-full hover:bg-[#1E1B18] hover:text-white hover:border-[#1E1B18] transition-colors">
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
