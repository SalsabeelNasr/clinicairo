import { PageSkeleton } from "@/components/skeletons/PageSkeleton"

export default function PatientProfileLoading() {
  return (
    <div className="app-page">
      <PageSkeleton showHeader contentBlocks={3} />
    </div>
  )
}
