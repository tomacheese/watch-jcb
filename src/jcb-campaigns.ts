import axios from 'axios'
import * as cheerio from 'cheerio'
import iconv from 'iconv-lite'

export interface CampaignInfo {
  campaignEndDate: string
  campaignListImageURL: string
  campaignName: string
  campaignStartDate: string
  copyRightWords: string
  descriptionText: string
  detailPageURL: string
  entryNeedFlag: boolean
  eventCode: string
  newInfoFlag: boolean
  pickUpImageURL: string | null
  prizeComment: string
  prizeWinnerNumber: string
  tagWords: string
}

export interface CampaignPickup {
  campaignInfo: CampaignInfo[]
  categoryCode: string
  categoryName: string
}

export interface CampaignList {
  campaignInfo: CampaignInfo[]
  categoryCode: string
  categoryName: string
}

export interface CampaignObject {
  campaignPickup: CampaignPickup
  campaignList: [CampaignList]
}

export interface JcbCampaign {
  campaignObject: [
    {
      campaignPickup: CampaignPickup
    },
    {
      campaignList: [CampaignList]
    },
  ]
}

export const isCampaignInfo = (x: any): x is CampaignInfo => {
  const checks = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    campaignEndDate: typeof x.campaignEndDate === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    campaignListImageURL: typeof x.campaignListImageURL === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    campaignName: typeof x.campaignName === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    campaignStartDate: typeof x.campaignStartDate === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    copyRightWords: typeof x.copyRightWords === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    descriptionText: typeof x.descriptionText === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    detailPageURL: typeof x.detailPageURL === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    entryNeedFlag: typeof x.entryNeedFlag === 'boolean',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    eventCode: typeof x.eventCode === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    newInfoFlag: typeof x.newInfoFlag === 'boolean',

    pickUpImageURL:
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      typeof x.pickUpImageURL === 'string' || x.pickUpImageURL === null,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    prizeComment: typeof x.prizeComment === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    prizeWinnerNumber: typeof x.prizeWinnerNumber === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    tagWords: typeof x.tagWords === 'string',
  }
  const checkResult = Object.values(checks).every(Boolean)
  if (!checkResult) {
    console.log('isCampaignInfo', checks)
  }
  return checkResult
}

export const isCampaignPickup = (x: any): x is CampaignPickup => {
  const checks = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    categoryCode: typeof x.categoryCode === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    categoryName: typeof x.categoryName === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    campaignInfoIsArray: Array.isArray(x.campaignInfo),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    campaignInfoEvery: x.campaignInfo.every((element: any) =>
      isCampaignInfo(element)
    ),
  }
  const checkResult = Object.values(checks).every(Boolean)
  if (!checkResult) {
    console.log('isCampaignPickup', checks)
  }
  return checkResult
}

export const isCampaignList = (x: any): x is CampaignList => {
  const checks = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    categoryCode: typeof x.categoryCode === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    categoryName: typeof x.categoryName === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    campaignInfoIsArray: Array.isArray(x.campaignInfo),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    campaignInfoEvery: x.campaignInfo.every((element: any) =>
      isCampaignInfo(element)
    ),
  }
  const checkResult = Object.values(checks).every(Boolean)
  if (!checkResult) {
    console.log('isCampaignList', checks)
  }
  return checkResult
}

export const isJcbCampaign = (x: any): x is JcbCampaign => {
  const checks = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    campaignObjectIsArray: Array.isArray(x.campaignObject),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    campaignObjectLength: x.campaignObject.length === 2,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    campaignObject0IsObject: typeof x.campaignObject[0] === 'object',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    campaignObject1IsObject: typeof x.campaignObject[1] === 'object',
    campaignObject0CampaignPickup: isCampaignPickup(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      x.campaignObject[0].campaignPickup
    ),
    campaignObject1CampaignListIsArray: Array.isArray(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      x.campaignObject[1].campaignList
    ),
    campaignObject1CampaignListLength:
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      x.campaignObject[1].campaignList.length === 1,
    campaignObject1CampaignList0: isCampaignList(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      x.campaignObject[1].campaignList[0]
    ),
  }
  const checkResult = Object.values(checks).every(Boolean)
  if (!checkResult) {
    console.log('isJcbCampaign', checks)
  }
  return checkResult
}

export async function getCampaigns(): Promise<JcbCampaign> {
  // windows-31j
  const response = await axios.get('https://www.jcb.co.jp/campaign/', {
    responseType: 'arraybuffer',
  })
  const result = iconv.decode(response.data, 'windows-31j')
  const $ = cheerio.load(result)
  const jsonDataElement = $('input#jsonData')
  if (jsonDataElement.length === 0) {
    throw new Error('jsonData element not found')
  }
  const jsonData = jsonDataElement.attr('value')
  if (jsonData === undefined) {
    throw new Error('jsonData value not found')
  }
  const data = JSON.parse(jsonData)
  if (!isJcbCampaign(data)) {
    throw new Error('Invalid data')
  }
  return data
}
