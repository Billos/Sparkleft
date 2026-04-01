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

  override async notifyImpl(title: string, message: string): Promise<void> {
    await fetch(`${env.gotifyUrl}/message?token=${env.gotifyUserToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Gotify-Key": env.gotifyToken },
      body: JSON.stringify({ title, message, extras: { "client::display": { contentType: "text/markdown" } } }),
    })
  }

  override async sendMessageImpl(title: string, message: string): Promise<string> {
    const result = await fetch(`${env.gotifyUrl}/message?token=${env.gotifyUserToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Gotify-Key": env.gotifyToken },
      body: JSON.stringify({ title, message, extras: { "client::display": { contentType: "text/markdown" } } }),
    })
    if (!result.ok) {
      throw new Error(`Failed to send message to Gotify: ${result.status} ${result.statusText}`)
    }
    const data = await result.json()
    return `${data.id}`
  }

  override async deleteMessageImpl(id: string): Promise<void> {
    if (await this.hasMessageIdImpl(id)) {
      await fetch(`${env.gotifyUrl}/message/${id}?token=${env.gotifyUserToken}`, {
        method: "DELETE",
        headers: { "X-Gotify-Key": env.gotifyToken },
      })
    } else {
      logger.debug({ id }, "Message ID does not exist, skipping deletion")
    }
  }

  override async deleteAllMessagesImpl(): Promise<void> {
    // await this.request.delete(`/application/${env.gotifyApplicationId}/message?token=${env.gotifyUserToken}`)
    await fetch(`/application/${env.gotifyApplicationId}/message?token=${env.gotifyUserToken}`, {
      method: "DELETE",
      headers: { "X-Gotify-Key": env.gotifyToken },
    })
  }

  override async hasMessageIdImpl(messageId: string): Promise<boolean> {
    try {
      const query = await fetch(`/application/${env.gotifyApplicationId}/message?token=${env.gotifyUserToken}`, {
        method: "GET",
        headers: { "X-Gotify-Key": env.gotifyToken },
      })
      if (!query.ok) {
        throw new Error(`Failed to fetch messages from Gotify: ${query.status} ${query.statusText}`)
      }
      const messages = (await query.json()) as GetMessage
      const ids = messages.messages.map((msg) => msg.id.toString())
      return ids.includes(messageId)
    } catch {
      return false
    }
  }
}
