<script setup lang="ts">
const genres = ['Sci-Fi', 'Thriller', 'Drama', 'Animation', 'Documentaire']

const titles = [
  { id: '1', name: 'Nebula Drift', year: 2024, kind: 'Film' },
  { id: '2', name: 'Arcadia City', year: 2023, kind: 'Série' },
  { id: '3', name: 'Riftline', year: 2022, kind: 'Film' },
  { id: '4', name: 'Signal Lake', year: 2021, kind: 'Série' },
  { id: '5', name: 'The Violet Room', year: 2020, kind: 'Film' },
  { id: '6', name: 'Atlas 9', year: 2019, kind: 'Série' },
]
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
      <article
        v-for="title in titles"
        :key="title.id"
        class="rounded-2xl border border-base-300/70 bg-base-200/60 p-4"
      >
        <div class="mb-3 h-40 rounded-xl bg-base-300/60"></div>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold">{{ title.name }}</h3>
            <p class="text-xs text-base-content/60">{{ title.kind }} · {{ title.year }}</p>
          </div>
          <RouterLink :to="`/title/${title.id}`" class="btn btn-xs btn-outline">
            Voir
          </RouterLink>
        </div>
      </article>
    </div>
  </section>
</template>
