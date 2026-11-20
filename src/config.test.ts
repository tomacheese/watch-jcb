import fs from 'node:fs'
import Ajv from 'ajv'
import { loadConfig } from './config'

const schema = JSON.parse(fs.readFileSync('schema/Configuration.json', 'utf8'))
const validate = new Ajv().compile(schema)

describe('Discord configuration', () => {
  afterEach(() => jest.restoreAllMocks())

  test.each([
    [{ discord: { webhook_url: 'webhook' } }, true],
    [{ discord: { token: 'token', channel_id: 'channel' } }, true],
    [
      {
        discord: {
          webhook_url: 'webhook',
          token: 'token',
          channel_id: 'channel',
        },
      },
      true,
    ],
    [{ discord: { webhook_url: 'webhook', token: 'token' } }, true],
    [{}, false],
    [{ discord: {} }, false],
    [{ discord: { token: 'token' } }, false],
    [{ discord: { channel_id: 'channel' } }, false],
    [{ discord: { webhook_url: '' } }, false],
    [{ discord: { token: '', channel_id: 'channel' } }, false],
    [{ discord: { token: 'token', channel_id: '' } }, false],
    [
      { discord: { webhook_url: '', token: 'token', channel_id: 'channel' } },
      false,
    ],
    [{ discord: { webhook_url: 'webhook', token: '' } }, false],
    [{ discord: { webhook_url: 42 } }, false],
    [{ discord: { webhook_url: 'webhook', token: null } }, false],
    [{ discord: [] }, false],
    [{ discord: null }, false],
  ])('validates %j as %s in schema and runtime', (config, valid) => {
    expect(validate(config)).toBe(valid)
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(config))
    if (valid) {
      expect(loadConfig()).toEqual(config)
    } else {
      expect(() => loadConfig()).toThrow('Invalid config')
    }
  })
})
