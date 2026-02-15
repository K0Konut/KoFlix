import { apiFetchJson, buildUrl } from './api'
import { getCurrentUser } from './progress'
import { TOKEN_STORAGE_KEY } from '../stores/session'

type StrapiEntity<T> = {
  id: number
  attributes: T
}

type StrapiResponse<T> = {
  data: T
}

type StrapiTitleLite = {
  name: string
  kind: 'movie' | 'series'
  year?: number
}

type FavoriteAttributes = {
  title?: { data: StrapiEntity<StrapiTitleLite> | null }
}

export type FavoriteItem = {
  id: number
  titleId: number
  name: string
  kind: 'movie' | 'series'
  year?: number
}

const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (!token) return undefined
  return { Authorization: `Bearer ${token}` }
}

const mapFavorite = (entity: StrapiEntity<FavoriteAttributes>): FavoriteItem | null => {
  const title = entity.attributes.title?.data
  if (!title) return null
  return {
    id: entity.id,
    titleId: title.id,
    name: title.attributes.name,
    kind: title.attributes.kind,
    year: title.attributes.year,
  }
}

export const fetchFavorites = async () => {
  const user = await getCurrentUser()
  const params: Record<string, string> = {
    'filters[user][id][$eq]': String(user.id),
    'populate[title]': '*',
    sort: 'updatedAt:desc',
  }

  const response = await apiFetchJson<StrapiResponse<Array<StrapiEntity<FavoriteAttributes>>>>(
    'api/favorites',
    params,
  )

  return response.data
    .map(mapFavorite)
    .filter((item): item is FavoriteItem => Boolean(item))
}

export const fetchFavoriteForTitle = async (titleId: number) => {
  const user = await getCurrentUser()
  const params: Record<string, string> = {
    'filters[user][id][$eq]': String(user.id),
    'filters[title][id][$eq]': String(titleId),
    'populate[title]': '*',
  }

  const response = await apiFetchJson<StrapiResponse<Array<StrapiEntity<FavoriteAttributes>>>>(
    'api/favorites',
    params,
  )

  const favorite = response.data[0]
  return favorite ? mapFavorite(favorite) : null
}

export const addFavorite = async (titleId: number) => {
  const user = await getCurrentUser()
  const response = await fetch(buildUrl('api/favorites'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ data: { title: titleId, user: user.id } }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed (${response.status})`)
  }

  const data = (await response.json()) as StrapiResponse<StrapiEntity<FavoriteAttributes>>
  const mapped = mapFavorite(data.data)
  if (!mapped) {
    throw new Error('Réponse invalide')
  }
  return mapped
}

export const removeFavorite = async (favoriteId: number) => {
  const response = await fetch(buildUrl(`api/favorites/${favoriteId}`), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed (${response.status})`)
  }
}
