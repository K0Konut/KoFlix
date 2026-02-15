<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchTitles, type TitleCard } from '../services/api'

const titles = ref<TitleCard[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fallbackGenres = ['Sci-Fi', 'Thriller', 'Drama', 'Animation', 'Documentaire']

const genres = computed(() => {
  if (!titles.value.length) return fallbackGenres
  const genreSet = new Set<string>()
  titles.value.forEach((title) => {
    if (title.kind === 'movie') genreSet.add('Film')
    if (title.kind === 'series') genreSet.add('Série')
  })
  return Array.from(genreSet)
})

const formatKind = (kind: TitleCard['kind']) => (kind === 'series' ? 'Série' : 'Film')

const loadTitles = async () => {
  loading.value = true
  error.value = null
  try {
    titles.value = await fetchTitles()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Impossible de charger'
  } finally {
    loading.value = false
  }
}

onMounted(loadTitles)
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-3xl font-display">Catalogue</h1>
        <p class="text-sm text-base-content/60">
          Parcours rapide par genre, année et type. Les données viendront de Strapi.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Recherche rapide"
          class="input input-bordered input-sm w-48"
        />
        <select class="select select-bordered select-sm">
          <option>Type</option>
          <option>Film</option>
          <option>Série</option>
        </select>
        <select class="select select-bordered select-sm">
          <option>Année</option>
          <option>2024</option>
          <option>2023</option>
          <option>2022</option>
        </select>
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <span v-for="genre in genres" :key="genre" class="badge badge-outline">
        {{ genre }}
      </span>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-if="loading" class="text-sm text-base-content/60">
        Chargement du catalogue...
      </div>
      <div v-else-if="error" class="text-sm text-error">
        {{ error }}
      </div>
      <template v-else>
        <article
          v-for="title in titles"
          :key="title.id"
          class="rounded-2xl border border-base-300/70 bg-base-200/60 p-4"
        >
          <div
            class="mb-3 h-40 overflow-hidden rounded-xl bg-base-300/60"
            :style="title.posterUrl ? { backgroundImage: `url(${title.posterUrl})`, backgroundSize: 'cover' } : undefined"
          ></div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-semibold">{{ title.name }}</h3>
              <p class="text-xs text-base-content/60">
                {{ formatKind(title.kind) }} · {{ title.year ?? '—' }}
              </p>
            </div>
            <RouterLink :to="`/title/${title.id}`" class="btn btn-xs btn-outline">
              Voir
            </RouterLink>
          </div>
        </article>
        <div v-if="titles.length === 0" class="text-sm text-base-content/60">
          Aucun titre disponible pour le moment.
        </div>
      </template>
    </div>
  </section>
</template>
