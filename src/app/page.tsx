import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { PromoSection } from "@/components/home/PromoSection";
import { LocationSection } from "@/components/home/LocationSection";
import { businessConfig } from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");
  
  return {
    title: `${businessConfig.name} - Bar Restaurante en Las Tablas`,
    description: t("heroDescription"),
  };
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PromoSection />
      <LocationSection />
    </>
  );
}
