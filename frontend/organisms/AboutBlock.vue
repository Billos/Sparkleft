<script setup lang="ts">
import BlockContainer from "../molecules/BlockContainer.vue"
import LabeledValue from "../atoms/LabeledValue.vue"
import { About } from "../../src/endpoints/config.ts"

const props = defineProps<{ about?: About }>()
</script>

<template>
  <BlockContainer v-if="props.about">
    <template #header>{{ $t("title_about") }}</template>
    <template #subtitle>{{ props.about.description }}</template>
    <template #default>
      <div class="flex flex-col gap-2 w-full">
        <LabeledValue :label="$t('name')" :value="props.about.name" />
        <LabeledValue :label="$t('version')" :value="props.about.version" />
        <LabeledValue :label="$t('author')" :value="props.about.author" />
        <LabeledValue :label="$t('license')" :value="props.about.license" />
        <LabeledValue :label="$t('repository')" :value="props.about.repository" :link="true" />
      </div>
    </template>
  </BlockContainer>
</template>
