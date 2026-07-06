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
  if (!value.attributes?.name) {
    return "Unknown budget"
  }
  const isHidden = props.config?.hiddenBudgets?.includes(value.attributes.name)
  const icon = isHidden ? "🙈" : "👁️"
  return `${value.attributes.name} ${icon}`
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
      <template #header>Schedules</template>
      <template #subtitle
        >Set cron expressions (format: minute hour day month weekday) for the scheduled jobs — leave empty to disable</template
      >
      <template #default>
        <CronInput
          :token="props.config.token"
          label="Auto Import"
          placeholder="20 9 * * *"
          action="cron/auto-import"
          v-model="props.config.autoImportCron"
        />
        <CronInput
          :token="props.config.token"
          label="Sum Up"
          placeholder="5 0 * * *"
          action="cron/budget-sum-up"
          v-model="props.config.budgetSumUpCron"
        />
        <!-- List of budgets to hide / display them in the Sumup -->

        <ButtonList wrapper-class="w-full flex flex-row flex-wrap gap-2 justify-center">
          <ActionButton
            v-for="value in props.config.budgets"
            class="flex-1 min-w-48 max-w-48"
            :key="value.attributes?.name"
            :token="props.config.token"
            :method="Method.POST"
            :label="label(value)"
            :action="`hide-toggle/budget/${value.attributes?.name}`"
            :background-color="background(value)"
            @action:done="emit('update:config')"
          />
        </ButtonList>
      </template>
    </BlockContainer>
  </template>
</template>
