# GitHub Copilot Instructions

プロジェクトの概要・規約・安全上のルールは [AGENTS.md](../AGENTS.md) を参照してください。以下はコードレビュー時の重点観点です。

## レビュー観点

- スクレイピング (`src/jcb-campaigns.ts`) のセレクタやエンコーディング (`windows-31j`) 処理の変更は、サイト構造の変更で壊れやすい。`src/jcb-campaigns.test.ts` の追随を確認する。
- 非同期処理は `async/await` を使う。新規の `.then()` チェーンは既存の慣習と合わない。
- ネットワーク失敗、パース失敗、Discord 通知失敗のエラーハンドリング漏れを確認する。
- 設定の型 (`Configuration`) を変更した場合、`pnpm generate-schema` の実行漏れがなく `schema/Configuration.json` と対応しているか確認する。
- 初回実行時に通知しない挙動 (`Notified.isFirst()`) が維持されているか確認する。
- Discord の Webhook URL や Bot トークンなどの機密情報が、コード・設定ファイル・ログにハードコードまたはコミットされていないか確認する。
- `skipLibCheck` を有効化して型エラーを回避していないか確認する。
