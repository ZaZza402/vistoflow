import { TaxResidencyForm } from "@/lib/schemas";

export type TaxCalculationResult = {
  riskScore: number; // 0-100 (Higher is riskier)
  status: "HIGH_RISK" | "MODERATE_RISK" | "SAFE";
  feedback: string[];
  affiliateAction: {
    title: string;
    description: string;
    link: string;
    buttonText: string;
  };
};

export function calculateTaxResidency(
  data: TaxResidencyForm,
  tFeedback: (key: string, params?: Record<string, string | number>) => string,
  tAffiliate: (key: string) => string
): TaxCalculationResult {
  const feedback: string[] = [];
  let riskScore = 50; // Start moderate

  // 1. Parse Dates
  const arrival = new Date(data.arrival_date);
  const targetYear = data.target_year;
  const endOfYear = new Date(`${targetYear}-12-31`);

  // Calculate days in Italy
  // If arrival is before Jan 1 of target year, they are present for full year (365)
  // If arrival is after Dec 31 of target year, they are present for 0 days
  let daysInItaly = 0;

  const startOfYear = new Date(`${targetYear}-01-01`);

  if (arrival > endOfYear) {
    daysInItaly = 0;
  } else if (arrival < startOfYear) {
    daysInItaly = 365; // Full year presence
  } else {
    // Calculate difference in days
    const diffTime = Math.abs(endOfYear.getTime() - arrival.getTime());
    daysInItaly = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include arrival day
  }

  // 2. Italian Requirement Check (183 Days)
  const isTaxResident = daysInItaly >= 183;

  if (!isTaxResident) {
    riskScore += 30;
    feedback.push(tFeedback("notTaxResident", { days: daysInItaly }));
  } else {
    feedback.push(tFeedback("isTaxResident", { days: daysInItaly }));

    // Anagrafe Risk: If arriving late (e.g. June), Anagrafe delays might push them under 183 days legally
    // 183 days from end of year is roughly July 2nd.
    // If arrival is in June, it's risky.
    const month = arrival.getMonth(); // 0-11
    if (month >= 5) {
      // June or later
      riskScore += 20;
      feedback.push(tFeedback("anagrafeRisk"));
    }
  }

  // 3. Home Country Constraint
  // Days available to spend outside Italy
  const daysOutside = 365 - daysInItaly;

  // If they are NOT tax resident in Italy, they might be tax resident in Home Country by default
  // If they ARE tax resident in Italy, they must ensure they don't trigger Home Country rules

  if (daysOutside > data.max_days_home) {
    riskScore += 40;
    feedback.push(
      tFeedback("homeCountryRisk", {
        country: data.home_country,
        limit: data.max_days_home,
        potential: daysOutside,
      })
    );
  }

  // 4. Country Specific Anxiety
  if (data.home_country === "US") {
    riskScore += 15; // Always risky due to citizenship tax
    feedback.push(tFeedback("usRisk"));
  } else if (data.home_country === "UK") {
    riskScore += 10; // SRT is complex
    feedback.push(tFeedback("ukRisk"));
  } else if (data.home_country === "CA") {
    riskScore += 10; // Factual residence is ambiguous
    feedback.push(tFeedback("caRisk"));
  }

  // Cap Score
  if (riskScore > 100) riskScore = 100;

  return {
    riskScore,
    status:
      riskScore > 70 ? "HIGH_RISK" : riskScore > 40 ? "MODERATE_RISK" : "SAFE",
    feedback,
    affiliateAction: {
      title: tAffiliate("taxConsultTitle"),
      description: tAffiliate("taxConsultDesc"),
      link: "https://example.com/tax-consult", // Placeholder
      buttonText: tAffiliate("taxConsultBtn"),
    },
  };
}
