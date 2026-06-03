import type { RemixiconComponentType } from "@remixicon/react";
import {
  RiHomeLine,
  RiUserLine,
  RiCalendarLine,
  RiTaskLine,
  RiUserStarLine,
  RiMoneyDollarCircleLine,
  RiBarChart2Line,
} from "@remixicon/react";
import type { FeatureKey } from "@/features/settings/settings.types";

// CliniCairo nav. DROP list removed (no Insights/Bot/Archive — spec §4.3/§8).
// Accounting/Leads/Settings are added as their pages land in later phases.
export type NavKey = "dashboard" | "patients" | "appointments" | "leads" | "tasks" | "accounting" | "analytics";

export type NavItem = {
  name: string;
  navKey: NavKey;
  href: string;
  icon: RemixiconComponentType;
  badge?: number;
  /** Optional feature gate (unused at launch — all items show). */
  featureKey?: FeatureKey;
};

export type Role = "doctor" | "assistant" | "manager";

const navigation: NavItem[] = [
  { name: "Dashboard", navKey: "dashboard", href: "/dashboard", icon: RiHomeLine },
  { name: "Patients", navKey: "patients", href: "/patients", icon: RiUserLine },
  { name: "Appointments", navKey: "appointments", href: "/appointments", icon: RiCalendarLine },
  { name: "Leads", navKey: "leads", href: "/leads", icon: RiUserStarLine },
  { name: "Tasks", navKey: "tasks", href: "/tasks", icon: RiTaskLine },
  { name: "Accounting", navKey: "accounting", href: "/accounting", icon: RiMoneyDollarCircleLine },
  { name: "Analytics", navKey: "analytics", href: "/analytics", icon: RiBarChart2Line },
];

export const doctorNavigation = navigation;
export const assistantNavigation = navigation;
export const managerNavigation = navigation;

export function getNavigationForRole(_role: Role): NavItem[] {
  return navigation;
}

export function isActiveRoute(itemHref: string, pathname: string): boolean {
  if (itemHref === "/dashboard") return pathname === "/dashboard";
  if (itemHref === "/tasks") return pathname === "/tasks";
  return pathname.startsWith(itemHref);
}
