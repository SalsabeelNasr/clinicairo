"use client"

import React from "react"
import { RiSearchLine } from "@remixicon/react"
import { cx } from "@/lib/utils"

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearchChange?: (value: string) => void
  loading?: boolean
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearchChange, onChange, loading, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onSearchChange?.(e.target.value)
    }

    return (
      <div className={cx("app-search", className)}>
        <RiSearchLine className="app-search__icon" aria-hidden />
        <input
          ref={ref}
          type="text"
          onChange={handleChange}
          className="app-search__input"
          {...props}
        />
        {loading && (
          <span className="app-search__spinner">
            <span className="app-search__spinner-ring" />
          </span>
        )}
      </div>
    )
  },
)

SearchInput.displayName = "SearchInput"
