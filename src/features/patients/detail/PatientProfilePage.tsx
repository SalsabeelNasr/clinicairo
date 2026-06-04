"use client"

import { useMemo, useState } from "react"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useToast } from "@/hooks/useToast"
import { DEMO_CLINIC_ID } from "@/lib/constants"
import type { StaffRole } from "@/data/mock/users-clinics"
import {
  ROLE_DEFAULT_MAIN_TAB,
  ROLE_DEFAULT_VISIT_TRACK,
  type ProfileMainTab,
  type VisitNoteTrackFilter,
} from "./patient-profile.types"
import {
  subscriptionStatusLabel,
  tierLabel,
  visitTrackForAdd,
} from "./patient-profile.labels"
import { usePatientPageData } from "./usePatientPageData"
import { PatientPageHeader } from "./PatientPageHeader"
import { PatientInformationCard } from "./PatientInformationCard"
import { getBillingGate } from "./billing.utils"
import { canRecordPayments } from "@/lib/permissions"
import { PatientBookingsSection } from "./PatientBookingsSection"
import { RecordPaymentDrawer } from "./drawers/RecordPaymentDrawer"
import { PatientInjectionsCard } from "./PatientInjectionsCard"
import { PatientVitalsCard } from "./PatientVitalsCard"
import { PatientPastMedicationsCard } from "./PatientPastMedicationsCard"
import { PatientLabResultsCard } from "./PatientLabResultsCard"
import { ContraindicationsCard } from "./components/ContraindicationsCard"
import { PatientProfileMainNav } from "./PatientProfileMainNav"
import { PatientPrescriptionsCard } from "./PatientPrescriptionsCard"
import { PatientDietCard } from "./PatientDietCard"
import { PatientFitnessCard } from "./PatientFitnessCard"
import { AddWeightDrawer } from "./drawers/AddWeightDrawer"
import { LabResultDrawer } from "./drawers/LabResultDrawer"
import { AddVisitNoteDrawer } from "./drawers/AddVisitNoteDrawer"
import { InjectionDrawer } from "./drawers/InjectionDrawer"
import { PastMedicationDrawer } from "./drawers/PastMedicationDrawer"
import { PastProcedureDrawer } from "./drawers/PastProcedureDrawer"
import type { PastHistoryItem } from "./past-history.types"
import { PrescriptionPlanDrawer } from "./drawers/PrescriptionPlanDrawer"
import { DietPlanDrawer } from "./drawers/DietPlanDrawer"
import { TrainingPlanDrawer } from "./drawers/TrainingPlanDrawer"
import { VisitNotesHistory } from "./VisitNotesHistory"
import { PageSkeleton } from "@/components/skeletons/PageSkeleton"
import { PatientBookAppointmentDrawer } from "./PatientBookAppointmentDrawer"

