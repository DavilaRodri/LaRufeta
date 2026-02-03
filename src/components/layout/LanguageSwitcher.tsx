"use client";

import { useTransition } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();

  const switchLocale = (locale: string) => {
    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
      window.location.reload();
    });
  };

  // Get current locale from cookie or default to 'es'
  const getCurrentLocale = () => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
      return match ? match[1] : 'es';
    }
    return 'es';
  };

  const currentLocale = typeof window !== 'undefined' ? getCurrentLocale() : 'es';
  const nextLocale = currentLocale === 'es' ? 'en' : 'es';
  const label = currentLocale === 'es' ? 'EN' : 'ES';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => switchLocale(nextLocale)}
      disabled={isPending}
      className="min-w-[60px]"
      aria-label={`Switch to ${nextLocale === 'es' ? 'Spanish' : 'English'}`}
    >
      <Globe className="h-4 w-4 mr-1" />
      {label}
    </Button>
  );
}
