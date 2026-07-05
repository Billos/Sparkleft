<script setup lang="ts">
import { computed, ref } from "vue"
import { Method } from "../types/method"
import { activeBg, disabledBg, loadingBg } from "../types/btnBg"

const {
  method = Method.POST,
  label,
  token,
  action,
  body,
  disabled = false,
  rightIcon,
} = defineProps<{
  method?: Method
  label: string
  token?: string
  action: string
  body?: Record<string, unknown>
  disabled?: boolean
  rightIcon?: string
  backgroundColor?: string | null
}>()

enum Status {
  Inactive = "inactive",
  Loading = "loading",
  Success = "success",
  Error = "error",
}

const emit = defineEmits<{
  "action:done": []
}>()

const status = ref(Status.Inactive)
const icon = computed(() => {
  switch (status.value) {
    case Status.Loading:
      return "⏳"
    case Status.Success:
      return "✅"
    case Status.Error:
      return "❌"
    case Status.Inactive:
      return "💤"
  }
})

const isLoading = computed(() => status.value === Status.Loading)

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function click() {
  status.value = Status.Loading
  try {
    const params = new URLSearchParams({})
    if (token) {
      params.append("api_token", token)
    }
    const url = `/api/${action}?${params.toString()}`
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    await sleep(500) // Wait a bit to show the loading state

    if (!response.ok) throw new Error(`Erreur ${response.status}`)
    status.value = Status.Success
  } catch (err: unknown) {
    status.value = Status.Error
  } finally {
    emit("action:done")
    setTimeout(() => {
      status.value = Status.Inactive
    }, 2000)
  }
}
</script>

<template>
  <div
    :class="[
      'flex',
      'border-none rounded-lg shadow-md',
      'text-base cursor-pointer text-white text-center font-medium',
      { [loadingBg]: isLoading },
      { [activeBg]: !disabled && !isLoading && !backgroundColor },
      { [disabledBg]: disabled && !isLoading && !backgroundColor },
      { [backgroundColor ?? '']: backgroundColor },
    ]"
    @click="click"
  >
    <button type="button" :disabled="disabled" class="flex-1 flex flex-row gap-2 mx-5 my-4 items-center">
      <span class="status-icon cursor-pointer">{{ icon }}</span>
      <div class="flex-1 cursor-pointer">{{ label }}</div>
      <span v-if="rightIcon" class="right-icon cursor-pointer">{{ rightIcon }}</span>
    </button>
  </div>
</template>
