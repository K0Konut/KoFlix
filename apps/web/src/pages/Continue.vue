<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchContinueProgress, type ContinueEntry } from '../services/progress'

const items = ref<ContinueEntry[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const loadContinue = async () => {
  loading.value = true
  error.value = null
  try {
    items.value = await fetchContinueProgress()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Impossible de charger'
  } finally {
    loading.value = false
  }
}

onMounted(loadContinue)
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-3xl font-display">Continuer à regarder</h1>
      <p class="text-sm text-base-content/60">
        Reprends exactement où tu t’es arrêté.
      </p>
    </div>

    <div v-if="loading" class="text-sm text-base-content/60">
      Chargement des progressions...
    </div>
    <div v-else-if="error" class="text-sm text-error">
      {{ error }}
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex flex-col gap-4 rounded-2xl border border-base-300/70 bg-base-200/60 p-4 sm:flex-row sm:items-center"
      >
        <div class="h-20 w-full rounded-xl bg-base-300/60 sm:h-24 sm:w-40"></div>
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">{{ item.titleName }}</p>
              <p class="text-xs text-base-content/60">{{ item.subtitle }}</p>
            </div>
            <span v-if="item.remaining" class="text-xs text-base-content/60">{{ item.remaining }}</span>
          </div>
          <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-base-300">
            <div class="h-full bg-primary" :style="{ width: `${item.progressPercent}%` }"></div>
          </div>
        </div>
        <RouterLink :to="`/watch/${item.watchId}`" class="btn btn-primary btn-sm">
          Reprendre
        </RouterLink>
      </div>
      <div v-if="items.length === 0" class="text-sm text-base-content/60">
        Aucune lecture en cours pour le moment.
      </div>
    </div>
  </section>
</template>
