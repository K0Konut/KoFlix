<script setup lang="ts">
</script>

<template>
  <section class="mx-auto flex w-full max-w-md flex-col gap-6">
    <div>
      <h1 class="text-3xl font-display">Connexion</h1>
      <p class="text-sm text-base-content/60">
        Accès privé. Utilise les identifiants Strapi Users & Permissions.
      </p>
    </div>

    <form class="space-y-4 rounded-3xl border border-base-300/70 bg-base-200/60 p-6">
      <div>
        <label class="label text-xs uppercase text-base-content/60">Email</label>
        <input type="email" class="input input-bordered w-full" placeholder="moi@exemple.dev" />
      </div>
      <div>
        <label class="label text-xs uppercase text-base-content/60">Mot de passe</label>
        <input type="password" class="input input-bordered w-full" placeholder="••••••••" />
      </div>
      <button class="btn btn-primary w-full" type="button">Se connecter</button>
      <p class="text-xs text-base-content/60">
        Pas d’inscription publique. Contacte l’admin si besoin.
      </p>
    </form>
  </section>
</template>
