import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luna - AI 마케팅 콘텐츠 자동화",
  description: "스레드 콘텐츠를 X, 링크드인, 뉴스레터로 자동 변환",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
