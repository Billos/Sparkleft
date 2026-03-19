import { ASAP_JOB_DELAY } from "./constants"

export function getJobDelay(startDelay: number, withDelta: boolean, asap: boolean = false): number {
  if (asap) {
    return ASAP_JOB_DELAY
  }
  // Random delay between 0 and 30 seconds
  const delta = withDelta ? Math.floor(Math.random() * 30) : 0
  return (startDelay + delta) * 1000
}
