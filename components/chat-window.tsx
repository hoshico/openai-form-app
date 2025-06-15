"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, X } from "lucide-react";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onFormUpdate?: (formData: {
    title: string;
    slug: string;
    topic: string;
    summary: string;
    content: string;
  }) => void;
  currentFormData: {
    title: string;
    slug: string;
    topic: string;
    summary: string;
    content: string;
  };
}

export function ChatWindow({
  isOpen,
  onClose,
  onFormUpdate,
  currentFormData,
}: ChatWindowProps) {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user" as const, content: inputMessage },
    ];
    setMessages(newMessages);
    setInputMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          formData: currentFormData,
        }),
      });

      if (!response.ok) {
        throw new Error("APIリクエストに失敗しました");
      }

      const data = await response.json();

      // フォームの更新情報がある場合は処理
      if (data.formUpdate) {
        onFormUpdate?.(data.formUpdate);
      }

      setMessages([
        ...newMessages,
        { role: "assistant" as const, content: data.message },
      ]);
    } catch (error) {
      console.error("エラーが発生しました:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant" as const,
          content: "申し訳ありません。エラーが発生しました。",
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
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
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="メッセージを入力... (Shift + Enterで改行)"
          className="flex-1 resize-none"
          rows={3}
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
