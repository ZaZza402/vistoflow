// lib/calculators/index.ts
import { NomadVisaForm } from "@/lib/schemas";

export type CalculationResult = {
  score: number; // 0-100
  status: "APPROVED" | "WARNING" | "CRITICAL";
  feedback: string[];
  affiliateAction?: {
    type:
      | "INSURANCE"
      | "BANKING"
      | "HOUSING"
      | "LEGAL"
      | "EDUCATION"
      | "CAREER";
    title: string;
    description: string;
    link: string;
    buttonText: string;
  };
};

export function calculateNomadEligibility(
  data: NomadVisaForm,
  tFeedback: (key: string, params?: any) => string,
  tAffiliate: (key: string) => string
): CalculationResult {
  let score = 100;
  const feedback: string[] = [];

  // Priority system: Higher number = Higher priority
  // 1: Low (Career/Education)
  // 2: Medium (Insurance)
  // 3: High (Housing/Banking)
  // 4: Critical (Legal)
  let currentPriority = 0;
  let affiliateAction: CalculationResult["affiliateAction"] = undefined;

  const setAffiliateAction = (
    priority: number,
    action: NonNullable<CalculationResult["affiliateAction"]>
  ) => {
    if (priority > currentPriority) {
      currentPriority = priority;
      affiliateAction = action;
    }
  };

  // --- 1. ELIGIBILITY & STATUS (Foundational) ---

  // R-Flag 1: Citizenship
  if (!data.citizenship_non_eu) {
    return {
      score: 0,
      status: "CRITICAL",
      feedback: [tFeedback("citizenship")],
    };
  }

  // R-Flag 3: Employer Location
  if (!data.employer_location_outside_italy) {
    return {
      score: 0,
      status: "CRITICAL",
      feedback: [tFeedback("employerLocation")],
    };
  }

  // R-Flag 4: Criminal Record
  if (!data.criminal_record_clean) {
    return {
      score: 0,
      status: "CRITICAL",
      feedback: [tFeedback("criminalRecord")],
      affiliateAction: {
        type: "LEGAL",
        title: tAffiliate("legalTitle"),
        description: tAffiliate("legalDesc"),
        link: "https://example.com/legal",
        buttonText: tAffiliate("legalBtn"),
      },
    };
  }

  // R-Flag 2: Status Proof
  if (!data.work_proof_available) {
    score -= 10;
    feedback.push(tFeedback("workProof"));
    setAffiliateAction(4, {
      type: "LEGAL",
      title: tAffiliate("contractReviewTitle"),
      description: tAffiliate("contractReviewDesc"),
      link: "https://example.com/legal-contract",
      buttonText: tAffiliate("contractReviewBtn"),
    });
  }

  // --- 2. QUALIFICATION & EXPERIENCE ---

  // R-Flag 5: Qualification
  if (data.highest_qualification === "NONE") {
    score -= 20;
    feedback.push(tFeedback("qualification"));
    setAffiliateAction(1, {
      type: "EDUCATION",
      title: tAffiliate("qualCheckTitle"),
      description: tAffiliate("qualCheckDesc"),
      link: "https://example.com/cimea",
      buttonText: tAffiliate("qualCheckBtn"),
    });
  }

  // R-Flag 6: Experience
  if (data.remote_exp_months < 6) {
    score -= 15;
    feedback.push(tFeedback("remoteExp"));
    setAffiliateAction(1, {
      type: "CAREER",
      title: tAffiliate("cvHelpTitle"),
      description: tAffiliate("cvHelpDesc"),
      link: "https://example.com/career",
      buttonText: tAffiliate("cvHelpBtn"),
    });
  }

  // R-Flag 7: Contract Gap
  if (!data.contract_duration_12m) {
    score -= 10;
    feedback.push(tFeedback("contractGap"));
    setAffiliateAction(4, {
      type: "LEGAL",
      title: tAffiliate("contractDraftTitle"),
      description: tAffiliate("contractDraftDesc"),
      link: "https://example.com/legal-contract",
      buttonText: tAffiliate("contractDraftBtn"),
    });
  }

  // --- 3. FINANCIAL REQUIREMENTS ---

  // R-Flag 8: Income Shortfall
  // Threshold: €28,000 base + €9,360 (Spouse) + €1,560 (Child)
  // Assumption: If dependants > 0, 1st is Spouse, rest are Children.
  const BASE_INCOME = 28000;
  const SPOUSE_COST = 9360;
  const CHILD_COST = 1560;

  let requiredIncome = BASE_INCOME;
  if (data.dependants_joining > 0) {
    requiredIncome += SPOUSE_COST; // First dependant is spouse
    if (data.dependants_joining > 1) {
      requiredIncome += (data.dependants_joining - 1) * CHILD_COST; // Rest are children
    }
  }

  if (data.annual_gross_income_eur < requiredIncome) {
    score -= 30;
    feedback.push(
      tFeedback("incomeLow", {
        income: data.annual_gross_income_eur,
        threshold: requiredIncome,
      })
    );

    // R-Flag 9: Dependants Cost Penalty
    if (data.dependants_joining > 0) {
      score -= 5 * data.dependants_joining;
      feedback.push(
        tFeedback("dependantsPenalty", { count: data.dependants_joining })
      );
    }

    setAffiliateAction(3, {
      type: "BANKING",
      title: tAffiliate("financeTitle"),
      description: tAffiliate("financeDesc"),
      link: "https://example.com/accountant",
      buttonText: tAffiliate("financeBtn"),
    });
  }

  // R-Flag 10: Proof of Stability
  if (data.income_documentation_12m === "6M") {
    score -= 10;
    feedback.push(tFeedback("bankStatements6m"));
  } else if (data.income_documentation_12m === "LESS") {
    score -= 20;
    feedback.push(tFeedback("bankStatementsLess"));
    setAffiliateAction(3, {
      type: "BANKING",
      title: tAffiliate("docPrepTitle"),
      description: tAffiliate("docPrepDesc"),
      link: "https://example.com/docs",
      buttonText: tAffiliate("docPrepBtn"),
    });
  }

  // --- 4. ACCOMMODATION & INSURANCE ---

  // R-Flag 11: Housing Adequacy
  if (data.accommodation_proof === "TRANSITORY") {
    score -= 15;
    feedback.push(tFeedback("transitory"));
  } else if (data.accommodation_proof === "AIRBNB") {
    score -= 25;
    feedback.push(tFeedback("airbnb"));
    setAffiliateAction(3, {
      type: "HOUSING",
      title: tAffiliate("housingTitle"),
      description: tAffiliate("housingDesc"),
      link: "https://flatio.com/...",
      buttonText: tAffiliate("housingBtn"),
    });
  }

  // R-Flag 12: Insurance
  if (!data.health_insurance_min_30k) {
    score -= 10;
    feedback.push(tFeedback("insurance"));
    setAffiliateAction(2, {
      type: "INSURANCE",
      title: tAffiliate("insuranceTitle"),
      description: tAffiliate("insuranceDesc"),
      link: "https://safetywing.com/...",
      buttonText: tAffiliate("insuranceBtn"),
    });
  }

  // R-Flag 13: Passport Validity
  if (data.passport_validity_months < 15) {
    score -= 5;
    feedback.push(tFeedback("passport"));
  }

  // Clamp score to 0
  if (score < 0) score = 0;

  // Determine Status
  let status: CalculationResult["status"] = "WARNING";
  if (score >= 90) status = "APPROVED";
  else if (score < 60) status = "CRITICAL";

  return {
    score,
    status,
    feedback,
    affiliateAction,
  };
}
