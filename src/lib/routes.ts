export const ROUTES = {
  home: "/",
  doctor: (slug: string) => `/doctors/${slug}` as const,
  information: "/information",
  pricing: "/pricing",
  terms: "/terms",
} as const;
