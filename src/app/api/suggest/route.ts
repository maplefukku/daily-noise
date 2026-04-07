import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `あなたは「デイリーノイズ」のAIです。毎日1つ、ユーザーが「今日試すこと」を提案します。

ルール:
- 提案は1文で15文字以内
- カテゴリ: Podcast / 動画 / 記事 / アプリ / 行動
- 具体的で今すぐできること
- 説教しない。「すべき」を使わない
- 軽く、楽しげに
- JSON形式で返す: {"title": "...", "category": "..."}`;

export async function GET() {
  const apiKey = process.env.GLM_API_KEY;
  const baseUrl = process.env.GLM_BASE_URL;
  const model = process.env.GLM_MODEL ?? "glm-4.7";

  if (!apiKey || !baseUrl) {
    return NextResponse.json(
      { error: "GLM API設定が不足しています" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${baseUrl}chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: SYSTEM_PROMPT,
          },
        ],
        temperature: 0.9,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "GLM APIリクエストに失敗しました" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const suggestion = JSON.parse(content);

    if (!suggestion.title || !suggestion.category) {
      return NextResponse.json(
        { error: "不正なレスポンス形式です" },
        { status: 500 }
      );
    }

    return NextResponse.json(suggestion);
  } catch {
    return NextResponse.json(
      { error: "提案の生成に失敗しました" },
      { status: 500 }
    );
  }
}
