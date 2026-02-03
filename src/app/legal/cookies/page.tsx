import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { businessConfig, siteConfig } from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.cookies");
  
  return {
    title: t("title"),
    description: t("description"),
    robots: "noindex, nofollow",
  };
}

export default function CookiePolicyPage() {
  const t = useTranslations("legal.cookies");
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
            <h2>1. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que los sitios web almacenan en su navegador 
              cuando los visita. Se utilizan ampliamente para hacer que los sitios web funcionen de 
              manera más eficiente y para proporcionar información a los propietarios del sitio.
            </p>

            <h2>2. ¿Qué tipos de cookies utilizamos?</h2>
            
            <h3>Cookies técnicas (necesarias)</h3>
            <p>
              Son imprescindibles para el funcionamiento del sitio web. Permiten la navegación y el uso 
              de las diferentes opciones y servicios que en ella existen.
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Finalidad</th>
                  <th>Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>NEXT_LOCALE</td>
                  <td>Almacena la preferencia de idioma del usuario</td>
                  <td>1 año</td>
                </tr>
                <tr>
                  <td>cookie_consent</td>
                  <td>Almacena la aceptación de cookies</td>
                  <td>1 año</td>
                </tr>
              </tbody>
            </table>

            <h3>Cookies analíticas</h3>
            <p>
              Permiten el seguimiento y análisis del comportamiento de los usuarios del sitio web. 
              La información recogida se utiliza para medir la actividad del sitio web y elaborar 
              perfiles de navegación con el fin de mejorar el servicio.
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Proveedor</th>
                  <th>Finalidad</th>
                  <th>Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>_ga, _ga_*</td>
                  <td>Google Analytics</td>
                  <td>Análisis estadístico de visitas</td>
                  <td>2 años</td>
                </tr>
              </tbody>
            </table>

            <h2>3. ¿Cómo gestionar las cookies?</h2>
            <p>
              Puede configurar su navegador para rechazar todas las cookies o para que le avise cuando 
              se envía una cookie. Sin embargo, si rechaza las cookies, es posible que algunas partes 
              de nuestro sitio web no funcionen correctamente.
            </p>
            
            <p>Enlaces para gestionar cookies en los navegadores más comunes:</p>
            <ul>
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                  Google Chrome
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
                  Safari
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
                  Microsoft Edge
                </a>
              </li>
            </ul>

            <h2>4. Actualizaciones de esta política</h2>
            <p>
              Esta política de cookies puede actualizarse, por lo que le recomendamos revisar esta 
              página periódicamente para mantenerse informado sobre cómo utilizamos las cookies.
            </p>

            <h2>5. Contacto</h2>
            <p>
              Si tiene preguntas sobre nuestra política de cookies, puede contactarnos en:
            </p>
            <ul>
              <li>Email: {siteConfig.email || "[EMAIL PENDIENTE]"}</li>
              <li>Teléfono: {businessConfig.phone}</li>
            </ul>
          </div>

          {/* Legal pages navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Documentos legales</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" asChild>
                <Link href="/legal/privacidad">Política de Privacidad</Link>
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
