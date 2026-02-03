import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Download, MessageCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { menuData } from "@/data/menu";
import { businessConfig } from "@/lib/config";
import { getWhatsAppLink } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("menu");
  
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default function MenuPage() {
  const t = useTranslations("menu");
  const tCommon = useTranslations("common");

  const whatsappLink = getWhatsAppLink(
    businessConfig.whatsappNumber,
    "Hola, me gustaría conocer la carta de La Rufeta."
  );

  const hasPlaceholders = menuData.some(section => 
    section.items.some(item => item.isPlaceholder)
  );

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

        {/* Placeholder notice */}
        {hasPlaceholders && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Carta en actualización</p>
              <p>Algunos elementos están pendientes de confirmar. Contacta con nosotros para más información.</p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button variant="rufetaOutline" size="lg" disabled>
            <Download className="w-4 h-4 mr-2" />
            {t("downloadPdf")}
            <span className="ml-2 text-xs opacity-70">(Próximamente)</span>
          </Button>
          <Button variant="whatsapp" size="lg" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 mr-2" />
              {t("askWhatsapp")}
            </a>
          </Button>
        </div>

        {/* Menu sections */}
        <div className="max-w-4xl mx-auto space-y-12">
          {menuData.map((section) => (
            <section key={section.id}>
              <div className="mb-6">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
                  {t(section.titleKey.replace('menu.', ''))}
                </h2>
                <p className="text-gray-600 mt-1">
                  {t(section.descriptionKey.replace('menu.', ''))}
                </p>
              </div>

              <div className="grid gap-4">
                {section.items.map((item) => (
                  <Card key={item.id} className={`${item.isPlaceholder ? 'opacity-70 border-dashed' : ''}`}>
                    <CardContent className="p-4 flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {item.name}
                          </h3>
                          {item.isPlaceholder && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
                              {tCommon("pending")}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-gray-600 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {item.price !== undefined && (
                        <div className="text-right ml-4">
                          <span className="font-bold text-lg text-rufeta-red">
                            {item.price.toFixed(2).replace('.', ',')} €
                          </span>
                        </div>
                      )}
                      {item.isPlaceholder && item.price === undefined && (
                        <div className="text-right ml-4">
                          <span className="text-gray-400">
                            -- €
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Note */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-sm text-gray-500">
            {t("note")}
          </p>
        </div>
      </div>
    </div>
  );
}
