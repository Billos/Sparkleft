import { createClient } from "@billos/firefly-iii-sdk/client"

import { env } from "./config"

const client = createClient({
  auth: env.fireflyToken,
  baseUrl: `${env.fireflyUrl}/api`,
  throwOnError: true,
})

const paypalClient = createClient({
  auth: env.fireflyPaypalAccountToken,
  baseUrl: `${env.fireflyUrl}/api/paypal`,
  throwOnError: true,
})

export { client, paypalClient }
