export type CurrencyCode = "LYD" | "USD" | "EGP"

export interface TierPrice {
  usd: number
  lyd: number
  egp: number
}

export const mockClinicSettings = {
  assessment_credit_window_days: 14,
  pause_tracks_consultations: false,
  consultations_included_per_cycle: 4,
  default_appointment_duration_minutes: 30,
  appointment_types: ["consultation", "nutrition", "coaching", "follow-up"],
  reschedule_limit_per_subscription: 2,
  clinic_timezone: "Africa/Tripoli",
  booking_buffer_minutes: 10,
  tier_prices: {
    assessment: { usd: 50, lyd: 318, egp: 2500 },
    tier_1: { usd: 120, lyd: 763, egp: 6000 },
    tier_2: { usd: 150, lyd: 954, egp: 7500 },
  } satisfies Record<string, TierPrice>,
  accepted_currencies: ["LYD", "USD", "EGP"] as CurrencyCode[],
  payment_methods: ["transfer", "wallet", "cash", "agent"],
  grace_period_days: 5,
  renewal_reminder_lead_days: 5,
  payment_verifier: {
    roles: ["owner"],
    staff_ids: ["user-001"],
  },
  lead_cold_after_days: 14,
  automation_master_switch: {
    appointment_reminder: false,
    booking_confirmation: false,
    renewal_reminder: false,
    lead_follow_up: false,
  },
  clinic_identity: {
    name: "CliniCairo",
    whatsapp_number: "+201140988255",
    logo_url: "/images/clinicairo-logo.png",
    contact_email: "hello@clinicairo.com",
  },
}
