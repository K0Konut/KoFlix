<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchTitleById, type TitleDetail } from '../services/api'

const route = useRoute()

const title = ref<TitleDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const formatKind = (kind: TitleDetail['kind']) => (kind === 'series' ? 'Série' : 'Film')

const firstSeasonEpisodes = computed(() => title.value?.seasons?.[0]?.episodes ?? [])

const loadTitle = async (id: string | string[]) => {
  const resolvedId = Array.isArray(id) ? id[0] : id
  if (!resolvedId) return
  loading.value = true
  error.value = null
  try {
    title.value = await fetchTitleById(resolvedId)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Impossible de charger'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadTitle(route.params.id))
watch(
  () => route.params.id,
  (value) => loadTitle(value),
)
</script>

<template>
  <section class="space-y-8">
    <div v-if="loading" class="text-sm text-base-content/60">
      Chargement de la fiche...
    </div>
    <div v-else-if="error" class="text-sm text-error">
      {{ error }}
    </div>
    <div v-else-if="title" class="space-y-8">
      <div class="grid gap-6 lg:grid-cols-[0.6fr_1fr]">
        <div
          class="relative h-72 overflow-hidden rounded-3xl border border-base-300/70 bg-base-200/60"
          :style="title.backdropUrl ? { backgroundImage: `url(${title.backdropUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined"
        >
          <div class="absolute inset-0 bg-gradient-to-tr from-base-300/70 to-transparent"></div>
        </div>
        <div class="space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="badge badge-primary">{{ formatKind(title.kind) }}</span>
            <span class="badge badge-outline">{{ title.year ?? '—' }}</span>
            <span v-if="title.rating" class="badge badge-outline">{{ title.rating }} / 10</span>
            <span v-if="title.ageRating" class="badge badge-outline">{{ title.ageRating }}</span>
          </div>
          <h1 class="text-3xl font-display">{{ title.name }}</h1>
          <p class="text-base text-base-content/70">{{ title.synopsis }}</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="genre in title.genres" :key="genre" class="badge badge-ghost">
              {{ genre }}
            </span>
          </div>
          <div v-if="title.cast.length">
            <p class="text-xs uppercase text-base-content/60">Casting</p>
            <p class="text-sm">{{ title.cast.join(' · ') }}</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <RouterLink :to="`/watch/${title.id}`" class="btn btn-primary">Lecture</RouterLink>
            <button class="btn btn-outline">Ajouter à ma liste</button>
          </div>
        </div>
      </div>

      <div class="rounded-3xl border border-base-300/70 bg-base-200/60 p-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-display">Épisodes</h2>
          <span class="text-xs text-base-content/60">
            {{ title.seasons.length ? `Saison ${title.seasons[0].number}` : 'Aucune saison' }}
          </span>
        </div>
        <div class="mt-4 space-y-3">
          <div
            v-for="episode in firstSeasonEpisodes"
            :key="episode.id"
            class="flex items-center justify-between rounded-2xl border border-base-300/70 bg-base-100/40 px-4 py-3"
          >
            <div>
              <p class="font-semibold">Épisode {{ episode.number }} · {{ episode.name }}</p>
              <p class="text-xs text-base-content/60">{{ episode.duration ?? '—' }} min</p>
            </div>
            <RouterLink :to="`/watch/${episode.id}`" class="btn btn-xs btn-outline">
              Lire
            </RouterLink>
          </div>
          <div v-if="firstSeasonEpisodes.length === 0" class="text-sm text-base-content/60">
            Aucun épisode disponible pour le moment.
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
