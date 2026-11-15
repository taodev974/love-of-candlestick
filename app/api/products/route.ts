import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // Création automatique d'un identifiant URL (slug) unique
    const slug =
      body.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      Date.now();

    const newProduct = await Product.create({
      ...body,
      slug,
    });

    return NextResponse.json(
      { success: true, product: newProduct },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Erreur lors de la création du produit :", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}

// Nouvelle fonction pour supprimer un produit par son ID
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID du produit manquant" },
        { status: 400 },
      );
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Produit supprimé avec succès",
    });
  } catch (error: any) {
    console.error("Erreur lors de la suppression :", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}
