import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ReservationForm } from "./ReservationForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("reservations");
  
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ReservationsPage() {
  const t = useTranslations("reservations");

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600">
            {t("subtitle")}
          </p>
          <p className="text-gray-600 mt-4">
            {t("description")}
          </p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <ReservationForm />
        </div>
      </div>
    </div>
  );
}
