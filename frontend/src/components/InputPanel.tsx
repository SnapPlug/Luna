"use client";

interface InputPanelProps {
  content: string;
  setContent: (content: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function InputPanel({
  content,
  setContent,
  onAnalyze,
  isLoading,
  error,
}: InputPanelProps) {
  const charCount = content.length;

  return (
    <div className="flex flex-col h-full">
      {/* 입력 영역 */}
      <div className="flex-1 mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="스레드 원본 텍스트를 입력하세요..."
          className="input-area w-full h-full min-h-[400px] p-4 rounded-xl text-white text-sm resize-none placeholder:text-gray-500"
          disabled={isLoading}
        />
      </div>

      {/* 글자 수 & 에러 */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs">
          <span className={`${charCount < 50 ? "text-yellow-500" : "text-gray-400"}`}>
            {charCount}자 {charCount < 50 && "(최소 50자)"}
          </span>
          {error && (
            <span className="text-red-400">{error}</span>
          )}
        </div>
      </div>

      {/* 변환 버튼 */}
      <button
        onClick={onAnalyze}
        disabled={isLoading || content.length < 50}
        className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all
          ${isLoading || content.length < 50
            ? "bg-gray-700 cursor-not-allowed opacity-50"
            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
          }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            분석 중...
          </span>
        ) : (
          "Luna로 변환하기"
        )}
      </button>

      {/* 도움말 */}
      <p className="mt-3 text-center text-xs text-gray-500">
        입력한 콘텐츠가 X, 링크드인, 뉴스레터로 변환됩니다
      </p>
    </div>
  );
}
