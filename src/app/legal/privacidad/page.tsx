import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { businessConfig, siteConfig } from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.privacy");
  
  return {
    title: t("title"),
    description: t("description"),
    robots: "noindex, nofollow",
  };
}

export default function PrivacyPolicyPage() {
  const t = useTranslations("legal.privacy");
  const tCommon = useTranslations("common");

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {tCommon("backToHome")}
              </Link>
            </Button>
          </div>

          {/* Header */}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-gray-500 mb-8">
            {t("lastUpdated")}: {siteConfig.legal.lastUpdated}
          </p>

          {/* Placeholder notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-amber-800 font-medium">Contenido pendiente de revisión legal</p>
              <p className="text-amber-700 text-sm mt-1">
                Este texto es una plantilla. Debe ser revisado y aprobado por un profesional legal antes de su publicación.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            <h2>1. Responsable del tratamiento</h2>
            <p>
              <strong>Responsable:</strong> {businessConfig.legalName || "[NOMBRE LEGAL PENDIENTE]"}<br />
              <strong>Dirección:</strong> {businessConfig.address.full}<br />
              <strong>Teléfono:</strong> {businessConfig.phone}<br />
              <strong>Email:</strong> {siteConfig.email || "[EMAIL PENDIENTE]"}
            </p>

            <h2>2. Datos personales que tratamos</h2>
            <p>
              A través de este sitio web podemos recopilar los siguientes datos personales:
            </p>
            <ul>
              <li>Nombre y apellidos</li>
              <li>Número de teléfono</li>
              <li>Dirección de correo electrónico</li>
              <li>Datos de navegación (cookies)</li>
            </ul>

            <h2>3. Finalidades del tratamiento</h2>
            <p>Tratamos sus datos para las siguientes finalidades:</p>
            <ul>
              <li>Gestión de reservas de mesa</li>
              <li>Responder a sus consultas</li>
              <li>Envío de comunicaciones comerciales (solo si ha dado su consentimiento)</li>
              <li>Análisis estadístico del uso del sitio web</li>
            </ul>

            <h2>4. Base legal del tratamiento</h2>
            <p>
              La base legal para el tratamiento de sus datos es:
            </p>
            <ul>
              <li>Su consentimiento expreso al enviar formularios</li>
              <li>La ejecución de un contrato (reservas)</li>
              <li>Nuestro interés legítimo en mejorar nuestros servicios</li>
            </ul>

            <h2>5. Conservación de datos</h2>
            <p>
              Los datos personales proporcionados se conservarán durante el tiempo necesario para cumplir 
              con la finalidad para la que se recabaron y para determinar las posibles responsabilidades 
              que se pudieran derivar de dicha finalidad.
            </p>

            <h2>6. Cesión de datos</h2>
            <p>
              No se cederán datos a terceros, salvo obligación legal. No se realizan transferencias 
              internacionales de datos.
            </p>

            <h2>7. Derechos del interesado</h2>
            <p>
              Puede ejercer sus derechos de acceso, rectificación, supresión, limitación, portabilidad 
              y oposición contactando con nosotros a través de:
            </p>
            <ul>
              <li>Email: {siteConfig.email || "[EMAIL PENDIENTE]"}</li>
              <li>Teléfono: {businessConfig.phone}</li>
              <li>Dirección postal: {businessConfig.address.full}</li>
            </ul>
            <p>
              También tiene derecho a presentar una reclamación ante la Agencia Española de Protección 
              de Datos (AEPD) si considera que el tratamiento no se ajusta a la normativa vigente.
            </p>

            <h2>8. Seguridad</h2>
            <p>
              Adoptamos las medidas técnicas y organizativas necesarias para garantizar la seguridad 
              de los datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado.
            </p>
          </div>

          {/* Legal pages navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Documentos legales</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" asChild>
                <Link href="/legal/cookies">Política de Cookies</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/legal/aviso-legal">Aviso Legal</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
