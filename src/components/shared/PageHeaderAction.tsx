"use client"

import React, { useEffect } from "react"
import type { RemixiconComponentType } from "@remixicon/react"
import { usePageHeader } from "@/contexts/page-header-context"
import { cx } from "@/lib/utils"

interface PageHeaderActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: RemixiconComponentType
  children: React.ReactNode
  /** When true (default), mirrors this button in the mobile top bar. */
  pinToMobileTopbar?: boolean
}

export function PageHeaderAction({
  icon: Icon,
  children,
  className,
  type = "button",
  pinToMobileTopbar = true,
  onClick,
  disabled,
  ...props
}: PageHeaderActionProps) {
  const { setMobileAction } = usePageHeader()

  useEffect(() => {
    if (!pinToMobileTopbar || !onClick) return

    setMobileAction({
      label: children,
      icon: Icon,
      onClick: onClick as () => void,
      disabled,
    })

    return () => setMobileAction(null)
  }, [pinToMobileTopbar, children, Icon, onClick, disabled, setMobileAction])

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "app-page-header__btn",
        pinToMobileTopbar && "hidden lg:inline-flex",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="app-page-header__btn-icon" aria-hidden />}
      {children}
    </button>
  )
}
