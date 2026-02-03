"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Phone, MessageCircle, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { submitReservation, type ReservationFormData } from "./actions";
import { businessConfig } from "@/lib/config";
import { getWhatsAppLink, getPhoneLink } from "@/lib/utils";

const reservationSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z.string().min(9, "Introduce un número de teléfono válido"),
  email: z.string().email("Introduce un email válido").optional().or(z.literal("")),
  date: z.string().min(1, "La fecha es obligatoria"),
  time: z.string().min(1, "La hora es obligatoria"),
  partySize: z.coerce.number().min(1, "Mínimo 1 persona").max(20, "Máximo 20 personas"),
  notes: z.string().optional(),
  website: z.string().max(0), // Honeypot
});

type FormData = z.infer<typeof reservationSchema>;

export function ReservationForm() {
  const t = useTranslations("reservations");
  const tCommon = useTranslations("common");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      partySize: 2,
      notes: "",
      website: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await submitReservation(data as ReservationFormData);
      setResult(response);
      if (response.success) {
        reset();
      }
    } catch (error) {
      setResult({
        success: false,
        message: t("error.message"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappLink = getWhatsAppLink(
    businessConfig.whatsappNumber,
    "Hola, quiero reservar en La Rufeta para [día] a las [hora] para [personas]."
  );
  const phoneLink = getPhoneLink(businessConfig.phone);

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="space-y-8">
      {/* Form */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Honeypot field - hidden from users */}
            <div className="hidden" aria-hidden="true">
              <Input
                {...register("website")}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t("form.name")} <span className="text-rufeta-red">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder={t("form.namePlaceholder")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  {t("form.phone")} <span className="text-rufeta-red">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  placeholder={t("form.phonePlaceholder")}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t("form.email")} <span className="text-gray-400">({tCommon("optional")})</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder={t("form.emailPlaceholder")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Party Size */}
              <div className="space-y-2">
                <Label htmlFor="partySize">
                  {t("form.partySize")} <span className="text-rufeta-red">*</span>
                </Label>
                <Input
                  id="partySize"
                  type="number"
                  min={1}
                  max={20}
                  {...register("partySize")}
                  placeholder={t("form.partySizePlaceholder")}
                  className={errors.partySize ? "border-red-500" : ""}
                />
                {errors.partySize && (
                  <p className="text-sm text-red-500">{errors.partySize.message}</p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">
                  {t("form.date")} <span className="text-rufeta-red">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  min={minDate}
                  {...register("date")}
                  className={errors.date ? "border-red-500" : ""}
                />
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date.message}</p>
                )}
              </div>

              {/* Time */}
              <div className="space-y-2">
                <Label htmlFor="time">
                  {t("form.time")} <span className="text-rufeta-red">*</span>
                </Label>
                <Input
                  id="time"
                  type="time"
                  {...register("time")}
                  className={errors.time ? "border-red-500" : ""}
                />
                {errors.time && (
                  <p className="text-sm text-red-500">{errors.time.message}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">
                {t("form.notes")} <span className="text-gray-400">({tCommon("optional")})</span>
              </Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder={t("form.notesPlaceholder")}
                rows={3}
              />
            </div>

            {/* Result message */}
            {result && (
              <div
                className={`p-4 rounded-lg flex items-start gap-3 ${
                  result.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
                <div>
                  <p
                    className={`font-medium ${
                      result.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {result.success ? t("success.title") : t("error.title")}
                  </p>
                  <p
                    className={`text-sm ${
                      result.success ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {result.message}
                  </p>
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="rufeta"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("form.submitting") : t("form.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Alternative contact */}
      <div className="text-center">
        <p className="text-gray-600 mb-4">{t("orContact")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" size="lg" asChild>
            <a href={phoneLink}>
              <Phone className="w-4 h-4 mr-2" />
              {businessConfig.phone}
            </a>
          </Button>
          <Button variant="whatsapp" size="lg" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>

      {/* Note */}
      <div className="text-center">
        <p className="text-sm text-gray-500">{t("note")}</p>
      </div>
    </div>
  );
}
