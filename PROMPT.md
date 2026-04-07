# デザイン仕上げタスク - デイリーノイズ

## 担当範囲
1. framer-motionアニメーション
2. ダークモード(next-themes)
3. レスポンシブ対応(375px)
4. DESIGN_SYSTEM.md禁止事項チェック
5. 日本語UI品質

## 現状
- create-next-appの初期状態
- framer-motion, next-themes, lucide-reactはインストール済み

## 実装内容

### 1. ダークモード設定（next-themes）
- src/app/layout.tsxにThemeProviderを追加
- lang="ja"に変更
- metadataを「デイリーノイズ」に更新

### 2. メインページ（page.tsx）の実装
UXデザインの画面1: ウェルカム画面を実装:
- Coffeeアイコン（size=48, strokeWidth=1.5）
- 見出し: 「選ばなくていい。」(text-3xl font-semibold tracking-tight)
- サブテキスト: 「毎日1つ、試すことが届く。やるかどうかは、5秒で。」
- CTAボタン: 「はじめる」(rounded-full h-12 w-full)
- motion.divでスタガーアニメーション（delay: i * 0.1）

### 3. アニメーション設定
```tsx
const appleEase = [0.25, 0.46, 0.45, 0.94]

const staggerContainer = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: appleEase }
  }
}
```

### 4. レスポンシブ対応
- max-w-lgでセンタリング
- px-6でパディング
- 375px幅で確認（モバイルファースト）
- text-3xl → sm:text-4xl でスケール

### 5. DESIGN_SYSTEM.md準拠
- rounded-full ボタン
- h-12 タップターゲット
- bg-background/80 backdrop-blur-xl ヘッダー
- 日本語UI（翻訳くさくない自然な日本語）
- グラデーション禁止
- shadow-lg以上禁止

## 確認コマンド
```bash
npm run build  # エラーがないこと
npm run lint   # lintエラーがないこと
```

## 注意
- 機能実装は最小限（ウェルカム画面のみ）
- アニメーションとダークモードに集中
- 日本語UI品質を重視
