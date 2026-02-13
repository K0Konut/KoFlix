export type ProgressEntry = {
  value: number
  position: number
  duration: number
  updatedAt: number
}

export type ProgressMap = Record<string, ProgressEntry>

const STORAGE_KEY = 'koflix:progress'
export const PROGRESS_EVENT = 'koflix:progress'

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export const loadProgressMap = (): ProgressMap => {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as ProgressMap
    if (parsed && typeof parsed === 'object') {
      return parsed
    }
  } catch {
    return {}
  }
  return {}
}

export const getProgressEntry = (id: string): ProgressEntry | undefined => {
  const map = loadProgressMap()
  return map[id]
}

export const saveProgressEntry = (id: string, entry: ProgressEntry) => {
  if (typeof window === 'undefined') return
  const map = loadProgressMap()
  map[id] = {
    value: clamp(entry.value),
    position: Math.max(0, entry.position),
    duration: Math.max(0, entry.duration),
    updatedAt: entry.updatedAt,
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: { id } }))
}

export const applyProgress = <T extends { id: string; progress?: number }>(items: T[]): T[] => {
  const map = loadProgressMap()
  return items.map((item) => {
    const entry = map[item.id]
    if (!entry) return item
    return { ...item, progress: entry.value }
  })
}
