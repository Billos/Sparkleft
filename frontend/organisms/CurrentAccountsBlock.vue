<script setup lang="ts">
import BlockContainer from "../molecules/BlockContainer.vue"
import ActionButton from "../atoms/ActionButton.vue"
import { Method } from "../types/method.ts"
import { blueishBg, greyBg } from "../types/btnBg.ts"
import { AccountRead } from "@billos/firefly-iii-sdk"
import { Config } from "../../src/endpoints/config.ts"

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
</script>

<template>
  <template v-if="props.config">
    <BlockContainer>
      <template #header>Current Account</template>
      <template #subtitle>Choose which asset account to use as the current account</template>
      <template #default>
        <div class="flex flex-row gap-4 justify-start items-center flex-wrap">
          <h2 class="text-xl font-semibold text-gray-700 w-28 shrink-0">Current account</h2>
          <div class="flex flex-1 flex-row flex-wrap gap-2">
            <ActionButton
              v-for="account in props.config.assetAccounts"
              class="flex-1 min-w-48 max-w-48"
              :key="account.id"
              :token="props.config.token"
              :method="Method.POST"
              :label="account.attributes?.name"
              :background-color="background(account)"
              :action="`current-account/${account.id}`"
              @action:done="emit('update:config')"
            />
          </div>
        </div>
      </template>
    </BlockContainer>
  </template>
</template>
