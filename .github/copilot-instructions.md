# GitHub Copilot Instructions

GitHub Copilot のコードレビュー機能向けの指示です。以下の観点でレビューしてください。

## プロジェクト概要
- JCB カードのキャンペーン一覧ページをスクレイピングし、新着キャンペーンを Discord に通知するツール。
- TypeScript / Node.js (tsx 実行) / Docker で動作。

## 技術スタック
- 言語: TypeScript
- パッケージマネージャー: pnpm（npm/yarn は不可。`preinstall` で pnpm を強制）
- HTTP 取得: Node.js 標準の `fetch`（`axios` 等の HTTP クライアントは未使用）
- HTML パース: `cheerio`
- 文字コード変換: `iconv-lite`（JCB サイトは Shift_JIS / `windows-31j`）
- テスト: Jest (`ts-jest`)
- Lint/Format: ESLint, Prettier

## レビュー観点
- スクレイピング (`src/jcb-campaigns.ts`) のセレクタやエンコーディング処理の変更は、サイト構造変更で壊れやすい。テスト (`src/jcb-campaigns.test.ts`) の追随を確認する。
- 非同期処理は `async/await` を使用する（新規の `.then()` チェーンは既存の慣習と不整合）。
- エラーハンドリングの欠落（ネットワーク失敗、パース失敗、Discord 通知失敗）を確認する。
- `data/config.json` 相当の設定は JSON Schema (`schema/Configuration.json`) と対応する。設定構造の変更時に `pnpm generate-schema` の実行漏れがないか確認する。

## コーディング規約（lint/formatter で強制）
- Prettier / ESLint (`@book000/eslint-config`) に準拠する。
- 関数やインターフェースには英語の JSDoc を記載する（既存コードの慣習）。
- TypeScript の `skipLibCheck` を有効化して型エラーを回避しない。

## セキュリティ
- API キーや Discord Webhook URL などの機密情報を、コード・設定ファイル・ログにハードコードまたはコミットしていないか確認する。

## コミット / PR
- Conventional Commits に従い、`<description>` は日本語で記載する。
- 日本語と英数字の間には半角スペースを入れる。
