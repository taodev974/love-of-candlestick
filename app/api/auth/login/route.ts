import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password === process.env.ADMIN_PASSWORD) {
      const cookieStore = await cookies();

      cookieStore.set("atelier_session", process.env.ADMIN_SECRET!, {
        httpOnly: true,
        secure: false, // Garantit que le cookie est accepté sur http://localhost
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 jours
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Mot de passe incorrect" },
      { status: 401 },
    );
  } catch (error) {
    console.error("Erreur login:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
