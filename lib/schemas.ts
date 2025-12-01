// lib/schemas.ts
import { z } from "zod";

export const nomadVisaSchema = z.object({
  // 1. Eligibility & Status
  citizenship_non_eu: z
    .enum(["true", "false"], {
      message: "Required",
    })
    .transform((val) => val === "true"),
  work_status: z.enum(["REMOTE_EMPLOYEE", "FREELANCER", "ENTREPRENEUR"], {
    message: "Required",
  }),
  work_proof_available: z
    .enum(["true", "false"], {
      message: "Required",
    })
    .transform((val) => val === "true"),
  employer_location_outside_italy: z
    .enum(["true", "false"], {
      message: "Required",
    })
    .transform((val) => val === "true"),
  criminal_record_clean: z
    .enum(["true", "false"], {
      message: "Required",
    })
    .transform((val) => val === "true"),

  // 2. Qualification & Experience
  highest_qualification: z.enum(["BACHELOR", "EXP_5Y", "ICT_3Y", "NONE"], {
    message: "Required",
  }),
  remote_exp_months: z.coerce.number().min(0, "Required"),
  contract_duration_12m: z
    .enum(["true", "false"], {
      message: "Required",
    })
    .transform((val) => val === "true"),

  // 3. Financial Requirements
  annual_gross_income_eur: z.coerce.number().min(0, "Required"),
  dependants_joining: z.coerce.number().min(0),
  income_documentation_12m: z.enum(["12M", "6M", "LESS"], {
    message: "Required",
  }),

  // 4. Accommodation & Insurance
  accommodation_proof: z.enum(["LEASE_12M", "TRANSITORY", "AIRBNB"], {
    message: "Required",
  }),
  health_insurance_min_30k: z
    .enum(["true", "false"], {
      message: "Required",
    })
    .transform((val) => val === "true"),
  passport_validity_months: z.coerce.number().min(0, "Required"),
});

// Extract the type automatically so TypeScript knows what "FormData" looks like
export type NomadVisaForm = z.infer<typeof nomadVisaSchema>;

export const taxResidencySchema = z.object({
  // 1. Goal Setting
  primary_goal: z.enum(["TAX_SAVINGS", "LIFESTYLE", "FAMILY", "OTHER"], {
    message: "Required",
  }),
  target_year: z.coerce.number().min(2025, "Required"),
  arrival_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid Date",
  }),

  // 2. Home Country Confrontation
  home_country: z.enum(["US", "UK", "CA", "OTHER"], {
    message: "Required",
  }),
  max_days_home: z.coerce.number().min(0, "Required"),
});

export type TaxResidencyForm = z.infer<typeof taxResidencySchema>;
