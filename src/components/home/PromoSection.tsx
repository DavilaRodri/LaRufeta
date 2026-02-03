import { useTranslations } from "next-intl";
import { Gift, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { businessConfig } from "@/lib/config";

export function PromoSection() {
  const t = useTranslations("home");

  if (!businessConfig.loyaltyProgram.enabled) {
    return null;
  }

  return (
    <section className="py-20 bg-rufeta-red text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Visual element */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center relative">
                <Gift className="w-24 h-24 text-white" />
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-rufeta-gold rounded-full flex items-center justify-center font-bold text-xl text-white">
                  {businessConfig.loyaltyProgram.stampsRequired}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center lg:text-left">
              <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-sm font-medium mb-4">
                {t("promoSubtitle")}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {t("promoTitle")}
              </h2>
              <p className="text-xl text-white/90 mb-6">
                {t("promoDescription")}
              </p>

              <ul className="space-y-2 mb-8">
                {businessConfig.loyaltyProgram.appliesTo.map((item) => (
                  <li key={item} className="flex items-center gap-2 justify-center lg:justify-start">
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
                {t("promoCta")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
