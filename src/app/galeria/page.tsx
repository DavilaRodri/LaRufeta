import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Camera, ImageIcon } from "lucide-react";
import { galleryImages } from "@/data/menu";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("gallery");
  
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function GalleryPage() {
  const t = useTranslations("gallery");

  const hasOnlyPlaceholders = galleryImages.every((img) => img.isPlaceholder);

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
          <p className="text-gray-600 mt-2">
            {t("description")}
          </p>
        </div>

        {/* Placeholder notice */}
        {hasOnlyPlaceholders && (
          <div className="max-w-2xl mx-auto mb-12 p-6 bg-white rounded-xl shadow-md text-center">
            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-700">{t("placeholder")}</p>
            <p className="text-gray-500 mt-2">{t("uploadNote")}</p>
          </div>
        )}

        {/* Gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="aspect-square rounded-xl overflow-hidden shadow-md bg-gray-200 relative group"
            >
              {image.isPlaceholder ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">{image.alt}</span>
                </div>
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                    <p className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {image.alt}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Upload instructions for admin */}
        {hasOnlyPlaceholders && (
          <div className="max-w-2xl mx-auto mt-12 p-6 bg-amber-50 border border-amber-200 rounded-xl">
            <h3 className="font-semibold text-amber-800 mb-2">📷 Para el administrador:</h3>
            <ol className="text-sm text-amber-700 space-y-2 list-decimal list-inside">
              <li>Añade las fotos en la carpeta <code className="bg-amber-100 px-1 rounded">public/images/gallery/</code></li>
              <li>Nombra las fotos de forma descriptiva (ej: terraza-1.jpg, tapas-patatas.jpg)</li>
              <li>Actualiza el array <code className="bg-amber-100 px-1 rounded">galleryImages</code> en <code className="bg-amber-100 px-1 rounded">src/data/menu.ts</code></li>
              <li>Cambia <code className="bg-amber-100 px-1 rounded">isPlaceholder: false</code> para cada imagen real</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
