"use client"

import { Badge } from "@/components/Badge"
import { getBadgeColor } from "@/lib/badgeColors"
import { RiPhoneLine, RiStethoscopeLine } from "@remixicon/react"
import Link from "next/link"
import type { PatientListItem } from "./patients.types"
import { calculateAge, getStatusBadgeVariant, getStatusLabel } from "./patients.utils"
import { useAppTranslations } from "@/lib/useAppTranslations"

interface PatientsTableProps {
  patients: PatientListItem[]
}

export function PatientsTable({ patients }: PatientsTableProps) {
  const t = useAppTranslations()
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500">
                {t.table.name}
              </th>
              <th className="px-5 py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500">
                {t.table.phone}
              </th>
              <th className="px-5 py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500">
                {t.table.lastAppointment}
              </th>
              <th className="px-5 py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500">
                {t.table.status}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white  ">
            {patients.map((patient) => {
              const age = calculateAge(patient.date_of_birth, patient.age)
              const ageDisplay = typeof age === "number" ? `${age}y` : age

              return (
                <tr
                  key={patient.id}
                  className="cursor-pointer transition-colors hover:bg-gray-50 "
                >
                  <td className="px-4 py-4">
                    <div>
                      <Link
                        href={`/patients/${patient.id}`}
                        className="app-entity-name"
                      >
                        {patient.first_name} {patient.last_name}
                      </Link>
                      <div className="mt-1 text-xs text-gray-600 ">
                        {ageDisplay} • {patient.gender || "—"}
                      </div>
                      {patient.complaint && (
                        <div className="mt-1 flex items-start gap-1.5 text-xs text-gray-600 ">
                          <RiStethoscopeLine className="mt-0.5 size-3 shrink-0" />
                          <span className="line-clamp-1 overflow-hidden text-ellipsis">{patient.complaint}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 rtl:flex-row-reverse text-sm text-gray-600 ">
                      <RiPhoneLine className="size-4 shrink-0" />
                      <span>{patient.phone}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 ">
                    {formatDate(patient.lastAppointmentDate)}
                  </td>
                  <td className="px-4 py-4">
<Badge color={getBadgeColor(getStatusBadgeVariant(patient.status))} size="xs">
                    {getStatusLabel(patient.status)}
                  </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
