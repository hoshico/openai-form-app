"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X } from "lucide-react";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // ユーザーメッセージを追加
    const newMessages: Array<{
      role: "user" | "assistant";
      content: string;
    }> = [...messages, { role: "user", content: inputMessage }];
    setMessages(newMessages);
    setInputMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) {
        throw new Error("APIリクエストに失敗しました");
      }

      const data = await response.json();
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      console.error("エラーが発生しました:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "申し訳ありません。エラーが発生しました。",
        },
      ]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-lg flex flex-col border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">AIアシスタント</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

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

      <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
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
  );
}
