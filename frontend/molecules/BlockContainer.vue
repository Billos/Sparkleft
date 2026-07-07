<script setup lang="ts">
// A Container has a H1 Slot and a Content Slot
const slots = defineSlots<{
  header: () => unknown
  subtitle: () => unknown
  default: () => unknown
}>()
</script>
<template>
  <div class="bg-white rounded-lg p-6 sm:p-10 flex flex-col shadow-xl justify-center items-center">
    <h1 class="mb-2 text-indigo-700 text-2xl font-bold">
      <slot name="header" />
    </h1>
    <h2 class="mb-4 text-gray-500 text-sm">
      <slot name="subtitle" />
    </h2>
    <div class="w-full flex-1 flex flex-row flex-wrap gap-5 justify-center">
      <slot />
    </div>
  </div>
</template>
