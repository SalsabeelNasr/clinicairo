"use client";

import { LocaleProvider } from "@/contexts/locale-context";
import { DemoProvider } from "@/contexts/demo-context";
import { UserClinicProvider } from "@/contexts/user-clinic-context";
import { ToastProvider } from "@/hooks/useToast";
import { LocaleSync } from "@/components/LocaleSync";

/**
 * Provider stack for the staff app + auth pages. Scoped to the (app) and (auth)
 * route groups so the marketing site keeps using next-intl untouched.
 * Light mode only — no theme provider (dark mode removed).
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <LocaleSync />
      <DemoProvider>
        <UserClinicProvider>
          <ToastProvider>{children}</ToastProvider>
        </UserClinicProvider>
      </DemoProvider>
    </LocaleProvider>
  );
}
