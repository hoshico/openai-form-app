import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // OpenAI APIを使用する実装（コメントアウト）
    /*
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "あなたはフォーム入力のアシスタントです。",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    return NextResponse.json({ message: data.choices[0].message.content });
    */

    // 鸚鵡返しの実装
    return NextResponse.json({ message });
  } catch (error) {
    console.error("エラーが発生しました:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 }
    );
  }
}
