<script setup lang="ts">
import { computed } from "vue"
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
  <div class="flex flex-row flex-wrap items-center justify-center gap-2">
    <div class="text-2xl font-medium text-gray-700 w-50">
      {{ label }}
    </div>

    <input
      type="text"
      v-model="model"
      :placeholder
      class="px-2 py-2 rounded-lg border-2 border-purple-400 bg-gray-100 text-gray-700 outline-none focus:border-purple-600"
    />

    <!-- Action Button -->
    <ActionButton :label="$t('action_update')" :token :action :body="{ cron: model }" :disabled @click="$emit('update:config')" />
  </div>
</template>
