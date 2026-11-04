# watch-jcb

[JCB カードのキャンペーン一覧ページ](https://www.jcb.co.jp/campaign/)に追加された新着キャンペーン情報を、Discord に通知するツールです。

## インストール

Docker (Compose) または Node.js 環境で動作します。

### Docker (推奨)

`docker-compose.yml` に次のように記述します。

```yaml
version: '3.8'
services:
  app:
    image: ghcr.io/tomacheese/watch-jcb:latest
    volumes:
      - type: bind
        source: ./data
        target: /data/
    init: true
    restart: always
```

[設定](#設定)を参考に `data/config.json` を作成したあと、`docker compose up -d` で起動できます。コンテナ内では 10 分間隔でキャンペーンを確認します。

### Node.js

`.node-version` に記載のバージョンの Node.js と pnpm が必要です。

```bash
pnpm install
pnpm start
```

`pnpm start` は 1 回だけ確認して終了します。定期的に実行する場合は cron などから呼び出してください。

## 設定

既定では `data/config.json` を設定ファイルとして使用します。環境変数 `CONFIG_PATH` を設定すると、その値を設定ファイルのパスとして使用します。

通知済みのキャンペーンは `data/notified.json` に記録されます。環境変数 `NOTIFIED_PATH` でパスを変更できます。初回実行時は通知せず、その時点のキャンペーンを通知済みとして記録します。

設定ファイルの JSON Schema は [schema/Configuration.json](schema/Configuration.json) を参照してください。Webhook か Bot のどちらかを設定します。

```json
{
  "$schema": "https://raw.githubusercontent.com/tomacheese/watch-jcb/master/schema/Configuration.json",
  "discord": {
    "webhook_url": "https://discord.com/api/webhooks/..."
  }
}
```

Bot を使う場合は `token` と `channel_id` を指定します。通知後にクロスポストを常に試行します (アナウンスチャンネル以外などで失敗しても無視されます)。

## ライセンス

このプロジェクトのライセンスは [MIT License](LICENSE) です。
