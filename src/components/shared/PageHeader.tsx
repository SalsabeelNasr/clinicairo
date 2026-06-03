// Tremor Raw PageHeader [v0.0.0]

import React from "react"
import { cx } from "@/lib/utils"

interface PageHeaderProps {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, actions }, forwardedRef) => (
    <header
      ref={forwardedRef}
      className={cx(
        "app-page-header",
        (description || actions) && "app-page-header--stacked",
        className,
      )}
    >
      <div className="app-page-header__text">
        <h1 className="app-page-title">{title}</h1>
        {description && (
          <p className="app-page-description">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </header>
  ),
)

PageHeader.displayName = "PageHeader"

export { PageHeader, type PageHeaderProps }
