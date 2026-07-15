<script setup lang="ts">
import { ref } from "vue"
import { Config } from "../src/endpoints/config.ts"
import AboutBlock from "./organisms/AboutBlock.vue"
import CategoryBlock from "./organisms/CategoryBlock.vue"
import ControlBlock from "./organisms/ControlBlock.vue"
import CurrentAccountsBlock from "./organisms/CurrentAccountsBlock.vue"
import NotifiersBlock from "./organisms/NotifiersBlock.vue"
import RolesBlock from "./organisms/RolesBlock.vue"
import SchedulesBlock from "./organisms/SchedulesBlock.vue"
import UserLocaleBlock from "./organisms/UserLocaleBlock.vue"

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
    <main class="main">
      <div class="flex flex-row flex-wrap justify-center gap-6 sm:gap-10 m-4 sm:m-10">
        <ControlBlock :config @update:config="updateConfig" />
        <CategoryBlock :config @update:config="updateConfig" />
        <SchedulesBlock :config @update:config="updateConfig" />
        <RolesBlock :config @update:config="updateConfig" />
        <NotifiersBlock :config @update:config="updateConfig" />
        <UserLocaleBlock :config @update:config="updateConfig" />
        <CurrentAccountsBlock :config @update:config="updateConfig" />
        <AboutBlock :about="config?.about" />
      </div>
    </main>
  </div>
</template>
