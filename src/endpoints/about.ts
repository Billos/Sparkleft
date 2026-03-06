import { readFileSync } from "fs"
import { join } from "path"

import { Request, Response } from "express"

const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8")) as {
  name: string
  version: string
  description?: string
  author: string
  license: string
  repository?: string | { url: string }
}

function repositoryUrl(repo: typeof pkg.repository): string | undefined {
  if (!repo) return undefined
  const raw = typeof repo === "string" ? repo : repo.url
  return raw.replace(/^git\+/, "").replace(/\.git$/, "")
}

export async function about(_req: Request, res: Response) {
  res.render("about", {
    name: pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1),
    version: pkg.version,
    description: pkg.description ?? "",
    author: pkg.author,
    license: pkg.license,
    repository: repositoryUrl(pkg.repository),
  })
}
