"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { RiFlaskLine } from "@remixicon/react"
import { useDemo } from "@/contexts/demo-context"
import { useLocale } from "@/contexts/locale-context"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { BrandLogo } from "@/components/brand-logo"
import { LanguageToggle } from "@/components/shell/LanguageToggle"

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { enableDemoMode } = useDemo()
  const { setLanguage } = useLocale()
  const t = useAppTranslations()

  useEffect(() => {
    const urlLang = searchParams.get("lang")
    if (urlLang === "ar" || urlLang === "en") setLanguage(urlLang)
  }, [searchParams, setLanguage])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = t.auth.emailRequired
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t.auth.emailInvalid
    }

    if (!password) {
      newErrors.password = t.auth.passwordRequired
    } else if (password.length < 6) {
      newErrors.password = t.auth.passwordMinLength
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDemoLogin = () => {
    enableDemoMode()
    router.push("/dashboard")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // TODO(Phase 9): authenticate via Supabase Auth (provisioned team members only).
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/dashboard")
  }

  return (
    <div className="relative flex min-h-screen rtl:flex-row-reverse">
      <div className="absolute top-4 z-10 end-4">
        <LanguageToggle align="end" />
      </div>
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <BrandLogo className="text-2xl" />

          <div className="mt-8">
            <h1 className="text-xl font-bold text-gray-900">{t.auth.signIn}</h1>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <Label htmlFor="email" className="mb-2 block">
                  {t.auth.email}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  dir="ltr"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrors({ ...errors, email: undefined })
                  }}
                  placeholder="doctor@clinicairo.com"
                  hasError={!!errors.email}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="mb-2 block">
                  {t.auth.password}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  dir="ltr"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors({ ...errors, password: undefined })
                  }}
                  placeholder="••••••••"
                  hasError={!!errors.password}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ms-2 block text-sm text-gray-700"
                  >
                    {t.auth.rememberMe}
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-primary-600 transition hover:text-primary-500"
                  >
                    {t.auth.forgotPassword}
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
                loadingText={t.auth.signingIn}
              >
                {t.auth.signIn}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">{t.auth.or}</span>
                </div>
              </div>

              <Button
                type="button"
                variant="light"
                className="w-full"
                onClick={handleDemoLogin}
              >
                <RiFlaskLine className="me-2 size-4" />
                {t.auth.tryDemoMode}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-900" />
        <div className="absolute top-8 flex items-center gap-3 end-8">
          <BrandLogo className="text-2xl text-white" />
        </div>
      </div>
    </div>
  )
}

function LoginPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  )
}
