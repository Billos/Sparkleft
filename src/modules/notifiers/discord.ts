import axios, { AxiosInstance } from "axios"

import { env } from "../../config"
import { AbstractNotifier } from "./notifier"

export class DiscordNotifier extends AbstractNotifier {
  private request: AxiosInstance = axios.create({})

  constructor() {
    super()
  }

  override async notifyImpl(_title: string, content: string): Promise<void> {
    await this.request.post<{ id: number }>(`${env.discordWebhook}?wait=true`, { content })
  }

  override async sendMessageImpl(_title: string, content: string): Promise<string> {
    const result = await this.request.post<{ id: number }>(`${env.discordWebhook}?wait=true`, { content })
    return `${result.data.id}`
  }

  override async deleteMessageImpl(id: string): Promise<void> {
    await this.request.delete(`${env.discordWebhook}/messages/${id}`)
  }

  override async deleteAllMessagesImpl(): Promise<void> {
    throw new Error("Bulk deletion of messages is not supported by Discord webhooks.")
  }

  override async hasMessageIdImpl(_messageId: string): Promise<boolean> {
    throw new Error("Checking message existence is not supported by Discord webhooks.")
  }
}
