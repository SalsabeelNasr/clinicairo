"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { getAppointmentsRepository } from "@/lib/api/repository-factory"
import { DEMO_CLINIC_ID } from "@/lib/constants"
import { getById as getPatientById, update as updatePatientApi } from "@/api/patients.api"
import { mockData } from "@/data/mock/mock-data"
import type { MockSubscription } from "@/data/mock/subscriptions"
import type { MockPayment } from "@/data/mock/payments"
import type { MockVisitNote } from "@/data/mock/visit-notes"
import type { Patient } from "@/features/patients/patients.types"
import {
  createVisitNote,
  deleteVisitNote,
  listVisitNotesByPatient,
  updateVisitNote,
  type CreateVisitNotePayload,
  type VisitNoteSubmitPayload,
} from "./visit-notes.api"
import type { LabResultFormPayload } from "./lab-result.types"
import type { InjectionFormPayload } from "./injection.types"
import {
  createPastMedication,
  createPastProcedure,
  deletePastMedication,
  deletePastProcedure,
  updatePastMedication,
  updatePastProcedure,
} from "@/features/prescriptions/prescriptions.api"
import type {
  CreatePastMedicationPayload,
  CreatePastProcedurePayload,
} from "@/features/prescriptions/prescriptions.types"
import { buildPastHistoryItems } from "./past-history.utils"
import { listPaymentsByPatient, verifyPayment } from "./payments-profile.api"
import type { DietFormPayload } from "./patient-diet.types"
import type { TrainingPlanFormPayload } from "./patient-training-plan.types"
import type { PrescriptionFormPayload } from "./patient-prescription.types"

export interface ProfileAppointment {
  id: string
  patient_id: string
  patient_name: string
  scheduled_at: string
  status: string
  type: string
  notes: string | null
  created_at: string
  doctor_id: string | null
  online_call_link?: string
}

