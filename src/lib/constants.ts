/**
 * Shared application constants.
 * Merges CliniCairo's demo entities (for mock mode) with CliniCairo's
 * brand/marketing constants.
 */

// ---- CliniCairo demo entities (mock backend) ----
export const DEMO_DOCTOR_ID = "demo-doctor-001";
export const DEMO_CLINIC_ID = "demo-clinic-001";
export const DEFAULT_CURRENT_USER_ID = DEMO_DOCTOR_ID;
export const DEFAULT_CURRENT_CLINIC_ID = DEMO_CLINIC_ID;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

/** Demo doctor entity (for demo mode and invoice display) */
export const mockDoctor = {
  id: DEMO_DOCTOR_ID,
  email: "doctor@clinicairo.com",
  full_name: "د. أحمد القاضي",
  specialization: "إنقاص الوزن والغدد",
  biography: "استشاري السمنة وعلاج السكري ومتابعة الحقن",
  image_url: "/images/clinicairo-logo.png",
  role: "doctor",
  doctor_id: DEMO_DOCTOR_ID,
  created_at: "2026-01-01T00:00:00.000Z",
};

/** Demo clinic entity */
export const mockClinic = {
  id: DEMO_CLINIC_ID,
  name: "CliniCairo",
  address: "Online — Libya",
  location: "Online",
  phone: "+201140988255",
  created_at: "2026-01-01T00:00:00.000Z",
  tidycal_booking_type_id: "demo-booking-type",
};

export const mockDoctors = [mockDoctor];

// ---- CliniCairo brand / marketing ----
export const BRAND_NAME = "CliniCairo";

/** Official CBL rate (~May 2026). Update when exchange rates change. */
export const USD_TO_LYD_RATE = 6.36;

export const WHATSAPP_NUMBER = "201140988255";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61589603983562";
export const INSTAGRAM_URL = "https://www.instagram.com/clinicairo/";
