import { createClient } from "@hey-api/client-axios";

import { env } from "../../config";
import { client } from "./core/client.gen";

client.setConfig({
  auth: env.fireflyToken,
  baseURL: `${env.fireflyUrl}/api`,
});

export const paypalClient = createClient({
  auth: env.fireflyPaypalAccountToken,
  baseURL: `${env.fireflyUrl}/api`,
});

export { client };
