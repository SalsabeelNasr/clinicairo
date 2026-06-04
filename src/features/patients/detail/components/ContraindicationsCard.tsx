"use client"

import { useMemo, useState } from "react"
import { RiHealthBookLine } from "@remixicon/react"
import { Switch } from "@/components/Switch"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import type { Patient } from "@/features/patients/patients.types"
import {
  CONTRAINDICATION_KEYS,
  hasPatientFlag,
  type PatientFlagKey,
} from "../patient-profile.utils"
import { ProfileCollapsibleSlice } from "./ProfileExpandable"

const VISIBLE_COLLAPSED = 5

const CONDITION_LABELS: Record<PatientFlagKey, { ar: string; en: string }> = {
  is_diabetic: { ar: "سكري", en: "Diabetic" },
  is_hypertensive: { ar: "ضغط مرتفع", en: "Hypertensive" },
  has_pancreatitis: { ar: "التهاب البنكرياس", en: "Pancreatitis" },
  is_pregnant: { ar: "حمل", en: "Pregnant" },
  is_breastfeeding: { ar: "رضاعة", en: "Breastfeeding" },
  glp1a_previous_exposure: { ar: "تعرّض سابق GLP-1", en: "Prior GLP-1" },
  has_rheumatoid: { ar: "روماتويد", en: "Rheumatoid" },
  has_ihd: { ar: "IHD", en: "IHD" },
  has_heart_failure: { ar: "فشل قلبي", en: "Heart failure" },
  has_gerd: { ar: "ارتجاع", en: "GERD" },
  has_gastritis: { ar: "التهاب معدة", en: "Gastritis" },
  has_hepatic: { ar: "كبد", en: "Hepatic" },
  has_anaemia: { ar: "أنيميا", en: "Anemia" },
  has_bronchial_asthma: { ar: "ربو", en: "Asthma" },
}

interface ContraindicationsCardProps {
  patient: Patient
  onUpdate: (updates: Partial<Patient>) => Promise<void>
}

export function ContraindicationsCard({ patient, onUpdate }: ContraindicationsCardProps) {
  const t = useAppTranslations()
  const { lang } = useLocale()
  const [savingKey, setSavingKey] = useState<PatientFlagKey | null>(null)

  const sortedKeys = useMemo(() => {
    const active = CONTRAINDICATION_KEYS.filter((k) => hasPatientFlag(patient, k))
    const inactive = CONTRAINDICATION_KEYS.filter((k) => !hasPatientFlag(patient, k))
    return [...active, ...inactive]
  }, [patient])

  const handleToggle = async (key: PatientFlagKey, checked: boolean) => {
    setSavingKey(key)
    try {
      await onUpdate({ [key]: checked })
    } finally {
      setSavingKey(null)
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs">
      <div className="border-b border-gray-100 bg-gray-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <RiHealthBookLine className="size-4 text-primary-600" aria-hidden />
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
            {t.profile.section.contraindications}
          </h3>
        </div>
      </div>

      <ProfileCollapsibleSlice
        collapsedCount={VISIBLE_COLLAPSED}
        totalCount={sortedKeys.length}
      >
        {(expanded) => {
          const visibleKeys = expanded
            ? sortedKeys
            : sortedKeys.slice(0, VISIBLE_COLLAPSED)
          return (
            <div className="divide-y divide-gray-100 p-2">
              {visibleKeys.map((key) => {
                const checked = hasPatientFlag(patient, key)
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 rtl:flex-row-reverse"
                  >
                    <span className="min-w-0 flex-1 text-theme-sm font-medium text-gray-800">
                      {CONDITION_LABELS[key][lang]}
                    </span>
                    <Switch
                      checked={checked}
                      disabled={savingKey === key}
                      onCheckedChange={(value) => handleToggle(key, value)}
                      aria-label={CONDITION_LABELS[key][lang]}
                    />
                  </div>
                )
              })}
            </div>
          )
        }}
      </ProfileCollapsibleSlice>
    </section>
  )
}
