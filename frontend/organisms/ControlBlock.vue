<script setup lang="ts">
import { Config } from "../types/config.ts"

import BlockContainer from "../molecules/BlockContainer.vue"

const props = defineProps<{
  config?: Config
}>()
</script>
<template>
  <BlockContainer v-if="props.config">
    <template #header>Control UI</template>
    <template #subtitle> Trigger Sparkleft control jobs </template>
    <template #default>
      <p>Version: {{ props.config.version }}</p>
    </template>
  </BlockContainer>
</template>
