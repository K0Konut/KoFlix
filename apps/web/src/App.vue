<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useSessionStore } from './stores/session'

const session = useSessionStore()
const router = useRouter()

const logout = () => {
  session.clear()
  router.push('/')
}
</script>

<template>
  <div class="relative min-h-screen bg-base-100 text-base-content font-body">
    <div class="pointer-events-none fixed inset-0 -z-10">
      <div class="absolute -top-40 right-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl"></div>
      <div class="absolute bottom-[-10rem] left-[-6rem] h-[30rem] w-[30rem] rounded-full bg-secondary/20 blur-3xl"></div>
      <div class="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"></div>
    </div>

    <header class="sticky top-0 z-20 border-b border-base-300/60 bg-base-200/70 backdrop-blur">
      <div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3 sm:px-8 lg:px-10">
        <div class="flex items-center gap-3">
          <RouterLink
            to="/"
            class="btn btn-ghost text-lg font-display tracking-tight"
          >
            <span class="text-primary">Ko</span>Flix
          </RouterLink>
          <div class="hidden items-center gap-2 md:flex">
            <RouterLink to="/" class="btn btn-ghost btn-sm" active-class="btn-active">Accueil</RouterLink>
            <RouterLink to="/catalog" class="btn btn-ghost btn-sm" active-class="btn-active">Catalogue</RouterLink>
            <RouterLink to="/continue" class="btn btn-ghost btn-sm" active-class="btn-active">Continuer</RouterLink>
            <RouterLink to="/my-list" class="btn btn-ghost btn-sm" active-class="btn-active">Ma liste</RouterLink>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="hidden items-center gap-2 rounded-full border border-base-300/80 bg-base-100/50 px-3 py-1 text-xs text-base-content/70 sm:flex">
            <span class="inline-flex h-2 w-2 rounded-full bg-success shadow-glow"></span>
            Homelab prêt
          </div>
          <RouterLink
            v-if="session.isAuthenticated"
            to="/my-list"
            class="btn btn-secondary btn-sm"
          >
            Mon espace
          </RouterLink>
          <button
            v-if="session.isAuthenticated"
            class="btn btn-ghost btn-sm"
            type="button"
            @click="logout"
          >
            Déconnexion
          </button>
          <RouterLink
            v-else
            to="/login"
            class="btn btn-primary btn-sm"
          >
            Connexion
          </RouterLink>
        </div>
      </div>
      <div class="border-t border-base-300/60 px-6 py-2 text-xs text-base-content/60 sm:px-8 lg:px-10 md:hidden">
        <div class="flex flex-wrap gap-2">
          <RouterLink to="/" class="badge badge-outline">Accueil</RouterLink>
          <RouterLink to="/catalog" class="badge badge-outline">Catalogue</RouterLink>
          <RouterLink to="/continue" class="badge badge-outline">Continuer</RouterLink>
          <RouterLink to="/my-list" class="badge badge-outline">Ma liste</RouterLink>
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl px-6 pb-16 pt-10 sm:px-8 lg:px-10">
      <RouterView />
    </main>

    <footer class="border-t border-base-300/60 py-6 text-center text-xs text-base-content/60">
      KoFlix MVP · streaming privé
    </footer>
  </div>
</template>
