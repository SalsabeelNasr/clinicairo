export type VisitNoteTrack = "consultation" | "nutrition" | "coaching" | "ad-hoc"

export interface MockVisitNote {
  id: string
  patient_id: string
  appointment_id: string | null
  track: VisitNoteTrack
  author_id: string
  note_text: string | null
  note_file_name: string | null
  note_file_url: string | null
  note_file_size: number | null
  note_mime_type: string | null
  /** @deprecated Use note_file_url — kept for legacy mock rows */
  note_photo_ref: string | null
  created_at: string
}

export const mockVisitNotes: MockVisitNote[] = [
  {
    id: "note-p1-001",
    patient_id: "patient-001",
    appointment_id: "apt-033",
    track: "consultation",
    author_id: "user-001",
    note_text: "Initial consultation. Patient is highly motivated for weight loss. BP is elevated. Started on lifestyle changes and baseline labs ordered.",
    note_file_name: null,
    note_file_url: null,
    note_file_size: null,
    note_mime_type: null,
    note_photo_ref: null,
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "note-p1-002",
    patient_id: "patient-001",
    appointment_id: "apt-032",
    track: "nutrition",
    author_id: "user-004",
    note_text: "First nutrition session. Discussed protein targets and sodium restriction. Patient agreed to start a food diary.",
    note_file_name: null,
    note_file_url: null,
    note_file_size: null,
    note_mime_type: null,
    note_photo_ref: null,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "note-p1-002b",
    patient_id: "patient-001",
    appointment_id: "apt-030",
    track: "consultation",
    author_id: "user-001",
    note_text: null,
    note_file_name: "lab-results-summary-may.pdf",
    note_file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    note_file_size: 132_000,
    note_mime_type: "application/pdf",
    note_photo_ref: null,
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "note-p1-003",
    patient_id: "patient-001",
    appointment_id: "apt-031",
    track: "coaching",
    author_id: "user-005",
    note_text: "Fitness assessment. Recommended 30 mins walking daily. Patient reports improved energy levels.",
    note_file_name: null,
    note_file_url: null,
    note_file_size: null,
    note_mime_type: null,
    note_photo_ref: null,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "note-001",
    patient_id: "patient-001",
    appointment_id: "appt-001",
    track: "consultation",
    author_id: "user-002",
    note_text: "Tolerating current GLP-1 dose. Mild nausea only. Continue same dose this week and repeat weight log before next follow-up.",
    note_file_name: null,
    note_file_url: null,
    note_file_size: null,
    note_mime_type: null,
    note_photo_ref: null,
    created_at: "2026-06-01T11:30:00.000Z",
  },
  {
    id: "note-002",
    patient_id: "patient-001",
    appointment_id: "appt-002",
    track: "nutrition",
    author_id: "user-004",
    note_text: "Reviewed protein intake and water goals. Patient will send 3-day meal log on WhatsApp before next nutrition session.",
    note_file_name: null,
    note_file_url: null,
    note_file_size: null,
    note_mime_type: null,
    note_photo_ref: null,
    created_at: "2026-06-02T13:00:00.000Z",
  },
  {
    id: "note-003",
    patient_id: "patient-002",
    appointment_id: "appt-003",
    track: "coaching",
    author_id: "user-005",
    note_text: "Started low-impact walking plan: 20 minutes, 4 days/week. Knee pain precautions discussed.",
    note_file_name: null,
    note_file_url: null,
    note_file_size: null,
    note_mime_type: null,
    note_photo_ref: null,
    created_at: "2026-06-02T15:00:00.000Z",
  },
]
