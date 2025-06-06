import { NextResponse } from "next/server";
// import { Agent, run } from "@openai/agents";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // OpenAI Agents SDKを使用する実装（コメントアウト）
    /*
    const agent = new Agent({
      name: "FormAssistant",
      instructions: "あなたはフォーム入力のアシスタントです。ユーザーの質問に丁寧に答えてください。",
    });

    const result = await run(agent, message);
    return NextResponse.json({ message: result.finalOutput });
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
