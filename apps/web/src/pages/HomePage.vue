<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { catalog } from '../data/catalog'
import { applyProgress, PROGRESS_EVENT } from '../data/progress'
import MediaCard from '../components/MediaCard.vue'

const items = ref(catalog)

const refresh = () => {
  items.value = applyProgress(catalog)
}

const featured = computed(() => items.value[0])
const continueWatching = computed(() => items.value.filter((item) => item.progress))
const trending = computed(() => items.value.slice(0, 4))

onMounted(() => {
  refresh()
  window.addEventListener(PROGRESS_EVENT, refresh)
})

onBeforeUnmount(() => {
  window.removeEventListener(PROGRESS_EVENT, refresh)
})
</script>

<template>
  <section class="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/70 p-8">
    <div class="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="space-y-6">
        <div class="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-100">
          Streaming prive
        </div>
        <div class="space-y-4">
          <h1 class="font-display text-4xl leading-tight text-white md:text-5xl">
            Des univers qui n appartiennent qu a votre cercle.
          </h1>
          <p class="text-base text-slate-300 md:text-lg">
            KoFlix orchestre votre catalogue prive, vos sessions de visionnage et votre progression, sans bruit inutile.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <RouterLink
            to="/watch/helix-drift"
            class="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950"
          >
            Lancer la lecture
          </RouterLink>
          <RouterLink
            to="/title/helix-drift"
            class="rounded-full border border-white/20 px-6 py-3 text-sm text-white"
          >
            Voir le detail
          </RouterLink>
        </div>
        <div class="flex flex-wrap gap-3 text-sm text-slate-300">
          <div class="rounded-full border border-white/10 bg-white/5 px-4 py-2">4K / HLS</div>
          <div class="rounded-full border border-white/10 bg-white/5 px-4 py-2">Progression sync</div>
          <div class="rounded-full border border-white/10 bg-white/5 px-4 py-2">Mode offline</div>
        </div>
      </div>
      <div class="relative" v-if="featured">
        <div class="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
        <div class="relative rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="text-xs uppercase tracking-[0.4em] text-slate-400">Featured</div>
          <div class="mt-4 flex flex-col gap-4">
            <div class="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <div class="absolute inset-0 bg-gradient-to-br" :class="featured.art" />
              <div class="absolute inset-0 bg-black/35" />
              <div class="absolute inset-0 flex flex-col justify-end p-5">
              <div class="text-sm text-cyan-200">{{ featured.type }} · {{ featured.year }}</div>
              <div class="text-2xl font-semibold text-white">{{ featured.title }}</div>
              </div>
            </div>
            <p class="text-sm text-slate-300">{{ featured.synopsis }}</p>
            <div class="flex flex-wrap gap-2 text-xs text-slate-400">
              <span v-for="tag in featured.tags" :key="tag" class="rounded-full border border-white/10 px-2 py-1">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section v-if="continueWatching.length" class="mt-12 space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="font-display text-2xl text-white">Continuer a regarder</h2>
      <button class="text-sm text-slate-400">Tout afficher</button>
    </div>
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <MediaCard v-for="item in continueWatching" :key="item.id" :item="item" />
    </div>
  </section>

  <section class="mt-12 space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="font-display text-2xl text-white">Tendances privees</h2>
      <button class="text-sm text-slate-400">Filtres</button>
    </div>
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <MediaCard v-for="item in trending" :key="item.id" :item="item" />
    </div>
  </section>
</template>
