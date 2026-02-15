<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchTitles, type TitleCard } from '../services/api'

const featured = ref<TitleCard[]>([])
const loadingFeatured = ref(true)
const errorFeatured = ref<string | null>(null)

const continueWatching = [
  { id: '4', title: 'Atlas 9', progress: 62 },
  { id: '5', title: 'Cold Orbit', progress: 28 },
  { id: '6', title: 'Signal Lake', progress: 83 },
  { id: '7', title: 'The Violet Room', progress: 45 },
]

const formatKind = (kind: TitleCard['kind']) => (kind === 'series' ? 'Série' : 'Film')

const loadFeatured = async () => {
  loadingFeatured.value = true
  errorFeatured.value = null
  try {
    featured.value = await fetchTitles({ featured: true })
  } catch (error) {
    errorFeatured.value = error instanceof Error ? error.message : 'Impossible de charger'
  } finally {
    loadingFeatured.value = false
  }
}

onMounted(loadFeatured)
</script>

<template>
  <section class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
    <div class="space-y-6">
      <div class="badge badge-outline">Nouveau MVP</div>
      <h1 class="text-4xl font-display tracking-tight sm:text-5xl">
        Ton cinéma privé, pensé pour le homelab
      </h1>
      <p class="text-base leading-relaxed text-base-content/70">
        Catalogue maîtrisé, lecture fluide, reprise automatique. Tout ce qu’il faut
        pour un usage perso et une famille proche, sans dépendre d’un SaaS.
      </p>
      <div class="flex flex-wrap gap-3">
        <RouterLink to="/catalog" class="btn btn-primary">
          Explorer le catalogue
        </RouterLink>
        <RouterLink to="/continue" class="btn btn-ghost">
          Continuer à regarder
        </RouterLink>
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <div class="rounded-2xl border border-base-300/70 bg-base-200/70 p-4">
          <p class="text-xs uppercase text-base-content/60">Lectures</p>
          <p class="text-2xl font-display">12</p>
          <p class="text-xs text-base-content/60">sessions cette semaine</p>
        </div>
        <div class="rounded-2xl border border-base-300/70 bg-base-200/70 p-4">
          <p class="text-xs uppercase text-base-content/60">Progression</p>
          <p class="text-2xl font-display">4</p>
          <p class="text-xs text-base-content/60">titres en cours</p>
        </div>
        <div class="rounded-2xl border border-base-300/70 bg-base-200/70 p-4">
          <p class="text-xs uppercase text-base-content/60">Nouveaux</p>
          <p class="text-2xl font-display">2</p>
          <p class="text-xs text-base-content/60">ajouts récents</p>
        </div>
      </div>
    </div>

    <div class="rounded-3xl border border-base-300/70 bg-base-200/60 p-6">
      <h2 class="mb-4 text-lg font-display">Sélection du moment</h2>
      <div class="space-y-4">
        <div v-if="loadingFeatured" class="text-sm text-base-content/60">
          Chargement des titres en vedette...
        </div>
        <div v-else-if="errorFeatured" class="text-sm text-error">
          {{ errorFeatured }}
        </div>
        <template v-else>
          <div
            v-for="item in featured"
            :key="item.id"
            class="flex items-center justify-between rounded-2xl border border-base-300/60 bg-base-100/40 px-4 py-3"
          >
            <div>
              <p class="font-semibold">{{ item.name }}</p>
              <p class="text-xs text-base-content/60">
                {{ formatKind(item.kind) }} · {{ item.year ?? '—' }}
              </p>
            </div>
            <RouterLink :to="`/title/${item.id}`" class="btn btn-xs btn-outline">
              Détails
            </RouterLink>
          </div>
        </template>
        <div v-if="!loadingFeatured && !errorFeatured && featured.length === 0" class="text-sm text-base-content/60">
          Aucun titre en vedette pour le moment.
        </div>
      </div>
    </div>
  </section>

  <section class="mt-12 space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-display">Continuer à regarder</h2>
      <RouterLink to="/continue" class="link link-hover text-sm text-base-content/60">
        Voir tout
      </RouterLink>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="item in continueWatching"
        :key="item.id"
        class="rounded-2xl border border-base-300/70 bg-base-200/60 p-4"
      >
        <div class="mb-3 h-28 rounded-xl bg-base-300/60"></div>
        <p class="font-semibold">{{ item.title }}</p>
        <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-base-300">
          <div class="h-full bg-primary" :style="{ width: `${item.progress}%` }"></div>
        </div>
        <RouterLink :to="`/watch/${item.id}`" class="btn btn-xs btn-primary mt-3">
          Reprendre
        </RouterLink>
      </div>
    </div>
  </section>
</template>
