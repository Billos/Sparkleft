<script setup lang="ts">
import { Budget, Config } from "../types/config.ts"
import BlockContainer from "../molecules/BlockContainer.vue"
import ActionButton from "../atoms/ActionButton.vue"
import { Method } from "../types/method.ts"
import { blueishBg, greyBg } from "../types/btnBg.ts"

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

function label(budgetName: string | undefined, budgetId: string, roleKey: string): string {
  if (!budgetName) return "Unknown budget"
  return isSelected(budgetId, roleKey) ? `${budgetName} ✅` : budgetName
}

const background = (value: Budget, roleKey: string) => {
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
      <template #header>Budget Roles</template>
      <template #subtitle>Choose which budgets act as the Bills and Leftovers budgets</template>
      <template #default>
        <div class="flex flex-row gap-4 justify-start items-center flex-wrap">
          <h2 class="text-xl font-semibold text-gray-700 w-28 shrink-0">Bills</h2>
          <div class="flex flex-1 flex-row flex-wrap gap-2">
            <ActionButton
              v-for="budget in props.config.budgets"
              class="flex-1 min-w-48 max-w-48"
              :key="budget.id"
              :token="props.config.token"
              :method="Method.POST"
              :label="label(budget.attributes?.name, budget.id, 'bills')"
              :background-color="background(budget, 'bills')"
              :action="`budget-role/bills/${budget.id}`"
              @action:done="emit('update:config')"
            />
          </div>
        </div>
        <div class="flex flex-row gap-4 justify-start items-center flex-wrap">
          <h2 class="text-xl font-semibold text-gray-700 w-28 shrink-0">Leftovers</h2>
          <div class="flex flex-1 flex-row flex-wrap gap-2">
            <ActionButton
              v-for="budget in props.config.budgets"
              class="flex-1 min-w-48 max-w-48"
              :key="budget.id"
              :token="props.config.token"
              :method="Method.POST"
              :label="label(budget.attributes?.name, budget.id, 'leftovers')"
              :background-color="background(budget, 'leftovers')"
              :action="`budget-role/leftovers/${budget.id}`"
              @action:done="emit('update:config')"
            />
          </div>
        </div>
      </template>
    </BlockContainer>
  </template>
</template>
