import Link from "next/link";
import { useTranslations } from "next-intl";
import { Heart, MapPin, Phone, Instagram, Facebook } from "lucide-react";
import { businessConfig } from "@/lib/config";
import { getPhoneLink } from "@/lib/utils";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-rufeta-cream">
              {businessConfig.name}
            </h3>
            <p className="text-gray-400 text-sm">
              {tCommon("tagline")}
            </p>
            {/* Social links placeholder */}
            <div className="flex space-x-4">
              {businessConfig.social.instagram && (
                <a
                  href={businessConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {businessConfig.social.facebook && (
                <a
                  href={businessConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {businessConfig.social.isPlaceholder && (
                <span className="text-gray-500 text-xs">
                  (Redes sociales pendientes)
                </span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Navegación</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                {tNav("home")}
              </Link>
              <Link href="/menu" className="text-gray-400 hover:text-white text-sm transition-colors">
                {tNav("menu")}
              </Link>
              <Link href="/reservas" className="text-gray-400 hover:text-white text-sm transition-colors">
                {tNav("reservations")}
              </Link>
              <Link href="/galeria" className="text-gray-400 hover:text-white text-sm transition-colors">
                {tNav("gallery")}
              </Link>
              <Link href="/eventos" className="text-gray-400 hover:text-white text-sm transition-colors">
                {tNav("events")}
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contacto</h4>
            <div className="flex flex-col space-y-3">
              <a
                href={getPhoneLink(businessConfig.phone)}
                className="flex items-center text-gray-400 hover:text-white text-sm transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                {businessConfig.phone}
              </a>
              <div className="flex items-start text-gray-400 text-sm">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  {businessConfig.address.street}<br />
                  {businessConfig.address.postalCode} {businessConfig.address.city}
                </span>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Legal</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/legal/privacidad" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/legal/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Cookies
              </Link>
              <Link href="/legal/aviso-legal" className="text-gray-400 hover:text-white text-sm transition-colors">
                Aviso Legal
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>
            © {currentYear} {businessConfig.name}. {t("rights")}.
          </p>
          <p className="flex items-center mt-2 md:mt-0">
            {t("madeWith")} <Heart className="h-4 w-4 mx-1 text-rufeta-red" /> {t("inMadrid")}
          </p>
        </div>
      </div>
    </footer>
  );
}
