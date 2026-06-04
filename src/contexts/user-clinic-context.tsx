"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import {
  mockUsers,
  mockClinics,
  DEFAULT_CURRENT_USER_ID,
  DEFAULT_CURRENT_CLINIC_ID,
  type MockUser,
  type MockClinic,
  type StaffRole,
} from "@/data/mock/users-clinics"

interface UserClinicContextType {
  currentUser: MockUser
  currentClinic: MockClinic
  role: StaffRole
  setCurrentUser: (userId: string) => void
  setCurrentClinic: (clinicId: string) => void
  allUsers: MockUser[]
  allClinics: MockClinic[]
}

const UserClinicContext = createContext<UserClinicContextType | undefined>(
  undefined
)

const LS_USER_KEY = "clinicairo-demo-user"
const LS_CLINIC_KEY = "currentClinicId"

export function UserClinicProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentUserId, setCurrentUserIdState] = useState<string>(DEFAULT_CURRENT_USER_ID)
  const [currentClinicId, setCurrentClinicId] = useState<string>(DEFAULT_CURRENT_CLINIC_ID)

  // Load persisted selections on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(LS_USER_KEY)
    if (savedUser && mockUsers.some((u) => u.id === savedUser)) {
      setCurrentUserIdState(savedUser)
    }
    const savedClinic = localStorage.getItem(LS_CLINIC_KEY)
    if (savedClinic) setCurrentClinicId(savedClinic)
  }, [])

  const currentUser = mockUsers.find((u) => u.id === currentUserId) || mockUsers[0]
  const currentClinic = mockClinics.find((c) => c.id === currentClinicId) || mockClinics[0]

  const setCurrentUser = (userId: string) => {
    setCurrentUserIdState(userId)
    localStorage.setItem(LS_USER_KEY, userId)
  }

  const setCurrentClinic = (clinicId: string) => {
    setCurrentClinicId(clinicId)
    localStorage.setItem(LS_CLINIC_KEY, clinicId)
  }

  return (
    <UserClinicContext.Provider
      value={{
        currentUser,
        currentClinic,
        role: currentUser.role,
        setCurrentUser,
        setCurrentClinic,
        allUsers: mockUsers,
        allClinics: mockClinics,
      }}
    >
      {children}
    </UserClinicContext.Provider>
  )
}

export function useUserClinic() {
  const context = useContext(UserClinicContext)
  if (context === undefined) {
    throw new Error("useUserClinic must be used within a UserClinicProvider")
  }
  return context
}
