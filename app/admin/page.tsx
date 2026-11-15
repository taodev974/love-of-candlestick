"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [products, setProducts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "bougeoir",
    stock: "1",
    images: "",
    dimensions: "",
    materials: "",
    isFeatured: true,
  });

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Erreur chargement liste", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
          images: formData.images
            ? formData.images.split(",").map((img) => img.trim())
            : [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      setSuccessMessage("✨ Création ajoutée avec succès !");
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "bougeoir",
        stock: "1",
        images: "",
        dimensions: "",
        materials: "",
        isFeatured: true,
      });
      loadProducts();
      router.refresh();
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette création ?")) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage("🗑️ Création supprimée avec succès.");
        loadProducts();
        router.refresh();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <div className="flex justify-between items-center border-b border-[#E8E2D9] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B47B38] font-semibold">
            Espace Privé de Sabine
          </span>
          <h1 className="font-serif text-3xl text-[#1E1B18] mt-1">
            Gestion des Créations
          </h1>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-[#6E665F] hover:text-[#1E1B18]"
        >
          ← Retour au site
        </Link>
      </div>

      {successMessage && (
        <div className="p-4 bg-[#EBF4EC] border border-[#C5E1A5] text-[#2E7D32] rounded-xl text-sm">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-[#FDEDEC] border border-[#F5B7B1] text-[#C0392B] rounded-xl text-sm">
          {errorMessage}
        </div>
      )}

      {/* Formulaire d'ajout */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl border border-[#E8E2D9] space-y-6 shadow-sm"
      >
        <h2 className="font-serif text-xl text-[#1E1B18] border-b border-[#FAF8F5] pb-3">
          Ajouter une nouvelle pièce
        </h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#1E1B18]">
            Nom de la création *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Centre de table poétique Chant des Fêtes"
            className="w-full px-4 py-3 rounded-xl border border-[#D6CEC2] focus:outline-none focus:border-[#B47B38] text-sm bg-[#FAF8F5]/50 text-[#1E1B18]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#1E1B18]">
              Prix (€) *
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              placeholder="45.00"
              className="w-full px-4 py-3 rounded-xl border border-[#D6CEC2] focus:outline-none focus:border-[#B47B38] text-sm bg-[#FAF8F5]/50 text-[#1E1B18]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#1E1B18]">
              Catégorie *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#D6CEC2] focus:outline-none focus:border-[#B47B38] text-sm bg-[#FAF8F5]/50 text-[#1E1B18]"
            >
              <option value="bougeoir">Bougeoir</option>
              <option value="porte-encens">Porte-encens</option>
              <option value="boite-a-mouchoirs">Boîte à mouchoirs</option>
              <option value="boite-a-bijoux">Boîte à bijoux</option>
              <option value="autre">Autre</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#1E1B18]">
            Description *
          </label>
          <textarea
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez la pièce..."
            className="w-full px-4 py-3 rounded-xl border border-[#D6CEC2] focus:outline-none focus:border-[#B47B38] text-sm bg-[#FAF8F5]/50 text-[#1E1B18]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#1E1B18]">
              Dimensions
            </label>
            <input
              type="text"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              placeholder="Ex: 35 cm x 12 cm"
              className="w-full px-4 py-3 rounded-xl border border-[#D6CEC2] focus:outline-none focus:border-[#B47B38] text-sm bg-[#FAF8F5]/50 text-[#1E1B18]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#1E1B18]">
              Matériaux
            </label>
            <input
              type="text"
              name="materials"
              value={formData.materials}
              onChange={handleChange}
              placeholder="Ex: Bois patiné, céramique"
              className="w-full px-4 py-3 rounded-xl border border-[#D6CEC2] focus:outline-none focus:border-[#B47B38] text-sm bg-[#FAF8F5]/50 text-[#1E1B18]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#1E1B18]">
            URL de l&apos;image
          </label>
          <input
            type="text"
            name="images"
            value={formData.images}
            onChange={handleChange}
            placeholder="/images/oiseaux-fetes.jpg"
            className="w-full px-4 py-3 rounded-xl border border-[#D6CEC2] focus:outline-none focus:border-[#B47B38] text-sm bg-[#FAF8F5]/50 text-[#1E1B18]"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            name="isFeatured"
            id="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
            className="w-4 h-4 accent-[#B47B38] border-[#D6CEC2] rounded"
          />
          <label
            htmlFor="isFeatured"
            className="text-sm font-medium text-[#1E1B18] cursor-pointer"
          >
            Afficher dans &quot;Les Pièces Phares&quot; sur la page
            d&apos;accueil
          </label>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E1B18] text-[#FAF8F5] py-4 rounded-xl font-medium hover:bg-[#B47B38] transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? "Enregistrement en cours..." : "Enregistrer la création"}
          </button>
        </div>
      </form>

      {/* Liste des créations existantes */}
      <div className="bg-white p-8 rounded-2xl border border-[#E8E2D9] space-y-6 shadow-sm">
        <h2 className="font-serif text-xl text-[#1E1B18] border-b border-[#FAF8F5] pb-3">
          Catalogue actuel ({products.length} pièces)
        </h2>

        {products.length === 0 ? (
          <p className="text-sm text-[#6E665F]">
            Aucune création enregistrée pour le moment.
          </p>
        ) : (
          <div className="space-y-4">
            {products.map((prod) => (
              <div
                key={prod._id}
                className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9]"
              >
                <div>
                  <h3 className="font-serif font-medium text-[#1E1B18]">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-[#6E665F] mt-0.5">
                    {prod.category} — {prod.price} €{" "}
                    {prod.isFeatured && "✨ Phare"}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(prod._id)}
                  className="px-3 py-1.5 bg-[#FDEDEC] text-[#C0392B] rounded-lg text-xs font-medium hover:bg-[#F5B7B1]/50 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
