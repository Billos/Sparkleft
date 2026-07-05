<script setup lang="ts">
const props = defineProps<{ label: string; value: string; link?: boolean }>()
</script>

<template>
  <div class="flex flex-row justify-between items-center border-b border-gray-200 pb-3">
    <span class="font-semibold uppercase text-sm tracking-wide text-gray-500">{{ props.label }}:</span>
    <span v-if="props.link"
      ><a :href="props.value" class="text-blue-500 underline">{{ props.value }}</a></span
    >
    <span v-else>{{ props.value }}</span>
  </div>
</template>
