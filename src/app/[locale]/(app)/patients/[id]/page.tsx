"use client"

import { useParams } from "next/navigation"
import { PatientProfilePage } from "@/features/patients/detail/PatientProfilePage"

export default function Page() {
  const params = useParams<{ id: string }>()
  return <PatientProfilePage patientId={params.id} />
}
