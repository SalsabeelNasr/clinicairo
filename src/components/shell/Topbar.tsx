"use client"

import { usePathname } from "next/navigation"
import MobileSidebar from "@/components/shell/navigation/MobileSidebar"
import { getNavigationForRole } from "@/lib/navigation"
import type { NavKey, Role } from "@/lib/navigation"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { usePageHeader } from "@/contexts/page-header-context"

interface TopbarProps {
  role: Role
}

function getPageNavKey(pathname: string, role: Role): NavKey | null {
  const navigation = getNavigationForRole(role)

  // Check for exact matches first
  const exactMatch = navigation.find((item) => item.href === pathname)
  if (exactMatch) return exactMatch.navKey

  // Check for pathname starts with (for detail pages)
  const pathMatch = navigation.find((item) => {
    if (item.href === "/dashboard") return false
    if (item.href === "/tasks") return pathname === "/tasks"
    if (item.href === "/insights") return pathname === "/insights"
    return pathname.startsWith(item.href)
  })

  if (pathMatch) {
    if (pathname.startsWith("/patients/") && pathname !== "/patients") return "patients"
    if (pathname.startsWith("/appointments") && pathname !== "/appointments") return "appointments"
    return pathMatch.navKey
  }

  return null
}

export function Topbar({ role }: TopbarProps) {
  const pathname = usePathname()
  const t = useAppTranslations()
  const { mobileAction } = usePageHeader()
  const navKey = getPageNavKey(pathname, role)
  const pageTitle = navKey ? t.nav[navKey] : null
  const ActionIcon = mobileAction?.icon
  
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 shadow-sm   lg:hidden">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <MobileSidebar role={role} />
        {pageTitle && (
          <h1 className="truncate text-lg font-semibold text-gray-900">
            {pageTitle}
          </h1>
        )}
      </div>

      {mobileAction && (
        <button
          type="button"
          onClick={mobileAction.onClick}
          disabled={mobileAction.disabled}
          className="app-topbar__action"
        >
          {ActionIcon && (
            <ActionIcon className="app-topbar__action-icon" aria-hidden />
          )}
          <span className="truncate">{mobileAction.label}</span>
        </button>
      )}
    </header>
  )
}
