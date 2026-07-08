import pino from "pino"

import DynamicConfig, { VConfig } from "../config/dynamic"
import { DiscordNotifier } from "./discord"
import { GotifyNotifier } from "./gotify"
import { Notifier } from "./notifier"
import { Notifiers } from "./types"

const logger = pino()

async function getDiscordNotifier(): Promise<DiscordNotifier | null> {
  const webhook = await DynamicConfig.get(VConfig.NotifierDiscordWebhook)
  if (!webhook) {
    logger.warn("Discord notifier is not configured")
    return null
  }
  return new DiscordNotifier(webhook)
}

async function getGotifyNotifier(): Promise<GotifyNotifier | null> {
  const url = await DynamicConfig.get(VConfig.NotifierGotifyUrl)
  const token = await DynamicConfig.get(VConfig.NotifierGotifyToken)
  const userToken = await DynamicConfig.get(VConfig.NotifierGotifyUserToken)
  const applicationId = await DynamicConfig.get(VConfig.NotifierGotifyApplicationId)

  if (!url || !token || !userToken || !applicationId) {
    logger.warn("Gotify notifier is not fully configured")
    return null
  }
  return new GotifyNotifier(url, token, userToken, applicationId)
}

export async function getNotifier(): Promise<Notifier | null> {
  const builder = await DynamicConfig.get(VConfig.Notifier)
  if (builder === Notifiers.Discord) {
    return getDiscordNotifier()
  } else if (builder === Notifiers.Gotify) {
    return getGotifyNotifier()
  } else {
    logger.warn("No notifier configured")
  }

  return null
}
