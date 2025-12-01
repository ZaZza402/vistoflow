"use client";

import { useState } from "react";
import {
  useForm,
  SubmitHandler,
  DefaultValues,
  Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nomadVisaSchema, NomadVisaForm } from "@/lib/schemas";
import {
  calculateNomadEligibility,
  CalculationResult,
} from "@/lib/calculators";
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
import { AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

export default function NomadCalculatorPage() {
  const t = useTranslations("CalculatorPage");
  const tFeedback = useTranslations("CalculatorFeedback");
  const tAffiliate = useTranslations("AffiliateActions");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<NomadVisaForm>({
    resolver: zodResolver(nomadVisaSchema) as unknown as Resolver<NomadVisaForm>,
    defaultValues: {
      citizenship_non_eu: undefined,
      work_status: undefined,
      work_proof_available: undefined,
      employer_location_outside_italy: undefined,
      criminal_record_clean: undefined,
      highest_qualification: undefined,
      remote_exp_months: 0,
      contract_duration_12m: undefined,
      annual_gross_income_eur: 0,
      dependants_joining: 0,
      income_documentation_12m: undefined,
      accommodation_proof: undefined,
      health_insurance_min_30k: undefined,
      passport_validity_months: 0,
    } as DefaultValues<NomadVisaForm>,
  });

  const onSubmit: SubmitHandler<NomadVisaForm> = (data) => {
    const calculation = calculateNomadEligibility(data, tFeedback, tAffiliate);
    setResult(calculation);
    // Scroll to results
    setTimeout(() => {
      document
        .getElementById("results-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8 pb-24">
      {/* 1. THE HERO */}
      <div className="text-center space-y-2">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {t("title")}
          </h1>
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {t("decreeReference")}
          </span>
        </div>
        <p className="text-slate-600">{t("subtitle")}</p>
      </div>

      {/* 2. THE CALCULATOR FORM */}
      <Card>
        <CardHeader>
          <CardTitle>{t("yourDetails")}</CardTitle>
          <CardDescription>{t("yourDetailsDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* SECTION 1: ELIGIBILITY */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
                {t("section1")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("citizenshipNonEu")}</Label>
                  <Select
                    onValueChange={(val) =>
                      form.setValue(
                        "citizenship_non_eu",
                        val as NomadVisaForm["citizenship_non_eu"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("select")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">{t("yes")}</SelectItem>
                      <SelectItem value="false">{t("no")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.citizenship_non_eu && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.citizenship_non_eu.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t("workType")}</Label>
                  <Select
                    onValueChange={(val) =>
                      form.setValue(
                        "work_status",
                        val as NomadVisaForm["work_status"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("select")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REMOTE_EMPLOYEE">
                        {t("remoteEmployee")}
                      </SelectItem>
                      <SelectItem value="FREELANCER">
                        {t("freelancer")}
                      </SelectItem>
                      <SelectItem value="ENTREPRENEUR">
                        {t("entrepreneur")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.work_status && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.work_status.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t("employerLocation")}</Label>
                  <Select
                    onValueChange={(val) =>
                      form.setValue(
                        "employer_location_outside_italy",
                        val as NomadVisaForm["employer_location_outside_italy"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("select")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">{t("yes")}</SelectItem>
                      <SelectItem value="false">{t("no")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.employer_location_outside_italy && (
                    <p className="text-red-500 text-xs">
                      {
                        form.formState.errors.employer_location_outside_italy
                          .message
                      }
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t("criminalRecord")}</Label>
                  <Select
                    onValueChange={(val) =>
                      form.setValue(
                        "criminal_record_clean",
                        val as NomadVisaForm["criminal_record_clean"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("select")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">{t("cleanRecord")}</SelectItem>
                      <SelectItem value="false">{t("hasRecord")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.criminal_record_clean && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.criminal_record_clean.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: QUALIFICATION */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
                {t("section2")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("highestQualification")}</Label>
                  <Select
                    onValueChange={(val) =>
                      form.setValue(
                        "highest_qualification",
                        val as NomadVisaForm["highest_qualification"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("select")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BACHELOR">{t("bachelor")}</SelectItem>
                      <SelectItem value="EXP_5Y">{t("exp5y")}</SelectItem>
                      <SelectItem value="ICT_3Y">{t("ict3y")}</SelectItem>
                      <SelectItem value="NONE">{t("noQual")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.highest_qualification && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.highest_qualification.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t("remoteExpMonths")}</Label>
                  <Input
                    type="number"
                    {...form.register("remote_exp_months")}
                    placeholder="e.g. 24"
                  />
                  {form.formState.errors.remote_exp_months && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.remote_exp_months.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t("workProofAvailable")}</Label>
                  <Select
                    onValueChange={(val) =>
                      form.setValue(
                        "work_proof_available",
                        val as NomadVisaForm["work_proof_available"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("select")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">{t("yes")}</SelectItem>
                      <SelectItem value="false">{t("no")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.work_proof_available && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.work_proof_available.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t("contractDuration")}</Label>
                  <Select
                    onValueChange={(val) =>
                      form.setValue(
                        "contract_duration_12m",
                        val as NomadVisaForm["contract_duration_12m"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("select")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">{t("yes")}</SelectItem>
                      <SelectItem value="false">{t("no")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.contract_duration_12m && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.contract_duration_12m.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 3: FINANCIAL */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
                {t("section3")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("annualIncome")}</Label>
                  <Input
                    type="number"
                    {...form.register("annual_gross_income_eur")}
                    placeholder="e.g. 35000"
                  />
                  {form.formState.errors.annual_gross_income_eur && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.annual_gross_income_eur.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t("familyMembers")}</Label>
                  <Input
                    type="number"
                    {...form.register("dependants_joining")}
                    placeholder="0"
                  />
                  {form.formState.errors.dependants_joining && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.dependants_joining.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>{t("incomeDocs")}</Label>
                  <Select
                    onValueChange={(val) =>
                      form.setValue(
                        "income_documentation_12m",
                        val as NomadVisaForm["income_documentation_12m"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("select")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12M">{t("docs12m")}</SelectItem>
                      <SelectItem value="6M">{t("docs6m")}</SelectItem>
                      <SelectItem value="LESS">{t("docsLess")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.income_documentation_12m && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.income_documentation_12m.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 4: ACCOMMODATION & INSURANCE */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
                {t("section4")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("accommodationStatus")}</Label>
                  <Select
                    onValueChange={(val) =>
                      form.setValue(
                        "accommodation_proof",
                        val as NomadVisaForm["accommodation_proof"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("select")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LEASE_12M">{t("lease")}</SelectItem>
                      <SelectItem value="TRANSITORY">
                        {t("transitory")}
                      </SelectItem>
                      <SelectItem value="AIRBNB">{t("airbnb")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.accommodation_proof && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.accommodation_proof.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t("healthInsurance")}</Label>
                  <Select
                    onValueChange={(val) =>
                      form.setValue(
                        "health_insurance_min_30k",
                        val as NomadVisaForm["health_insurance_min_30k"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("select")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">{t("yesCompliant")}</SelectItem>
                      <SelectItem value="false">{t("noInsurance")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.health_insurance_min_30k && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.health_insurance_min_30k.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t("passportValidity")}</Label>
                  <Input
                    type="number"
                    {...form.register("passport_validity_months")}
                    placeholder="e.g. 24"
                  />
                  {form.formState.errors.passport_validity_months && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.passport_validity_months.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full text-lg py-6 font-bold shadow-lg hover:shadow-xl transition-all"
            >
              {t("checkEligibility")}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="text-center text-sm text-slate-500 italic mt-2">
        {t("verifiedBy")}
      </div>

      {/* 3. THE RESULTS (Condition: Only show if result exists) */}
      {result && (
        <div
          id="results-section"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-mt-24"
        >
          {/* Score Card */}
          <Alert
            variant={result.status === "CRITICAL" ? "destructive" : "default"}
            className={`border-2 ${
              result.status === "APPROVED"
                ? "border-green-500 bg-green-50 text-green-900"
                : result.status === "WARNING"
                ? "border-yellow-500 bg-yellow-50 text-yellow-900"
                : "border-red-500 bg-red-50 text-red-900"
            }`}
          >
            {result.status === "APPROVED" ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <AlertCircle className="h-6 w-6" />
            )}
            <AlertTitle className="text-xl font-bold flex items-center gap-2">
              {t("probabilityScore")}: {result.score}%
            </AlertTitle>
            <AlertDescription className="text-base font-medium mt-1">
              {result.status === "APPROVED"
                ? t("approvedMsg")
                : t("criticalMsg")}
            </AlertDescription>
          </Alert>

          {/* The Fix (AFFILIATE HOOK) */}
          {result.affiliateAction && (
            <Card className="border-blue-500 border-l-4 bg-blue-50/50 shadow-md overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl">
                RECOMMENDED
              </div>
              <CardHeader>
                <CardTitle className="text-blue-700 flex items-center gap-2">
                  {t("recommendedFix")}: {result.affiliateAction.title}
                </CardTitle>
                <CardDescription className="text-slate-700 font-medium text-base">
                  {result.affiliateAction.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6"
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
                <p className="text-xs text-slate-500 mt-3 text-center italic">
                  {t("officialSolution")}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Logic Feedback Loop */}
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
                        : item.startsWith("⚠️")
                        ? "⚠️"
                        : "ℹ️"}
                    </span>
                    <span className="flex-1">
                      {item.replace(/^[❌⚠️ℹ️]\s*/, "")}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="pt-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">
          {t("commonQuestions")}
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>{t("q1")}</AccordionTrigger>
            <AccordionContent>{t("a1")}</AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>{t("q2")}</AccordionTrigger>
            <AccordionContent>{t("a2")}</AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>{t("q3")}</AccordionTrigger>
            <AccordionContent>{t("a3")}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
