/**
 * Luna API Client
 * 인증 헤더가 포함된 API 호출을 처리합니다.
 */

// API 키 (환경 변수에서 가져옴)
const API_KEY = process.env.NEXT_PUBLIC_LUNA_API_KEY;

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/**
 * 인증 헤더가 포함된 fetch 래퍼
 */
async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // API 키가 설정되어 있으면 Authorization 헤더 추가
  if (API_KEY) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${API_KEY}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

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

interface AnalyzeResult {
  linkedin: string;
  x: string;
  newsletter: string;
  analysis?: {
    core_message: string;
    hook_pattern: string;
  };
  improved_source?: ImprovedSource;
}

/**
 * 콘텐츠 분석 및 변환 API 호출
 */
export async function analyzeContent(content: string): Promise<ApiResponse<AnalyzeResult>> {
  try {
    const response = await fetchWithAuth("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ content }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "분석 중 오류가 발생했습니다." };
    }

    return { data };
  } catch (error) {
    console.error("Analyze API Error:", error);
    return { error: "서버 연결에 실패했습니다." };
  }
}

interface SaveToNotionParams {
  title: string;
  source: string;
  x: string;
  linkedin: string;
  newsletter: string;
}

interface NotionSaveResult {
  success: boolean;
  pageId: string;
  url: string;
}

/**
 * Notion에 저장 API 호출
 */
export async function saveToNotion(
  params: SaveToNotionParams
): Promise<ApiResponse<NotionSaveResult>> {
  try {
    const response = await fetchWithAuth("/api/notion", {
      method: "POST",
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "저장 중 오류가 발생했습니다." };
    }

    return { data };
  } catch (error) {
    console.error("Notion API Error:", error);
    return { error: "서버 연결에 실패했습니다." };
  }
}

interface NotionHistoryItem {
  id: string;
  title: string;
  date: string;
  url: string;
}

interface NotionHistoryResult {
  items: NotionHistoryItem[];
}

/**
 * Notion 히스토리 조회 API 호출
 */
export async function getNotionHistory(): Promise<ApiResponse<NotionHistoryResult>> {
  try {
    const response = await fetchWithAuth("/api/notion", {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "히스토리 로드 중 오류가 발생했습니다." };
    }

    return { data };
  } catch (error) {
    console.error("Notion History API Error:", error);
    return { error: "서버 연결에 실패했습니다." };
  }
}

interface PublishParams {
  content: string;
  mode: "x" | "linkedin" | "both";
}

interface PublishResult {
  success: boolean;
  message: string;
  result?: unknown;
}

/**
 * n8n을 통해 소셜 미디어에 포스팅
 */
export async function publishToSocial(
  params: PublishParams
): Promise<ApiResponse<PublishResult>> {
  try {
    const response = await fetchWithAuth("/api/publish", {
      method: "POST",
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "포스팅 중 오류가 발생했습니다." };
    }

    return { data };
  } catch (error) {
    console.error("Publish API Error:", error);
    return { error: "서버 연결에 실패했습니다." };
  }
}
