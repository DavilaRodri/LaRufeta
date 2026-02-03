import Link from "next/link";
import { useTranslations } from "next-intl";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { businessConfig } from "@/lib/config";
import { getGoogleMapsLink } from "@/lib/utils";

export function LocationSection() {
  const t = useTranslations("home");

  const mapsLink = getGoogleMapsLink(businessConfig.address.full);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("locationTitle")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("locationDescription")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
            {/* Map placeholder */}
            <div className="aspect-video bg-gray-200 relative">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3033.5!2d-3.6508!3d40.5003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDMwJzAxLjEiTiAzwrAzOScwMi45Ilc!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de La Rufeta"
                className="absolute inset-0"
              />
              {/* Fallback if maps doesn't load */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 -z-10">
                <MapPin className="w-16 h-16 text-gray-400" />
              </div>
            </div>

            {/* Address info */}
            <div className="p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <MapPin className="w-6 h-6 text-rufeta-red flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {businessConfig.address.street}
                  </p>
                  <p className="text-gray-600">
                    {businessConfig.address.postalCode} {businessConfig.address.city}
                  </p>
                </div>
              </div>
              <Button variant="rufeta" asChild>
                <a href={mapsLink} target="_blank" rel="noopener noreferrer">
                  <Navigation className="w-4 h-4 mr-2" />
                  Cómo llegar
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
