<script setup lang="ts">
import BlockContainer from "../molecules/BlockContainer.vue"
import ButtonList from "../molecules/ButtonList.vue"
import { blueishBg, greyBg } from "../types/btnBg.ts"
import { ButtonListItem } from "../types/buttonListItem.ts"
import { AccountRead } from "@billos/firefly-iii-sdk"
import { Config } from "../../src/endpoints/config.ts"
import { computed } from "vue"

const props = defineProps<{
  config?: Config
}>()

const emit = defineEmits<{
  "update:config": []
}>()

function isSelected(accountId: string): boolean {
  return accountId === props.config?.currentAccountId
}

const background = (value: AccountRead) => {
  if (!value.attributes?.name) {
    return greyBg
  }
  const isSelectedAccount = isSelected(value.id)
  if (isSelectedAccount) {
    return blueishBg
  }
  return greyBg
}

const items = computed<ButtonListItem[]>(() =>
  (props.config?.assetAccounts ?? []).map((account) => ({
    key: account.id,
    label: account.attributes?.name ?? "",
    action: `current-account/${account.id}`,
    backgroundColor: background(account),
  })),
)
</script>

<template>
  <template v-if="props.config">
    <BlockContainer>
      <template #header>Current Account</template>
      <template #subtitle>Choose which asset account to use as the current account</template>
      <template #default>
        <div class="flex flex-row gap-4 justify-start items-center flex-wrap">
          <h2 class="text-xl font-semibold text-gray-700 w-28 shrink-0">Current account</h2>
          <ButtonList :items="items" :token="props.config.token" @action:done="emit('update:config')" />
        </div>
      </template>
    </BlockContainer>
  </template>
</template>
