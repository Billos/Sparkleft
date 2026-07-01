<script setup lang="ts">
import { computed, ref } from "vue"
import ControlBlock from "./organisms/ControlBlock.vue"
import { Config } from "./types/config.ts"

const config = ref<Config | undefined>()

async function updateConfig() {
  const res = await fetch("/api/config")
  const data = (await res.json()) as Config
  config.value = data
}

setInterval(updateConfig, 1000)
updateConfig()
</script>
<template>
  <div class="app">
    <main class="main">
      <div class="flex flex-col flex-wrap gap-10 m-10">
        <ControlBlock :config="config" />
      </div>
    </main>
  </div>
</template>
