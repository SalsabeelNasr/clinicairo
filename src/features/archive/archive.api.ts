import { mockData } from "@/data/mock/mock-data"

export type ArchiveTab = "appointments" | "tasks" | "leads"

export interface ArchiveItem {
  id: string
  tab: ArchiveTab
  title: string
  subtitle: string
  status: string
  at: string
}

function withinDays(isoDate: string, days: number): boolean {
  if (days === 0) return true
  const threshold = Date.now() - days * 24 * 60 * 60 * 1000
  return new Date(isoDate).getTime() >= threshold
}

function byQuery(items: ArchiveItem[], query: string): ArchiveItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return items
  return items.filter((item) => {
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    )
  })
}

export async function listArchivedAppointments(query: string, days: number): Promise<ArchiveItem[]> {
  const items: ArchiveItem[] = mockData.appointments
    .filter((item) => ["completed", "cancelled", "no_show"].includes(item.status))
    .map((item) => ({
      id: item.id,
      tab: "appointments" as const,
      title: item.patient_name,
      subtitle: item.type,
      status: item.status,
      at: item.scheduled_at,
    }))
    .filter((item) => withinDays(item.at, days))
    .sort((a, b) => b.at.localeCompare(a.at))

  return byQuery(items, query)
}

export async function listArchivedTasks(query: string, days: number): Promise<ArchiveItem[]> {
  const items: ArchiveItem[] = mockData.tasks
    .filter((item) => item.status === "completed" || Boolean(item.ignored_at))
    .map((item) => ({
      id: item.id,
      tab: "tasks" as const,
      title: item.title,
      subtitle: item.description ?? "",
      status: item.status === "completed" ? "completed" : "ignored",
      at: item.completed_at ?? item.ignored_at ?? item.updated_at ?? item.created_at,
    }))
    .filter((item) => withinDays(item.at, days))
    .sort((a, b) => b.at.localeCompare(a.at))

  return byQuery(items, query)
}

export async function listArchivedLeads(query: string, days: number): Promise<ArchiveItem[]> {
  const items: ArchiveItem[] = mockData.leads
    .filter((item) => item.status === "lost" || item.status === "converted")
    .map((item) => ({
      id: item.id,
      tab: "leads" as const,
      title: item.name,
      subtitle: item.source,
      status: item.status,
      at: item.last_contacted_at ?? item.created_at,
    }))
    .filter((item) => withinDays(item.at, days))
    .sort((a, b) => b.at.localeCompare(a.at))

  return byQuery(items, query)
}
