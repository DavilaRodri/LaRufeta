import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        {/* 404 Display */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-rufeta-red/20 font-display">
            404
          </h1>
          <div className="-mt-8">
            <h2 className="text-3xl font-bold text-gray-900 font-display">
              Página no encontrada
            </h2>
            <p className="text-gray-600 mt-2 max-w-md mx-auto">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="rufeta" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/menu">
              Ver nuestra carta
            </Link>
          </Button>
        </div>

        {/* Helpful links */}
        <div className="mt-12 text-sm text-gray-500">
          <p>¿Buscabas alguna de estas páginas?</p>
          <div className="flex flex-wrap justify-center gap-4 mt-3">
            <Link href="/menu" className="text-rufeta-red hover:underline">
              Carta
            </Link>
            <Link href="/reservas" className="text-rufeta-red hover:underline">
              Reservas
            </Link>
            <Link href="/contacto" className="text-rufeta-red hover:underline">
              Contacto
            </Link>
            <Link href="/galeria" className="text-rufeta-red hover:underline">
              Galería
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
