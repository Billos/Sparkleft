<script setup lang="ts">
import BlockContainer from "../molecules/BlockContainer.vue"
import ButtonList from "../molecules/ButtonList.vue"
import { blueishBg, greyBg } from "../types/btnBg.ts"
import { ButtonListItem } from "../types/buttonListItem.ts"
import { BudgetRead } from "@billos/firefly-iii-sdk"
import { Config } from "../../src/endpoints/config.ts"
import { computed } from "vue"

const props = defineProps<{
  config?: Config
}>()

const emit = defineEmits<{
  "update:config": []
}>()

function isSelected(categoryId: string): boolean {
  const hiddenCategories = props.config?.hiddenCategories || []
  return hiddenCategories.includes(categoryId)
}

const background = (value: BudgetRead) => {
  if (!value.attributes?.name) {
    return greyBg
  }
  // const isHidden = props.config?.hiddenBudgets?.includes(value.attributes.name)
  const isSelectedBudget = isSelected(value.id)
  if (isSelectedBudget) {
    return blueishBg
  }
  return greyBg
}

const items = computed<ButtonListItem[]>(() =>
  (props.config?.categories ?? []).map((category) => ({
    key: category.id,
    label: category.attributes?.name || "Unknown category",
    action: `hide-toggle/category/${category.id}`,
    backgroundColor: background(category),
    rightIcon: isSelected(category.id) ? "✅" : "",
  })),
)
</script>

<template>
  <template v-if="props.config">
    <BlockContainer>
      <template #header>Hide Toggle Categories</template>
      <template #default>
        <ButtonList :items="items" :token="props.config.token" @action:done="emit('update:config')" />
      </template>
    </BlockContainer>
  </template>
</template>
