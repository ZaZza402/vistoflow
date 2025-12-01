"use client";

import { useState, useEffect } from "react";
import { CHECKLIST_DATA } from "@/lib/calculators/checklistData";
import { ChecklistDocument } from "@/lib/pdf/ChecklistTemplate";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDown, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ChecklistPage() {
  const t = useTranslations("ChecklistPage");
  const tItems = useTranslations("ChecklistItems");
  const [category, setCategory] = useState<string>("");
  const [action, setAction] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  // Helper to construct the key
  const checklistKey = category && action ? `${category}_${action}` : "";
  const rawItems = checklistKey
    ? CHECKLIST_DATA[checklistKey as keyof typeof CHECKLIST_DATA]
    : [];

  const items = rawItems.map((item) => tItems(item));

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {t("title")}
        </h1>
        <p className="text-slate-600">{t("subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("configure")}</CardTitle>
          <CardDescription>{t("configureDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Category */}
          <div className="space-y-2">
            <Label>{t("permitCategory")}</Label>
            <Select onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t("permitCategory") + "..."} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STUDY">{t("study")}</SelectItem>
                <SelectItem value="NOMAD">{t("nomad")}</SelectItem>
                {/* Add more later */}
              </SelectContent>
            </Select>
          </div>

          {/* Step 2: Action (Only show if Category selected) */}
          {category && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <Label>{t("applicationType")}</Label>
              <Select onValueChange={setAction}>
                <SelectTrigger>
                  <SelectValue placeholder={t("applicationType") + "..."} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIRST_ISSUE">{t("firstIssue")}</SelectItem>
                  <SelectItem value="RENEWAL">{t("renewal")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Step 3: Download (Only show if valid combination) */}
          {items && items.length > 0 ? (
            <div className="pt-4 animate-in fade-in slide-in-from-top-2">
              {isClient ? (
                <PDFDownloadLink
                  document={
                    <ChecklistDocument
                      permitType={checklistKey.replace("_", " ")}
                      items={items}
                    />
                  }
                  fileName={`vistoflow_checklist_${checklistKey.toLowerCase()}.pdf`}
                >
                  {({ loading }) => (
                    <Button
                      className="w-full h-14 text-lg gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <FileDown className="h-5 w-5" />
                      )}
                      {loading ? t("generating") : t("download")}
                    </Button>
                  )}
                </PDFDownloadLink>
              ) : (
                <Button className="w-full h-14 text-lg gap-2" disabled>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t("loadingEngine")}
                </Button>
              )}
              <p className="text-xs text-center text-slate-500 mt-3">
                {t("disclaimer")}
              </p>
            </div>
          ) : (
            category &&
            action && (
              <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm text-center animate-in fade-in">
                {t("notAvailable")}
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
