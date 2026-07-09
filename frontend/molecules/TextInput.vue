<script setup lang="ts">
import ActionButton from "../atoms/ActionButton.vue"

defineProps<{
  token?: string
  label: string
  placeholder?: string
  action: string
}>()

const model = defineModel<string | null>()
const emit = defineEmits<{
  "update:config": []
}>()
</script>

<template>
  <div class="flex flex-row flex-wrap items-center justify-center gap-2">
    <div class="text-2xl font-medium text-gray-700 w-50">
      {{ label }}
    </div>

    <!-- Text Input -->
    <input
      type="text"
      v-model="model"
      :placeholder
      class="flex-1 px-4 py-2 rounded-lg border-2 border-purple-400 bg-gray-100 text-gray-700 outline-none focus:border-purple-600 transition-colors duration-200"
    />

    <!-- Action Button -->
    <ActionButton
      class="flex-1"
      label="Save"
      :token="token"
      :action="action"
      :body="{ value: model }"
      @action:done="emit('update:config')"
    />
  </div>
</template>
