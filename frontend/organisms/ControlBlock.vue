<script setup lang="ts">
import BlockContainer from "../molecules/BlockContainer.vue"
import ActionButton from "../atoms/ActionButton.vue"
import { Method } from "../types/method.ts"
import { Config } from "../../src/endpoints/config.ts"

const props = defineProps<{
  config?: Config
}>()

defineEmits<{
  (e: "update:config"): void
}>()
</script>

<template>
  <template v-if="props.config">
    <!-- Control Actions -->
    <BlockContainer>
      <template #header>Control UI</template>
      <template #subtitle>Trigger Sparkleft control jobs</template>
      <template #default>
        <div class="flex flex-1 flex-row flex-wrap gap-5 justify-center items-start">
          <ActionButton
            label="Budget Sum Up"
            :token="props.config.token"
            action="budget-sumup"
            :method="Method.POST"
            @click="$emit('update:config')"
          />
          <ActionButton
            label="Auto import"
            :token="props.config.token"
            action="auto-import"
            :method="Method.POST"
            @click="$emit('update:config')"
          />
        </div>
      </template>
    </BlockContainer>
  </template>
</template>
