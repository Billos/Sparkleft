import { env } from "./config"
import { createClient } from "./sdk/firefly/client"

const client = createClient({
  auth: env.fireflyToken,
  baseURL: `${env.fireflyUrl}/api`,
  throwOnError: true,
})

export { client }
