// Central map from a wizard step key to which columns on the single
// `applicants` table it's allowed to write. Used by /api/apply/save so the
// route can't be tricked into writing arbitrary columns.

export const STEP_CONFIG: Record<string, { fields: string[] }> = {
  personal_info: {
    fields: ["full_name", "email"],
  },
  document: {
    fields: ["aadhar_number", "pan_number"],
  },
  address: {
    fields: ["address", "pincode", "state", "city"],
  },
  loan: {
    fields: [
      "loan_amount",
      "loan_purpose",
      "tenure_months",
      "interest_rate",
      "emi",
    ],
  },
  bank: {
    fields: [
      "account_holder_name",
      "account_number",
      "ifsc_code",
      "account_type",
      "bank_name",
      "branch",
    ],
  },
};

export const STEP_ORDER = ["personal_info", "document", "address", "loan", "bank"];
