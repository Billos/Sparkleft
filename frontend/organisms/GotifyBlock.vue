<script setup lang="ts">
import { Config } from "../../src/endpoints/config.ts"
import TextInput from "../molecules/TextInput.vue"

const props = defineProps<{
  config?: Config
}>()

const emit = defineEmits<{
  "update:config": []
}>()
</script>

<template>
  <template v-if="props.config">
    <TextInput
      :token="props.config.token"
      :label="$t('label_gotify_url')"
      placeholder="https://gotify.example.com"
      action="notifier-field/gotify-url"
      v-model="props.config.notifierConfig.gotifyUrl"
      @update:config="emit('update:config')"
    />
    <TextInput
      :token="props.config.token"
      :label="$t('label_gotify_token')"
      placeholder="App token"
      action="notifier-field/gotify-token"
      v-model="props.config.notifierConfig.gotifyToken"
      @update:config="emit('update:config')"
    />
    <TextInput
      :token="props.config.token"
      :label="$t('label_gotify_user_token')"
      placeholder="Client token"
      action="notifier-field/gotify-user-token"
      v-model="props.config.notifierConfig.gotifyUserToken"
      @update:config="emit('update:config')"
    />
    <TextInput
      :token="props.config.token"
      :label="$t('label_gotify_application_id')"
      placeholder="Application ID"
      action="notifier-field/gotify-application-id"
      v-model="props.config.notifierConfig.gotifyApplicationId"
      @update:config="emit('update:config')"
    />
  </template>
</template>
