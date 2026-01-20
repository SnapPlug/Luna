import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const correctPassword = process.env.LUNA_ACCESS_PASSWORD;

    if (!correctPassword) {
      return NextResponse.json(
        { error: "서버 설정 오류: 비밀번호가 설정되지 않았습니다" },
        { status: 500 }
      );
    }

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true });

      // 쿠키에 인증 토큰 저장 (7일간 유효)
      response.cookies.set("luna_auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7일
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json(
        { error: "비밀번호가 올바르지 않습니다" },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "요청 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
