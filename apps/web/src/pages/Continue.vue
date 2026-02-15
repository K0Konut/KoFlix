<script setup lang="ts">
const items = [
  { id: '4', title: 'Atlas 9', progress: 62, remaining: '18 min restantes' },
  { id: '5', title: 'Cold Orbit', progress: 28, remaining: '32 min restantes' },
  { id: '6', title: 'Signal Lake', progress: 83, remaining: '7 min restantes' },
]
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-3xl font-display">Continuer à regarder</h1>
      <p class="text-sm text-base-content/60">
        Reprends exactement où tu t’es arrêté.
      </p>
    </div>

    <div class="space-y-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex flex-col gap-4 rounded-2xl border border-base-300/70 bg-base-200/60 p-4 sm:flex-row sm:items-center"
      >
        <div class="h-20 w-full rounded-xl bg-base-300/60 sm:h-24 sm:w-40"></div>
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <p class="font-semibold">{{ item.title }}</p>
            <span class="text-xs text-base-content/60">{{ item.remaining }}</span>
          </div>
          <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-base-300">
            <div class="h-full bg-primary" :style="{ width: `${item.progress}%` }"></div>
          </div>
        </div>
        <RouterLink :to="`/watch/${item.id}`" class="btn btn-primary btn-sm">
          Reprendre
        </RouterLink>
      </div>
    </div>
  </section>
</template>
