"use client"

import React, { useEffect, useState } from "react"
import {
  getNavigationForRole,
  isActiveRoute,
  type Role,
} from "@/lib/navigation"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/Button"
import { Badge } from "@/components/Badge"
import { useFeatures } from "@/features/settings/useFeatures"
import { useLocale } from "@/contexts/locale-context"
import { cx, focusRing } from "@/lib/utils"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerClose,
} from "@/components/Drawer"
import { RiMenuLine, RiUser3Line } from "@remixicon/react"
import { DropdownUserProfile } from "./DropdownUserProfile"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { STAFF_ROLE_LABELS, type StaffRole } from "@/data/mock/users-clinics"

interface MobileSidebarProps {
  role: Role
}

export default function MobileSidebar({ role }: MobileSidebarProps) {
  const pathname = usePathname()
  const navigation = getNavigationForRole(role)
  const { currentUser } = useUserClinic()
  const { effective } = useFeatures()
  const { lang } = useLocale()
  const t = useAppTranslations()

  const [isRtl, setIsRtl] = useState(false)

  useEffect(() => {
    setIsRtl(document.documentElement.dir === "rtl")
  }, [])

  const roleLabel =
    STAFF_ROLE_LABELS[currentUser.role as StaffRole][lang]

  // Filter navigation based on feature flags
  const filteredNavigation = navigation.filter((item) => {
    if (!item.featureKey) return true
    return effective[item.featureKey] === true
  })

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            aria-label={t.common.openMenu}
            className="group flex items-center rounded-md p-2 text-sm font-medium hover:bg-gray-100 data-[state=open]:bg-gray-100 "
          >
            <RiMenuLine
              className="size-6 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </DrawerTrigger>
        <DrawerContent side={isRtl ? "right" : "left"} className="w-72">
          <DrawerHeader>
            <DrawerTitle className="text-lg font-semibold">CliniCairo</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="flex flex-col gap-6">
            <nav
              aria-label="Mobile navigation"
              className="flex-1"
            >
              <ul role="list" className="app-sidebar__nav-list">
                {filteredNavigation.map((item) => {
                  const active = isActiveRoute(item.href, pathname)

                  return (
                    <li key={item.navKey}>
                      <DrawerClose asChild>
                        <Link
                          href={item.href}
                          className={cx(
                            "app-sidebar__link app-sidebar__link--mobile group",
                            active && "app-sidebar__link--active",
                            focusRing
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="app-sidebar__link-icon" aria-hidden="true" />
                            <span className="app-sidebar__link-label">{t.nav[item.navKey]}</span>
                          </div>
                          {item.badge && item.badge > 0 && (
                            <Badge color="indigo" size="xs">{item.badge}</Badge>
                          )}
                        </Link>
                      </DrawerClose>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="mt-auto space-y-4 pt-4 border-t border-gray-200 ">
              {/* User Profile */}
              <DropdownUserProfile mode="dropdown">
                <button
                  className={cx(
                    "flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-left transition-colors",
                    "hover:bg-gray-100 hover:border-gray-300",
                    "   ",
                    focusRing
                  )}
                  aria-label="User settings"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700  ">
                    {currentUser.avatar_initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 ">
                      {currentUser.full_name}
                    </p>
                    <p className="truncate text-xs text-gray-500 ">
                      {roleLabel}
                    </p>
                  </div>
                  <RiUser3Line className="size-4 shrink-0 text-gray-500 " aria-hidden="true" />
                </button>
              </DropdownUserProfile>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
