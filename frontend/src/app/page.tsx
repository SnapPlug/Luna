"use client";

import { useState } from "react";
import Image from "next/image";
import MobileFrame from "@/components/MobileFrame";
import InputPanel from "@/components/InputPanel";
import OutputPanel from "@/components/OutputPanel";
import { analyzeContent, saveToNotion, publishToSocial } from "@/lib/api";

interface ImprovedSource {
  content: string;
  changes: Array<{
    type: string;
    before: string;
    after: string;
  }>;
  hook_options: {
    question: string;
    number: string;
    shock: string;
  };
}

interface AnalysisResult {
  linkedin: string;
  x: string;
  newsletter: string;
  analysis?: {
    core_message: string;
    hook_pattern: string;
  };
  improved_source?: ImprovedSource;
}

export default function Home() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; url?: string } | null>(null);
  const [publishStatus, setPublishStatus] = useState<{ success: boolean; message?: string } | null>(null);
  const [viewMode, setViewMode] = useState<"before" | "after">("before");

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

    const response = await analyzeContent(content);

    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setResults(response.data);
    }

    setIsLoading(false);
  };

  const handleSaveToNotion = async () => {
    if (!results) return;

    setIsSaving(true);
    setSaveStatus(null);

    // 제목 추출 (첫 줄 또는 첫 50자)
    const title = content.split("\n")[0].slice(0, 50) || "Luna 변환 결과";

    const response = await saveToNotion({
      title,
      source: content,
      x: results.x,
      linkedin: results.linkedin,
      newsletter: results.newsletter,
    });

    if (response.error) {
      setSaveStatus({ success: false });
      setError(response.error);
    } else if (response.data) {
      setSaveStatus({ success: true, url: response.data.url });
    }

    setIsSaving(false);
  };

  const handlePublishToX = async () => {
    if (!results?.x) return;

    setIsPublishing(true);
    setPublishStatus(null);

    const response = await publishToSocial({
      content: results.x,
      mode: "x",
    });

    if (response.error) {
      setPublishStatus({ success: false, message: response.error });
      setError(response.error);
    } else if (response.data) {
      setPublishStatus({ success: true, message: response.data.message });
    }

    setIsPublishing(false);
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
        {/* 1. 입력 패널 (Before/After 토글) */}
        <MobileFrame
          title={results?.improved_source ? (viewMode === "before" ? "Before" : "After ✨") : "원본 입력"}
          icon="📝"
          color={viewMode === "after" && results?.improved_source ? "green" : "blue"}
        >
          <div className="flex flex-col h-full">
            {/* Before/After 토글 버튼 */}
            {results?.improved_source && (
              <div className="flex mb-3 bg-[#1a1a1a] rounded-lg p-1">
                <button
                  onClick={() => setViewMode("before")}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    viewMode === "before"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Before
                </button>
                <button
                  onClick={() => setViewMode("after")}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    viewMode === "after"
                      ? "bg-green-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  After ✨
                </button>
              </div>
            )}

            {/* Before 모드: 입력 패널 */}
            {viewMode === "before" && (
              <InputPanel
                content={content}
                setContent={setContent}
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                error={error}
              />
            )}

            {/* After 모드: 개선된 원본 표시 */}
            {viewMode === "after" && results?.improved_source && (
              <div className="flex flex-col h-full">
                {/* 개선된 콘텐츠 */}
                <div className="flex-1 mb-4 overflow-auto">
                  <div className="input-area w-full h-full min-h-[300px] p-4 rounded-xl text-white text-sm whitespace-pre-wrap">
                    {results.improved_source.content}
                  </div>
                </div>

                {/* 변경 사항 */}
                {results.improved_source.changes.length > 0 && (
                  <div className="mb-4 p-3 bg-[#1a1a1a] rounded-lg">
                    <h4 className="text-xs font-semibold text-gray-400 mb-2">📝 주요 변경</h4>
                    {results.improved_source.changes.slice(0, 2).map((change, i) => (
                      <div key={i} className="text-xs mb-2 last:mb-0">
                        <div className="text-red-400 line-through opacity-70">{change.before}</div>
                        <div className="text-green-400">→ {change.after}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 훅 옵션 */}
                {results.improved_source.hook_options && (
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <h4 className="text-xs font-semibold text-gray-400 mb-2">💡 대안 훅 옵션</h4>
                    <div className="space-y-1 text-xs">
                      {results.improved_source.hook_options.question && (
                        <div className="text-blue-400">Q: {results.improved_source.hook_options.question}</div>
                      )}
                      {results.improved_source.hook_options.number && (
                        <div className="text-yellow-400">#: {results.improved_source.hook_options.number}</div>
                      )}
                      {results.improved_source.hook_options.shock && (
                        <div className="text-red-400">!: {results.improved_source.hook_options.shock}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* 개선된 버전 복사 버튼 */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(results.improved_source?.content || "");
                  }}
                  className="mt-3 w-full py-2 px-4 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-all"
                >
                  개선된 버전 복사
                </button>
              </div>
            )}
          </div>
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

      {/* 액션 버튼들 */}
      {results && (
        <div className="mt-8 max-w-[1600px] mx-auto space-y-4">
          {/* X 포스팅 버튼 */}
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">𝕏 X에 자동 포스팅</h3>
                <p className="text-sm text-gray-400">변환된 콘텐츠를 X에 바로 게시합니다</p>
              </div>
              <div className="flex items-center gap-3">
                {publishStatus?.success && (
                  <span className="text-sm text-green-400">
                    {publishStatus.message}
                  </span>
                )}
                {publishStatus && !publishStatus.success && (
                  <span className="text-sm text-red-400">
                    {publishStatus.message}
                  </span>
                )}
                <button
                  onClick={handlePublishToX}
                  disabled={isPublishing}
                  className={`px-6 py-2.5 rounded-lg font-medium text-white transition-all
                    ${isPublishing
                      ? "bg-gray-700 cursor-not-allowed"
                      : publishStatus?.success
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-black border border-gray-600 hover:bg-gray-900"
                    }`}
                >
                  {isPublishing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      포스팅 중...
                    </span>
                  ) : publishStatus?.success ? (
                    "✓ 게시됨"
                  ) : (
                    "X에 게시"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Notion 저장 버튼 */}
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
