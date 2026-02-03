import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { businessConfig, siteConfig } from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.terms");
  
  return {
    title: t("title"),
    description: t("description"),
    robots: "noindex, nofollow",
  };
}

export default function LegalNoticePage() {
  const t = useTranslations("legal.terms");
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
            <h2>1. Datos identificativos</h2>
            <p>
              En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la 
              Sociedad de la Información y de Comercio Electrónico, se informa de los siguientes datos:
            </p>
            <ul>
              <li><strong>Titular:</strong> {businessConfig.legalName || "[NOMBRE LEGAL PENDIENTE]"}</li>
              <li><strong>NIF/CIF:</strong> [CIF PENDIENTE]</li>
              <li><strong>Domicilio:</strong> {businessConfig.address.full}</li>
              <li><strong>Teléfono:</strong> {businessConfig.phone}</li>
              <li><strong>Email:</strong> {siteConfig.email || "[EMAIL PENDIENTE]"}</li>
              <li><strong>Actividad:</strong> Servicios de restauración</li>
            </ul>

            <h2>2. Objeto</h2>
            <p>
              El presente sitio web tiene como finalidad informar a los usuarios sobre los servicios 
              de restauración ofrecidos por {businessConfig.name}, así como facilitar la realización 
              de reservas y la comunicación con el establecimiento.
            </p>

            <h2>3. Condiciones de uso</h2>
            <p>
              El acceso y uso de este sitio web implica la aceptación de las presentes condiciones. 
              El usuario se compromete a hacer un uso adecuado de los contenidos y servicios que 
              {businessConfig.name} ofrece a través de su portal.
            </p>

            <h2>4. Propiedad intelectual</h2>
            <p>
              Todos los contenidos del sitio web (textos, fotografías, gráficos, imágenes, iconos, 
              tecnología, software, links y demás contenidos audiovisuales, así como su diseño gráfico 
              y códigos fuente) son propiedad intelectual de {businessConfig.name} o de terceros que 
              han autorizado su uso, sin que puedan entenderse cedidos al usuario ninguno de los 
              derechos de explotación reconocidos por la normativa vigente.
            </p>

            <h2>5. Exclusión de responsabilidad</h2>
            <p>
              {businessConfig.name} no se hace responsable de los daños y perjuicios de cualquier 
              naturaleza que pudieran ocasionarse a la calidad del servicio, interrupciones del 
              servicio, intromisión de virus o cualquier otro elemento que pudiera causar 
              modificaciones en el sistema informático del usuario.
            </p>

            <h2>6. Modificaciones</h2>
            <p>
              {businessConfig.name} se reserva el derecho de modificar unilateralmente, en cualquier 
              momento y sin previo aviso, la presentación y configuración del sitio web, así como 
              las presentes condiciones de uso.
            </p>

            <h2>7. Enlaces</h2>
            <p>
              Este sitio web puede contener enlaces a sitios web de terceros. {businessConfig.name} 
              no se hace responsable del contenido ni de las políticas de privacidad de dichos sitios.
            </p>

            <h2>8. Legislación aplicable y jurisdicción</h2>
            <p>
              Las presentes condiciones se rigen por la legislación española. Para cualquier 
              controversia que pudiera surgir, ambas partes se someten a los juzgados y tribunales 
              de Madrid, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.
            </p>
          </div>

          {/* Legal pages navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Documentos legales</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" asChild>
                <Link href="/legal/privacidad">Política de Privacidad</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/legal/cookies">Política de Cookies</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
