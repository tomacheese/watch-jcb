import fs from 'node:fs'
import { PATH } from './config'

export class Notified {
  public static isFirst(): boolean {
    const path = PATH.notified
    return !fs.existsSync(path)
  }

  public static isNotified(eventCode: string): boolean {
    return Notified.load(PATH.notified).includes(eventCode)
  }

  public static addNotified(eventCode: string): void {
    const path = PATH.notified
    const json = Notified.load(path)
    json.push(eventCode)
    // 書き込み中断で元ファイルが壊れないよう、一時ファイル経由で置き換える
    const tmpPath = `${path}.tmp`
    fs.writeFileSync(tmpPath, JSON.stringify(json))
    fs.renameSync(tmpPath, path)
  }

  /**
   * 通知済みの eventCode を読み込む。ファイルが無ければ空配列を返す。
   *
   * @throws ファイルが不正な JSON、または文字列配列でない場合
   */
  private static load(path: string): string[] {
    if (!fs.existsSync(path)) {
      return []
    }
    let parsed: unknown
    try {
      parsed = JSON.parse(fs.readFileSync(path, 'utf8'))
    } catch (error) {
      throw new Error(
        `Invalid JSON in notified file "${path}": ${error instanceof Error ? error.message : String(error)}`,
        { cause: error }
      )
    }
    if (!Array.isArray(parsed)) {
      throw new TypeError(
        `Invalid notified file "${path}": expected an array of strings, got ${typeof parsed}`
      )
    }
    for (const [index, value] of parsed.entries()) {
      if (typeof value !== 'string') {
        throw new TypeError(
          `Invalid notified file "${path}": expected a string at index ${index}, got ${typeof value}`
        )
      }
    }
    return parsed as string[]
  }
}
