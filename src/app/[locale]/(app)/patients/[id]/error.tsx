"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/Button"
import { useAppTranslations } from "@/lib/useAppTranslations"

export default function PatientProfileError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const params = useParams<{ locale: string }>()
  const t = useAppTranslations()
  const locale = params.locale ?? "en"
  const patientsHref = `/${locale}/patients`

  return (
    <div className="app-page flex min-h-[50vh] flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-primary-600">
          {t.profile.routeErrorTitle}
        </p>
        <h2 className="mt-3 text-lg font-semibold text-gray-800">{t.profile.routeErrorHeading}</h2>
        <p className="mt-2 text-theme-sm text-gray-500">{t.profile.routeErrorBody}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={reset} className="w-full sm:w-auto">
            {t.profile.routeErrorRetry}
          </Button>
          <Button asChild variant="primary" className="w-full sm:w-auto">
            <Link href={patientsHref}>{t.profile.backToPatients}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
