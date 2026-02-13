<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { catalog } from '../data/catalog'
import { getProgressEntry, saveProgressEntry } from '../data/progress'

const route = useRoute()
const item = computed(() => catalog.find((entry) => entry.id === route.params.id))

const player = ref<HTMLVideoElement | null>(null)
const currentTime = ref(0)
const duration = ref(0)
const lastSavedAt = ref<number | null>(null)
const lastSavedPosition = ref(0)
const resumePosition = ref<number | null>(null)
const saveEverySeconds = 10
const saveStatus = ref('En attente')

const videoSource = computed(() => 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')

const progressValue = computed(() => {
  if (!duration.value) return 0
  return Math.min(1, Math.max(0, currentTime.value / duration.value))
})

const formatTime = (value: number) => {
  if (!Number.isFinite(value) || value < 0) return '--:--'
  const totalSeconds = Math.floor(value)
  const seconds = totalSeconds % 60
  const totalMinutes = Math.floor(totalSeconds / 60)
  const minutes = totalMinutes % 60
  const hours = Math.floor(totalMinutes / 60)
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const loadResume = () => {
  if (!item.value) return
  const entry = getProgressEntry(item.value.id)
  resumePosition.value = entry?.position ?? null
  lastSavedPosition.value = entry?.position ?? 0
  if (entry?.position) {
    saveStatus.value = `Reprise a ${formatTime(entry.position)}`
  }
}

const handleLoaded = () => {
  if (!player.value) return
  duration.value = Number.isFinite(player.value.duration) ? player.value.duration : 0
  if (resumePosition.value) {
    const safePosition = Math.min(resumePosition.value, Math.max(0, duration.value - 2))
    player.value.currentTime = safePosition
  }
}

const handleTimeUpdate = () => {
  if (!player.value) return
  currentTime.value = player.value.currentTime
  if (Number.isFinite(player.value.duration)) {
    duration.value = player.value.duration
  }
}

const persistProgress = (force = false) => {
  if (!player.value || !item.value) return
  if (!Number.isFinite(player.value.duration) || player.value.duration === 0) return
  const position = player.value.currentTime
  if (!force && Math.abs(position - lastSavedPosition.value) < 1) return
  const entry = {
    value: position / player.value.duration,
    position,
    duration: player.value.duration,
    updatedAt: Date.now(),
  }
  saveProgressEntry(item.value.id, entry)
  lastSavedAt.value = entry.updatedAt
  lastSavedPosition.value = entry.position
  saveStatus.value = `Sauvegarde ${new Date(entry.updatedAt).toLocaleTimeString('fr-FR')}`
}

let intervalId: number | undefined

onMounted(() => {
  loadResume()
  intervalId = window.setInterval(() => persistProgress(false), saveEverySeconds * 1000)
})

onBeforeUnmount(() => {
  persistProgress(true)
  if (intervalId) window.clearInterval(intervalId)
})

watch(item, () => {
  currentTime.value = 0
  duration.value = 0
  loadResume()
})
</script>

<template>
  <section class="space-y-8">
    <div class="rounded-[28px] border border-white/10 bg-slate-950/80 p-4">
      <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
        <video
          ref="player"
          class="aspect-video w-full"
          controls
          playsinline
          preload="metadata"
          :src="videoSource"
          @loadedmetadata="handleLoaded"
          @timeupdate="handleTimeUpdate"
          @pause="persistProgress(true)"
          @ended="persistProgress(true)"
        />
        <div class="pointer-events-none absolute inset-x-0 bottom-0 space-y-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6">
          <div class="flex items-center justify-between text-sm text-slate-200">
            <span>Lecture privee</span>
            <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
          </div>
          <div class="h-1.5 w-full rounded-full bg-white/20">
            <div class="h-full rounded-full bg-cyan-300" :style="{ width: `${progressValue * 100}%` }" />
          </div>
        </div>
      </div>
      <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="font-display text-2xl text-white">{{ item?.title ?? 'Lecture' }}</h1>
          <p class="text-sm text-slate-400">Qualite auto · Audio spatial · Sauvegarde auto {{ saveEverySeconds }}s</p>
        </div>
        <div class="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span class="rounded-full border border-white/10 bg-white/5 px-3 py-2">{{ saveStatus }}</span>
          <button class="rounded-full border border-white/20 px-4 py-2 text-xs text-white">Partager</button>
          <button class="rounded-full border border-white/20 px-4 py-2 text-xs text-white">Marquer vu</button>
        </div>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
      <div class="space-y-4">
        <h2 class="font-display text-xl text-white">Prochaines scenes</h2>
        <div class="grid gap-3">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div class="text-xs uppercase tracking-[0.3em] text-slate-400">Scene 01</div>
            <div class="mt-2 text-sm text-slate-200">Signal d approche</div>
            <div class="text-xs text-slate-400">3:20</div>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div class="text-xs uppercase tracking-[0.3em] text-slate-400">Scene 02</div>
            <div class="mt-2 text-sm text-slate-200">Bascule inertielle</div>
            <div class="text-xs text-slate-400">4:12</div>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div class="text-xs uppercase tracking-[0.3em] text-slate-400">Scene 03</div>
            <div class="mt-2 text-sm text-slate-200">Dernier relais</div>
            <div class="text-xs text-slate-400">5:10</div>
          </div>
        </div>
      </div>
      <aside class="space-y-4">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div class="text-xs uppercase tracking-[0.3em] text-slate-400">Session</div>
          <div class="mt-2 text-sm text-slate-200">Invite: Profil famille</div>
          <div class="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Debit</span>
            <span>12.2 Mb/s</span>
          </div>
          <div class="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>Latence</span>
            <span>32 ms</span>
          </div>
          <button class="mt-4 w-full rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-xs text-cyan-100">
            Optimiser la lecture
          </button>
        </div>
        <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div class="text-xs uppercase tracking-[0.3em] text-slate-400">A venir</div>
          <div class="mt-2 text-sm text-slate-200">Episode 4 - 19:00</div>
          <p class="mt-2 text-xs text-slate-400">Notification automatique a la mise en ligne.</p>
        </div>
      </aside>
    </div>
  </section>
</template>
