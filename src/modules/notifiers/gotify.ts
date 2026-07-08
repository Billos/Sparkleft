import pino from "pino"

import { AbstractNotifier } from "./notifier"

const logger = pino()

interface GetMessage {
  messages: {
    id: number
  }[]
}

export class GotifyNotifier extends AbstractNotifier {
  constructor(
    private readonly gotifyUrl: string,
    private readonly gotifyToken: string,
    private readonly gotifyUserToken: string,
    private readonly gotifyApplicationId: string,
  ) {
    super()
  }

  override async sendMessage(title: string, message: string): Promise<string> {
    const result = await fetch(`${this.gotifyUrl}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Gotify-Key": this.gotifyToken },
      body: JSON.stringify({ title, message, extras: { "client::display": { contentType: "text/markdown" } } }),
    })
    if (!result.ok) {
      throw new Error(`Failed to send message to Gotify: ${result.status} ${result.statusText}`)
    }
    const data = await result.json()
    return `${data.id}`
  }

  override async deleteMessage(id: string): Promise<void> {
    if (await this.hasMessageId(id)) {
      const result = await fetch(`${this.gotifyUrl}/message/${id}?token=${this.gotifyUserToken}`, {
        method: "DELETE",
        headers: { "X-Gotify-Key": this.gotifyToken },
      })
      if (!result.ok) {
        throw new Error(`Failed to delete message with ID ${id} from Gotify: ${result.status} ${result.statusText}`)
      }
    } else {
      logger.debug({ id }, "Message ID does not exist, skipping deletion")
    }
  }

  override async deleteAllMessages(): Promise<void> {
    const result = await fetch(`${this.gotifyUrl}/application/${this.gotifyApplicationId}/message?token=${this.gotifyUserToken}`, {
      method: "DELETE",
      headers: { "X-Gotify-Key": this.gotifyToken },
    })
    if (!result.ok) {
      throw new Error(`Failed to delete all messages from Gotify: ${result.status} ${result.statusText}`)
    }
  }

  override async hasMessageId(messageId: string): Promise<boolean> {
    try {
      const result = await fetch(`${this.gotifyUrl}/application/${this.gotifyApplicationId}/message?token=${this.gotifyUserToken}`, {
        method: "GET",
        headers: { "X-Gotify-Key": this.gotifyToken },
      })
      if (!result.ok) {
        throw new Error(`Failed to fetch messages from Gotify: ${result.status} ${result.statusText}`)
      }
      const messages = (await result.json()) as GetMessage
      const ids = messages.messages.map((msg) => msg.id.toString())
      return ids.includes(messageId)
    } catch (error) {
      logger.error({ err: error }, "Error checking for message ID %s in Gotify:", messageId)
      return false
    }
  }
}
