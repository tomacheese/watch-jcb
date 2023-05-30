import { loadConfig } from './config'
import { DiscordEmbed, sendDiscordMessage } from './discord'
import { getCampaigns } from './jcb-campaigns'
import { Notified } from './notified'

function formatDate(dateRaw: string): string {
  return `${dateRaw.slice(0, 4)}/${dateRaw.slice(4, 6)}/${dateRaw.slice(6, 8)}`
}

async function main() {
  const config = loadConfig()

  console.log('📡 Fetching campaigns...')
  const campaigns = await getCampaigns()
  const isFirst = Notified.isFirst()

  const campaignInfos = campaigns.campaignObject[1].campaignList[0].campaignInfo
  const newCampaigns = campaignInfos.filter((campaignInfo) => {
    return !Notified.isNotified(campaignInfo.eventCode)
  })
  console.log(`📝 ${newCampaigns.length} new campaigns found.`)

  for (const campaignInfo of newCampaigns) {
    const {
      campaignName: name,
      descriptionText: description,
      entryNeedFlag: needEntry,
      detailPageURL: url,
      campaignStartDate: startDateRaw,
      campaignEndDate: endDateRaw,
      eventCode,
    } = campaignInfo
    const startDate = formatDate(startDateRaw)
    const endDate = formatDate(endDateRaw)

    console.log(name, url, startDate, endDate, needEntry)

    const embed: DiscordEmbed = {
      title: name,
      description,
      url,
      timestamp: new Date().toISOString(),
      color: 0xff_80_00,
      fields: [
        {
          name: '期間',
          value: `${startDate} 〜 ${endDate}`,
          inline: true,
        },
        {
          name: '参加登録が必要',
          value: needEntry.toString(),
          inline: true,
        },
      ],
    }
    if (!isFirst) {
      await sendDiscordMessage(config, '', embed, true)
    }

    Notified.addNotified(eventCode)
  }
}

;(async () => {
  await main().catch((error) => {
    console.error(error)
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1)
  })
})()
