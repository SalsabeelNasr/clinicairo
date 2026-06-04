import type { RemixiconComponentType } from "@remixicon/react";
import {
  RiHomeLine,
  RiUserLine,
  RiCalendarLine,
  RiTaskLine,
  RiUserStarLine,
  RiMoneyDollarCircleLine,
  RiBarChart2Line,
  RiArchiveLine,
  RiSettings3Line,
} from "@remixicon/react";
import type { FeatureKey } from "@/features/settings/settings.types";
import type { StaffRole } from "@/data/mock/users-clinics";

// CliniCairo nav. Insights/Bot are intentionally dropped; Archive is retained
// as a staff history browser in the frontend-only plan.
export type NavKey =
  | "dashboard"
  | "patients"
  | "appointments"
  | "leads"
  | "tasks"
  | "accounting"
  | "analytics"
  | "archive"
  | "settings";

export type NavItem = {
  name: string;
  navKey: NavKey;
  href: string;
  icon: RemixiconComponentType;
  badge?: number;
  /** Optional feature gate (unused at launch — all items show). */
  featureKey?: FeatureKey;
  allowedRoles?: StaffRole[];
};

export type Role = StaffRole;

const navigation: NavItem[] = [
  { name: "Dashboard", navKey: "dashboard", href: "/dashboard", icon: RiHomeLine },
  { name: "Patients", navKey: "patients", href: "/patients", icon: RiUserLine },
  { name: "Appointments", navKey: "appointments", href: "/appointments", icon: RiCalendarLine },
  { name: "Leads", navKey: "leads", href: "/leads", icon: RiUserStarLine },
  { name: "Tasks", navKey: "tasks", href: "/tasks", icon: RiTaskLine },
  { name: "Accounting", navKey: "accounting", href: "/accounting", icon: RiMoneyDollarCircleLine },
  { name: "Analytics", navKey: "analytics", href: "/analytics", icon: RiBarChart2Line },
  { name: "Archive", navKey: "archive", href: "/archive", icon: RiArchiveLine },
  { name: "Settings", navKey: "settings", href: "/settings", icon: RiSettings3Line, allowedRoles: ["owner"] },
];

export const doctorNavigation = navigation;
export const assistantNavigation = navigation;
export const ownerNavigation = navigation;
export const nutritionistNavigation = navigation;
export const coachNavigation = navigation;

export function getNavigationForRole(role: Role): NavItem[] {
  return navigation.filter((item) => !item.allowedRoles || item.allowedRoles.includes(role));
}

export function isActiveRoute(itemHref: string, pathname: string): boolean {
  if (itemHref === "/dashboard") return pathname === "/dashboard";
  if (itemHref === "/tasks") return pathname === "/tasks";
  return pathname.startsWith(itemHref);
}
