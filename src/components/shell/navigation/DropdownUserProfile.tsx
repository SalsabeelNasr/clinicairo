"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  RiLogoutBoxRLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiGlobalLine,
  RiSwitchLine,
} from "@remixicon/react"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { useLocale } from "@/contexts/locale-context"
import { useDemo } from "@/contexts/demo-context"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { cx, focusRing } from "@/lib/utils"
import { STAFF_ROLE_LABELS, type StaffRole } from "@/data/mock/users-clinics"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubMenu,
  DropdownMenuSubMenuContent,
  DropdownMenuSubMenuTrigger,
  DropdownMenuTrigger,
} from "@/components/Dropdown"
import { Tooltip } from "@/components/Tooltip"

interface SidebarUserProfileProps {
  mode: "dropdown" | "inline" | "collapsed"
  align?: "center" | "start" | "end"
  children?: React.ReactNode
}

export function SidebarUserProfile({ mode, align = "start", children }: SidebarUserProfileProps) {
  const router = useRouter()
  const { currentUser, allUsers, setCurrentUser } = useUserClinic()
  const { isRtl, lang, setLanguage } = useLocale()
  const { disableDemoMode } = useDemo()
  const t = useAppTranslations()
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  const handleSignOut = () => {
    disableDemoMode()
    router.push("/login")
  }

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const roleLabel =
    STAFF_ROLE_LABELS[currentUser.role as StaffRole][lang]

  // Desktop modes (Expanded & Collapsed) use Dropdown
  if (mode === "dropdown" || mode === "collapsed") {
    const triggerButton = children ? children : (
      <button
        className={cx(
          "app-sidebar__profile-trigger",
          mode === "collapsed" ? "app-sidebar__profile-trigger--collapsed" : "app-sidebar__profile-trigger--expanded",
          focusRing
        )}
        aria-label="User settings"
      >
        {mode === "dropdown" ? (
          <>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
              {currentUser.avatar_initials}
            </div>
            <div className="flex-1 min-w-0 text-start">
              <p className="app-sidebar__profile-name">
                {currentUser.full_name}
              </p>
              <p className="app-sidebar__profile-role">
                {roleLabel}
              </p>
            </div>
          </>
        ) : (
          <div className="flex size-5 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-700  ">
            {currentUser.avatar_initials}
          </div>
        )}
      </button>
    )

    return (
      <DropdownMenu>
        {mode === "collapsed" ? (
          <Tooltip content={currentUser.full_name} side={isRtl ? "left" : "right"}>
            <DropdownMenuTrigger asChild>
              {triggerButton}
            </DropdownMenuTrigger>
          </Tooltip>
        ) : (
          <DropdownMenuTrigger asChild>
            {triggerButton}
          </DropdownMenuTrigger>
        )}
        <DropdownMenuContent
          align={align}
          side={mode === "collapsed" ? (isRtl ? "left" : "right") : "top"}
          className="w-64"
        >
          <DropdownMenuLabel>
            <div className="flex items-center gap-3 px-1 py-1.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700  ">
                {currentUser.avatar_initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="truncate text-sm font-medium text-gray-900 ">{currentUser.full_name}</span>
                <span className="truncate text-xs text-gray-500 ">{currentUser.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSubMenu>
              <DropdownMenuSubMenuTrigger>
                <RiGlobalLine className="size-4 shrink-0 me-2" aria-hidden="true" />
                {lang === "ar" ? "اللغة" : "Language"}
              </DropdownMenuSubMenuTrigger>
              <DropdownMenuSubMenuContent>
                <DropdownMenuRadioGroup
                  value={lang}
                  onValueChange={(v) => setLanguage(v as "ar" | "en")}
                >
                  <DropdownMenuRadioItem value="ar" iconType="check">
                    العربية
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="en" iconType="check">
                    English
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubMenuContent>
            </DropdownMenuSubMenu>

            <DropdownMenuSubMenu>
              <DropdownMenuSubMenuTrigger>
                <RiSwitchLine className="size-4 shrink-0 me-2" aria-hidden="true" />
                {lang === "ar" ? "تبديل المستخدم (ديمو)" : "Switch User (demo)"}
              </DropdownMenuSubMenuTrigger>
              <DropdownMenuSubMenuContent>
                <DropdownMenuRadioGroup
                  value={currentUser.id}
                  onValueChange={(v) => setCurrentUser(v)}
                >
                  {allUsers.map((u) => (
                    <DropdownMenuRadioItem key={u.id} value={u.id} iconType="check">
                      <span className="font-medium">{u.full_name}</span>
                      <span className="ms-1.5 text-xs text-gray-500">
                        · {STAFF_ROLE_LABELS[u.role as StaffRole][lang]}
                      </span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubMenuContent>
            </DropdownMenuSubMenu>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="text-red-600  focus:bg-red-50 focus:"
          >
            <RiLogoutBoxRLine className="size-4 shrink-0 me-2" />
            {t.common.signOut}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Inline Mode (Mobile Drawer)
  return (
    <div className="flex flex-col gap-1 w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cx(
          "flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-left transition-colors",
          "hover:bg-gray-100 hover:border-gray-300",
          "   ",
          focusRing
        )}
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
        {isOpen ? (
          <RiArrowUpSLine className="size-4 shrink-0 text-gray-500" />
        ) : (
          <RiArrowDownSLine className="size-4 shrink-0 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="flex flex-col gap-0.5 ps-3 pt-1">
          {/* Language */}
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700">
            <RiGlobalLine className="size-4" />
            <div className="flex gap-1">
              {(["ar", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={cx(
                    "rounded-md px-2 py-1 text-xs transition-colors",
                    lang === l
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {l === "ar" ? "العربية" : "English"}
                </button>
              ))}
            </div>
          </div>

          {/* Demo: switch user */}
          <div className="px-3 py-1.5">
            <p className="mb-1 flex items-center gap-1 text-xs text-gray-500">
              <RiSwitchLine className="size-3.5" />
              {lang === "ar" ? "تبديل المستخدم (ديمو)" : "Switch user (demo)"}
            </p>
            <div className="flex flex-col gap-0.5">
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setCurrentUser(u.id)}
                  className={cx(
                    "rounded-md px-2 py-1 text-start text-xs transition-colors",
                    currentUser.id === u.id
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {u.full_name}
                  <span className="ms-1 text-gray-400">· {STAFF_ROLE_LABELS[u.role as StaffRole][lang]}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <RiLogoutBoxRLine className="size-4" />
            <span>{t.common.signOut}</span>
          </button>
        </div>
      )}
    </div>
  )
}

export { SidebarUserProfile as DropdownUserProfile }
