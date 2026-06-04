"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { RemixiconComponentType } from "@remixicon/react"

export interface MobileTopbarAction {
  label: ReactNode
  icon?: RemixiconComponentType
  onClick: () => void
  disabled?: boolean
}

interface PageHeaderContextValue {
  mobileAction: MobileTopbarAction | null
  setMobileAction: (action: MobileTopbarAction | null) => void
}

const PageHeaderContext = createContext<PageHeaderContextValue | null>(null)

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [mobileAction, setMobileActionState] = useState<MobileTopbarAction | null>(
    null
  )

  const setMobileAction = useCallback((action: MobileTopbarAction | null) => {
    setMobileActionState(action)
  }, [])

  const value = useMemo(
    () => ({ mobileAction, setMobileAction }),
    [mobileAction, setMobileAction]
  )

  return (
    <PageHeaderContext.Provider value={value}>
      {children}
    </PageHeaderContext.Provider>
  )
}

export function usePageHeader() {
  const context = useContext(PageHeaderContext)
  return (
    context ?? {
      mobileAction: null,
      setMobileAction: () => {},
    }
  )
}
