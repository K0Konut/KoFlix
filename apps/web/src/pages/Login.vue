<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../services/auth'
import { useSessionStore } from '../stores/session'

const route = useRoute()
const router = useRouter()
const session = useSessionStore()

const identifier = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const submit = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await login(identifier.value, password.value)
    session.setToken(response.jwt)
    const redirect = route.query.redirect
    if (typeof redirect === 'string' && redirect.length > 0) {
      router.push(redirect)
    } else {
      router.push('/')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Connexion impossible'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="mx-auto flex w-full max-w-md flex-col gap-6">
    <div>
      <h1 class="text-3xl font-display">Connexion</h1>
      <p class="text-sm text-base-content/60">
        Accès privé. Utilise les identifiants Strapi Users & Permissions.
      </p>
    </div>

    <form
      class="space-y-4 rounded-3xl border border-base-300/70 bg-base-200/60 p-6"
      @submit.prevent="submit"
    >
      <div>
        <label class="label text-xs uppercase text-base-content/60">Email</label>
        <input
          v-model="identifier"
          type="email"
          class="input input-bordered w-full"
          placeholder="moi@exemple.dev"
          autocomplete="email"
        />
      </div>
      <div>
        <label class="label text-xs uppercase text-base-content/60">Mot de passe</label>
        <input
          v-model="password"
          type="password"
          class="input input-bordered w-full"
          placeholder="••••••••"
          autocomplete="current-password"
        />
      </div>
      <button class="btn btn-primary w-full" type="submit" :disabled="loading">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
      <p v-if="error" class="text-xs text-error">{{ error }}</p>
      <p class="text-xs text-base-content/60">
        Pas d’inscription publique. Contacte l’admin si besoin.
      </p>
    </form>
  </section>
</template>
