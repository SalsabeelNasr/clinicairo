-- =============================================================================
-- CliniCairo — initial schema (spec §10)
-- Reconciles: old clinic Supabase backup (proven GLP-1 clinical model)
--           + TabibDesk TS types + CliniCairo business rules.
--
-- Single tenant: one clinic. `clinic_id` is kept latent on every table (cheap
-- future-proofing) but never surfaced in UI.
-- NO AI at launch: lab_files keeps `ai_extraction_status` as a DORMANT seam only.
-- Notes: ONE `visit_notes` table (no doctor_notes / no visit_summaries).
-- RLS: permissive viewing for authenticated staff, EXCEPT (a) clinic_settings
--      writes = owner-only and (b) payment verify = configured payment_verifier.
--      service_role bypasses RLS for backend/bot use.
-- =============================================================================

create extension if not exists pgcrypto;

-- =============================================================================
-- Helper functions
-- =============================================================================

-- Current staff member's role (security definer to avoid RLS recursion on profiles).
create or replace function public.app_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.app_is_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.app_role() = 'owner', false);
$$;

-- True when the current actor may verify payments (spec §6.3 / §7).
-- Driven by clinic_settings.payment_verifier = {"roles":[...],"staff_ids":[...]}.
-- service_role (backend/bot) always allowed.
create or replace function public.app_can_verify_payments()
returns boolean language sql stable security definer set search_path = public as $$
  select case
    when auth.role() = 'service_role' then true
    else coalesce(
      public.app_role() = any (
        select jsonb_array_elements_text(
          coalesce((select value->'roles' from public.clinic_settings where key = 'payment_verifier' limit 1), '["owner"]'::jsonb))
      )
      or auth.uid()::text = any (
        select jsonb_array_elements_text(
          coalesce((select value->'staff_ids' from public.clinic_settings where key = 'payment_verifier' limit 1), '[]'::jsonb))
      ), false)
  end;
$$;

-- updated_at maintenance
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Generic audit logger for clinical + money tables (spec §10 audit_log).
create or replace function public.audit_row()
returns trigger language plpgsql security definer set search_path = public as $$
declare cid uuid;
begin
  if (tg_op = 'DELETE') then cid := old.clinic_id; else cid := new.clinic_id; end if;
  insert into public.audit_log(table_name, record_id, action, changed_by, old_data, new_data, clinic_id)
  values (
    tg_table_name,
    coalesce(new.id, old.id),
    tg_op,
    auth.uid(),
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('UPDATE','INSERT') then to_jsonb(new) else null end,
    cid
  );
  if tg_op = 'DELETE' then return old; else return new; end if;
end;
$$;

-- Enforce the payment-verifier restriction + stamp verified_by/at (spec §6.3).
create or replace function public.enforce_payment_verifier()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'verified' and (tg_op = 'INSERT' or old.status is distinct from 'verified') then
    if not public.app_can_verify_payments() then
      raise exception 'Only the configured payment_verifier may verify a payment';
    end if;
    new.verified_by := coalesce(new.verified_by, auth.uid());
    new.verified_at := coalesce(new.verified_at, now());
  end if;
  return new;
end;
$$;

-- =============================================================================
-- Tables
-- =============================================================================

-- Single clinic (anchors the latent clinic_id FKs; seeded with one row).
create table public.clinics (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text,
  location    text,
  created_at  timestamptz not null default now()
);

