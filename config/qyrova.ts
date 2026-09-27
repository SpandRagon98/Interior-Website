// This ID is intentionally public: the receiving endpoint also verifies the
// requesting website origin, rate-limits submissions and accepts no database key.
export const qyrovaInteriorLead = {
  endpoint: "https://pczyjzkcmssxgqmzrona.supabase.co/functions/v1/website-lead",
  formId: "eb1f1281-6fed-4fde-b8f4-4e7ae5cf04c0",
} as const;
