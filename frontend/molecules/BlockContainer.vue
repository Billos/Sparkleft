<script setup lang="ts">
// A Container has a H1 Slot and a Content Slot
const slots = defineSlots<{
  header: () => unknown
  subtitle: () => unknown
  default: () => unknown
}>()
</script>
<template>
  <div class="bg-white rounded-lg p-10 flex flex-col shadow-xl">
    <h1 class="mb-2 text-indigo-700 text-2xl font-bold">
      <slot name="header" />
    </h1>
    <h2 class="mb-4 text-gray-500 text-lg">
      <slot name="subtitle" />
    </h2>
    <div class="block-container__content">
      <slot />
    </div>
  </div>
</template>
