<script setup lang="ts">
import { computed, watch } from "vue"
import ActionButton from "../atoms/ActionButton.vue"

const props = defineProps<{
  token?: string
  label: string
  placeholder?: string
  action: string
}>()

const model = defineModel<string>()
defineEmits<{
  (e: "update:config"): void
}>()

const disabled = computed(() => {
  if (!model.value) {
    return true
  }
  const CRON_REGEX =
    /^(\*|([0-5]?\d)(-([0-5]?\d))?(\/(\d+))?(,([0-5]?\d)(-([0-5]?\d))?(\/(\d+))?)*)\s(\*|([01]?\d|2[0-3])(-([01]?\d|2[0-3]))?(\/(\d+))?(,([01]?\d|2[0-3])(-([01]?\d|2[0-3]))?(\/(\d+))?)*)\s(\*|([12]?\d|3[01])(-([12]?\d|3[01]))?(\/(\d+))?(,([12]?\d|3[01])(-([12]?\d|3[01]))?(\/(\d+))?)*)\s(\*|(0?[1-9]|1[0-2])(-(0?[1-9]|1[0-2]))?(\/(\d+))?(,(0?[1-9]|1[0-2])(-(0?[1-9]|1[0-2]))?(\/(\d+))?)*)\s(\*|([0-6])(-([0-6]))?(\/(\d+))?(,([0-6])(-([0-6]))?(\/(\d+))?)*)$/
  return !CRON_REGEX.test(model.value)
})
</script>

<template>
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
    <!-- Label -->
    <div class="flex-1 text-2xl font-medium text-gray-700 w-32">
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
      label="Update Cron"
      :token="token"
      :action="action"
      :body="{ cron: model }"
      :disabled
      @click="$emit('update:config')"
    />
  </div>
</template>
