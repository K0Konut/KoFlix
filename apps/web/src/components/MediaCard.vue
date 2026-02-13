<script setup lang="ts">
import type { MediaItem } from '../data/catalog'
import ProgressBar from './ProgressBar.vue'

defineProps<{ item: MediaItem }>()
</script>

<template>
  <RouterLink :to="`/title/${item.id}`" class="group block">
    <article class="rounded-3xl border border-white/10 bg-white/5 p-3 transition hover:-translate-y-1 hover:border-white/20">
      <div class="relative aspect-[2/3] overflow-hidden rounded-2xl">
        <div class="absolute inset-0 bg-gradient-to-br" :class="item.art" />
        <div class="absolute inset-0 opacity-0 transition group-hover:opacity-100">
          <div class="h-full w-full bg-black/30" />
        </div>
        <div class="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
          <div class="text-xs uppercase tracking-[0.2em] text-white/70">
            {{ item.type }} · {{ item.year }}
          </div>
          <div class="text-base font-semibold text-white">
            {{ item.title }}
          </div>
        </div>
      </div>
      <div class="mt-3 space-y-2">
        <div class="text-sm text-slate-300">{{ item.duration }} · {{ item.rating }}</div>
        <div class="flex flex-wrap gap-2 text-xs text-slate-400">
          <span v-for="tag in item.tags" :key="tag" class="rounded-full border border-white/10 px-2 py-1">
            {{ tag }}
          </span>
        </div>
        <p class="text-sm text-slate-400">{{ item.synopsis }}</p>
        <ProgressBar v-if="item.progress" :value="item.progress" />
      </div>
    </article>
  </RouterLink>
</template>
