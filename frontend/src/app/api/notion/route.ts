import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { performSecurityChecks, validateAndSanitizeInput } from "@/lib/security";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID!;

// 최대 저장 길이 제한
const MAX_FIELD_LENGTH = 2000;

/**
 * 문자열 필드 정제 및 길이 제한
 */
function sanitizeField(value: unknown, maxLength: number = MAX_FIELD_LENGTH): string {
  if (typeof value !== "string") {
    return "";
  }
  // 제어 문자 제거 및 길이 제한
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").slice(0, maxLength);
}

// 저장하기
export async function POST(request: Request) {
  try {
    // 종합 보안 검사 (인증 + Rate Limiting)
    const securityCheck = await performSecurityChecks(request, {
      requireAuth: true,
      rateLimit: { maxRequests: 20, windowMs: 60000 }, // 분당 20회
      validateContent: false, // 개별 필드 검증으로 대체
    });

    if (!securityCheck.passed) {
      return securityCheck.response;
    }

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

    const { title, source, x, linkedin, newsletter } = body;

    // 필수 필드 검증
    if (!source && !x && !linkedin && !newsletter) {
      return NextResponse.json(
        { error: "저장할 콘텐츠가 없습니다." },
        { status: 400 }
      );
    }

    // source 필드 최소 길이 검증 (원본이 있는 경우)
    if (source) {
      const sourceValidation = validateAndSanitizeInput(source);
      if (!sourceValidation.valid) {
        return NextResponse.json(
          { error: sourceValidation.error },
          { status: sourceValidation.statusCode }
        );
      }
    }

    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      return NextResponse.json(
        { error: "Notion API 설정이 필요합니다." },
        { status: 500 }
      );
    }

    // 필드 정제
    const sanitizedTitle = sanitizeField(title, 200) || "Luna 변환 결과";
    const sanitizedSource = sanitizeField(source);
    const sanitizedX = sanitizeField(x);
    const sanitizedLinkedin = sanitizeField(linkedin);
    const sanitizedNewsletter = sanitizeField(newsletter);

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Title: {
          title: [{ text: { content: sanitizedTitle } }],
        },
        Date: {
          date: { start: new Date().toISOString().split("T")[0] },
        },
        Source: {
          rich_text: [{ text: { content: sanitizedSource } }],
        },
        X: {
          rich_text: [{ text: { content: sanitizedX } }],
        },
        LinkedIn: {
          rich_text: [{ text: { content: sanitizedLinkedin } }],
        },
        Newsletter: {
          rich_text: [{ text: { content: sanitizedNewsletter } }],
        },
      },
    });

    return NextResponse.json({
      success: true,
      pageId: response.id,
      url: `https://notion.so/${response.id.replace(/-/g, "")}`
    });
  } catch (error) {
    // 에러 로깅 (민감 정보 제외)
    console.error("Notion API Error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Notion 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 히스토리 가져오기
export async function GET(request: Request) {
  try {
    // 종합 보안 검사 (인증 + Rate Limiting)
    const securityCheck = await performSecurityChecks(request, {
      requireAuth: true,
      rateLimit: { maxRequests: 30, windowMs: 60000 }, // 분당 30회 (읽기는 더 관대하게)
      validateContent: false,
    });

    if (!securityCheck.passed) {
      return securityCheck.response;
    }

    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      return NextResponse.json(
        { error: "Notion API 설정이 필요합니다." },
        { status: 500 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion as any).databases.query({
      database_id: databaseId,
      sorts: [{ property: "Date", direction: "descending" }],
      page_size: 20,
    });

    // 최소한의 정보만 반환 (민감 정보 노출 방지)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Title?.title?.[0]?.text?.content || "제목 없음",
      date: page.properties.Date?.date?.start || "",
      // URL은 인증된 사용자에게만 제공
      url: `https://notion.so/${page.id.replace(/-/g, "")}`,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Notion API Error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "히스토리 로드 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
