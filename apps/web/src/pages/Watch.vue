<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchEpisodeById, fetchTitleById, type EpisodeDetail, type TitleDetail } from '../services/api'
import { fetchProgressEntry, saveProgressEntry } from '../services/progress'
import { addFavorite, fetchFavoriteForTitle, removeFavorite } from '../services/favorites'
import { useSessionStore } from '../stores/session'

const route = useRoute()
const videoRef = ref<HTMLVideoElement | null>(null)

const loading = ref(true)
const error = ref<string | null>(null)

const currentTitle = ref<TitleDetail | null>(null)
const currentEpisode = ref<EpisodeDetail | null>(null)
const session = useSessionStore()
const favoriteId = ref<number | null>(null)
const favoriteLoading = ref(false)

const progressId = ref<number | null>(null)
const savedProgressSeconds = ref(0)
const lastSavedSeconds = ref(0)

const videoUrl = computed(() => currentEpisode.value?.videoUrl || currentTitle.value?.videoUrl)
const titleName = computed(() => currentEpisode.value?.title?.name || currentTitle.value?.name || 'Lecture')
const subtitle = computed(() => {
  if (currentEpisode.value?.seasonNumber) {
    return `Saison ${currentEpisode.value.seasonNumber} · Épisode ${currentEpisode.value.number}`
  }
  return currentTitle.value?.kind === 'movie' ? 'Film' : 'Série'
})

const titleId = computed(() => currentEpisode.value?.title?.id || currentTitle.value?.id)
const episodeId = computed(() => currentEpisode.value?.id)

let saveInterval: number | null = null

const loadWatch = async (rawId: string | string[] | undefined) => {
  const resolvedId = Array.isArray(rawId) ? rawId[0] : rawId
  if (!resolvedId) return

  loading.value = true
  error.value = null
  currentTitle.value = null
  currentEpisode.value = null
  progressId.value = null
  savedProgressSeconds.value = 0
  lastSavedSeconds.value = 0
  favoriteId.value = null

  try {
    currentEpisode.value = await fetchEpisodeById(resolvedId)
  } catch {
    try {
      currentTitle.value = await fetchTitleById(resolvedId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Impossible de charger la vidéo'
    }
  } finally {
    loading.value = false
  }

  if (error.value) return

  try {
    const entry = await fetchProgressEntry({
      titleId: titleId.value,
      episodeId: episodeId.value,
    })

    if (entry) {
      progressId.value = entry.id
      savedProgressSeconds.value = entry.attributes.progressSeconds
      lastSavedSeconds.value = entry.attributes.progressSeconds
    }
  } catch {
    // Silent: progress is best-effort, UI should still load.
  }

  try {
    if (session.isAuthenticated && titleId.value) {
      const favorite = await fetchFavoriteForTitle(titleId.value)
      favoriteId.value = favorite?.id ?? null
    }
  } catch {
    // Silent: favorite is best-effort here.
  }
}

const restoreProgress = () => {
  const video = videoRef.value
  if (!video) return
  if (!Number.isFinite(video.duration) || video.duration <= 0) return
  if (savedProgressSeconds.value > 0) {
    const target = Math.min(savedProgressSeconds.value, Math.max(video.duration - 2, 0))
    video.currentTime = target
  }
}

const persistProgress = async (forceCompleted = false) => {
  const video = videoRef.value
  if (!video || !titleId.value) return

  const durationSeconds = Math.floor(video.duration || 0)
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return

  const progressSeconds = Math.floor(video.currentTime)
  if (!forceCompleted && progressSeconds < 5) return
  if (!forceCompleted && Math.abs(progressSeconds - lastSavedSeconds.value) < 5) return

  const completed =
    forceCompleted || (durationSeconds > 0 && progressSeconds / durationSeconds >= 0.95)

  try {
    const saved = await saveProgressEntry({
      progressId: progressId.value,
      titleId: titleId.value,
      episodeId: episodeId.value,
      progressSeconds,
      durationSeconds,
      completed,
    })

    progressId.value = saved.id
    lastSavedSeconds.value = progressSeconds
  } catch {
    // Do not block playback if progress sync fails.
  }
}

const startAutosave = () => {
  if (saveInterval) window.clearInterval(saveInterval)
  saveInterval = window.setInterval(() => {
    if (videoRef.value?.paused || videoRef.value?.ended) return
    void persistProgress(false)
  }, 20000)
}

const stopAutosave = () => {
  if (saveInterval) {
    window.clearInterval(saveInterval)
    saveInterval = null
  }
}

const toggleFavorite = async () => {
  if (!titleId.value) return
  favoriteLoading.value = true
  try {
    if (favoriteId.value) {
      await removeFavorite(favoriteId.value)
      favoriteId.value = null
    } else {
      const favorite = await addFavorite(titleId.value)
      favoriteId.value = favorite.id
    }
  } finally {
    favoriteLoading.value = false
  }
}

onMounted(() => {
  void loadWatch(route.params.id)
  startAutosave()
})

watch(
  () => route.params.id,
  (value) => {
    stopAutosave()
    void loadWatch(value)
    startAutosave()
  },
)

onBeforeUnmount(() => {
  stopAutosave()
  void persistProgress(false)
})
</script>

<template>
  <section class="space-y-6">
    <div v-if="loading" class="text-sm text-base-content/60">
      Chargement de la vidéo...
    </div>
    <div v-else-if="error" class="text-sm text-error">
      {{ error }}
    </div>
    <div v-else class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-display">{{ titleName }}</h1>
          <p class="text-sm text-base-content/60">{{ subtitle }}</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-sm" type="button" :disabled="favoriteLoading" @click="toggleFavorite">
            {{ favoriteId ? 'Retirer de ma liste' : 'Ajouter à ma liste' }}
          </button>
          <RouterLink
            v-if="titleId"
            :to="`/title/${titleId}`"
            class="btn btn-ghost btn-sm"
          >
            Retour fiche
          </RouterLink>
        </div>
      </div>

      <div class="overflow-hidden rounded-3xl border border-base-300/70 bg-black">
        <video
          ref="videoRef"
          class="h-[52vh] w-full bg-black"
          controls
          :src="videoUrl"
          @loadedmetadata="restoreProgress"
          @ended="persistProgress(true)"
        ></video>
        <div v-if="!videoUrl" class="p-6 text-sm text-base-content/60">
          Aucune vidéo disponible pour le moment.
        </div>
      </div>

      <div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div class="rounded-2xl border border-base-300/70 bg-base-200/60 p-4">
          <p class="text-sm text-base-content/70">
            La progression est synchronisée automatiquement toutes les 20 secondes.
          </p>
        </div>
        <div class="rounded-2xl border border-base-300/70 bg-base-200/60 p-4">
          <p class="text-sm font-semibold">Prochaine étape</p>
          <p class="text-xs text-base-content/60">
            La recommandation automatique sera ajoutée à l’étape 5.
          </p>
          <button class="btn btn-primary btn-sm mt-3" type="button">Découvrir</button>
        </div>
      </div>
    </div>
  </section>
</template>
