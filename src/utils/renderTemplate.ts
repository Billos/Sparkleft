import path from "path"

import nunjucks from "nunjucks"

import { env } from "../config"

// Resolve the templates/notifications directory relative to this source file.
// __dirname is src/utils (tsx dev mode) or build/utils (compiled production mode).
// Going two levels up from either location reaches the project root, where
// templates/ lives alongside src/ and build/.
const templatesDir = path.join(__dirname, "..", "..", "templates", "notifications")

const njkEnv = nunjucks.configure(templatesDir, {
  // autoescape is intentionally disabled: the output is plain-text Markdown sent
  // to Discord / Gotify, not HTML. Enabling autoescape would corrupt Markdown
  // syntax (e.g. & → &amp;, < → &lt;) without providing any security benefit.
  autoescape: false,
  trimBlocks: true,
  lstripBlocks: true,
})

// Expose a subset of the application env config as a dedicated namespace in all templates.
// Only values that templates legitimately need are included; sensitive credentials
// (fireflyToken, webhookSecret, redis password, etc.) are intentionally excluded.
// Templates can reference these values as {{ env.fireflyUrl }}, {{ env.apiToken }}, etc.
njkEnv.addGlobal("env", {
  fireflyUrl: env.fireflyUrl,
  serviceUrl: env.serviceUrl,
  apiToken: env.apiToken,
})

njkEnv.addFilter("toFixed", (value: number | string, decimals: number) => {
  const num = parseFloat(String(value))
  return isNaN(num) ? String(value) : num.toFixed(decimals)
})

export function renderTemplate(templateName: string, context: object): string {
  return njkEnv.render(templateName, context).trim()
}
