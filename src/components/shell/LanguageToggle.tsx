"use client"

import { useLocale } from "@/contexts/locale-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/Dropdown"
import { RiGlobalLine, RiCheckLine } from "@remixicon/react"

/**
 * In-app Arabic/English switch (staff app only — NOT the marketing site).
 * Backed by the app locale context (persisted), used on login + the user menu.
 */
export function LanguageToggle({
  align = "end",
}: {
  align?: "start" | "center" | "end"
}) {
  const { lang, setLanguage } = useLocale()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          <RiGlobalLine className="size-4 shrink-0" />
          <span>{lang === "ar" ? "العربية" : "English"}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-32">
        <DropdownMenuItem onClick={() => setLanguage("ar")} className="justify-between">
          <span className={lang === "ar" ? "font-semibold" : ""}>العربية</span>
          {lang === "ar" && <RiCheckLine className="size-4 text-primary-600" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("en")} className="justify-between">
          <span className={lang === "en" ? "font-semibold" : ""}>English</span>
          {lang === "en" && <RiCheckLine className="size-4 text-primary-600" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
