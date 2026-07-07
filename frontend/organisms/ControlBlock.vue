<script setup lang="ts">
import BlockContainer from "../molecules/BlockContainer.vue"
import ActionButton from "../atoms/ActionButton.vue"
import { Method } from "../types/method.ts"
import { Config } from "../../src/endpoints/config.ts"
import ButtonList from "../molecules/ButtonList.vue"

const props = defineProps<{
  config?: Config
}>()

defineEmits<{
  (e: "update:config"): void
}>()
</script>

<template>
  <template v-if="props.config">
    <BlockContainer>
      <template #header>{{ $t("actions") }}</template>
      <template #default>
        <ButtonList>
          <ActionButton
            :label="$t('action_budget_sumup')"
            :token="props.config.token"
            action="budget-sumup"
            :method="Method.POST"
            @action:done="$emit('update:config')"
          />
          <ActionButton
            :label="$t('action_bank_operation_import')"
            :token="props.config.token"
            action="auto-import"
            :method="Method.POST"
            @action:done="$emit('update:config')"
          />
        </ButtonList>
      </template>
    </BlockContainer>
  </template>
</template>
