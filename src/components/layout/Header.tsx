"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { businessConfig } from "@/lib/config";
import { getWhatsAppLink, getPhoneLink } from "@/lib/utils";

const navItems = [
  { href: "/", labelKey: "home" },
  { href: "/menu", labelKey: "menu" },
  { href: "/reservas", labelKey: "reservations" },
  { href: "/galeria", labelKey: "gallery" },
  { href: "/eventos", labelKey: "events" },
  { href: "/contacto", labelKey: "contact" },
];

export function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const whatsappLink = getWhatsAppLink(businessConfig.whatsappNumber);
  const phoneLink = getPhoneLink(businessConfig.phone);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display text-2xl font-bold text-rufeta-red">
              {businessConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-rufeta-red transition-colors"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" asChild>
              <a href={phoneLink} aria-label={tCommon("callUs")}>
                <Phone className="h-4 w-4 mr-2" />
                {tCommon("callUs")}
              </a>
            </Button>
            <Button variant="whatsapp" size="sm" asChild>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {tCommon("whatsapp")}
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-base font-medium text-gray-700 hover:text-rufeta-red py-2"
                >
                  {t(item.labelKey)}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Button variant="outline" asChild>
                  <a href={phoneLink}>
                    <Phone className="h-4 w-4 mr-2" />
                    {tCommon("callUs")}
                  </a>
                </Button>
                <Button variant="whatsapp" asChild>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {tCommon("whatsapp")}
                  </a>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
