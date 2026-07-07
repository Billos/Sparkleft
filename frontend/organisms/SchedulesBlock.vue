<script setup lang="ts">
import BlockContainer from "../molecules/BlockContainer.vue"
import CronInput from "../molecules/CronInput.vue"
import ButtonList from "../molecules/ButtonList.vue"
import ActionButton from "../atoms/ActionButton.vue"
import { Method } from "../types/method.ts"
import { greyBg } from "../types/btnBg.ts"
import { BudgetRead } from "@billos/firefly-iii-sdk"
import { Config } from "../../src/endpoints/config.ts"

const props = defineProps<{
  config?: Config
}>()

const emit = defineEmits<{
  "update:config": []
}>()

const label = (value: BudgetRead) => {
  const isHidden = props.config?.hiddenBudgets?.includes(value.attributes.name)
  const icon = isHidden ? "🙈" : "👁️"
  return `${value.attributes.name} ${icon}`
}

function isHidden(name: string): boolean {
  const hiddenBudgets = props.config?.hiddenBudgets || []
  return hiddenBudgets.includes(name)
}

const background = (value: BudgetRead) => {
  if (!value.attributes?.name) {
    return greyBg
  }
  const isHidden = props.config?.hiddenBudgets?.includes(value.attributes.name)
  if (isHidden) {
    return greyBg
  }
  return null
}
</script>

<template>
  <template v-if="props.config">
    <!-- Control Actions -->
    <BlockContainer>
      <template #header>{{ $t("title_schedules") }}</template>
      <template #subtitle>{{ $t("desc_schedules") }}</template>
      <template #default>
        <div class="flex flex-col gap-2 items-center">
          <CronInput
            :token="props.config.token"
            :label="$t('action_bank_operation_import')"
            placeholder="20 9 * * *"
            action="cron/auto-import"
            v-model="props.config.autoImportCron"
          />
          <CronInput
            :token="props.config.token"
            :label="$t('action_budget_sumup')"
            placeholder="5 0 * * *"
            action="cron/budget-sum-up"
            v-model="props.config.budgetSumUpCron"
          />
          <!-- List of budgets to hide / display them in the Sumup -->

          <ButtonList>
            <ActionButton
              v-for="value in props.config.budgets"
              class="flex-1 min-w-48 max-w-48"
              :key="value.attributes?.name"
              :token="props.config.token"
              :method="Method.POST"
              :label="value.attributes.name"
              :right-icon="isHidden(value.attributes.name) ? '🙈' : '👁️'"
              :action="`hide-toggle/budget/${value.attributes?.name}`"
              :background-color="background(value)"
              @action:done="emit('update:config')"
            />
          </ButtonList>
        </div>
      </template>
    </BlockContainer>
  </template>
</template>
