import { TOKEN_STORAGE_KEY } from '../stores/session'

const RAW_BASE_URL = import.meta.env.VITE_API_URL as string | undefined

const normalizeBaseUrl = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    throw new Error('VITE_API_URL is not set')
  }
  return trimmed.endsWith('/') ? trimmed : `${trimmed}/`
}

export const API_BASE_URL = RAW_BASE_URL ? normalizeBaseUrl(RAW_BASE_URL) : ''

type StrapiEntity<T> = {
  id: number
  attributes: T
}

type StrapiResponse<T> = {
  data: T
  meta?: unknown
}

type StrapiMedia = {
  data: StrapiEntity<{ url: string }> | null
}

type StrapiTitle = {
  name: string
  slug: string
  kind: 'movie' | 'series'
  synopsis?: string
  year?: number
  duration?: number
  rating?: number
  ageRating?: string
  isFeatured?: boolean
  poster?: StrapiMedia
  backdrop?: StrapiMedia
  video?: StrapiMedia
  genres?: { data: Array<StrapiEntity<{ name: string }>> }
  cast?: { data: Array<StrapiEntity<{ name: string }>> }
  seasons?: {
    data: Array<
      StrapiEntity<{
        name: string
        number: number
        synopsis?: string
        episodes?: {
          data: Array<
            StrapiEntity<{
              name: string
              number: number
              duration?: number
              video?: StrapiMedia
            }>
          >
        }
      }>
    >
  }
}

export type TitleCard = {
  id: number
  name: string
  kind: 'movie' | 'series'
  year?: number
  rating?: number
  posterUrl?: string
  backdropUrl?: string
  isFeatured?: boolean
}

export type TitleDetail = TitleCard & {
  synopsis?: string
  ageRating?: string
  videoUrl?: string
  genres: string[]
  cast: string[]
  seasons: Array<{
    id: number
    name: string
    number: number
    synopsis?: string
    episodes: Array<{
      id: number
      name: string
      number: number
      duration?: number
      videoUrl?: string
    }>
  }>
}

const resolveMediaUrl = (media?: StrapiMedia) => {
  const url = media?.data?.attributes?.url
  if (!url) return undefined
  if (url.startsWith('http')) return url
  return `${API_BASE_URL.replace(/\/$/, '')}${url}`
}

const mapTitleCard = (entity: StrapiEntity<StrapiTitle>): TitleCard => ({
  id: entity.id,
  name: entity.attributes.name,
  kind: entity.attributes.kind,
  year: entity.attributes.year,
  rating: entity.attributes.rating,
  isFeatured: entity.attributes.isFeatured,
  posterUrl: resolveMediaUrl(entity.attributes.poster),
  backdropUrl: resolveMediaUrl(entity.attributes.backdrop),
})

const mapTitleDetail = (entity: StrapiEntity<StrapiTitle>): TitleDetail => ({
  ...mapTitleCard(entity),
  synopsis: entity.attributes.synopsis,
  ageRating: entity.attributes.ageRating,
  videoUrl: resolveMediaUrl(entity.attributes.video),
  genres: entity.attributes.genres?.data?.map((item) => item.attributes.name) ?? [],
  cast: entity.attributes.cast?.data?.map((item) => item.attributes.name) ?? [],
  seasons:
    entity.attributes.seasons?.data?.map((season) => ({
      id: season.id,
      name: season.attributes.name,
      number: season.attributes.number,
      synopsis: season.attributes.synopsis,
      episodes:
        season.attributes.episodes?.data?.map((episode) => ({
          id: episode.id,
          name: episode.attributes.name,
          number: episode.attributes.number,
          duration: episode.attributes.duration,
          videoUrl: resolveMediaUrl(episode.attributes.video),
        })) ?? [],
    })) ?? [],
})

export const buildUrl = (path: string, params?: Record<string, string>) => {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_URL is not set')
  }
  const cleanPath = path.replace(/^\//, '')
  const url = new URL(cleanPath, API_BASE_URL)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }
  return url.toString()
}

const fetchJson = async <T>(path: string, params?: Record<string, string>) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  const response = await fetch(buildUrl(path, params), {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed (${response.status})`)
  }

  return (await response.json()) as T
}

export const fetchTitles = async (options?: { featured?: boolean }) => {
  const params: Record<string, string> = {
    'populate[poster]': '*',
    'populate[backdrop]': '*',
    'populate[genres]': '*',
    sort: 'updatedAt:desc',
  }

  if (options?.featured) {
    params['filters[isFeatured][$eq]'] = 'true'
  }

  const response = await fetchJson<StrapiResponse<Array<StrapiEntity<StrapiTitle>>>>(
    'api/titles',
    params,
  )

  return response.data.map(mapTitleCard)
}

export const fetchTitleById = async (id: string | number) => {
  const params: Record<string, string> = {
    'populate[poster]': '*',
    'populate[backdrop]': '*',
    'populate[video]': '*',
    'populate[genres]': '*',
    'populate[cast]': '*',
    'populate[seasons][populate][episodes][populate]': '*',
  }

  const response = await fetchJson<StrapiResponse<StrapiEntity<StrapiTitle>>>(
    `api/titles/${id}`,
    params,
  )

  return mapTitleDetail(response.data)
}
