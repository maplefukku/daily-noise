# デイリーノイズ (daily-noise) - 実装プロンプト

## プロダクト概要
毎日AIが「試すこと」勝手に届くアプリ。

**ターゲット**: 大学生1-3年生
**機能**: 1日の提案表示 + やる/スキップ
**特徴**: 5秒で判断→終わり。「めんどくさい」を排除

---

## 技術スタック
- **Framework**: Next.js 16 (App Router, TypeScript, Tailwind CSS)
- **UI Components**: shadcn/ui (カスタマイズ必須)
- **Animation**: framer-motion
- **Storage**: LocalStorage（MVP）
- **LLM**: GLM API (glm-4.7, OpenAI互換) — **OpenAI/GPT禁止**

---

## 画面構成（2画面）

### 1. ホーム (/)
**目的**: 今日の提案を表示し、やる/スキップを選択

**コンポーネント**:
- ヒーロー見出し: 「今日、試すこと」
- 提案カード: {title} / {category}
- やるボタン（緑）: クリック → ログに保存
- スキップボタン（グレー）: クリック → ログに保存
- 次の提案ボタン: クリック → 新しい提案生成

**LocalStorage**:
- daily-noise-today: 今日の提案
- daily-noise-logs: 反応ログ

### 2. 履歴 (/history)
**目的**: 過去の反応ログを表示

**コンポーネント**:
- 日付別の提案履歴
- やる/スキップの統計

---

## API Routes実装

### GET /api/suggest
GLM APIを呼び出して提案を生成

**Response**:
```json
{
  "title": "Podcastで1つ聴いてみる",
  "category": "Podcast"
}
```

**GLM API System Prompt**:
```
あなたは「デイリーノイズ」のAIです。毎日1つ、ユーザーが「今日試すこと」を提案します。

ルール:
- 提案は1文で15文字以内
- カテゴリ: Podcast / 動画 / 記事 / アプリ / 行動
- 具体的で今すぐできること
- 説教しない。「すべき」を使わない
- 軽く、楽しげに
- JSON形式で返す: {"title": "...", "category": "..."}
```

---

## 環境変数

```bash
# .env.local
GLM_API_KEY=d4d5b41fda2845b48f8f55c4e3a1e3e9.TMSBR1aLRdCgSkEo
GLM_BASE_URL=https://api.z.ai/api/coding/paas/v4/
GLM_MODEL=glm-4.7
```

---

## 実装手順（TDD厳守）

### Phase 1: プロジェクト初期化
1. shadcn/ui初期化: `npx shadcn@latest init`
2. 必要なコンポーネント追加: `npx shadcn@latest add button card`
3. framer-motion, lucide-react, next-themes インストール
4. vitest設定

### Phase 2: API実装
1. src/app/api/suggest/route.ts 作成
2. テスト作成: tests/api/suggest-route.test.ts

### Phase 3: Storage実装
1. src/lib/storage.ts 作成（LocalStorage管理）
2. テスト作成: tests/lib/storage.test.ts

### Phase 4: UI実装
1. src/app/page.tsx 実装（ホーム）
2. src/app/history/page.tsx 実装（履歴）
3. テスト作成: tests/components/*.test.tsx

### Phase 5: 統合・確認
1. `npm run build` 成功確認
2. `npx vitest run --coverage` カバレッジ60%以上確認
3. TypeScriptエラーなし確認
4. Lintエラーなし確認

---

## DESIGN_SYSTEM.md準拠チェックリスト

### 禁止事項
- [ ] グラデーション背景使用禁止
- [ ] shadow-lg以上の影使用禁止
- [ ] border-border/50以外の濃いボーダー禁止
- [ ] 色を3色以上使用禁止（グレースケール + 緑/グレーのみ）
- [ ] rounded-2xl / rounded-full以外の角丸禁止
- [ ] p-4未満のパディング禁止
- [ ] アイコンだけのボタン禁止
- [ ] 英語のまま残す禁止
- [ ] shadcn/uiデフォルトそのまま禁止

### 必須実装
- [ ] framer-motionアニメーション
- [ ] ボタンhover/active状態
- [ ] スケルトンUI
- [ ] ダークモード対応（next-themes）
- [ ] テスト作成（TDD）

---

## 完了条件
1. `npm run build` が成功
2. `npx vitest run` が全て成功
3. `npm run lint` がエラーなし
4. TypeScriptエラーなし
5. テストカバレッジ60%以上
6. 全2画面が実装され、画面遷移が動作する
7. 提案生成が動作する
8. DESIGN_SYSTEM.mdの禁止事項に違反していない

---

## 注意事項
- **OpenAI API / GPT は絶対に使わない。GLM APIのみ**
- **自分でコードを書かない。Claude Codeに委任**
- **テスト駆動開発（TDD）で実装**
- **1画面1意思決定を守る**
- **日本語UIは翻訳くさくない自然な表現**
- **MVPではLocalStorageを使用**

---

## 背景と意図
このプロダクトは「若者から世界をよくする」という信念のもと開発している。
ターゲットは大学生1-3年生。「何か始めたいけど、何を？めんどくさい」状態で困っている。
毎日AIが勝手に提案することで、自分で選ぶハードルを排除し、続けるうちに無意識の興味が可視化されることを検証する。
Apple/Notion/Linearレベルのデザイン品質で、人間が「使いたい」と思うプロダクトを作る。
