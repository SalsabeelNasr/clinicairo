/**
 * Mock auth repository - returns demo user, no Supabase.
 */

import { DEMO_DOCTOR_ID } from "@/lib/constants"
import type { IAuthRepository, AuthUser } from "../../interfaces/auth.interface"

const DEMO_USER: AuthUser = {
  id: DEMO_DOCTOR_ID,
  email: "test@clinicairo.com",
}

const DEMO_EMAIL = "test@clinicairo.com"
const DEMO_PASSWORD = "password"

export class MockAuthRepository implements IAuthRepository {
  async getCurrentUser(): Promise<AuthUser | null> {
    return DEMO_USER
  }

  async signIn(email: string, password: string): Promise<{ user: AuthUser }> {
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      throw new Error("Invalid email or password")
    }
    return { user: DEMO_USER }
  }

  async signOut(): Promise<void> {
    // No-op in demo
  }

  async signUp(_email: string, _password: string): Promise<{ user: AuthUser }> {
    return { user: DEMO_USER }
  }
}
