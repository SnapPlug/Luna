"use client";

import { useState } from "react";

interface OutputPanelProps {
  platform: "x" | "linkedin" | "newsletter";
  content: string;
  isLoading: boolean;
  maxLength: number;
}

const platformConfig = {
  x: {
    name: "X",
    icon: "𝕏",
    color: "text-white",
    bgColor: "bg-black",
    placeholder: "X 콘텐츠가 여기에 표시됩니다\n\n280자 이내의 임팩트 있는 콘텐츠로 변환됩니다.",
  },
  linkedin: {
    name: "LinkedIn",
    icon: "in",
    color: "text-blue-400",
    bgColor: "bg-[#0a66c2]/10",
    placeholder: "링크드인 콘텐츠가 여기에 표시됩니다\n\n800~1,300자의 전문적이면서 친근한 톤으로 변환됩니다.",
  },
  newsletter: {
    name: "Newsletter",
    icon: "📧",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    placeholder: "뉴스레터 콘텐츠가 여기에 표시됩니다\n\n1,500~3,000자의 깊이 있는 스토리텔링으로 변환됩니다.",
  },
};

export default function OutputPanel({
  platform,
  content,
  isLoading,
  maxLength,
}: OutputPanelProps) {
  const [copied, setCopied] = useState(false);
  const config = platformConfig[platform];
  const charCount = content.length;

  const handleCopy = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-3">
        <div className={`text-xs px-2 py-1 rounded-full ${config.bgColor} ${config.color}`}>
          {charCount > 0 ? `${charCount}자` : "대기 중"}
        </div>
        {content && (
          <button
            onClick={handleCopy}
            className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            {copied ? "✓ 복사됨" : "복사"}
          </button>
        )}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 relative">
        {isLoading ? (
          // 로딩 상태
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="flex gap-1 mb-3">
              <div className="w-2 h-2 bg-gray-500 rounded-full loading-pulse" style={{ animationDelay: "0s" }} />
              <div className="w-2 h-2 bg-gray-500 rounded-full loading-pulse" style={{ animationDelay: "0.2s" }} />
              <div className="w-2 h-2 bg-gray-500 rounded-full loading-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
            <span className="text-sm">변환 중...</span>
          </div>
        ) : content ? (
          // 콘텐츠 있음
          <div className="h-full">
            <div className="bg-[#1a1a1a] rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
              {content}
            </div>

            {/* 글자 수 경고 */}
            {charCount > maxLength && (
              <div className="mt-2 text-xs text-yellow-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                권장 길이({maxLength}자) 초과
              </div>
            )}
          </div>
        ) : (
          // 빈 상태
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500 px-4">
              <div className="text-4xl mb-3 opacity-30">{config.icon}</div>
              <p className="text-sm whitespace-pre-wrap">{config.placeholder}</p>
            </div>
          </div>
        )}
      </div>

      {/* 플랫폼별 가이드 */}
      <div className="mt-4 pt-3 border-t border-gray-800">
        <div className="text-xs text-gray-500 flex justify-between">
          <span>권장: {maxLength === 280 ? "~280자" : maxLength === 1300 ? "800~1,300자" : "1,500~3,000자"}</span>
          <span className={config.color}>{config.name}</span>
        </div>
      </div>
    </div>
  );
}
