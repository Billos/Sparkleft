import { createClient } from "@hey-api/client-axios";

import { env } from "../../config";

export const client = createClient({
  baseURL: `${env.fireflyUrl}/api`,
  auth: env.fireflyToken,
});

export const paypalClient = createClient({
  baseURL: `${env.fireflyUrl}/api`,
  auth: env.fireflyPaypalAccountToken,
});
