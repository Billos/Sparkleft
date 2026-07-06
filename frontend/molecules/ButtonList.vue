<script setup lang="ts">
const { wrapperClass = "flex flex-1 flex-row flex-wrap gap-2" } = defineProps<{
  wrapperClass?: string
}>()
</script>

<template>
  <div :class="wrapperClass">
    <slot />
  </div>
</template>
