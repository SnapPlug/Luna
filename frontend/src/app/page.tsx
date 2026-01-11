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
  const [isSaving, setIsSaving] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; url?: string } | null>(null);

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
    setSaveStatus(null);

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

  const handleSaveToNotion = async () => {
    if (!results) return;

    setIsSaving(true);
    setSaveStatus(null);

    try {
      // 제목 추출 (첫 줄 또는 첫 20자)
      const title = content.split("\n")[0].slice(0, 50) || "Luna 변환 결과";

      const response = await fetch("/api/notion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          source: content,
          x: results.x,
          linkedin: results.linkedin,
          newsletter: results.newsletter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "저장 중 오류가 발생했습니다.");
      }

      setSaveStatus({ success: true, url: data.url });
    } catch (err) {
      setSaveStatus({ success: false });
      setError(err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
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

      {/* Notion 저장 버튼 */}
      {results && (
        <div className="mt-8 max-w-[1600px] mx-auto">
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">📚 히스토리 저장</h3>
                <p className="text-sm text-gray-400">변환된 콘텐츠를 Notion에 저장합니다</p>
              </div>
              <div className="flex items-center gap-3">
                {saveStatus?.success && (
                  <a
                    href={saveStatus.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Notion에서 보기 →
                  </a>
                )}
                <button
                  onClick={handleSaveToNotion}
                  disabled={isSaving}
                  className={`px-6 py-2.5 rounded-lg font-medium text-white transition-all
                    ${isSaving
                      ? "bg-gray-700 cursor-not-allowed"
                      : saveStatus?.success
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      저장 중...
                    </span>
                  ) : saveStatus?.success ? (
                    "✓ 저장됨"
                  ) : (
                    "Notion에 저장"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <footer className="text-center mt-12 text-gray-500 text-sm">
        Powered by SnapPlug
      </footer>
    </main>
  );
}
