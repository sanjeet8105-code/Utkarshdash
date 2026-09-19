// Central map from a wizard step key to the table it saves into and which
// fields are allowed through. Used by /api/apply/save so the route can't be
// tricked into writing arbitrary columns.

export const STEP_CONFIG: Record<
  string,
  { table: string; fields: string[] }
> = {
  personal_info: {
    table: "personal_info",
    fields: ["full_name", "email"],
  },
  document: {
    table: "kyc_documents",
    fields: ["aadhar_number", "pan_number"],
  },
  address: {
    table: "addresses",
    fields: ["address", "pincode", "state", "city"],
  },
  loan: {
    table: "loan_details",
    fields: [
      "loan_amount",
      "loan_purpose",
      "tenure_months",
      "interest_rate",
      "emi",
    ],
  },
  bank: {
    table: "bank_details",
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
