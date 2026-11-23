import { sendDiscordMessage } from './discord'

describe('Webhook', () => {
  const config = { discord: { webhook_url: 'https://example.com/webhook' } }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it.each([200, 204])('HTTP %i を成功として扱う', async (status) => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status }))

    await expect(sendDiscordMessage(config, 'test')).resolves.toBeUndefined()
  })

  it('HTTP エラーを通知する', async () => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 400 }))

    await expect(sendDiscordMessage(config, 'test')).rejects.toThrow(
      'Discord webhook failed (400)'
    )
  })
})
