import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#FAF8F5] flex flex-col items-center justify-center px-6 text-center space-y-6">
      <span className="text-xs uppercase tracking-widest text-[#B47B38] font-semibold">
        Page introuvable
      </span>
      <h1 className="font-serif text-4xl md:text-5xl text-[#1E1B18]">
        Cette création semble s&apos;être envolée...
      </h1>
      <p className="text-[#575049] max-w-md font-light">
        La page que vous recherchez n&apos;existe pas ou a été déplacée dans
        l&apos;atelier.
      </p>
      <div className="pt-4">
        <Link
          href="/"
          className="inline-block bg-[#1E1B18] text-[#FAF8F5] px-8 py-4 rounded-full font-medium hover:bg-[#B47B38] transition-colors shadow-sm"
        >
          Retourner à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
