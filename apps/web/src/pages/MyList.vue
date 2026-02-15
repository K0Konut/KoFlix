<script setup lang="ts">
const favorites = [
  { id: '1', name: 'Nebula Drift', year: 2024 },
  { id: '2', name: 'Arcadia City', year: 2023 },
  { id: '3', name: 'Signal Lake', year: 2021 },
]
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-3xl font-display">Ma liste</h1>
      <p class="text-sm text-base-content/60">
        Les titres que tu veux revoir ou finir plus tard.
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="item in favorites"
        :key="item.id"
        class="rounded-2xl border border-base-300/70 bg-base-200/60 p-4"
      >
        <div class="mb-3 h-36 rounded-xl bg-base-300/60"></div>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-semibold">{{ item.name }}</p>
            <p class="text-xs text-base-content/60">{{ item.year }}</p>
          </div>
          <RouterLink :to="`/title/${item.id}`" class="btn btn-xs btn-outline">
            Voir
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
