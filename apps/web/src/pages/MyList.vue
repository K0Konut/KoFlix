<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchFavorites, type FavoriteItem } from '../services/favorites'

const favorites = ref<FavoriteItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const formatKind = (kind: FavoriteItem['kind']) => (kind === 'series' ? 'Série' : 'Film')

const loadFavorites = async () => {
  loading.value = true
  error.value = null
  try {
    favorites.value = await fetchFavorites()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Impossible de charger'
  } finally {
    loading.value = false
  }
}

onMounted(loadFavorites)
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-3xl font-display">Ma liste</h1>
      <p class="text-sm text-base-content/60">
        Les titres que tu veux revoir ou finir plus tard.
      </p>
    </div>

    <div v-if="loading" class="text-sm text-base-content/60">
      Chargement de ta liste...
    </div>
    <div v-else-if="error" class="text-sm text-error">
      {{ error }}
    </div>
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="item in favorites"
        :key="item.id"
        class="rounded-2xl border border-base-300/70 bg-base-200/60 p-4"
      >
        <div class="mb-3 h-36 rounded-xl bg-base-300/60"></div>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-semibold">{{ item.name }}</p>
            <p class="text-xs text-base-content/60">
              {{ formatKind(item.kind) }} · {{ item.year ?? '—' }}
            </p>
          </div>
          <RouterLink :to="`/title/${item.titleId}`" class="btn btn-xs btn-outline">
            Voir
          </RouterLink>
        </div>
      </div>
      <div v-if="favorites.length === 0" class="text-sm text-base-content/60">
        Aucun favori pour le moment.
      </div>
    </div>
  </section>
</template>
