"use client";

import { useState } from "react";
import { Check, AlertCircle, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contentChecklist } from "@/lib/config";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "larufeta2024";

type ChecklistStatus = "pending" | "in-progress" | "completed";

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  status: ChecklistStatus;
  notes?: string;
}

export default function ContentChecklistPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState<ChecklistItem[]>(contentChecklist as ChecklistItem[]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Contraseña incorrecta");
    }
  };

  const updateStatus = (id: string, status: ChecklistStatus) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const getStatusIcon = (status: ChecklistStatus) => {
    switch (status) {
      case "completed":
        return <Check className="w-5 h-5 text-green-600" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: ChecklistStatus) => {
    switch (status) {
      case "completed":
        return "border-green-200 bg-green-50";
      case "in-progress":
        return "border-amber-200 bg-amber-50";
      default:
        return "border-red-200 bg-red-50";
    }
  };

  const completedCount = checklist.filter((i) => i.status === "completed").length;
  const progress = Math.round((completedCount / checklist.length) * 100);

  // Group by category
  const groupedChecklist = checklist.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Área de Administración</h1>
            <p className="text-gray-500">Checklist de Contenidos</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduce la contraseña"
                  className="mt-1"
                />
              </div>
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
              <Button type="submit" variant="rufeta" className="w-full">
                Acceder
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Checklist de Contenidos
          </h1>
          <p className="text-gray-600">
            Gestiona el contenido pendiente antes del lanzamiento
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Progreso General</h2>
              <span className="text-2xl font-bold text-rufeta-red">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-rufeta-red h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-500 text-sm mt-2">
              {completedCount} de {checklist.length} elementos completados
            </p>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>En progreso</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>Completado</span>
          </div>
        </div>

        {/* Checklist by category */}
        <div className="space-y-8">
          {Object.entries(groupedChecklist).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {category}
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className={`transition-colors ${getStatusColor(item.status)}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getStatusIcon(item.status)}</div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {item.description}
                          </p>
                          {item.notes && (
                            <p className="text-gray-500 text-xs mt-2 italic">
                              {item.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={item.status === "pending" ? "rufeta" : "outline"}
                            onClick={() => updateStatus(item.id, "pending")}
                          >
                            Pendiente
                          </Button>
                          <Button
                            size="sm"
                            variant={item.status === "in-progress" ? "rufeta" : "outline"}
                            onClick={() => updateStatus(item.id, "in-progress")}
                          >
                            En progreso
                          </Button>
                          <Button
                            size="sm"
                            variant={item.status === "completed" ? "rufeta" : "outline"}
                            onClick={() => updateStatus(item.id, "completed")}
                          >
                            Hecho
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">Instrucciones</h2>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>• Actualiza los archivos en <code className="bg-gray-100 px-1 rounded">src/data/menu.ts</code> para el menú</li>
              <li>• Añade imágenes en <code className="bg-gray-100 px-1 rounded">public/images/</code></li>
              <li>• Actualiza <code className="bg-gray-100 px-1 rounded">src/lib/config.ts</code> para información del negocio</li>
              <li>• Configura las variables de entorno en <code className="bg-gray-100 px-1 rounded">.env.local</code></li>
              <li>• Las páginas legales necesitan revisión por un profesional</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
