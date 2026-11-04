import fs from 'node:fs'

export const PATH = {
  config: process.env.CONFIG_PATH ?? 'data/config.json',
  notified: process.env.NOTIFIED_PATH ?? 'data/notified.json',
}

export interface Configuration {
  /** Discord の Webhook URL または Bot トークン */
  discord: {
    /** Discord の Webhook URL (Webhook を使う場合は必須) */
    webhook_url?: string
    /** Discord の Bot トークン (Bot を使う場合は必須) */
    token?: string
    /** Discord のチャンネル ID (Bot を使う場合は必須) */
    channel_id?: string
  }
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
  return !(
    !(discord.webhook_url ?? (discord.token && discord.channel_id)) ||
    (discord.webhook_url !== undefined &&
      typeof discord.webhook_url !== 'string') ||
    (discord.token !== undefined && typeof discord.token !== 'string') ||
    (discord.channel_id !== undefined && typeof discord.channel_id !== 'string')
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
