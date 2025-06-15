import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `あなたはフォーム入力のアシスタントです。
ユーザーの要望に応じて、フォームの内容を更新することができます。

以下のツールを使用して、フォームの内容を更新してください：

1. updateForm: フォームの内容を更新するツール
   - title: タイトル
   - slug: スラッグ
   - topic: トピック
   - summary: 概要
   - content: 本文

フォームの更新が必要な場合は、必ずupdateFormツールを使用してください。
ツールを使用する場合は、以下の形式で応答してください：

<tool>
updateForm
{
  "title": "新しいタイトル",
  "slug": "新しいスラッグ",
  "topic": "新しいトピック",
  "summary": "新しい概要",
  "content": "新しい本文"
}
</tool>

ツールを使用しない場合は、通常のテキストメッセージとして応答してください。`;

export async function POST(req: Request) {
  try {
    const { message: userMessage, formData } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `${SYSTEM_PROMPT}\n\n現在のフォームの内容：\n${JSON.stringify(
            formData,
            null,
            2
          )}`,
        },
        { role: "user", content: userMessage },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "updateForm",
            description: "フォームの内容を更新します",
            parameters: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "フォームのタイトル",
                },
                slug: {
                  type: "string",
                  description: "フォームのスラッグ",
                },
                topic: {
                  type: "string",
                  description: "フォームのトピック",
                },
                summary: {
                  type: "string",
                  description: "フォームの概要",
                },
                content: {
                  type: "string",
                  description: "フォームの本文",
                },
              },
              required: ["title", "slug", "topic", "summary", "content"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    const assistantMessage = response.choices[0].message;
    const toolCalls = assistantMessage.tool_calls;

    if (toolCalls && toolCalls.length > 0) {
      const toolCall = toolCalls[0];
      if (toolCall.function.name === "updateForm") {
        const formUpdate = JSON.parse(toolCall.function.arguments);
        return NextResponse.json({
          message: "フォームを更新しました。",
          formUpdate,
        });
      }
    }

    return NextResponse.json({
      message: assistantMessage.content,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