export function usePatientPageData(patientId: string) {
  const [loading, setLoading] = useState(true)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [appointments, setAppointments] = useState<ProfileAppointment[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getPatientById(patientId)
      .then((p) => {
        if (!cancelled) setPatient(p)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [patientId, refreshKey])

  const weights = useMemo(() => {
    if (!patient) return []
    return mockData.weightLogs
      .filter((w) => w.patient_id === patient.id)
      .sort((a, b) => a.recorded_date.localeCompare(b.recorded_date))
  }, [patient, refreshKey])

  const injections = useMemo(() => {
    if (!patient) return []
    return mockData.injections
      .filter((i) => i.patient_id === patient.id)
      .sort((a, b) => b.injection_date.localeCompare(a.injection_date))
  }, [patient, refreshKey])

  const visitNotes = useMemo(() => {
    if (!patient) return []
    return listVisitNotesByPatient(patient.id)
  }, [patient, refreshKey])

  const payments = useMemo(() => {
    if (!patient) return []
    return listPaymentsByPatient(patient.id)
  }, [patient, refreshKey])

  const subscription = useMemo((): MockSubscription | null => {
    if (!patient) return null
    return mockData.subscriptions.find((s) => s.patient_id === patient.id) ?? null
  }, [patient, refreshKey])

  useEffect(() => {
    if (!patient) {
      setAppointments([])
      return
    }
    let cancelled = false
    const mockById = new Map(mockData.appointments.map((a) => [a.id, a]))

    ;(async () => {
      try {
        const repo = await getAppointmentsRepository()
        const rows = await repo.getAppointments(DEMO_CLINIC_ID)
        const mapped: ProfileAppointment[] = rows
          .filter((row) => row.patient_id === patient.id)
          .map((row) => {
            const mock = mockById.get(row.id)
            return {
              id: row.id,
              patient_id: row.patient_id,
              patient_name: row.patient_name ?? mock?.patient_name ?? "",
              scheduled_at: row.scheduled_at,
              status: row.status,
              type: row.type ?? mock?.type ?? "consultation",
              notes: row.notes,
              created_at: row.created_at,
              doctor_id: row.doctor_id ?? null,
              online_call_link: mock?.online_call_link,
            }
          })
          .sort((a, b) => b.scheduled_at.localeCompare(a.scheduled_at))
        if (!cancelled) setAppointments(mapped)
      } catch {
        if (!cancelled) {
          setAppointments(
            mockData.appointments
              .filter((a) => a.patient_id === patient.id)
              .map((a) => ({
                id: a.id,
                patient_id: a.patient_id,
                patient_name: a.patient_name,
                scheduled_at: a.scheduled_at,
                status: a.status,
                type: a.type,
                notes: a.notes,
                created_at: a.created_at,
                doctor_id: a.doctor_id,
                online_call_link: a.online_call_link,
              }))
              .sort((a, b) => b.scheduled_at.localeCompare(a.scheduled_at)),
          )
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [patient, refreshKey])

  const upcomingAppointment = useMemo(() => {
    return appointments
      .filter((a) => ["scheduled", "confirmed", "in_progress", "arrived"].includes(a.status))
      .filter((a) => new Date(a.scheduled_at).getTime() >= Date.now())
      .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at))[0] ?? null
  }, [appointments])

  const lastAppointment = useMemo(() => {
    const now = Date.now()
    return appointments.find((a) => new Date(a.scheduled_at).getTime() < now) ?? null
  }, [appointments])

  const prescriptions = useMemo(() => {
    if (!patient) return []
    return mockData.patientPrescriptionFiles
      .filter((p) => p.patient_id === patient.id)
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
  }, [patient, refreshKey])

  const pastMedications = useMemo(() => {
    if (!patient) return []
    return mockData.pastMedications
      .filter((m) => m.patientId === patient.id)
      .sort((a, b) => b.takenFrom.localeCompare(a.takenFrom))
  }, [patient, refreshKey])

  const pastProcedures = useMemo(() => {
    if (!patient) return []
    return mockData.pastProcedures
      .filter((p) => p.patientId === patient.id)
      .sort((a, b) => b.procedureDate.localeCompare(a.procedureDate))
  }, [patient, refreshKey])

  const pastHistoryItems = useMemo(
    () => buildPastHistoryItems(pastMedications, pastProcedures),
    [pastMedications, pastProcedures],
  )

  const patientDiets = useMemo(() => {
    if (!patient) return []
    return mockData.patientDiets
      .filter((d) => d.patient_id === patient.id)
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
  }, [patient, refreshKey])

  const patientTrainingPlans = useMemo(() => {
    if (!patient) return []
    return mockData.patientTrainingPlans
      .filter((p) => p.patient_id === patient.id)
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
  }, [patient, refreshKey])

  const labResults = useMemo(() => {
    if (!patient) return []
    return mockData.labResults
      .filter((l) => l.patient_id === patient.id)
      .sort(
        (a, b) =>
          b.test_date.localeCompare(a.test_date) || a.test_name.localeCompare(b.test_name),
      )
  }, [patient, refreshKey])

  const attachments = useMemo(() => {
    if (!patient) return []
    return mockData.attachments
      .filter((a) => a.patient_id === patient.id)
      .sort((a, b) => b.uploaded_at.localeCompare(a.uploaded_at))
  }, [patient, refreshKey])

  const latestWeight = weights.at(-1)
  const firstWeight = weights.at(0)
  const weightTrend =
    latestWeight && firstWeight
      ? Number((latestWeight.weight - firstWeight.weight).toFixed(1))
      : null
  const latestPayment = payments[0] ?? null

  const handleUpdatePatient = useCallback(
    async (updates: Partial<Patient>) => {
      if (!patient) return
      const updated = await updatePatientApi(patient.id, updates)
      setPatient(updated)
      const idx = mockData.patients.findIndex((p) => p.id === patient.id)
      if (idx >= 0) mockData.patients[idx] = { ...mockData.patients[idx], ...updated }
      refresh()
    },
    [patient, refresh],
  )

  const handleAddWeight = useCallback(
    async (payload: { weight: number; recordedDate: string; notes?: string }) => {
      if (!patient) return
      mockData.weightLogs.push({
        id: `weight-${Date.now()}`,
        patient_id: patient.id,
        weight: payload.weight,
        recorded_date: payload.recordedDate,
        notes: payload.notes ?? null,
      })
      refresh()
    },
    [patient, refresh],
  )

  const handleAddVisitNote = useCallback(
    async (payload: CreateVisitNotePayload) => {
      await createVisitNote(payload)
      refresh()
    },
    [refresh],
  )

  const handleUpdateVisitNote = useCallback(
    async (
      noteId: string,
      payload: VisitNoteSubmitPayload,
    ) => {
      await updateVisitNote(noteId, payload)
      refresh()
    },
    [refresh],
  )

  const handleDeleteVisitNote = useCallback(
    async (noteId: string) => {
      await deleteVisitNote(noteId)
      refresh()
    },
    [refresh],
  )

  const handleUpdateWeight = useCallback(
    async (
      weightId: string,
      payload: { weight: number; recordedDate: string; notes?: string },
    ) => {
      const idx = mockData.weightLogs.findIndex((w) => w.id === weightId)
      if (idx < 0) return
      mockData.weightLogs[idx] = {
        ...mockData.weightLogs[idx],
        weight: payload.weight,
        recorded_date: payload.recordedDate,
        notes: payload.notes ?? null,
      }
      refresh()
    },
    [refresh],
  )

  const handleDeleteWeight = useCallback(
    async (weightId: string) => {
      const idx = mockData.weightLogs.findIndex((w) => w.id === weightId)
      if (idx < 0) return
      mockData.weightLogs.splice(idx, 1)
      refresh()
    },
    [refresh],
  )

  const handleVerifyPayment = useCallback(
    async (paymentId: string, verifierId: string) => {
      await verifyPayment(paymentId, verifierId)
      refresh()
    },
    [refresh],
  )

  const handleAddLabResult = useCallback(
    async (payload: LabResultFormPayload) => {
      if (!patient) return
      if (payload.entry_type === "file") {
        mockData.labResults.push({
          id: `lab-${Date.now()}`,
          patient_id: patient.id,
          entry_type: "file",
          test_name: payload.file_name,
          value: "",
          unit: "",
          normal_range: "",
          status: "normal",
          test_date: payload.test_date,
          pdf_url: payload.file_url,
          file_name: payload.file_name,
          file_size: payload.file_size,
          mime_type: payload.mime_type,
          notes: payload.notes,
          lab_file_id: null,
        })
      } else {
        mockData.labResults.push({
          id: `lab-${Date.now()}`,
          patient_id: patient.id,
          entry_type: "metric",
          test_name: payload.test_name,
          value: payload.value,
          unit: payload.unit,
          normal_range: payload.normal_range,
          status: payload.status,
          test_date: payload.test_date,
          pdf_url: null,
          file_name: null,
          file_size: null,
          mime_type: null,
          notes: payload.notes,
          lab_file_id: null,
        })
      }
      refresh()
    },
    [patient, refresh],
  )

  const handleUpdateLabResult = useCallback(
    async (labId: string, payload: LabResultFormPayload) => {
      const idx = mockData.labResults.findIndex((l) => l.id === labId)
      if (idx < 0) return
      if (payload.entry_type === "file") {
        mockData.labResults[idx] = {
          ...mockData.labResults[idx],
          entry_type: "file",
          test_name: payload.file_name,
          value: "",
          unit: "",
          normal_range: "",
          status: "normal",
          test_date: payload.test_date,
          pdf_url: payload.file_url,
          file_name: payload.file_name,
          file_size: payload.file_size,
          mime_type: payload.mime_type,
          notes: payload.notes,
        }
      } else {
        mockData.labResults[idx] = {
          ...mockData.labResults[idx],
          entry_type: "metric",
          test_name: payload.test_name,
          value: payload.value,
          unit: payload.unit,
          normal_range: payload.normal_range,
          status: payload.status,
          test_date: payload.test_date,
          pdf_url: null,
          file_name: null,
          file_size: null,
          mime_type: null,
          notes: payload.notes,
        }
      }
      refresh()
    },
    [refresh],
  )

  const handleDeleteLabResult = useCallback(
    async (labId: string) => {
      const idx = mockData.labResults.findIndex((l) => l.id === labId)
      if (idx < 0) return
      mockData.labResults.splice(idx, 1)
      refresh()
    },
    [refresh],
  )

  const handleAddInjection = useCallback(
    async (payload: InjectionFormPayload) => {
      if (!patient) return
      mockData.injections.push({
        id: `inj-${Date.now()}`,
        patient_id: patient.id,
        medication_name: payload.medication_name,
        dose: payload.dose,
        injection_date: payload.injection_date,
        next_suggested_date: null,
        next_suggested_dose: null,
        notes: payload.notes,
        appointment_id: null,
      })
      refresh()
    },
    [patient, refresh],
  )

  const handleUpdateInjection = useCallback(
    async (injectionId: string, payload: InjectionFormPayload) => {
      const idx = mockData.injections.findIndex((i) => i.id === injectionId)
      if (idx < 0) return
      mockData.injections[idx] = {
        ...mockData.injections[idx],
        medication_name: payload.medication_name,
        dose: payload.dose,
        injection_date: payload.injection_date,
        notes: payload.notes,
      }
      refresh()
    },
    [refresh],
  )

  const handleDeleteInjection = useCallback(
    async (injectionId: string) => {
      const idx = mockData.injections.findIndex((i) => i.id === injectionId)
      if (idx < 0) return
      mockData.injections.splice(idx, 1)
      refresh()
    },
    [refresh],
  )

  const handleAddPrescription = useCallback(
    async (payload: PrescriptionFormPayload) => {
      if (!patient) return
      const now = new Date().toISOString()
      const filesForPatient = mockData.patientPrescriptionFiles.filter(
        (p) => p.patient_id === patient.id,
      )
      filesForPatient.forEach((p) => {
        p.is_active = false
      })
      const maxVersion = filesForPatient.reduce((max, p) => Math.max(max, p.version), 0)
      mockData.patientPrescriptionFiles.push({
        id: `rx-file-${Date.now()}`,
        patient_id: patient.id,
        clinic_id: DEMO_CLINIC_ID,
        doctor_id: patient.doctor_id,
        file_name: payload.file_name,
        file_url: payload.file_url,
        file_size: payload.file_size,
        mime_type: payload.mime_type,
        created_at: now,
        updated_at: now,
        version: maxVersion + 1,
        is_active: true,
      })
      refresh()
    },
    [patient, refresh],
  )

  const handleUpdatePrescription = useCallback(
    async (prescriptionId: string, payload: PrescriptionFormPayload) => {
      const idx = mockData.patientPrescriptionFiles.findIndex((p) => p.id === prescriptionId)
      if (idx < 0) return
      const now = new Date().toISOString()
      mockData.patientPrescriptionFiles[idx] = {
        ...mockData.patientPrescriptionFiles[idx],
        file_name: payload.file_name,
        file_url: payload.file_url,
        file_size: payload.file_size,
        mime_type: payload.mime_type,
        updated_at: now,
      }
      refresh()
    },
    [refresh],
  )

  const handleDeletePrescription = useCallback(
    async (prescriptionId: string) => {
      const idx = mockData.patientPrescriptionFiles.findIndex((p) => p.id === prescriptionId)
      if (idx < 0) return
      const removed = mockData.patientPrescriptionFiles[idx]
      mockData.patientPrescriptionFiles.splice(idx, 1)
      if (removed.is_active && patient) {
        const remaining = mockData.patientPrescriptionFiles
          .filter((p) => p.patient_id === patient.id)
          .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
        if (remaining[0]) remaining[0].is_active = true
      }
      refresh()
    },
    [patient, refresh],
  )

  const handleAddPastMedication = useCallback(
    async (payload: CreatePastMedicationPayload) => {
      await createPastMedication(payload)
      refresh()
    },
    [refresh],
  )

  const handleUpdatePastMedication = useCallback(
    async (medicationId: string, payload: CreatePastMedicationPayload) => {
      await updatePastMedication(medicationId, {
        name: payload.name,
        duration: payload.duration,
        takenFrom: payload.takenFrom,
        takenTo: payload.takenTo ?? null,
        notes: payload.notes ?? null,
      })
      refresh()
    },
    [refresh],
  )

  const handleDeletePastMedication = useCallback(
    async (medicationId: string) => {
      await deletePastMedication(medicationId)
      refresh()
    },
    [refresh],
  )

  const handleAddPastProcedure = useCallback(
    async (payload: CreatePastProcedurePayload) => {
      await createPastProcedure(payload)
      refresh()
    },
    [refresh],
  )

  const handleUpdatePastProcedure = useCallback(
    async (procedureId: string, payload: CreatePastProcedurePayload) => {
      await updatePastProcedure(procedureId, {
        name: payload.name,
        procedureDate: payload.procedureDate,
        notes: payload.notes ?? null,
      })
      refresh()
    },
    [refresh],
  )

  const handleDeletePastProcedure = useCallback(
    async (procedureId: string) => {
      await deletePastProcedure(procedureId)
      refresh()
    },
    [refresh],
  )

  const handleAddDiet = useCallback(
    async (payload: DietFormPayload) => {
      if (!patient) return
      const now = new Date().toISOString()
      const patientDietsForPatient = mockData.patientDiets.filter(
        (d) => d.patient_id === patient.id,
      )
      patientDietsForPatient.forEach((d) => {
        d.is_active = false
      })
      const maxVersion = patientDietsForPatient.reduce((max, d) => Math.max(max, d.version), 0)
      mockData.patientDiets.push({
        id: `diet-${Date.now()}`,
        patient_id: patient.id,
        file_name: payload.file_name,
        file_url: payload.file_url,
        file_size: payload.file_size,
        mime_type: payload.mime_type,
        created_at: now,
        updated_at: now,
        version: maxVersion + 1,
        is_active: true,
      })
      refresh()
    },
    [patient, refresh],
  )

  const handleUpdateDiet = useCallback(
    async (dietId: string, payload: DietFormPayload) => {
      const idx = mockData.patientDiets.findIndex((d) => d.id === dietId)
      if (idx < 0) return
      const now = new Date().toISOString()
      mockData.patientDiets[idx] = {
        ...mockData.patientDiets[idx],
        file_name: payload.file_name,
        file_url: payload.file_url,
        file_size: payload.file_size,
        mime_type: payload.mime_type,
        updated_at: now,
      }
      refresh()
    },
    [refresh],
  )

  const handleDeleteDiet = useCallback(
    async (dietId: string) => {
      const idx = mockData.patientDiets.findIndex((d) => d.id === dietId)
      if (idx < 0) return
      const removed = mockData.patientDiets[idx]
      mockData.patientDiets.splice(idx, 1)
      if (removed.is_active && patient) {
        const remaining = mockData.patientDiets
          .filter((d) => d.patient_id === patient.id)
          .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
        if (remaining[0]) remaining[0].is_active = true
      }
      refresh()
    },
    [patient, refresh],
  )

  const handleAddTrainingPlan = useCallback(
    async (payload: TrainingPlanFormPayload) => {
      if (!patient) return
      const now = new Date().toISOString()
      const plansForPatient = mockData.patientTrainingPlans.filter(
        (p) => p.patient_id === patient.id,
      )
      plansForPatient.forEach((p) => {
        p.is_active = false
      })
      const maxVersion = plansForPatient.reduce((max, p) => Math.max(max, p.version), 0)
      mockData.patientTrainingPlans.push({
        id: `training-${Date.now()}`,
        patient_id: patient.id,
        file_name: payload.file_name,
        file_url: payload.file_url,
        file_size: payload.file_size,
        mime_type: payload.mime_type,
        created_at: now,
        updated_at: now,
        version: maxVersion + 1,
        is_active: true,
      })
      refresh()
    },
    [patient, refresh],
  )

  const handleUpdateTrainingPlan = useCallback(
    async (planId: string, payload: TrainingPlanFormPayload) => {
      const idx = mockData.patientTrainingPlans.findIndex((p) => p.id === planId)
      if (idx < 0) return
      const now = new Date().toISOString()
      mockData.patientTrainingPlans[idx] = {
        ...mockData.patientTrainingPlans[idx],
        file_name: payload.file_name,
        file_url: payload.file_url,
        file_size: payload.file_size,
        mime_type: payload.mime_type,
        updated_at: now,
      }
      refresh()
    },
    [refresh],
  )

  const handleDeleteTrainingPlan = useCallback(
    async (planId: string) => {
      const idx = mockData.patientTrainingPlans.findIndex((p) => p.id === planId)
      if (idx < 0) return
      const removed = mockData.patientTrainingPlans[idx]
      mockData.patientTrainingPlans.splice(idx, 1)
      if (removed.is_active && patient) {
        const remaining = mockData.patientTrainingPlans
          .filter((p) => p.patient_id === patient.id)
          .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
        if (remaining[0]) remaining[0].is_active = true
      }
      refresh()
    },
    [patient, refresh],
  )

  const handleAddAttachment = useCallback(
    (
      files: FileList,
      kind: string,
      uploadedBy: string,
    ) => {
      if (!patient) return
      const now = new Date().toISOString()
      Array.from(files).forEach((file, i) => {
        mockData.attachments.push({
          id: `attach-${Date.now()}-${i}`,
          patient_id: patient.id,
          file_name: file.name,
          file_type: file.type || "application/octet-stream",
          file_size: file.size,
          file_url: `/attachments/${file.name}`,
          uploaded_at: now,
          uploaded_by: uploadedBy,
          attachment_kind: kind,
          thumbnail_url: undefined,
        } as (typeof mockData.attachments)[number])
      })
      refresh()
    },
    [patient, refresh],
  )

  return {
    loading,
    patient,
    weights,
    injections,
    visitNotes,
    payments,
    subscription,
    appointments,
    upcomingAppointment,
    lastAppointment,
    prescriptions,
    pastMedications,
    pastProcedures,
    pastHistoryItems,
    patientDiets,
    patientTrainingPlans,
    labResults,
    attachments,
    latestWeight,
    weightTrend,
    latestPayment,
    refresh,
    handleUpdatePatient,
    handleAddWeight,
    handleAddVisitNote,
    handleUpdateVisitNote,
    handleDeleteVisitNote,
    handleUpdateWeight,
    handleDeleteWeight,
    handleVerifyPayment,
    handleAddAttachment,
    handleAddLabResult,
    handleUpdateLabResult,
    handleDeleteLabResult,
    handleAddInjection,
    handleUpdateInjection,
    handleDeleteInjection,
    handleAddPrescription,
    handleUpdatePrescription,
    handleDeletePrescription,
    handleAddPastMedication,
    handleUpdatePastMedication,
    handleDeletePastMedication,
    handleAddPastProcedure,
    handleUpdatePastProcedure,
    handleDeletePastProcedure,
    handleAddDiet,
    handleUpdateDiet,
    handleDeleteDiet,
    handleAddTrainingPlan,
    handleUpdateTrainingPlan,
    handleDeleteTrainingPlan,
  }
}

export type PatientPageData = ReturnType<typeof usePatientPageData>
