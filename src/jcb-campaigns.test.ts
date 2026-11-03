import { getCampaigns } from './jcb-campaigns'

jest.setTimeout(120_000) // 120sec

describe('JcbCampaigns', () => {
  test('getCampaigns', async () => {
    // Error を投げないことを確認する
    await expect(getCampaigns()).resolves.not.toThrow()
  })
})
