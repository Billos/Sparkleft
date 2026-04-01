import pino from "pino"

import { env } from "../../config"
import { AbstractNotifier } from "./notifier"

const logger = pino()

interface GetMessage {
  messages: {
    id: number
  }[]
}

export class GotifyNotifier extends AbstractNotifier {
  constructor() {
    super()
  }

  async #request(path: string, options: RequestInit = {}): Promise<Response> {
    const result = await fetch(`${env.gotifyUrl}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        "X-Gotify-Key": env.gotifyToken,
      },
    })
    if (!result.ok) {
      throw new Error(`Gotify request to ${path} failed: ${result.status} ${result.statusText}`)
    }
    return result
  }

  override async notifyImpl(title: string, message: string): Promise<void> {
    await this.sendMessageImpl(title, message)
  }

  override async sendMessageImpl(title: string, message: string): Promise<string> {
    const result = await this.#request("/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message, extras: { "client::display": { contentType: "text/markdown" } } }),
    })
    const data = await result.json()
    return `${data.id}`
  }

  override async deleteMessageImpl(id: string): Promise<void> {
    if (await this.hasMessageIdImpl(id)) {
      await this.#request(`/message/${id}?token=${env.gotifyUserToken}`, {
        method: "DELETE",
      })
    } else {
      logger.debug({ id }, "Message ID does not exist, skipping deletion")
    }
  }

  override async deleteAllMessagesImpl(): Promise<void> {
    await this.#request(`/application/${env.gotifyApplicationId}/message?token=${env.gotifyUserToken}`, {
      method: "DELETE",
    })
  }

  override async hasMessageIdImpl(messageId: string): Promise<boolean> {
    try {
      const result = await this.#request(`/application/${env.gotifyApplicationId}/message?token=${env.gotifyUserToken}`)
      const messages = (await result.json()) as GetMessage
      const ids = messages.messages.map((msg) => msg.id.toString())
      return ids.includes(messageId)
    } catch (error) {
      logger.error({ err: error }, "Error checking for message ID %s in Gotify:", messageId)
      return false
    }
  }
}
