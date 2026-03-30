import { env } from "./config"
import { createClient } from "./sdk/firefly/client"

const client = createClient({
  auth: env.fireflyToken,
  baseURL: `${env.fireflyUrl}/api`,
  throwOnError: true,
})

const paypalClient = createClient({
  auth: env.fireflyPaypalAccountToken,
  baseURL: `${env.fireflyUrl}/api/paypal`,
  throwOnError: true,
})

export { client, paypalClient }
