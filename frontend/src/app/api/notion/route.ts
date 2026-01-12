import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID!;

// 저장하기
export async function POST(request: Request) {
  try {
    const { title, source, x, linkedin, newsletter } = await request.json();

    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      return NextResponse.json(
        { error: "Notion API 설정이 필요합니다." },
        { status: 500 }
      );
    }

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Title: {
          title: [{ text: { content: title || "Luna 변환 결과" } }],
        },
        Date: {
          date: { start: new Date().toISOString().split("T")[0] },
        },
        Source: {
          rich_text: [{ text: { content: (source || "").slice(0, 2000) } }],
        },
        X: {
          rich_text: [{ text: { content: (x || "").slice(0, 2000) } }],
        },
        LinkedIn: {
          rich_text: [{ text: { content: (linkedin || "").slice(0, 2000) } }],
        },
        Newsletter: {
          rich_text: [{ text: { content: (newsletter || "").slice(0, 2000) } }],
        },
      },
    });

    return NextResponse.json({
      success: true,
      pageId: response.id,
      url: `https://notion.so/${response.id.replace(/-/g, "")}`
    });
  } catch (error) {
    console.error("Notion API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Notion 저장 중 오류가 발생했습니다.", details: errorMessage },
      { status: 500 }
    );
  }
}

// 히스토리 가져오기
export async function GET() {
  try {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Title?.title?.[0]?.text?.content || "제목 없음",
      date: page.properties.Date?.date?.start || "",
      url: `https://notion.so/${page.id.replace(/-/g, "")}`,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Notion API Error:", error);
    return NextResponse.json(
      { error: "히스토리 로드 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
