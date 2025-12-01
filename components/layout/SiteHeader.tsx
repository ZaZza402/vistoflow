"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, Calculator, FileText, Timer, Globe, X } from "lucide-react";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("SiteHeader");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: t("visaCalculator"), href: "/calculator", icon: Calculator },
    { name: t("docChecklist"), href: "/checklist", icon: FileText },
    { name: t("clickDaySim"), href: "/click-day", icon: Timer },
  ];

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");
    router.push(newPath);
  };

  return (
    <>
      {/* DESKTOP HEADER (Standard) - Hidden on Mobile */}
      <header className="hidden md:flex sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          {/* LOGO */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <span className="text-xl font-extrabold tracking-tighter text-slate-900">
              Visto<span className="text-blue-600">Flow</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}

            {/* Language Switcher Desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  {locale.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => switchLocale("en")}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchLocale("it")}>
                  Italiano
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>

      {/* MOBILE HEADER (Floating Pill) - Hidden on Desktop */}
      <div className="md:hidden fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
        <div className="bg-white/90 backdrop-blur-md text-slate-900 rounded-full px-5 py-2 flex items-center justify-between shadow-xl border border-slate-200">
          {/* Logo Icon */}
          <Link
            href={`/${locale}`}
            className="font-bold text-lg tracking-tight text-slate-900"
          >
            VF
          </Link>

          <div className="flex items-center gap-3">
            {/* Language Toggle (Simple Cycle) */}
            <button
              onClick={() => switchLocale(locale === "en" ? "it" : "en")}
              className="text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors border border-slate-200 text-slate-600 font-semibold"
            >
              {locale.toUpperCase()}
            </button>

            <div className="h-4 w-px bg-slate-200"></div>

            {/* Hamburger / Close Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-900"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Dropdown Menu (Custom, drops from bottom of pill) */}
        {open && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col p-2 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 text-base font-medium text-slate-700 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <item.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
