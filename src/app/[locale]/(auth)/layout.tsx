import type { ReactNode } from "react";
import { AppProviders } from "@/components/providers/AppProviders";

// Auth pages render full-screen (no AppShell). Staff only.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}
