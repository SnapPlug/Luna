"use client";

import { useState } from "react";
import Image from "next/image";
import MobileFrame from "@/components/MobileFrame";
import InputPanel from "@/components/InputPanel";
import OutputPanel from "@/components/OutputPanel";

interface AnalysisResult {
  linkedin: string;
  x: string;
  newsletter: string;
  analysis?: {
    core_message: string;
    hook_pattern: string;
  };
}

export default function Home() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError("스레드 원본 텍스트를 입력해주세요.");
      return;
    }

    if (content.length < 50) {
      setError("콘텐츠가 너무 짧아요. 최소 50자 이상 필요해요.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("분석 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-6">
      {/* 헤더 */}
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-1">
            <Image
              src="/luna-avatar.png"
              alt="Luna"
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-white">
            AI 마케팅 콘텐츠 책임자, Luna
          </h1>
        </div>
        <p className="text-gray-400">
          Threads 콘텐츠를 X, 링크드인, 뉴스레터로 자동 변환
        </p>
      </header>

      {/* 4개 모바일 화면 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
        {/* 1. 입력 패널 */}
        <MobileFrame title="원본 입력" icon="📝" color="blue">
          <InputPanel
            content={content}
            setContent={setContent}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            error={error}
          />
        </MobileFrame>

        {/* 2. X 출력 */}
        <MobileFrame title="X" icon="𝕏" color="gray">
          <OutputPanel
            platform="x"
            content={results?.x || ""}
            isLoading={isLoading}
            maxLength={280}
          />
        </MobileFrame>

        {/* 3. 링크드인 출력 */}
        <MobileFrame title="LinkedIn" icon="in" color="blue">
          <OutputPanel
            platform="linkedin"
            content={results?.linkedin || ""}
            isLoading={isLoading}
            maxLength={1300}
          />
        </MobileFrame>

        {/* 4. 뉴스레터 출력 */}
        <MobileFrame title="Newsletter" icon="📧" color="purple">
          <OutputPanel
            platform="newsletter"
            content={results?.newsletter || ""}
            isLoading={isLoading}
            maxLength={3000}
          />
        </MobileFrame>
      </div>

     

      {/* 푸터 */}
      <footer className="text-center mt-12 text-gray-500 text-sm">
        Powered by SnapPlug
      </footer>
    </main>
  );
}
