# AGENTS.md

## 言語ルール

- コミットの description、PR / Issue のタイトルと本文、コード内のコメント・docstring、ドキュメントは日本語で記載する。
- 日本語と英数字の間には半角スペースを入れる。
- 例外: 利用者向けの通知・UI 文字列、日本語のデータパターンやフィクスチャ、引用、技術的な識別子、フォーク PR 承認コメントの文面とワークフロー上の `body-includes` の照合キー (`Environment 承認待ち`)。`package.json` は常に英語。
- エラーメッセージは原則英語で記載する。
- コンソール出力で絵文字が使われている場合は、それに合わせる。

## 概要

JCB カードのキャンペーン一覧ページ (<https://www.jcb.co.jp/campaign/>) をスクレイピングし、新着キャンペーンを Discord に通知するツール。TypeScript / Node.js (tsx 実行) / Docker で動作する。

## 開発コマンド

```bash
pnpm install          # インストール (npm / yarn は不可。preinstall で pnpm を強制)
pnpm dev              # 開発 (tsx watch)
pnpm start            # 1 回実行
pnpm lint             # Prettier / ESLint / tsc
pnpm fix              # Prettier / ESLint の自動修正
pnpm test             # Jest
pnpm generate-schema  # schema/Configuration.json の再生成
```

## アーキテクチャ

- `src/main.ts`: エントリーポイント。設定読み込み、キャンペーン取得、新着判定、Discord 通知を 1 回実行する。定期実行のループは `entrypoint.sh` (10 分間隔) が担う。
- `src/jcb-campaigns.ts`: キャンペーンページの取得と、埋め込み JSON (`input#jsonData`) の検証。
- `src/discord.ts`: Discord への通知 (Webhook または Bot。Bot の場合は常にクロスポストを試行し、失敗しても無視する)。
- `src/config.ts`: 設定の型定義と読み込み。`CONFIG_PATH` (既定 `data/config.json`)、`NOTIFIED_PATH` (既定 `data/notified.json`)。
- `src/notified.ts`: 通知済みの `eventCode` の管理。
- `schema/Configuration.json`: 設定ファイルの JSON Schema (`Configuration` 型から生成)。

## 実装上の規約・不変条件

- HTTP 取得は Node.js 標準の `fetch` を使い、`axios` 等は導入しない。HTML のパースには `cheerio` を使う。
- JCB のサイトは Shift_JIS (`windows-31j`) のため、`iconv-lite` でデコードする。
- 初回実行 (`data/notified.json` が存在しない) では通知せず、現在のキャンペーンを通知済みとして記録するだけにする。これを崩すと初回に全件が通知される。
- 設定構造 (`Configuration`) を変更したら `pnpm generate-schema` を実行して `schema/Configuration.json` を更新する。
- スクレイピングはサイト構造の変更に弱い。セレクタや検証ロジックを変更したら `src/jcb-campaigns.test.ts` で確認する (実サイトへアクセスするテスト)。
- TypeScript の `skipLibCheck` を有効にして型エラーを回避しない。
- 関数やインターフェースの JSDoc は日本語で記載する。
- 設定はシングルトン的に扱わず、必要に応じて引数で渡すか明示的に読み込む。
- Renovate が作成した既存の PR に追加コミットを行わない。
- ブランチ名は Conventional Branch (`feat/`, `fix/` 等) に従う。
- Git Worktree を使う場合は、`.bare/` (bare リポジトリ) と `<ブランチ名>/` (各ブランチの worktree) の構成にする。

## セキュリティ

- Discord の Webhook URL や Bot トークンなどの機密情報は、コードに直接記述せず、設定ファイル (`data/config.json`) で管理する。
- 機密情報はコミット、ログ出力、環境変数のサンプルへの記載をしない。設定ファイルの内容もログに出力しない。
