"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ArrowRight,
  Calculator,
  FileCheck,
  Landmark,
  Timer,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function MarketingPage() {
  const t = useTranslations("MarketingPage");
  const locale = useLocale(); // Get current locale

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* 1. HERO SECTION */}
      <section className="bg-white border-b pt-24 pb-12 md:pb-48 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl tracking-tighter font-extrabold text-slate-900 sm:text-6xl">
            {t("heroTitle")}{" "}
            <span className="text-blue-600">{t("heroTitleHighlight")}</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto">
            {t("heroSubtitle")}
          </p>
          <div className="pt-4 flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
            <Button size="lg" className="w-full sm:w-auto h-14 text-lg" asChild>
              <Link href={`/${locale}/calculator`}>
                {t("checkVisaEligibility")}{" "}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-14 text-lg"
            >
              {t("browseAllTools")}
            </Button>
          </div>
        </div>
      </section>

      {/* 2. THE TOOLS GRID (Your "Portfolio") */}
      <section className="mt-10 md:-mt-24 relative z-10 w-full md:max-w-6xl mx-auto px-0 md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Tool */}
          <Card className="mx-2 shadow-md border-blue-200 hover:border-blue-400 transition-all cursor-pointer mb-4">
            <CardHeader>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>{t("nomadVisaCalculator")}</CardTitle>
              <CardDescription>{t("nomadVisaDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={`/${locale}/calculator`}
                className="text-blue-600 font-semibold hover:underline flex items-center"
              >
                {t("startCheck")} &rarr;
              </Link>
            </CardContent>
          </Card>

          {/* Click Day Sim (Replaces Placeholder) */}
          <Card className="mx-2 shadow-md border-blue-200 hover:border-blue-400 transition-all cursor-pointer mb-4">
            <CardHeader>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Timer className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>{t("clickDaySim")}</CardTitle>
              <CardDescription>{t("clickDayDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={`/${locale}/click-day`}
                className="text-blue-600 font-semibold hover:underline flex items-center"
              >
                {t("startSim")} &rarr;
              </Link>
            </CardContent>
          </Card>

          {/* Active Tool 2 */}
          <Card className="mx-2 shadow-md border-blue-200 hover:border-blue-400 transition-all cursor-pointer mb-4">
            <CardHeader>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileCheck className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>{t("docChecklistGenerator")}</CardTitle>
              <CardDescription>{t("docChecklistDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={`/${locale}/checklist`}
                className="text-blue-600 font-semibold hover:underline flex items-center"
              >
                {t("generatePdf")} &rarr;
              </Link>
            </CardContent>
          </Card>

          {/* Tax Calculator */}
          <Card className="mx-2 shadow-md border-blue-200 hover:border-blue-400 transition-all cursor-pointer mb-4">
            <CardHeader>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Landmark className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>{t("taxCalculator")}</CardTitle>
              <CardDescription>{t("taxCalculatorDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={`/${locale}/tax-calculator`}
                className="text-blue-600 font-semibold hover:underline flex items-center"
              >
                {t("checkRisk")} &rarr;
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. TRUST SIGNALS (SEO Content) */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-3xl font-bold text-slate-900">{t("whyTrust")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{t("strictly2025")}</h3>
              <p className="text-slate-600 text-sm">{t("strictly2025Desc")}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{t("privacyFirst")}</h3>
              <p className="text-slate-600 text-sm">{t("privacyFirstDesc")}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{t("directSolutions")}</h3>
              <p className="text-slate-600 text-sm">
                {t("directSolutionsDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
