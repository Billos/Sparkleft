<script setup lang="ts">
import BlockContainer from "../molecules/BlockContainer.vue"
import LabeledValue from "../atoms/LabeledValue.vue"
import { About } from "../../src/endpoints/config.ts"

const props = defineProps<{ about?: About }>()

console.log("AboutBlock props:", props.about)
</script>

<template>
  <BlockContainer v-if="props.about">
    <template #header>About</template>
    <template #subtitle>{{ props.about.description }}</template>
    <template #default>
      <div class="flex flex-col gap-2 w-full">
        <LabeledValue label="Name" :value="props.about.name" />
        <LabeledValue label="Version" :value="props.about.version" />
        <LabeledValue label="Author" :value="props.about.author" />
        <LabeledValue label="License" :value="props.about.license" />
        <LabeledValue label="Repository" :value="props.about.repository" :link="true" />
      </div>
    </template>
  </BlockContainer>
</template>
