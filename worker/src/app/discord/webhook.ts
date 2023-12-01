import { Env } from "../../types";

export default async function sendNotification(webhookUrl: Env['WEBHOOK_URL'], message: string | undefined) {
  if (!message) {
    return;
  }

  const response = await fetch(webhookUrl, {
    body: JSON.stringify({ content: message }),
    headers: { "Content-Type": "application/json; charset=utf-8" },
    method: "POST"
  })

  if (!response.ok) {
    const text = await response.text()
    throw `Error (${response.status}) while sending webhook: ${text}`
  }
}