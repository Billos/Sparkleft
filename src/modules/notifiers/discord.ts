import { env } from "../../config"
import { AbstractNotifier } from "./notifier"

export class DiscordNotifier extends AbstractNotifier {
  constructor() {
    super()
  }

  override async sendMessageImpl(content: string): Promise<string> {
    const result = await fetch(`${env.discordWebhook}?wait=true`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
    if (!result.ok) {
      throw new Error(`Failed to send message to Discord webhook: ${result.status} ${result.statusText}`)
    }
    const data = await result.json()
    return data.id
  }

  override async deleteMessageImpl(id: string): Promise<void> {
    const result = await fetch(`${env.discordWebhook}/messages/${id}`, { method: "DELETE" })
    if (!result.ok) {
      throw new Error(`Failed to delete message with ID ${id} from Discord webhook: ${result.status} ${result.statusText}`)
    }
  }

  override async deleteAllMessagesImpl(): Promise<void> {
    throw new Error("Bulk deletion of messages is not supported by Discord webhooks.")
  }

  override async hasMessageIdImpl(_messageId: string): Promise<boolean> {
    throw new Error("Checking message existence is not supported by Discord webhooks.")
  }
}