-- Staff identity. Web login (Supabase Auth) and the future bot (phone->staff)
-- point at the same row. Patients never get a profile.
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  clinic_id   uuid not null references public.clinics(id),
  email       text not null,
  full_name   text,
  role        text not null check (role in ('owner','assistant','doctor','nutritionist','coach')),
  phone       text,                       -- future bot phone->staff mapping
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Staff compensation rules (spec §6.4). equity = excluded from payouts.
create table public.staff_comp (
  id          uuid primary key default gen_random_uuid(),
  clinic_id   uuid not null references public.clinics(id),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  type        text not null check (type in ('per_consultation','per_patient','monthly_salary','equity')),
  rate        numeric(12,2),
  currency    text check (currency in ('LYD','USD','EGP')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Key/value config store (spec §7). App + public pricing read rules at runtime.
create table public.clinic_settings (
  id          uuid primary key default gen_random_uuid(),
  clinic_id   uuid not null references public.clinics(id),
  key         text not null,
  value       jsonb not null default '{}'::jsonb,
  updated_by  uuid references public.profiles(id),
  updated_at  timestamptz not null default now(),
  unique (clinic_id, key)
);

-- Patients (spec §3.4 / §10). phone unique+editable but NOT the PK; age only (no DOB).
create table public.patients (
  id            uuid primary key default gen_random_uuid(),
  clinic_id     uuid not null references public.clinics(id),
  name          text not null,
  phone         text not null,
  age           integer,
  gender        text,
  location      text,
  height        numeric(5,2),             -- cm
  -- GLP-1 clinical flags (KEEP ALL)
  is_diabetic            boolean not null default false,
  is_hypertensive        boolean not null default false,
  has_pancreatitis       boolean not null default false,
  is_pregnant            boolean not null default false,
  is_breastfeeding       boolean not null default false,
  thyroid_status         text,
  glp1a_previous_exposure boolean not null default false,
  has_rheumatoid         boolean not null default false,
  has_ihd                boolean not null default false,
  has_heart_failure      boolean not null default false,
  has_gerd               boolean not null default false,
  has_gastritis          boolean not null default false,
  has_hepatic            boolean not null default false,
  has_anaemia            boolean not null default false,
  has_bronchial_asthma   boolean not null default false,
  history_of_operation   jsonb,           -- array of past surgeries
  complaint     text,
  job           text,
  source        text,                      -- lead origin (meta_ad/instagram/referral/website/walk_in/other)
  status        text not null default 'lead' check (status in ('lead','active','paused','lapsed','inactive')),
  doctor_id     uuid references public.profiles(id),  -- assigned doctor (care-team detail below)
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (clinic_id, phone)
);

-- Care team (spec §6): one doctor + one nutritionist + optional coach per patient.
create table public.patient_care_team (
  id          uuid primary key default gen_random_uuid(),
  clinic_id   uuid not null references public.clinics(id),
  patient_id  uuid not null references public.patients(id) on delete cascade,
  staff_id    uuid not null references public.profiles(id),
  role        text not null check (role in ('doctor','nutritionist','coach')),
  created_at  timestamptz not null default now(),
  unique (patient_id, role)
);

create table public.weight_logs (
  id            uuid primary key default gen_random_uuid(),
  clinic_id     uuid not null references public.clinics(id),
  patient_id    uuid not null references public.patients(id) on delete cascade,
  weight        numeric(5,2) not null,
  recorded_date date not null,
  notes         text,
  created_at    timestamptz not null default now()
);

-- Dose history + titration (spec §10, from old backend shape).
create table public.injections (
  id                  uuid primary key default gen_random_uuid(),
  clinic_id           uuid not null references public.clinics(id),
  patient_id          uuid not null references public.patients(id) on delete cascade,
  appointment_id      uuid,               -- FK added after appointments table
  medication_name     text not null,
  dose                text not null,
  injection_date      date not null,
  next_suggested_date date,
  next_suggested_dose text,
  notes               text,
  created_at          timestamptz not null default now()
);

-- Free-text lab requests the doctor writes (spec §3.2 / §10).
create table public.lab_requests (
  id            uuid primary key default gen_random_uuid(),
  clinic_id     uuid not null references public.clinics(id),
  patient_id    uuid not null references public.patients(id) on delete cascade,
  requested_by  uuid references public.profiles(id),
  request_text  text not null,
  status        text not null default 'open' check (status in ('open','fulfilled','cancelled')),
  created_at    timestamptz not null default now()
);

-- Lab files in Supabase Storage. ai_extraction_status is a DORMANT seam (no AI now).
create table public.lab_files (
  id                  uuid primary key default gen_random_uuid(),
  clinic_id           uuid not null references public.clinics(id),
  patient_id          uuid not null references public.patients(id) on delete cascade,
  storage_path        text,               -- Supabase Storage object path
  original_filename   text,
  file_size           bigint,
  mime_type           text,
  uploaded_by         uuid references public.profiles(id),
  upload_notes        text,
  ai_extraction_status text not null default 'pending'
    check (ai_extraction_status in ('pending','processing','success','error')),
  created_at          timestamptz not null default now()
);

create table public.lab_results (
  id            uuid primary key default gen_random_uuid(),
  clinic_id     uuid not null references public.clinics(id),
  patient_id    uuid not null references public.patients(id) on delete cascade,
  lab_file_id   uuid references public.lab_files(id) on delete set null,
  test_name     text,
  value         text,
  unit          text,
  normal_range  text,
  status        text,
  test_date     date not null default current_date,
  notes         text,
  created_at    timestamptz not null default now()
);

-- Appointments: Supabase mirror of the Google Calendar event (spec §1 / §4.2).
-- provider_id = the assigned staff for the appointment's track (doctor for
-- consultation, nutritionist for nutrition, coach for coaching).
create table public.appointments (
  id                  uuid primary key default gen_random_uuid(),
  clinic_id           uuid not null references public.clinics(id),
  patient_id          uuid not null references public.patients(id) on delete cascade,
  provider_id         uuid references public.profiles(id),
  appointment_date    timestamptz not null,
  duration_minutes    integer not null default 30,
  type                text not null default 'consultation', -- configurable list in clinic_settings
  status              text not null default 'scheduled'
    check (status in ('scheduled','completed','no_show','cancelled_by_doctor','cancelled_by_patient','rescheduled')),
  meet_link           text,
  booking_source      text not null default 'manual',
  external_booking_id text,               -- nullable seam for future self-booking/TidyCal
  reschedule_count    integer not null default 0,
  cancelled_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Deferred FK: injections.appointment_id -> appointments
alter table public.injections
  add constraint injections_appointment_fk
  foreign key (appointment_id) references public.appointments(id) on delete set null;

-- Subscriptions (spec §6.2). consultations_remaining used only when
-- pause_tracks_consultations is ON. Price stored per-subscription (discounts).
create table public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  clinic_id               uuid not null references public.clinics(id),
  patient_id              uuid not null references public.patients(id) on delete cascade,
  tier                    text not null check (tier in ('t1','t2')),
  price                   numeric(12,2) not null,
  currency                text not null check (currency in ('LYD','USD','EGP')),
  status                  text not null default 'active'
    check (status in ('active','paused','grace','lapsed','cancelled')),
  start_date              date not null,
  next_renewal            date,           -- 1st-of-month
  consultations_remaining integer,
  paused_at               timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Payments (spec §6.3). Currency PER PAYMENT, never converted. Receipts = images
-- in Storage only; NEVER store card/bank numbers. Verify is verifier-gated (trigger).
create table public.payments (
  id                uuid primary key default gen_random_uuid(),
  clinic_id         uuid not null references public.clinics(id),
  patient_id        uuid not null references public.patients(id) on delete cascade,
  subscription_id   uuid references public.subscriptions(id) on delete set null,
  provider_id       uuid references public.profiles(id),     -- attribution (e.g. consulting doctor)
  type              text not null check (type in ('assessment','t1','t2')),
  amount            numeric(12,2) not null,
  currency          text not null check (currency in ('LYD','USD','EGP')),
  method            text,                  -- flexible: transfer/wallet/cash/agent (NO instapay in Libya)
  status            text not null default 'submitted'
    check (status in ('submitted','verified','rejected','refunded')),
  receipt_path      text,                  -- Supabase Storage object path
  uploaded_by       uuid references public.profiles(id),
  verified_by       uuid references public.profiles(id),
  verified_at       timestamptz,
  credit_expires_at timestamptz,           -- assessment credit window (spec §6.1)
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Refunds: a distinct OUT category, never netted into ins (spec §6.3 / §6.5).
create table public.refunds (
  id          uuid primary key default gen_random_uuid(),
  clinic_id   uuid not null references public.clinics(id),
  payment_id  uuid references public.payments(id) on delete set null,
  patient_id  uuid not null references public.patients(id) on delete cascade,
  amount      numeric(12,2) not null,
  currency    text not null check (currency in ('LYD','USD','EGP')),
  reason      text,
  receipt_path text,
  created_by  uuid references public.profiles(id),
  created_at  timestamptz not null default now()
);

-- THE single clinical-notes table (no doctor_notes, no visit_summaries — spec §10).
-- Manual only; a future "summarize" button just writes another row here.
create table public.visit_notes (
  id              uuid primary key default gen_random_uuid(),
  clinic_id       uuid not null references public.clinics(id),
  patient_id      uuid not null references public.patients(id) on delete cascade,
  appointment_id  uuid references public.appointments(id) on delete set null, -- nullable: allows standalone notes
  track           text not null check (track in ('consultation','nutrition','coaching','ad-hoc')),
  author_id       uuid references public.profiles(id),
  note_text       text,
  note_photo_path text,                    -- Supabase Storage object path
  created_at      timestamptz not null default now(),
  check (note_text is not null or note_photo_path is not null)
);

create table public.expenses (
  id           uuid primary key default gen_random_uuid(),
  clinic_id    uuid not null references public.clinics(id),
  category     text not null,             -- flexible, seeded list
  amount       numeric(12,2) not null,
  currency     text not null check (currency in ('LYD','USD','EGP')),
  vendor       text,
  method       text,
  expense_date date not null default current_date,
  receipt_path text,
  created_by   uuid references public.profiles(id),
  created_at   timestamptz not null default now()
);

-- Staff payouts: an OUT flow (spec §6.4 / §6.5).
create table public.payouts (
  id          uuid primary key default gen_random_uuid(),
  clinic_id   uuid not null references public.clinics(id),
  staff_id    uuid not null references public.profiles(id),
  period      text not null,             -- e.g. '2026-06'
  amount      numeric(12,2) not null,
  currency    text not null check (currency in ('LYD','USD','EGP')),
  status      text not null default 'pending' check (status in ('pending','paid')),
  paid_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- Leads (spec §5). booked != converted. Stages are hardcoded funnel logic.
create table public.leads (
  id                   uuid primary key default gen_random_uuid(),
  clinic_id            uuid not null references public.clinics(id),
  name                 text not null,
  phone                text not null,
  email                text,
  source               text check (source in ('meta_ad','instagram','referral','website','walk_in','other')),
  status               text not null default 'new'
    check (status in ('new','contacted','qualified','booked','converted','lost')),
  assigned_to          uuid references public.profiles(id),
  notes                text,
  last_contacted_at    timestamptz,
  converted_patient_id uuid references public.patients(id) on delete set null,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Tasks: assistant exceptions/reminders engine (spec §10, from TabibDesk).
create table public.tasks (
  id           uuid primary key default gen_random_uuid(),
  clinic_id    uuid not null references public.clinics(id),
  title        text not null,
  description  text,
  type         text,
  status       text not null default 'pending' check (status in ('pending','completed','ignored')),
  due_date     date,
  patient_id   uuid references public.patients(id) on delete cascade,
  assigned_to  uuid references public.profiles(id),
  completed_at timestamptz,
  ignored_at   timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Audit log: who changed clinical + payment fields, when (spec §10).
create table public.audit_log (
  id          uuid primary key default gen_random_uuid(),
  clinic_id   uuid references public.clinics(id),
  table_name  text not null,
  record_id   uuid,
  action      text not null,
  changed_by  uuid references public.profiles(id),
  old_data    jsonb,
  new_data    jsonb,
  created_at  timestamptz not null default now()
);

-- Keep-alive heartbeat (spec §13). Written by the GitHub Action; rolling single row.
create table public.heartbeat (
  id      bigint generated always as identity primary key,
  beat_at timestamptz not null default now()
);

-- =============================================================================
-- Indexes
-- =============================================================================
create index on public.profiles (clinic_id);
create index on public.patients (clinic_id);
create index on public.patients (doctor_id);
create index on public.patient_care_team (patient_id);
create index on public.weight_logs (patient_id, recorded_date desc);
create index on public.injections (patient_id, injection_date desc);
create index on public.lab_files (patient_id);
create index on public.lab_results (patient_id, test_date desc);
create index on public.appointments (patient_id);
create index on public.appointments (provider_id);
create index on public.appointments (appointment_date);
create index on public.subscriptions (patient_id);
create index on public.payments (patient_id);
create index on public.payments (status);
create index on public.refunds (patient_id);
create index on public.visit_notes (patient_id, track, created_at desc);
create index on public.leads (status);
create index on public.tasks (status, due_date);
create index on public.audit_log (table_name, record_id);

-- =============================================================================
-- Triggers
-- =============================================================================
create trigger trg_staff_comp_updated     before update on public.staff_comp     for each row execute function public.set_updated_at();
create trigger trg_clinic_settings_updated before update on public.clinic_settings for each row execute function public.set_updated_at();
create trigger trg_patients_updated        before update on public.patients        for each row execute function public.set_updated_at();
create trigger trg_appointments_updated    before update on public.appointments    for each row execute function public.set_updated_at();
create trigger trg_subscriptions_updated   before update on public.subscriptions   for each row execute function public.set_updated_at();
create trigger trg_payments_updated        before update on public.payments        for each row execute function public.set_updated_at();
create trigger trg_leads_updated           before update on public.leads           for each row execute function public.set_updated_at();
create trigger trg_tasks_updated           before update on public.tasks           for each row execute function public.set_updated_at();

-- Payment-verifier enforcement (must run before any audit)
create trigger trg_payments_verify before insert or update on public.payments
  for each row execute function public.enforce_payment_verifier();

-- Audit clinical + money tables
create trigger trg_audit_patients      after insert or update or delete on public.patients      for each row execute function public.audit_row();
create trigger trg_audit_payments      after insert or update or delete on public.payments      for each row execute function public.audit_row();
create trigger trg_audit_subscriptions after insert or update or delete on public.subscriptions for each row execute function public.audit_row();
create trigger trg_audit_injections    after insert or update or delete on public.injections    for each row execute function public.audit_row();
create trigger trg_audit_visit_notes   after insert or update or delete on public.visit_notes   for each row execute function public.audit_row();

-- =============================================================================
-- Row Level Security
--   Launch = permissive viewing/writing for authenticated staff; service_role
--   bypasses RLS. The two day-one restrictions are layered on top:
--     - clinic_settings writes: owner only
--     - payments verify: enforced by the verifier trigger above
--   `heartbeat` has RLS on with NO policy => service_role only.
-- =============================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'clinics','profiles','staff_comp','clinic_settings','patients','patient_care_team',
    'weight_logs','injections','lab_requests','lab_files','lab_results','appointments',
    'subscriptions','payments','refunds','visit_notes','expenses','payouts','leads',
    'tasks','audit_log','heartbeat'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;

  -- Permissive "authenticated full access" on every table EXCEPT clinic_settings
  -- (special-cased below) and heartbeat (service_role only).
  foreach t in array array[
    'clinics','profiles','staff_comp','patients','patient_care_team',
    'weight_logs','injections','lab_requests','lab_files','lab_results','appointments',
    'subscriptions','payments','refunds','visit_notes','expenses','payouts','leads',
    'tasks','audit_log'
  ] loop
    execute format(
      'create policy authenticated_all on public.%I for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- clinic_settings: everyone authenticated can read; only owner can write.
create policy settings_select on public.clinic_settings
  for select to authenticated using (true);
create policy settings_write_owner on public.clinic_settings
  for all to authenticated using (public.app_is_owner()) with check (public.app_is_owner());

-- Public pricing read (spec §7): expose ONLY tier_prices to the public site,
-- without opening clinic_settings to anon. Cached fallback lives in app code.
create or replace function public.get_public_pricing()
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((select value from public.clinic_settings where key = 'tier_prices' limit 1), '{}'::jsonb);
$$;
grant execute on function public.get_public_pricing() to anon, authenticated;

-- =============================================================================
-- Storage buckets (private) for receipts, lab files, note photos (spec §8 / §12)
-- =============================================================================
insert into storage.buckets (id, name, public) values
  ('receipts','receipts', false),
  ('lab-files','lab-files', false),
  ('note-photos','note-photos', false)
on conflict (id) do nothing;

create policy clinicairo_storage_authenticated on storage.objects
  for all to authenticated
  using (bucket_id in ('receipts','lab-files','note-photos'))
  with check (bucket_id in ('receipts','lab-files','note-photos'));

-- =============================================================================
-- Seed: the single clinic + the clinic_settings catalog (spec §6 / §7 defaults)
-- (profiles/staff are created when Supabase Auth is wired in Phase 9.)
-- =============================================================================
insert into public.clinics (id, name, phone, location) values
  ('00000000-0000-0000-0000-000000000001', 'CliniCairo', '+201140988255', 'Online (Libya)')
on conflict (id) do nothing;

insert into public.clinic_settings (clinic_id, key, value) values
  ('00000000-0000-0000-0000-000000000001', 'tier_prices',
     '{"assessment":{"USD":50,"LYD":318},"t1":{"USD":120,"LYD":763},"t2":{"USD":150,"LYD":954}}'),
  ('00000000-0000-0000-0000-000000000001', 'accepted_currencies', '["LYD","USD","EGP"]'),
  ('00000000-0000-0000-0000-000000000001', 'payment_methods', '["transfer","wallet","cash","agent"]'),
  ('00000000-0000-0000-0000-000000000001', 'assessment_credit_window_days', '30'),
  ('00000000-0000-0000-0000-000000000001', 'pause_tracks_consultations', 'false'),
  ('00000000-0000-0000-0000-000000000001', 'consultations_included_per_cycle', '4'),
  ('00000000-0000-0000-0000-000000000001', 'default_appointment_duration_minutes', '30'),
  ('00000000-0000-0000-0000-000000000001', 'appointment_types', '["consultation","nutrition","coaching","follow-up"]'),
  ('00000000-0000-0000-0000-000000000001', 'reschedule_limit_per_subscription', '2'),
  ('00000000-0000-0000-0000-000000000001', 'clinic_timezone', '"Africa/Tripoli"'),
  ('00000000-0000-0000-0000-000000000001', 'booking_buffer_minutes', '15'),
  ('00000000-0000-0000-0000-000000000001', 'grace_period_days', '7'),
  ('00000000-0000-0000-0000-000000000001', 'renewal_reminder_lead_days', '3'),
  ('00000000-0000-0000-0000-000000000001', 'staff_comp_rates',
     '{"doctor_per_consultation":{},"coach_per_patient":{},"nutritionist_salary":{}}'),
  ('00000000-0000-0000-0000-000000000001', 'payment_verifier', '{"roles":["owner"],"staff_ids":[]}'),
  ('00000000-0000-0000-0000-000000000001', 'lead_cold_after_days', '14'),
  ('00000000-0000-0000-0000-000000000001', 'reminder_timings', '{}'),
  ('00000000-0000-0000-0000-000000000001', 'message_templates', '{}'),
  ('00000000-0000-0000-0000-000000000001', 'automation_master_switch',
     '{"appointment_reminder":false,"pre_consult_prompt":false,"post_consult_lab_prompt":false,"renewal_reminder":false,"booking_confirmation":false}'),
  ('00000000-0000-0000-0000-000000000001', 'clinic_identity',
     '{"name":"CliniCairo","whatsapp":"+201140988255","logo":null,"contact":null}')
on conflict (clinic_id, key) do nothing;
