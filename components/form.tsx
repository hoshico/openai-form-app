"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle } from "lucide-react";
import { ChatWindow } from "./chat-window";

export default function Form() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    topic: "",
    summary: "",
    content: "",
  });

  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("フォームデータ:", formData);
  };

  const handleFormUpdate = (newFormData: typeof formData) => {
    setFormData(newFormData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            記事作成フォーム
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="記事のタイトルを入力してください"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">スラッグ</Label>
              <Input
                id="slug"
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="URL用のスラッグを入力してください"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">トピック</Label>
              <Select
                value={formData.topic}
                onValueChange={(value) =>
                  setFormData({ ...formData, topic: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="トピックを選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rice">米</SelectItem>
                  <SelectItem value="pesticide">農薩</SelectItem>
                  <SelectItem value="activity">活動</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">概要</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
                placeholder="記事の概要を入力してください"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">内容</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="記事の詳細な内容を入力してください"
                rows={8}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              記事を作成
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ヘルプアイコン */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-gray-200 hover:bg-gray-300 rounded-full p-2 shadow-md transition-all duration-200"
        aria-label="ヘルプ"
      >
        <HelpCircle className="h-5 w-5 text-gray-600" />
      </button>

      {/* AIチャットウィンドウ */}
      <ChatWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onFormUpdate={handleFormUpdate}
        currentFormData={formData}
      />
    </div>
  );
}
