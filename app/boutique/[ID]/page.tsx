import AddToCartButton from "@/components/AddToCartButton";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

interface PageProps {
  params: Promise<{ ID?: string; id?: string }>;
}

// On passe la promesse `params` ici pour que `await params` soit exécuté DANS le <Suspense>
async function ProductDetails({
  paramsPromise,
}: {
  paramsPromise: Promise<{ ID?: string; id?: string }>;
}) {
  await connection();
  const resolvedParams = await paramsPromise;
  const productId = resolvedParams.ID || resolvedParams.id || "";

  try {
    await connectDB();

    if (!productId || productId === "undefined") {
      notFound();
    }

    const product = await Product.findById(productId).lean();

    if (!product) {
      notFound();
    }

    const serializedProduct = JSON.parse(JSON.stringify(product));

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Colonne Image */}
        <div className="aspect-square bg-[#F2EDE4] rounded-2xl overflow-hidden border border-[#E8E2D9] relative flex items-center justify-center">
          {serializedProduct.images && serializedProduct.images.length > 0 ? (
            <img
              src={serializedProduct.images[0]}
              alt={serializedProduct.name}
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
              {serializedProduct.category}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-[#1E1B18] mt-2">
              {serializedProduct.name}
            </h1>
          </div>

          <div className="text-2xl font-serif font-semibold text-[#1E1B18] pb-4 border-b border-[#E8E2D9]">
            {serializedProduct.price.toFixed(2)} €
          </div>

          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-[#6E665F] font-medium">
              Description de la pièce
            </h3>
            <p className="text-[#575049] leading-relaxed font-light">
              {serializedProduct.description}
            </p>
          </div>

          <div className="pt-6 space-y-4">
            <AddToCartButton product={serializedProduct} variant="full" />
            <p className="text-xs text-center text-[#8C8275]">
              Pièce façonnée à la main dans l&apos;atelier de Sabine. Stock
              limité.
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    notFound();
  }
}

export default function ProductDetailPage({ params }: PageProps) {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <Link
            href="/boutique"
            className="text-sm font-medium text-[#575049] hover:text-[#B47B38] transition-colors inline-flex items-center gap-2"
          >
            ← Retour à la boutique
          </Link>
        </div>

        {/* Le composant lit désormais `params` à l'intérieur du Suspense */}
        <Suspense
          fallback={
            <div className="py-20 text-center text-[#8C8275]">
              Chargement de la création...
            </div>
          }
        >
          <ProductDetails paramsPromise={params} />
        </Suspense>
      </div>
    </div>
  );
}
