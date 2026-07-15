<script setup lang="ts">
import { Config } from "../../src/endpoints/config.ts"
import { Notifiers } from "../../src/modules/notifiers/types.ts"
import ActionButton from "../atoms/ActionButton.vue"
import BlockContainer from "../molecules/BlockContainer.vue"
import { blueishBg, greyBg } from "../types/btnBg.ts"
import { Method } from "../types/method.ts"
import GotifyBlock from "./GotifyBlock.vue"

const props = defineProps<{
  config?: Config
}>()

const emit = defineEmits<{
  "update:config": []
}>()

function isNotifierSelected(notifier: Notifiers): boolean {
  return notifier === props.config?.notifier
}
</script>

<template>
  <template v-if="props.config">
    <BlockContainer>
      <template #header>{{ $t("title_notifiers") }}</template>
      <template #subtitle>{{ $t("desc_notifiers") }}</template>
      <template #default>
        <div class="flex flex-col gap-2">
          <div class="flex flex-row gap-2 items-center justify-center">
            <ActionButton
              v-for="notifier in Object.keys(Notifiers)"
              :label="notifier"
              :token="props.config.token"
              :method="Method.POST"
              :background-color="isNotifierSelected(notifier as Notifiers) ? blueishBg : greyBg"
              :action="`notifier/${notifier}`"
              @action:done="emit('update:config')"
            />
          </div>
          <GotifyBlock v-if="isNotifierSelected(Notifiers.Gotify)" :config />
          <div v-else>Not implemented yet</div>
        </div>
      </template>
    </BlockContainer>
  </template>
</template>
