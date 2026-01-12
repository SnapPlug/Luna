import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { performSecurityChecks, wrapSystemPrompt } from "@/lib/security";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const BASE_SYSTEM_PROMPT = `당신은 Luna, AI 마케팅 콘텐츠 변환 전문가입니다.
사용자가 제공하는 스레드/원본 콘텐츠를 분석하고, X(트위터), 링크드인, 뉴스레터 3개 채널로 변환합니다.

## 핵심 규칙

### 톤앤매너
- "요"체 사용 (링크드인은 "입니다" 혼용 가능)
- 중학생도 이해할 수 있는 쉬운 말
- 친근하고 겸손하게

### 금지 표현 (절대 사용 금지)
- "혁신적인", "획기적인", "놀라운"
- "게임체인저", "패러다임"
- "무한한 가능성", "새로운 지평"
- "반드시 ~해야 합니다"

### 권장 표현
- 구체적 수치: "30분 → 5분"
- 실제 경험: "저도 처음엔 헷갈렸는데요"
- 솔직한 한계: "만능은 아니에요"

## 채널별 규격

### X (트위터)
- 280자 이내
- 임팩트 있는 첫 줄
- 캐주얼한 톤

### 링크드인
- 800~1,300자
- 전문적 + 친근한 밸런스
- 해시태그 3~5개 포함
- 줄바꿈으로 가독성 확보

### 뉴스레터
- 1,500~3,000자
- 스토리텔링 구조
- 소제목 필수
- 회신 유도 CTA 포함

## 출력 형식
반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력합니다:
{
  "analysis": {
    "core_message": "핵심 메시지 한 줄",
    "hook_pattern": "사용된 훅 패턴 (story/question/number/shock/secret/contrast)"
  },
  "x": "X 콘텐츠 (280자 이내)",
  "linkedin": "링크드인 콘텐츠 (800~1,300자, 해시태그 포함)",
  "newsletter": "뉴스레터 콘텐츠 (1,500~3,000자)"
}`;

// 방어적 시스템 프롬프트 적용
const SYSTEM_PROMPT = wrapSystemPrompt(BASE_SYSTEM_PROMPT);

export async function POST(request: Request) {
  try {
    // 요청 본문 파싱
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "잘못된 JSON 형식입니다." },
        { status: 400 }
      );
    }

    const { content } = body;

    // 종합 보안 검사 (인증 + Rate Limiting + 입력 검증 + 프롬프트 인젝션 탐지)
    const securityCheck = await performSecurityChecks(request, {
      requireAuth: true,
      rateLimit: { maxRequests: 10, windowMs: 60000 }, // 분당 10회
      validateContent: true,
      content,
    });

    if (!securityCheck.passed) {
      return securityCheck.response;
    }

    // API 키 확인
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "API 키가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // 정제된 콘텐츠 사용
    const sanitizedContent = securityCheck.sanitizedContent || content;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `다음 원본 콘텐츠를 X, 링크드인, 뉴스레터로 변환해주세요:

${sanitizedContent}`,
        },
      ],
      system: SYSTEM_PROMPT,
    });

    // 응답에서 텍스트 추출
    const responseText = message.content[0].type === "text"
      ? message.content[0].text
      : "";

    // JSON 파싱
    let parsedResponse;
    try {
      // JSON 블록 추출 (```json ... ``` 형식일 경우)
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : responseText;
      parsedResponse = JSON.parse(jsonStr.trim());
    } catch {
      // JSON 파싱 실패 시 원본 텍스트로 대체
      parsedResponse = {
        x: "변환 중 오류가 발생했습니다.",
        linkedin: "변환 중 오류가 발생했습니다.",
        newsletter: "변환 중 오류가 발생했습니다.",
        analysis: {
          core_message: "분석 실패",
          hook_pattern: "unknown",
        },
      };
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    // 에러 로깅 (민감 정보 제외)
    console.error("API Error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
