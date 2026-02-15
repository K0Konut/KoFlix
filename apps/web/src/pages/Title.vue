<script setup lang="ts">
const metadata = {
  title: 'Arcadia City',
  year: 2023,
  kind: 'Série',
  rating: 8.4,
  synopsis:
    'Une enquête cyber-noir qui relie trois générations dans une mégalopole hyper-connectée.',
  genres: ['Sci-Fi', 'Thriller'],
  cast: ['Lina Park', 'Omar Reyes', 'Nina Solano'],
}

const episodes = [
  { id: '1', name: 'Nuit froide', number: 1, duration: 42 },
  { id: '2', name: 'Zone grise', number: 2, duration: 39 },
  { id: '3', name: 'Le signal', number: 3, duration: 44 },
]
</script>

<template>
  <section class="space-y-8">
    <div class="grid gap-6 lg:grid-cols-[0.6fr_1fr]">
      <div class="relative h-72 overflow-hidden rounded-3xl border border-base-300/70 bg-base-200/60">
        <div class="absolute inset-0 bg-gradient-to-tr from-base-300/70 to-transparent"></div>
      </div>
      <div class="space-y-4">
        <div class="flex flex-wrap items-center gap-2">
          <span class="badge badge-primary">{{ metadata.kind }}</span>
          <span class="badge badge-outline">{{ metadata.year }}</span>
          <span class="badge badge-outline">{{ metadata.rating }} / 10</span>
        </div>
        <h1 class="text-3xl font-display">{{ metadata.title }}</h1>
        <p class="text-base text-base-content/70">{{ metadata.synopsis }}</p>
        <div class="flex flex-wrap gap-2">
          <span v-for="genre in metadata.genres" :key="genre" class="badge badge-ghost">
            {{ genre }}
          </span>
        </div>
        <div>
          <p class="text-xs uppercase text-base-content/60">Casting</p>
          <p class="text-sm">{{ metadata.cast.join(' · ') }}</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <RouterLink to="/watch/1" class="btn btn-primary">Lecture</RouterLink>
          <button class="btn btn-outline">Ajouter à ma liste</button>
        </div>
      </div>
    </div>

    <div class="rounded-3xl border border-base-300/70 bg-base-200/60 p-6">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-display">Épisodes</h2>
        <span class="text-xs text-base-content/60">Saison 1</span>
      </div>
      <div class="mt-4 space-y-3">
        <div
          v-for="episode in episodes"
          :key="episode.id"
          class="flex items-center justify-between rounded-2xl border border-base-300/70 bg-base-100/40 px-4 py-3"
        >
          <div>
            <p class="font-semibold">Épisode {{ episode.number }} · {{ episode.name }}</p>
            <p class="text-xs text-base-content/60">{{ episode.duration }} min</p>
          </div>
          <RouterLink :to="`/watch/${episode.id}`" class="btn btn-xs btn-outline">
            Lire
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
