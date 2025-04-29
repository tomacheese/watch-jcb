import fs from 'node:fs'

export const PATH = {
  config: process.env.CONFIG_PATH ?? 'data/config.json',
  notified: process.env.NOTIFIED_PATH ?? 'data/notified.json',
}

export interface Configuration {
  /** Discord webhook URL or bot token */
  discord: {
    /** Discord webhook URL (required if using webhook) */
    webhook_url?: string
    /** Discord bot token (required if using bot) */
    token?: string
    /** Discord channel ID (required if using bot) */
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
  if (
    !(discord.webhook_url ?? (discord.token && discord.channel_id)) ||
    (discord.webhook_url !== undefined &&
      typeof discord.webhook_url !== 'string') ||
    (discord.token !== undefined && typeof discord.token !== 'string') ||
    (discord.channel_id !== undefined && typeof discord.channel_id !== 'string')
  ) {
    return false
  }
  return true
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
