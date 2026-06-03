"use client"

import { Badge } from "@/components/Badge"
import { Tooltip } from "@/components/Tooltip"
import { cx, focusRing } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { useFeatures } from "@/features/settings/useFeatures"
import { useLocale } from "@/contexts/locale-context"
import { useAppTranslations } from "@/lib/useAppTranslations"
import {
  getNavigationForRole,
  isActiveRoute,
  type Role,
} from "@/lib/navigation"
import {
  RiMenuFoldLine,
  RiMenuUnfoldLine,
} from "@remixicon/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BrandLogo } from "@/components/brand-logo"
import { SidebarUserProfile } from "./navigation/DropdownUserProfile"

interface SidebarProps {
  role: Role
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const navigation = getNavigationForRole(role)
  const { effective } = useFeatures()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { isRtl } = useLocale()
  const t = useAppTranslations()

  // Filter navigation based on feature flags
  const filteredNavigation = navigation.filter((item) => {
    if (!item.featureKey) return true
    return effective[item.featureKey] === true
  })

  return (
    <>
      {/* Desktop Sidebar (collapsible) */}
      <aside
        className={cx(
          "fixed start-0 top-0 z-50 hidden h-screen flex-col border-e border-gray-200 bg-white transition-all duration-300 ease-in-out   lg:flex",
          isCollapsed ? "w-16" : "w-72"
        )}
      >
        {/* Expand/Collapse Button Section with Logo */}
        <div
          className={cx(
            "flex h-16 items-center border-b border-gray-200 ",
            isCollapsed ? "px-2 justify-center" : "px-4 justify-between gap-3"
          )}
        >
          {!isCollapsed && (
            <Link
              href="/dashboard"
              className={cx(
                "flex flex-1 min-w-0 items-center rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100",
                focusRing
              )}
            >
              <BrandLogo className="text-xl" />
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className={cx(
              "group flex items-center rounded-lg text-sm font-medium transition-colors shrink-0",
              isCollapsed ? "size-9 justify-center" : "size-9 justify-center",
              "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              "  ",
              focusRing
            )}
            aria-label={isCollapsed ? t.common.expandSidebar : t.common.collapseSidebar}
          >
            {isCollapsed ? (
              <RiMenuUnfoldLine className="size-5 shrink-0" />
            ) : (
              <RiMenuFoldLine className="size-5" />
            )}
          </button>
        </div>

        {/* Navigation Section */}
        <nav
          className={cx(
            "app-sidebar__nav",
            isCollapsed ? "px-2" : "px-4",
          )}
          aria-label="Sidebar navigation"
        >
          <ul className="app-sidebar__nav-list">
            {filteredNavigation.map((item) => {
              const active = isActiveRoute(item.href, pathname)

              const linkContent = (
                <Link
                  href={item.href}
                  className={cx(
                    "app-sidebar__link group",
                    isCollapsed ? "app-sidebar__link--collapsed" : "app-sidebar__link--expanded",
                    active && "app-sidebar__link--active",
                    focusRing
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <item.icon className="app-sidebar__link-icon" aria-hidden="true" />
                  {!isCollapsed && (
                    <>
                      <span className="app-sidebar__link-label">{t.nav[item.navKey]}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="ms-auto">
                          <Badge color="indigo" size="xs">
                            {item.badge}
                          </Badge>
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )

              return (
                <li key={item.navKey}>
                  {isCollapsed ? (
                    <Tooltip content={t.nav[item.navKey]} side={isRtl ? "left" : "right"}>
                      {linkContent}
                    </Tooltip>
                  ) : (
                    linkContent
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Section - Clinic Switcher & User Menu */}
        <div
          className={cx(
            "border-t border-gray-200 ",
            isCollapsed ? "p-2" : "p-4"
          )}
        >
          <div className="space-y-1">
            <SidebarUserProfile mode={isCollapsed ? "collapsed" : "dropdown"} align="end" />
          </div>
        </div>
      </aside>
    </>
  )
}
