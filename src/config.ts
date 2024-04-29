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

const isConfig = (config: any): config is Configuration => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (
    config &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    typeof config.discord === 'object' &&
    // webhook_url があるか token と channel_id があるか
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (config.discord.webhook_url ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (config.discord.token && config.discord.channel_id)) &&
    // webhook_url があるとき、string である
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (config.discord.webhook_url === undefined ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      typeof config.discord.webhook_url === 'string') &&
    // token があるとき、string である
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (config.discord.token === undefined ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      typeof config.discord.token === 'string') &&
    // channel_id があるとき、string である
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (config.discord.channel_id === undefined ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      typeof config.discord.channel_id === 'string')
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
