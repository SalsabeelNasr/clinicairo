"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDemo } from "@/contexts/demo-context"

export function DemoAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isDemoMode } = useDemo()

  useEffect(() => {
    if (!isDemoMode) {
      router.replace("/login")
    }
  }, [isDemoMode, router])

  if (!isDemoMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Loading...
      </div>
    )
  }

  return <>{children}</>
}
