"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taxResidencySchema, TaxResidencyForm } from "@/lib/schemas";
import {
  calculateTaxResidency,
  TaxCalculationResult,
} from "@/lib/calculators/taxResidency";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function TaxCalculatorPage() {
  const t = useTranslations("TaxCalculatorPage");
  const tFeedback = useTranslations("TaxFeedback");
  const tAffiliate = useTranslations("TaxAffiliate");
  const [result, setResult] = useState<TaxCalculationResult | null>(null);

  const form = useForm<TaxResidencyForm>({
    resolver: zodResolver(taxResidencySchema),
    defaultValues: {
      target_year: new Date().getFullYear() + 1,
    },
  });

  const watchedHomeCountry = form.watch("home_country");

  // Fix for React Compiler memoization issue with form.watch
  // We use a separate effect or just accept that this component might re-render
  // In this case, we just need the value for the UI logic below.

  const onSubmit: SubmitHandler<TaxResidencyForm> = (data) => {
    const calculation = calculateTaxResidency(
      data,
      (key, params) => tFeedback(key, params),
      (key) => tAffiliate(key)
    );
    setResult(calculation);
    setTimeout(() => {
      document
        .getElementById("results-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8 pb-24">
      {/* HERO */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {t("title")}
        </h1>
        <p className="text-slate-600">{t("subtitle")}</p>
      </div>

      {/* FORM */}
      <Card>
        <CardHeader>
          <CardTitle>{t("goalSetting")}</CardTitle>
          <CardDescription>{t("goalSettingDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* SECTION 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("primaryGoal")}</Label>
                <Select
                  onValueChange={(val) =>
                    form.setValue(
                      "primary_goal",
                      val as TaxResidencyForm["primary_goal"]
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TAX_SAVINGS">
                      {t("taxSavings")}
                    </SelectItem>
                    <SelectItem value="LIFESTYLE">{t("lifestyle")}</SelectItem>
                    <SelectItem value="FAMILY">{t("family")}</SelectItem>
                    <SelectItem value="OTHER">{t("other")}</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.primary_goal && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.primary_goal.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>{t("targetYear")}</Label>
                <Input type="number" {...form.register("target_year")} />
                {form.formState.errors.target_year && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.target_year.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>{t("arrivalDate")}</Label>
                <Input type="date" {...form.register("arrival_date")} />
                {form.formState.errors.arrival_date && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.arrival_date.message}
                  </p>
                )}
              </div>
            </div>

            {/* SECTION 2: ANXIETY INDUCER */}
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-800">
                  {t("homeCountryConfrontation")}
                </h3>
                <p className="text-sm text-slate-500">
                  {t("homeCountryConfrontationDesc")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("homeCountry")}</Label>
                  <Select
                    onValueChange={(val) =>
                      form.setValue(
                        "home_country",
                        val as TaxResidencyForm["home_country"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("select")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">{t("us")}</SelectItem>
                      <SelectItem value="UK">{t("uk")}</SelectItem>
                      <SelectItem value="CA">{t("ca")}</SelectItem>
                      <SelectItem value="OTHER">{t("otherCountry")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.home_country && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.home_country.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t("maxDaysHome")}</Label>
                  <Input
                    type="number"
                    placeholder={t("maxDaysHomePlaceholder")}
                    {...form.register("max_days_home")}
                  />
                  {form.formState.errors.max_days_home && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.max_days_home.message}
                    </p>
                  )}
                </div>
              </div>

              {/* DYNAMIC WARNING */}
              {watchedHomeCountry && (
                <Alert className="bg-yellow-50 border-yellow-200 text-yellow-900">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm font-medium">
                    {watchedHomeCountry === "US"
                      ? t("usWarning")
                      : watchedHomeCountry === "UK"
                      ? t("ukWarning")
                      : watchedHomeCountry === "CA"
                      ? t("caWarning")
                      : t("genericWarning")}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Button
              type="submit"
              className="w-full text-lg py-6 font-bold shadow-lg hover:shadow-xl transition-all bg-slate-900 hover:bg-slate-800"
            >
              {t("checkRisk")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* RESULTS */}
      {result && (
        <div
          id="results-section"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-mt-24"
        >
          {/* Score Card */}
          <Alert
            variant={result.status === "SAFE" ? "default" : "destructive"}
            className={`border-2 ${
              result.status === "SAFE"
                ? "border-green-500 bg-green-50 text-green-900"
                : result.status === "MODERATE_RISK"
                ? "border-yellow-500 bg-yellow-50 text-yellow-900"
                : "border-red-500 bg-red-50 text-red-900"
            }`}
          >
            {result.status === "SAFE" ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <ShieldAlert className="h-6 w-6" />
            )}
            <AlertTitle className="text-xl font-bold flex items-center gap-2">
              {t("riskScore")}: {result.riskScore}% -{" "}
              {result.status === "SAFE"
                ? t("safe")
                : result.status === "MODERATE_RISK"
                ? t("moderateRisk")
                : t("highRisk")}
            </AlertTitle>
          </Alert>

          {/* Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("analysis")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.feedback.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100"
                  >
                    <span className="mt-0.5">
                      {item.startsWith("❌")
                        ? "❌"
                        : item.startsWith("✅")
                        ? "✅"
                        : "⚠️"}
                    </span>
                    <span className="flex-1">
                      {item.replace(/^[❌✅⚠️]\s*/, "")}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Affiliate CTA */}
          <Card className="border-red-500 border-l-4 bg-red-50/50 shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                {result.affiliateAction.title}
              </CardTitle>
              <CardDescription className="text-slate-700 font-medium text-base">
                {result.affiliateAction.description.replace(
                  "{country}",
                  watchedHomeCountry || "Home Country"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6"
              >
                <a
                  href={result.affiliateAction.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  {result.affiliateAction.buttonText}{" "}
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
