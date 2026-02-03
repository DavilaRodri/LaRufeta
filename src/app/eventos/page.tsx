import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Gift, Check, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { eventsData } from "@/data/menu";
import { businessConfig } from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("events");
  
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default function EventsPage() {
  const t = useTranslations("events");

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Loyalty Card - Featured */}
          {businessConfig.loyaltyProgram.enabled && (
            <Card className="bg-gradient-to-r from-rufeta-red to-rufeta-orange text-white overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                      <Gift className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-sm font-medium mb-3">
                      Promoción activa
                    </span>
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                      {t("loyaltyCard.title")}
                    </h2>
                    <h3 className="text-xl text-white/90 mb-4">
                      {t("loyaltyCard.subtitle")}
                    </h3>
                    <p className="text-white/80 mb-6">
                      {t("loyaltyCard.description")}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {businessConfig.loyaltyProgram.appliesTo.map((item) => (
                        <li key={item} className="flex items-center gap-2 justify-center md:justify-start">
                          <Check className="w-5 h-5 text-rufeta-gold" />
                          <span className="capitalize">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="bg-white text-rufeta-red hover:bg-rufeta-cream border-white"
                    >
                      {t("loyaltyCard.cta")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other events */}
          {eventsData.filter(e => e.id !== 'loyalty-card').length > 0 ? (
            <div className="grid gap-6">
              {eventsData
                .filter((event) => event.id !== 'loyalty-card')
                .map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-rufeta-red/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-6 h-6 text-rufeta-red" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                          {event.date && (
                            <p className="text-sm text-gray-500 mt-1">{event.date}</p>
                          )}
                          {event.isOngoing && (
                            <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded mt-1">
                              En curso
                            </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{event.description}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">{t("noEvents")}</p>
              <p className="text-gray-400 mt-2">{t("stayTuned")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
