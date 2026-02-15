import { buildUrl } from './api'

export type AuthUser = {
  id: number
  username: string
  email: string
}

type LoginResponse = {
  jwt: string
  user: AuthUser
}

export const login = async (identifier: string, password: string) => {
  if (!identifier || !password) {
    throw new Error('Identifiants requis')
  }

  const response = await fetch(buildUrl('api/auth/local'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identifier, password }),
  })

  const data = (await response.json().catch(() => null)) as LoginResponse | {
    error?: { message?: string }
    message?: string
  } | null

  if (!response.ok) {
    const message =
      (data && 'error' in data && data.error?.message) ||
      (data && 'message' in data && data.message) ||
      `Request failed (${response.status})`
    throw new Error(message)
  }

  if (!data || !('jwt' in data)) {
    throw new Error('Réponse invalide')
  }

  return data as LoginResponse
}
