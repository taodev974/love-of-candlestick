import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Aucun fichier reçu." },
        { status: 400 },
      );
    }

    // Conversion du fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Création d'un nom de fichier propre et unique (sans espaces ni caractères spéciaux)
    const ext = path.extname(file.name) || ".jpg";
    const fileName = `${Date.now()}${ext}`;

    // Chemin de sauvegarde dans public/images
    const uploadDir = path.join(process.cwd(), "public", "images");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);

    // Écriture du fichier sur le disque
    await writeFile(filePath, buffer);

    // Renvoi du chemin web propre (toujours avec des slashs '/')
    return NextResponse.json({
      success: true,
      url: `/images/${fileName}`,
    });
  } catch (error) {
    console.error("Erreur upload image :", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'enregistrement de l'image." },
      { status: 500 },
    );
  }
}
