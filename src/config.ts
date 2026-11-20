import fs from 'node:fs'

export const PATH = {
  config: process.env.CONFIG_PATH ?? 'data/config.json',
  notified: process.env.NOTIFIED_PATH ?? 'data/notified.json',
}

interface DiscordFields {
  /** @minLength 1 */
  webhook_url?: string
  /** @minLength 1 */
  token?: string
  /** @minLength 1 */
  channel_id?: string
}

export interface Configuration {
  /** Discord の通知先 */
  discord: DiscordFields &
    ({ webhook_url: string } | { token: string; channel_id: string })
}

const isConfig = (config: unknown): config is Configuration => {
  if (!config || typeof config !== 'object') return false
  const cfg = config as { discord?: unknown }
  if (!cfg.discord || typeof cfg.discord !== 'object') return false
  const discord = cfg.discord as {
    webhook_url?: unknown
    token?: unknown
    channel_id?: unknown
  }
  return (
    [discord.webhook_url, discord.token, discord.channel_id].every(
      (value) =>
        value === undefined || (typeof value === 'string' && value.length > 0)
    ) &&
    (Boolean(discord.webhook_url) ||
      Boolean(discord.token && discord.channel_id))
  )
}

export function loadConfig(): Configuration {
  if (!fs.existsSync(PATH.config)) {
    throw new Error('Config file not found')
  }
  const config = JSON.parse(fs.readFileSync(PATH.config, 'utf8'))
  if (!isConfig(config)) {
    throw new Error('Invalid config')
  }
  return config
}
