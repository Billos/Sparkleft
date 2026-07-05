<script setup lang="ts">
import ActionButton from "../atoms/ActionButton.vue"
import { Method } from "../types/method"
import { ButtonListItem } from "../types/buttonListItem"

const {
  items,
  token,
  wrapperClass = "flex flex-1 flex-row flex-wrap gap-2",
} = defineProps<{
  items: ButtonListItem[]
  token?: string
  wrapperClass?: string
}>()

const emit = defineEmits<{
  "action:done": []
}>()
</script>

<template>
  <div :class="wrapperClass">
    <ActionButton
      v-for="item in items"
      class="flex-1 min-w-48 max-w-48"
      :key="item.key"
      :token="token"
      :method="item.method ?? Method.POST"
      :label="item.label"
      :right-icon="item.rightIcon"
      :background-color="item.backgroundColor"
      :action="item.action"
      @action:done="emit('action:done')"
    />
  </div>
</template>
