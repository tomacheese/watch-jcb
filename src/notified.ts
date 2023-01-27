import fs from 'node:fs'
import { PATH } from './config'

export class Notified {
  public static isFirst(): boolean {
    const path = PATH.notified
    return !fs.existsSync(path)
  }

  public static isNotified(eventCode: string): boolean {
    const path = PATH.notified
    const json = fs.existsSync(path)
      ? JSON.parse(fs.readFileSync(path, 'utf8'))
      : []
    return json.includes(eventCode)
  }

  public static addNotified(eventCode: string): void {
    const path = PATH.notified
    const json = fs.existsSync(path)
      ? JSON.parse(fs.readFileSync(path, 'utf8'))
      : []
    json.push(eventCode)
    fs.writeFileSync(path, JSON.stringify(json))
  }
}
