import { createApp } from "vue"
import { createI18n } from "vue-i18n"

import en from "../locales/en.json"
import fr_FR from "../locales/fr-FR.json"
import App from "./App.vue"

const locale = navigator.language
// const locale = "fr"
const i18n = createI18n({
  locale,
  fallbackLocale: "en",
  messages: {
    en,
    "fr-FR": fr_FR,
  },
})

const app = createApp(App)
app.use(i18n)
app.mount("#app")
