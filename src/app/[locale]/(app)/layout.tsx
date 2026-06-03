import type { ReactNode } from "react";
import { AppProviders } from "@/components/providers/AppProviders";
import { AppShell } from "@/components/shell/AppShell";

// Authenticated staff app (spec §1: patients never log in). Real Supabase Auth
// gating lands in Phase 9; the mock session resolves a demo staff user for now.
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppProviders>
      <AppShell>{children}</AppShell>
    </AppProviders>
  );
}
