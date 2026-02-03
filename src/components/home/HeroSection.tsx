import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { businessConfig } from "@/lib/config";

export function HeroSection() {
  const t = useTranslations("home");

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background - Placeholder until real image is provided */}
      <div className="absolute inset-0 bg-gradient-to-br from-rufeta-brown via-rufeta-red to-rufeta-orange">
        {/* Overlay pattern for visual interest */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            {t("heroTitle")}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light">
            {t("heroSubtitle")}
          </p>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            {t("heroDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="rufeta" size="xl" asChild>
              <Link href="/reservas">
                {t("heroCta")}
              </Link>
            </Button>
            <Button variant="rufetaOutline" size="xl" className="bg-white/10 border-white text-white hover:bg-white hover:text-rufeta-red" asChild>
              <Link href="/menu">
                Ver Carta
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
