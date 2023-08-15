import axios from 'axios'
import cheerio from 'cheerio'
import { decode } from 'iconv-lite'

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
    campaignEndDate: typeof x.campaignEndDate === 'string',
    campaignListImageURL: typeof x.campaignListImageURL === 'string',
    campaignName: typeof x.campaignName === 'string',
    campaignStartDate: typeof x.campaignStartDate === 'string',
    copyRightWords: typeof x.copyRightWords === 'string',
    descriptionText: typeof x.descriptionText === 'string',
    detailPageURL: typeof x.detailPageURL === 'string',
    entryNeedFlag: typeof x.entryNeedFlag === 'boolean',
    eventCode: typeof x.eventCode === 'string',
    newInfoFlag: typeof x.newInfoFlag === 'boolean',
    pickUpImageURL:
      typeof x.pickUpImageURL === 'string' || x.pickUpImageURL === null,
    prizeComment: typeof x.prizeComment === 'string',
    prizeWinnerNumber: typeof x.prizeWinnerNumber === 'string',
    tagWords: typeof x.tagWords === 'string',
  }
  const checkResult = Object.values(checks).every(Boolean)
  if (checkResult === false) {
    console.log('isCampaignInfo', checks)
  }
  return checkResult
}

export const isCampaignPickup = (x: any): x is CampaignPickup => {
  const checks = {
    categoryCode: typeof x.categoryCode === 'string',
    categoryName: typeof x.categoryName === 'string',
    campaignInfoIsArray: Array.isArray(x.campaignInfo),
    campaignInfoEvery: x.campaignInfo.every((element: any) =>
      isCampaignInfo(element),
    ),
  }
  const checkResult = Object.values(checks).every(Boolean)
  if (checkResult === false) {
    console.log('isCampaignPickup', checks)
  }
  return checkResult
}

export const isCampaignList = (x: any): x is CampaignList => {
  const checks = {
    categoryCode: typeof x.categoryCode === 'string',
    categoryName: typeof x.categoryName === 'string',
    campaignInfoIsArray: Array.isArray(x.campaignInfo),
    campaignInfoEvery: x.campaignInfo.every((element: any) =>
      isCampaignInfo(element),
    ),
  }
  const checkResult = Object.values(checks).every(Boolean)
  if (checkResult === false) {
    console.log('isCampaignList', checks)
  }
  return checkResult
}

export const isJcbCampaign = (x: any): x is JcbCampaign => {
  const checks = {
    campaignObjectIsArray: Array.isArray(x.campaignObject),
    campaignObjectLength: x.campaignObject.length === 2,
    campaignObject0IsObject: typeof x.campaignObject[0] === 'object',
    campaignObject1IsObject: typeof x.campaignObject[1] === 'object',
    campaignObject0CampaignPickup: isCampaignPickup(
      x.campaignObject[0].campaignPickup,
    ),
    campaignObject1CampaignListIsArray: Array.isArray(
      x.campaignObject[1].campaignList,
    ),
    campaignObject1CampaignListLength:
      x.campaignObject[1].campaignList.length === 1,
    campaignObject1CampaignList0: isCampaignList(
      x.campaignObject[1].campaignList[0],
    ),
  }
  const checkResult = Object.values(checks).every(Boolean)
  if (checkResult === false) {
    console.log('isJcbCampaign', checks)
  }
  return checkResult
}

export async function getCampaigns(): Promise<JcbCampaign> {
  // windows-31j
  const response = await axios.get('https://www.jcb.co.jp/campaign/', {
    responseType: 'arraybuffer',
  })
  const result = decode(response.data, 'windows-31j')
  const $ = cheerio.load(result, { decodeEntities: false })
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
