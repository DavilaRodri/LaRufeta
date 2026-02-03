import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { MapPin, Phone, Clock, Navigation, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { businessConfig } from "@/lib/config";
import { getWhatsAppLink, getPhoneLink, getGoogleMapsLink } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  
  return {
    title: t("title"),
    description: `${t("address.value")} - ${businessConfig.phone}`,
  };
}

export default function ContactPage() {
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");

  const mapsLink = getGoogleMapsLink(businessConfig.address.full);
  const phoneLink = getPhoneLink(businessConfig.phone);
  const whatsappLink = getWhatsAppLink(
    businessConfig.whatsappNumber,
    "Hola, tengo una consulta sobre La Rufeta."
  );

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Contact info cards */}
            <div className="space-y-6">
              {/* Address */}
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-rufeta-red/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-rufeta-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{t("address.title")}</h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {t("address.value")}
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-2 text-rufeta-red" asChild>
                      <a href={mapsLink} target="_blank" rel="noopener noreferrer">
                        <Navigation className="w-4 h-4 mr-1" />
                        Cómo llegar
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-rufeta-red/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-rufeta-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{t("phone.title")}</h3>
                    <a 
                      href={phoneLink} 
                      className="text-xl font-medium text-rufeta-red hover:underline"
                    >
                      {t("phone.value")}
                    </a>
                    <div className="flex gap-3 mt-3">
                      <Button variant="rufeta" size="sm" asChild>
                        <a href={phoneLink}>
                          <Phone className="w-4 h-4 mr-2" />
                          Llamar
                        </a>
                      </Button>
                      <Button variant="whatsapp" size="sm" asChild>
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hours */}
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-rufeta-red/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-rufeta-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{t("hours.title")}</h3>
                    {businessConfig.openingHours.isPlaceholder ? (
                      <div className="text-gray-500">
                        <p>{t("hours.pending")}</p>
                        <p className="text-sm mt-2">{t("hours.weekdays")}</p>
                        <p className="text-sm">{t("hours.weekends")}</p>
                      </div>
                    ) : (
                      <div className="text-gray-600">
                        {businessConfig.openingHours.hours.map((h, i) => (
                          <p key={i}>{h.days}: {h.open} - {h.close}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map */}
            <div className="h-full min-h-[400px]">
              <Card className="h-full overflow-hidden">
                <div className="h-full bg-gray-200 relative">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3033.5!2d-3.6508!3d40.5003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDMwJzAxLjEiTiAzwrAzOScwMi45Ilc!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "400px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación de La Rufeta"
                    className="absolute inset-0"
                  />
                </div>
              </Card>
            </div>
          </div>

          {/* How to get here */}
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="font-display text-2xl font-bold mb-4">{t("getHere.title")}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t("getHere.description")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
