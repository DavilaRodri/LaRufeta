import { useTranslations } from "next-intl";
import { Sun, Coffee, Utensils, Wine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    key: "terrace",
    icon: Sun,
    verified: true,
  },
  {
    key: "breakfast",
    icon: Coffee,
    verified: true,
  },
  {
    key: "dailyMenu",
    icon: Utensils,
    verified: true,
  },
  {
    key: "tapas",
    icon: Wine,
    verified: true,
  },
];

export function FeaturesSection() {
  const t = useTranslations("home");

  return (
    <section className="py-20 bg-rufeta-cream/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
            {t("featuresTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.key} className="card-hover border-0 shadow-md bg-white">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rufeta-red/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-rufeta-red" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {t(`features.${feature.key}.title`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`features.${feature.key}.description`)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
