"use client";
import AddToCartButton from "@/components/AddToCartButton";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function FeaturedProducts({ products }: { products: any[] }) {
  const { addToCart } = useCart();

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-[#F9F6F0] rounded-2xl border border-[#E8E2D9]">
        <p className="text-[#6E665F]">
          Aucun produit n&apos;est encore affiché en page d&apos;accueil.
        </p>
      </div>
    );
  }

  return (
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
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