export function PatientProfilePage({ patientId }: { patientId: string }) {
  const t = useAppTranslations()
  const { showToast } = useToast()
  const { currentUser, allUsers, currentClinic } = useUserClinic()

  const data = usePatientPageData(patientId)
  const role = currentUser.role as StaffRole
  const [mainTab, setMainTab] = useState<ProfileMainTab>(
    ROLE_DEFAULT_MAIN_TAB[role] ?? "profile",
  )
  const [visitNoteTrackFilter, setVisitNoteTrackFilter] = useState<VisitNoteTrackFilter>(
    ROLE_DEFAULT_VISIT_TRACK[role] ?? "all",
  )
  const [drawer, setDrawer] = useState<
    | "weight"
    | "note"
    | "rx"
    | "lab"
    | "injection"
    | "pastMed"
    | "pastProc"
    | "diet"
    | "training"
    | null
  >(null)
  const [editingLabId, setEditingLabId] = useState<string | null>(null)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingWeightId, setEditingWeightId] = useState<string | null>(null)
  const [editingInjectionId, setEditingInjectionId] = useState<string | null>(null)
  const [editingPastMedId, setEditingPastMedId] = useState<string | null>(null)
  const [editingPastProcId, setEditingPastProcId] = useState<string | null>(null)
  const [editingRxId, setEditingRxId] = useState<string | null>(null)
  const [editingDietId, setEditingDietId] = useState<string | null>(null)
  const [editingTrainingPlanId, setEditingTrainingPlanId] = useState<string | null>(null)
  const [bookAppointmentOpen, setBookAppointmentOpen] = useState(false)
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false)

  const billingGate = useMemo(() => {
    if (!data.patient) return { kind: "no_coverage" as const }
    return getBillingGate(data.patient, data.subscription, data.payments)
  }, [data.patient, data.subscription, data.payments])

  const canBook = billingGate.kind === "ok"
  const canRecord = canRecordPayments(currentUser)

  const careTeam = useMemo(() => {
    if (!data.patient) return {}
    return {
      doctor: allUsers.find((u) => u.id === data.patient?.doctor_id)?.full_name,
      nutritionist: allUsers.find((u) => u.id === data.patient?.nutritionist_id)?.full_name,
      coach: allUsers.find((u) => u.id === data.patient?.coach_id)?.full_name,
    }
  }, [data.patient, allUsers])

  const openLabDrawer = (labId: string | null) => {
    setEditingLabId(labId)
    setDrawer("lab")
  }

  const openNoteDrawer = (noteId: string | null) => {
    setEditingNoteId(noteId)
    setDrawer("note")
  }

  const openWeightDrawer = (weightId: string | null) => {
    setEditingWeightId(weightId)
    setDrawer("weight")
  }

  const openInjectionDrawer = (injectionId: string | null) => {
    setEditingInjectionId(injectionId)
    setDrawer("injection")
  }

  const openPastMedDrawer = (medicationId: string | null) => {
    setEditingPastProcId(null)
    setEditingPastMedId(medicationId)
    setDrawer("pastMed")
  }

  const openPastProcDrawer = (procedureId: string | null) => {
    setEditingPastMedId(null)
    setEditingPastProcId(procedureId)
    setDrawer("pastProc")
  }

  const openPrescriptionDrawer = (prescriptionId: string | null) => {
    setEditingRxId(prescriptionId)
    setDrawer("rx")
  }

  const openDietDrawer = (dietId: string | null) => {
    setEditingDietId(dietId)
    setDrawer("diet")
  }

  const openTrainingPlanDrawer = (planId: string | null) => {
    setEditingTrainingPlanId(planId)
    setDrawer("training")
  }

  const closeDrawerIfEditing = (
    drawerKind: typeof drawer,
    editingId: string | null,
    deletedId: string,
  ) => {
    if (drawer === drawerKind && editingId === deletedId) {
      setDrawer(null)
      if (drawerKind === "lab") setEditingLabId(null)
      if (drawerKind === "note") setEditingNoteId(null)
      if (drawerKind === "weight") setEditingWeightId(null)
      if (drawerKind === "injection") setEditingInjectionId(null)
      if (drawerKind === "pastMed") setEditingPastMedId(null)
      if (drawerKind === "pastProc") setEditingPastProcId(null)
      if (drawerKind === "rx") setEditingRxId(null)
      if (drawerKind === "diet") setEditingDietId(null)
      if (drawerKind === "training") setEditingTrainingPlanId(null)
    }
  }

  if (data.loading) {
    return (
      <div className="app-page">
        <PageSkeleton showHeader contentBlocks={3} />
      </div>
    )
  }

  if (!data.patient) {
    return (
      <div className="app-page">
        <div className="app-empty-state">{t.profile.patientNotFound}</div>
      </div>
    )
  }

  const patient = data.patient
  const tier = tierLabel(patient.subscription_tier, t)
  const subStatus = subscriptionStatusLabel(patient.subscription_status, t)
  const addNoteTrack = visitTrackForAdd(visitNoteTrackFilter, role)
  const editingNote = editingNoteId
    ? data.visitNotes.find((n) => n.id === editingNoteId) ?? null
    : null
  const editingWeight = editingWeightId
    ? data.weights.find((w) => w.id === editingWeightId) ?? null
    : null
  const editingInjection = editingInjectionId
    ? data.injections.find((i) => i.id === editingInjectionId) ?? null
    : null
  const editingPastMed = editingPastMedId
    ? data.pastMedications.find((m) => m.id === editingPastMedId) ?? null
    : null
  const editingPastProc = editingPastProcId
    ? data.pastProcedures.find((p) => p.id === editingPastProcId) ?? null
    : null
  const editingRx = editingRxId
    ? data.prescriptions.find((r) => r.id === editingRxId) ?? null
    : null
  const editingDiet = editingDietId
    ? data.patientDiets.find((d) => d.id === editingDietId) ?? null
    : null
  const editingTrainingPlan = editingTrainingPlanId
    ? data.patientTrainingPlans.find((p) => p.id === editingTrainingPlanId) ?? null
    : null

  return (
    <div className="app-page space-y-6">
      <PatientPageHeader
        patient={patient}
        upcomingAppointment={data.upcomingAppointment}
        lastAppointment={data.lastAppointment}
        meetUrl={data.upcomingAppointment?.online_call_link}
        subscriptionStatusLabel={subStatus}
        onUpdatePatient={data.handleUpdatePatient}
      />

      <PatientProfileMainNav activeTab={mainTab} onTabChange={setMainTab} />

      {mainTab === "profile" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <PatientInformationCard
                patient={patient}
                onUpdate={data.handleUpdatePatient}
              />
            </div>
            <PatientVitalsCard
              patient={patient}
              latestWeight={data.latestWeight}
              weightTrend={data.weightTrend}
              weights={data.weights}
              onAddWeight={() => openWeightDrawer(null)}
              onEditWeightEntry={(id) => openWeightDrawer(id)}
              onDeleteWeightEntry={async (id) => {
                await data.handleDeleteWeight(id)
                closeDrawerIfEditing("weight", editingWeightId, id)
                showToast(t.profile.weightDeleted, "success")
              }}
            />
            <ContraindicationsCard
              patient={patient}
              onUpdate={data.handleUpdatePatient}
            />
            <PatientPastMedicationsCard
              items={data.pastHistoryItems}
              onAddMedication={() => openPastMedDrawer(null)}
              onAddProcedure={() => openPastProcDrawer(null)}
              onEdit={(item: PastHistoryItem) => {
                if (item.kind === "medication") openPastMedDrawer(item.data.id)
                else openPastProcDrawer(item.data.id)
              }}
              onDelete={async (item: PastHistoryItem) => {
                if (item.kind === "medication") {
                  await data.handleDeletePastMedication(item.data.id)
                  closeDrawerIfEditing("pastMed", editingPastMedId, item.data.id)
                  showToast(t.profile.pastMedicationDeleted, "success")
                } else {
                  await data.handleDeletePastProcedure(item.data.id)
                  closeDrawerIfEditing("pastProc", editingPastProcId, item.data.id)
                  showToast(t.profile.pastProcedureDeleted, "success")
                }
              }}
            />
            <PatientLabResultsCard
              labResults={data.labResults}
              onAdd={() => openLabDrawer(null)}
              onEdit={(id) => openLabDrawer(id)}
              onDelete={async (id) => {
                await data.handleDeleteLabResult(id)
                closeDrawerIfEditing("lab", editingLabId, id)
                showToast(t.profile.labDeleted, "success")
              }}
            />
          </div>
        </div>
      )}

      {mainTab === "treatment" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-start">
            <PatientPrescriptionsCard
              prescriptions={data.prescriptions}
              onAdd={() => openPrescriptionDrawer(null)}
              onEdit={(id) => openPrescriptionDrawer(id)}
              onDelete={async (id) => {
                await data.handleDeletePrescription(id)
                closeDrawerIfEditing("rx", editingRxId, id)
                showToast(t.profile.prescriptionDeleted, "success")
              }}
            />

            <PatientInjectionsCard
              injections={data.injections}
              onAdd={() => openInjectionDrawer(null)}
              onEdit={(id) => openInjectionDrawer(id)}
              onDelete={async (id) => {
                await data.handleDeleteInjection(id)
                closeDrawerIfEditing("injection", editingInjectionId, id)
                showToast(t.profile.doseDeleted, "success")
              }}
            />
          </div>

          <VisitNotesHistory
            notes={data.visitNotes}
            trackFilter={visitNoteTrackFilter}
            onTrackFilterChange={setVisitNoteTrackFilter}
            onAddNote={() => openNoteDrawer(null)}
            onEditNote={(id) => openNoteDrawer(id)}
            onDeleteNote={async (id) => {
              await data.handleDeleteVisitNote(id)
              closeDrawerIfEditing("note", editingNoteId, id)
              showToast(t.profile.noteDeleted, "success")
            }}
          />
        </div>
      )}

      {mainTab === "dietFitness" && (
        <div className="space-y-4">
          <PatientDietCard
            diets={data.patientDiets}
            onAdd={() => openDietDrawer(null)}
            onEdit={(id) => openDietDrawer(id)}
            onDelete={async (id) => {
              await data.handleDeleteDiet(id)
              closeDrawerIfEditing("diet", editingDietId, id)
              showToast(t.profile.dietDeleted, "success")
            }}
          />

          <PatientFitnessCard
            plans={data.patientTrainingPlans}
            onAdd={() => openTrainingPlanDrawer(null)}
            onEdit={(id) => openTrainingPlanDrawer(id)}
            onDelete={async (id) => {
              await data.handleDeleteTrainingPlan(id)
              closeDrawerIfEditing("training", editingTrainingPlanId, id)
              showToast(t.profile.trainingDeleted, "success")
            }}
          />
        </div>
      )}

      {mainTab === "bookings" && (
        <PatientBookingsSection
          careTeam={careTeam}
          subscription={data.subscription}
          payments={data.payments}
          tierLabel={tier}
          statusLabel={subStatus}
          gate={billingGate}
          data={data}
          canRecordPayment={canRecord}
          onRecordPayment={() => setRecordPaymentOpen(true)}
          onVerifyPayment={async (paymentId) => {
            await data.handleVerifyPayment(paymentId, currentUser.id)
            showToast(t.profile.paymentVerified, "success")
          }}
          onAddAppointment={() => {
            if (!canBook) {
              showToast(t.profile.bookingBlockedBody, "error")
              return
            }
            setBookAppointmentOpen(true)
          }}
        />
      )}

      <AddWeightDrawer
        open={drawer === "weight"}
        onOpenChange={(open) => {
          if (!open) {
            setDrawer(null)
            setEditingWeightId(null)
          }
        }}
        entry={editingWeight}
        onSubmit={async (payload) => {
          if (editingWeightId) {
            await data.handleUpdateWeight(editingWeightId, payload)
            showToast(t.profile.saveWeight, "success")
          } else {
            await data.handleAddWeight(payload)
            showToast(t.profile.addWeightBtn, "success")
          }
        }}
      />

      <LabResultDrawer
        open={drawer === "lab"}
        onOpenChange={(open) => {
          if (!open) {
            setDrawer(null)
            setEditingLabId(null)
          }
        }}
        lab={editingLabId ? data.labResults.find((l) => l.id === editingLabId) ?? null : null}
        onSubmit={async (payload) => {
          if (editingLabId) {
            await data.handleUpdateLabResult(editingLabId, payload)
            showToast(t.profile.labSaved, "success")
          } else {
            await data.handleAddLabResult(payload)
            showToast(t.profile.addLabBtn, "success")
          }
        }}
      />

      <AddVisitNoteDrawer
        open={drawer === "note"}
        onOpenChange={(open) => {
          if (!open) {
            setDrawer(null)
            setEditingNoteId(null)
          }
        }}
        defaultTrack={addNoteTrack}
        note={editingNote}
        onSubmit={async (payload) => {
          if (editingNoteId) {
            await data.handleUpdateVisitNote(editingNoteId, payload)
            showToast(t.profile.saveVisitNote, "success")
          } else {
            await data.handleAddVisitNote({
              patientId: patient.id,
              authorId: currentUser.id,
              ...payload,
            })
            showToast(t.profile.visitNote.saved, "success")
          }
        }}
      />

      <DietPlanDrawer
        open={drawer === "diet"}
        onOpenChange={(open) => {
          if (!open) {
            setDrawer(null)
            setEditingDietId(null)
          }
        }}
        diet={editingDiet}
        onSubmit={async (payload) => {
          if (editingDietId) {
            await data.handleUpdateDiet(editingDietId, payload)
            showToast(t.profile.saveDiet, "success")
          } else {
            await data.handleAddDiet(payload)
            showToast(t.profile.logNewDiet, "success")
          }
        }}
      />

      <TrainingPlanDrawer
        open={drawer === "training"}
        onOpenChange={(open) => {
          if (!open) {
            setDrawer(null)
            setEditingTrainingPlanId(null)
          }
        }}
        plan={editingTrainingPlan}
        onSubmit={async (payload) => {
          if (editingTrainingPlanId) {
            await data.handleUpdateTrainingPlan(editingTrainingPlanId, payload)
            showToast(t.profile.saveTraining, "success")
          } else {
            await data.handleAddTrainingPlan(payload)
            showToast(t.profile.logNewTraining, "success")
          }
        }}
      />

      <PrescriptionPlanDrawer
        open={drawer === "rx"}
        onOpenChange={(open) => {
          if (!open) {
            setDrawer(null)
            setEditingRxId(null)
          }
        }}
        prescription={editingRx}
        onSubmit={async (payload) => {
          if (editingRxId) {
            await data.handleUpdatePrescription(editingRxId, payload)
            showToast(t.profile.savePrescription, "success")
          } else {
            await data.handleAddPrescription(payload)
            showToast(t.profile.logNewPrescription, "success")
          }
        }}
      />

      <InjectionDrawer
        open={drawer === "injection"}
        onOpenChange={(open) => {
          if (!open) {
            setDrawer(null)
            setEditingInjectionId(null)
          }
        }}
        injection={editingInjection}
        onSubmit={async (payload) => {
          if (editingInjectionId) {
            await data.handleUpdateInjection(editingInjectionId, payload)
            showToast(t.profile.saveDose, "success")
          } else {
            await data.handleAddInjection(payload)
            showToast(t.profile.logNewDose, "success")
          }
        }}
      />

      <PastMedicationDrawer
        open={drawer === "pastMed"}
        onOpenChange={(open) => {
          if (!open) {
            setDrawer(null)
            setEditingPastMedId(null)
          }
        }}
        medication={editingPastMed}
        patientId={patient.id}
        onSubmit={async (payload) => {
          if (editingPastMedId) {
            await data.handleUpdatePastMedication(editingPastMedId, payload)
            showToast(t.profile.savePastMedication, "success")
          } else {
            await data.handleAddPastMedication(payload)
            showToast(t.profile.addMedication, "success")
          }
        }}
      />

      <PastProcedureDrawer
        open={drawer === "pastProc"}
        onOpenChange={(open) => {
          if (!open) {
            setDrawer(null)
            setEditingPastProcId(null)
          }
        }}
        procedure={editingPastProc}
        patientId={patient.id}
        onSubmit={async (payload) => {
          if (editingPastProcId) {
            await data.handleUpdatePastProcedure(editingPastProcId, payload)
            showToast(t.profile.savePastProcedure, "success")
          } else {
            await data.handleAddPastProcedure(payload)
            showToast(t.profile.addPastProcedure, "success")
          }
        }}
      />

      <RecordPaymentDrawer
        open={recordPaymentOpen}
        onOpenChange={setRecordPaymentOpen}
        patientId={patient.id}
        doctorId={patient.doctor_id}
        uploadedBy={currentUser.id}
        appointments={data.appointments}
        onSubmit={async (payload) => {
          await data.handleRecordPayment(payload)
          showToast(t.profile.paymentRecorded, "success")
        }}
      />

      <PatientBookAppointmentDrawer
        open={bookAppointmentOpen}
        onClose={() => setBookAppointmentOpen(false)}
        patient={patient}
        canBook={canBook}
        onBookingComplete={() => {
          data.refresh()
          showToast(t.profile.appointmentBooked, "success")
        }}
      />
    </div>
  )
}
