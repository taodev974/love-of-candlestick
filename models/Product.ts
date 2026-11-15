import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  category:
    | "bougeoir"
    | "porte-encens"
    | "boite-a-mouchoirs"
    | "boite-a-bijoux"
    | "autre";
  images: string[];
  stock: number;
  isFeatured: boolean;
  dimensions?: string;
  materials?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom de la création est obligatoire"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "La description est obligatoire"],
    },
    price: {
      type: Number,
      required: [true, "Le prix est obligatoire"],
      min: [0, "Le prix ne peut pas être négatif"],
    },
    category: {
      type: String,
      enum: [
        "bougeoir",
        "porte-encens",
        "boite-a-mouchoirs",
        "boite-a-bijoux",
        "autre",
      ],
      default: "bougeoir",
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false, // Permettra de mettre en avant les pièces phares sur l'accueil
    },
    dimensions: {
      type: String,
    },
    materials: {
      type: String, // Ex: "Jesmonite, pigments naturels"
    },
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  },
);

// Évite de recompiler le modèle lors du rechargement à chaud (Hot Reload) de Next.js
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
