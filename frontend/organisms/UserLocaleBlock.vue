<script setup lang="ts">
import { Config } from "../../src/endpoints/config.ts"
import ActionButton from "../atoms/ActionButton.vue"
import BlockContainer from "../molecules/BlockContainer.vue"
import ButtonList from "../molecules/ButtonList.vue"
import { blueishBg, greyBg } from "../types/btnBg.ts"
import { Method } from "../types/method.ts"

const props = defineProps<{
  config?: Config
}>()

const emit = defineEmits<{
  "update:config": []
}>()

function isSelected(locale: string): boolean {
  return locale === props.config?.userLocale
}

const background = (value: string) => {
  const isSelectedAccount = isSelected(value)
  if (isSelectedAccount) {
    return blueishBg
  }
  return greyBg
}
</script>

<template>
  <template v-if="props.config">
    <BlockContainer>
      <template #header>{{ $t("title_user_locale") }}</template>
      <template #subtitle>{{ $t("desc_user_locale") }}</template>
      <template #default>
        <ButtonList>
          <ActionButton
            v-for="locale in props.config.availableLocales"
            class="flex-1 min-w-48 max-w-48"
            :key="locale"
            :token="props.config.token"
            :method="Method.POST"
            :label="$t(`label_locale_${locale}`)"
            :background-color="background(locale)"
            action="locale"
            :body="{ locale }"
            @action:done="emit('update:config')"
          />
        </ButtonList>
      </template>
    </BlockContainer>
  </template>
</template>
