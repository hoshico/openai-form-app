"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChatDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatDialog({ isOpen, onOpenChange }: ChatDialogProps) {
  const [messages, setMessages] = useState<
    Array<{
      role: "user" | "assistant";
      content: string;
    }>
  >([
    {
      role: "assistant",
      content:
        "こんにちは！フォーム入力についてお手伝いできることはありますか？",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // ユーザーメッセージを追加
    const newMessages: Array<{
      role: "user" | "assistant";
      content: string;
    }> = [...messages, { role: "user", content: inputMessage }];
    setMessages(newMessages);
    setInputMessage("");

    // AIの応答をシミュレート（実際の実装ではAPIを呼び出す）
    setTimeout(() => {
      let response = "";
      if (inputMessage.includes("タイトル")) {
        response =
          "タイトルは記事の内容を簡潔に表現するものです。読者が興味を持つような魅力的なタイトルを考えてみてください。";
      } else if (inputMessage.includes("スラッグ")) {
        response =
          "スラッグはURLの一部として使用されます。英数字、ハイフン、アンダースコアを使用し、スペースは使わないようにしてください。";
      } else if (inputMessage.includes("トピック")) {
        response =
          "トピックは記事のカテゴリを示します。「米」「農薩」「活動」から最も関連性の高いものを選択してください。";
      } else {
        response =
          "ご質問ありがとうございます。フォーム入力についてさらに詳しくお知りになりたい点はありますか？";
      }
      setMessages([...newMessages, { role: "assistant", content: response }]);
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>AIアシスタント</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="border-t p-4 flex gap-2"
          >
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="メッセージを入力..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
