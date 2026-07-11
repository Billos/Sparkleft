import i18next from "i18next"

import en from "../../frontend/locales/en.json"
import frFR from "../../frontend/locales/fr-FR.json"

export async function initializeI18N() {
  await i18next.init({
    // debug: true,
    resources: {
      en: {
        translation: en,
      },
      "fr-FR": {
        translation: frFR,
      },
    },
  })
}
