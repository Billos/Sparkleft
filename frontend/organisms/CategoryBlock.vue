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

function isSelected(categoryId: string): boolean {
  const hiddenCategories = props.config?.hiddenCategories || []
  return hiddenCategories.includes(categoryId)
}

const background = (value: Budget) => {
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
</script>

<template>
  <template v-if="props.config">
    <BlockContainer>
      <template #header>Hide Toggle Categories</template>
      <template #default>
        <div class="flex flex-1 flex-row flex-wrap gap-2">
          <ActionButton
            v-for="category in props.config.categories"
            class="flex-1 min-w-48 max-w-48"
            :key="category.id"
            :token="props.config.token"
            :method="Method.POST"
            :label="category.attributes?.name || 'Unknown category'"
            :right-icon="isSelected(category.id) ? '✅' : ''"
            :background-color="background(category)"
            :action="`hide-toggle/category/${category.id}`"
            @action:done="emit('update:config')"
          />
        </div>
      </template>
    </BlockContainer>
  </template>
</template>
