import Link from "next/link";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    await connectDB();
    // On vérifie si l'ID est valide pour MongoDB et on récupère le produit
    const product = await Product.findById(id).lean();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product)); // Sérialisation propre pour Next.js
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound(); // Déclenche la page 404 personnalisée si le produit n'existe pas
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Fil d'Ariane / Retour */}
        <div>
          <Link
            href="/boutique"
            className="text-sm font-medium text-[#575049] hover:text-[#B47B38] transition-colors inline-flex items-center gap-2"
          >
            ← Retour à la boutique
          </Link>
        </div>

        {/* Grille principale Produit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Colonne Image */}
          <div className="aspect-square bg-[#F2EDE4] rounded-2xl overflow-hidden border border-[#E8E2D9] relative flex items-center justify-center">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-sm text-[#A3998E] italic">
                Photo indisponible
              </span>
            )}
          </div>

          {/* Colonne Informations */}
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B47B38] font-semibold">
                {product.category}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-[#1E1B18] mt-2">
                {product.name}
              </h1>
            </div>

            <div className="text-2xl font-serif font-semibold text-[#1E1B18] pb-4 border-b border-[#E8E2D9]">
              {product.price.toFixed(2)} €
            </div>

            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-[#6E665F] font-medium">
                Description de la pièce
              </h3>
              <p className="text-[#575049] leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Section Achat / Quantité */}
            <div className="pt-6 space-y-4">
              <button className="w-full bg-[#1E1B18] text-[#FAF8F5] py-4 rounded-full font-medium hover:bg-[#B47B38] transition-colors shadow-sm text-center">
                Ajouter au panier
              </button>
              <p className="text-xs text-center text-[#8C8275]">
                Pièce façonnée à la main dans l&apos;atelier de Sabine. Stock
                limité.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
