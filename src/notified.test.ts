import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

describe('Notified', () => {
  const originalNotifiedPath = process.env.NOTIFIED_PATH
  let dir: string
  let file: string

  function loadNotified() {
    jest.resetModules()
    process.env.NOTIFIED_PATH = file
    return jest.requireActual<typeof import('./notified')>('./notified')
      .Notified
  }

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'notified-test-'))
    file = path.join(dir, 'notified.json')
  })

  afterEach(() => {
    jest.restoreAllMocks()
    if (originalNotifiedPath === undefined) {
      delete process.env.NOTIFIED_PATH
    } else {
      process.env.NOTIFIED_PATH = originalNotifiedPath
    }
    fs.rmSync(dir, { recursive: true, force: true })
  })

  test('addNotified appends the code and leaves no temporary file', () => {
    fs.writeFileSync(file, '["a","b"]')
    const Notified = loadNotified()

    Notified.addNotified('c')

    expect(fs.readFileSync(file, 'utf8')).toBe('["a","b","c"]')
    expect(fs.existsSync(`${file}.tmp`)).toBe(false)
  })

  test('keeps the existing file intact when a write is interrupted', () => {
    fs.writeFileSync(file, '["a","b"]')
    const Notified = loadNotified()
    const realWriteFileSync = fs.writeFileSync.bind(fs)
    jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation((target, _data, options) => {
        realWriteFileSync(target, '["a"', options)
        throw new Error('disk full')
      })

    expect(() => {
      Notified.addNotified('c')
    }).toThrow('disk full')

    expect(fs.readFileSync(file, 'utf8')).toBe('["a","b"]')
    expect(Notified.isNotified('a')).toBe(true)
  })

  test('treats a missing file as the first run', () => {
    const Notified = loadNotified()

    expect(Notified.isFirst()).toBe(true)
    expect(Notified.isNotified('x')).toBe(false)

    Notified.addNotified('x')

    expect(Notified.isFirst()).toBe(false)
    expect(Notified.isNotified('x')).toBe(true)
  })

  test('rejects invalid JSON with the file path', () => {
    fs.writeFileSync(file, '["a"')
    const Notified = loadNotified()

    expect(() => Notified.isNotified('a')).toThrow(
      `Invalid JSON in notified file "${file}"`
    )
  })

  test.each([
    ['{}', 'expected an array of strings, got object'],
    ['[1]', 'expected a string at index 0, got number'],
    ['["a",null]', 'expected a string at index 1, got object'],
  ])('rejects %s', (content, reason) => {
    fs.writeFileSync(file, content)
    const Notified = loadNotified()

    expect(() => Notified.isNotified('a')).toThrow(
      new Error(`Invalid notified file "${file}": ${reason}`)
    )
  })
})
