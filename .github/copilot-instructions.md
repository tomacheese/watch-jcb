# GitHub Copilot Instructions

## プロジェクト概要
- 目的: JCB カードのキャンペーン情報を監視し、新着情報を Discord に通知する
- 主な機能: JCB キャンペーン一覧ページのスクレイピング、新着判定、Discord 通知
- 対象ユーザー: JCB カード利用者

## 共通ルール
- 会話は日本語で行う。
- PR とコミットは Conventional Commits に従い、`<description>` は日本語で記載する。
- 日本語と英数字の間には半角スペースを入れる。

## 技術スタック
- 言語: TypeScript
- 実行環境: Node.js (tsx), Docker
- パッケージマネージャー: pnpm
- ライブラリ: axios, cheerio, iconv-lite
- テスト: Jest, ts-jest
- リンター/フォーマッタ: ESLint, Prettier

## 開発コマンド
```bash
# 依存関係のインストール
pnpm install

# 開発実行 (ウォッチモード)
pnpm dev

# 通常実行
pnpm start

# テスト実行
pnpm test

# リンター実行
pnpm lint

# 自動修正実行
pnpm fix

# JSON スキーマ生成
pnpm generate-schema
```

## コーディング規約
- TypeScript の `skipLibCheck` を有効にして回避しない。
- 関数やインターフェースには JSDoc 形式の docstring を英語で記載する（既存コードの慣習に従う）。
- 既存の命名規則やコード構造を尊重する。

## テスト方針
- テストフレームワーク: Jest
- 新機能の追加やバグ修正時には、対応するテストを追加・更新する。

## セキュリティ / 機密情報
- API キーや Webhook URL などの機密情報は直接コードに記述せず、設定ファイル (`data/config.json`) や環境変数で管理する。
- ログに機密情報を出力しない。

## ドキュメント更新
- 設定項目の変更時には `schema/Configuration.json` を更新 (`pnpm generate-schema`) し、必要に応じて `README.md` を更新する。

## リポジトリ固有
- JCB のサイトは Shift_JIS (windows-31j) でエンコードされているため、`iconv-lite` を使用して適切にデコードする。
- 通知済みのキャンペーンは `data/notified.json` (デフォルト) で管理される。
