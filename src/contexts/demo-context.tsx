"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { mockQueries } from "@/data/mock/mock-queries"
import * as mockData from "@/data/mock/mock-data"
import { initializeRepositories, getBackendType, resetRepositories } from "@/lib/api/repository-factory"

const DEMO_AUTH_STORAGE_KEY = "clinicairo-demo-authenticated"

interface DemoContextType {
  isDemoMode: boolean
  enableDemoMode: () => void
  disableDemoMode: () => void
  demoDoctor: typeof mockData.mockDoctor
  demoPatients: typeof mockData.mockPatients
  mockQueries: typeof mockQueries
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export function DemoProvider({ children }: { children: React.ReactNode }) {
  // Initialize from localStorage to prevent flash of empty state
  const [isDemoMode, setIsDemoMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(DEMO_AUTH_STORAGE_KEY) === "true"
    }
    return false
  })

  useEffect(() => {
    const storedDemoMode = localStorage.getItem(DEMO_AUTH_STORAGE_KEY)
    if (storedDemoMode === "true") {
      setIsDemoMode(true)
    } else {
      setIsDemoMode(false)
    }
  }, [])

  useEffect(() => {
    const backend = isDemoMode ? "mock" : getBackendType()
    resetRepositories()
    initializeRepositories(backend)
  }, [isDemoMode])

  const enableDemoMode = useCallback(() => {
    setIsDemoMode(true)
    localStorage.setItem(DEMO_AUTH_STORAGE_KEY, "true")
  }, [])

  const disableDemoMode = useCallback(() => {
    setIsDemoMode(false)
    localStorage.removeItem(DEMO_AUTH_STORAGE_KEY)
    localStorage.removeItem("demo-mode")
  }, [])

  const value: DemoContextType = {
    isDemoMode,
    enableDemoMode,
    disableDemoMode,
    demoDoctor: mockData.mockDoctor,
    demoPatients: mockData.mockPatients,
    mockQueries,
  }

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error("useDemo must be used within a DemoProvider")
  }
  return context
}

