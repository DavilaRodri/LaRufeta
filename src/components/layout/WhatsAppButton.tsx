"use client";

import { MessageCircle } from "lucide-react";
import { businessConfig } from "@/lib/config";
import { getWhatsAppLink } from "@/lib/utils";

export function WhatsAppButton() {
  const whatsappLink = getWhatsAppLink(
    businessConfig.whatsappNumber,
    "Hola, quiero más información sobre La Rufeta."
  );

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] transition-all hover:scale-110 md:hidden"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
