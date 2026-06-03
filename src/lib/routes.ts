export const ROUTES = {
  home: "/",
  // doctor: (slug: string) => `/doctors/${slug}` as const,
  information: "/information",
  pricing: "/pricing",
  terms: "/terms",
  // Staff realm. Login UI is live (mock auth); real Supabase Auth lands in Phase 9.
  staff: "/login",
  login: "/login",
  dashboard: "/dashboard",
} as const;
