<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { catalog } from '../data/catalog'

const route = useRoute()
const item = computed(() => catalog.find((entry) => entry.id === route.params.id))
</script>

<template>
  <section v-if="item" class="space-y-10">
    <div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div class="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10">
        <div class="absolute inset-0 bg-gradient-to-br" :class="item.art" />
        <div class="absolute inset-0 bg-black/35" />
        <div class="absolute inset-0 flex items-end p-8">
          <div class="space-y-2">
            <div class="text-xs uppercase tracking-[0.4em] text-white/70">{{ item.type }}</div>
            <h1 class="font-display text-3xl text-white md:text-4xl">{{ item.title }}</h1>
            <div class="text-sm text-slate-300">{{ item.year }} · {{ item.duration }} · {{ item.rating }}</div>
          </div>
        </div>
      </div>
      <div class="space-y-6">
        <div class="flex flex-wrap gap-2 text-xs text-slate-400">
          <span v-for="tag in item.tags" :key="tag" class="rounded-full border border-white/10 px-3 py-1">
            {{ tag }}
          </span>
        </div>
        <p class="text-base text-slate-300">{{ item.synopsis }}</p>
        <div class="flex flex-wrap items-center gap-3">
          <RouterLink
            :to="`/watch/${item.id}`"
            class="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950"
          >
            Lecture immediat
          </RouterLink>
          <button class="rounded-full border border-white/20 px-6 py-3 text-sm text-white">Ajouter a ma liste</button>
        </div>
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-slate-400">Recommandations privees</div>
              <div class="text-lg font-semibold text-white">Selection par vos proches</div>
            </div>
            <div class="text-xs uppercase tracking-[0.3em] text-cyan-200">Beta</div>
          </div>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              Playlist collaborative mise a jour automatiquement.
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              Parametres invites et filtres de contenu.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="font-display text-2xl text-white">Episodes a venir</h2>
          <p class="text-sm text-slate-400">Planification et synchro avec Strapi</p>
        </div>
        <button class="rounded-full border border-white/20 px-4 py-2 text-xs text-white">Gerer</button>
      </div>
      <div class="mt-5 grid gap-4 md:grid-cols-3">
        <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <div class="text-xs uppercase tracking-[0.3em] text-slate-400">Episode 1</div>
          <div class="mt-2 text-sm text-slate-200">Signal fantome</div>
          <div class="text-xs text-slate-400">48 min</div>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <div class="text-xs uppercase tracking-[0.3em] text-slate-400">Episode 2</div>
          <div class="mt-2 text-sm text-slate-200">Chambre froide</div>
          <div class="text-xs text-slate-400">51 min</div>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <div class="text-xs uppercase tracking-[0.3em] text-slate-400">Episode 3</div>
          <div class="mt-2 text-sm text-slate-200">Lueur residuelle</div>
          <div class="text-xs text-slate-400">49 min</div>
        </div>
      </div>
    </div>
  </section>

  <section v-else class="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
    <h1 class="font-display text-2xl text-white">Contenu introuvable</h1>
    <p class="mt-2 text-sm text-slate-400">Ce titre n existe pas ou a ete supprime.</p>
    <RouterLink to="/" class="mt-6 inline-flex rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950">
      Retour au catalogue
    </RouterLink>
  </section>
</template>
