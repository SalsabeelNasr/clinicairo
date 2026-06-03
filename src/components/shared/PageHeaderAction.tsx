"use client"

import React from "react"
import type { RemixiconComponentType } from "@remixicon/react"
import { cx } from "@/lib/utils"

interface PageHeaderActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: RemixiconComponentType
  children: React.ReactNode
}

export function PageHeaderAction({
  icon: Icon,
  children,
  className,
  type = "button",
  ...props
}: PageHeaderActionProps) {
  return (
    <button type={type} className={cx("app-page-header__btn", className)} {...props}>
      {Icon && <Icon className="app-page-header__btn-icon" aria-hidden />}
      {children}
    </button>
  )
}
