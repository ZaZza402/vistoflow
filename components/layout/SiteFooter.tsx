"use client";

import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";
import { useTranslations, useLocale } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("SiteFooter");
  const tHeader = useTranslations("SiteHeader");
  const locale = useLocale();

  return (
    <footer className="w-full border-t bg-slate-50 py-12 px-4 md:px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* BRAND COL */}
        <div className="space-y-4">
          <span className="text-xl font-extrabold text-slate-900">
            Visto<span className="text-blue-600">Flow</span>
          </span>
          <p className="text-sm text-slate-500 max-w-xs">{t("description")}</p>
        </div>

        {/* TOOLS COL */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900">{t("freeTools")}</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <Link href={`/${locale}/calculator`} className="hover:underline">
                {tHeader("visaCalculator")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/checklist`} className="hover:underline">
                {tHeader("docChecklist")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/click-day`} className="hover:underline">
                {tHeader("clickDaySim")}
              </Link>
            </li>
          </ul>
        </div>

        {/* LEGAL COL (Placeholders for now) */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900">{t("legal")}</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <Link href="#" className="hover:underline">
                {t("privacyPolicy")}
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                {t("termsOfService")}
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                {t("cookiePolicy")}
              </Link>
            </li>
          </ul>
        </div>

        {/* SOCIAL/CONTACT */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900">{t("contact")}</h4>
          <p className="text-sm text-slate-600">
            {t("questions")}{" "}
            <a
              href={`mailto:${SITE_CONFIG.supportEmail}`}
              className="text-blue-600 hover:underline"
            >
              {t("emailSupport")}
            </a>
          </p>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t text-center text-xs text-slate-400">
        <p className="mb-2 max-w-2xl mx-auto">{t("disclaimer")}</p>©{" "}
        {new Date().getFullYear()} {SITE_CONFIG.name}. {t("rightsReserved")}
      </div>
    </footer>
  );
}
