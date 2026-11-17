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

  // ID du produit en cours de modification (null = création d'un nouveau produit)
  const [editingId, setEditingId] = useState<string | null>(null);

  // États pour le Drag & Drop / Upload d'image
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const initialFormState = {
    name: "",
    description: "",
    price: "",
    category: "bougeoir",
    stock: "1",
    images: "",
    dimensions: "",
    materials: "",
    isFeatured: true,
  };

  const [formData, setFormData] = useState(initialFormState);

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

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner uniquement une image (JPG, PNG, WEBP).");
      return;
    }

    setUploadingImage(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, images: data.url }));
      } else {
        alert(data.error || "Erreur lors de l'envoi de l'image.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de l'envoi de l'image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  // Pré-remplit le formulaire pour modifier un produit existant
  const handleEditClick = (prod: any) => {
    setEditingId(prod._id);
    setSuccessMessage("");
    setErrorMessage("");
    setFormData({
      name: prod.name || "",
      description: prod.description || "",
      price: prod.price?.toString() || "",
      category: prod.category || "bougeoir",
      stock: prod.stock?.toString() || "1",
      images: prod.images?.[0] || "",
      dimensions: prod.dimensions || "",
      materials: prod.materials || "",
      isFeatured: Boolean(prod.isFeatured),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Annule la modification et repasse en mode création
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setErrorMessage("");
  };

  // Bascule rapide du statut "Produit phare" directement depuis la liste
  const handleToggleFeatured = async (prod: any) => {
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: prod._id,
          isFeatured: !prod.isFeatured,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(
          !prod.isFeatured
            ? `✨ "${prod.name}" est maintenant mis en avant sur l'accueil.`
            : `« ${prod.name} » a été retiré des pièces phares.`,
        );
        loadProducts();
        router.refresh();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      images: formData.images ? [formData.images] : [],
    };

    try {
      const response = await fetch("/api/products", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId ? { id: editingId, ...payload } : payload,
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      setSuccessMessage(
        editingId
          ? "✨ Création mise à jour avec succès !"
          : "✨ Création ajoutée avec succès !",
      );
      setEditingId(null);
      setFormData(initialFormState);
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
        if (editingId === id) {
          setEditingId(null);
          setFormData(initialFormState);
        }
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

      {/* Formulaire d'ajout ou de modification */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl border border-[#E8E2D9] space-y-6 shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-[#FAF8F5] pb-3">
          <h2 className="font-serif text-xl text-[#1E1B18]">
            {editingId
              ? "Modifier la pièce sélectionnée"
              : "Ajouter une nouvelle pièce"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs font-medium text-[#6E665F] hover:text-[#1E1B18] underline"
            >
              Annuler la modification
            </button>
          )}
        </div>

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
            placeholder="Ex: L'Ange du Recueillement"
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
              placeholder="38.00"
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
              placeholder="Ex: 30 cm x 12 cm"
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
              placeholder="Ex: Résine sculptée, ardoise naturelle..."
              className="w-full px-4 py-3 rounded-xl border border-[#D6CEC2] focus:outline-none focus:border-[#B47B38] text-sm bg-[#FAF8F5]/50 text-[#1E1B18]"
            />
          </div>
        </div>

        {/* Zone Drag & Drop pour l'image */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#1E1B18]">
            Photo de la création (Glissez-déposez ou sélectionnez un fichier)
          </label>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
              isDragging
                ? "border-[#B47B38] bg-[#B47B38]/10"
                : "border-[#D6CEC2] bg-[#FAF8F5] hover:border-[#B47B38]"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {uploadingImage ? (
              <p className="text-sm text-[#B47B38] font-medium">
                Envoi et traitement de la photo en cours...
              </p>
            ) : formData.images ? (
              <div className="space-y-3">
                <img
                  src={formData.images}
                  alt="Aperçu de la création"
                  className="mx-auto h-36 w-36 object-cover rounded-lg shadow-sm border border-[#E6DFD7]"
                />
                <p className="text-xs text-[#6E665F]">
                  Fichier enregistré :{" "}
                  <span className="font-mono">{formData.images}</span>
                </p>
                <p className="text-xs text-[#B47B38] underline">
                  Glissez ou cliquez pour remplacer l&apos;image
                </p>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                <p className="text-sm font-medium text-[#1E1B18]">
                  Glissez-déposez votre photo ici
                </p>
                <p className="text-xs text-[#6E665F]">
                  ou{" "}
                  <span className="text-[#B47B38] underline">
                    parcourez votre ordinateur
                  </span>{" "}
                  (JPG, PNG, WEBP)
                </p>
              </div>
            )}
          </div>
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

        <div className="pt-4 flex gap-3">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="flex-1 bg-[#1E1B18] text-[#FAF8F5] py-4 rounded-xl font-medium hover:bg-[#B47B38] transition-colors shadow-sm disabled:opacity-50"
          >
            {loading
              ? "Enregistrement en cours..."
              : editingId
                ? "Enregistrer les modifications"
                : "Enregistrer la création"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-4 rounded-xl border border-[#D6CEC2] text-[#6E665F] font-medium hover:text-[#1E1B18] transition-colors"
            >
              Annuler
            </button>
          )}
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
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9]"
              >
                <div>
                  <h3 className="font-serif font-medium text-[#1E1B18]">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-[#6E665F] mt-0.5">
                    {prod.category} — {prod.price} €
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Bouton bascule rapide Produit Phare */}
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(prod)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      prod.isFeatured
                        ? "bg-[#B47B38]/15 text-[#B47B38] border-[#B47B38]/40 hover:bg-[#B47B38]/25"
                        : "bg-white text-[#6E665F] border-[#D6CEC2] hover:border-[#1E1B18] hover:text-[#1E1B18]"
                    }`}
                  >
                    {prod.isFeatured ? "✨ Pièce Phare" : "☆ Mettre en phare"}
                  </button>

                  {/* Bouton Modifier */}
                  <button
                    type="button"
                    onClick={() => handleEditClick(prod)}
                    className="px-3 py-1.5 bg-white border border-[#D6CEC2] text-[#1E1B18] rounded-lg text-xs font-medium hover:border-[#B47B38] transition-colors"
                  >
                    Modifier
                  </button>

                  {/* Bouton Supprimer */}
                  <button
                    type="button"
                    onClick={() => handleDelete(prod._id)}
                    className="px-3 py-1.5 bg-[#FDEDEC] text-[#C0392B] rounded-lg text-xs font-medium hover:bg-[#F5B7B1]/50 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
