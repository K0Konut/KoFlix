import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'koflix_token'

export const useSessionStore = defineStore('session', () => {
  const token = ref<string | null>(localStorage.getItem(STORAGE_KEY))
  const isAuthenticated = computed(() => Boolean(token.value))

  const setToken = (value: string) => {
    token.value = value
    localStorage.setItem(STORAGE_KEY, value)
  }

  const clear = () => {
    token.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    token,
    isAuthenticated,
    setToken,
    clear,
  }
})
