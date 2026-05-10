# 褥瘡AIフローチャート補助アプリ

DESIGN-R / TIME分類に沿って、褥瘡写真のAI仮判定、手動修正、候補処置、コピー用A/P文を表示するVercel向けWebアプリです。

## 重要な注意

- AI判定は仮判定です。
- D（深さ）とP（ポケット）は写真だけで断定せず、手動確認してください。
- 写真はAI解析のため外部APIへ一時送信されます。
- このアプリは写真を保存しません。
- APIキーをGitHubやブラウザ側JavaScriptに書かないでください。

## ファイル構成

- `index.html`: 画面
- `styles.css`: スタイル
- `app.js`: DESIGN-R入力、推薦、A/P生成
- `api/analyze-wound.js`: Vercel FunctionのAI解析API
- `vercel.json`: Vercel設定
- `.env.example`: 環境変数例

## Vercel環境変数

VercelのProject Settings > Environment Variables に設定します。

```text
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
GEMINI_API_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

`GEMINI_API_KEY` はGoogle AI Studioで取得します。無料枠で使う想定のデフォルトモデルは `gemini-2.5-flash` です。未設定でも手動入力とフローチャート提案は使えますが、AI解析は動きません。

OpenAIに戻したい場合は、`AI_PROVIDER=openai` と `OPENAI_API_KEY` を設定します。

## ローカル確認

```bash
npm run check
npx serve .
```

ブラウザで表示されたローカルURLを開きます。Vercel Function込みで確認する場合はVercel CLIを使ってください。

## デプロイ

この `pressure-ulcer-ai-app` フォルダの中身をGitHubリポジトリへアップロードし、VercelでImportします。

Framework Presetは `Other` で構いません。

## 参考

Google公式ドキュメントでは、Gemini APIの画像入力は `generateContent` に `inline_data` のBase64画像を渡す方式が案内されています。Gemini 2.5 FlashはFree Tierでテキスト・画像入力と出力が無料枠対象です。
