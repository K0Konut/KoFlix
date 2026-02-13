<script setup lang="ts"></script>

<template>
  <div class="app-shell min-h-dvh">
    <header class="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <div class="flex items-center gap-4">
          <RouterLink to="/" class="flex items-center gap-3 text-white">
            <span class="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-400/20 text-xl font-semibold">
              K
            </span>
            <span class="font-display text-lg tracking-tight">KoFlix</span>
          </RouterLink>
          <nav class="hidden items-center gap-4 text-sm text-slate-200/80 md:flex">
            <RouterLink class="nav-link" to="/">Catalogue</RouterLink>
            <RouterLink class="nav-link" to="/">Nouveautes</RouterLink>
            <RouterLink class="nav-link" to="/">Ma liste</RouterLink>
          </nav>
        </div>
        <div class="flex items-center gap-3">
          <label class="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200/80 lg:flex">
            <span class="text-slate-400">Recherche</span>
            <input
              class="w-48 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              placeholder="Thriller, Sci-Fi..."
            />
          </label>
          <button class="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
            Acces prive
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
      <slot />
    </main>
  </div>
</template>
