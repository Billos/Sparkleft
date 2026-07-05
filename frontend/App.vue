<script setup lang="ts">
import { ref } from "vue"
import ControlBlock from "./organisms/ControlBlock.vue"
import SchedulesBlock from "./organisms/SchedulesBlock.vue"
import RolesBlock from "./organisms/RolesBlock.vue"
import CategoryBlock from "./organisms/CategoryBlock.vue"
import AboutBlock from "./organisms/AboutBlock.vue"
import { Config } from "../src/endpoints/config.ts"

const config = ref<Config | undefined>()

async function updateConfig() {
  const res = await fetch("/api/config")
  const data = (await res.json()) as Config
  config.value = data
}

updateConfig()
</script>
<template>
  <div class="app">
    a
    <main class="main">
      <div class="flex flex-row flex-wrap gap-10 m-10">
        <AboutBlock :about="config?.about" />
        <ControlBlock :config @update:config="updateConfig" />
        <CategoryBlock :config @update:config="updateConfig" />
        <SchedulesBlock :config @update:config="updateConfig" />
        <RolesBlock :config @update:config="updateConfig" />
      </div>
    </main>
  </div>
</template>
