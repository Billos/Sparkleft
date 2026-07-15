<script setup lang="ts">
import { BudgetRead } from "@billos/firefly-iii-sdk"
import { Config } from "../../src/endpoints/config.ts"
import ActionButton from "../atoms/ActionButton.vue"
import BlockContainer from "../molecules/BlockContainer.vue"
import ButtonList from "../molecules/ButtonList.vue"
import { blueishBg, greyBg } from "../types/btnBg.ts"
import { Method } from "../types/method.ts"

const props = defineProps<{
  config?: Config
}>()

const emit = defineEmits<{
  "update:config": []
}>()

function isSelected(budgetId: string, roleKey: string): boolean {
  if (roleKey === "bills") {
    return budgetId === props.config?.billsBudgetId
  }
  if (roleKey === "leftovers") {
    return budgetId === props.config?.leftoversBudgetId
  }
  return false
}

const background = (value: BudgetRead, roleKey: string) => {
  if (!value.attributes?.name) {
    return greyBg
  }
  // const isHidden = props.config?.hiddenBudgets?.includes(value.attributes.name)
  const isSelectedBudget = isSelected(value.id, roleKey)
  if (isSelectedBudget) {
    return blueishBg
  }
  return greyBg
}
</script>

<template>
  <template v-if="props.config">
    <BlockContainer>
      <template #header>{{ $t("title_budget_roles") }}</template>
      <template #subtitle>{{ $t("desc_budget_roles") }}</template>
      <template #default>
        <div class="flex flex-row gap-4 justify-start items-center flex-wrap">
          <h2 class="text-xl font-semibold text-gray-700 w-28 shrink-0">{{ $t("label_bills_budget") }}</h2>
          <ButtonList>
            <ActionButton
              v-for="budget in props.config.budgets"
              class="flex-1 min-w-48 max-w-48"
              :key="budget.id"
              :token="props.config.token"
              :method="Method.POST"
              :label="budget.attributes?.name"
              :right-icon="budget.id === props.config.billsBudgetId ? '✅' : ''"
              :background-color="background(budget, 'bills')"
              :action="`budget-role/bills/${budget.id}`"
              @action:done="emit('update:config')"
            />
          </ButtonList>
        </div>
        <div class="flex flex-row gap-4 justify-start items-center flex-wrap">
          <h2 class="text-xl font-semibold text-gray-700 w-28 shrink-0">{{ $t("label_leftovers_budget") }}</h2>
          <ButtonList>
            <ActionButton
              v-for="budget in props.config.budgets"
              class="flex-1 min-w-48 max-w-48"
              :key="budget.id"
              :token="props.config.token"
              :method="Method.POST"
              :label="budget.attributes.name"
              :right-icon="budget.id === props.config.leftoversBudgetId ? '✅' : ''"
              :background-color="background(budget, 'leftovers')"
              :action="`budget-role/leftovers/${budget.id}`"
              @action:done="emit('update:config')"
            />
          </ButtonList>
        </div>
      </template>
    </BlockContainer>
  </template>
</template>
