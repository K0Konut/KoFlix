<script setup lang="ts">
const props = defineProps<{ value: number }>()
const width = () => `${Math.min(100, Math.max(0, props.value * 100))}%`
</script>

<template>
  <div class="h-1.5 w-full rounded-full bg-white/10">
    <div class="h-full rounded-full bg-cyan-300" :style="{ width: width() }" />
  </div>
</template>
