import { apiFetchJson, buildUrl } from './api'
import { TOKEN_STORAGE_KEY } from '../stores/session'
import type { AuthUser } from './auth'

type ProgressPayload = {
  progressSeconds: number
  durationSeconds: number
  completed: boolean
  lastWatchedAt: string
  user: number
  title?: number
  episode?: number
}

type ProgressAttributes = {
  progressSeconds: number
  durationSeconds?: number
  completed?: boolean
  lastWatchedAt?: string
}

type StrapiEntity<T> = {
  id: number
  attributes: T
}

type StrapiResponse<T> = {
  data: T
}

let cachedUser: AuthUser | null = null

const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (!token) return undefined
  return { Authorization: `Bearer ${token}` }
}

export const getCurrentUser = async () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (!token) {
    cachedUser = null
    throw new Error('Utilisateur non authentifié')
  }
  if (cachedUser) return cachedUser
  const response = await fetch(buildUrl('api/users/me'), {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Impossible de récupérer le profil')
  }

  const data = (await response.json()) as AuthUser
  cachedUser = data
  return data
}

export const fetchProgressEntry = async (params: { titleId?: number; episodeId?: number }) => {
  const user = await getCurrentUser()
  const query: Record<string, string> = {
    'filters[user][id][$eq]': String(user.id),
    sort: 'updatedAt:desc',
  }

  if (params.titleId) {
    query['filters[title][id][$eq]'] = String(params.titleId)
  }

  if (params.episodeId) {
    query['filters[episode][id][$eq]'] = String(params.episodeId)
  }

  const response = await apiFetchJson<StrapiResponse<Array<StrapiEntity<ProgressAttributes>>>>(
    'api/progresses',
    query,
  )

  return response.data[0] ?? null
}

export const saveProgressEntry = async (params: {
  progressId?: number | null
  titleId?: number
  episodeId?: number
  progressSeconds: number
  durationSeconds: number
  completed: boolean
}) => {
  const user = await getCurrentUser()
  const payload: ProgressPayload = {
    progressSeconds: params.progressSeconds,
    durationSeconds: params.durationSeconds,
    completed: params.completed,
    lastWatchedAt: new Date().toISOString(),
    title: params.titleId,
    episode: params.episodeId,
    user: user.id,
  }

  if (params.progressId) {
    const response = await fetch(buildUrl(`api/progresses/${params.progressId}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ data: payload }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || `Request failed (${response.status})`)
    }

    const data = (await response.json()) as StrapiResponse<StrapiEntity<ProgressAttributes>>
    return data.data
  }

  const response = await fetch(buildUrl('api/progresses'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ data: payload }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed (${response.status})`)
  }

  const data = (await response.json()) as StrapiResponse<StrapiEntity<ProgressAttributes>>
  return data.data
}
