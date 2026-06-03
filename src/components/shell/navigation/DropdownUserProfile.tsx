"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  RiUserSettingsLine,
  RiLogoutBoxRLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiUser3Line,
  RiGlobalLine,
} from "@remixicon/react"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { useLocale } from "@/contexts/locale-context"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { cx, focusRing } from "@/lib/utils"
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
  const t = useAppTranslations()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSwitchUserOpen, setIsSwitchUserOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  const handleSignOut = () => {
    router.push("/")
  }

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const roleLabel =
    currentUser.role === "doctor" ? t.common.doctor :
    currentUser.role === "manager" ? t.common.manager :
    t.common.assistant

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
                <RiUserSettingsLine className="size-4 shrink-0 me-2" aria-hidden="true" />
                {t.common.switchUser}
              </DropdownMenuSubMenuTrigger>
              <DropdownMenuSubMenuContent>
                {allUsers.map((user) => (
                  <DropdownMenuItem
                    key={user.id}
                    onClick={() => setCurrentUser(user.id)}
                    className={user.id === currentUser.id ? "bg-gray-100 " : ""}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700  ">
                        {user.avatar_initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.full_name}</span>
                        <span className="text-xs text-gray-500 ">
                          {user.role === "doctor" ? t.common.doctor : user.role === "manager" ? t.common.manager : t.common.assistant}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubMenuContent>
            </DropdownMenuSubMenu>
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
          {/* Switch User Toggle */}
          <button
            onClick={() => setIsSwitchUserOpen(!isSwitchUserOpen)}
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100  "
          >
            <div className="flex items-center gap-2">
              <RiUserSettingsLine className="size-4" />
              <span>{t.common.switchUser}</span>
            </div>
            <RiArrowDownSLine className={cx("size-4 transition-transform", isSwitchUserOpen && "rotate-180")} />
          </button>
          
          {isSwitchUserOpen && (
            <div className="flex flex-col gap-1 ps-8 py-1">
              {allUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setCurrentUser(user.id)}
                  className={cx(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
                    user.id === currentUser.id
                      ? "bg-primary-50 text-primary-700  "
                      : "text-gray-600 hover:bg-gray-100  "
                  )}
                >
                  <div className="flex size-5 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-700  ">
                    {user.avatar_initials}
                  </div>
                  <span>{user.full_name}</span>
                </button>
              ))}
            </div>
          )}

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

          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50  "
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
