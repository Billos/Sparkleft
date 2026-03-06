import axios, { AxiosInstance } from "axios"
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
  private request: AxiosInstance = axios.create({ baseURL: env.gotifyUrl, headers: { "X-Gotify-Key": env.gotifyToken } })

  constructor() {
    super()
  }

  override async notifyImpl(title: string, message: string): Promise<void> {
    await this.request.post("/message", { title, message, extras: { "client::display": { contentType: "text/markdown" } } })
  }

  override async sendMessageImpl(title: string, message: string): Promise<string> {
    const result = await this.request.post<{ id: number }>("/message", {
      title,
      message,
      extras: { "client::display": { contentType: "text/markdown" } },
    })
    return `${result.data.id}`
  }

  override async deleteMessageImpl(id: string): Promise<void> {
    if (await this.hasMessageIdImpl(id)) {
      await this.request.delete(`/message/${id}?token=${env.gotifyUserToken}`)
    } else {
      logger.debug({ id }, "Message ID does not exist, skipping deletion")
    }
  }

  override async deleteAllMessagesImpl(): Promise<void> {
    await this.request.delete(`/application/${env.gotifyApplicationId}/message?token=${env.gotifyUserToken}`)
  }

  override async hasMessageIdImpl(messageId: string): Promise<boolean> {
    try {
      const messages = await this.request.get<GetMessage>(`/application/${env.gotifyApplicationId}/message?token=${env.gotifyUserToken}`)
      const ids = messages.data.messages.map((msg) => msg.id.toString())
      return ids.includes(messageId)
    } catch {
      return false
    }
  }
}
