<script setup lang="ts">
const metadata = {
  title: 'Arcadia City — Épisode 2',
  info: 'Saison 1 · 39 min',
}
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-display">{{ metadata.title }}</h1>
        <p class="text-sm text-base-content/60">{{ metadata.info }}</p>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-outline btn-sm">Ajouter à ma liste</button>
        <RouterLink to="/title/2" class="btn btn-ghost btn-sm">Retour fiche</RouterLink>
      </div>
    </div>

    <div class="overflow-hidden rounded-3xl border border-base-300/70 bg-black">
      <video
        class="h-[52vh] w-full bg-black"
        controls
        poster="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80"
      ></video>
    </div>

    <div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="rounded-2xl border border-base-300/70 bg-base-200/60 p-4">
        <p class="text-sm text-base-content/70">
          La progression sera synchronisée automatiquement toutes les 20 secondes.
        </p>
      </div>
      <div class="rounded-2xl border border-base-300/70 bg-base-200/60 p-4">
        <p class="text-sm font-semibold">Prochain épisode</p>
        <p class="text-xs text-base-content/60">Épisode 3 · Le signal</p>
        <button class="btn btn-primary btn-sm mt-3">Lancer</button>
      </div>
    </div>
  </section>
</template>
