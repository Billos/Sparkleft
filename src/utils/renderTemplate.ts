import path from "path"

import nunjucks from "nunjucks"

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

export function renderTemplate(templateName: string, context: object): string {
  return njkEnv.render(templateName, context).trim()
}
